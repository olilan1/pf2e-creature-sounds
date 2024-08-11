import {registerSettings, getSetting, SETTINGS} from "./settings.js"
import {creatureSoundOnDamage} from "./creaturesounds.js"

Hooks.on("init", () => {
    registerSettings();
});

Hooks.on("updateActor", (actor, changed, options, userId) => {
    if (getSetting(SETTINGS.CREATURE_SOUNDS_ENABLE)
            && "damageTaken" in options
            && options.damageTaken > 0) {
        creatureSoundOnDamage(actor);
    }
});
