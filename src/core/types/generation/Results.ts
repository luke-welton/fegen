import { Gender, Unit } from "../Unit";
import type { TeamMember } from "./TeamMember";

export interface GenerationResults<
	TUnit extends Unit = Unit,
	TMember extends TeamMember<TUnit> = TeamMember<TUnit>
> {
	team: TMember[];
}

export interface AvatarGenerationResults<
	TUnit extends Unit = Unit,
	TMember extends TeamMember<TUnit> = TeamMember<TUnit>
> extends GenerationResults<TUnit, TMember> {
	avatarGender: Gender;
}
