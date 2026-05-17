import { describe, it, expect, vi } from "vitest";

vi.mock("../src/settings.ts", () => ({
    SETTINGS_NAMESPACE: "pf2e-creature-sounds",
    SETTINGS: {},
    getSetting: () => false,
}));

import { CURRENT_DB_VERSION, migrations } from "../src/customsoundsdb.ts";
import { SoundDatabase, CUSTOM_CATEGORY, SoundCategory } from "../src/creaturesounds.ts";

describe("Custom Sound Database Migrations", () => {
    it("should have a migration for every version from 1 to CURRENT_DB_VERSION", () => {
        for (let version = 1; version <= CURRENT_DB_VERSION; version++) {
            expect(
                migrations.has(version),
                `Missing migration for version ${version}`
            ).toBe(true);
        }
    });

    it("migration 1 should add category to sound sets missing it", () => {
        const migrate = migrations.get(1)!;
        const db: SoundDatabase = {
            "Custom-123": {
                id: "Custom-123",
                display_name: "Test Sound",
                category: "" as unknown as SoundCategory,
                hurt_sounds: [],
                attack_sounds: [],
                death_sounds: [],
                creatures: [],
                keywords: [],
                traits: [],
                size: -1,
            },
        };

        const result = migrate(db);
        expect(result["Custom-123"].category).toBe(CUSTOM_CATEGORY);
    });

    it("migration 1 should not overwrite existing categories", () => {
        const migrate = migrations.get(1)!;
        const db: SoundDatabase = {
            "Custom-456": {
                id: "Custom-456",
                display_name: "Existing Category",
                category: CUSTOM_CATEGORY,
                hurt_sounds: [],
                attack_sounds: [],
                death_sounds: [],
                creatures: [],
                keywords: [],
                traits: [],
                size: -1,
            },
        };

        const result = migrate(db);
        expect(result["Custom-456"].category).toBe(CUSTOM_CATEGORY);
    });
});
