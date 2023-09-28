import {wrap} from "comlink";

import RequestInstanceWorker from "./request.worker.js?worker";

import type {RequestWorker} from "../workers/request.worker.js";

export const requestWorker = wrap(new RequestInstanceWorker()) as RequestWorker;
