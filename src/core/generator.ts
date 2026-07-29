import type { ClassDef, Unit } from "./types";
import type { GameData, ReclassableGameData } from "./types/generation";
import { shuffle } from "./utils";

/** Builds a lookup for a game's units, shared by `pickUnits` and per-game generator functions. */
export function createUnitLookup<TUnit extends Unit>(gameData: GameData<TUnit>) {
	const unitById = new Map(gameData.units.map((u) => [u.id, u] as const));
	return {
		findUnitById: (id: string): TUnit | undefined => unitById.get(id),
	};
}

/** Builds a lookup for a reclassable game's classes, for generator functions that need `findClassById`. */
export function createClassLookup<TUnit extends Unit, TClassDef extends ClassDef>(gameData: ReclassableGameData<TUnit, TClassDef>) {
	const classById = new Map(gameData.classes.map((cls) => [cls.id, cls] as const));
	return {
		findClassById: (id: string): TClassDef | undefined => classById.get(id),
	};
}

/** Picks a random roster of `teamSize` units, honoring any forced-included unit ids. */
export function pickUnits<TUnit extends Unit>(gameData: GameData<TUnit>, teamSize: number, forcedUnitIds: string[] = []): TUnit[] {
	const { findUnitById } = createUnitLookup(gameData);
	const forcedUnits = forcedUnitIds.map((id) => findUnitById(id)).filter((u): u is TUnit => !!u);
	const remainingSlots = teamSize - forcedUnits.length;
	const otherUnits = shuffle(gameData.units.filter((u) => !forcedUnitIds.includes(u.id))).slice(0, remainingSlots);
	return [...forcedUnits, ...otherUnits];
}
