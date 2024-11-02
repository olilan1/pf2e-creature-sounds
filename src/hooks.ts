import { registerSettings, getSetting, SETTINGS } from "./settings.ts"
import { creatureSoundOnDamage, creatureSoundOnAttack } from "./creaturesounds.ts"
import { ActorSoundSelectApp } from "./actorsoundselect.ts";
import { ActorPF2e, ChatMessagePF2e, CreatureSheetPF2e } from "foundry-pf2e";

Hooks.on("init", () => {
    registerSettings();
});

Hooks.on("updateActor", (actor: ActorPF2e, _changed: Object, options: Object, _userId: string) => {
    hook(creatureSoundOnDamage, actor, options)
            .ifEnabled(SETTINGS.CREATURE_SOUNDS, SETTINGS.CREATURE_HURT_SOUNDS)
            .ifGM()
            .run();
});

Hooks.on("createChatMessage", (message: ChatMessagePF2e) => {
    switch (getMessageType(message)) {
        case "attack-roll":
            hook(creatureSoundOnAttack, message)
                    .ifEnabled(SETTINGS.CREATURE_SOUNDS, SETTINGS.CREATURE_ATTACK_SOUNDS)
                    .ifGM()
                    .run();
            break;
    }
});

Hooks.on("getCreatureSheetPF2eHeaderButtons", (actorSheet: CreatureSheetPF2e<any>, buttons) => { 
    const actor = actorSheet.object;
    if (actor.getUserLevel(game.user) < CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER) {
        return;
    }
    buttons.unshift({
        class: "sounds-control",
        icon: "fas fa-volume-up",
        label: "Sounds",
        onclick: () => {
            new ActorSoundSelectApp(actor, {}).render(true);
        }
    });
});

function getMessageType(message: ChatMessagePF2e) {
    return message.flags?.pf2e?.context?.type ?? message.flags?.pf2e?.origin?.type;
}

function hook(func: Function, ...args: any[]): HookRunner {
    return new HookRunner(func, ...args);
}

class HookRunner {
    func: Function;
    args: any[];
    shouldRun: boolean;

    constructor(func: Function, ...args: any[]) {
        this.func = func;
        this.args = args;
        this.shouldRun = true;
    }

    ifEnabled(...settings: string[]): this {
        for (const setting of settings) {
            if (!getSetting(setting)) {
                this.shouldRun = false;
            }
        }
        return this;
    }

    ifGM(): this {
        if (!game.user.isGM) {
            this.shouldRun = false;
        }
        return this;
    }

    ifMessagePoster(): this {
        const message = this.args[0];
        if (message.constructor.name != "ChatMessagePF2e") {
            throw new Error("First arg is not ChatMessagePF2e");
        }
        if (game.user.id != message.user.id) {
            this.shouldRun = false;
        }
        return this;
    }

    run(): void {
        if (this.shouldRun) {
            this.func(...this.args);
        }
    }
}