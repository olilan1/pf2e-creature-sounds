import { ActorPF2e, ChatMessagePF2e } from "foundry-pf2e";
import { getSetting, SETTINGS } from "./settings.ts"
import { getHashCode, logd, hasKey, isNPC, isCharacter, MODULE_ID } from "./utils.ts";
import * as importedDb from '../databases/creature_sounds_db.json';

interface SoundSet {
    name: string;
    display_name: string;
    notes: string;
    hurt_sounds: string[];
    attack_sounds: string[];
    death_sounds: string[];
    creatures: string[];
    keywords: string[];
    traits: string[];
    size: number;
}
  
interface SoundDatabase {
    [name: string]: SoundSet;
}

// Add names to each sound set, and use the declared SoundDatabase and SoundSet types.
// For some reason importedDb directly includes only the names without spaces. importedDb.default
// includes everything.
const soundsDatabase: SoundDatabase = Object.fromEntries(
    Object.entries(importedDb.default)
        .map(([key, value]) => [
            key,
            { ...value, name: key }, // Add the new field here
        ])
);

const KEYWORD_NAME_SCORE = 5;
const KEYWORD_BLURB_SCORE = 4;
const TRAIT_SCORE = 1;
export const NO_SOUND_SET = "none";
const NO_SOUND_SET_DISPLAY_NAME = "--- no sound ---";

export function getNameOptions(): Record<string, string> {
    const sortedArray = Object.entries(soundsDatabase)
        .map(([key, value]) => [key, value.display_name])
        .sort((a, b) => a[1].localeCompare(b[1]));
    sortedArray.unshift([NO_SOUND_SET, NO_SOUND_SET_DISPLAY_NAME])
    return Object.fromEntries(sortedArray)
}

export function creatureSoundOnDamage(actor: ActorPF2e, options: object): void {
    if (actor.type === 'character' && !getSetting(SETTINGS.CREATURE_SOUNDS_CHARACTER)) {
        // Actor is a character, and character sounds are not enabled in settings.
        return;
    }
    if (!("damageTaken" in options)) {
        // Not a damage update.
        return;
    }
    if ((options.damageTaken as number) <= 0) {
        // Damage is not positive.
        return;
    }

    const soundType = (actor.system.attributes.hp?.value === 0) ? "death" : "hurt";
    playRandomMatchingSound(actor, soundType);
}

export function creatureSoundOnAttack(message: ChatMessagePF2e): void {
    if (message.flags.pf2e.context?.type !== 'attack-roll') {
        // Not an attack roll.
        return;
    }

    if (!message.speaker.token) {
        return;
    }
    const attackingToken = canvas.scene?.tokens.get(message.speaker.token);
    const attackingActor = attackingToken!.actor;
    if (attackingActor!.type === 'character'
        && !getSetting(SETTINGS.CREATURE_SOUNDS_CHARACTER)) {
        // Actor is a character, and character sounds are not enabled in settings.
        return;
    }

    playRandomMatchingSound(attackingActor!, "attack");
}

export function playRandomMatchingSound(
        actor: ActorPF2e, soundType: string, allPlayers = true): void {
    const soundSet = findSoundSet(actor);
    if (!soundSet) {
        // No matching sound found.
        return;
    }

    // Found something!
    const returnedSounds = getSoundsOfType(soundSet, soundType);
    playRandomSound(returnedSounds, allPlayers);
}

export function findSoundSet(actor: ActorPF2e): SoundSet | null {
    // Check if flag has been set for Actor.
    const chosenSoundSet = actor.flags?.[MODULE_ID]?.soundset as string;
    if (chosenSoundSet) {
        if (chosenSoundSet === NO_SOUND_SET) {
            return null;
        }
        if (hasKey(soundsDatabase, chosenSoundSet)) {
            return soundsDatabase[chosenSoundSet];
        }
    }

    // Check for exact name match first.
    let soundSet = findSoundSetByCreatureName(actor.name);
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

    const hash = Math.abs(getHashCode(actor.name));
    return soundsWithHighestValue[hash % soundsWithHighestValue.length];
}

function scoreSoundSets(actor: ActorPF2e): Map<SoundSet, number> {
    const soundSetScores = new Map<SoundSet, number>();
    const traits = extractTraits(actor);
    const creatureSize = extractSize(actor);

    for (const [, soundSet] of Object.entries(soundsDatabase)) {
        let score = 0;
        // Keyword match
        const blurb = isNPC(actor) ? actor?.system?.details?.blurb : null;
        for (const keyword of soundSet.keywords) {
            const regex = new RegExp("\\b" + keyword + "\\b", "i");
            if (actor.name.match(regex)) {
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
    for (const [, soundSet] of Object.entries(soundsDatabase)) {
        if (soundSet.creatures?.includes(creatureName)) {
            logd("Exact Match found for " + creatureName);
            return soundSet;
        }
    }
    return null;
}

function getSoundsOfType(soundSet: SoundSet, soundType: string): string[] {
    switch (soundType) {
        case 'hurt':
            return soundSet.hurt_sounds;
        case 'death':
            if (soundSet.death_sounds.length != 0) {
                return soundSet.death_sounds;
            }
            logd("No death sounds found, so using hurt sound as fallback");
            return soundSet.hurt_sounds;
        case 'attack':
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
    let gender = getGenderFromPronouns(actor);
    if (!gender) {
        gender = getGenderFromBlurb(actor);
    }
    if (gender) {
        traits.push(gender);
    }

    return traits;
}

function getGenderFromBlurb(actor: ActorPF2e): "female" | "male" | null {
    const blurb = isNPC(actor) ? actor?.system?.details?.blurb : null;
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

function getGenderFromPronouns(actor: ActorPF2e): "female" | "male" | null {
    const pronouns = isCharacter(actor) ? actor?.system?.details?.gender?.value : null;
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

function playSound(sound: string, allPlayers: boolean): void {
    logd(`sound to play: ${sound}`);
    // @ts-expect-error (foundry.audio is ok)
    foundry.audio.AudioHelper.play({
        src: sound,
        volume: getSetting(SETTINGS.CREATURE_SOUNDS_VOLUME),
        autoplay: true,
        loop: false
    }, allPlayers);
}