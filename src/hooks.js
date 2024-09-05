import { registerSettings, getSetting, SETTINGS } from "./settings.js"
import { creatureSoundOnDamage, creatureSoundOnAttack } from "./creaturesounds.js"
import { chatMacroButton } from "./chatmacrobutton.js";
import { startTumbleThrough } from "./actions/tumblethrough.js";
import { startEnjoyTheShow } from "./actions/enjoytheshow.js";
import { checkForBravado, checkForExtravagantParryOrElegantBuckler, checkForFinisherAttack, checkForFinisherDamage } from "./effects/panache.js";
import { checkForHuntPrey } from "./actions/huntprey.js";
import { targetTokensUnderTemplate } from "./templatetarget.js";
import { checkForUnstableCheck } from "./effects/unstablecheck.js";

Hooks.on("init", () => {
    registerSettings();
});

Hooks.on("updateActor", (actor, _changed, options/*, userId*/) => {
    runIfEnabled([SETTINGS.CREATURE_SOUNDS_ENABLE, SETTINGS.CREATURE_HURT_SOUNDS_ENABLE],
        creatureSoundOnDamage, actor, options);
});

Hooks.on('renderChatMessage', async (ChatMessagePF2e, html) => {
    chatMacroButton(ChatMessagePF2e, html);
});

Hooks.on("createMeasuredTemplate", async (template, _context, userId) => {
    runIfEnabled(SETTINGS.TEMPLATE_TARGET_ENABLE, targetTokensUnderTemplate, template, userId);
});

Hooks.on("createChatMessage", (message, /*rollmode, id*/) => {   
    if (game.modules.get('dice-so-nice')?.active
            && message.isRoll
            && message.rolls.some(roll => roll.dice.length > 0)) {
        // Includes a roll, message will be posted by DiceSoNice
        return;
    }
    handleChatMessage(message);
});

Hooks.on('diceSoNiceRollComplete', (id) => {
    const message = game.messages.get(id);
    if (message) {
      handleChatMessage(message);
    };
});

function handleChatMessage(message) {
    switch (getMessageType(message)) {
        case "attack-roll":
            runIfEnabled([SETTINGS.CREATURE_SOUNDS_ENABLE, SETTINGS.CREATURE_ATTACK_SOUNDS_ENABLE],
                    creatureSoundOnAttack, message);
            checkForExtravagantParryOrElegantBuckler(message);
            checkForFinisherAttack(message);
            break;
        case "damage-roll":
            checkForFinisherDamage(message);
            break;
        case "skill-check":
            startTumbleThrough(message);
            startEnjoyTheShow(message);
            checkForBravado(message);
            checkForUnstableCheck(message);
            break;
        case "action":
            checkForHuntPrey(message);
            break;
    }
}

function getMessageType(message) {
    return message.flags?.pf2e?.context?.type ?? message.flags?.pf2e?.origin?.type;
}

/**
 * Runs the handler function with the provided args, if the specified settings are enabled.
 */
function runIfEnabled(settings, handler, ...args) {
    if (!Array.isArray(settings)) {
        settings = [settings];
    }
    for (const setting of settings) {
        if (!getSetting(setting)) {
            return;
        }
    }
    handler(...args);
}