import { SoundSet } from "./creaturesounds.ts";
import { getCustomSoundSets, setCustomSoundSets } from "./settings.ts";
import { logd } from "./utils.ts";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class CustomSoundsApp extends HandlebarsApplicationMixin(ApplicationV2) {

    selectedSoundSet: string | null = null;

    static override PARTS = {
        form: {
            template: "modules/pf2e-creature-sounds/templates/custom-sounds.hbs"
        }
    }

    static override DEFAULT_OPTIONS = {
        id: "custom-sounds-app",
        tag: "form",
        form: {
            handler: CustomSoundsApp.myFormHandler,
            submitOnChange: false,
            closeOnSubmit: true
        },
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
            select_sound_set: CustomSoundsApp.selectSoundSet,
        }
    }

    override async _prepareContext() {
        const customSoundSetNames = getCustomSoundSets().map((set) => set.display_name);
        const selectedSoundSet = this.selectedSoundSet;
        return {
            customSoundSetNames, 
            selectedSoundSet
        }
    }

    static async myFormHandler(_event: Event | SubmitEvent, _form: HTMLFormElement, formData: FormDataExtended) {
        CustomSoundsApp.addSoundSet(formData.object.sound_set_name as string)
    }

    static addSoundSet(soundSetName: string) {
        logd(soundSetName);
        //create sound set
        const newSoundSet: SoundSet = {
            name: soundSetName,
            display_name: soundSetName,
            hurt_sounds: [],
            attack_sounds: [],
            death_sounds: [],
        };

        const customSoundSets = getCustomSoundSets();
        customSoundSets.push(newSoundSet);
        setCustomSoundSets(customSoundSets);
    }

    static selectSoundSet(event: PointerEvent, target: HTMLElement) {
        logd(event);
        logd(target);
        logd(target.attributes.getNamedItem("data-key")?.value)
        // @ts-expect-error (this.selectedSoundSet is ok)
        this.selectedSoundSet = target.attributes.getNamedItem("data-key")?.value;
        // @ts-expect-error (this.render is ok)
        this.render();
    }
}