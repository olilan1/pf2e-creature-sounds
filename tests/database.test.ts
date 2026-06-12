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

    it("should not contain duplicate keywords or creatures within any sound set", () => {
        const soundDatabase = importedDb.default;

        for (const [key, soundSet] of Object.entries(soundDatabase)) {
            const creatures = soundSet.creatures || [];
            const keywords = soundSet.keywords || [];

            const seenCreatures = new Set<string>();
            for (const c of creatures) {
                const normalized = c.toLowerCase().trim();
                const hasDup = seenCreatures.has(normalized);
                expect(
                    hasDup,
                    `Duplicate creature '${c}' in sound set '${key}'`
                ).toBe(false);
                seenCreatures.add(normalized);
            }

            const seenKeywords = new Set<string>();
            for (const k of keywords) {
                const normalized = k.toLowerCase().trim();
                const hasDup = seenKeywords.has(normalized);
                expect(
                    hasDup,
                    `Duplicate keyword '${k}' in sound set '${key}'`
                ).toBe(false);
                seenKeywords.add(normalized);
            }
        }
    });

    it("should not share keywords between categories with the same size", () => {
        const soundDatabase = importedDb.default;
        const keywordsMap = new Map<string, Array<{ key: string; size: number }>>();

        for (const [key, soundSet] of Object.entries(soundDatabase)) {
            const keywords = soundSet.keywords || [];
            const size = soundSet.size !== undefined ? (soundSet.size as number) : -1;

            for (const k of keywords) {
                const normalized = k.toLowerCase().trim();
                if (!keywordsMap.has(normalized)) {
                    keywordsMap.set(normalized, []);
                }
                keywordsMap.get(normalized)!.push({ key, size });
            }
        }

        for (const [keyword, entries] of keywordsMap.entries()) {
            const sizeGroups = new Map<number, string[]>();
            for (const entry of entries) {
                if (!sizeGroups.has(entry.size)) {
                    sizeGroups.set(entry.size, []);
                }
                sizeGroups.get(entry.size)!.push(entry.key);
            }

            for (const [size, keys] of sizeGroups.entries()) {
                expect(
                    keys.length,
                    `Keyword '${keyword}' is duplicated across categories with size ${size}: ` +
                        keys.join(", ")
                ).toBeLessThanOrEqual(1);
            }
        }
    });

    it("should not have the same string as both a creature and keyword at the same size", () => {
        const soundDatabase = importedDb.default;
        const creaturesMap = new Map<string, Array<{ key: string; size: number }>>();
        const keywordsMap = new Map<string, Array<{ key: string; size: number }>>();

        for (const [key, soundSet] of Object.entries(soundDatabase)) {
            const creatures = soundSet.creatures || [];
            const keywords = soundSet.keywords || [];
            const size = soundSet.size !== undefined ? (soundSet.size as number) : -1;

            for (const c of creatures) {
                const normalized = c.toLowerCase().trim();
                if (!creaturesMap.has(normalized)) {
                    creaturesMap.set(normalized, []);
                }
                creaturesMap.get(normalized)!.push({ key, size });
            }

            for (const k of keywords) {
                const normalized = k.toLowerCase().trim();
                if (!keywordsMap.has(normalized)) {
                    keywordsMap.set(normalized, []);
                }
                keywordsMap.get(normalized)!.push({ key, size });
            }
        }

        for (const [name, creatureEntries] of creaturesMap.entries()) {
            const keywordEntries = keywordsMap.get(name);
            if (!keywordEntries) continue;

            for (const ce of creatureEntries) {
                for (const ke of keywordEntries) {
                    if (ce.size === ke.size) {
                        const errMsg =
                            `String '${name}' appears as a creature in '${ce.key}' ` +
                            `and as a keyword in '${ke.key}' with the same size (${ce.size})`;
                        expect(ce.size !== ke.size, errMsg).toBe(true);
                    }
                }
            }
        }
    });
});

