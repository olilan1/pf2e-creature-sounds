import { SoundDatabase, SoundSet, SoundType } from "./creaturesounds.ts";
import { SETTINGS_NAMESPACE } from "./settings.ts";
import { namesFromSoundDatabase, soundTypeToField } from "./utils.ts";

const CUSTOM_SOUND_SETS = "custom_sound_sets";

export function registerCustomSoundsDb() : void {
    game.settings.register(SETTINGS_NAMESPACE, CUSTOM_SOUND_SETS, {
        name: "Custom Sound Sets",
        scope: "world",
        default: {},
        config: false,
        type: Object
    });
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
    return namesFromSoundDatabase(getCustomSoundDatabase());
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

export function deleteSoundFromCustomSoundSet(
        soundSetId: string, soundType: SoundType, index: number) {
    const currentSoundSet = getCustomSoundSet(soundSetId);
    const soundTypeField = soundTypeToField(soundType);
    currentSoundSet[soundTypeField].splice(index, 1);
    updateCustomSoundSet(currentSoundSet);
}