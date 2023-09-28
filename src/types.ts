import type {EntityStatus, Frequency, Offer, Platform, QueueState, Status} from "./enums.js";

export interface QueueEntry {
	url: string;
	platform: Platform;
	title: string;
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
