import * as AdvertParser from "source:modules/olx/parsers/advert.offer";
import * as JobParser from "source:modules/olx/parsers/job.offer";

import {OfferKind, OfferStatus} from "source:enums";
import {detectType} from "source:modules/olx/utils/detect-type";
import {hashUrl} from "source:utils/hash-url";

import type {Offer, OfferPrice, OfferSalary} from "source:types";

export function load(parent: Document): Offer[] {
	const list: Offer[] = [];
	const type = detectType(parent);

	const elements = parent.querySelectorAll('[data-cy="l-card"]');
	if (!elements) {
		return [];
	}

	if (type === OfferKind.Job) {
		for (const element of elements) {
			list.push(new JobOffer(type, element));
		}
	}

	if (type === OfferKind.Advert) {
		for (const element of elements) {
			list.push(new AdvertOffer(type, element));
		}
	}

	return list;
}

class JobOffer implements Offer {
	public id: string;
	public type: OfferKind;
	public title: string;
	public anchor: string;
	public location: string;
	public dateTime: string;
	public salary: OfferSalary;

	public status = OfferStatus.New;
	public hasMissingInfo = false;

	constructor(type: OfferKind, parent: Element) {
		this.type = type;

		this.anchor = JobParser.anchor(parent);
		this.title = JobParser.title(parent);
		this.location = JobParser.location(parent);
		this.salary = JobParser.salary(parent);
		this.dateTime = JobParser.dateTime(parent);
		this.hasMissingInfo = JobParser.test(this);

		this.id = hashUrl(this.anchor);
	}
}

class AdvertOffer implements Offer {
	public id: string;
	public type: OfferKind;
	public title: string;
	public anchor: string;
	public location: string;
	public dateTime: string;
	public price: OfferPrice;

	public status = OfferStatus.New;
	public hasMissingInfo = false;

	constructor(type: OfferKind, parent: Element) {
		this.type = type;

		this.anchor = AdvertParser.anchor(parent);
		this.title = AdvertParser.title(parent);
		this.location = AdvertParser.location(parent);
		this.dateTime = AdvertParser.dateTime(parent);
		this.price = AdvertParser.price(parent);
		this.hasMissingInfo = AdvertParser.test(this);

		this.id = hashUrl(this.anchor);
	}
}
