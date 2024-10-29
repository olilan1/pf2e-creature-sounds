import { registerSettings, getSetting, SETTINGS } from "./settings.js"
import { creatureSoundOnDamage, creatureSoundOnAttack } from "./creaturesounds.js"
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

Hooks.on("createChatMessage", (message) => {
    switch (getMessageType(message)) {
        case "attack-roll":
            hook(creatureSoundOnAttack, message)
                    .ifEnabled(SETTINGS.CREATURE_SOUNDS, SETTINGS.CREATURE_ATTACK_SOUNDS)
                    .ifGM()
                    .run();
            break;
    }
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