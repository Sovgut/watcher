import localforage from "localforage";

const INSTANCES_CACHE: Record<string, LocalForage> = {};

/**
 * Creates a new instance of LocalForage for the specified table.
 *
 * @param {string} table The name of the table.
 * @returns {LocalForage} The instance of LocalForage.
 */
function createInstance(table: string): LocalForage {
	if (INSTANCES_CACHE[table]) {
		return INSTANCES_CACHE[table];
	}

	return (INSTANCES_CACHE[table] = localforage.createInstance({
		driver: localforage.INDEXEDDB,
		name: "@sovgut/watcher",
		storeName: table,
	}));
}

/**
 * Retrieves an item from the specified table.
 *
 * @async
 * @template T The type of item.
 * @param {string} table The name of the table.
 * @param {string} key The key of the item to retrieve.
 * @returns {Promise<T>} The retrieved item.
 */
export async function getItem<T = unknown>(table: string, key: string): Promise<T> {
	const instance = createInstance(table);

	return (await instance.getItem(key)) as T;
}

/**
 * Retrieves all items from the specified table.
 *
 * @async
 * @template T The type of items in the list.
 * @param {string} table The name of the table.
 * @returns {Promise<T[]>} An array of all items in the table.
 */
export async function getItems<T = unknown>(table: string): Promise<T[]> {
	const instance = createInstance(table);
	const items: T[] = [];

	await instance.iterate((value) => {
		items.push(value as T);
	});

	return items as T[];
}

/**
 * Sets an item in the specified table.
 *
 * @async
 * @param {string} table The name of the table.
 * @param {string} key The key of the item to set.
 * @param {*} value The value to set for the item.
 */
export async function setItem(table: string, key: string, value: unknown): Promise<void> {
	const instance = createInstance(table);

	await instance.setItem(key, value);
}

/**
 * Removes an item from the specified table.
 *
 * @async
 * @param {string} table The name of the table.
 * @param {string} key The key of the item to remove.
 */
export async function removeItem(table: string, key: string): Promise<void> {
	const instance = createInstance(table);

	await instance.removeItem(key);
}

/**
 * Clears all items from the specified table and deletes its instance of LocalForage.
 *
 * @async
 * @param {string} table The name of the table to clear.
 */
export async function clear(table: string): Promise<void> {
	const instance = createInstance(table);

	await instance.clear();
	await instance.dropInstance();

	delete INSTANCES_CACHE[table];
}

/**
 * Returns the number of items in the specified table.
 *
 * @async
 * @param {string} table The name of the table to count items for.
 * @returns {Promise<number>} The number of items in the specified table.
 */
export async function length(table: string): Promise<number> {
	const instance = createInstance(table);

	return await instance.length();
}
