import { describe, expect, it, vi } from "vitest";

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

vi.stubGlobal("game", {
    settings: {
        get: vi.fn(),
    },
});

import { getHashCode, truncateStringWithEllipsis, getActorName } from "../src/utils.ts";
import { ActorPF2e } from "foundry-pf2e";

describe("Utility Functions", () => {
    describe("getHashCode", () => {
        it("should safely handle an empty string", () => {
            expect(() => getHashCode("")).not.toThrow();
            expect(typeof getHashCode("")).toBe("number");
            expect(getHashCode("")).toBe(getHashCode(""));
        });

        it("should return deterministic hashes", () => {
            expect(getHashCode("hello")).toBe(getHashCode("hello"));
            expect(getHashCode("test")).toBe(getHashCode("test"));
        });

        it("should distribute hashes non-trivially", () => {
            const inputs = ["hello", "test", "actor", "sound", "creature"];
            const hashes = new Set(inputs.map(getHashCode));
            expect(hashes.size).toBeGreaterThan(1);
        });
    });

    describe("truncateStringWithEllipsis", () => {
        it("should return short string unmodified if below the limit", () => {
            expect(truncateStringWithEllipsis("abc", 5)).toBe("abc");
        });

        it("should truncate long strings and append ellipsis", () => {
            expect(truncateStringWithEllipsis("hello world", 8)).toBe("hello...");
        });

        it("should handle limit below or equal to ellipsis length", () => {
            expect(truncateStringWithEllipsis("hello", 2)).toBe("he");
        });
    });

    describe("getActorName", () => {
        it("should return babele originalName if present in flags", () => {
            const actor = {
                name: "Localized Name",
                flags: {
                    babele: {
                        originalName: "Original Name",
                    },
                },
            } as unknown as ActorPF2e;
            expect(getActorName(actor)).toBe("Original Name");
        });

        it("should default to name if babele flag is missing", () => {
            const actor = {
                name: "Standard Name",
                flags: {},
            } as unknown as ActorPF2e;
            expect(getActorName(actor)).toBe("Standard Name");
        });
    });
});
