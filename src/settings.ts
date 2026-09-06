import { CustomSoundsApp } from "./ui/customsounds.ts";
import { ActorListApp } from "./ui/actorlist.ts";

export const SETTINGS_NAMESPACE = "pf2e-creature-sounds";

export const SETTINGS = {
    CREATURE_SOUNDS: "creatureSounds_enable",
    CREATURE_SOUNDS_CHARACTER: "creatureSounds_characters",
    CREATURE_SOUNDS_VOLUME: "creatureSounds_volume",
    CREATURE_ATTACK_SOUNDS: "creatureSounds_attack_enable",
    CREATURE_HURT_SOUNDS: "creatureSounds_hurt_enable",
    PLAYERS_CAN_EDIT: "players_can_edit",
    SOUNDBOARD_ENABLED: "soundboard_enabled",
    DEBUG_LOGGING: "debug_logging"
} as const;

export type SettingsKey = typeof SETTINGS[keyof typeof SETTINGS];

export function registerSettings(): void {
    game.settings.registerMenu(SETTINGS_NAMESPACE, "CustomSoundsApp", {
        name: "Custom Sounds Sets",
        label: "Manage Custom Sound Sets",
        hint: "Create your own sound sets to apply to creatures",
        icon: "fa-solid fa-spaghetti-monster-flying",
        type: CustomSoundsApp,
        restricted: true,
    });

    game.settings.registerMenu(SETTINGS_NAMESPACE, "ActorListApp", {
        name: "Overview of Creature Sounds",
        label: "Creature Sounds Overview",
        hint: "Get an overview of your actors and the sounds associated with them.",
        icon: "fa-solid fa-users",
        type: ActorListApp,
        restricted: true,
    });

    game.settings.register(SETTINGS_NAMESPACE, SETTINGS.CREATURE_SOUNDS, {
        name: "Creature sounds",
        hint: "Enable creature-specific sounds",
        scope: "world",
        config: true,
        default: true,
        type: Boolean
    });

    game.settings.register(SETTINGS_NAMESPACE, SETTINGS.CREATURE_SOUNDS_VOLUME, {
        name: "Creature sound volume",
        hint: "Base volume for creature sounds for all users. Played on the "
            + "Environment channel, so each user's Environment volume slider is "
            + "also taken into account.",
        scope: "world",
        config: true,
        default: 0.5,
        // @ts-expect-error (range is ok)
        range: {
            min: 0,
            max: 1,
            step: 0.1
        },
        type: Number
    });

    game.settings.register(SETTINGS_NAMESPACE, SETTINGS.CREATURE_SOUNDS_CHARACTER, {
        name: "Character sounds",
        hint: "Enable creature sounds functionality for player characters",
        scope: "world",
        config: true,
        default: true,
        type: Boolean
    });

    game.settings.register(SETTINGS_NAMESPACE, SETTINGS.CREATURE_ATTACK_SOUNDS, {
        name: "Attack sounds",
        hint: "Enable creature sounds functionality for attacks",
        scope: "world",
        config: true,
        default: true,
        type: Boolean
    });

    game.settings.register(SETTINGS_NAMESPACE, SETTINGS.CREATURE_HURT_SOUNDS, {
        name: "Hurt sounds",
        hint: "Enable creature sounds functionality for being hurt",
        scope: "world",
        config: true,
        default: true,
        type: Boolean
    });

    game.settings.register(SETTINGS_NAMESPACE, SETTINGS.PLAYERS_CAN_EDIT, {
        name: "Allow Players to Edit Sounds",
        hint: "Allow players to edit creature sounds for actors they own",
        scope: "world",
        config: true,
        default: true,
        type: Boolean
    });

    game.settings.register(SETTINGS_NAMESPACE, SETTINGS.SOUNDBOARD_ENABLED, {
        name: "Enable Soundboard",
        hint: "Enables the soundboard in the Playlists sidebar tab for GMs (requires reload)",
        scope: "world",
        config: true,
        default: true,
        requiresReload: true,
        type: Boolean
    });

    game.settings.register(SETTINGS_NAMESPACE, SETTINGS.DEBUG_LOGGING, {
        name: "Debug logging",
        hint: "Log debug info to console",
        scope: "world",
        config: true,
        default: false,
        type: Boolean
    });
}

export function getSetting(setting: SettingsKey) {
    return game.settings.get(SETTINGS_NAMESPACE, setting);
}