import { error } from '@sveltejs/kit';
import fs from 'node:fs/promises';
import path from 'node:path';
import type { Weapon } from '../../../types/weaponTypes.js';

export const GET = async ({ url }) => {
	const hash = url.searchParams.get('hash');
	const srcPath = path.resolve(process.cwd(), 'public/Weapons.json');
	if (!hash) throw error(400, 'hash is required');
	const weapons = (await fs
		.readFile(srcPath, 'utf-8')
		.then((result) => JSON.parse(result))) as Weapon[];
	const weapon = weapons.find((e) => e.hash === Number(hash));
	if (!weapon) throw error(404, 'unknown weapon');
	return new Response(JSON.stringify(weapon));
};
