import {
	defaultDamageTypes,
	equipmentSlotTypes,
	ammoTypes,
	itemCategories,
	tierTypes
} from '$lib/types/weaponTypes';

// const mathers = [defaultDamageTypes, equipmentSlotTypes, ammoTypes, itemCategories, tierTypes].map(
// 	({propertyHashes}) => (keywords: Array<string>) => {
//         const hashes = Object.entries(propertyHashes).filter(([key,hash]) => )
// 	}
// );

const keywords = new Map(
	[defaultDamageTypes, equipmentSlotTypes, ammoTypes, itemCategories, tierTypes].flatMap(
		({ keyword, propertyHashes,filterImplementation }) =>
			Object.entries(propertyHashes).map(([key, hash]) => [key, { hash, keyword,filterImplementation }] as const)
	)
);

const keywordCategories = 
