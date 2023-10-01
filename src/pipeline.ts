import {MIN_RATE_LIMIT} from "source:constants";
import {Platform, WatcherStatus} from "source:enums";
import {observer} from "source:instances";
import {load as OLXLoad} from "source:modules/olx";
import {SCHEDULER_QUEUE} from "source:scheduler";
import {hashUrl} from "source:utils/hash-url";
import {requestWorker} from "source:workers";

import {OffersDatabase, RateLimitDatabase} from "source:database";
import type {Offer, Resource} from "source:types";

const PLATFORMS: Record<Platform, (parent: Document) => Offer[]> = {
	[Platform.Olx]: OLXLoad,
};

export class Pipeline {
	private async isResourceRateLimited(resource: Resource): Promise<boolean> {
		const id = hashUrl(resource.url);
		const databaseInstance = new RateLimitDatabase();
		const timestamp = await databaseInstance.limits.get(id);

		if (timestamp) {
			const at = new Date(Number(timestamp));
			const diffInSeconds = Date.now() - at.getTime();

			if (diffInSeconds < MIN_RATE_LIMIT) {
				return true;
			}
		}

		await databaseInstance.limits.put({id, timestamp: Date.now()});

		return false;
	}

	public async process(resource: Resource): Promise<void> {
		try {
			const databaseInstance = new OffersDatabase(resource.url);

			if (await this.isResourceRateLimited(resource)) {
				return;
			}

			observer.emit("status", {
				status: WatcherStatus.Fetching,
				resource: resource,
				queue: SCHEDULER_QUEUE,
			});

			const html = await requestWorker.request(resource.url);
			if (!html) {
				observer.emit("status", {
					status: WatcherStatus.Error,
					resource: resource,
					queue: SCHEDULER_QUEUE,
				});

				return;
			}

			observer.emit("status", {
				status: WatcherStatus.Processing,
				resource: resource,
				queue: SCHEDULER_QUEUE,
			});

			const parser = new DOMParser();
			const offers = PLATFORMS[resource.platform](parser.parseFromString(html, "text/html"));

			observer.emit("status", {
				status: WatcherStatus.Saving,
				resource: resource,
				queue: SCHEDULER_QUEUE,
			});

			const newOffers: Offer[] = [];

			for (const offer of offers) {
				if (!(await databaseInstance.offers.get(offer.id))) {
					await databaseInstance.offers.put(offer, offer.id);

					newOffers.push(offer);
				}
			}

			{
				observer.emit("new", {
					offers: newOffers,
					resource: resource,
					queue: SCHEDULER_QUEUE,
				});
				observer.emit("status", {
					status: WatcherStatus.Idle,
					resource: resource,
					queue: SCHEDULER_QUEUE,
				});
			}
		} catch (error) {
			console.error(error);
			observer.emit("status", {
				status: WatcherStatus.Error,
				resource: resource,
				queue: SCHEDULER_QUEUE,
			});
		}
	}
}
