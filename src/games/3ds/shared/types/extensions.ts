import { ClassDef, ClassId, GenderedUnit, UnitId } from "../../../../core/types";
import { AvatarGenerationOptions, ReclassableTeamMember } from "../../../../core/types/generation";
import { AvatarGenerationResults } from "../../../../core/types/generation/Results";
import { UnitPairing } from "./UnitPairing";

export type FateswakeningRole = "avatar" | "adult" | "child";

export interface FateswakeningUnit extends GenderedUnit {
	role: FateswakeningRole;

	/** Whether this unit can be paired/married off to another unit (other than Robin). Does not apply to child units. */
	marriageable: boolean;

	/** Classes this unit can personally become (their default + reclass options). */
	classIds: ClassId[];

	// Classes the unit passes on to children of the opposite gender, if any. Only relevant for "adult" units that can be married off to produce children.
	replacementClassIds?: ClassId[];

	/** Only present for `role: "child"` units. */
	fixedParentId?: UnitId;
}

export interface FateswakeningClassDef extends ClassDef {
	// Whether this class is exclusive to a single unit (e.g. Chrom's Lord class). Exclusive classes cannot be inherited by children.
	exclusive?: boolean;
}

/** Awakening's own generation options: a customizable avatar and marriage pairings. */
export interface FateswakeningOptions extends AvatarGenerationOptions {
	/** Whether to roll marriage pairings, which affects children's class pools. */
	rollPairings: boolean;
}

export interface FateswakeningResults<
	TUnit extends FateswakeningUnit = FateswakeningUnit,
	TMember extends ReclassableTeamMember<TUnit> = ReclassableTeamMember<TUnit>
> extends AvatarGenerationResults<TUnit, TMember> {
	pairings: UnitPairing[];
}
