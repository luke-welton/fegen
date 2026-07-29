import type { ReactElement } from "react";
import type { Unit } from "../core/types";
import type { GameData, GenerationOptions, GenerationResults, TeamMember } from "../core/types/generation";

export interface GameOptionsFieldsProps<TOptions> {
	value: TOptions;
	onChange(value: TOptions): void;
}

export interface GameResultsProps<TGameData extends GameData, TResults> {
	gameData: TGameData;
	results: TResults;
}

/**
 * Per-game plugin contract: a game's data, a generate function, its default
 * options, and the UI needed to configure/display it. Every function member
 * is declared with method syntax (not as an arrow-typed property) so
 * TypeScript checks it bivariantly when a concretely-typed module (e.g.
 * Awakening's) is stored behind the erased `AnyGameModule` alias below. This
 * lets the registry (and `App.tsx`) stay entirely game-agnostic with no
 * per-game casts.
 */
export interface GameModule<
	TUnit extends Unit = Unit,
	TGameData extends GameData<TUnit> = GameData<TUnit>,
	TOptions extends GenerationOptions = GenerationOptions,
	TMember extends TeamMember<TUnit> = TeamMember<TUnit>,
	TResults extends GenerationResults<TUnit, TMember> = GenerationResults<TUnit, TMember>
> {
	data: TGameData;
	/** Generates a team according to this game's own rules. */
	generate(options: TOptions): TResults;
	/** This game's full default options (including its own extra fields). */
	defaultOptions: TOptions;
	/** Controls for whatever extra options this game defines (e.g. avatar gender). */
	OptionsFields(props: GameOptionsFieldsProps<TOptions>): ReactElement | null;
	/** Renders this game's generated team. */
	Results(props: GameResultsProps<TGameData, TResults>): ReactElement | null;
}

/** Erased module type used at the registry boundary — see the `GameModule` doc comment. */
export type AnyGameModule = GameModule;
