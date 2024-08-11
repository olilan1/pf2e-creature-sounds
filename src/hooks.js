import {creatureSoundOnDamage} from "./soundbynameortrait.js"

Hooks.on("updateActor", (actor, changed, options, userId) => {
    if ("damageTaken" in options && options.damageTaken > 0) {
        creatureSoundOnDamage(actor);
    }
});
