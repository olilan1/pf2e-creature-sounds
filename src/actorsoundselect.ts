import { findSoundSet, getNameOptions, NO_SOUND_SET, playRandomMatchingSound } from "./creaturesounds.ts";
import { MODULE_ID } from "./utils.ts";
import { getSetting, SETTINGS } from "./settings.ts";
import { ActorPF2e } from "foundry-pf2e";
import { ApplicationFormConfiguration } from "foundry-pf2e/foundry/client-esm/applications/_types.js";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class ActorSoundSelectApp extends HandlebarsApplicationMixin(ApplicationV2) {
    actor: ActorPF2e;

    constructor(actor: ActorPF2e, options: any) {
        super(options);
        this.actor = actor;
    }

    static override PARTS = {
        form: {
            template: "modules/pf2e-creature-sounds/templates/actor-sound-select.hbs"
        }
    }

    static override DEFAULT_OPTIONS = {
        id: "creature-sounds-app",
        tag: "form",
        window: {
            title: "Creature Sounds"
        },
        actions: {
            play_attack_sound: ActorSoundSelectApp.playAttackSound,
            play_hurt_sound: ActorSoundSelectApp.playHurtSound,
            play_death_sound: ActorSoundSelectApp.playDeathSound,
            default_sound: ActorSoundSelectApp.setToDefault
        }
    }

    override async _prepareContext() {
        const currentSoundSet = findSoundSet(this.actor)?.name ?? NO_SOUND_SET;
        const dropDownNames = getNameOptions();
        const canEdit =
            game.user.isGM       
                || (this.actor.getUserLevel(game.user) == CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER 
                && getSetting(SETTINGS.PLAYERS_CAN_EDIT));
        return {
            currentSoundSet,
            dropDownNames,
            canEdit
        };
    }

    override async _onChangeForm(_formConfig: ApplicationFormConfiguration, event: Event) {
        // @ts-ignore
        await this.actor.setFlag(MODULE_ID, "soundset", event.target?.value);
        this.render();
    }

    static async setToDefault() {
        // @ts-ignore
        await this.actor.unsetFlag(MODULE_ID, "soundset");
        // @ts-ignore
        this.render();
    }

    static playAttackSound() {
        // @ts-ignore
        playRandomMatchingSound(this.actor, "attack", false);
    }

    static playHurtSound() {
        // @ts-ignore
        playRandomMatchingSound(this.actor, "hurt", false);
    }

    static playDeathSound() {
        // @ts-ignore
        playRandomMatchingSound(this.actor, "death", false);
    }
}