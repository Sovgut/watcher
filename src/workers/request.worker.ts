import {expose} from "comlink";

import {request} from "../request";

const api = {request};

expose(api);

export type RequestWorker = typeof api;

self.addEventListener("message", async function (event) {
	if (event.data.cmd === "execute") {
		self.postMessage(await request(event.data.url));
	}
});
