import axios from "axios";
import {Database} from "source:database";
import {Observer} from "source:observer";
import {Pipeline} from "source:pipeline";
import {Scheduler} from "source:scheduler";

export const scheduler = new Scheduler();
export const observer = new Observer();
export const pipeline = new Pipeline();
export const database = new Database();
export let REQUEST_FUNCTION: (url: string) => Promise<string | undefined> = async function (url: string) {
	const response = await axios.get(url, {responseType: "text"});
	return response.data;
};
