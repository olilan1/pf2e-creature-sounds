import { ActorPF2e, CharacterPF2e, ChatMessagePF2e, NPCPF2e } from "foundry-pf2e";
import { getSetting, SETTINGS } from "./settings.ts"
import { getHashCode, logd, isNPC, isCharacter, MODULE_ID, namesFromSoundDatabase, getActorName, namesFromSoundDatabaseByCategory } from "./utils.ts";
import * as importedDb from '../databases/creature_sounds_db.json' with { type: "json" };
import { getCustomSoundSet } from "./customsoundsdb.ts";

export const DB_SOUND_CATEGORIES = [
    "Monstrosities & Aberrations",
    "Dragons, Dinosaurs & Reptiles",
    "Humanoids",
    "Insects & Swarms",
    "Monstrous Humanoids",
    "Undead & Spirits",
    "Fiends & Outsiders",
    "Amphibians, Aquatics & Avians",
    "Animals",
    "Beasts & Large Animals",
    "Fey & Aliens",
    "Constructs, Oozes & Plants",
    "Elementals"
] as const;

export type DbSoundCategory = typeof DB_SOUND_CATEGORIES[number];

export const CUSTOM_CATEGORY = "Custom Sound Sets";

export const ALL_CATEGORIES = [...DB_SOUND_CATEGORIES, CUSTOM_CATEGORY] as const;

export type SoundCategory = DbSoundCategory | typeof CUSTOM_CATEGORY;

export interface SoundSet {
    id: string;
    display_name: string;
    category: SoundCategory;
    notes?: string;
    hurt_sounds: string[];
    attack_sounds: string[];
    death_sounds: string[];
    creatures: string[];
    keywords: string[];
    traits: (string | string[])[];
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
            { ...value, id: key } as SoundSet,
        ])
);

// Score values
const KEYWORD_NAME_SCORE = 5;
const KEYWORD_BLURB_SCORE = 4;

// Trait Scoring
const TRAIT_WEIGHT = 1.0;
const GENDER_TRAIT_WEIGHT = 0.5;
const TRAIT_SET_BASE_SCORE = 0.9;
const TRAIT_SET_PER_TRAIT_SCORE = 0.1;
const TRAIT_SET_MAX_SCORE = 1.9;
const TRAIT_SET_SIZE_BONUS = 0.1;

export const NO_SOUND_SET = "none";

export function getDbSoundSetNames(): { id: string; display_name: string; category: SoundCategory }[] {
    return namesFromSoundDatabase(soundDatabase);
}



export function getDbSoundSetNamesByCategory(category: SoundCategory): { id: string; display_name: string; }[] {
    return namesFromSoundDatabaseByCategory(soundDatabase, category);
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

export async function findSoundSet(
    actor: ActorPF2e,
    db: SoundDatabase = soundDatabase,
    fetchCustomSoundSet: (id: string) => Promise<SoundSet | undefined> = getCustomSoundSet
): Promise<SoundSet | null> {
    // Check if flag has been set for Actor.
    const chosenSoundSet = actor.flags?.[MODULE_ID]?.soundset as string;
    if (chosenSoundSet) {
        if (chosenSoundSet === NO_SOUND_SET) {
            return null;
        }
        if (chosenSoundSet in db) {
            return db[chosenSoundSet];
        }
        const customSoundSet = await fetchCustomSoundSet(chosenSoundSet);
        if (customSoundSet) {
            return customSoundSet;
        }
    }

    // If character has they/them pronouns, default to no sound.
    if (isCharacter(actor)) {
        const pronouns = actor.system.details.gender.value;
        if (pronouns?.match(/\b(they|them)\b/i)) {
            logd("Actor has 'they/them' pronouns, defaulting to no sound.");
            return null;
        }
    }

    // Check for exact name match.
    let soundSet = findSoundSetByCreatureName(getActorName(actor), db);
    if (soundSet) {
        return soundSet;
    }
    // If no exact match, score keywords and traits.
    soundSet = findSoundSetByScoring(actor, db);
    if (soundSet) {
        return soundSet;
    }
    // If still no match, didn't find anything.
    logd("No Sounds found.");
    return null;
}

export function findSoundSetByScoring(actor: ActorPF2e, db: SoundDatabase = soundDatabase): SoundSet | null {
    const scoredSoundSets = scoreSoundSets(actor, db);

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

export function scoreSoundSets(actor: ActorPF2e, db: SoundDatabase = soundDatabase): Map<SoundSet, number> {
    const soundSetScores = new Map<SoundSet, number>();
    const traits = extractTraits(actor);
    const creatureSize = extractSize(actor);

    for (const [, soundSet] of Object.entries(db)) {
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
        let totalTraitWeight = 0;
        for (const traitEntry of soundSet.traits) {
            if (Array.isArray(traitEntry)) {
                // Multi-trait set: all traits in the set must match.
                // Weight scales with set size: 1 + (n-1) * TRAIT_SET_SIZE_BONUS
                const allMatched = traitEntry.every(t => traits.includes(t));
                if (allMatched) {
                    totalTraitWeight +=
                        TRAIT_WEIGHT + (traitEntry.length - 1) * TRAIT_SET_SIZE_BONUS;
                }
            } else {
                // Single trait
                if (traits.includes(traitEntry)) {
                    if (traitEntry === "male" || traitEntry === "female") {
                        totalTraitWeight += GENDER_TRAIT_WEIGHT;
                    } else {
                        totalTraitWeight += TRAIT_WEIGHT;
                    }
                }
            }
        }

        if (totalTraitWeight > 0) {
            // Formula: 0.9 + 0.1 * totalTraitWeight (with a max of 1.9)
            score += Math.min(
                TRAIT_SET_MAX_SCORE,
                TRAIT_SET_BASE_SCORE + TRAIT_SET_PER_TRAIT_SCORE * totalTraitWeight
            );
        }

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

export function findSoundSetByCreatureName(
    creatureName: string,
    db: SoundDatabase = soundDatabase
): SoundSet | null {
    const lowerName = creatureName.toLowerCase();
    for (const [, soundSet] of Object.entries(db)) {
        if (soundSet.creatures?.some(c => c.toLowerCase() === lowerName)) {
            logd("Exact Match found for " + creatureName);
            return soundSet;
        }
    }
    return null;
}

export function getSoundsOfType(soundSet: SoundSet, soundType: SoundType): string[] {
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

export function extractTraits(actor: ActorPF2e): string[] {
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

export function extractSize(actor: ActorPF2e): number {
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