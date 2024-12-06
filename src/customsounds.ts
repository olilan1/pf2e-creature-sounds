import { playSound, SoundSet, SoundType } from "./creaturesounds.ts";
import { updateCustomSoundSet, getCustomSoundSetNames, deleteCustomSoundSet, getCustomSoundSet, updateCustomSoundSetDisplayName, addSoundToCustomSoundSet, deleteSoundFromCustomSoundSet } from "./settings.ts";
import { ApplicationFormConfiguration } from "foundry-pf2e/foundry/client-esm/applications/_types.js";

const { ApplicationV2, HandlebarsApplicationMixin, DialogV2 } = foundry.applications.api;

interface SoundSetEntry {
    id: string;
    display_name: string;
    selected: boolean
}

export class CustomSoundsApp extends HandlebarsApplicationMixin(ApplicationV2) {

    selectedSoundSetId: string | null = null;

    static override PARTS = {
        form: {
            template: "modules/pf2e-creature-sounds/templates/custom-sounds.hbs"
        }
    }

    static override DEFAULT_OPTIONS = {
        id: "custom-sounds-app",
        tag: "form",
        window: {
            title: "PF2e Creature Sounds: Custom Sound Sets",
            icon: "fa-solid fa-spaghetti-monster-flying",
            resizable: true,
        },
        position: {
            width: 900,
            height: 700
        },
        actions: {
            create_sound_set: CustomSoundsApp.createSoundSet,
            select_sound_set: CustomSoundsApp.selectSoundSet,
            delete_sound_set: CustomSoundsApp.deleteSoundSet,
            add_sound: CustomSoundsApp.addCustomSound,
            play_sound: CustomSoundsApp.playCustomSound,
            delete_sound: CustomSoundsApp.deleteCustomSound
        }
    }

    override async _prepareContext() {
        const customSoundSetNames = getCustomSoundSetNames() as SoundSetEntry[];
        for (const entry of customSoundSetNames) {
            if (entry.id === this.selectedSoundSetId) {
                entry.selected = true;
            } else {
                entry.selected = false;
            }
        }

        let selectedSoundSet: SoundSet;
        if (this.selectedSoundSetId) {
            selectedSoundSet = getCustomSoundSet(this.selectedSoundSetId);
        } else {
            selectedSoundSet = createEmptySoundSet();
        }

        const nothingSelected = (!this.selectedSoundSetId);

        return {
            customSoundSetNames,
            selectedSoundSet,
            nothingSelected
        }
    }

    override async _onChangeForm(_formConfig: ApplicationFormConfiguration, event: Event) {
        if (event.target instanceof HTMLInputElement) {
            const newDisplayName = event.target.value;
            if (!newDisplayName) {
                this.render();
                return;
            }

            updateCustomSoundSetDisplayName(event.target.dataset.id!, newDisplayName);
            this.render();
        }
    }

    static createSoundSet(this: CustomSoundsApp, _event: PointerEvent, _target: HTMLElement) {
        // Create sound set
        const newSoundSet: SoundSet = {
            id: getNewSoundSetId(),
            display_name: "New Sound Set",
            hurt_sounds: [],
            attack_sounds: [],
            death_sounds: [],
            creatures: [],
            keywords: [],
            traits: [],
            size: -1
        };

        updateCustomSoundSet(newSoundSet);
        this.selectedSoundSetId = newSoundSet.id;
        this.render();
    }

    static selectSoundSet(this: CustomSoundsApp, _event: PointerEvent, target: HTMLElement) {
        if (target.dataset.id) {
            this.selectedSoundSetId = target.dataset.id;
        }
        this.render();
    }

    static addCustomSound(this: CustomSoundsApp, _event: PointerEvent, target: HTMLElement) {
        const soundSetId = target.dataset.id;
        if (!soundSetId) {
            return;
        }
        const soundType = target.dataset.type as SoundType;

        const fp = new FilePicker({
            title: "Select a sound",
            type: "audio",
            callback: (path: string) => {
                addSoundToCustomSoundSet(soundSetId, soundType, path);
                this.render();
            }
        });
        fp.render();        
    }

    static playCustomSound(this: CustomSoundsApp, _event: PointerEvent, target: HTMLElement) {
        playSound(target.dataset.path!, false);
    }

    static deleteCustomSound(this: CustomSoundsApp, _event: PointerEvent, target: HTMLElement) {
        if (!this.selectedSoundSetId) {
            return;
        }
        deleteSoundFromCustomSoundSet(this.selectedSoundSetId,
            target.dataset.type as SoundType, Number(target.dataset.index));
        this.render();
    }

    static async deleteSoundSet(this: CustomSoundsApp, _event: PointerEvent, target: HTMLElement) {
        const soundSetDisplayName = target.dataset.display_name
        const confirmed = await DialogV2.confirm({
            window: { title: "Confirm Delete" },
            content: `<p>Are you sure you want to delete ${soundSetDisplayName}?</p>`,
            modal: true
          })
        
        if (confirmed){ 
            deleteCustomSoundSet(target.dataset.id!);
            this.render();
        }
    }
    
}

function getNewSoundSetId() {
    return "Custom-" + Date.now();
}

function createEmptySoundSet() {
    const emptySoundSet: SoundSet = {
        id: "",
        display_name: "",
        hurt_sounds: [],
        attack_sounds: [],
        death_sounds: [],
        creatures: [],
        keywords: [],
        traits: [],
        size: -1
    };
    return emptySoundSet;
}