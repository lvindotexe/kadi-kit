import fs from 'node:fs/promises';
import path from 'node:path';
import { loadManifest } from '../lib/manifestLoader.js';

await loadManifest().then(async (result) => {
	await fs.access(path.resolve() + '/public/').catch(() => fs.mkdir(path.resolve() + '/public/'));
	for await (const [k, v] of result) {
		fs.writeFile(
			path.resolve() + '/public/' + k + '.json',
			JSON.stringify(v instanceof Map ? Object.fromEntries(v) : v)
		);
	}
});
