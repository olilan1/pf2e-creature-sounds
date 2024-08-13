import {getSetting, SETTINGS} from "./settings.js"

const soundsDatabase = (await import("../databases/sounds_db.json",
        {assert: {type: 'json'}, with: {type: 'json'}})).default;

export function creatureSoundOnDamage(actor, options) {
    if (!getSetting(SETTINGS.CREATURE_SOUNDS_ENABLE)
            || !getSetting(SETTINGS.CREATURE_HIT_SOUNDS_ENABLE)) {
        // Disabled in settings.
        return;
    }
    if (actor.type === 'character' && !getSetting(SETTINGS.CREATURE_SOUNDS_CHARACTER_ENABLE)) {
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

    const soundType = (actor.system.attributes.hp.value === 0) ? "death" : "hit";
    playRandomMatchingSound(actor, soundType);
}

export function creatureSoundOnAttack(ChatMessagePF2e) {
    if (ChatMessagePF2e.flags.pf2e.context.type !== 'attack-roll') {
        // Not an attack roll.
        return;
    }
    if (!getSetting(SETTINGS.CREATURE_SOUNDS_ENABLE)
            || !getSetting(SETTINGS.CREATURE_ATTACK_SOUNDS_ENABLE)) {
        // Disabled in settings.
        return;
    }

    let attackingActor = game.actors.get(ChatMessagePF2e.speaker.actor);
    if (attackingActor.type === 'character'
            && !getSetting(SETTINGS.CREATURE_SOUNDS_CHARACTER_ENABLE)) {
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

function findSoundSet(name, rollOptions) {
    // Check for exact name match first.
    let soundSet = findSoundSetByCreatureName(name);
    if (!soundSet) {
        // If no exact match, check for match_on.
        soundSet = findSoundSetByMatch(name);
    }
    if (!soundSet) {
        // If still no match, check traits.
        soundSet = findSoundSetByTraits(extractTraits(rollOptions));
    }
    if (!soundSet) {
        // If still no match, didn't find anything.
        console.log("No Sounds found.");
        return;
    }
    return soundSet;
}

function findSoundSetByCreatureName(creatureName) {
    for (const [key, soundSet] of Object.entries(soundsDatabase)) {
        if (soundSet.creatures?.includes(creatureName)) {
            console.log("Exact Match found for " + creatureName);
            return soundSet;
        }
    }
    return null;
}

function findSoundSetByMatch(creatureName) {
    for (const [key, soundSet] of Object.entries(soundsDatabase)) {
        for (const matchText of soundSet.match_on) {
            const regex = new RegExp("\\b" + matchText + "\\b", "i");
            if (creatureName.match(regex)) {
                console.log(`Inexact Match found for ${creatureName} with match text ${matchText}`);
                return soundSet;
            }
        }
    }
    return null;
}

function findSoundSetByTraits(traits) {
    let bestMatch = null;
    let maxMatchingTraits = 0;
    console.log(`Traits found for creature are: ${traits}`);
    for (const [key, soundSet] of Object.entries(soundsDatabase)) {
        const matchingTraits = soundSet.traits.filter(trait => traits.includes(trait)).length;
        if (matchingTraits > maxMatchingTraits) {
            bestMatch = soundSet;
            maxMatchingTraits = matchingTraits;
        }
    }
    if (bestMatch) {
        return bestMatch;
    }
    return null;
}

function getSoundsOfType(soundSet, soundType) {
    switch (soundType) {
        case 'hit':
            return soundSet.hit_sounds;
        case 'death':
            if (soundSet.death_sounds.length != 0) {
                return soundSet.death_sounds;
            }
            console.log("No death sounds found, so using hit sound as fallback");
            return soundSet.hit_sounds;
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