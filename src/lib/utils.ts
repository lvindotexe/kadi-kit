import type { DatabaseTables } from './types/weaponTypes';

export function isNotNullOrUndefined<T extends object>(input: null | undefined | T): input is T {
	return input != null;
}

export async function fetchTable<T extends keyof DatabaseTables>(tableName: T) {
	const response = await fetch(`/api/${tableName}`);
	if (!response.ok) return new Error('unknown tableName');
	return response.json() as Promise<DatabaseTables[T]>;
}
