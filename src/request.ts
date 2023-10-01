import axios, {AxiosRequestConfig} from "axios";

const config: AxiosRequestConfig = {
	responseType: "text",
	headers: {
		"cache-control": "no-cache",
	},
};

export async function request(url: string): Promise<string | undefined> {
	try {
		const response = await axios.get(url, config);

		if (response.data) {
			return response.data;
		}

		console.warn("No data from the resource:", url);

		return undefined;
	} catch (error) {
		console.error(error);

		return undefined;
	}
}
