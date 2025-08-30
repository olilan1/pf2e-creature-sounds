import { ActorPF2e, CharacterPF2e, NPCPF2e, TokenPF2e } from "foundry-pf2e";
import { getSetting, SETTINGS } from "./settings.ts";
import { SoundDatabase, SoundSet, SoundType } from "./creaturesounds.ts";

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
    return Object.values(obj).every(isSoundSet);
}

export function getSelectedToken() {
  const controlledTokens = canvas.tokens.controlled;

  if (controlledTokens.length === 0) {
    ui.notifications.warn("No token selected.");
    return null;
  }

  if (controlledTokens.length > 1) {
    ui.notifications.warn("Please select only one token.");
    return null;
  }

  return controlledTokens[0] as TokenPF2e;
}

export function getSelectedActor() {
    const token = getSelectedToken();
    if (!token) {
        return null;
    }

    return token.actor as ActorPF2e;
}

function isSoundSet(obj: unknown): obj is SoundSet {
    if (typeof obj !== 'object' || obj === null) {
        return false;
    }
    return (
        'id' in obj &&
        'display_name' in obj &&
        'hurt_sounds' in obj &&
        'attack_sounds' in obj &&
        'death_sounds' in obj &&
        'creatures' in obj &&
        'keywords' in obj &&
        'traits' in obj &&
        'size' in obj &&
        typeof obj.id === 'string' &&
        typeof obj.display_name === 'string' &&
        isStringArray(obj.hurt_sounds) &&
        isStringArray(obj.attack_sounds) &&
        isStringArray(obj.death_sounds) &&
        isStringArray(obj.creatures) &&
        isStringArray(obj.keywords) &&
        isStringArray(obj.traits) &&
        typeof obj.size === 'number'
    );
}

function isStringArray(value: unknown): value is string[] {
    return Array.isArray(value) && value.every(item => typeof item === 'string');
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

export function getActorName(actor: ActorPF2e): string {
    if (actor.flags.babele?.originalName) {
        return actor.flags.babele.originalName as string;
    } 
    return actor.name;
}

export function truncateStringWithEllipsis(str: string, limit: number): string {
    if (str.length <= limit) {
        return str;
    }

    const ellipsis = "...";

    if (limit <= ellipsis.length) {
        return str.slice(0, limit);
    }

    return str.slice(0, limit - ellipsis.length) + ellipsis;
}
