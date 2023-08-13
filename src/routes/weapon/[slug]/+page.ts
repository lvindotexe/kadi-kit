import { browser } from '$app/environment';
import { get } from 'idb-keyval';
import type { PageLoad } from './$types';
import type { Weapon } from '$lib/types/weaponTypes';
import { redirect } from '@sveltejs/kit';
import fs from 'node:fs/promises';
import path from 'node:path';

export const load: PageLoad = async ({ params }) => {
	const { slug } = params;
	let weapon: Weapon | undefined;
	if (browser) {
		weapon = await get<Weapon[]>('Weapons').then(
			(weapons) => weapons?.find((e) => e.hash === Number(slug))
		);
	} else {
		weapon = await fs
			.readFile(path.resolve(process.cwd(), './public/Weapons.json'), 'utf-8')
			.then((file) => JSON.parse(file) as Array<Weapon>)
			.then((weapons) => weapons.find((e) => e.hash === Number(slug)));
	}
	if (!weapon) throw redirect(307, '/404');
	return {
		weapon
	};
};
