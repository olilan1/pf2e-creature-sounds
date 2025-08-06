import { playSound, SoundSet, SoundType } from "../creaturesounds.ts";
import {
    updateCustomSoundSet, getCustomSoundSetNames, deleteCustomSoundSet,
    getCustomSoundSet, updateCustomSoundSetDisplayName, addSoundToCustomSoundSet,
    deleteSoundFromCustomSoundSet, saveSoundSetsAsJSON,
    validateCustomSoundDatabase, updateSoundSetsWithSoundDatabase,
    deleteAllCustomSoundSets
} from "../customsoundsdb.ts";
import { ApplicationFormConfiguration, ApplicationRenderContext, ApplicationRenderOptions } from "foundry-pf2e/foundry/client-esm/applications/_types.js";
import { isSoundDatabase, logd } from "../utils.ts";

// Assuming MODULE_ID and SETTINGS are imported from a constants file
// Make sure this import path is correct for your project
// import { MODULE_ID, SETTINGS } from "../constants.js"; 
// Placeholder for MODULE_ID if not imported from constants.js
const MODULE_ID = "pf2e-creature-sounds";

const { ApplicationV2, HandlebarsApplicationMixin, DialogV2 } = foundry.applications.api;

interface SoundSetEntry {
    id: string;
    display_name: string;
    selected: boolean
}

// @ts-expect-error - form.scrollable should not be booleans
export class CustomSoundsApp extends HandlebarsApplicationMixin(ApplicationV2) {

    selectedSoundSetId: string | null = null;
    shouldScroll = false;

