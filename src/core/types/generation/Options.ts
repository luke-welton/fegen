import type { Gender } from "../Unit";

export interface GenerationOptions {
	teamSize: number;
	forcedUnitIds: string[];
}

export interface AvatarGenerationOptions extends GenerationOptions {
	/** The gender of the avatar. */
	avatarGender: Gender | "random";
}
