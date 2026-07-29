import type { ClassDef, Gender } from "./types";

export function pick<T>(arr: readonly T[]): T {
	return arr[Math.floor(Math.random() * arr.length)];
}

export function shuffle<T>(arr: readonly T[]): T[] {
	const copy = [...arr];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

export function sampleWithoutReplacement<T>(arr: readonly T[], count: number): T[] {
	return shuffle(arr).slice(0, Math.min(count, arr.length));
}

export function oppositeGender(gender: Gender): Gender {
	return gender === "M" ? "F" : "M";
}

export const UNKNOWN_CLASS: ClassDef = { id: "unknown", name: "Unknown", tier: "base", gender: "either" };
