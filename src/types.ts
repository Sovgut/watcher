import type {OfferKind, OfferStatus, Platform, SalaryFrequency, SchedulerState, WatcherStatus} from "source:enums";

export interface Resource {
	url: string;
	platform: Platform;
	title: string;
}

export type GetItemsFilter = {
	offset: number;
	limit: number;
};

export type OfferSalary = {
	from: number;
	to?: number;
	currency?: string;
	frequency: SalaryFrequency;
};

export type OfferPrice = {
	amount: number;
	currency?: string;
};

export interface Offer {
	id: string;
	type: OfferKind;
	img: string;
	title: string;
	status: OfferStatus;
	anchor: string;
	location: string;
	dateTime: string;
	hasMissingInfo: boolean;
	price?: OfferPrice;
	salary?: OfferSalary;
}

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

export type EnableScheduler = () => void;
export type DisableScheduler = () => void;
export type QueueResource = (resource: Resource) => void;
export type DequeueResource = (resource: Resource | string) => void;

export type UseNewEventHook = () => Partial<NewEvent>;
export type UseNextEventHook = () => Partial<NextEvent>;
export type UseStatusEventHook = () => Partial<StatusEvent>;
export type UseProgressEventHook = () => Partial<ProgressEvent>;
export type UseSchedulerEventHook = () => Partial<SchedulerEvent>;
export type UseSchedulerCommandsHook = () => {
	enable: EnableScheduler;
	disable: DisableScheduler;
	queueResource: QueueResource;
	dequeueResource: DequeueResource;
};
