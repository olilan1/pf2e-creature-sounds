import { findSoundSet, getNameOptions, NO_SOUND_SET, playRandomMatchingSound } from "./creaturesounds.js";
import { logd, MODULE_ID } from "./utils.js";
import { getSetting, SETTINGS } from "./settings.js";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class ActorSoundSelectApp extends HandlebarsApplicationMixin(ApplicationV2) {
    constructor(actor, options) {
        super(options);
        this.actor = actor;
    }

    static PARTS = {
        form: {
            template: "modules/pf2e-creature-sounds/templates/actor-sound-select.html"
        }
    }

    static DEFAULT_OPTIONS = {
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

    async _prepareContext() {
        const context = {};
        context.currentSoundSet = findSoundSet(this.actor)?.name ?? NO_SOUND_SET;
        context.dropDownNames = getNameOptions();
        logd(context.dropDownNames);
        context.canEdit =
            game.user.isGM       
                || (this.actor.getUserLevel(game.user) == CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER 
                && getSetting(SETTINGS.PLAYERS_CAN_EDIT));
        return context;
    }

    async _onChangeForm(formConfig, event) {
        logd("selected soundset = " + event.target.value);
        await this.actor.setFlag(MODULE_ID, "soundset", event.target.value);
        this.render();
    }

    static async setToDefault() {
        await this.actor.unsetFlag(MODULE_ID, "soundset");
        this.render();
    }

    static playAttackSound() {
        playRandomMatchingSound(this.actor, "attack", false);
    }

    static playHurtSound() {
        playRandomMatchingSound(this.actor, "hurt", false);
    }

    static playDeathSound() {
        playRandomMatchingSound(this.actor, "death", false);
    }
}