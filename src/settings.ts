import { CustomSoundsApp } from "./customsounds.ts";
import { SoundDatabase, SoundSet, SoundType } from "./creaturesounds.ts"
import { logd, soundTypeToField } from "./utils.ts";

const SETTINGS_NAMESPACE = "pf2e-creature-sounds";
const CUSTOM_SOUND_SETS = "custom_sound_sets";

export const SETTINGS = {
    CREATURE_SOUNDS: "creatureSounds_enable",
    CREATURE_SOUNDS_CHARACTER: "creatureSounds_characters",
    CREATURE_SOUNDS_VOLUME: "creatureSounds_volume",
    CREATURE_ATTACK_SOUNDS: "creatureSounds_attack_enable",
    CREATURE_HURT_SOUNDS: "creatureSounds_hurt_enable",
    PLAYERS_CAN_EDIT: "players_can_edit",
    DEBUG_LOGGING: "debug_logging"
};

export function registerSettings(): void {
    game.settings.registerMenu(SETTINGS_NAMESPACE, "CustomSoundsApp", {
        name: "Custom Sounds Sets",
        label: "Manage Custom Sound Sets",
        hint: "Create your own sound sets to apply to creatures",
        icon: "fa-solid fa-spaghetti-monster-flying",
        // @ts-expect-error (type is ok)
        type: CustomSoundsApp,
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

    game.settings.register(SETTINGS_NAMESPACE, SETTINGS.CREATURE_SOUNDS_VOLUME, {
        name: "Creature sound volume",
        hint: "Volume for those creature sounds",
        scope: "client",
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

    game.settings.register(SETTINGS_NAMESPACE, SETTINGS.PLAYERS_CAN_EDIT, {
        name: "Allow Players to Edit Sounds",
        hint: "Allow players to edit creature sounds for actors they own",
        scope: "world",
        config: true,
        default: true,
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

    game.settings.register(SETTINGS_NAMESPACE, CUSTOM_SOUND_SETS, {
        name: "Custom Sound Sets",
        scope: "world",
        default: {},
        config: false,
        type: Object
    });
}

export function getSetting(setting: string) {
    return game.settings.get(SETTINGS_NAMESPACE, setting);
}

function getCustomSoundDatabase(): SoundDatabase {
    return game.settings.get(SETTINGS_NAMESPACE, CUSTOM_SOUND_SETS) as SoundDatabase;
}

function setCustomSoundDatabase(soundSets: SoundDatabase) {
    game.settings.set(SETTINGS_NAMESPACE, CUSTOM_SOUND_SETS, soundSets);
}

export function updateCustomSoundSet(soundSet: SoundSet) {
    const currentSoundDatabase = getCustomSoundDatabase();
    currentSoundDatabase[soundSet.id] = soundSet;
    setCustomSoundDatabase(currentSoundDatabase);
}

export function getCustomSoundSet(soundSetId: string) {
    const currentSoundDatabase = getCustomSoundDatabase();
    return currentSoundDatabase[soundSetId];
}

export function deleteCustomSoundSet(soundSetId: string) {
    const currentSoundDatabase = getCustomSoundDatabase();
    delete currentSoundDatabase[soundSetId];
    setCustomSoundDatabase(currentSoundDatabase);  
}

export function getCustomSoundSetNames() {
    const result = Object.entries(getCustomSoundDatabase())
        .map(([key, value]) => ({id: key, display_name: value.display_name}));
    logd(result);
    return result;
}

export function updateCustomSoundSetDisplayName(soundSetId: string, displayName: string) {
    const currentSoundSet = getCustomSoundSet(soundSetId);
    currentSoundSet.display_name = displayName;
    updateCustomSoundSet(currentSoundSet);
}

export function addSoundToCustomSoundSet(soundSetId: string, soundType: SoundType, path: string) {
    const currentSoundSet = getCustomSoundSet(soundSetId);
    const soundTypeField = soundTypeToField(soundType);
    currentSoundSet[soundTypeField].push(path);
    updateCustomSoundSet(currentSoundSet);
}

export function deleteSoundFromCustomSoundSet(soundSetId: string, soundType: SoundType, index: number) {
    const currentSoundSet = getCustomSoundSet(soundSetId);
    const soundTypeField = soundTypeToField(soundType);
    currentSoundSet[soundTypeField].splice(index, 1);
    updateCustomSoundSet(currentSoundSet);
}