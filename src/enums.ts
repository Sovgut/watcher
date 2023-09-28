/**
 * Represents the platform of an entity.
 */
export enum Platform {
	Olx,
}

export enum QueueState {
	Disabled,
	Enabled,
}

/**
 * Represents the status of an entity.
 */
export enum EntityStatus {
	Visited,
	New,
}

/**
 * Represents the status of a process.
 */
export enum Status {
	/**
	 * The process is idle.
	 */
	Idle,

	/**
	 * The process is fetching data.
	 */
	Fetching,

	/**
	 * The process is processing data.
	 */
	Processing,

	/**
	 * The process is saving data.
	 */
	Saving,

	/**
	 * An error occurred during the process.
	 */
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
