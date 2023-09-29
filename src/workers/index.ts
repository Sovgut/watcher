import {wrap} from "comlink";

import type {RequestWorker} from "./request.worker";
// @ts-ignore
import RequestInstanceWorker from "./request.worker?worker&inline";

export const requestWorker = wrap(new RequestInstanceWorker()) as RequestWorker;
