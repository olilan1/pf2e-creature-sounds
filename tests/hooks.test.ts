import { beforeEach, describe, expect, it, vi } from "vitest";
import { ChatMessagePF2e } from "foundry-pf2e";

let mockSettings: Record<string, boolean> = {};

vi.hoisted(() => {
    (global as unknown as { Hooks: unknown }).Hooks = {
        on: () => {},
    };
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
    (global as unknown as { game: unknown }).game = {
        user: { isGM: false, id: "user-123" },
        settings: { get: () => {}, set: () => {} },
    };
});

vi.mock("../src/settings.ts", () => ({
    SETTINGS: {
        A: "setting_a",
        B: "setting_b",
    },
    getSetting: (key: string) => mockSettings[key] ?? false,
}));

vi.mock("../src/ui/actorsoundselect.ts", () => ({
    ActorSoundSelectApp: class {},
}));

vi.mock("../src/ui/soundboard.ts", () => ({
    loadSoundboardUI: () => {},
}));

vi.mock("../src/customsoundsdb.ts", () => ({
    registerCustomSoundsDb: () => {},
    migrateCustomSoundDatabase: () => {},
}));

// Now safely import HookRunner
import { HookRunner } from "../src/hooks.ts";

describe("HookRunner", () => {
    beforeEach(() => {
        mockSettings = {};
        (global as unknown as { game: unknown }).game = {
            user: {
                isGM: false,
                id: "user-123",
            },
        };
    });

    it("should run the function by default", () => {
        const spy = vi.fn();
        const runner = new HookRunner(spy, 1, "test");
        runner.run();
        expect(spy).toHaveBeenCalledWith(1, "test");
    });

    it("should not run if an enabled check fails", () => {
        const spy = vi.fn();
        mockSettings["setting_a"] = false;
        mockSettings["setting_b"] = true;

        // @ts-expect-error - mock settings keys
        const runner = new HookRunner(spy).ifEnabled("setting_a", "setting_b");
        runner.run();
        expect(spy).not.toHaveBeenCalled();
    });

    it("should run if all enabled checks pass", () => {
        const spy = vi.fn();
        mockSettings["setting_a"] = true;
        mockSettings["setting_b"] = true;

        // @ts-expect-error - mock settings keys
        const runner = new HookRunner(spy).ifEnabled("setting_a", "setting_b");
        runner.run();
        expect(spy).toHaveBeenCalled();
    });

    it("should not run if ifGM is called and user is not GM", () => {
        const spy = vi.fn();
        (global as unknown as { game: unknown }).game = {
            user: { isGM: false },
        };

        const runner = new HookRunner(spy).ifGM();
        runner.run();
        expect(spy).not.toHaveBeenCalled();
    });

    it("should run if ifGM is called and user is GM", () => {
        const spy = vi.fn();
        (global as unknown as { game: unknown }).game = {
            user: { isGM: true },
        };

        const runner = new HookRunner(spy).ifGM();
        runner.run();
        expect(spy).toHaveBeenCalled();
    });

    it("should not run if user is not the message poster", () => {
        const spy = vi.fn();
        const mockMessage = {
            author: { id: "user-456" },
        } as unknown as ChatMessagePF2e;

        (global as unknown as { game: unknown }).game = {
            user: { id: "user-123" },
        };

        const runner = new HookRunner(spy, mockMessage).ifMessagePoster();
        runner.run();
        expect(spy).not.toHaveBeenCalled();
    });

    it("should run if user is the message poster", () => {
        const spy = vi.fn();
        const mockMessage = {
            author: { id: "user-123" },
        } as unknown as ChatMessagePF2e;

        (global as unknown as { game: unknown }).game = {
            user: { id: "user-123" },
        };

        const runner = new HookRunner(spy, mockMessage).ifMessagePoster();
        runner.run();
        expect(spy).toHaveBeenCalled();
    });
});
