import {useEffect, useState} from "react";
import {observer} from "source:instances";
import {NewEvent, UseNewEventHook} from "source:types";

export const useNewEvent: UseNewEventHook = () => {
	const [event, setEvent] = useState<NewEvent>();

	useEffect(() => {
		observer.on("new", onNewEvent);

		return function cleanup() {
			observer.off("new", onNewEvent);
		};
	}, []);

	function onNewEvent(event: NewEvent) {
		setEvent(event);
	}

	return {offers: event?.offers, resource: event?.resource, queue: event?.queue};
};
