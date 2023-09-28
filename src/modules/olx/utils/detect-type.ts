import {Offer} from "../../../enums.js";

export function detectType(parent: Document): Offer {
	const isJobOffers = parent.getElementsByClassName("jobs-ad-card");
	if (isJobOffers.length > 0) {
		return Offer.Job;
	}

	return Offer.Advert;
}
