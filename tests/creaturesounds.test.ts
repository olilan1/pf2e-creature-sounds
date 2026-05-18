import { describe, it, expect, vi } from "vitest";

// Mock the settings module since it depends on Foundry's global game object
vi.mock("../src/settings.ts", () => ({
    SETTINGS_NAMESPACE: "pf2e-creature-sounds",
    SETTINGS: {
        CREATURE_SOUNDS_CHARACTER: "creatureSoundsCharacter",
        DEBUG_LOGGING: "debugLogging",
    },
    getSetting: (setting: string) => {
        if (setting === "debugLogging") return false;
        return true;
    },
}));

import { ActorPF2e } from "foundry-pf2e";
import {
    findSoundSet,
    findSoundSetByScoring,
    scoreSoundSets,
    findSoundSetByCreatureName,
    extractTraits,
    extractSize,
    getSoundsOfType,
    SoundDatabase,
    SoundSet
} from "../src/creaturesounds.ts";

const mockDb: SoundDatabase = {
    "set-orc": {
        id: "set-orc",
        display_name: "Orc Sound Set",
        category: "Humanoids",
        hurt_sounds: ["orc_hurt.wav"],
        attack_sounds: ["orc_attack.wav"],
        death_sounds: ["orc_death.wav"],
        creatures: ["Orc Warrior", "Orc Scout"],
        keywords: ["orc"],
        traits: ["humanoid"],
        size: 1, // Medium
    },
    "set-goblin": {
        id: "set-goblin",
        display_name: "Goblin Sound Set",
        category: "Humanoids",
        hurt_sounds: ["goblin_hurt.wav"],
        attack_sounds: ["goblin_attack.wav"],
        death_sounds: ["goblin_death.wav"],
        creatures: ["Goblin"],
        keywords: ["goblin"],
        traits: ["humanoid", "goblin"],
        size: 0, // Small
    },
    "set-dragon-large": {
        id: "set-dragon-large",
        display_name: "Large Dragon Sound Set",
        category: "Dragons, Dinosaurs & Reptiles",
        hurt_sounds: ["dragon_hurt.wav"],
        attack_sounds: ["dragon_attack.wav"],
        death_sounds: [],
        creatures: [],
        keywords: ["dragon", "drake"],
        traits: ["dragon", "fire"],
        size: 3, // Huge
    },
    "set-female-elf": {
        id: "set-female-elf",
        display_name: "Female Elf Sound Set",
        category: "Humanoids",
        hurt_sounds: ["female_elf_hurt.wav"],
        attack_sounds: ["female_elf_attack.wav"],
        death_sounds: [],
        creatures: [],
        keywords: ["elf"],
        traits: ["humanoid", "elf", "female"],
        size: 1,
    },
    "set-male-elf": {
        id: "set-male-elf",
        display_name: "Male Elf Sound Set",
        category: "Humanoids",
        hurt_sounds: ["male_elf_hurt.wav"],
        attack_sounds: ["male_elf_attack.wav"],
        death_sounds: [],
        creatures: [],
        keywords: ["elf"],
        traits: ["humanoid", "elf", "male"],
        size: 1,
    }
};

