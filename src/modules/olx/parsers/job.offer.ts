import {DateTime} from "luxon";

import {Frequency} from "../../../enums.js";

import type {EntityOffer, Salary} from "../../../types.js";

function hasSalary(parent: Element): boolean {
	const child = parent.querySelector(".jobs-ad-card > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) p");
	if (!child) {
		return false;
	}

	const text = child.textContent;
	if (!text) {
		return false;
	}

	return /\d/.test(text);
}

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
	let query = ".jobs-ad-card > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) p";

	if (hasSalary(parent)) {
		query = ".jobs-ad-card > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(2) p";
	}

	const child = parent.querySelector(query);
	if (!child) {
		return String();
	}

	const text = child.textContent;
	if (!text) {
		return String();
	}

	return text.trim();
}

export function salary(parent: Element): Salary {
	const salary: Salary = {
		from: 0,
		frequency: Frequency.Monthly,
	};

	const child = parent.querySelector(".jobs-ad-card > div:nth-of-type(2) > div > div > div:nth-of-type(1) p");
	if (!child) {
		return salary;
	}

	const text = child.textContent;
	if (!text) {
		return salary;
	}

	if (text.includes(" - ")) {
		const matches = /([\d\s]+)(\s-\s)([\d\s]+)(\D+)\/(\D+)/g.exec(text.trim());
		if (matches) {
			if (matches[1]) {
				salary.from = Number(matches[1].replace(/\s/g, String()));
			}

			if (matches[3]) {
				salary.to = Number(matches[3].replace(/\s/g, String()));
			}

			if (matches[4]) {
				salary.currency = matches[4].trim().replace(".", String());
			}

			if (matches[5]) {
				if (["за месяц", "за місяць"].includes(matches[5].replace(/\s/g, String()))) {
					salary.frequency = Frequency.Monthly;
				}

				if (["за час", "за годину"].includes(matches[5].replace(/\s/g, String()))) {
					salary.frequency = Frequency.Hourly;
				}
			}
		}

		return salary;
	}

	const matches = /([\d\s]+)(\D+)\/(\D+)/g.exec(text.trim());
	if (matches) {
		if (matches[1]) {
			salary.from = Number(matches[1].replace(/\s/g, String()));
		}

		if (matches[2]) {
			salary.currency = matches[2].trim().replace(".", String());
		}

		if (matches[3]) {
			if (["за месяц", "за місяць"].includes(matches[3].replace(/\s/g, String()))) {
				salary.frequency = Frequency.Monthly;
			}

			if (["за час", "за годину"].includes(matches[3].replace(/\s/g, String()))) {
				salary.frequency = Frequency.Hourly;
			}
		}
	}

	return salary;
}

export function datetime(parent: Element): string {
	const child = parent.querySelector(".jobs-ad-card > div:nth-of-type(4) p");
	if (!child) {
		return new Date().toISOString();
	}

	let text = child.textContent;
	let format = "dd MMMM yyyy";
	if (!text) {
		return new Date().toISOString();
	}

	if (text.includes("г.") || text.includes("р.")) {
		text = text.replace(" р.", String());
		text = text.replace(" г.", String());
	} else {
		text = text.replace("Сьогодні о ", String());
		text = text.replace("Сегодня в ", String());

		format = "HH:mm";
	}

	try {
		return DateTime.fromFormat(text, format, {locale: "uk"})
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