import type { GameModule } from "../GameModule";
import { AwakeningOptionsFields, AwakeningResultsExtras } from "./components";
import { AwakeningData } from "./data";
import { generateAwakeningTeam } from "./generator";
import { toAwakeningRosterCards } from "./rosterCard";
import type { AwakeningGameData, AwakeningMember, AwakeningOptions, AwakeningResults, AwakeningUnit } from "./types";

/** Registers Awakening's data/generator/options/results UI with the game registry (see `games/index.ts`). */
export const AwakeningGameModule: GameModule<AwakeningUnit, AwakeningGameData, AwakeningOptions, AwakeningMember, AwakeningResults> = {
	data: AwakeningData,
	generate: (options) => generateAwakeningTeam(AwakeningData, options),
	defaultOptions: {
		teamSize: AwakeningData.teamSize,
		forcedUnitIds: [],
		avatarGender: "random",
		rollPairings: true,
	},
	OptionsFields: ({ value, onChange }) => <AwakeningOptionsFields value={value} onChange={onChange} />,
	toRosterCards: (gameData, results) => toAwakeningRosterCards(gameData, results),
	ResultsExtras: ({ gameData, results }) => <AwakeningResultsExtras gameData={gameData} results={results} />,
};
