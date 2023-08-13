type Entries<T extends Record<string, unknown>> = T extends Record<string, infer Value>
	? [string, Value]
	: never;
