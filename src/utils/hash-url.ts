/**
 * Hashes the provided URL.
 *
 * @param {string} [url] The URL to hash.
 * @returns {string} The hashed URL.
 */
export function hashUrl(url?: string): string {
	const value = url ?? Math.random().toString();
	let hash = 0;

	for (let i = 0; i < value.length; i++) {
		hash = (hash << 5) - hash + value.charCodeAt(i);
		hash |= 0;
	}

	return hash.toString();
}
