import { playSound, SoundSet, SoundType } from "./creaturesounds.ts";
import { updateCustomSoundSet, getCustomSoundSetNames, deleteCustomSoundSet, getCustomSoundSet, updateCustomSoundSetDisplayName, addSoundToCustomSoundSet, deleteSoundFromCustomSoundSet } from "./settings.ts";
import { ApplicationFormConfiguration } from "foundry-pf2e/foundry/client-esm/applications/_types.js";
import { logd } from "./utils.ts";

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
            add_sound: CustomSoundsApp.addSound,
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

        logd(selectedSoundSet);

        const nothingSelected = (!this.selectedSoundSetId);

        return {
            customSoundSetNames,
            selectedSoundSet,
            nothingSelected
        }
    }

    override async _onChangeForm(_formConfig: ApplicationFormConfiguration, event: Event) {
        logd(event)
        
        // @ts-expect-error (target.id is ok)
        if (event.target?.id === "name-input") {
            // @ts-expect-error (target.value is ok)
            const newDisplayName = event.target.value;
            if (!newDisplayName) {
                this.render();
                return;
            }
            // @ts-expect-error (dataset.id is ok)
            updateCustomSoundSetDisplayName(event.target.dataset.id, newDisplayName);
            this.render();
        }
    }

    static createSoundSet() {
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
        // @ts-expect-error (this.render is ok)
        this.selectedSoundSetId = newSoundSet.id;
        // @ts-expect-error (this.render is ok)
        this.render();
    }

    static selectSoundSet(_event: PointerEvent, target: HTMLElement) {
        // @ts-expect-error (this.selectedSoundSet is ok)
        this.selectedSoundSetId = target.dataset.id;
        // @ts-expect-error (this.selectedSoundSet is ok)
        logd(this.selectedSoundSetId);
        // @ts-expect-error (this.render is ok)
        this.render();
    }

    static addSound(_event: PointerEvent, target: HTMLElement) {
        const soundSetId = target.dataset.id;
        if (!soundSetId) {
            return;
        }
        const soundType = target.dataset.type as SoundType;
        // @ts-expect-error (filepicker is ok)
        const fp = new FilePicker({
            title: "Select a sound",
            type: "audio",
            callback: (path: string) => {
                addSoundToCustomSoundSet(soundSetId, soundType, path);
                // @ts-expect-error (this.render is ok)
                this.render();
            }
        });
        fp.render();        
    }

    static playCustomSound(_event: PointerEvent, target: HTMLElement) {
        playSound(target.dataset.path!, false);
    }

    static deleteCustomSound(_event: PointerEvent, target: HTMLElement){
        // @ts-expect-error (this.selectedSoundSetId is ok)
        deleteSoundFromCustomSoundSet(this.selectedSoundSetId, target.dataset.type as SoundType, Number(target.dataset.index));
        // @ts-expect-error (this.render is ok)
        this.render();
    }

    static async deleteSoundSet(_event: PointerEvent, target: HTMLElement) {

        const soundSetDisplayName = target.dataset.display_name
        const confirmed = await DialogV2.confirm({
            window: { title: "Confirm Delete" },
            content: `<p>Are you sure you want to delete ${soundSetDisplayName}?</p>`,
            modal: true
          })
        
        if (confirmed){ 
            deleteCustomSoundSet(target.dataset.id!);
            // @ts-expect-error (this.render is ok)
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