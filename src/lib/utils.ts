export function isNotNullOrUndefined<T extends object>(input: null | undefined | T): input is T {
	return input != null;
}
