export type ClassId = string;
export type ClassTier = "base" | "promoted";
export type ClassGender = "M" | "F" | "either";

export interface ClassDef {
	id: ClassId;
	name: string;
	tier: ClassTier;
	gender: ClassGender;
	promotionIds?: ClassId[];
}
