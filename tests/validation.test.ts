import { describe, it, expect, vi } from "vitest";

vi.mock("../src/settings.ts", () => ({
    SETTINGS_NAMESPACE: "pf2e-creature-sounds",
    SETTINGS: {},
    getSetting: () => false,
}));

import { namesFromSoundDatabase, namesFromSoundDatabaseByCategory, isSoundDatabase } from "../src/utils.ts";
import { SoundDatabase } from "../src/creaturesounds.ts";
import { validateCustomSoundDatabase } from "../src/customsoundsdb.ts";

const validSoundSet = {
    id: "Custom-A",
    display_name: "Set A",
    category: "Humanoids" as const,
    hurt_sounds: ["path/hurt.wav"],
    attack_sounds: [],
    death_sounds: [],
    creatures: [],
    keywords: [],
    traits: [],
    size: 1,
};

const mockDb: SoundDatabase = {
    "Custom-A": { ...validSoundSet },
    "Custom-B": {
        ...validSoundSet,
        id: "Custom-B",
        display_name: "Set B",
        category: "Animals & Beasts",
    },
    "Custom-C": {
        ...validSoundSet,
        id: "Custom-C",
        display_name: "Set C",
        category: "Humanoids",
    },
};

describe("Category Query Logic (namesFromSoundDatabaseByCategory)", () => {
    it("should return only sound sets matching the requested category", () => {
        const results = namesFromSoundDatabaseByCategory(mockDb, "Humanoids");
        expect(results).toHaveLength(2);
        expect(results).toContainEqual({ id: "Custom-A", display_name: "Set A" });
        expect(results).toContainEqual({ id: "Custom-C", display_name: "Set C" });
    });

    it("should return the correct shape without extra fields", () => {
        const results = namesFromSoundDatabaseByCategory(mockDb, "Animals & Beasts");
        expect(results).toEqual([{ id: "Custom-B", display_name: "Set B" }]);
    });

    it("should return an empty array when no sound sets match", () => {
        const results = namesFromSoundDatabaseByCategory(mockDb, "Undead & Spirits");
        expect(results).toEqual([]);
    });
});

describe("Database Name Mapping (namesFromSoundDatabase)", () => {
    it("should include id, display_name, and category in each result", () => {
        const results = namesFromSoundDatabase(mockDb);
        expect(results).toHaveLength(3);
        for (const entry of results) {
            expect(entry).toHaveProperty("id");
            expect(entry).toHaveProperty("display_name");
            expect(entry).toHaveProperty("category");
        }
    });

    it("should map category values correctly", () => {
        const results = namesFromSoundDatabase(mockDb);
        const setB = results.find(r => r.id === "Custom-B");
        expect(setB?.category).toBe("Animals & Beasts");
    });
});

describe("Schema Validation (isSoundDatabase)", () => {
    it("should validate a correct SoundDatabase", () => {
        expect(isSoundDatabase(mockDb)).toBe(true);
    });

    it("should reject entries with an invalid category", () => {
        const invalidDb = {
            "Custom-X": { ...validSoundSet, id: "Custom-X", category: "Not A Real Category" },
        };
        expect(isSoundDatabase(invalidDb)).toBe(false);
    });

    it("should reject entries with a missing category field", () => {
        const { category: _, ...noCategorySet } = validSoundSet;
        const invalidDb = { "Custom-X": { ...noCategorySet, id: "Custom-X" } };
        expect(isSoundDatabase(invalidDb)).toBe(false);
    });

    it("should reject entries where sound arrays contain non-strings", () => {
        const invalidDb = {
            "Custom-X": { ...validSoundSet, id: "Custom-X", hurt_sounds: [123, "valid.wav"] },
        };
        expect(isSoundDatabase(invalidDb)).toBe(false);
    });
});

describe("Custom Database Validation (validateCustomSoundDatabase)", () => {
    it("should reject databases where IDs don't start with Custom-", () => {
        const invalidDb: SoundDatabase = {
            "Wrong-123": { ...validSoundSet, id: "Wrong-123" },
        };
        expect(validateCustomSoundDatabase(invalidDb)).toBe("invalid_id_format");
    });
});