    static override PARTS = {
        form: {
            template: "modules/pf2e-creature-sounds/templates/custom-sounds.hbs",
            scrollable: [".sound-set-box"]
        },
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
            delete_sound: CustomSoundsApp.deleteCustomSound,
            download_sound_sets: CustomSoundsApp.downloadSoundSets,
            upload_sound_sets: CustomSoundsApp.uploadJSON,
            clear_sound_sets: CustomSoundsApp.clearSoundSets,
            import_from_folder: CustomSoundsApp.importSoundSetsFromFolder,
        }
    }

    override async _prepareContext() {
        const customSoundSetNames = await getCustomSoundSetNames() as SoundSetEntry[];
        customSoundSetNames.sort((a, b) => a.display_name.localeCompare(b.display_name));
        for (const entry of customSoundSetNames) {
            if (entry.id === this.selectedSoundSetId) {
                entry.selected = true;
            } else {
                entry.selected = false;
            }
        }

        let selectedSoundSet: SoundSet;
        if (this.selectedSoundSetId) {
            selectedSoundSet = await getCustomSoundSet(this.selectedSoundSetId);
        } else {
            selectedSoundSet = createEmptySoundSet();
        }

        const nothingSelected = (!this.selectedSoundSetId);

        // Placeholder for getSetting and SETTINGS if not imported
        // const canEdit = this.actor.sheet.isEditable && (game.user.isGM || getSetting(SETTINGS.PLAYERS_CAN_EDIT));
        // For demonstration, assuming canEdit is always true or false as needed
        const canEdit = true; // Replace with your actual logic for canEdit

        return {
            customSoundSetNames,
            selectedSoundSet,
            nothingSelected,
            canEdit // Ensure canEdit is passed to the context for your HTML
        }
    }

    override _onRender(_context: ApplicationRenderContext, _options: ApplicationRenderOptions) {
        if (this.shouldScroll) {
            const selectedSoundSetDiv = this.element.querySelector(".sound-set-entry-selected");
            if (selectedSoundSetDiv) {
                selectedSoundSetDiv.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
            }
            this.shouldScroll = false;
        }
    }

    override async _onChangeForm(_formConfig: ApplicationFormConfiguration, event: Event) {
        const target = event.target;

        // Handle the dropdown selection
        if (target instanceof HTMLSelectElement) {
            // Assuming this.actor is available in your context
            // If not, you'll need to pass it or retrieve it differently
            await (this as any).actor.setFlag(MODULE_ID, "soundset", target.value);
            this.render();
        }

        // Handle the radio button selection
        if (target instanceof HTMLInputElement && target.type === "radio" && target.name === "pitch") {
            // Assuming this.actor is available in your context
            await (this as any).actor.setFlag(MODULE_ID, "pitch", target.value);
            this.render();
        }

        // Existing logic for display name input
        if (target instanceof HTMLInputElement && target.dataset.id) { // Check for dataset.id to differentiate from radio buttons
            const newDisplayName = target.value;
            if (!newDisplayName) {
                this.render();
                return;
            }

            await updateCustomSoundSetDisplayName(target.dataset.id!, newDisplayName);
            this.shouldScroll = true;
            this.render();
        }
    }

    static async createSoundSet(this: CustomSoundsApp, _event: PointerEvent, _target: HTMLElement) {
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

        await updateCustomSoundSet(newSoundSet);
        this.selectedSoundSetId = newSoundSet.id;
        this.shouldScroll = true;
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
            callback: async (path: string) => {
                await addSoundToCustomSoundSet(soundSetId, soundType, path);
                this.render();
            }
        });
        fp.render();
    }

    static playCustomSound(this: CustomSoundsApp, _event: PointerEvent, target: HTMLElement) {
        playSound(target.dataset.path!, false);
    }

    static async deleteCustomSound(this: CustomSoundsApp, _event: PointerEvent, target: HTMLElement) {
        if (!this.selectedSoundSetId) {
            return;
        }
        await deleteSoundFromCustomSoundSet(this.selectedSoundSetId,
            target.dataset.type as SoundType, Number(target.dataset.index));
        this.render();
    }

    static async deleteSoundSet(this: CustomSoundsApp, _event: PointerEvent, target: HTMLElement) {
        const soundSetDisplayName = target.dataset.display_name
        const confirmed = await DialogV2.confirm({
            window: { title: "Confirm Delete" },
            content: `Are you sure you want to delete ${soundSetDisplayName}?`,
            modal: true
        });

        if (confirmed) {
            await deleteCustomSoundSet(target.dataset.id!);
            if (target.dataset.id === this.selectedSoundSetId) {
                this.selectedSoundSetId = null;
            }
            this.render();
        }
    }

    static async downloadSoundSets(this: CustomSoundsApp, _event: PointerEvent, _target: HTMLElement) {
        await saveSoundSetsAsJSON();
    }

    static async uploadJSON(this: CustomSoundsApp, _event: PointerEvent, _target: HTMLElement) {
        const confirmed = await DialogV2.confirm({
            window: { title: "Confirm Upload" },
            content: `Uploading will overwrite any custom sound sets with the same ID.
                <br>Do you want to continue?`,
            modal: true
        });

        if (confirmed) {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = '.json';
            fileInput.style.display = 'none';
            document.body.appendChild(fileInput);

            fileInput.addEventListener('change', (event) => {
                const file = (event.target as HTMLInputElement)?.files?.[0];

                if (file) {
                    const reader = new FileReader();

                    reader.onload = async (event) => {
                        const jsonObject: unknown = JSON.parse(event.target?.result as string);
                        if (!isSoundDatabase(jsonObject)) {
                            postUINotification('Invalid JSON structure.', 'error');
                        } else {
                            const validationResult = validateCustomSoundDatabase(jsonObject);
                            switch (validationResult) {
                                case "OK": {
                                    const numberOfEntries = await updateSoundSetsWithSoundDatabase(jsonObject);
                                    if (numberOfEntries === 0) {
                                        postUINotification('No entries found in JSON file.', 'info');
                                    } else {
                                        postUINotification(`Custom Sounds updated successfully with ${numberOfEntries} entries`, `info`)
                                    }
                                    break;
                                }
                                case "duplicate_ids":
                                    postUINotification('Duplicate ID detected in JSON file', 'error');
                                    break;
                                case "invalid_id_format":
                                    postUINotification('IDs must start with "Custom-"', 'error');
                                    break;
                                case "name_id_mismatch":
                                    postUINotification('Object Name and ID should match.', 'error');
                                    break;
                            }
                            this.render();
                        }
                    };

                    reader.readAsText(file);
                }
            });

            fileInput.click();
            fileInput.remove();
        }
    }

    static async clearSoundSets(this: CustomSoundsApp, _event: PointerEvent, _target: HTMLElement) {
        const confirmed = await DialogV2.confirm({
            window: { title: "Confirm Clear" },
            content: `Are you sure you want to clear all custom sound sets?`,
            modal: true
        });

        if (confirmed) {
            await deleteAllCustomSoundSets();
            this.selectedSoundSetId = null;
            this.render();
        }
    }

    static async importSoundSetsFromFolder(this: CustomSoundsApp, _event: PointerEvent, _target: HTMLElement) {
        const confirmed = await DialogV2.confirm({
            window: { title: "Confirm Import" },
            content: `
            <li><strong>Create a Main Folder:</strong> You can store this anywhere that is accessible by your Foundry server. The name of this folder will not matter.</li>
            <li><strong>Sound Set Folders:</strong> Inside your Main Folder, create Sub-Folders. <strong>Each of these Sub-Folders will become a new custom sound set</strong>, and its name will be the <strong>display name</strong> of the sound set.</li>
            <li><strong>Sound Type Folders:</strong> Inside <em>each sound set folder</em>, create specific Sub-Folders named <code>attack</code>, <code>hurt</code>, and <code>death</code>.</li>
            <li><strong>Sound Files:</strong> Place your audio files (MP3, OGG, WAV) directly inside these <code>attack</code>, <code>hurt</code>, or <code>death</code> subfolders based on when you want the sounds to trigger. The names of the files will not matter.</li>
            <p><strong>Example Structure:</strong></p>
            <pre><code>CustomSoundsFolder/
├── Ghast/
│   ├── attack/
│   │   ├── ghast_attack_01.mp3
│   │   └── ghast_attack_02.wav
│   ├── hurt/
│   │   └── ghast_hurt_01.ogg
│   └── death/
│       └── ghast_death_01.mp3
└── Vampire/
    ├── attack/
    │   └── vamp_attack_01.mp3
    ├── hurt/
    │   └── vamp_hurt_01.wav
    └── death/
        └── vampire_death.ogg
        </code></pre>
        <ul>
            <li>Note: Subfolders with the same name will overwrite preexisting sound sets.</li>
            <br>Do you want to continue?</li>
        </ul>
        `,
            modal: true
        });

        if (!confirmed) {
            return;
        }

        const fp = new FilePicker({
            type: "folder",
            title: "Select a folder containing your organized sound set subfolders",
            callback: async (folderPath: string, picker: FilePicker) => {
                try {
                    const source = picker.activeSource;

                    let basePath = folderPath;
                    if (basePath.startsWith("/")) {
                        basePath = basePath.substring(1);
                    }
                    if (basePath.startsWith(`${source}/`)) {
                        basePath = basePath.substring(source.length + 1);
                    }
                    if (basePath.endsWith("/")) {
                        basePath = basePath.slice(0, -1);
                    }

                    const folderContents = await FilePicker.browse(source, basePath);
                    const soundSetFolders = folderContents.dirs;

                    if (soundSetFolders.length === 0) {
                        postUINotification("No subfolders found in the selected directory. Please select a folder containing subfolders that represent your sound sets.", "warn");
                        return;
                    }

                    let importedCount = 0;
                    for (const fullSoundSetPathFromBrowse of soundSetFolders) {
                        const soundSetName = fullSoundSetPathFromBrowse.split('/').pop();
                        if (!soundSetName) {
                            console.warn("Skipping invalid sound set path:", fullSoundSetPathFromBrowse);
                            continue;
                        }

                        const soundSetBrowsePath = fullSoundSetPathFromBrowse;

                        const newSoundSet: SoundSet = {
                            id: soundSetName,
                            display_name: soundSetName,
                            hurt_sounds: [],
                            attack_sounds: [],
                            death_sounds: [],
                            creatures: [],
                            keywords: [],
                            traits: [],
                            size: -1
                        };

                        const soundTypeMap: Record<string, SoundType> = {
                            "attack": "attack_sounds",
                            "hurt": "hurt_sounds",
                            "death": "death_sounds"
                        };

                        const soundTypeSubFolders = await FilePicker.browse(source, soundSetBrowsePath);

                        for (const fullSubDirPathFromBrowse of soundTypeSubFolders.dirs) { 
                            const subDirName = fullSubDirPathFromBrowse.split('/').pop();
                            if (!subDirName) {
                                continue;
                            }

                            const soundType = soundTypeMap[subDirName.toLowerCase()];
                            if (soundType) {
                                const soundFileBrowsePath = fullSubDirPathFromBrowse;
                                const soundFiles = await FilePicker.browse(source, soundFileBrowsePath);

                                for (const filePath of soundFiles.files) {
                                    if (filePath.match(/\.(mp3|ogg|wav)$/i)) {
                                        newSoundSet[soundType].push(filePath);
                                    }
                                }
                            }
                        }
                        await updateCustomSoundSet(newSoundSet);
                        importedCount++;
                    }

                    postUINotification(`Successfully imported ${importedCount} custom sound sets.`, "info");
                    this.render(); 
                } catch (error: any) {
                    console.error("Error importing sound sets from folder:", error);
                    postUINotification(`Failed to import sound sets: ${error.message}`, "error");
                }
            }
        });
        fp.render();
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

export function postUINotification(message: string, type: "info" | "warn" | "error") {
    switch (type) {
        case "info":
            ui.notifications.info(message);
            break;
        case "warn":
            ui.notifications.warn(message);
            break;
        case "error":
            ui.notifications.error(message);
            break;
    }
}
