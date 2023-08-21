import type {
	AllDestinyManifestComponents,
	DestinyInventoryItemDefinition,
	DestinyItemInvestmentStatDefinition,
	InterpolationPoint
} from 'bungie-api-ts/destiny2';

export type FlattenArray<T> = T extends (infer U)[] ? U : T;

type BaseItem = {
	name: string;
	hash: number;
};

export type WeaponSocketModKind = 'Catalyst' | 'Mod' | 'Masterwork' | 'Trait';
export type WeaponSocketMod<T extends WeaponSocketModKind> = BaseItem & {
	kind: T;
	icon: string;
	description: string;
	investmentStats: Weapon['investmentStats'] extends Record<number, infer U>
		? Omit<U, 'displayInterpolation'>[]
		: never;
};

export type Catalyst = WeaponSocketMod<'Catalyst'>;
export type Mod = WeaponSocketMod<'Mod'>;
export type Trait = WeaponSocketMod<'Trait'> & { currentlyCanRoll: boolean };
export type MasterWork = WeaponSocketMod<'Masterwork'> & { watermark: string };

export type Ornament = BaseItem & {
	kind: 'Ornament';
	screenshot: string;
	icon: string;
	description: string;
	flavourText: string;
};

export type SocketMod<T extends Ornament | Mod | MasterWork | Catalyst> = {
	placeholder: {
		description: string;
		kind: `placeholder ${T['kind']}`;
		icon: string;
		hash: number | 1;
		investmentStats: [];
	};
	items: T[];
};

export type WeaponLite = BaseItem & {
	investmentStats: Weapon['investmentStats'];
	kind: 'weaponLite';
	icon: string;
	collectibleHash: number;
	iconWatermark: string;
	iconWatermarkShelved: string;
	flavourText: string;
	tierTypeHash: number;
	itemTypeAndTierDisplayName: string;
	perks: number[];
	equipmentSlotTypeHash: number;
	ammoType: number;
	summaryItemHash: number;
	defaultDamageType: number;
	itemCategory: number[];
	stats: Record<number, number>;
};

//TODO itemtype,exotic legendary etc
export type Weapon = BaseItem & {
	screenshot: string;
	intrinsic: {
		name: string;
		icon: string;
		description: string;
	};
	perks: {
		type: string;
		items: Record<number, Trait>;
	}[];
	icon: string;
	iconWatermark: string;
	iconWatermarkShelved: string;
	flavourText: string;
	itemTypeAndTierDisplayName: string;
	investmentStats: Record<
		number,
		{
			displayInterpolation: InterpolationPoint[];
			name: string;
			description: string;
		} & DestinyItemInvestmentStatDefinition
	>;
	sockets: {
		catalyst: SocketMod<Catalyst> | null;
		mod: SocketMod<Mod> | null;
		masterwork: SocketMod<MasterWork> | null;
		ornament: SocketMod<Ornament> | null;
	};
};

export type ArrayOfPrimitivesOrObject<T> = T extends Record<any, any>
	? Map<keyof T, T[keyof T]>
	: T[];

type FilterableWeaponLite = Pick<
	WeaponLite,
	| 'ammoType'
	| 'defaultDamageType'
	| 'equipmentSlotTypeHash'
	| 'itemCategory'
	| 'stats'
	| 'perks'
	| 'tierTypeHash'
>;
export type WeaponLiteFilterableProperties = keyof FilterableWeaponLite;
export type NonRecordWeaponLiteProperties = Exclude<
	WeaponLiteFilterableProperties,
	'stats' | 'perks'
>;
export type NonRecordWeaponLite = {
	[key in NonRecordWeaponLiteProperties]: WeaponLite[key];
};

export const weaponTierOneMasterwork = [
	518224747, 150943607, 1486919755, 4283235143, 2942552113, 1590375901, 684616255, 4105787909,
	4283235141, 2203506848, 0, 3928770367, 2674077375, 915325363, 2357520979, 892374263, 3353797898,
	150943605, 178753455, 654849177, 1431498388, 199695019, 3444329767, 3689550782, 1590375903,
	4105787911, 1486919753
];

