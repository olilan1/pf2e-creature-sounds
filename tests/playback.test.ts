import { beforeEach, describe, expect, it, vi } from "vitest";

let mockSettings: Record<string, boolean | number> = {};

const mockOrcSet = {
    id: "set-orc",
    display_name: "Orc Sound Set",
    category: "Humanoids",
    hurt_sounds: ["orc_hurt.wav"],
    attack_sounds: ["orc_attack.wav"],
    death_sounds: ["orc_death.wav"],
    creatures: ["Orc"],
    keywords: ["orc"],
    traits: ["humanoid"],
    size: 1,
};

vi.hoisted(() => {
    (global as unknown as { foundry: unknown }).foundry = {
        applications: {
            api: {
                ApplicationV2: class {},
                HandlebarsApplicationMixin: <T>(c: T): T => c,
            },
        },
        utils: {
            isNewerVersion: () => true,
        },
        audio: {
            AudioHelper: {
                play: vi.fn(),
            },
        },
    };
    (global as unknown as { game: unknown }).game = {
        settings: {
            get: () => mockSettings,
        },
        user: { isGM: true },
    };
});

vi.mock("../src/settings.ts", () => ({
    SETTINGS: {
        CREATURE_SOUNDS_CHARACTER: "creatureSoundsCharacter",
        CREATURE_SOUNDS_VOLUME: "creatureSoundsVolume",
    },
    getSetting: (key: string) => mockSettings[key] ?? false,
}));

vi.mock("../src/customsoundsdb.ts", () => ({
    getCustomSoundSet: async (id: string) => {
        if (id === "set-orc") {
            return mockOrcSet;
        }
        return undefined;
    },
}));

import { ActorPF2e } from "foundry-pf2e";
import {
    playSoundForCreatureOnDamage,
    playSoundForCreature,
} from "../src/creaturesounds.ts";

describe("Sound Playback Triggers", () => {
    beforeEach(() => {
        mockSettings = {
            creatureSoundsCharacter: true,
            creatureSoundsVolume: 0.5,
        };
        // Clear all mock call histories
        vi.mocked(foundry.audio.AudioHelper.play).mockClear();
    });

    it("should bail out on damage if character settings are disabled", async () => {
        mockSettings.creatureSoundsCharacter = false;

        const actor = {
            type: "character",
            name: "Orc",
            flags: {
                pf2e: { rollOptions: { all: {} } },
            },
            system: {
                details: { gender: { value: "" } },
                attributes: {
                    hp: { value: 10 },
                },
            },
        } as unknown as ActorPF2e;

        await playSoundForCreatureOnDamage(actor);
        expect(foundry.audio.AudioHelper.play).not.toHaveBeenCalled();
    });

    it("should play death sound when HP is 0", async () => {
        const actor = {
            type: "npc",
            name: "Orc",
            flags: {
                pf2e: { rollOptions: { all: {} } },
                "pf2e-creature-sounds": { soundset: "set-orc" },
            },
            system: {
                details: { blurb: "" },
                attributes: {
                    hp: { value: 0 },
                    emitsSound: true,
                },
            },
            items: [],
        } as unknown as ActorPF2e;

        await playSoundForCreatureOnDamage(actor);

        expect(foundry.audio.AudioHelper.play).toHaveBeenCalledWith(
            expect.objectContaining({ src: "orc_death.wav", volume: 0.5 }),
            true
        );
    });

    it("should play hurt sound when HP is greater than 0", async () => {
        const actor = {
            type: "npc",
            name: "Orc",
            flags: {
                pf2e: { rollOptions: { all: {} } },
                "pf2e-creature-sounds": { soundset: "set-orc" },
            },
            system: {
                details: { blurb: "" },
                attributes: {
                    hp: { value: 5 },
                    emitsSound: true,
                },
            },
            items: [],
        } as unknown as ActorPF2e;

        await playSoundForCreatureOnDamage(actor);

        expect(foundry.audio.AudioHelper.play).toHaveBeenCalledWith(
            expect.objectContaining({ src: "orc_hurt.wav", volume: 0.5 }),
            true
        );
    });

    it("should not play sound if emitsSound is false unless forced", async () => {
        const actor = {
            type: "npc",
            name: "Orc",
            flags: {
                pf2e: { rollOptions: { all: {} } },
                "pf2e-creature-sounds": { soundset: "set-orc" },
            },
            system: {
                details: { blurb: "" },
                attributes: {
                    hp: { value: 5 },
                    emitsSound: false,
                },
            },
            items: [],
        } as unknown as ActorPF2e;

        // 1. Should not play
        await playSoundForCreature(actor, "hurt", true, false);
        expect(foundry.audio.AudioHelper.play).not.toHaveBeenCalled();

        // 2. Forced should play
        await playSoundForCreature(actor, "hurt", true, true);
        expect(foundry.audio.AudioHelper.play).toHaveBeenCalled();
    });

    it("should not play sound if silence effect is active unless forced", async () => {
        const actor = {
            type: "npc",
            name: "Orc",
            flags: {
                pf2e: { rollOptions: { all: {} } },
                "pf2e-creature-sounds": { soundset: "set-orc" },
            },
            system: {
                details: { blurb: "" },
                attributes: {
                    hp: { value: 0 },
                    emitsSound: true,
                },
            },
            items: [
                {
                    type: "effect",
                    slug: "spell-effect-silence",
                },
            ],
        } as unknown as ActorPF2e;

        // 1. Death sound should not play due to silence effect
        await playSoundForCreature(actor, "death", true, false);
        expect(foundry.audio.AudioHelper.play).not.toHaveBeenCalled();

        // 2. Forced death sound should play
        await playSoundForCreature(actor, "death", true, true);
        expect(foundry.audio.AudioHelper.play).toHaveBeenCalled();
    });
});
