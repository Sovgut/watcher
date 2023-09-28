import * as AdvertParser from "./parsers/advert.offer.js";
import * as JobParser from "./parsers/job.offer.js";

import {EntityStatus, Offer} from "../../enums.js";
import {hashUrl} from "../../utils/hash-url.js";
import {detectType} from "./utils/detect-type.js";

import type {EntityOffer, Price, Salary} from "../../types.js";

export function load(parent: Document) {
	const list: EntityOffer[] = [];
	const type = detectType(parent);

	const elements = parent.querySelectorAll('[data-cy="l-card"]');
	if (!elements) {
		return [];
	}

	if (type === Offer.Job) {
		for (const element of elements) {
			list.push(new JobOffer(type, element));
		}
	}

	if (type === Offer.Advert) {
		for (const element of elements) {
			list.push(new AdvertOffer(type, element));
		}
	}

	return list;
}

class JobOffer implements EntityOffer {
	public id: string;
	public type: Offer;
	public title: string;
	public anchor: string;
	public location: string;
	public datetime: string;
	public salary: Salary;

	public status = EntityStatus.New;
	public hasMissingInfo = false;

	constructor(type: Offer, parent: Element) {
		this.type = type;

		this.anchor = JobParser.anchor(parent);
		this.title = JobParser.title(parent);
		this.location = JobParser.location(parent);
		this.salary = JobParser.salary(parent);
		this.datetime = JobParser.datetime(parent);
		this.hasMissingInfo = JobParser.test(this);

		this.id = hashUrl(this.anchor);
	}
}

class AdvertOffer implements EntityOffer {
	public id: string;
	public type: Offer;
	public title: string;
	public anchor: string;
	public location: string;
	public datetime: string;
	public price: Price;

	public status = EntityStatus.New;
	public hasMissingInfo = false;

	constructor(type: Offer, parent: Element) {
		this.type = type;

		this.anchor = AdvertParser.anchor(parent);
		this.title = AdvertParser.title(parent);
		this.location = AdvertParser.location(parent);
		this.datetime = AdvertParser.datetime(parent);
		this.price = AdvertParser.price(parent);
		this.hasMissingInfo = AdvertParser.test(this);

		this.id = hashUrl(this.anchor);
	}
}
