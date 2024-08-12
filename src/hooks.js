import {registerSettings, getSetting, SETTINGS} from "./settings.js"
import {creatureSoundOnDamage} from "./creaturesounds.js"

Hooks.on("init", () => {
    registerSettings();
});

Hooks.on("updateActor", (actor, changed, options, userId) => {
    creatureSoundOnDamage(actor, options);
});
