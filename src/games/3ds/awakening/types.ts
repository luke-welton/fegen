import { UnitId } from "../../../core/types";
import { ReclassableGameData, ReclassableTeamMember } from "../../../core/types/generation";
import { FateswakeningUnit, FateswakeningClassDef, FateswakeningOptions, FateswakeningResults } from "../shared/types";

export interface AwakeningUnit extends FateswakeningUnit {
	// The unit's marriage candidates, if any. This is used to determine which units can be paired with each other during team generation.
	// If unit is marked as marriageable and this is empty, it will be treated as if the unit can be paired with any other marriageable unit of the opposite gender.
	marriageCandidates?: UnitId[];

	// Classes the unit passes on to children of the opposite gender, if any.
	replacementClassIds?: string[];
}

export interface AwakeningClassDef extends FateswakeningClassDef {
	// Whether this class is excluded from Robin's class pool (e.g. the Dancer class).
	excludeFromRobin?: boolean;

	// For Priest/Cleric, since they are essentially the same class but with different names based on gender
	alt_id?: string;
}

export type AwakeningGameData = ReclassableGameData<AwakeningUnit, AwakeningClassDef>;
export type AwakeningMember = ReclassableTeamMember<AwakeningUnit>;
export type AwakeningOptions = FateswakeningOptions;
export type AwakeningResults = FateswakeningResults<AwakeningUnit, AwakeningMember>;
