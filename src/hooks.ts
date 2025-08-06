import { registerSettings, getSetting, SETTINGS, SettingsKey } from "./settings.ts"
import { playSoundForCreatureOnDamage, playSoundForCreatureOnAttack, playPitchedSound } from "./creaturesounds.ts"
import { ActorSoundSelectApp } from "./ui/actorsoundselect.ts";
import { ActorPF2e, ChatMessagePF2e, CreaturePF2e, CreatureSheetPF2e } from "foundry-pf2e";
import { registerCustomSoundsDb } from "./customsoundsdb.ts";
import { MODULE_ID } from "./utils.ts";

export let socket;

Hooks.on("init", () => {
    registerSettings();
    registerCustomSoundsDb();
    console.log(`${MODULE_ID} | Loaded`);
});

Hooks.once('socketlib.ready', () => {
    console.log("socketlib ready");
    socket = socketlib.registerModule(MODULE_ID);
    socket.register("playPitchedSound", playPitchedSound);
});

Hooks.on("updateActor", async (actor: ActorPF2e, _changed: object, updateDetails: object) => {
    if ("damageTaken" in updateDetails && (updateDetails.damageTaken as number) > 0) {
        await hook(playSoundForCreatureOnDamage, actor)
                .ifEnabled(SETTINGS.CREATURE_SOUNDS, SETTINGS.CREATURE_HURT_SOUNDS)
                .ifGM()
                .run();
    }
});

Hooks.on("createChatMessage", async (message: ChatMessagePF2e) => {
    switch (getMessageType(message)) {
        case "attack-roll":
            await hook(playSoundForCreatureOnAttack, message)
                    .ifEnabled(SETTINGS.CREATURE_SOUNDS, SETTINGS.CREATURE_ATTACK_SOUNDS)
                    .ifGM()
                    .run();
            break;
    }
});

Hooks.on("getCreatureSheetPF2eHeaderButtons",
        (actorSheet: CreatureSheetPF2e<CreaturePF2e>, buttons: object[]) => { 
    const actor = actorSheet.object;
    if (!actor.testUserPermission(game.user, CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER)) {
        return;
    }
    buttons.unshift({
        class: "sounds-control",
        icon: "fas fa-volume-up",
        label: "Sounds",
        onclick: () => {
            new ActorSoundSelectApp(actor).render(true);
        }
    });
});

function getMessageType(message: ChatMessagePF2e) {
    return message.flags?.pf2e?.context?.type ?? message.flags?.pf2e?.origin?.type;
}

function hook<T extends unknown[]>(func: (...args: T) => Promise<void> | void, ...args: T): HookRunner<T> {
    return new HookRunner<T>(func, ...args);
}

class HookRunner<T extends unknown[]> {
    func: (...args: T) => Promise<void> | void;
    args: T;
    shouldRun: boolean;

    constructor(func: (...args: T) => Promise<void> | void, ...args: T) {
        this.func = func;
        this.args = args;
        this.shouldRun = true;
    }

    ifEnabled(...settings: SettingsKey[]): this {
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
        const message = this.args[0] as ChatMessagePF2e;
        if (game.user.id != message.author?.id) {
            this.shouldRun = false;
        }
        return this;
    }

    async run(): Promise<void> {
        if (this.shouldRun) {
            await this.func(...this.args);
        }
    }
}