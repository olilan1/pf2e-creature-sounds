import { ActorPF2e, CharacterPF2e, NPCPF2e } from "foundry-pf2e";
import { getSetting, SETTINGS } from "./settings.ts";
import { SoundDatabase, SoundType } from "./creaturesounds.ts";

export const MODULE_ID = "pf2e-creature-sounds";

export function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function getHashCode(str: string): number {
    let hash = 0;
    if (str.length === 0) return hash;

    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer 
    }
    
    return hash;
}

export function logd(message: unknown): void {
    if (getSetting(SETTINGS.DEBUG_LOGGING)) {
        console.log(message);
    }
}

export function isNPC(obj: ActorPF2e): obj is NPCPF2e {
    return obj.type === "npc"; 
}

export function isCharacter(obj: ActorPF2e): obj is CharacterPF2e {
    return obj.type === "character";
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

export function soundTypeToField(soundType: SoundType) {
    switch (soundType) {
        case 'attack':
            return 'attack_sounds';
        case 'hurt':
            return 'hurt_sounds';
        case 'death':
            return 'death_sounds';
    }
}

export function namesFromSoundDatabase(soundDb: SoundDatabase) {
    const result = Object.entries(soundDb)
        .map(([key, value]) => ({ id: key, display_name: value.display_name }))
    return result;
}