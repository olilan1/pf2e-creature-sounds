import {registerSettings} from "./settings.js"
import {creatureSoundOnDamage, creatureSoundOnAttack} from "./creaturesounds.js"

Hooks.on("init", () => {
    registerSettings();
});

Hooks.on("updateActor", (actor, changed, options, userId) => {
    creatureSoundOnDamage(actor, options);
});

Hooks.on("createChatMessage", (ChatMessagePF2e, rollmode, id) => {
    creatureSoundOnAttack(ChatMessagePF2e);
});