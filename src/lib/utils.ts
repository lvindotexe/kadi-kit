import { getContext, setContext } from 'svelte';
import type { DatabaseTables } from './types/weaponTypes';

export function setService<T>(key: string | Symbol, service: T): T {
	setContext(key, service);
	return service;
}

export function getService<T>(key: string | Symbol): () => T {
	return () => getContext(key) as T;
}

export function defineService<T>(key: string | Symbol = Symbol()): [() => T, (service: T) => T] {
	return [
		getService<T>(key),
		(service: T) => {
			setService(key, service);
			return service;
		}
	];
}

export function isNotNullOrUndefined<T extends object>(input: null | undefined | T): input is T {
	return input != null;
}

export async function fetchTable<T extends keyof DatabaseTables>(tableName: T) {
	const response = await fetch(`/api/${tableName}`);
	if (!response.ok) return new Error('unknown tableName');
	return response.json() as Promise<DatabaseTables[T]>;
}
