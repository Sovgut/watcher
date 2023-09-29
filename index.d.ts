/**
 * Enum representing the platforms supported by the library.
 */
export enum Platform {
	Olx,
}

/**
 * Enum representing the state of a scheduler.
 */
export enum SchedulerState {
	Disabled,
	Enabled,
}

/**
 * Enum representing the status of an entity.
 */
export enum EntityStatus {
	Visited,
	New,
}

/**
 * Enum representing the status of the Watcher library.
 */
export enum WatcherStatus {
	Idle,
	Fetching,
	Processing,
	Saving,
	Error,
}

/**
 * Enum representing the type of an offer.
 */
export enum Offer {
	Job,
	Advert,
}

/**
 * Enum representing the frequency of salary payment.
 */
export enum SalaryFrequency {
	Monthly,
	Weekly,
	Daily,
	Hourly,
}

/**
 * Represents an entry in the scheduler queue.
 */
export type QueueEntry = {
	url: string;
	title: string;
	platform: Platform;
};

/**
 * Represents the salary information for a job offer.
 */
export type Salary = {
	from: number;
	to?: number;
	currency?: string;
	frequency: Frequency;
};

/**
 * Represents the price information for an advertisement offer.
 */
export type Price = {
	amount: number;
	currency?: string;
};

/**
 * Represents the interface for a job offer entity.
 */
export interface EntityJobOffer {
	salary?: Salary;
}

/**
 * Represents the interface for an advertisement offer entity.
 */
export interface EntityAdvertOffer {
	price?: Price;
}

/**
 * Represents the parsed entity for an offer.
 * This interface combines properties from both job offers and advertisement offers,
 * providing a common structure for different offer types.
 */
export interface EntityOffer extends EntityJobOffer, EntityAdvertOffer {
	/**
	 * The unique identifier for the offer.
	 *
	 * @default String()
	 */
	id: string;

	/**
	 * The type of the offer (Job or Advert).
	 */
	type: Offer;

	/**
	 * The title of the offer.
	 *
	 * @default String()
	 */
	title: string;

	/**
	 * The status of the entity (Visited or New).
	 *
	 * @default EntityStatus.New
	 */
	status: EntityStatus;

	/**
	 * The anchor associated with the entity.
	 * This could be a reference link or identifier.
	 *
	 * @default String()
	 */
	anchor: string;

	/**
	 * The location of the offer.
	 * This represents the geographical location of the offer.
	 *
	 * @default String()
	 */
	location: string;

	/**
	 * The date and time information when the offer was posted.
	 * This is a formatted string representing date and time.
	 *
	 * @default String()
	 */
	datetime: string;

	/**
	 * Indicates whether the entity has missing information.
	 * This property is set to true if some of the properties are empty or undefined (except price and salary).
	 * It is false by default.
	 *
	 * @default false
	 */
	hasMissingInfo: boolean;
}

/**
 * Represents the callback functions for various events in the observer.
 */
export type EventCallback = {
	/**
	 * Callback for the 'tick' event.
	 * @param {number} percentage - The percentage value representing progress.
	 */
	tick: (percentage: number) => void;

	/**
	 * Callback for the 'scheduler' event.
	 * @param {SchedulerState} state - The scheduler state.
	 * @param {QueueEntry[]} total - The total queue entries.
	 */
	scheduler: (state: SchedulerState, total: QueueEntry[]) => void;

	/**
	 * Callback for the 'next' event.
	 * @param {QueueEntry} next - The next queue entry.
	 * @param {QueueEntry[]} total - The total queue entries.
	 */
	next: (next: QueueEntry, total: QueueEntry[]) => void;

	/**
	 * Callback for the 'count' event.
	 * @param {number} count - The count value.
	 * @param {QueueEntry} currentEntry - The current queue entry.
	 */
	count: (count: number, currentEntry: QueueEntry) => void;

	/**
	 * Callback for the 'status' event.
	 * @param {WatcherStatus} status - The status value.
	 * @param {QueueEntry} currentEntry - The current queue entry.
	 */
	status: (status: WatcherStatus, currentEntry: QueueEntry) => void;

	/**
	 * Callback for the 'new' event.
	 * @param {EntityOffer[]} entities - The new entities.
	 * @param {QueueEntry} currentEntry - The current queue entry.
	 */
	new: (entities: EntityOffer[], currentEntry: QueueEntry) => void;

	/**
	 * Callback for the 'list' event.
	 * @param {EntityOffer[]} entities - The list of entities.
	 * @param {QueueEntry} currentEntry - The current queue entry.
	 */
	list: (entities: EntityOffer[], currentEntry: QueueEntry) => void;
};

