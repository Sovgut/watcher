import {expose} from "comlink";

// Here is not allowed a path alias, use relative path instead.
import {request} from "../request";

const api = {request};

expose(api);

export type RequestWorker = typeof api;

self.addEventListener("message", async function (event) {
	if (event.data.cmd === "execute") {
		self.postMessage(await request(event.data.url));
	}
});
