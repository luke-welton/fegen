import { ReclassableGameData } from "../../core/types/generation";
import type { AwakeningClassDef, AwakeningUnit } from "./types";

// NOTE: Class pools are a reasonable approximation of each character's
// canonical default + Second Seal reclass options in Fire Emblem: Awakening,
// simplified for the purposes of this generator (base and promoted forms are
// listed as separate class ids). Marriage pairings follow the base game's
// rules: pairings are heterosexual, each unit may marry at most one spouse,
// and children take their class pool from their own default line plus
// whichever class(es) their non-fixed ("variable") parent has access to.

const classList: AwakeningClassDef[] = [
	{ id: "tactician", name: "Tactician", tier: "base", promotionIds: ["grandmaster"], gender: "either" },
	{ id: "grandmaster", name: "Grandmaster", tier: "promoted", gender: "either" },

	{ id: "lord", name: "Lord", tier: "base", promotionIds: ["great_lord"], gender: "either", exclusive: true },
	{ id: "great_lord", name: "Great Lord", tier: "promoted", gender: "either", exclusive: true },

	{ id: "cavalier", name: "Cavalier", tier: "base", promotionIds: ["paladin", "great_knight"], gender: "either" },
	{ id: "paladin", name: "Paladin", tier: "promoted", gender: "either" },
	{ id: "great_knight", name: "Great Knight", tier: "promoted", gender: "either" },
	{ id: "knight", name: "Knight", tier: "base", promotionIds: ["general", "great_knight"], gender: "either" },
	{ id: "general", name: "General", tier: "promoted", gender: "either" },

	{ id: "myrmidon", name: "Myrmidon", tier: "base", promotionIds: ["swordmaster", "assassin"], gender: "either" },
	{ id: "swordmaster", name: "Swordmaster", tier: "promoted", gender: "either" },
	{ id: "assassin", name: "Assassin", tier: "promoted", gender: "either" },
	{ id: "thief", name: "Thief", tier: "base", promotionIds: ["assassin", "trickster"], gender: "either" },
	{ id: "trickster", name: "Trickster", tier: "promoted", gender: "either" },

	{ id: "barbarian", name: "Barbarian", tier: "base", promotionIds: ["berserker", "warrior"], gender: "M" },
	{ id: "berserker", name: "Berserker", tier: "promoted", gender: "M" },
	{ id: "warrior", name: "Warrior", tier: "promoted", gender: "M" },
	{ id: "fighter", name: "Fighter", tier: "base", promotionIds: ["warrior", "hero"], gender: "M" },
	{ id: "hero", name: "Hero", tier: "promoted", gender: "either" },
	{ id: "mercenary", name: "Mercenary", tier: "base", promotionIds: ["hero", "bow_knight"], gender: "either" },
	{ id: "bow_knight", name: "Bow Knight", tier: "promoted", gender: "either" },
	{ id: "archer", name: "Archer", tier: "base", promotionIds: ["sniper", "bow_knight"], gender: "either" },
	{ id: "sniper", name: "Sniper", tier: "promoted", gender: "either" },

	{ id: "pegasus_knight", name: "Pegasus Knight", tier: "base", promotionIds: ["falcon_knight", "dark_flier"], gender: "F" },
	{ id: "falcon_knight", name: "Falcon Knight", tier: "promoted", gender: "F" },
	{ id: "dark_flier", name: "Dark Flier", tier: "promoted", gender: "F" },

	{ id: "wyvern_rider", name: "Wyvern Rider", tier: "base", promotionIds: ["wyvern_lord", "griffon_rider"] , gender: "either"},
	{ id: "wyvern_rider_panne", name: "Wyvern Rider", tier: "base", promotionIds: ["wyvern_lord", "griffon_rider"] , gender: "F"},
	{ id: "wyvern_lord", name: "Wyvern Lord", tier: "promoted", gender: "either" },
	{ id: "griffon_rider", name: "Griffon Rider", tier: "promoted", gender: "either" },

	{ id: "dark_mage", name: "Dark Mage", tier: "base", promotionIds: ["sorcerer", "dark_knight"], gender: "either" },
	{ id: "sorcerer", name: "Sorcerer", tier: "promoted", gender: "either" },
	{ id: "dark_knight", name: "Dark Knight", tier: "promoted", gender: "either" },
	{ id: "mage", name: "Mage", tier: "base", promotionIds: ["sage", "dark_knight"], gender: "either" },
	{ id: "sage", name: "Sage", tier: "promoted", gender: "either" },

	{ id: "priest", name: "Priest", tier: "base", promotionIds: ["war_monk", "sage"], gender: "M", alt_id: "cleric" },
	{ id: "war_monk", name: "War Monk", tier: "promoted", gender: "M", alt_id: "war_cleric" },
	{ id: "cleric", name: "Cleric", tier: "base", promotionIds: ["war_cleric", "sage"], gender: "F", alt_id: "priest" },
	{ id: "war_cleric", name: "War Cleric", tier: "promoted", gender: "F", alt_id: "war_monk" },

	{ id: "troubadour", name: "Troubadour", tier: "base", promotionIds: ["valkyrie", "war_cleric"], gender: "F" },
	{ id: "valkyrie", name: "Valkyrie", tier: "promoted", gender: "F" },

	{ id: "villager", name: "Villager", tier: "base", gender: "M", exclusive: true },
	{ id: "taguel", name: "Taguel", tier: "promoted", gender: "either", excludeFromRobin: true },
	{ id: "manakete", name: "Manakete", tier: "promoted", gender: "either", excludeFromRobin: true },
	{ id: "dancer", name: "Dancer", tier: "promoted", gender: "F", exclusive: true },
];

