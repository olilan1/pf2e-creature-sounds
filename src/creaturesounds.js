import { getSetting, SETTINGS } from "./settings.js"
import { getHashCode, logd } from "./utils.js";

let soundsDatabase;
$.getJSON("modules/samioli-module/databases/creature_sounds_db.json",
    json => { soundsDatabase = json; })

const KEYWORD_NAME_SCORE = 5;
const KEYWORD_BLURB_SCORE = 4;
const TRAIT_SCORE = 1;

export function creatureSoundOnDamage(actor, options) {
    if (actor.type === 'character' && !getSetting(SETTINGS.CREATURE_SOUNDS_CHARACTER)) {
        // Actor is a character, and character sounds are not enabled in settings.
        return;
    }
    if (!("damageTaken" in options)) {
        // Not a damage update.
        return;
    }
    if (options.damageTaken <= 0) {
        // Damage is not positive.
        return;
    }

    const soundType = (actor.system.attributes.hp.value === 0) ? "death" : "hurt";
    playRandomMatchingSound(actor, soundType);
}

export function creatureSoundOnAttack(ChatMessagePF2e) {
    if (ChatMessagePF2e.flags.pf2e.context?.type !== 'attack-roll') {
        // Not an attack roll.
        return;
    }

    let attackingToken = game.canvas.scene.tokens.get(ChatMessagePF2e.speaker.token);
    let attackingActor = attackingToken.actor;
    if (attackingActor.type === 'character'
            && !getSetting(SETTINGS.CREATURE_SOUNDS_CHARACTER)) {
        // Actor is a character, and character sounds are not enabled in settings.
        return;
    }

    playRandomMatchingSound(attackingActor, "attack");
}

function playRandomMatchingSound(actor, soundType) {
    let soundSet = findSoundSet(actor);
    if (!soundSet) {
        // No matching sound found.
        return;
    }

    // Found something!
    const returnedSounds = getSoundsOfType(soundSet, soundType);
    playRandomSound(returnedSounds);
}

function findSoundSet(actor) {
    // Check for exact name match first.
    let soundSet = findSoundSetByCreatureName(actor.name);
    if (!soundSet) {
        // If no exact match, score keywords and traits
        soundSet = findSoundSetByScoring(actor);
    }
    if (!soundSet) {
        // If still no match, didn't find anything.
        logd("No Sounds found.");
        return;
    }
    return soundSet;
}

function findSoundSetByScoring(actor) {
    const scoredSoundSets = scoreSoundSets(actor);

    let highestScore = 1;
    let soundsWithHighestValue = [];

    for (let [soundSet, score] of scoredSoundSets) {
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
    
    let hash = Math.abs(getHashCode(actor.name));
    return soundsWithHighestValue[hash % soundsWithHighestValue.length];
}

function scoreSoundSets(actor) {
    const soundSetScores = new Map();
    let traits = extractTraits(actor);
    let creatureSize = extractSize(actor);
    for (const [, soundSet] of Object.entries(soundsDatabase)) {
        let score = 0;
        
        // Keyword match
        const blurb = actor?.system?.details?.blurb;
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
        const matchingTraits = soundSet.traits.filter(trait => traits.includes(trait)).length;
        score += matchingTraits * TRAIT_SCORE;

        // Size adjustment
        if (score > 0 && soundSet.size != -1) {
            let scoreAdj = (2 - Math.abs(creatureSize - soundSet.size)) / 10;
            score += scoreAdj;
        }
        
        soundSetScores.set(soundSet, score);
    }
    logd(soundSetScores);
    return soundSetScores; 
}

function findSoundSetByCreatureName(creatureName) {
    for (const [, soundSet] of Object.entries(soundsDatabase)) {
        if (soundSet.creatures?.includes(creatureName)) {
            logd("Exact Match found for " + creatureName);
            return soundSet;
        }
    }
    return null;
}

function getSoundsOfType(soundSet, soundType) {
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
    }
}

function extractTraits(actor) {
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

function getGenderFromBlurb(actor) {
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

function getGenderFromPronouns(actor) {
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

function extractSize(actor) {
    const rollOptions = actor.flags.pf2e.rollOptions.all;
    const regex = /^(self|origin):size:(\d+)$/;
    for (const key in rollOptions) {
        let matches = key.match(regex);
        if (!matches) {
            continue;
        }
        return matches[2];
    }
    logd(`Size not found`);
}

function playRandomSound(sounds) {
    playSound(sounds[Math.floor(Math.random() * sounds.length)]);
}

function playSound(sound) {
    logd(`sound to play: ${sound}`);
    foundry.audio.AudioHelper.play({
        src: sound,
        volume: getSetting(SETTINGS.CREATURE_SOUNDS_VOLUME),
        autoplay: true,
        loop: false
    }, true);
}