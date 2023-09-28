import axios from "axios";

export async function request(url: string): Promise<string | undefined> {
	try {
		const response = await axios.get(url, {
			headers: {
				"cache-control": "no-cache",
			},
		});

		return response.data;
	} catch (error) {
		console.error(error);

		return undefined;
	}
}
