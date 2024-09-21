import { getSetting, SETTINGS } from "./settings.js"
import { getHashCode } from "./utils.js";

let soundsDatabase;
$.getJSON("modules/samioli-module/databases/creature_sounds_db.json",
    json => { soundsDatabase = json; })

const KEYWORD_SCORE = 5;
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

    let attackingActor = game.actors.get(ChatMessagePF2e.speaker.actor);
    if (attackingActor.type === 'character'
            && !getSetting(SETTINGS.CREATURE_SOUNDS_CHARACTER)) {
        // Actor is a character, and character sounds are not enabled in settings.
        return;
    }

    playRandomMatchingSound(attackingActor, "attack");
}

function playRandomMatchingSound(actor, soundType) {
    let soundSet = findSoundSet(actor.name, actor.flags.pf2e.rollOptions.all);
    if (!soundSet) {
        // No matching sound found.
        return;
    }

    // Found something!
    const returnedSounds = getSoundsOfType(soundSet, soundType);
    playRandomSound(returnedSounds);
}

function findSoundSet(creatureName, rollOptions) {
    // Check for exact name match first.
    let soundSet = findSoundSetByCreatureName(creatureName);
    if (!soundSet) {
        // If no exact match, score keywords and traits
        soundSet = selectSoundSet(scoreSoundSets(creatureName, rollOptions), creatureName);
    }
    if (!soundSet) {
        // If still no match, didn't find anything.
        console.log("No Sounds found.");
        return;
    }
    return soundSet;
}

function selectSoundSet(soundSetScores, creatureName) {
    let highestScore = 1;
    let soundsWithHighestValue = [];

    for (let [soundSet, score] of soundSetScores) {
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
    
    let hash = getHashCode(creatureName);
    return soundsWithHighestValue[hash % soundsWithHighestValue.length];
}

function scoreSoundSets(creatureName, rollOptions) {

    const soundSetScores = new Map();
    for (const [, soundSet] of Object.entries(soundsDatabase)) {
        let score = 0;
        
        // Keyword match
        for (const matchText of soundSet.keywords) {
            const regex = new RegExp("\\b" + matchText + "\\b", "i");
            if (creatureName.match(regex)) {
                score += KEYWORD_SCORE;
            }
        }

        // Trait match
        let traits = extractTraits(rollOptions);
        const matchingTraits = soundSet.traits.filter(trait => traits.includes(trait)).length;
        score += matchingTraits * TRAIT_SCORE;

        // Size adjustment
        if (score > 0 && soundSet.size != -1) {
            let creatureSize = extractSize(rollOptions);
            let scoreAdj = (2 - Math.abs(creatureSize - soundSet.size)) / 10;
            score += scoreAdj;
        }
        
        soundSetScores.set(soundSet, score);
    }
    console.log(soundSetScores);
    return soundSetScores; 
}

function findSoundSetByCreatureName(creatureName) {
    for (const [, soundSet] of Object.entries(soundsDatabase)) {
        if (soundSet.creatures?.includes(creatureName)) {
            console.log("Exact Match found for " + creatureName);
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
            console.log("No death sounds found, so using hurt sound as fallback");
            return soundSet.hurt_sounds;
        case 'attack': 
            return soundSet.attack_sounds;
        default:
            console.log(`No sounds found for soundType=${soundType}`);
    }
}

function extractTraits(obj) {
    const traits = [];
    for (const key in obj) {
        if (key.startsWith("self:trait:") || key.startsWith("origin:trait:")) {
            const trait = key.slice(key.lastIndexOf(":") + 1);
            traits.push(trait);
        }
    }
    return traits;
}

function extractSize(obj) {
    const regex = /^(self|origin):size:(\d+)$/;
    for (const key in obj) {
        let matches = key.match(regex);
        if (!matches) {
            continue;
        }
        return matches[2];
    }
    console.log(`Size not found`);
}

function playRandomSound(sounds) {
    playSound(sounds[Math.floor(Math.random() * sounds.length)]);
}

function playSound(sound) {
    console.log(`sound to play: ${sound}`);
    foundry.audio.AudioHelper.play({
        src: sound,
        volume: getSetting(SETTINGS.CREATURE_SOUNDS_VOLUME),
        autoplay: true,
        loop: false
    }, true);
}