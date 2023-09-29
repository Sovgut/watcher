import {EventEmitter} from "events";

import type {EventCallback} from "./types";

const instance = new EventEmitter();

export function on<Event extends keyof EventCallback>(event: Event, callback: EventCallback[Event]): void {
	instance.on(event, callback);
}

export function once<Event extends keyof EventCallback>(event: Event, callback: EventCallback[Event]): void {
	instance.once(event, callback);
}

export function off<Event extends keyof EventCallback>(event: Event, callback: EventCallback[Event]): void {
	instance.off(event, callback);
}

export function emit<Event extends keyof EventCallback>(event: Event, ...data: unknown[]): void {
	instance.emit(event, ...data);
}
