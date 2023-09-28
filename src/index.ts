import * as database from "./database.js";
import * as observer from "./observer.js";
import * as queue from "./queue.js";

export const Watcher = {...database, ...observer, ...queue};

export {EntityStatus, Frequency, Offer, Platform, QueueState, Status} from "./enums.js";

export type {EntityOffer, EventCallback, Price, QueueEntry, Salary} from "./types.js";
