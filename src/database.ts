import localforage from "localforage";

const INSTANCES_CACHE: Record<string, LocalForage> = {};

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

export async function getItem<T = unknown>(table: string, key: string): Promise<T> {
	const instance = createInstance(table);

	return (await instance.getItem(key)) as T;
}

export async function getItems<T = unknown[]>(table: string): Promise<T> {
	const instance = createInstance(table);
	const items = [] as unknown[];

	await instance.iterate((value) => {
		items.push(value as unknown);
	});

	return items as T;
}

export async function setItem(table: string, key: string, value: unknown): Promise<void> {
	const instance = createInstance(table);

	await instance.setItem(key, value);
}

export async function removeItem(table: string, key: string): Promise<void> {
	const instance = createInstance(table);

	await instance.removeItem(key);
}

export async function clear(table: string): Promise<void> {
	const instance = createInstance(table);

	await instance.clear();
	await instance.dropInstance();

	delete INSTANCES_CACHE[table];
}

export async function length(table: string): Promise<number> {
	const instance = createInstance(table);

	return await instance.length();
}
