import type { GameModule } from "../../GameModule";
import { AwakeningOptionsFields, AwakeningResultsExtras, AwakeningRosterCard } from "./components";
import { AwakeningData } from "./data";
import { generateAwakeningTeam } from "./generateAwakening";
import type { AwakeningGameData, AwakeningMember, AwakeningOptions, AwakeningResults, AwakeningUnit } from "./types";

/** Registers Awakening's data/generator/options/results UI with the game registry (see `games/index.ts`). */
export const AwakeningGameModule: GameModule<AwakeningUnit, AwakeningGameData, AwakeningOptions, AwakeningMember, AwakeningResults> = {
	data: AwakeningData,
	generate: (options) => generateAwakeningTeam(AwakeningData, options),
	defaultOptions: {
		forcedUnitIds: ["chrom"],
		avatarGender: "random",
		rollPairings: true,
		preferRosterParents: true,
	},
	OptionsFields: ({ value, onChange }) => <AwakeningOptionsFields value={value} onChange={onChange} />,
	RosterCard: ({ gameData, member, results }) => <AwakeningRosterCard gameData={gameData} member={member} results={results} />,
	ResultsExtras: ({ gameData, results }) => <AwakeningResultsExtras gameData={gameData} results={results} />,
};
