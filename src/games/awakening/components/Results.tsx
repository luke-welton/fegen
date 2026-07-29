import { useMemo } from "react";
import { Gender } from "../../../core/types";
import { oppositeGender } from "../../../core/utils";
import type { UnitPairing } from "../../3ds/shared/types";
import type { AwakeningGameData, AwakeningMember, AwakeningResults, AwakeningUnit } from "../types";

function genderLabel(gender: Gender): string {
	return gender === "M" ? "Male" : "Female";
}

interface AwakeningResultsProps {
	gameData: AwakeningGameData;
	results: AwakeningResults;
}

/**
 * Awakening-specific results rendering: the avatar's resolved gender in the
 * heading, rolled marriage pairings, and role-flavored roster cards (with
 * parents shown for children).
 */
export function AwakeningResults({ gameData, results }: AwakeningResultsProps) {
	const { team, pairings, avatarGender } = results;
	const unitById = useMemo(() => new Map(gameData.units.map((u) => [u.id, u] as const)), [gameData]);

	// Display the roster in the same order the units are listed in data.tsx,
	// rather than the randomized roster-pick order.
	const orderedTeam = useMemo(() => {
		const orderIndex = new Map(gameData.units.map((u, i) => [u.id, i] as const));
		return [...team].sort((a, b) => (orderIndex.get(a.unit.id) ?? 0) - (orderIndex.get(b.unit.id) ?? 0));
	}, [team, gameData]);

	const unitGenderLabel = (unit: AwakeningUnit): string => {
		if (unit.gender === "either") {
			return unit.role === "avatar" ? genderLabel(avatarGender) : genderLabel(oppositeGender(avatarGender));
		}

		return genderLabel(unit.gender);
	};

	const parentsOf = (unit: AwakeningUnit): UnitPairing | undefined => {
		if (unit.role !== "child" || !unit.fixedParentId) return undefined;
		return pairings.find((p) => p.fatherId === unit.fixedParentId || p.motherId === unit.fixedParentId);
	};

	return (
		<section className="results">
			<h2>
				Your Team
			</h2>

			{pairings.length > 0 && (
				<div className="pairings-block">
					<h3>Pairings</h3>
					<ul className="pairings-list">
						{pairings.map((p) => (
							<li key={`${p.fatherId}-${p.motherId}`}>
								{unitById.get(p.fatherId)?.name ?? p.fatherId} &hearts;{" "}
								{unitById.get(p.motherId)?.name ?? p.motherId}
							</li>
						))}
					</ul>
				</div>
			)}

			<ul className="roster-grid">
				{orderedTeam.map((m: AwakeningMember) => {
					const parents = parentsOf(m.unit);
					return (
						<li key={m.unit.id} className={`roster-card role-${m.unit.role}`}>
							<div className="roster-card-name">{m.unit.name}</div>
							<div className="roster-card-meta">
								{unitGenderLabel(m.unit)} &middot; {m.assignedClass.name}
							</div>
							{parents && (
								<div className="roster-card-parents">
									Parents: {unitById.get(parents.fatherId)?.name ?? parents.fatherId} &amp;{" "}
									{unitById.get(parents.motherId)?.name ?? parents.motherId}
								</div>
							)}
						</li>
					);
				})}
			</ul>
		</section>
	);
}
