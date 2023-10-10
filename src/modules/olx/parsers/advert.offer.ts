import {DateTime} from "luxon";

import type {Offer, OfferPrice} from "source:types";

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

export function img(parent: Element): string {
	const child = parent.querySelector("img");
	if (!child) {
		return String();
	}

	const src = child.getAttribute("src");
	if (!src) {
		return String();
	}

	return src;
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

export function price(parent: Element): OfferPrice {
	const price: OfferPrice = {
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

export function dateTime(parent: Element): string {
	const child = parent.querySelector('[data-testid="location-date"]');
	if (!child) {
		return new Date().toISOString();
	}

	const text = child.textContent;
	if (!text) {
		return new Date().toISOString();
	}

	let format = "dd MMMM yyyy";
	let [, dateTime] = text.split(" - ");
	if (!dateTime) {
		return new Date().toISOString();
	}

	if (dateTime.includes("г.") || dateTime.includes("р.")) {
		dateTime = dateTime.replace(" р.", String());
		dateTime = dateTime.replace(" г.", String());
	} else {
		dateTime = dateTime.replace("Сьогодні о ", String());
		dateTime = dateTime.replace("Сегодня в ", String());

		format = "HH:mm";
	}

	try {
		return DateTime.fromFormat(dateTime, format, {locale: "uk"})
			.plus({hours: (new Date().getTimezoneOffset() / 60) * -1})
			.toJSDate()
			.toISOString();
	} catch {
		return new Date().toISOString();
	}
}

export function test(entity: Offer): boolean {
	let isCorrupted = false;

	if (entity.dateTime === String()) {
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
