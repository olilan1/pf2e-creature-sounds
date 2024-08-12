import {registerSettings, getSetting, SETTINGS} from "./settings.js"
import {creatureSoundOnDamage} from "./creaturesounds.js"

Hooks.on("init", () => {
    registerSettings();
});

Hooks.on("updateActor", (actor, changed, options, userId) => {
    if (getSetting(SETTINGS.CREATURE_SOUNDS_ENABLE)
            && "damageTaken" in options
            && options.damageTaken > 0) {
        if (actor.type !== 'character' || (actor.type === 'character' && SETTINGS.CREATURE_SOUNDS_CHARACTER_ENABLE)) { 
            creatureSoundOnDamage(actor);
        }
    }
});
