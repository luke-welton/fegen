import { ClassDef } from "../ClassDef";
import { Unit } from "../Unit";

export interface GameData<TUnit extends Unit = Unit> {
	id: string;
	name: string;
	/** Fixed roster size for this game (not user-configurable). */
	teamSize: number;
	units: TUnit[];
}

export interface ReclassableGameData<TUnit extends Unit = Unit, TClassDef extends ClassDef = ClassDef> extends GameData<TUnit> {
	classes: TClassDef[];
}