export type DatabaseTables = {
	WeaponsLite: WeaponLite[];
	Ornaments: DestinyInventoryItemDefinition[];
	Weapons: DestinyInventoryItemDefinition[];
	Traits: DestinyInventoryItemDefinition[];
	MasterWork: DestinyInventoryItemDefinition[];
	Catalysts: DestinyInventoryItemDefinition[];
	WeaponMods: DestinyInventoryItemDefinition[];
	WeaponCategoryStatGroupMap: Record<number, number>;
} & Record<
	keyof AllDestinyManifestComponents,
	Array<AllDestinyManifestComponents[keyof AllDestinyManifestComponents][number]>
>;

export type FilterImplementation<T extends keyof WeaponLite> = (
	types: ArrayOfPrimitivesOrObject<FlattenArray<WeaponLite[T]>>,
	property: WeaponLite[T]
) => boolean;

export const defaultDamageTypes = {
	propertyName: 'defaultDamageType',
	keyword: 'element',
	propertyHashes: {
		kinetic: 3373582085,
		stasis: 151347233,
		solar: 1847026933,
		arc: 2303181850,
		void: 3454344768
	},
	filterImplementation: (possibleprops, property) => possibleprops.includes(property)
} satisfies WeaponRecordPropertyDefinition<'defaultDamageType'>;

export const equipmentSlotTypes = {
	propertyName: 'equipmentSlotTypeHash',
	keyword: 'slot',
	propertyHashes: {
		kinetic_slot: 1498876634,
		energy: 2465295065,
		heavy: 953998645
	},
	filterImplementation: (possibleProps, property) => possibleProps.includes(property)
} satisfies WeaponRecordPropertyDefinition<'equipmentSlotTypeHash'>;

export const ammoTypes = {
	propertyName: 'ammoType',
	keyword: 'ammo',
	propertyHashes: {
		primary: 1,
		special: 2,
		power: 3
	},
	filterImplementation: (possibleprops, property) => possibleprops.includes(property)
} satisfies WeaponRecordPropertyDefinition<'ammoType'>;

export const itemCategories = {
	propertyName: 'itemCategory',
	keyword: 'weapon',
	propertyHashes: {
		pulse_rifle: 7,
		hand_cannon: 6,
		glaive: 3871742104,
		trace_rifle: 2489664120,
		scout_rifle: 8,
		auto_rifle: 5,
		sword: 54,
		rocket: 13,
		submachine_gun: 3954685534,
		machine_gun: 12,
		sidearm: 14,
		shotgun: 11,
		sniper_rifle: 10,
		grenade_launcher: 153950757,
		bow: 3317538576,
		fusion_rifle: 9,
		linear_fusion_rifle: 1504945536
	},
	filterImplementation: (properties, property) => properties.some((e) => property.includes(e))
} satisfies WeaponRecordPropertyDefinition<'itemCategory'>;

export const tierTypes = {
	propertyName: 'tierTypeHash',
	keyword: 'tier',
	propertyHashes: {
		// basic: 0,
		// otherBasic: 3340296461,
		rare: 2127292149,
		common: 2395677314,
		exotic: 2759499571,
		// otherOtherBasic: 1801258597,
		legendary: 4008398120
	},
	filterImplementation: (possibleProps, property) => possibleProps.includes(property)
} satisfies WeaponRecordPropertyDefinition<'tierTypeHash'>;

export type WeaponRecordPropertyDefinition<T extends NonRecordWeaponLiteProperties> = {
	keyword: string;
	filterImplementation: FilterImplementation<T>;
	propertyHashes: Record<string, number>;
} & { propertyName: T };

export type AllWeaponPropertyDefinitions = {
	[key in NonRecordWeaponLiteProperties]: WeaponRecordPropertyDefinition<key>;
};
export const allWeaponPropertyDefinitions: AllWeaponPropertyDefinitions = {
	ammoType: ammoTypes,
	defaultDamageType: defaultDamageTypes,
	equipmentSlotTypeHash: equipmentSlotTypes,
	tierTypeHash: tierTypes,
	itemCategory: itemCategories
};
