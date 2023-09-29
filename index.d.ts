// Enums
export enum Platform {
	Olx,
}

export enum QueueState {
	Disabled,
	Enabled,
}

export enum EntityStatus {
	Visited,
	New,
}

export enum Status {
	Idle,
	Fetching,
	Processing,
	Saving,
	Error,
}

export enum Offer {
	Job,
	Advert,
}

export enum Frequency {
	Monthly,
	Weekly,
	Daily,
	Hourly,
}

// Types
export type QueueEntry = {
	url: string;
	platform: Platform;
	title: string;
};

export type Salary = {
	from: number;
	frequency: Frequency;
	to?: number;
	currency?: string;
};

export type Price = {
	amount: number;
	currency?: string;
};

export interface EntityJobOffer {
	salary?: Salary;
}

export interface EntityAdvertOffer {
	price?: Price;
}

export interface EntityOffer extends EntityJobOffer, EntityAdvertOffer {
	id: string;
	type: Offer;
	title: string;
	status: EntityStatus;
	anchor: string;
	location: string;
	datetime: string;
	hasMissingInfo: boolean;
}

export type EventCallback = {
	tick: (value: number) => void;
	queue: (state: QueueState, total: QueueEntry[]) => void;
	next: (next: QueueEntry, total: QueueEntry[]) => void;
	count: (count: number, entry: QueueEntry) => void;
	status: (status: Status, entry: QueueEntry) => void;
	new: (entities: EntityOffer[], entry: QueueEntry) => void;
	list: (entities: EntityOffer[], entry: QueueEntry) => void;
};

export declare module Watcher {
	// Database functions
	export function getItem<T = unknown>(table: string, key: string): Promise<T>;
	export function getItems<T = unknown>(table: string): Promise<T[]>;
	export function setItem(table: string, key: string, value: unknown): Promise<void>;
	export function removeItem(table: string, key: string): Promise<void>;
	export function clear(table: string): Promise<void>;
	export function length(table: string): Promise<number>;

	// Observer functions
	export function on<Event extends keyof EventCallback>(event: Event, callback: EventCallback[Event]): void;
	export function once<Event extends keyof EventCallback>(event: Event, callback: EventCallback[Event]): void;
	export function off<Event extends keyof EventCallback>(event: Event, callback: EventCallback[Event]): void;
	export function emit<Event extends keyof EventCallback>(event: Event, ...data: unknown[]): void;

	// Scheduler functions
	export function isEnabled(): boolean;
	export function enable(): void;
	export function disable(): void;
	export function addEntry(entry: QueueEntry): void;
	export function removeEntry(entry: QueueEntry | string): void;
}
