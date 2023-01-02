export async function forEachAsync<T>(arr: T[], cb: (val: T) => Promise<void>) {
	const promises = arr.map((val) => cb(val));
	await Promise.all(promises);
}
