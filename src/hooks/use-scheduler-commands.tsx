import {scheduler} from "source:instances";
import {Resource, UseSchedulerCommandsHook} from "source:types";

export const useSchedulerCommands: UseSchedulerCommandsHook = () => {
	return {
		enable: () => scheduler.enable(),
		disable: () => scheduler.disable(),
		queueResource: (resource: Resource) => scheduler.queueResource(resource),
		dequeueResource: (resource: Resource | string) => scheduler.dequeueResource(resource),
	};
};