/**
 * The Watcher module provides functionality for web page parsing based on provided entries (platform and URL),
 * creating models of offers (such as advertisements and jobs), caching these models in IndexedDB,
 * triggering observer events that can be listened to by frontend applications,
 * offering commands to control the library's state, and providing methods for accessing the database.
 * This library is designed to assist in web scraping, data modeling, and data management within applications.
 */
export declare module Watcher {
	/**
	 * Retrieves an item from the specified database table by its key.
	 * @param {string} table - The name of the database table.
	 * @param {string} key - The key of the item to retrieve.
	 * @returns {Promise<T>} A promise that resolves to the retrieved item.
	 * @template T The type of an item.
	 */
	export function getItem<T = unknown>(table: string, key: string): Promise<T>;

	/**
	 * Retrieves all items from the specified database table.
	 * @param {string} table - The name of the database table.
	 * @returns {Promise<T>} A promise that resolves to an array of retrieved items.
	 * @template T The type of a list of items.
	 */
	export function getItems<T = unknown[]>(table: string): Promise<T>;

	/**
	 * Sets an item in the specified database table by its key.
	 * @param {string} table - The name of the database table.
	 * @param {string} key - The key of the item to set.
	 * @param {unknown} value - The value to set for the item.
	 * @returns {Promise<void>} A promise that resolves when the item is successfully set.
	 */
	export function setItem(table: string, key: string, value: unknown): Promise<void>;

	/**
	 * Removes an item from the specified database table by its key.
	 * @param {string} table - The name of the database table.
	 * @param {string} key - The key of the item to remove.
	 * @returns {Promise<void>} A promise that resolves when the item is successfully removed.
	 */
	export function removeItem(table: string, key: string): Promise<void>;

	/**
	 * Clears all items from the specified database table.
	 * @param {string} table - The name of the database table.
	 * @returns {Promise<void>} A promise that resolves when the table is successfully cleared.
	 */
	export function clear(table: string): Promise<void>;

	/**
	 * Retrieves the number of items in the specified database table.
	 * @param {string} table - The name of the database table.
	 * @returns {Promise<number>} A promise that resolves to the number of items in the table.
	 */
	export function length(table: string): Promise<number>;

	/**
	 * Adds an event listener for the specified event.
	 * @param {Event} event - The name of the event to listen for.
	 * @param {Function} callback - The callback function to execute when the event is triggered.
	 * @template Event The event name
	 */
	export function on<Event extends keyof EventCallback>(event: Event, callback: EventCallback[Event]): void;

	/**
	 * Adds a one-time event listener for the specified event.
	 * The listener will be automatically removed after being triggered once.
	 * @param {Event} event - The name of the event to listen for.
	 * @param {Function} callback - The callback function to execute when the event is triggered.
	 * @template Event The event name
	 */
	export function once<Event extends keyof EventCallback>(event: Event, callback: EventCallback[Event]): void;

	/**
	 * Removes an event listener for the specified event.
	 * @param {Event} event - The name of the event to remove the listener from.
	 * @param {Function} callback - The callback function to remove.
	 * @template Event The event name
	 */
	export function off<Event extends keyof EventCallback>(event: Event, callback: EventCallback[Event]): void;

	/**
	 * Emits (triggers) the specified event with optional data.
	 * @param {Event} event - The name of the event to trigger.
	 * @param {...unknown[]} data - Optional data to pass to the event listeners.
	 * @template Event The event name
	 */
	export function emit<Event extends keyof EventCallback>(event: Event, ...data: unknown[]): void;

	/**
	 * Checks if the scheduler is enabled.
	 * @returns {boolean} True if the scheduler is enabled, false otherwise.
	 */
	export function isEnabled(): boolean;

	/**
	 * Enables the scheduler.
	 */
	export function enable(): void;

	/**
	 * Disables the scheduler.
	 */
	export function disable(): void;

	/**
	 * Adds an entry to the scheduler queue.
	 * @param {QueueEntry} entry - The entry to add to the queue.
	 */
	export function addEntry(entry: QueueEntry): void;

	/**
	 * Removes an entry from the scheduler queue by the entry itself or its url.
	 * @param {QueueEntry|string} entry - The entry or its url to remove from the queue.
	 */
	export function removeEntry(entry: QueueEntry | string): void;
}
