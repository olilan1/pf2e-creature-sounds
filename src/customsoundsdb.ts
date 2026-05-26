import { SoundDatabase, SoundSet, SoundType, CUSTOM_CATEGORY } from "./creaturesounds.ts";
import { SETTINGS_NAMESPACE } from "./settings.ts";
import { namesFromSoundDatabase, soundTypeToField, logd } from "./utils.ts";
import { saveAs } from 'file-saver';

const CUSTOM_SOUND_SETS = "custom_sound_sets";
const CUSTOM_SOUND_SETS_VERSION = "custom_sound_sets_version";

/**
 * Current schema version for the custom sound database.
 *
 * When changing the database schema:
 * 1. Increment this value.
 * 2. Add a new entry to the `migrations` Map below, keyed by the new version number.
 *    The migration function receives the database at version (key - 1) and must return
 *    it transformed to version (key).
 * 3. The migration will run automatically on module startup for any world whose
 *    stored version is behind CURRENT_DB_VERSION.
 */
export const CURRENT_DB_VERSION = 1;

type Migration = (db: SoundDatabase) => SoundDatabase;

/**
 * Registry of migration functions, keyed by the TARGET version they produce.
 *
 * Each function receives the database at the previous version and returns
 * the database transformed to the keyed version. Migrations are run in
 * ascending key order.
 */
export const migrations = new Map<number, Migration>([
    [1, (db) => {
        // v0 → v1: Add missing category field to custom sound sets
        for (const soundSet of Object.values(db)) {
            if (!soundSet.category) {
                soundSet.category = CUSTOM_CATEGORY;
            }
        }
        return db;
    }],
]);

export function registerCustomSoundsDb(): void {
    game.settings.register(SETTINGS_NAMESPACE, CUSTOM_SOUND_SETS, {
        name: "Custom Sound Sets",
        scope: "world",
        default: {},
        config: false,
        type: Object
    });

    game.settings.register(SETTINGS_NAMESPACE, CUSTOM_SOUND_SETS_VERSION, {
        name: "Custom Sound Sets Schema Version",
        scope: "world",
        default: 0,
        config: false,
        type: Number
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
    const soundSet = currentSoundDatabase[soundSetId];
    return soundSet;
}

/**
 * Runs any pending migrations on the custom sound database.
 * Should be called once during the `ready` hook, after settings are fully loaded.
 */
export async function migrateCustomSoundDatabase(targetVersion = CURRENT_DB_VERSION) {
    const storedVersion = game.settings.get(
        SETTINGS_NAMESPACE,
        CUSTOM_SOUND_SETS_VERSION
    ) as number;

    if (storedVersion >= targetVersion) {
        return;
    }

    logd(
        `Custom sound database is at version ${storedVersion}, ` +
        `migrating to version ${targetVersion}`
    );
    let db = await getCustomSoundDatabase();

    for (let version = storedVersion + 1; version <= targetVersion; version++) {
        const migration = migrations.get(version);
        if (migration) {
            logd(`Running migration to version ${version}`);
            db = migration(db);
        }
    }

    await setCustomSoundDatabase(db);
    await game.settings.set(
        SETTINGS_NAMESPACE,
        CUSTOM_SOUND_SETS_VERSION,
        targetVersion
    );
    logd(`Custom sound database migrated to version ${targetVersion}`);
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

export async function saveSoundSetsAsJSON() {
    const jsonObject = await getCustomSoundDatabase();
    const jsonString = JSON.stringify(jsonObject);
    const blob = new Blob([jsonString], { type: 'application/json' });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `customSounds_${timestamp}.json`;

    saveAs(blob, filename);
}

export async function updateSoundSetsWithSoundDatabase(soundDatabase: SoundDatabase) {
    let entries = 0;
    for (const entry in soundDatabase) {
        await updateCustomSoundSet(soundDatabase[entry]);
        entries++;
    }
    return entries;
}

export type ValidationResult = 'OK' | 'duplicate_ids' | 'invalid_id_format' | 'name_id_mismatch';

export function validateCustomSoundDatabase(soundDatabase: SoundDatabase): ValidationResult {
    // 1. Validate unique IDs
    const ids = Object.keys(soundDatabase);
    const hasUniqueIds = new Set(ids).size === ids.length;

    // 2. Validate ID format
    const validIdFormat = ids.every((id: string) => id.startsWith('Custom-'));

    // 3. Validate object name and ID match
    const validNameIdMatch = Object.entries(soundDatabase).every(
        ([key, value]) => key === value.id);

    // 4. Return appropriate result
    if (!hasUniqueIds) {
        return "duplicate_ids";
    }
    if (!validIdFormat) {
        return "invalid_id_format";
    }
    if (!validNameIdMatch) {
        return "name_id_mismatch";
    } 
    return "OK";
}