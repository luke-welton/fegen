import { RosterCard } from "../../../../core/components/RosterCard";
import { Gender } from "../../../../core/types";
import { oppositeGender } from "../../../../core/utils";
import type { AwakeningGameData, AwakeningMember, AwakeningResults, AwakeningUnit } from "../types";
import "./RosterCard.css";

interface AwakeningRosterCardProps {
	gameData: AwakeningGameData;
	member: AwakeningMember;
	results: AwakeningResults;
}

/**
 * Awakening's roster card: resolves the avatar/Morgan gender (used for a
 * gender-colored border), shows the assigned class, and adds a "Parents: X
 * & Y" note for children — built on top of the generic `RosterCard` rather
 * than duplicating its markup.
 */
export function AwakeningRosterCard({ gameData, member, results }: AwakeningRosterCardProps) {
	const { unit, assignedClass } = member;
	const { pairings, avatarGender } = results;

	const resolveUnitGender = (u: AwakeningUnit): Gender => {
		if (u.gender === "either") {
			return u.role === "avatar" ? avatarGender : oppositeGender(avatarGender);
		}

		return u.gender;
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
			meta={assignedClass.name}
			note={note}
			className={`role-${unit.role} gender-${resolveUnitGender(unit)}`}
		/>
	);
}
