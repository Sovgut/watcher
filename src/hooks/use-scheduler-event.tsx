import {useEffect, useState} from "react";
import {observer} from "source:instances";
import {SchedulerEvent, UseSchedulerEventHook} from "source:types";

export const useSchedulerEvent: UseSchedulerEventHook = () => {
	const [event, setEvent] = useState<SchedulerEvent>();

	useEffect(() => {
		observer.on("scheduler", onSchedulerEvent);

		return function cleanup() {
			observer.off("scheduler", onSchedulerEvent);
		};
	}, []);

	function onSchedulerEvent(event: SchedulerEvent) {
		setEvent(event);
	}

	return {state: event?.state, resource: event?.resource, queue: event?.queue};
};
