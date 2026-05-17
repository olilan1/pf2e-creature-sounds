import { findSoundSet, getDbSoundSetNamesByCategory, NO_SOUND_SET, playSoundForCreature, SoundCategory, DB_SOUND_CATEGORIES, CUSTOM_CATEGORY } from "../creaturesounds.ts";
import { MODULE_ID, truncateStringWithEllipsis } from "../utils.ts";
import { getSetting, SETTINGS } from "../settings.ts";
import { ActorPF2e } from "foundry-pf2e";
import { ApplicationFormConfiguration } from "foundry-pf2e/foundry/client/applications/_types.mjs";
import { getCustomSoundSetNames } from "../customsoundsdb.ts";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class ActorSoundSelectApp extends HandlebarsApplicationMixin(ApplicationV2) {
    actor: ActorPF2e;
    currentSoundSet?: string;
    currentCategory?: SoundCategory | "NO SOUND";

    constructor(actor: ActorPF2e) {
        super({
            window: {
                title: "Creature Sounds: " + truncateStringWithEllipsis(actor.name, 30)
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
        position: {
            width: 500
        },
        actions: {
            play_attack_sound: ActorSoundSelectApp.playAttackSound,
            play_hurt_sound: ActorSoundSelectApp.playHurtSound,
            play_death_sound: ActorSoundSelectApp.playDeathSound,
            default_sound: ActorSoundSelectApp.setToDefault
        }
    }

    override async _prepareContext() {
        const soundSet = await findSoundSet(this.actor);
        const currentSoundSet = this.currentSoundSet ?? soundSet?.id ?? NO_SOUND_SET;
        const currentCategory = this.currentCategory ?? soundSet?.category ?? "NO SOUND";
        const dropDownCategories = await this.buildCategoryOptions();
        const dropDownSoundSetNames = await this.buildNameOptions(currentCategory);
        const isNoSoundCategory = currentCategory === "NO SOUND";
        const canEdit = this.actor.sheet.isEditable
                && (game.user.isGM || getSetting(SETTINGS.PLAYERS_CAN_EDIT));
        return {
            currentSoundSet,
            currentCategory,
            dropDownCategories,
            dropDownSoundSetNames,
            isNoSoundCategory,
            canEdit
        };
    }

    override async _onChangeForm(_formConfig: ApplicationFormConfiguration, event: Event) {
        if (event.target instanceof HTMLSelectElement) {
            if (event.target.id === "categoryDropdown") {
                this.currentCategory = event.target.value as SoundCategory | "NO SOUND";
                if (this.currentCategory === "NO SOUND") {
                    await this.actor.setFlag(MODULE_ID, "soundset", NO_SOUND_SET);
                }
                this.render();
            } else if (event.target.id === "soundSetDropdown") {
                await this.actor.setFlag(MODULE_ID, "soundset", event.target?.value);
                this.currentSoundSet = event.target?.value;
                this.render();
            }
        }
    }

    static async setToDefault(this: ActorSoundSelectApp) {
        await this.actor.unsetFlag(MODULE_ID, "soundset");
        this.currentSoundSet = undefined;
        this.currentCategory = undefined;
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

    async buildCategoryOptions(): Promise<{ category: SoundCategory | "NO SOUND" }[]> {
        const sortedDbCategories = [...DB_SOUND_CATEGORIES].sort((a, b) => a.localeCompare(b));
        const allCategories: { category: SoundCategory | "NO SOUND" }[] = [
            { category: "NO SOUND" },
            ...sortedDbCategories.map(c => ({ category: c }))
        ];

        const customNames = await getCustomSoundSetNames();
        if (customNames.length > 0) {
            allCategories.push({ category: CUSTOM_CATEGORY });
        }
        return allCategories;
    }

    async buildNameOptions(category: SoundCategory | "NO SOUND") {
        if (category === CUSTOM_CATEGORY) {
            const customNames = await getCustomSoundSetNames();
            return customNames.sort((a, b) => a.display_name.localeCompare(b.display_name));
        } else if (category === "NO SOUND") {
            return [];
        } else {
            return getDbSoundSetNamesByCategory(category)
                .sort((a, b) => a.display_name.localeCompare(b.display_name));
        }
    }
}