const units: AwakeningUnit[] = [
	// Avatar
	{
		id: "robin",
		name: "Robin",
		gender: "either",
		role: "avatar",
		marriageable: true,
		classIds: [],
	},

	// Adults
	{ id: "chrom", name: "Chrom", gender: "M", role: "adult", marriageable: true, classIds: ["lord", "cavalier", "archer"], forcedDeploy: true, marriageCandidates: ["sumia", "sully", "olivia", "maribelle", "robin"] },
	{ id: "lissa", name: "Lissa", gender: "F", role: "adult", marriageable: true, classIds: ["cleric", "pegasus knight", "troubadour"], replacementClassIds: ["myrmidon", "barbarian"] },
	{ id: "frederick", name: "Frederick", gender: "M", role: "adult", marriageable: true, classIds: ["cavalier", "knight", "wyvern_rider"] },
	{ id: "sully", name: "Sully", gender: "F", role: "adult", marriageable: true, classIds: ["cavalier", "myrmidon", "wyvern_rider"] },
	{ id: "virion", name: "Virion", gender: "M", role: "adult", marriageable: true, classIds: ["archer", "wyvern_rider", "mage"] },
	{ id: "stahl", name: "Stahl", gender: "M", role: "adult", marriageable: true, classIds: ["cavalier", "archer", "myrmidon"] },
	{ id: "vaike", name: "Vaike", gender: "M", role: "adult", marriageable: true, classIds: ["fighter", "thief", "barbarian"], replacementClassIds: ["knight", "mercenary"] },
	{ id: "miriel", name: "Miriel", gender: "F", role: "adult", marriageable: true, classIds: ["mage", "troubadour", "dark_mage"], replacementClassIds: ["barbarian"] },
	{ id: "sumia", name: "Sumia", gender: "F", role: "adult", marriageable: true, classIds: ["pegasus_knight", "knight", "cleric"], marriageCandidates: ["chrom", "robin", "frederick", "gaius", "henry"] },
	{ id: "kellam", name: "Kellam", gender: "M", role: "adult", marriageable: true, classIds: ["knight", "thief", "priest"] },
	{ id: "donnel", name: "Donnel", gender: "M", role: "adult", marriageable: true, classIds: ["villager", "fighter", "mercenary"], replacementClassIds: ["pegasus_knight", "troubadour"] },
	{ id: "lonqu", name: "Lon'qu", gender: "M", role: "adult", marriageable: true, classIds: ["myrmidon", "thief", "wyvern_rider"] },
	{ id: "ricken", name: "Ricken", gender: "M", role: "adult", marriageable: true, classIds: ["mage", "cavalier", "archer"] },
	{ id: "maribelle", name: "Maribelle", gender: "F", role: "adult", marriageable: true, classIds: ["troubadour", "pegasus_knight", "mage"], replacementClassIds: ["cavalier", "priest"] },
	{ id: "gaius", name: "Gaius", gender: "M", role: "adult", marriageable: true, classIds: ["thief", "fighter", "myrmidon"], replacementClassIds: ["pegasus_knight"] },
	{ id: "panne", name: "Panne", gender: "F", role: "adult", marriageable: true, classIds: ["taguel", "thief", "wyvern_rider_panne"], replacementClassIds: ["barbarian"] },
	{ id: "cordelia", name: "Cordelia", gender: "F", role: "adult", marriageable: true, classIds: ["pegasus_knight", "mercenary", "dark_mage"] },
	{ id: "gregor", name: "Gregor", gender: "M", role: "adult", marriageable: true, classIds: ["mercenary", "barbarian", "myrmidon"], replacementClassIds: ["troubadour"] },
	{ id: "nowi", name: "Nowi", gender: "F", role: "adult", marriageable: true, classIds: ["manakete", "mage", "wyvern_rider"] },
	{ id: "libra", name: "Libra", gender: "M", role: "adult", marriageable: true, classIds: ["priest", "mage", "dark_mage"] },
	{ id: "tharja", name: "Tharja", gender: "F", role: "adult", marriageable: true, classIds: ["dark_mage", "knight", "archer"] },
	{ id: "anna", name: "Anna", gender: "F", role: "adult", marriageable: false, classIds: ["thief", "archer", "mage"] },
	{ id: "olivia", name: "Olivia", gender: "F", role: "adult", marriageable: true, classIds: ["dancer", "myrmidon", "pegasus_knight"], replacementClassIds: ["mercenary", "barbarian"] },
	{ id: "cherche", name: "Cherche", gender: "F", role: "adult", marriageable: true, classIds: ["wyvern_rider", "troubadour", "cleric"], replacementClassIds: ["fighter"] },
	{ id: "henry", name: "Henry", gender: "M", role: "adult", marriageable: true, classIds: ["dark_mage", "barbarian", "thief"], replacementClassIds: ["troubadour"] },
	{ id: "sayri", name: "Say'ri", gender: "F", role: "adult", marriageable: false, classIds: ["myrmidon", "pegasus_knight", "wyvern_rider"] },
	{ id: "tiki", name: "Tiki", gender: "F", role: "adult", marriageable: false, classIds: ["manakete", "wyvern_rider", "mage"] },
	{ id: "basilio", name: "Basilio", gender: "M", role: "adult", marriageable: false, classIds: ["fighter", "barbarian", "knight"] },
	{ id: "flavia", name: "Flavia", gender: "F", role: "adult", marriageable: false, classIds: ["mercenary", "thief", "knight"] },

	// Second generation ("children") units.
	// Each child has a fixed parent (e.g. Chrom is always Lucina's father), and the other parent is rolled from eligible spouses.
	// The child's class pool is determined by their own default classes plus whatever the parents pass on to their children.
	{ id: "lucina", name: "Lucina", gender: "F", role: "child", marriageable: false, classIds: ["lord"], fixedParentId: "chrom"},
	{ id: "owain", name: "Owain", gender: "M", role: "child", marriageable: false, classIds: [], fixedParentId: "lissa"},
	{ id: "inigo", name: "Inigo", gender: "M", role: "child", marriageable: false, classIds: [], fixedParentId: "olivia"},
	{ id: "brady", name: "Brady", gender: "M", role: "child", marriageable: false, classIds: [], fixedParentId: "maribelle"},
	{ id: "kjelle", name: "Kjelle", gender: "F", role: "child", marriageable: false, classIds: ["knight"], fixedParentId: "sully"},
	{ id: "cynthia", name: "Cynthia", gender: "F", role: "child", marriageable: false, classIds: [], fixedParentId: "sumia"},
	{ id: "severa", name: "Severa", gender: "F", role: "child", marriageable: false, classIds: [], fixedParentId: "cordelia"},
	{ id: "gerome", name: "Gerome", gender: "M", role: "child", marriageable: false, classIds: [], fixedParentId: "cherche"},
	{ id: "morgan", name: "Morgan", gender: "either", role: "child", marriageable: false, classIds: [], fixedParentId: "robin"},
	{ id: "yarne", name: "Yarne", gender: "M", role: "child", marriageable: false, classIds: [], fixedParentId: "panne"},
	{ id: "laurent", name: "Laurent", gender: "M", role: "child", marriageable: false, classIds: [], fixedParentId: "miriel"},
	{ id: "noire", name: "Noire", gender: "F", role: "child", marriageable: false, classIds: [], fixedParentId: "tharja"},
	{ id: "nah", name: "Nah", gender: "F", role: "child", marriageable: false, classIds: [], fixedParentId: "nowi"},
];

export const AwakeningData: ReclassableGameData<AwakeningUnit> = {
	id: "awakening",
	name: "Fire Emblem: Awakening",
	teamSize: 15,
	classes: classList,
	units,
};
