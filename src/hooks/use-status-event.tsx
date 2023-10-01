import {useEffect, useState} from "react";
import {observer} from "source:instances";
import {StatusEvent, UseStatusEventHook} from "source:types";

export const useStatusEvent: UseStatusEventHook = () => {
	const [event, setEvent] = useState<StatusEvent>();

	useEffect(() => {
		observer.on("status", onStatusEvent);

		return function cleanup() {
			observer.off("status", onStatusEvent);
		};
	}, []);

	function onStatusEvent(event: StatusEvent) {
		setEvent(event);
	}

	return {status: event?.status, resource: event?.resource, queue: event?.queue};
};
