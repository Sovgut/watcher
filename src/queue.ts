import {MIN_RATE_LIMIT} from "./constants";
import {getItems} from "./database";
import {SchedulerState} from "./enums";
import {emit} from "./observer";
import {pipe} from "./pipeline";

import type {QueueEntry} from "./types";

let queue: QueueEntry[] = [];
let index = 0;
let tick = 0;
let timeoutId: number | undefined = undefined;

function calculatePercentage(value: number, maxValue: number): number {
	return (value / maxValue) * 100;
}

function startInterval() {
	return setTimeout(async () => {
		if (queue[index]) {
			if (tick >= MIN_RATE_LIMIT / 1000) {
				await dispatcher();

				tick = 0;
			} else {
				tick++;
			}

			emit("tick", Math.round(calculatePercentage(tick, MIN_RATE_LIMIT / 1000)));
		}

		timeoutId = startInterval();
	}, 1000);
}

async function dispatcher() {
	await pipe(queue[index]);

	if (!queue[index + 1]) {
		index = 0;
	} else {
		index += 1;
	}

	emit("next", queue[index], queue);
}

export function isEnabled() {
	return !!timeoutId;
}

export function enable() {
	if (!timeoutId) {
		timeoutId = startInterval();

		emit("scheduler", SchedulerState.Enabled, queue);
		emit("next", queue[index], queue);

		if (queue[index]) {
			getItems(queue[index].url).then((list) => emit("list", list, queue[index]));
		}
	}
}

export function disable() {
	if (timeoutId) {
		clearTimeout(timeoutId);
		timeoutId = undefined;

		tick = 0;

		emit("scheduler", SchedulerState.Disabled, queue);
		emit("tick", tick);
	}
}

export function addEntry(entry: QueueEntry) {
	const alreadyAdded = queue.find((e) => e.url === entry.url);

	if (!alreadyAdded) {
		queue.push({...entry});
	}

	emit("scheduler", isEnabled() ? SchedulerState.Enabled : SchedulerState.Disabled, queue);
}

export function removeEntry(entry: QueueEntry | string) {
	const url = typeof entry === "string" ? entry : entry.url;

	queue = queue.filter((e) => e.url === url);
	index = 0;

	emit("scheduler", isEnabled() ? SchedulerState.Enabled : SchedulerState.Disabled, queue);
}
