import {nanoid} from "nanoid";

export function hashUrl(url?: string): string {
	const value = url ?? nanoid();
	let hash = 0;

	for (let i = 0; i < value.length; i++) {
		hash = (hash << 5) - hash + value.charCodeAt(i);
		hash |= 0;
	}

	return hash.toString();
}
