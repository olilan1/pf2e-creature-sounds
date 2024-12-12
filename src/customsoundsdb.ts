import { SoundDatabase, SoundSet, SoundType } from "./creaturesounds.ts";
import { SETTINGS_NAMESPACE } from "./settings.ts";
import { postUINotification } from "./ui/customsounds.ts";
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

export function downloadSoundSetsAsJSON() {
    const jsonObject = getCustomSoundDatabase();
    const jsonString = JSON.stringify(jsonObject);
    const blob = new Blob([jsonString], { type: 'application/json' });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `customSounds_${timestamp}.json`;

    saveAs(blob, filename);
}

export function overwriteSoundSetsWithJSON(jsonObject: any) {
    const newSoundSets = translateJSONObject(jsonObject);
    let entries = 0;
    for (const entry in newSoundSets) {
        updateCustomSoundSet(newSoundSets[entry]);
        entries++;
    }
    postUINotification(`Custom Sounds updated successfully with ${entries} entries`, `info`)
}

function translateJSONObject(jsonObject: any): { [key: string]: SoundSet } {
    const soundSets: { [key: string]: SoundSet } = {};

    for (const key in jsonObject) {
        const entry = jsonObject[key];
        soundSets[key] = {
            id: entry.id,
            display_name: entry.display_name,
            notes: entry.notes || '',
            hurt_sounds: entry.hurt_sounds,
            attack_sounds: entry.attack_sounds,
            death_sounds: entry.death_sounds,
            creatures: entry.creatures,
            keywords: entry.keywords,
            traits: entry.traits,
            size: entry.size,
        };
    }

    return soundSets;
}

export async function validateJSONObject(jsonObject: any) {
    // 1. Validate the JSON object structure
    const isValidStructure = Object.values(jsonObject).every((entry: any) => {
        return (
            typeof entry === 'object' &&
            entry !== null &&
            entry.hasOwnProperty('id') &&
            entry.hasOwnProperty('display_name') &&
            entry.hasOwnProperty('hurt_sounds') &&
            Array.isArray(entry.hurt_sounds) &&
            entry.hasOwnProperty('attack_sounds') &&
            Array.isArray(entry.attack_sounds) &&
            entry.hasOwnProperty('death_sounds') &&
            Array.isArray(entry.death_sounds) &&
            entry.hasOwnProperty('creatures') &&
            Array.isArray(entry.creatures) &&
            entry.hasOwnProperty('keywords') &&
            Array.isArray(entry.keywords) &&
            entry.hasOwnProperty('traits') &&
            Array.isArray(entry.traits) &&
            entry.hasOwnProperty('size') &&
            typeof entry.size === 'number'
        );
    });

    // 2. Validate unique IDs
    const ids = Object.values(jsonObject).map((entry: any) => entry.id);
    const hasUniqueIds = new Set(ids).size === ids.length;

    // 3. Validate ID format
    const validIdFormat = ids.every((id: string) => id.startsWith('Custom-'));

    // 4. Validate object name and ID match
    const validNameIdMatch = Object.keys(jsonObject).every((key: string) => {
        const entry = jsonObject[key];
        return key === entry.id;
    });

    // 5. If all validations pass return true
    if (isValidStructure && hasUniqueIds && validIdFormat) {
        return true;
    } else {
        // Handle invalid JSON 
        if (!isValidStructure) {
            postUINotification('Invalid JSON structure', 'error')
            return false;
        }
        if (!hasUniqueIds) {
            postUINotification('Duplicate IDs found', 'error')
            return false;
        }
        if (!validIdFormat) {
            postUINotification('Invalid ID format. IDs must start with "Custom-"', 'error')
            return false;
        }
        if (!validNameIdMatch) {
            postUINotification('Object name and ID must match!', 'error')
            return false;
        } else {
            postUINotification('Unknown validation error', 'error')
            return false
        }
    }
}