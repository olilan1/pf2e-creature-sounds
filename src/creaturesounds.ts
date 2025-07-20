import { ActorPF2e, CharacterPF2e, ChatMessagePF2e, NPCPF2e } from "foundry-pf2e";
import { getSetting, SETTINGS } from "./settings.ts"
import { getHashCode, logd, isNPC, isCharacter, MODULE_ID, namesFromSoundDatabase, getActorName } from "./utils.ts";
import * as importedDb from '../databases/creature_sounds_db.json' with { type: "json" };
import { getCustomSoundSet } from "./customsoundsdb.ts";

export interface SoundSet {
    id: string;
    display_name: string;
    notes?: string;
    hurt_sounds: string[];
    attack_sounds: string[];
    death_sounds: string[];
    creatures: string[];
    keywords: string[];
    traits: string[];
    size: number;
}
  
export interface SoundDatabase {
    [id: string]: SoundSet;
}

export type SoundType = "attack" | "hurt" | "death";

// Add names to each sound set, and use the declared SoundDatabase and SoundSet types.
// For some reason importedDb directly includes only the names without spaces. importedDb.default
// includes everything.
const soundDatabase: SoundDatabase = Object.fromEntries(
    Object.entries(importedDb.default)
        .map(([key, value]) => [
            key,
            { ...value, id: key },
        ])
);

// Score values
const KEYWORD_NAME_SCORE = 5;
const KEYWORD_BLURB_SCORE = 4;
const TRAIT_SCORE = 1;

export const NO_SOUND_SET = "none";

export function getDbSoundSetNames(): { id: string; display_name: string; }[] {
    return namesFromSoundDatabase(soundDatabase);
}

export async function playSoundForCreatureOnDamage(actor: ActorPF2e) {
    if (actor.type === "character" && !getSetting(SETTINGS.CREATURE_SOUNDS_CHARACTER)) {
        // Actor is a character, and character sounds are not enabled in settings.
        return;
    }

    const soundType = (actor.system.attributes.hp?.value === 0) ? "death" : "hurt";
    logd(`Actor's hp detected as ${actor.system.attributes.hp?.value}, playing ${soundType} sound`);

    await playSoundForCreature(actor, soundType);
}

export async function playSoundForCreatureOnAttack(message: ChatMessagePF2e) {
    if (!message.actor) {
        return;
    }
    if (message.actor.type === "character"
        && !getSetting(SETTINGS.CREATURE_SOUNDS_CHARACTER)) {
        // Actor is a character, and character sounds are not enabled in settings.
        return;
    }

    await playSoundForCreature(message.actor, "attack");
}

export async function playSoundForCreature(
        actor: ActorPF2e, soundType: SoundType, allPlayers = true, forceSound = false) {

    switch (soundType) {
        case "attack":
        case "hurt":
            // @ts-expect-error (actor.system.attributes.emitsSound is valid)
            if (!actor.system.attributes.emitsSound && !forceSound) {       
                return;
            } 
            break;
        case "death":
            if (hasSilenceEffect(actor) && !forceSound) {
                return;
            }
            break;
    }

    const soundSet = await findSoundSet(actor);
    if (!soundSet) {
        // No matching sound found.
        return;
    }

    // Found something!
    const returnedSounds = getSoundsOfType(soundSet, soundType);
    playRandomSound(returnedSounds, allPlayers);
}

export async function findSoundSet(actor: ActorPF2e): Promise<SoundSet | null> {
    // Check if flag has been set for Actor.
    const chosenSoundSet = actor.flags?.[MODULE_ID]?.soundset as string;
    if (chosenSoundSet) {
        if (chosenSoundSet === NO_SOUND_SET) {
            return null;
        }
        if (chosenSoundSet in soundDatabase) {
            return soundDatabase[chosenSoundSet];
        }
        const customSoundSet = await getCustomSoundSet(chosenSoundSet);
        if (customSoundSet) {
            return customSoundSet;
        }
    }

    // Check for exact name match.
    let soundSet = findSoundSetByCreatureName(getActorName(actor));
    if (soundSet) {
        return soundSet;
    }
    // If no exact match, score keywords and traits.
    soundSet = findSoundSetByScoring(actor);
    if (soundSet) {
        return soundSet;
    }
    // If still no match, didn't find anything.
    logd("No Sounds found.");
    return null;
}

function findSoundSetByScoring(actor: ActorPF2e): SoundSet | null {
    const scoredSoundSets = scoreSoundSets(actor);

    let highestScore = 1;
    let soundsWithHighestValue: SoundSet[] = [];

    for (const [soundSet, score] of scoredSoundSets) {
        if (score > highestScore) {
            highestScore = score;
            soundsWithHighestValue = [soundSet];
        } else if (score === highestScore) {
            soundsWithHighestValue.push(soundSet);
        }
    }

    if (soundsWithHighestValue.length === 0) {
        return null;
    }

    const hash = Math.abs(getHashCode(getActorName(actor)));
    return soundsWithHighestValue[hash % soundsWithHighestValue.length];
}

