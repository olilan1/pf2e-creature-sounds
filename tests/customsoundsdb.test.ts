import { beforeEach, describe, expect, it, vi } from "vitest";

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
    };
});

vi.mock("../src/ui/customsounds.ts", () => ({
    CustomSoundsApp: class {},
}));

vi.mock("../src/ui/actorlist.ts", () => ({
    ActorListApp: class {},
}));

let mockStore: Record<string, unknown> = {};

vi.stubGlobal("game", {
    settings: {
        register: vi.fn(),
        get: (_namespace: string, key: string) => mockStore[key],
        set: async (_namespace: string, key: string, value: unknown) => {
            mockStore[key] = value;
        },
    },
});

vi.mock("file-saver", () => ({
    saveAs: vi.fn(),
}));

import { SoundSet, SoundDatabase } from "../src/creaturesounds.ts";
import {
    updateCustomSoundSet,
    getCustomSoundSet,
    deleteCustomSoundSet,
    deleteAllCustomSoundSets,
    getCustomSoundSetNames,
    updateCustomSoundSetDisplayName,
    addSoundToCustomSoundSet,
    deleteSoundFromCustomSoundSet,
    updateSoundSetsWithSoundDatabase,
} from "../src/customsoundsdb.ts";

const mockSet: SoundSet = {
    id: "Custom-123",
    display_name: "Mock Sound Set",
    category: "Custom Sound Sets",
    hurt_sounds: ["hurt.wav"],
    attack_sounds: ["attack.wav"],
    death_sounds: ["death.wav"],
    creatures: [],
    keywords: [],
    traits: [],
    size: 1,
};

describe("Custom Sounds Database Operations", () => {
    beforeEach(() => {
        mockStore = {
            custom_sound_sets: {
                "Custom-123": JSON.parse(JSON.stringify(mockSet)),
            },
        };
    });

    it("should retrieve a custom sound set", async () => {
        const result = await getCustomSoundSet("Custom-123");
        expect(result).toBeDefined();
        expect(result.display_name).toBe("Mock Sound Set");
    });

    it("should add a new custom sound set", async () => {
        const newSet: SoundSet = {
            ...mockSet,
            id: "Custom-456",
            display_name: "New Set",
        };
        await updateCustomSoundSet(newSet);
        const result = await getCustomSoundSet("Custom-456");
        expect(result).toBeDefined();
        expect(result.display_name).toBe("New Set");
    });

    it("should delete a custom sound set", async () => {
        await deleteCustomSoundSet("Custom-123");
        const result = await getCustomSoundSet("Custom-123");
        expect(result).toBeUndefined();
    });

    it("should delete all custom sound sets", async () => {
        await deleteAllCustomSoundSets();
        const db = mockStore["custom_sound_sets"] as SoundDatabase;
        expect(Object.keys(db)).toHaveLength(0);
    });

    it("should get custom sound set names with categories", async () => {
        const names = await getCustomSoundSetNames();
        expect(names).toEqual([
            {
                id: "Custom-123",
                display_name: "Mock Sound Set",
                category: "Custom Sound Sets",
            },
        ]);
    });

    it("should update custom sound set display name", async () => {
        await updateCustomSoundSetDisplayName("Custom-123", "New Name");
        const result = await getCustomSoundSet("Custom-123");
        expect(result.display_name).toBe("New Name");
    });

    it("should add a sound to custom sound set", async () => {
        await addSoundToCustomSoundSet("Custom-123", "hurt", "new_hurt.wav");
        const result = await getCustomSoundSet("Custom-123");
        expect(result.hurt_sounds).toContain("new_hurt.wav");
    });

    it("should delete a sound from custom sound set", async () => {
        await deleteSoundFromCustomSoundSet("Custom-123", "hurt", 0);
        const result = await getCustomSoundSet("Custom-123");
        expect(result.hurt_sounds).toHaveLength(0);
    });

    it("should update sound sets with database", async () => {
        const newDb: SoundDatabase = {
            "Custom-789": {
                ...mockSet,
                id: "Custom-789",
                display_name: "Imported Set",
            },
        };
        const count = await updateSoundSetsWithSoundDatabase(newDb);
        expect(count).toBe(1);
        const result = await getCustomSoundSet("Custom-789");
        expect(result).toBeDefined();
        expect(result.display_name).toBe("Imported Set");
    });
});
