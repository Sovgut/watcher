export enum Platform {
	Olx,
}

export enum SchedulerState {
	Disabled,
	Enabled,
}

export enum OfferStatus {
	Visited,
	New,
}

export enum WatcherStatus {
	Idle,
	Fetching,
	Processing,
	Saving,
	Error,
}

export enum OfferKind {
	Job,
	Advert,
}

export enum SalaryFrequency {
	Monthly,
	Weekly,
	Daily,
	Hourly,
}

export interface Resource {
	url: string;
	platform: Platform;
	title: string;
}

export type GetItemsFilter = {
	offset: number;
	limit: number;
};

interface QueueState {
	resource: Resource;
	queue: Resource[];
}

export interface ProgressEvent extends QueueState {
	progress: number;
}

export interface SchedulerEvent extends QueueState {
	state: SchedulerState;
}

export interface NextEvent extends QueueState {
	next: Resource;
}

export interface CountEvent extends QueueState {
	count: number;
}

export interface StatusEvent extends QueueState {
	status: WatcherStatus;
}

export interface NewEvent extends QueueState {
	offers: Offer[];
}

export interface ListEvent extends QueueState {
	offers: Offer[];
}

export type EventCallback = {
	new: (event: NewEvent) => void;
	next: (event: NextEvent) => void;
	status: (event: StatusEvent) => void;
	progress: (event: ProgressEvent) => void;
	scheduler: (event: SchedulerEvent) => void;
};

export type OfferSalary = {
	from: number;
	frequency: SalaryFrequency;
	to?: number;
	currency?: string;
};

export type OfferPrice = {
	amount: number;
	currency?: string;
};

export interface Offer {
	id: string;
	type: OfferKind;
	title: string;
	status: OfferStatus;
	anchor: string;
	location: string;
	dateTime: string;
	hasMissingInfo: boolean;
	price?: OfferPrice;
	salary?: OfferSalary;
}

export type EnableScheduler = () => void;
export type DisableScheduler = () => void;
export type QueueResource = (resource: Resource) => void;
export type DequeueResource = (resource: Resource | string) => void;

export type UseNewEventHook = () => Partial<NewEvent>;
export type UseNextEventHook = () => Partial<NextEvent>;
export type UseStatusEventHook = () => Partial<StatusEvent>;
export type UseProgressEventHook = () => Partial<ProgressEvent>;
export type UseSchedulerEventHook = () => Partial<SchedulerEvent>;
export type UseSchedulerCommandsHook = () => {enable: EnableScheduler; disable: DisableScheduler; queueResource: QueueResource; dequeueResource: DequeueResource};

export const useNewEvent: UseNewEventHook;
export const useNextEvent: UseNextEventHook;
export const useStatusEvent: UseStatusEventHook;
export const useProgressEvent: UseProgressEventHook;
export const useSchedulerEvent: UseSchedulerEventHook;
export const useSchedulerCommands: UseSchedulerCommandsHook;

export class Database {
	public async getItem(table: string, key: string): Promise<Offer | undefined>;
	public async getItems(table: string, filter?: Partial<GetItemsFilter>): Promise<Offer[]>;
	public async removeItem(table: string, key: string): Promise<void>;
	public async count(table: string): Promise<number>;
	public async clear(table: string): Promise<void>;
}

class Observer {
	public on<Event extends keyof EventCallback>(event: Event, callback: EventCallback[Event]): void;
	public once<Event extends keyof EventCallback>(event: Event, callback: EventCallback[Event]): void;
	public off<Event extends keyof EventCallback>(event: Event, callback: EventCallback[Event]): void;
	public emit<Event extends keyof EventCallback>(event: Event, data: Parameters<EventCallback[Event]>[0]): void;
	public listenerCount<Event extends keyof EventCallback>(event: Event): number;
	public removeAllListeners<Event extends keyof EventCallback>(event?: Event): void;
}

class Scheduler {
	public getState(): SchedulerState;
	public enable(): void;
	public disable(): void;
	public queueResource(resource: Resource): void;
	public dequeueResource(resource: Resource | string): void;
}

export namespace Watcher {
	export const database: Database;
	export const observer: Observer;
	export const scheduler: Scheduler;
}
