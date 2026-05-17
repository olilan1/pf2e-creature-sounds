import { describe, it, expect, vi } from "vitest";

vi.mock("../src/settings.ts", () => ({
    SETTINGS: {},
    getSetting: () => false,
    registerSettings: () => {}
}));

import { DB_SOUND_CATEGORIES } from "../src/creaturesounds.ts";
import * as importedDb from "../databases/creature_sounds_db.json" with { type: "json" };

describe("Creature Sounds Database", () => {
    it("should have valid categories for all sound sets", () => {
        const soundDatabase = importedDb.default;
        const validCategories: string[] = [...DB_SOUND_CATEGORIES];

        for (const [key, soundSet] of Object.entries(soundDatabase)) {
            expect(
                validCategories.includes(soundSet.category as string),
                `SoundSet '${key}' has an invalid category '${soundSet.category}'. Expected one of: ${validCategories.join(", ")}`
            ).toBe(true);
        }
    });
});
