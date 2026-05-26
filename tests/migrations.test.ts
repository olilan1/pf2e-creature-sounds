import { describe, it, expect, vi } from "vitest";

vi.mock("../src/settings.ts", () => ({
    SETTINGS_NAMESPACE: "pf2e-creature-sounds",
    SETTINGS: {},
    getSetting: () => false,
}));

import { CURRENT_DB_VERSION, migrations, migrateCustomSoundDatabase } from "../src/customsoundsdb.ts";
import { SoundDatabase, CUSTOM_CATEGORY, SoundCategory } from "../src/creaturesounds.ts";
import { beforeEach } from "vitest";

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

describe("migrateCustomSoundDatabase Orchestration", () => {
    let mockStore: Record<string, unknown> = {};

    beforeEach(() => {
        mockStore = {};
        vi.stubGlobal("game", {
            settings: {
                get: (_namespace: string, key: string) => mockStore[key],
                set: async (_namespace: string, key: string, value: unknown) => {
                    mockStore[key] = value;
                },
            },
        });
    });

    it("should bail out early if stored version is current", async () => {
        mockStore["custom_sound_sets_version"] = CURRENT_DB_VERSION;
        const getSpy = vi.spyOn(game.settings, "get");
        const setSpy = vi.spyOn(game.settings, "set");

        await migrateCustomSoundDatabase();

        // Verify we never read the actual sound sets database
        expect(getSpy).not.toHaveBeenCalledWith(
            "pf2e-creature-sounds",
            "custom_sound_sets"
        );

        // Verify we never wrote anything
        expect(setSpy).not.toHaveBeenCalled();
    });

    it("should run migrations sequentially if stored version is behind", async () => {
        mockStore["custom_sound_sets_version"] = 0;
        mockStore["custom_sound_sets"] = {
            data: [],
        };

        const dummyMigrations = new Map<number, (db: SoundDatabase) => SoundDatabase>([
            [1, (db) => {
                (db as unknown as { data: string[] }).data.push("v1");
                return db;
            }],
            [2, (db) => {
                (db as unknown as { data: string[] }).data.push("v2");
                return db;
            }],
        ]);

        const getSpy = vi.spyOn(migrations, "get").mockImplementation(
            (v) => dummyMigrations.get(v) as (db: SoundDatabase) => SoundDatabase
        );

        await migrateCustomSoundDatabase(2);

        const db = mockStore["custom_sound_sets"] as unknown as { data: string[] };
        expect(db.data).toEqual(["v1", "v2"]);
        expect(mockStore["custom_sound_sets_version"]).toBe(2);

        getSpy.mockRestore();
    });
});
