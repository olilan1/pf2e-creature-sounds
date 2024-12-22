import { SoundDatabase, SoundSet, SoundType } from "./creaturesounds.ts";
import { SETTINGS_NAMESPACE } from "./settings.ts";
import { namesFromSoundDatabase, soundTypeToField } from "./utils.ts";
import { saveAs } from 'file-saver';

const CUSTOM_SOUND_SETS = "custom_sound_sets";

export function registerCustomSoundsDb(): void {
    game.settings.register(SETTINGS_NAMESPACE, CUSTOM_SOUND_SETS, {
        name: "Custom Sound Sets",
        scope: "world",
        default: {},
        config: false,
        type: Object
    });
}

async function getCustomSoundDatabase(): Promise<SoundDatabase> {
    return game.settings.get(SETTINGS_NAMESPACE, CUSTOM_SOUND_SETS) as SoundDatabase;
}

async function setCustomSoundDatabase(soundSets: SoundDatabase) {
    await game.settings.set(SETTINGS_NAMESPACE, CUSTOM_SOUND_SETS, soundSets);
}

export async function updateCustomSoundSet(soundSet: SoundSet) {
    const currentSoundDatabase = await getCustomSoundDatabase();
    currentSoundDatabase[soundSet.id] = soundSet;
    await setCustomSoundDatabase(currentSoundDatabase);
}

export async function getCustomSoundSet(soundSetId: string) {
    const currentSoundDatabase = await getCustomSoundDatabase();
    return currentSoundDatabase[soundSetId];
}

export async function deleteCustomSoundSet(soundSetId: string) {
    const currentSoundDatabase = await getCustomSoundDatabase();
    delete currentSoundDatabase[soundSetId];
    await setCustomSoundDatabase(currentSoundDatabase);
}

export async function deleteAllCustomSoundSets() {
    await setCustomSoundDatabase({});
}

export async function getCustomSoundSetNames() {
    return namesFromSoundDatabase(await getCustomSoundDatabase());
}

export async function updateCustomSoundSetDisplayName(soundSetId: string, displayName: string) {
    const currentSoundSet = await getCustomSoundSet(soundSetId);
    currentSoundSet.display_name = displayName;
    await updateCustomSoundSet(currentSoundSet);
}

export async function addSoundToCustomSoundSet(soundSetId: string, soundType: SoundType, path: string) {
    const currentSoundSet = await getCustomSoundSet(soundSetId);
    const soundTypeField = soundTypeToField(soundType);
    currentSoundSet[soundTypeField].push(path);
    await updateCustomSoundSet(currentSoundSet);
}

export async function deleteSoundFromCustomSoundSet(
    soundSetId: string, soundType: SoundType, index: number) {
    const currentSoundSet = await getCustomSoundSet(soundSetId);
    const soundTypeField = soundTypeToField(soundType);
    currentSoundSet[soundTypeField].splice(index, 1);
    await updateCustomSoundSet(currentSoundSet);
}

export function downloadSoundSetsAsJSON() {
    const jsonObject = getCustomSoundDatabase();
    const jsonString = JSON.stringify(jsonObject);
    const blob = new Blob([jsonString], { type: 'application/json' });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `customSounds_${timestamp}.json`;

    saveAs(blob, filename);
}

export function overwriteSoundSetsWithJSON(soundDatabase: SoundDatabase) {
    let entries = 0;
    for (const entry in soundDatabase) {
        updateCustomSoundSet(soundDatabase[entry]);
        entries++;
    }
    return entries;
}

export function isSoundDatabase(obj: unknown): obj is SoundDatabase {
    if (typeof obj !== 'object' || obj === null) {
        return false;
    }
    const isValidStructure = Object.values(obj).every((entry: unknown) => {
        return (
            typeof entry === 'object' &&
            entry !== null &&
            'id' in entry &&
            'display_name' in entry &&
            'hurt_sounds' in entry &&
            'attack_sounds' in entry &&
            'death_sounds' in entry &&
            'creatures' in entry &&
            'keywords' in entry &&
            'traits' in entry &&
            'size' in entry &&
            Array.isArray(entry.hurt_sounds) &&
            Array.isArray(entry.attack_sounds) &&
            Array.isArray(entry.death_sounds) &&
            Array.isArray(entry.creatures) &&
            Array.isArray(entry.keywords) &&
            Array.isArray(entry.traits) &&
            typeof entry.size === 'number'
        );
    });
    
    return isValidStructure;
}

export type ValidationResult = 'OK' | 'duplicate_ids' | 'invalid_id_format' | 'name_id_mismatch';

export function validateSoundDatabase(soundDatabase: SoundDatabase): ValidationResult {
    // 1. Validate unique IDs
    const ids = Object.keys(soundDatabase);
    const hasUniqueIds = new Set(ids).size === ids.length;

    // 2. Validate ID format
    const validIdFormat = ids.every((id: string) => id.startsWith('Custom-'));

    // 3. Validate object name and ID match
    const validNameIdMatch = Object.keys(soundDatabase).every((key: string) => {
        const entry = soundDatabase[key];
        return key === entry.id;
    });
    // Return correct error message
    if (!hasUniqueIds) {
        return "duplicate_ids";
    }
    if (!validIdFormat) {
        return "invalid_id_format";
    }
    if (!validNameIdMatch) {
        return "name_id_mismatch";
    } 
    // 4. If all validations pass return true
    return "OK";
}