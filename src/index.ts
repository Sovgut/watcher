import * as database from "./database";
import * as observer from "./observer";
import * as queue from "./queue";

export const Watcher = {...database, ...observer, ...queue};

export {EntityStatus, Offer, Platform, SalaryFrequency, SchedulerState, WatcherStatus} from "./enums";

export type {EntityOffer, EventCallback, Price, QueueEntry, Salary} from "./types";
