import soundsDatabase from "../databases/sounds_db.json" assert { type: "json" };

import {getSetting, SETTINGS} from "./settings.js"

export function creatureSoundOnDamage(actor) {
    const soundType = checkIfDamageKills(actor);

    //check for name match first
    let returnedSounds = findSoundByCreatureName(actor.name, soundType);
    console.log("value of returnedSounds after findSoundByCreatureName(): " + returnedSounds)
    if (!returnedSounds) {
        // check for match_on
        returnedSounds = findSoundByMatch(actor.name, soundType);
    }

    if (!returnedSounds) {
        // check traits
        const rollOptions = actor.flags.pf2e.rollOptions.all;
        returnedSounds = findSoundByTraits(extractTraits(rollOptions), soundType);
    }

    if (returnedSounds) {
        // Found something!
        playRandomSound(returnedSounds);
    } else {
        // Didn't find anything
        console.log("No Sounds found.")
    }
}

function checkIfDamageKills(actor) {
    if (actor.system.attributes.hp.value === 0) {
        return "death"
    }
    return "hit"
}

function findSoundByCreatureName(creatureName, soundType) {
    for (const [key, value] of Object.entries(soundsDatabase)) {
        if (value.creatures?.includes(creatureName)) {
            console.log("Exact Match found for " + creatureName);
            return getSoundsOfType(value, soundType);
        }
    }
    console.log("Could not find in db: " + creatureName)
    return null;
}

function findSoundByMatch(creatureName, soundType) {
    for (const [key, value] of Object.entries(soundsDatabase)) {
        for (const matchText of value.match_on) {
            const regex = new RegExp("\\b" + matchText + "\\b", "i");
            if (creatureName.match(regex)) {
                console.log("Inexact Match found for " + creatureName + " with match text " + matchText);
                return getSoundsOfType(value, soundType);
            }
        }
    }
    console.log("Could not find match for: " + creatureName)
    return null;
}

function findSoundByTraits(traits, soundType) {
    let bestMatch = null;
    let maxMatchingTraits = 0;
    console.log("Traits found for damaged creature are: " + traits);
    for (const [key, value] of Object.entries(soundsDatabase)) {
        const matchingTraits = value.traits.filter(trait => traits.includes(trait)).length;
        if (matchingTraits > maxMatchingTraits) {
            bestMatch = value;
            maxMatchingTraits = matchingTraits;
        }
    }
    if (bestMatch) {
        return getSoundsOfType(bestMatch, soundType);
    }
    return null;
}

function getSoundsOfType(dbValue, soundType) {
    switch (soundType) {
        case 'hit':
            return dbValue.hit_sounds;
        case 'death':
            if (dbValue.death_sounds.length != 0) {
                return dbValue.death_sounds;
            }
            console.log("No death sounds found, so using hit sound as fallback");
            return dbValue.hit_sounds;
        default:
            console.log("No sounds found for soundType=" + soundType);
    }
}

function extractTraits(obj) {
    const traits = [];
    for (const key in obj) {
        if (key.startsWith("self:trait:")) {
            const trait = key.replace("self:trait:", "");
            traits.push(trait);
        }
    }
    return traits;
}

function playRandomSound(sounds) {
    playSound(sounds[Math.floor(Math.random() * sounds.length)]);
}

function playSound(sound) {
    console.log("sound to play:" + sound);
    foundry.audio.AudioHelper.play({
        src: sound,
        volume: getSetting(SETTINGS.CREATURE_SOUNDS_VOLUME),
        autoplay: true,
        loop: false
    }, true);
}