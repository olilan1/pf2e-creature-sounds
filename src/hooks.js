import { registerSettings, getSetting, SETTINGS } from "./settings.js"
import { creatureSoundOnDamage, creatureSoundOnAttack } from "./creaturesounds.js"
import { chatMacroButton } from "./chatmacrobutton.js";
import { startTumbleThrough } from "./actions/tumblethrough.js";
import { startEnjoyTheShow } from "./actions/enjoytheshow.js";
import { checkForBravado, checkForExtravagantParryOrElegantBuckler, checkForFinisherAttack, checkForFinisherDamage } from "./effects/panache.js";
import { checkForHuntPreyGM, checkForHuntPreyPlayer } from "./actions/huntprey.js";
import { targetTokensUnderTemplate, deleteTemplateTargets } from "./templatetarget.js";
import { checkForUnstableCheck } from "./effects/unstablecheck.js";
import { ActorSoundSelectApp } from "./actorsoundselect.js";

Hooks.on("init", () => {
    registerSettings();
});

Hooks.on("updateActor", (actor, _changed, options/*, userId*/) => {
    hook(creatureSoundOnDamage, actor, options)
            .ifEnabled(SETTINGS.CREATURE_SOUNDS, SETTINGS.CREATURE_HURT_SOUNDS)
            .ifGM()
            .run();
});

Hooks.on('renderChatMessage', async (ChatMessagePF2e, html) => {
    chatMacroButton(ChatMessagePF2e, html);
});

Hooks.on("createMeasuredTemplate", async (/* MeasuredTemplateDocumentPF2e */ template, _context, userId) => {
    hook(targetTokensUnderTemplate, template, userId)
            .ifEnabled(SETTINGS.TEMPLATE_TARGET)
            .run();
});

Hooks.on("deleteMeasuredTemplate", (/* MeasuredTemplateDocumentPF2e */ template) => {
    hook(deleteTemplateTargets, template)
            .ifEnabled(SETTINGS.TEMPLATE_TARGET)
            .run();
});

Hooks.on("createChatMessage", (message, rollmode, userId) => {
    handleChatMessagePreRoll(message);
    if (game.modules.get('dice-so-nice')?.active
            && message.isRoll 
            && message.rolls.some(roll => roll.dice.length > 0)) {
        // Includes a roll, message will be posted by DiceSoNice
        return;
    }
    handleChatMessagePostRoll(message, userId);
});

Hooks.on('diceSoNiceRollComplete', (id) => {
    const message = game.messages.get(id);
    if (message) {
      handleChatMessagePostRoll(message);
    };
});

Hooks.on("getActorSheetPF2eHeaderButtons", (actorSheet, buttons) => {
    buttons.unshift({
      class: "sounds-control",
      icon: "fas fa-volume-up",
      label: "Sounds",
      onclick: () => {
        new ActorSoundSelectApp(actorSheet.object, {}).render(true);
      }
    });
  });

function handleChatMessagePreRoll(message) {
    switch (getMessageType(message)) {
        case "attack-roll":
            hook(creatureSoundOnAttack, message)
                    .ifEnabled(SETTINGS.CREATURE_SOUNDS, SETTINGS.CREATURE_ATTACK_SOUNDS)
                    .ifGM()
                    .run();
            break;
    }
}

function handleChatMessagePostRoll(message, userId) {
    switch (getMessageType(message)) {
        case "attack-roll":
            hook(checkForExtravagantParryOrElegantBuckler, message)
                    .ifEnabled(SETTINGS.AUTO_PANACHE)
                    .ifGM()
                    .run();
            hook(checkForFinisherAttack, message)
                    .ifEnabled(SETTINGS.AUTO_PANACHE)
                    .ifGM()
                    .run();
            hook(checkForBravado, message)
                    .ifEnabled(SETTINGS.AUTO_PANACHE)
                    .ifGM()
                    .run();
            break;
        case "damage-roll":
            hook(checkForFinisherDamage, message)
                    .ifEnabled(SETTINGS.AUTO_PANACHE)
                    .ifGM()
                    .run();
            break;
        case "skill-check":
            hook(startTumbleThrough, message)
                    .ifMessagePoster()
                    .run();
            hook(startEnjoyTheShow, message)
                    .ifMessagePoster()
                    .run();
            hook(checkForBravado, message)
                    .ifEnabled(SETTINGS.AUTO_PANACHE)
                    .ifGM()
                    .run();
            break;
        case "flat-check":
            hook(checkForUnstableCheck, message)
                    .ifEnabled(SETTINGS.AUTO_UNSTABLE_CHECK)
                    .ifGM()
                    .run();
            break;
        case "action":
            hook(checkForHuntPreyGM, message, userId)
                    .ifEnabled(SETTINGS.AUTO_HUNT_PREY)
                    .ifGM()
                    .run();
            hook(checkForHuntPreyPlayer, message, userId)
                    .ifEnabled(SETTINGS.AUTO_HUNT_PREY)
                    .ifMessagePoster()
                    .run();
            break;
    }
}

function getMessageType(message) {
    return message.flags?.pf2e?.context?.type ?? message.flags?.pf2e?.origin?.type;
}

function hook(func, ...args) {
    return new HookRunner(func, ...args);
}

class HookRunner {
    constructor(func, ...args) {
        this.func = func;
        this.args = args;
        this.shouldRun = true;
    }

    ifEnabled(...settings) {
        for (const setting of settings) {
            if (!getSetting(setting)) {
                this.shouldRun = false;
            }
        }
        return this;
    }

    ifGM() {
        if (!game.user.isGM) {
            this.shouldRun = false;
        }
        return this;
    }

    ifMessagePoster() {
        const message = this.args[0];
        if (message.constructor.name != "ChatMessagePF2e") {
            throw new Error("First arg is not ChatMessagePF2e");
        }
        if (game.user.id != message.user.id) {
            this.shouldRun = false;
        }
        return this;
    }

    run() {
        if (this.shouldRun) {
            this.func(...this.args);
        }
    }
}