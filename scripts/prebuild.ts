import fs from 'node:fs';
import path from 'node:path';
import { loadManifest } from '../lib/manifestLoader.js';

async function run() {
	await loadManifest().then((result) => {
		result.forEach(async (table) => {
			if (!fs.existsSync(path.resolve() + '/public/'))
				fs.mkdirSync(path.resolve() + '/public/', { recursive: true });
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
