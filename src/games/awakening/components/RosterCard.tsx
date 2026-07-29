import { RosterCard } from "../../../core/components/RosterCard";
import { Gender } from "../../../core/types";
import { oppositeGender } from "../../../core/utils";
import type { AwakeningGameData, AwakeningMember, AwakeningResults, AwakeningUnit } from "../types";

function genderLabel(gender: Gender): string {
	return gender === "M" ? "Male" : "Female";
}

interface AwakeningRosterCardProps {
	gameData: AwakeningGameData;
	member: AwakeningMember;
	results: AwakeningResults;
}

/**
 * Awakening's roster card: resolves the avatar/Morgan gender label, shows
 * the assigned class, and adds a "Parents: X & Y" note for children — built
 * on top of the generic `RosterCard` rather than duplicating its markup.
 */
export function AwakeningRosterCard({ gameData, member, results }: AwakeningRosterCardProps) {
	const { unit, assignedClass } = member;
	const { pairings, avatarGender } = results;

	const unitGenderLabel = (u: AwakeningUnit): string => {
		if (u.gender === "either") {
			return u.role === "avatar" ? genderLabel(avatarGender) : genderLabel(oppositeGender(avatarGender));
		}

		return genderLabel(u.gender);
	};

	const parents =
		unit.role === "child" && unit.fixedParentId
			? pairings.find((p) => p.fatherId === unit.fixedParentId || p.motherId === unit.fixedParentId)
			: undefined;

	const note = parents
		? (() => {
			const unitById = new Map(gameData.units.map((u) => [u.id, u] as const));
			return `Parents: ${unitById.get(parents.fatherId)?.name ?? parents.fatherId} & ${unitById.get(parents.motherId)?.name ?? parents.motherId}`;
		})()
		: undefined;

	return (
		<RosterCard
			name={unit.name}
			meta={`${unitGenderLabel(unit)} \u00b7 ${assignedClass.name}`}
			note={note}
			className={`role-${unit.role}`}
		/>
	);
}
