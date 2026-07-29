import type { GameData } from "../core/types/generation";
import { AwakeningGameModule } from "./awakening";
import type { AnyGameModule } from "./GameModule";

export type { AnyGameModule, GameModule, GameOptionsFieldsProps, GameResultsProps } from "./GameModule";

/**
 * Registry of all supported games. To add a new game, create a data module,
 * a `generate` function encoding that game's own rules, and a `GameModule`
 * wiring up that game's options/results UI (see `games/awakening/` for the
 * expected shape), then register it here — no changes to the core engine or
 * `App.tsx` are required.
 */
const gameModules: AnyGameModule[] = [AwakeningGameModule];

export const games: GameData[] = gameModules.map((m) => m.data);

export function getGameModule(gameId: string): AnyGameModule {
  const module = gameModules.find((m) => m.data.id === gameId);
  if (!module) throw new Error(`No game module registered for "${gameId}"`);
  return module;
}
