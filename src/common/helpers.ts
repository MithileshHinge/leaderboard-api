export function hasKey<O extends object>(obj: O, key: PropertyKey): key is keyof O {
	return key in obj;
}

export async function forEachAsync<T>(arr: T[], cb: (val: T) => Promise<void>) {
	const promises = arr.map((val) => cb(val));
	await Promise.all(promises);
}
