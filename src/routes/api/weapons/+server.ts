import fs from 'node:fs/promises';
import path from 'node:path';
import type { Weapon } from '../../../types/weaponTypes.js';

export const GET = async ({ url }) => {
	const srcPath = path.resolve(process.cwd(), 'public/WeaponsLite.json');
	return fs.readFile(srcPath, 'utf-8').then((weapons) => new Response(weapons));
};
