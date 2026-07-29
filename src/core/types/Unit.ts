export type UnitId = string;

export interface Unit {
	id: UnitId;
	name: string;

	forcedDeploy?: boolean;
}

export type Gender = "M" | "F";
export type UnitGender = Gender | "either";

export interface GenderedUnit extends Unit {
	gender: UnitGender;
}
