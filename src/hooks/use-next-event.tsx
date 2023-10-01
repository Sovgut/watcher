import {useEffect, useState} from "react";
import {observer} from "source:instances";
import {NextEvent, UseNextEventHook} from "source:types";

export const useNextEvent: UseNextEventHook = () => {
	const [event, setEvent] = useState<NextEvent>();

	useEffect(() => {
		observer.on("next", onNextEvent);

		return function cleanup() {
			observer.off("next", onNextEvent);
		};
	}, []);

	function onNextEvent(event: NextEvent) {
		setEvent(event);
	}

	return {next: event?.next, resource: event?.resource, queue: event?.queue};
};
