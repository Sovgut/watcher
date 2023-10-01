import EventEmitter from "eventemitter3";

import type {EventCallback} from "source:types";

export class Observer {
	private emitter = new EventEmitter();

	public on<Event extends keyof EventCallback>(event: Event, callback: EventCallback[Event]): void {
		this.emitter.on(event, callback);
	}

	public once<Event extends keyof EventCallback>(event: Event, callback: EventCallback[Event]): void {
		this.emitter.once(event, callback);
	}

	public off<Event extends keyof EventCallback>(event: Event, callback: EventCallback[Event]): void {
		this.emitter.off(event, callback);
	}

	public emit<Event extends keyof EventCallback>(event: Event, data: Parameters<EventCallback[Event]>[0]): void {
		this.emitter.emit(event, data);
	}

	public listenerCount<Event extends keyof EventCallback>(event: Event): number {
		return this.emitter.listenerCount(event);
	}

	public removeAllListeners<Event extends keyof EventCallback>(event?: Event): void {
		this.emitter.removeAllListeners(event);
	}
}
