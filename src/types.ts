import type {EntityStatus, Offer, Platform, SalaryFrequency, SchedulerState, WatcherStatus} from "./enums";

export interface QueueEntry {
	url: string;
	platform: Platform;
	title: string;
}

export type EventCallback = {
	tick: (percentage: number) => void;
	scheduler: (state: SchedulerState, total: QueueEntry[]) => void;
	next: (next: QueueEntry, total: QueueEntry[]) => void;
	count: (count: number, currentEntry: QueueEntry) => void;
	status: (status: WatcherStatus, currentEntry: QueueEntry) => void;
	new: (entities: EntityOffer[], currentEntry: QueueEntry) => void;
	list: (entities: EntityOffer[], currentEntry: QueueEntry) => void;
};

export type Salary = {
	from: number;
	frequency: SalaryFrequency;
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