describe("Trait and Size Extraction", () => {
    it("should extract traits from roll options correctly", () => {
        const actor = {
            type: "character",
            name: "Aelfric",
            flags: {
                pf2e: {
                    rollOptions: {
                        all: {
                            "self:trait:humanoid": true,
                            "self:trait:elf": true,
                            "origin:trait:magical": true,
                            "some:other:flag": true,
                        }
                    }
                }
            },
            system: {
                details: {
                    gender: { value: "" }
                }
            }
        } as unknown as ActorPF2e;

        const traits = extractTraits(actor);
        expect(traits).toContain("humanoid");
        expect(traits).toContain("elf");
        expect(traits).toContain("magical");
        expect(traits).not.toContain("flag");
    });

    it("should append gender trait based on character pronouns", () => {
        const maleActor = {
            type: "character",
            name: "He-Man",
            flags: { pf2e: { rollOptions: { all: {} } } },
            system: {
                details: {
                    gender: { value: "He/Him" }
                }
            }
        } as unknown as ActorPF2e;

        const femaleActor = {
            type: "character",
            name: "She-Ra",
            flags: { pf2e: { rollOptions: { all: {} } } },
            system: {
                details: {
                    gender: { value: "She / Her (they/them pronouns excluded)" }
                }
            }
        } as unknown as ActorPF2e;

        expect(extractTraits(maleActor)).toContain("male");
        expect(extractTraits(femaleActor)).toContain("female");
    });

    it("should append gender trait based on NPC blurb", () => {
        const maleNpc = {
            type: "npc",
            name: "Male Guard",
            flags: { pf2e: { rollOptions: { all: {} } } },
            system: {
                details: {
                    blurb: "This is a tough male guard."
                }
            }
        } as unknown as ActorPF2e;

        const femaleNpc = {
            type: "npc",
            name: "Female Guard",
            flags: { pf2e: { rollOptions: { all: {} } } },
            system: {
                details: {
                    blurb: "A dangerous female assassin."
                }
            }
        } as unknown as ActorPF2e;

        expect(extractTraits(maleNpc)).toContain("male");
        expect(extractTraits(femaleNpc)).toContain("female");
    });

    it("should extract size when present in roll options", () => {
        const actor = {
            flags: {
                pf2e: {
                    rollOptions: {
                        all: {
                            "self:size:3": true
                        }
                    }
                }
            }
        } as unknown as ActorPF2e;

        expect(extractSize(actor)).toBe(3);
    });

    it("should return -1 when size is not found in roll options", () => {
        const actorNoSize = {
            flags: {
                pf2e: {
                    rollOptions: {
                        all: {}
                    }
                }
            }
        } as unknown as ActorPF2e;

        expect(extractSize(actorNoSize)).toBe(-1);
    });
});

describe("Exact Name Matching", () => {
    it("should return correct sound set for exact match", () => {
        const result = findSoundSetByCreatureName("Orc Warrior", mockDb);
        expect(result?.id).toBe("set-orc");
    });

    it("should return null when there is no exact name match", () => {
        const result = findSoundSetByCreatureName("Orc Chieftain", mockDb);
        expect(result).toBeNull();
    });
});