function scoreSoundSets(actor: ActorPF2e): Map<SoundSet, number> {
    const soundSetScores = new Map<SoundSet, number>();
    const traits = extractTraits(actor);
    const creatureSize = extractSize(actor);

    for (const [, soundSet] of Object.entries(soundDatabase)) {
        let score = 0;
        // Keyword match
        const blurb = isNPC(actor) ? actor?.system?.details?.blurb : null;
        for (const keyword of soundSet.keywords) {
            const regex = new RegExp("\\b" + keyword + "\\b", "i");
            if (getActorName(actor).match(regex)) {
                score += KEYWORD_NAME_SCORE;
            }
            if (blurb && blurb.match(regex)) {
                score += KEYWORD_BLURB_SCORE;
            }
        }
        // Trait match 
        const matchingTraits =
                soundSet.traits.filter((trait: string) => traits.includes(trait)).length;
        score += matchingTraits * TRAIT_SCORE;

        // Size adjustment
        if (score > 0 && soundSet.size != -1 && creatureSize != -1) {
            const scoreAdj = (2 - Math.abs(creatureSize - soundSet.size)) / 10;
            score += scoreAdj;
        }

        soundSetScores.set(soundSet, score);
    }
    logd(soundSetScores);
    return soundSetScores;
}

function findSoundSetByCreatureName(creatureName: string): SoundSet | null {
    for (const [, soundSet] of Object.entries(soundDatabase)) {
        if (soundSet.creatures?.includes(creatureName)) {
            logd("Exact Match found for " + creatureName);
            return soundSet;
        }
    }
    return null;
}

function getSoundsOfType(soundSet: SoundSet, soundType: SoundType): string[] {
    switch (soundType) {
        case "hurt":
            return soundSet.hurt_sounds;
        case "death":
            if (soundSet.death_sounds.length != 0) {
                return soundSet.death_sounds;
            }
            logd("No death sounds found, so using hurt sound as fallback");
            return soundSet.hurt_sounds;
        case "attack":
            return soundSet.attack_sounds;
        default:
            logd(`No sounds found for soundType=${soundType}`);
            return [];
    }
}

function extractTraits(actor: ActorPF2e): string[] {
    const rollOptions = actor.flags.pf2e.rollOptions.all;
    const traits = [];
    for (const key in rollOptions) {
        if (key.startsWith("self:trait:") || key.startsWith("origin:trait:")) {
            const trait = key.slice(key.lastIndexOf(":") + 1);
            traits.push(trait);
        }
    }
    let gender;
    if (isCharacter(actor)) {
        gender = getGenderFromPronouns(actor);
    } else if (isNPC(actor)) {
        gender = getGenderFromBlurb(actor);
    }
    if (gender) {
        traits.push(gender);
    }

    return traits;
}

function getGenderFromPronouns(actor: CharacterPF2e): "female" | "male" | null {
    const pronouns = actor?.system?.details?.gender?.value;
    if (!pronouns) {
        return null;
    }

    const regexMale = /\b(he|him)\b/i;
    const regexFemale = /\b(she|her)\b/i;

    if (pronouns.match(regexFemale)) {
        return "female";
    }

    if (pronouns.match(regexMale)) {
        return "male";
    }

    return null;
}

function getGenderFromBlurb(actor: NPCPF2e): "female" | "male" | null {
    const blurb = actor?.system?.details?.blurb;
    if (!blurb) {
        return null;
    }

    const regexMale = /\bmale\b/i;
    const regexFemale = /\bfemale\b/i;

    if (blurb.match(regexFemale)) {
        return "female";
    }

    if (blurb.match(regexMale)) {
        return "male";
    }

    return null;
}

function extractSize(actor: ActorPF2e): number {
    const rollOptions = actor.flags.pf2e.rollOptions.all;
    const regex = /^(self|origin):size:(\d+)$/;
    for (const key in rollOptions) {
        const matches = key.match(regex);
        if (!matches) {
            continue;
        }
        const parsedValue = parseInt(matches[2], 10);
        if (!isNaN(parsedValue)) {
            return parsedValue;
        }
    }
    logd(`Size not found`);
    return -1;
}

function playRandomSound(sounds: string[], allPlayers: boolean): void {
    playSound(sounds[Math.floor(Math.random() * sounds.length)], allPlayers);
}

export function playSound(sound: string, allPlayers: boolean): void {
    logd(`sound to play: ${sound}`);

    // @ts-expect-error (foundry.audio is ok)
    foundry.audio.AudioHelper.play({
        src: sound,
        volume: getSetting(SETTINGS.CREATURE_SOUNDS_VOLUME) as number,
        autoplay: true,
        loop: false
    }, allPlayers);
}

function hasSilenceEffect(actor: ActorPF2e): boolean {

    if (!actor || !actor.items) {
        return false;
    }

    for (const item of actor.items) {
        if (item.type === "effect" && item.slug === "spell-effect-silence") {
            return true;
        }
    }

    return false;
}