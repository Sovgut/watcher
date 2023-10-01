import {wrap} from "comlink";

import type {RequestWorker} from "source:workers/request.worker";
// @ts-ignore
import RequestInstanceWorker from "source:workers/request.worker?worker&inline";

export const requestWorker = wrap(new RequestInstanceWorker()) as RequestWorker;
