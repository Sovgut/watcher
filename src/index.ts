import {REQUEST_FUNCTION, database, observer, scheduler} from "source:instances";

// Namespace
export const Watcher = {scheduler, observer, database, REQUEST_FUNCTION};

// Enums
export {OfferKind, OfferStatus, Platform, SalaryFrequency, SchedulerState, WatcherStatus} from "source:enums";

// Hooks
export {useNewEvent} from "source:hooks/use-new-event";
export {useNextEvent} from "source:hooks/use-next-event";
export {useProgressEvent} from "source:hooks/use-progress-event";
export {useSchedulerCommands} from "source:hooks/use-scheduler-commands";
export {useSchedulerEvent} from "source:hooks/use-scheduler-event";
export {useStatusEvent} from "source:hooks/use-status-event";

// Types
export type {
	CountEvent,
	EventCallback,
	GetItemsFilter,
	ListEvent,
	NewEvent,
	NextEvent,
	Offer,
	OfferPrice,
	OfferSalary,
	ProgressEvent,
	Resource,
	SchedulerEvent,
	StatusEvent,
} from "source:types";
