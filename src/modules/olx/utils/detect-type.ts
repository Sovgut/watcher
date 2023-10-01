import {OfferKind} from "source:enums";

export function detectType(parent: Document): OfferKind {
	const isJobOffers = parent.getElementsByClassName("jobs-ad-card");
	if (isJobOffers.length > 0) {
		return OfferKind.Job;
	}

	return OfferKind.Advert;
}
