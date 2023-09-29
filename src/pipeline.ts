import {MIN_RATE_LIMIT} from "./constants";
import {getItem, getItems, setItem} from "./database";
import {Platform, Status} from "./enums";
import {load as OLXLoad} from "./modules/olx/index";
import {emit} from "./observer";

import type {EntityOffer, QueueEntry} from "./types";
import {hashUrl} from "./utils/hash-url";
import {requestWorker} from "./workers";

const PLATFORMS: Record<Platform, (parent: Document) => EntityOffer[]> = {
	[Platform.Olx]: OLXLoad,
};

export async function isLimited(entry: QueueEntry) {
	const id = hashUrl(entry.url);
	const record = await getItem<string>("rate-limit", id);

	if (record) {
		const at = new Date(Number(record));
		const diffInSeconds = Date.now() - at.getTime();

		if (diffInSeconds < MIN_RATE_LIMIT) {
			return true;
		}
	}

	await setItem("rate-limit", id, Date.now());

	return false;
}

export async function pipe(entry: QueueEntry) {
	try {
		if (await isLimited(entry)) {
			const list = await getItems(entry.url);

			return emit("list", list, entry);
		}

		emit("status", Status.Fetching, entry);

		const html = await requestWorker.request(entry.url);
		if (!html) {
			emit("status", Status.Error, entry);

			return;
		}

		emit("status", Status.Processing, entry);

		const parser = new DOMParser();
		const list = PLATFORMS[entry.platform](parser.parseFromString(html, "text/html"));

		emit("status", Status.Saving);

		const createdEntities: EntityOffer[] = [];

		for (const item of list) {
			if (!(await getItem(entry.url, item.id.toString()))) {
				await setItem(entry.url, item.id.toString(), item);

				createdEntities.push(item);
			}
		}

		{
			const list = await getItems(entry.url);

			emit("new", createdEntities, entry);
			emit("list", list, entry);
			emit("count", createdEntities.length, entry);
			emit("status", Status.Idle, entry);
		}
	} catch (error) {
		console.error(error);
		emit("status", Status.Error, entry);
	}
}
