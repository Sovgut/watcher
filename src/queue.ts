import {MIN_RATE_LIMIT} from "./constants.js";
import {getItems} from "./database.js";
import {QueueState} from "./enums.js";
import {emit} from "./observer.js";
import {pipe} from "./pipeline.js";

import type {QueueEntry} from "./types.js";

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

		emit("queue", QueueState.Enabled, queue);
		emit("next", queue[index], queue);

		if (queue[index]) {
			getItems(queue[index].url).then((list) => emit("list", list, queue[index]));
		}
	}
}

export function disable() {
	if (timeoutId) {
		// Clears the timer
		clearTimeout(timeoutId);

		// Release the id
		timeoutId = undefined;

		// Reset the tick
		tick = 0;

		// Raise the event about disabled state and resetting an tick
		emit("queue", QueueState.Disabled, queue);
		emit("tick", tick);
	}
}

export function addEntry(entry: QueueEntry) {
	const alreadyAdded = queue.find((e) => e.url === entry.url);

	if (!alreadyAdded) {
		queue.push({...entry});
	}

	emit("queue", isEnabled() ? QueueState.Enabled : QueueState.Disabled, queue);
}

export function removeEntry(entry: QueueEntry | string) {
	const url = typeof entry === "string" ? entry : entry.url;

	queue = queue.filter((e) => e.url === url);
	index = 0;

	emit("queue", isEnabled() ? QueueState.Enabled : QueueState.Disabled, queue);
}
