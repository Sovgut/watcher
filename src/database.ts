import Dexie, {Table} from "dexie";
import {GetItemsFilter, Offer} from "source:types";

export class RateLimitDatabase extends Dexie {
	public limits!: Table<{id: string; timestamp: number}, string>;

	public constructor() {
		super("rate-limit");
		this.version(1).stores({
			limits: "id,timestamp",
		});
	}
}

export class OffersDatabase extends Dexie {
	public offers!: Table<Offer, string>;

	public constructor(table: string) {
		super(table);
		this.version(1).stores({
			offers: "id,type,title,status,anchor,location,dateTime,hasMissingInfo,price,salary",
		});
	}
}

export class Database {
	public async getItem(table: string, key: string): Promise<Offer | undefined> {
		const instance = new OffersDatabase(table);

		return await instance.offers.get(key);
	}

	public async getItems(table: string, filter?: Partial<GetItemsFilter>): Promise<Offer[]> {
		const instance = new OffersDatabase(table);

		if (filter) {
			let collection = instance.offers.toCollection();

			if (filter.offset) {
				collection = collection.offset(filter.offset);
			}

			if (filter.limit) {
				collection = collection.limit(filter.limit);
			}

			return await collection.toArray();
		}

		return await instance.offers.orderBy("dateTime").toArray();
	}

	public async removeItem(table: string, key: string): Promise<void> {
		const instance = new OffersDatabase(table);

		return await instance.offers.delete(key);
	}

	public async count(table: string): Promise<number> {
		const instance = new OffersDatabase(table);

		return await instance.offers.count();
	}

	public async clear(table: string): Promise<void> {
		const instance = new OffersDatabase(table);

		return await instance.offers.clear();
	}
}
