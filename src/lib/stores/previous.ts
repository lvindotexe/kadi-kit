import type { Readable } from 'svelte/store';

export function previous<T>(store: Readable<T>): Readable<T> {
	type Subscription<T> = (value: T) => void;
	const queue: Array<T> = [];
	const subscribers = new Array<Subscription<T>>();
	store.subscribe((value) => {
		queue.push(value);
		const previous = queue.length < 2 ? queue[0] : queue.shift();
		for (const subscriber of subscribers) subscriber(previous!);
	});
	return {
		subscribe: (subscription: Subscription<T>) => {
			subscribers.push(subscription);
			return () => {
				subscribers.splice(subscribers.indexOf(subscription), 1);
			};
		}
	};
}
