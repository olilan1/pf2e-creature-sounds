import { findSoundSet, getAllNames, playRandomMatchingSound } from "./creaturesounds.js";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class ActorSoundSelectApp extends HandlebarsApplicationMixin(ApplicationV2) {
    constructor(actor, options) {
        super(options);
        this.actor = actor;
    }

    static PARTS = {
        form: {
            template: "modules/samioli-module/templates/actor-sound-select.html"
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
        context.currentSoundSet = findSoundSet(this.actor).name;
        context.dropDownNames = getAllNames();
        return context;
    }

    async _onChangeForm(formConfig, event) {
        await this.actor.setFlag("samioli-module", "soundset", event.target.value);
        this.render();
    }

    static async setToDefault() {
        await this.actor.unsetFlag("samioli-module", "soundset");
        this.render();
    }

    static playAttackSound() {
        playRandomMatchingSound(this.actor, "attack");
    }

    static playHurtSound() {
        playRandomMatchingSound(this.actor, "hurt");
    }

    static playDeathSound() {
        playRandomMatchingSound(this.actor, "death");
    }
}