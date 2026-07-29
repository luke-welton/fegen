import { useMemo } from "react";
import type { AwakeningGameData, AwakeningResults } from "../types";
import "./ResultsExtras.css";

interface AwakeningResultsExtrasProps {
	gameData: AwakeningGameData;
	results: AwakeningResults;
}

/**
 * Awakening-specific results extras: the rolled marriage pairings, rendered
 * above the (generic) roster grid. Not every game has a pairing mechanic, so
 * this is wired up as the optional `GameModule.ResultsExtras` hook.
 */
export function AwakeningResultsExtras({ gameData, results }: AwakeningResultsExtrasProps) {
	const { pairings } = results;
	const unitById = useMemo(() => new Map(gameData.units.map((u) => [u.id, u] as const)), [gameData]);

	if (pairings.length === 0) return null;

	return (
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
	);
}

