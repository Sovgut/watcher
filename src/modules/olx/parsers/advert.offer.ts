import {DateTime} from "luxon";

import type {EntityOffer, Price} from "../../../types.js";

export function anchor(parent: Element): string {
	const child = parent.querySelector("a");
	if (!child) {
		return String();
	}

	const href = child.getAttribute("href");
	if (!href) {
		return String();
	}

	return href;
}

export function title(parent: Element): string {
	const child = parent.querySelector("h6");
	if (!child) {
		return String();
	}

	const text = child.textContent;
	if (!text) {
		return String();
	}

	return text.trim();
}

export function location(parent: Element): string {
	const child = parent.querySelector('[data-testid="location-date"]');
	if (!child) {
		return String();
	}

	const text = child.textContent;
	if (!text) {
		return String();
	}

	const [_location] = text.split(" - ");
	if (!_location) {
		return String();
	}

	return _location.trim();
}

export function price(parent: Element): Price {
	const price: Price = {
		amount: 0,
	};

	const child = parent.querySelector('[data-testid="ad-price"]');
	if (!child) {
		return price;
	}

	const text = child.textContent;
	if (!text) {
		return price;
	}

	const match = /((\d*\s*)+)\s*(\D*)/.exec(text);
	if (!match) {
		return price;
	}

	price.amount = Number(match[1].replace(/\s/g, String()));
	price.currency = match[3].split(".")[0];

	return price;
}

export function datetime(parent: Element): string {
	const child = parent.querySelector('[data-testid="location-date"]');
	if (!child) {
		return new Date().toISOString();
	}

	const text = child.textContent;
	if (!text) {
		return new Date().toISOString();
	}

	let format = "dd MMMM yyyy";
	let [, datetime] = text.split(" - ");
	if (!datetime) {
		return new Date().toISOString();
	}

	if (datetime.includes("г.") || datetime.includes("р.")) {
		datetime = datetime.replace(" р.", String());
		datetime = datetime.replace(" г.", String());
	} else {
		datetime = datetime.replace("Сьогодні о ", String());
		datetime = datetime.replace("Сегодня в ", String());

		format = "HH:mm";
	}

	try {
		return DateTime.fromFormat(datetime, format, {locale: "uk"})
			.plus({hours: (new Date().getTimezoneOffset() / 60) * -1})
			.toJSDate()
			.toISOString();
	} catch {
		return new Date().toISOString();
	}
}

export function test(entity: EntityOffer): boolean {
	let isCorrupted = false;

	if (entity.datetime === String()) {
		isCorrupted = true;
	}

	if (entity.location === String()) {
		isCorrupted = true;
	}

	if (entity.title === String()) {
		isCorrupted = true;
	}

	if (entity.anchor === String()) {
		isCorrupted = true;
	}

	return isCorrupted;
}