describe("Scoring Logic", () => {
    it("should score keyword match in name higher than keyword match in blurb", () => {
        const npcOrc = {
            type: "npc",
            name: "Orc",
            flags: { pf2e: { rollOptions: { all: {} } } },
            system: {
                details: { blurb: "" }
            }
        } as unknown as ActorPF2e;

        const npcGoblinBlurb = {
            type: "npc",
            name: "Nasty Slasher",
            flags: { pf2e: { rollOptions: { all: {} } } },
            system: {
                details: { blurb: "A goblin that slashes." }
            }
        } as unknown as ActorPF2e;

        const scoresOrc = scoreSoundSets(npcOrc, mockDb);
        const scoresGoblinBlurb = scoreSoundSets(npcGoblinBlurb, mockDb);

        // Keyword in name = 5
        expect(scoresOrc.get(mockDb["set-orc"])).toBe(5);
        // Keyword in blurb = 4
        expect(scoresGoblinBlurb.get(mockDb["set-goblin"])).toBe(4);
    });

    it("should add trait matches to score", () => {
        const actor = {
            type: "npc",
            name: "Generic Humanoid",
            flags: {
                pf2e: {
                    rollOptions: {
                        all: {
                            "self:trait:humanoid": true
                        }
                    }
                }
            },
            system: { details: { blurb: "" } }
        } as unknown as ActorPF2e;

        const scores = scoreSoundSets(actor, mockDb);
        // "set-orc" matches humanoid trait (+1)
        expect(scores.get(mockDb["set-orc"])).toBe(1);
        // "set-dragon-large" has no humanoid trait, should score 0
        expect(scores.get(mockDb["set-dragon-large"])).toBe(0);
    });

    it("should score gender traits lower than standard traits", () => {
        const femaleElf = {
            type: "character",
            name: "Elf Guard",
            flags: {
                pf2e: {
                    rollOptions: {
                        all: {
                            "self:trait:humanoid": true,
                            "self:trait:elf": true
                        }
                    }
                }
            },
            system: {
                details: { gender: { value: "she/her" } }
            }
        } as unknown as ActorPF2e;

        const scores = scoreSoundSets(femaleElf, mockDb);
        // "set-female-elf": traits are humanoid (1), elf (1), female (0.5) => total 2.5
        // Keyword in name "Elf" matches "elf" (+5) => total 7.5
        expect(scores.get(mockDb["set-female-elf"])).toBe(7.5);

        // "set-male-elf": traits are humanoid (1), elf (1), male (0) (since actor is female) => total 2
        // Keyword in name "Elf" matches "elf" (+5) => total 7
        expect(scores.get(mockDb["set-male-elf"])).toBe(7);
    });

    it("should apply size adjustment for non-zero scores", () => {
        // Dragon with size Huge (3). "set-dragon-large" is size Huge (3).
        const dragonHuge = {
            type: "npc",
            name: "Dragon",
            flags: {
                pf2e: {
                    rollOptions: {
                        all: {
                            "self:size:3": true,
                            "self:trait:dragon": true
                        }
                    }
                }
            },
            system: { details: { blurb: "" } }
        } as unknown as ActorPF2e;

        // Dragon with size Small (0). "set-dragon-large" is size Huge (3).
        const dragonSmall = {
            type: "npc",
            name: "Dragon",
            flags: {
                pf2e: {
                    rollOptions: {
                        all: {
                            "self:size:0": true,
                            "self:trait:dragon": true
                        }
                    }
                }
            },
            system: { details: { blurb: "" } }
        } as unknown as ActorPF2e;

        const scoresHuge = scoreSoundSets(dragonHuge, mockDb);
        const scoresSmall = scoreSoundSets(dragonSmall, mockDb);

        // set-dragon-large:
        // Huge (3) vs Huge (3): scoreAdj = (2 - |3 - 3|)/10 = 0.2
        // Name matches keyword "dragon" (+5), Trait matches "dragon" (+1) => 6 + 0.2 = 6.2
        expect(scoresHuge.get(mockDb["set-dragon-large"])).toBeCloseTo(6.2);

        // Small (0) vs Huge (3): scoreAdj = (2 - |0 - 3|)/10 = -0.1
        // Name matches keyword "dragon" (+5), Trait matches "dragon" (+1) => 6 - 0.1 = 5.9
        expect(scoresSmall.get(mockDb["set-dragon-large"])).toBeCloseTo(5.9);
    });

    it("actors with the same name and properties should deterministically resolve to the same sound set", () => {
        // Both elf sets score equally for an actor with elf traits and no gender.
        const agenderElfA = {
            type: "character",
            name: "Elf Warrior A",
            flags: {
                pf2e: {
                    rollOptions: {
                        all: {
                            "self:trait:humanoid": true,
                            "self:trait:elf": true
                        }
                    }
                }
            },
            system: { details: { gender: { value: "" } } }
        } as unknown as ActorPF2e;

        // Same actor should always resolve to the same set (determinism)
        const result1 = findSoundSetByScoring(agenderElfA, mockDb);
        const result2 = findSoundSetByScoring(agenderElfA, mockDb);
        expect(result1).not.toBeNull();
        expect(["set-female-elf", "set-male-elf"]).toContain(result1?.id);
        expect(result1?.id).toBe(result2?.id);
    });
});

