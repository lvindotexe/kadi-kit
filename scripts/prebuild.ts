import fs from 'node:fs';
import path from 'node:path';
import { loadManifest } from '../lib/manifestLoader.js';

async function run() {
	await loadManifest().then((result) => {
		result.forEach((table) => {
			for (const [k, v] of table) {
				fs.writeFileSync(
					path.resolve() + '/public/' + k + '.json',
					JSON.stringify(v instanceof Map ? Object.fromEntries(v) : v)
				);
			}
		});
	});
}

run();
