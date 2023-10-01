import {useEffect, useState} from "react";
import {observer} from "source:instances";
import {ProgressEvent, UseProgressEventHook} from "source:types";

export const useProgressEvent: UseProgressEventHook = () => {
	const [event, setEvent] = useState<ProgressEvent>();

	useEffect(() => {
		observer.on("progress", onProgressEvent);

		return function cleanup() {
			observer.off("progress", onProgressEvent);
		};
	}, []);

	function onProgressEvent(event: ProgressEvent) {
		setEvent(event);
	}

	return {progress: event?.progress, resource: event?.resource, queue: event?.queue};
};
