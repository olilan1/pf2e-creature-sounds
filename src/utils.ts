import { ActorPF2e, CharacterPF2e, NPCPF2e } from "foundry-pf2e";
import { getSetting, SETTINGS } from "./settings.ts";

export const MODULE_ID = "pf2e-creature-sounds";

export function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function getHashCode(str: string): number {
    let hash = 0;
    if (str.length === 0) return hash;

    for (let i = 0; i < str.length; i++) {
        let char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer 
    }
    
    return hash;
}

export function logd(message: any): void {
    if (getSetting(SETTINGS.DEBUG_LOGGING)) {
        console.log(message);
    }
}

export function hasKey<O extends Object>(obj: O, key: PropertyKey): key is keyof O {
    return key in obj
}

export function isNPC(obj: ActorPF2e): obj is NPCPF2e {
    return obj.type === "npc"; 
}

export function isCharacter(obj: ActorPF2e): obj is CharacterPF2e {
    return obj.type === "character";
}