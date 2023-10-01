import {MIN_RATE_LIMIT} from "source:constants";
import {SchedulerState} from "source:enums";
import {observer, pipeline} from "source:instances";
import {calculatePercentage} from "source:utils/calculate-percentage";

import type {Resource} from "source:types";

export let SCHEDULER_QUEUE: Resource[] = [];

export class Scheduler {
	private queueIndex: number = 0;
	private progress: number = 0;
	private timeoutId: number | undefined = undefined;

	private startLoop(): number {
		return setTimeout(async () => {
			if (SCHEDULER_QUEUE[this.queueIndex]) {
				if (this.progress >= MIN_RATE_LIMIT / 1000) {
					await this.processQueueEntry();

					this.progress = 0;
				} else {
					this.progress++;
				}

				const roundedProgress = Math.round(calculatePercentage(this.progress, MIN_RATE_LIMIT / 1000));
				observer.emit("progress", {
					progress: roundedProgress,
					resource: SCHEDULER_QUEUE[this.queueIndex],
					queue: SCHEDULER_QUEUE,
				});
			}

			this.timeoutId = this.startLoop();
		}, 1000);
	}

	private async processQueueEntry(): Promise<void> {
		const prevQueueIndex = this.queueIndex;

		await pipeline.process(SCHEDULER_QUEUE[this.queueIndex]);

		if (!SCHEDULER_QUEUE[this.queueIndex + 1]) {
			this.queueIndex = 0;
		} else {
			this.queueIndex += 1;
		}

		observer.emit("next", {
			next: SCHEDULER_QUEUE[this.queueIndex],
			resource: SCHEDULER_QUEUE[prevQueueIndex],
			queue: SCHEDULER_QUEUE,
		});
	}

	public getState(): SchedulerState {
		switch (this.timeoutId) {
			case undefined:
				return SchedulerState.Disabled;
			default:
				return SchedulerState.Enabled;
		}
	}

	public enable(): void {
		if (!this.timeoutId) {
			this.timeoutId = this.startLoop();

			observer.emit("scheduler", {
				state: SchedulerState.Enabled,
				resource: SCHEDULER_QUEUE[this.queueIndex],
				queue: SCHEDULER_QUEUE,
			});
			observer.emit("progress", {
				progress: this.progress,
				resource: SCHEDULER_QUEUE[this.queueIndex],
				queue: SCHEDULER_QUEUE,
			});
		}
	}

	public disable(): void {
		if (this.timeoutId) {
			clearTimeout(this.timeoutId);
			this.timeoutId = undefined;

			this.progress = 0;

			observer.emit("scheduler", {
				state: SchedulerState.Disabled,
				resource: SCHEDULER_QUEUE[this.queueIndex],
				queue: SCHEDULER_QUEUE,
			});
			observer.emit("progress", {
				progress: this.progress,
				resource: SCHEDULER_QUEUE[this.queueIndex],
				queue: SCHEDULER_QUEUE,
			});
		}
	}

	public queueResource(resource: Resource): void {
		const resourceIndex = SCHEDULER_QUEUE.findIndex((queueResource) => queueResource.url === resource.url);

		if (resourceIndex < 0) {
			SCHEDULER_QUEUE.push({...resource});

			observer.emit("scheduler", {
				state: this.getState(),
				resource: SCHEDULER_QUEUE[this.queueIndex],
				queue: SCHEDULER_QUEUE,
			});
		}
	}

	public dequeueResource(resource: Resource | string): void {
		const url = typeof resource === "string" ? resource : resource.url;
		const filtered = SCHEDULER_QUEUE.filter((queueResource) => queueResource.url !== url);

		if (filtered.length !== SCHEDULER_QUEUE.length) {
			SCHEDULER_QUEUE = filtered;
			this.queueIndex = 0;

			observer.emit("scheduler", {
				state: this.getState(),
				resource: SCHEDULER_QUEUE[this.queueIndex],
				queue: SCHEDULER_QUEUE,
			});
		}
	}
}
