import {onDamageTaken} from "./soundbytrait.js"

Hooks.on("updateActor", (arg0, arg1, arg2, arg3) => {
    if ("damageTaken" in arg2) {
        onDamageTaken(arg0.flags);
    }
});
