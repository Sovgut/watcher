import {EventEmitter} from "events";

import type {EventCallback} from "./types.js";

const instance = new EventEmitter();

/**
 * Registers an event listener for the specified event.
 *
 * @param {Event} event The event to listen to.
 * @param {EventCallback[Event]} callback The callback function to execute when the event is triggered.
 */
export function on<Event extends keyof EventCallback>(event: Event, callback: EventCallback[Event]) {
	instance.on(event, callback);
}

/**
 * Registers an event listener for the specified event that will be called only once.
 *
 * @param {Event} event The event to listen to.
 * @param {EventCallback[Event]} callback The callback function to execute when the event is triggered.
 */
export function once<Event extends keyof EventCallback>(event: Event, callback: EventCallback[Event]) {
	instance.once(event, callback);
}

/**
 * Removes an event listener for the specified event.
 *
 * @param {Event} event The event to remove the listener from.
 * @param {EventCallback[Event]} callback The callback function to remove as a listener for the event.
 */
export function off<Event extends keyof EventCallback>(event: Event, callback: EventCallback[Event]) {
	instance.off(event, callback);
}

/**
 * Emits an event with optional data.
 *
 * @param {Event} event The event to emit.
 * @param {unknown} [data] Optional data to pass along with the event emission.
 */
export function emit<Event extends keyof EventCallback>(event: Event, ...data: unknown[]) {
	instance.emit(event, ...data);
}