describe("Overall SoundSet Search (findSoundSet)", () => {
    it("should override matching and return direct selection when soundset flag is set", async () => {
        const actor = {
            flags: {
                "pf2e-creature-sounds": {
                    soundset: "set-goblin"
                }
            }
        } as unknown as ActorPF2e;

        const result = await findSoundSet(actor, mockDb);
        expect(result?.id).toBe("set-goblin");
    });

    it("should return null when soundset flag is set to none", async () => {
        const actor = {
            flags: {
                "pf2e-creature-sounds": {
                    soundset: "none"
                }
            }
        } as unknown as ActorPF2e;

        const result = await findSoundSet(actor, mockDb);
        expect(result).toBeNull();
    });

    it("should retrieve a custom sound set if not found in primary db", async () => {
        const actor = {
            flags: {
                "pf2e-creature-sounds": {
                    soundset: "Custom-Unique"
                }
            }
        } as unknown as ActorPF2e;

        const mockCustomSet: SoundSet = {
            id: "Custom-Unique",
            display_name: "My Custom Set",
            category: "Custom Sound Sets",
            hurt_sounds: [], attack_sounds: [], death_sounds: [],
            creatures: [], keywords: [], traits: [], size: 1
        };

        const customDbGetter = async (id: string) => {
            if (id === "Custom-Unique") return mockCustomSet;
            return undefined;
        };

        const result = await findSoundSet(actor, mockDb, customDbGetter);
        expect(result?.id).toBe("Custom-Unique");
        expect(result?.display_name).toBe("My Custom Set");
    });

    // TODO: Change this when better gender matching is implemented
    // (they/them pronouns should only prevent masc or fem sounds being chosen, not all sounds)
    it("should skip all sounds if a character has they/them pronouns", async () => {
        const character = {
            type: "character",
            name: "Goblin", // Exact name match for "set-goblin"
            flags: { pf2e: { rollOptions: { all: {} } } },
            system: {
                details: {
                    gender: { value: "they/them" }
                }
            }
        } as unknown as ActorPF2e;

        const result = await findSoundSet(character, mockDb);
        expect(result).toBeNull();
    });

    it("should auto-match when no soundset flag has been set", async () => {
        const actor = {
            type: "npc",
            name: "Orc Warrior",
            flags: { pf2e: { rollOptions: { all: {} } } }, // no pf2e-creature-sounds key
            system: { details: { blurb: "" } }
        } as unknown as ActorPF2e;

        const result = await findSoundSet(actor, mockDb);
        expect(result?.id).toBe("set-orc");
    });

    it("should correctly run sequence: exact match -> scoring -> null", async () => {
        // 1. Exact match
        const actor1 = {
            type: "npc",
            name: "Orc Warrior",
            flags: { pf2e: { rollOptions: { all: {} } } },
            system: { details: { blurb: "" } }
        } as unknown as ActorPF2e;
        expect((await findSoundSet(actor1, mockDb))?.id).toBe("set-orc");

        // 2. Scoring (no exact match, but scored)
        const actor2 = {
            type: "npc",
            name: "Angry Orc",
            flags: { pf2e: { rollOptions: { all: {} } } },
            system: { details: { blurb: "" } }
        } as unknown as ActorPF2e;
        expect((await findSoundSet(actor2, mockDb))?.id).toBe("set-orc");

        // 3. Null (no match at all)
        const actor3 = {
            type: "npc",
            name: "A strange object",
            flags: { pf2e: { rollOptions: { all: {} } } },
            system: { details: { blurb: "" } }
        } as unknown as ActorPF2e;
        expect(await findSoundSet(actor3, mockDb)).toBeNull();
    });
});

describe("Sound Type Selection (getSoundsOfType)", () => {
    it("should return death sounds when they are present", () => {
        const result = getSoundsOfType(mockDb["set-orc"], "death");
        expect(result).toEqual(["orc_death.wav"]);
    });

    it("should fall back to hurt sounds when death_sounds is empty", () => {
        const result = getSoundsOfType(mockDb["set-dragon-large"], "death");
        expect(result).toEqual(["dragon_hurt.wav"]);
    });
});
