import { findSoundSet, getDbSoundSetNames, NO_SOUND_SET, playSoundForCreature } from "../creaturesounds.ts";
import { MODULE_ID } from "../utils.ts";
import { getSetting, SETTINGS } from "../settings.ts";
import { ActorPF2e } from "foundry-pf2e";
import { getCustomSoundSetNames } from "../customsoundsdb.ts";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

const NO_SOUND_SET_DISPLAY_NAME = "--- no sound ---";

export class ActorSoundSelectApp extends HandlebarsApplicationMixin(ApplicationV2) {
    actor: ActorPF2e;

    constructor(actor: ActorPF2e) {
        super({
            window: {
                title: "Creature Sounds: " + actor.name
            }
        });
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
            title: "Creature Sounds",
            icon: "fas fa-volume-up",
        },
        actions: {
            play_attack_sound: ActorSoundSelectApp.playAttackSound,
            play_hurt_sound: ActorSoundSelectApp.playHurtSound,
            play_death_sound: ActorSoundSelectApp.playDeathSound,
            default_sound: ActorSoundSelectApp.setToDefault
        }
    }

    override async _prepareContext() {
        const currentSoundSet = (await findSoundSet(this.actor))?.id ?? NO_SOUND_SET;
        const dropDownNames = await this.buildNameOptions();
        const canEdit = this.actor.sheet.isEditable
                && (game.user.isGM || getSetting(SETTINGS.PLAYERS_CAN_EDIT));
        return {
            currentSoundSet,
            dropDownNames,
            canEdit
        };
    }

    override async _onChangeForm(_formConfig: any, event: Event) {
        if (event.target instanceof HTMLSelectElement) {
            await this.actor.setFlag(MODULE_ID, "soundset", event.target?.value);
            this.render();
        }
    }

    static async setToDefault(this: ActorSoundSelectApp) {
        await this.actor.unsetFlag(MODULE_ID, "soundset");
        this.render();
    }

    static playAttackSound(this: ActorSoundSelectApp) {
        playSoundForCreature(this.actor, "attack", false, true);
    }

    static playHurtSound(this: ActorSoundSelectApp) {
        playSoundForCreature(this.actor, "hurt", false, true);
    }

    static playDeathSound(this: ActorSoundSelectApp) {
        playSoundForCreature(this.actor, "death", false, true);
    }

    async buildNameOptions() {
        const sortedNames = getDbSoundSetNames()
            .sort((a, b) => a.display_name.localeCompare(b.display_name));
        const customNames = (await getCustomSoundSetNames())
            .map(obj => ( { id: obj.id, display_name: "CUSTOM: " + obj.display_name } ));
        sortedNames.push(...customNames);
        sortedNames.unshift({ id: NO_SOUND_SET, display_name: NO_SOUND_SET_DISPLAY_NAME });
        return sortedNames;
    }
}