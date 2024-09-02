import { registerSettings } from "./settings.js"
import { creatureSoundOnDamage, creatureSoundOnAttack } from "./creaturesounds.js"
import { chatMacroButton } from "./chatmacrobutton.js";
import { startTumbleThrough } from "./actions/tumblethrough.js";
import { startEnjoyTheShow } from "./actions/enjoytheshow.js";
import { checkForBravado, checkForFinisher } from "./effects/panache.js";
import { checkForHuntPrey } from "./actions/huntprey.js";
import { targetTokensUnderTemplate } from "./templatetarget.js";
import { checkForUnstableCheck } from "./effects/unstablecheck.js";


Hooks.on("init", () => {
    registerSettings();
});

Hooks.on("updateActor", (actor, changed, options, userId) => {
    creatureSoundOnDamage(actor, options);
});

Hooks.on('renderChatMessage', async (ChatMessagePF2e, html) => {
    chatMacroButton(ChatMessagePF2e, html);
});

Hooks.on("createMeasuredTemplate", async (template, context, userId) => {
    targetTokensUnderTemplate(template, userId);
});

Hooks.on("createChatMessage", (message, rollmode, id) => {   
    if (
    !(
        game.modules.get('dice-so-nice')?.active
        && message.isRoll
        && message.rolls.some(roll => roll.dice.length > 0)
      )
    ) {
      handleChatMessage(message);
    }
});

Hooks.on('diceSoNiceRollComplete', (id) => {
    const message = game.messages.get(id);
    if (message) {
      handleChatMessage(message);
    };
});

function handleChatMessage(message) {
    creatureSoundOnAttack(message);
    startTumbleThrough(message);
    startEnjoyTheShow(message);
    checkForBravado(message);
    checkForFinisher(message);
    checkForHuntPrey(message);
    checkForUnstableCheck(message);
}