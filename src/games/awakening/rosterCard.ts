import { Gender } from "../../core/types";
import { oppositeGender } from "../../core/utils";
import type { RosterCardView } from "../GameModule";
import type { AwakeningGameData, AwakeningResults, AwakeningUnit } from "./types";

function genderLabel(gender: Gender): string {
	return gender === "M" ? "Male" : "Female";
}

/**
 * Converts a generated Awakening team into the generic roster-card view data
 * `App.tsx` renders — this is where Awakening's own per-unit display rules
 * (resolved avatar/Morgan gender, role-flavored class name, "Parents: X & Y"
 * for children) live, kept separate from the generic rendering itself.
 */
export function toAwakeningRosterCards(gameData: AwakeningGameData, results: AwakeningResults): RosterCardView[] {
	const { team, pairings, avatarGender } = results;
	const unitById = new Map(gameData.units.map((u) => [u.id, u] as const));

	const unitGenderLabel = (unit: AwakeningUnit): string => {
		if (unit.gender === "either") {
			return unit.role === "avatar" ? genderLabel(avatarGender) : genderLabel(oppositeGender(avatarGender));
		}

		return genderLabel(unit.gender);
	};

	const parentsOf = (unit: AwakeningUnit) => {
		if (unit.role !== "child" || !unit.fixedParentId) return undefined;
		return pairings.find((p) => p.fatherId === unit.fixedParentId || p.motherId === unit.fixedParentId);
	};

	// Display the roster in the same order the units are listed in data.ts,
	// rather than the randomized roster-pick order.
	const orderIndex = new Map(gameData.units.map((u, i) => [u.id, i] as const));
	const orderedTeam = [...team].sort((a, b) => (orderIndex.get(a.unit.id) ?? 0) - (orderIndex.get(b.unit.id) ?? 0));

	return orderedTeam.map(({ unit, assignedClass }) => {
		const parents = parentsOf(unit);
		return {
			id: unit.id,
			name: unit.name,
			meta: `${unitGenderLabel(unit)} \u00b7 ${assignedClass.name}`,
			note: parents
				? `Parents: ${unitById.get(parents.fatherId)?.name ?? parents.fatherId} & ${unitById.get(parents.motherId)?.name ?? parents.motherId}`
				: undefined,
			className: `role-${unit.role}`,
		};
	});
}
