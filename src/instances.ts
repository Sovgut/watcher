import {Database} from "source:database";
import {Observer} from "source:observer";
import {Pipeline} from "source:pipeline";
import {Scheduler} from "source:scheduler";

export const scheduler = new Scheduler();
export const observer = new Observer();
export const pipeline = new Pipeline();
export const database = new Database();
