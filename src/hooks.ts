import { registerSettings, getSetting, SETTINGS, SettingsKey } from "./settings.ts"
import { playSoundForCreatureOnDamage, playSoundForCreatureOnAttack } from "./creaturesounds.ts"
import { ActorSoundSelectApp } from "./ui/actorsoundselect.ts";
import { ActorPF2e, ChatMessagePF2e, CreaturePF2e, CreatureSheetPF2e } from "foundry-pf2e";
import { registerCustomSoundsDb } from "./customsoundsdb.ts";
import { loadSoundboardUI } from "./ui/soundboard.ts";
import { logd } from "./utils.ts";
import PlaylistDirectory from "foundry-pf2e/foundry/client/applications/sidebar/tabs/playlist-directory.mjs";

Hooks.on("init", () => {
    registerSettings();
    registerCustomSoundsDb();
    logd("PF2E Creature Sounds | Initialized");
});

Hooks.on("updateActor", (actor: ActorPF2e, _changed: object, updateDetails: object) => {
    if ("damageTaken" in updateDetails && (updateDetails.damageTaken as number) > 0) {
        hook(playSoundForCreatureOnDamage, actor)
                .ifEnabled(SETTINGS.CREATURE_SOUNDS, SETTINGS.CREATURE_HURT_SOUNDS)
                .ifGM()
                .run();
    }
});

Hooks.on("createChatMessage", (message: ChatMessagePF2e) => {
    switch (getMessageType(message)) {
        case "attack-roll":
            hook(playSoundForCreatureOnAttack, message)
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

Hooks.on("renderPlaylistDirectory", (_app: PlaylistDirectory, htmlOrJquery: JQuery | HTMLElement, 
        _data, _options) => {
    const html = getHtmlElement(htmlOrJquery);
    hook(loadSoundboardUI, html)
                .ifEnabled(SETTINGS.CREATURE_SOUNDS, SETTINGS.SOUNDBOARD_ENABLED)
                .ifGM()
                .run();
});

function getHtmlElement(htmlOrJquery: JQuery | HTMLElement) {
  if (htmlOrJquery instanceof jQuery) {
    return (htmlOrJquery as JQuery)[0] as HTMLElement;
  }
  // Otherwise, it's HTML, just return it
  return htmlOrJquery as HTMLElement;
}

function getMessageType(message: ChatMessagePF2e) {
    return message.flags?.pf2e?.context?.type ?? message.flags?.pf2e?.origin?.type;
}

function hook<T extends unknown[]>(func: (...args: T) => void, ...args: T): HookRunner<T> {
    return new HookRunner<T>(func, ...args);
}

class HookRunner<T extends unknown[]> {
    func: (...args: T) => void;
    args: T;
    shouldRun: boolean;

    constructor(func: (...args: T) => void, ...args: T) {
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

    run(): void {
        if (this.shouldRun) {
            this.func(...this.args);
        }
    }
}