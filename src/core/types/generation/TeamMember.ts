import { ClassDef } from "../ClassDef";
import { Unit } from "../Unit";

export interface TeamMember<TUnit extends Unit = Unit> {
	unit: TUnit;
}

export interface ReclassableTeamMember<TUnit extends Unit = Unit> extends TeamMember<TUnit> {
	assignedClass: ClassDef;
}
