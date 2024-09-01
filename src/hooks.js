import { registerSettings } from "./settings.js"
import { creatureSoundOnDamage, creatureSoundOnAttack } from "./creaturesounds.js"
import { chatMacroButton } from "./chatmacrobutton.js";
import { startTumbleThrough } from "./actions/tumblethrough.js";
import { startEnjoyTheShow } from "./actions/enjoytheshow.js";
import { checkForBravado } from "./effects/panache.js";
import { targetTokensUnderTemplate } from "./templatetarget.js";

Hooks.on("init", () => {
    registerSettings();
});

Hooks.on("updateActor", (actor, changed, options, userId) => {
    creatureSoundOnDamage(actor, options);
});

Hooks.on("createChatMessage", (ChatMessagePF2e, rollmode, id) => {
    creatureSoundOnAttack(ChatMessagePF2e);
    startTumbleThrough(ChatMessagePF2e);
    startEnjoyTheShow(ChatMessagePF2e);
    checkForBravado(ChatMessagePF2e);
    console.log(canvas.interface.grid.highlightLayers);
});

Hooks.on('renderChatMessage', async (ChatMessagePF2e, html) => {
    chatMacroButton(ChatMessagePF2e, html);
});

Hooks.on("createMeasuredTemplate", async (template, context, userId) => {
    targetTokensUnderTemplate(template);
});
