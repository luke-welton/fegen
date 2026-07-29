import { createClassLookup, createUnitLookup, pickUnits } from "../../../core/generator";
import type { ClassId, Gender } from "../../../core/types";
import { oppositeGender, pick, shuffle } from "../../../core/utils";
import { UnitPairing } from "../shared/types";
import type { AwakeningGameData, AwakeningMember, AwakeningOptions, AwakeningResults, AwakeningUnit } from "./types";

interface AwakeningContext {
	avatarGender: Gender;
	roster: AwakeningUnit[];
	pairings: UnitPairing[];
}

/**
* Awakening-specific team generation rules: marriage pairings determine a
* child's class options. One parent per child is fixed (e.g. Chrom is always
* Lucina's father); the other ("variable") parent is rolled from eligible
* spouses, and the child's class pool is widened with whatever that parent
* passes on to their children.
*/
export function generateAwakeningTeam(gameData: AwakeningGameData, options: AwakeningOptions): AwakeningResults {
	const { findUnitById } = createUnitLookup(gameData);
	const { findClassById } = createClassLookup(gameData);

	const resolveAvatarGender = (): Gender => (options.avatarGender === "random" ? pick<Gender>(["M", "F"]) : options.avatarGender);

	const avatarGender = resolveAvatarGender();
	const roster = pickUnits(gameData, options.forcedUnitIds);
	const context: AwakeningContext = {
		avatarGender,
		roster,
		pairings: []
	};

	const rollPairings = (): UnitPairing[] => {
		const marriedTo = new Map<string, string>(); // unitId -> spouseId
		const pairings: UnitPairing[] = [];

		const genderOf = (unit: AwakeningUnit): Gender => {
			// Robin's gender
			if (unit.role === "avatar") return context.avatarGender;

			// Morgan's gender
			if (unit.gender === "either") return oppositeGender(context.avatarGender);

			// Everyone else
			return unit.gender;
		}

		const recordPairing = (a: AwakeningUnit, b: AwakeningUnit) => {
			marriedTo.set(a.id, b.id);
			marriedTo.set(b.id, a.id);
			const [father, mother] = genderOf(a) === "M" ? [a, b] : [b, a];
			pairings.push({ fatherId: father.id, motherId: mother.id });
		};

		const eligibleSpouseCandidates = (unit: AwakeningUnit) => {
			let baseCandidates: AwakeningUnit[];

			if (unit.marriageCandidates) {
				// Chrom/Sumia have a limited set of marriage candidates, so we only consider those.
				// Robin appears on both of their lists, so we still need to check gender (e.g. Chrom can only marry a female Robin).
				baseCandidates = unit.marriageCandidates
					.map((id) => findUnitById(id))
					.filter((u): u is AwakeningUnit => !!u && genderOf(u) === oppositeGender(genderOf(unit)));
			}
			else if (unit.role === "avatar") {
				// Robin can marry anyone of the opposite gender, except for Morgan
				baseCandidates = gameData.units.filter((u) => u.id !== "morgan" && genderOf(u) === oppositeGender(context.avatarGender));
			}
			else {
				// Everyone else can marry any marriageable unit of the opposite gender, as long as they are also on their marriageCandidates list (if they have one).
				baseCandidates = gameData.units.filter((u) => {
					if (u.marriageCandidates && !u.marriageCandidates.includes(unit.id)) return false;
					return u.marriageable && genderOf(u) === oppositeGender(genderOf(unit));
				});
			}

			// Filter out units that are already married
			return baseCandidates.filter((u) => !marriedTo.has(u.id));
		}

		// 1. Resolve pairings required to determine each rostered child's classes.
		const rosterIds = new Set(context.roster.map((u) => u.id));
		const childrenInRoster = context.roster.filter((u) => u.role === "child" && u.fixedParentId);
		for (const child of shuffle(childrenInRoster)) {
			const fixedParent = findUnitById(child.fixedParentId!);
			if (!fixedParent) continue;

			let spouseId = marriedTo.get(fixedParent.id);
			if (!spouseId) {
				const candidates = eligibleSpouseCandidates(fixedParent);
				if (candidates.length > 0) {
					// Prefer variable parents who are already on the roster, when possible.
					const rosterCandidates = options.preferRosterParents
						? candidates.filter((u) => rosterIds.has(u.id))
						: [];
					const spouse = pick(rosterCandidates.length > 0 ? rosterCandidates : candidates);
					recordPairing(fixedParent, spouse);
					spouseId = spouse.id;
				}
			}
		}

		// 2. For flavor/completeness, pair off every remaining marriageable character in the game, not just those on the roster.
		const unpaired = shuffle(
			gameData.units.filter((u) => u.role !== "child" && u.marriageable && !marriedTo.has(u.id))
		);
		for (const unit of unpaired) {
			// Skip units that were already claimed as a spouse by an earlier iteration of this loop.
			if (marriedTo.has(unit.id)) continue;

			const candidates = eligibleSpouseCandidates(unit);
			if (candidates.length > 0) {
				recordPairing(unit, pick(candidates));
			}
		}

		return pairings;
	}

	const rollClasses = (): AwakeningMember[] => {
		const getParents = (unit: AwakeningUnit): [AwakeningUnit | undefined, AwakeningUnit | undefined] | null => {
			if (unit.role !== "child" || !unit.fixedParentId) return null;

			const fixedParent = findUnitById(unit.fixedParentId);
			const pairing = context.pairings.find((p) => p.fatherId === fixedParent?.id || p.motherId === fixedParent?.id);
			const variableParentId = pairing?.fatherId === fixedParent?.id ? pairing?.motherId : pairing?.fatherId;
			const variableParent = variableParentId ? findUnitById(variableParentId) : undefined;

			return [fixedParent, variableParent];
		}

		const getParentClassPool = (unit: AwakeningUnit, parent: AwakeningUnit): ClassId[] => {
			// Children of Robin can inherit any non-exclusive class of their gender
			if (parent.role === "avatar") {
				return gameData.classes.filter(
					(cls) => cls.tier === "base" && (cls.gender === unit.gender || cls.gender === "either") && !cls.exclusive
				).map((cls) => cls.id);
			}

			// Parents pass on any non-exclusive classes they can personally become
			const baseParentPool = parent.classIds.filter((clsId) => findClassById(clsId)?.exclusive !== true);

			// If the parent is the same gender as the child, nothing else to worry about
			if (parent.gender === unit.gender) {
				return baseParentPool;
			}

			// If the child is the opposite gender of the parent, replace gender-locked classes with replacement classes
			return parent.classIds
				// Map Alt ID classes to the correct gender version
				.map((clsId) => findClassById(clsId)?.alt_id ?? clsId)
				// Filter out gender-locked classes that the child cannot inherit
				.filter((clsId) => findClassById(clsId)?.gender === "either")
				// Add in any classes the parent passes on to children of the opposite gender
				.concat(parent.replacementClassIds ?? []);
		}

		const getRawClassPool = (unit: AwakeningUnit): ClassId[] => {
			// Robin can be any non-exclusive class of their chosen gender
			if (unit.role === "avatar") {
				return gameData.classes.filter(
					(cls) => cls.tier === "base" && (cls.gender === context.avatarGender || cls.gender === "either") && !cls.exclusive
				).map((cls) => cls.id);
			}

			// Adult units have a simple pool
			if (unit.role !== "child") return unit.classIds;

			// Child units have a more complex pool, defined by whatever their parents pass on
			const basePool = unit.classIds;
			const parentPools = getParents(unit)?.map((parent) => parent ? getParentClassPool(unit, parent) : []) ?? [];
			return [...new Set([...basePool, ...parentPools.flat()])];
		}

		return context.roster.map((unit) => {
			const rawPool = getRawClassPool(unit);
			// Base-tier classes expand to their promoted forms; already-promoted/single-tier
			// classes (e.g. Taguel, Manakete, Dancer) have no promotionIds and are kept as-is.
			const promotions = rawPool.flatMap((clsId) => {
				const cls = findClassById(clsId);
				if (!cls) return [];
				return cls.tier === "promoted" ? [clsId] : (cls.promotionIds ?? []);
			});
			const classPool = [...new Set(promotions)];

			const assignedClass = findClassById(pick(classPool))!;
			return { unit, assignedClass };
		});
	}

	if (options.rollPairings) {
		context.pairings = rollPairings();
	}

	const team = rollClasses();
	return { team, pairings: context.pairings, avatarGender };
}
