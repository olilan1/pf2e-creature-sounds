import { ApplicationFormConfiguration, ApplicationRenderContext, ApplicationRenderOptions } from "foundry-pf2e/foundry/client/applications/_types.mjs";
import { playSound, SoundSet, SoundType } from "../creaturesounds.ts";
import {
    updateCustomSoundSet, getCustomSoundSetNames, deleteCustomSoundSet,
    getCustomSoundSet, updateCustomSoundSetDisplayName, addSoundToCustomSoundSet,
    deleteSoundFromCustomSoundSet, saveSoundSetsAsJSON,
    validateCustomSoundDatabase, updateSoundSetsWithSoundDatabase,
    deleteAllCustomSoundSets
} from "../customsoundsdb.ts";

import { isSoundDatabase } from "../utils.ts";

const FilePickerClass = foundry.utils.isNewerVersion("13", game.version)
  ? foundry.applications.apps.FilePicker
  // @ts-expect-error - v12 global FilePicker
  : FilePicker;

const { ApplicationV2, HandlebarsApplicationMixin, DialogV2 } = foundry.applications.api;
interface SoundSetEntry {
    id: string;
    display_name: string;
    selected: boolean
}

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

        return {
            customSoundSetNames,
            selectedSoundSet,
            nothingSelected
        }
    }

    override async _onRender(_context: ApplicationRenderContext, _options: ApplicationRenderOptions) {
        if (this.shouldScroll) {
            const selectedSoundSetDiv = this.element.querySelector(".sound-set-entry-selected");
            if (selectedSoundSetDiv) {
                selectedSoundSetDiv.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
            }
            this.shouldScroll = false;
        }
    }

    override async _onChangeForm(_formConfig: ApplicationFormConfiguration, event: Event) {
        if (event.target instanceof HTMLInputElement) { 
            const newDisplayName = event.target.value;
            if (!newDisplayName) {
                this.render();
                return;
            }

            await updateCustomSoundSetDisplayName(event.target.dataset.id!, newDisplayName);
            this.shouldScroll = true;
            this.render();
        }
    }

    static async createSoundSet(this: CustomSoundsApp, _event: PointerEvent, _target: HTMLElement) {
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

        const fp = new FilePickerClass({
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
            yes: {
                action: "yes",
                label: "Select folder",
                icon: "fa-solid fa-folder"
                },
            no: {
                action: "no",
                label: "Cancel",
                icon: "fa-solid fa-xmark"
            },
            window: { title: "Add folder" },
            position: {
                width: 700
            },
            content: `
            How to bulk add custom sound sets:
            <li><strong>Create a Main Folder:</strong> You can store this anywhere that is accessible by your Foundry server. The name of this folder will not matter.</li>
            <li><strong>Sound Set Folders:</strong> Inside your Main Folder, create Sub-Folders. <strong>Each of these Sub-Folders will become a new custom sound set</strong>, and its name will be the <strong>display name</strong> of the sound set.</li>
            <li><strong>Sound Type Folders:</strong> Inside <em>each sound set folder</em>, create specific Sub-Folders named <code>attack</code>, <code>hurt</code>, and <code>death</code>.</li>
            <li><strong>Sound Files:</strong> Place your audio files (MP3, OGG, WAV) directly inside these <code>attack</code>, <code>hurt</code>, or <code>death</code> subfolders based on when you want the sounds to trigger. The names of the files will not matter.</li>
            <div>
            <p/><strong>Example Structure:</strong>
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
        </div>
        `,
            modal: true
        });

        if (!confirmed) {
            return;
        }

        const fp = new FilePickerClass({
            type: "folder",
            title: "Select a folder containing your organized sound set subfolders",

            // @ts-expect-error - FilePickerOptions are ok
            callback: async (folderPath: string, picker: FilePickerOptions) => {
                try {
                    const source = picker.activeSource;
                    if (!source) {
                        return;
                    }

                    const folderContents = await FilePickerClass.browse(source, folderPath);
                    const soundSetFolders = folderContents.dirs;

                    if (soundSetFolders.length === 0) {
                        postUINotification("No subfolders found in the selected directory. Please select a folder containing subfolders that represent your sound sets.", "warn");
                        return;
                    }

                    let importedCount = 0;
                    for (const fullSoundSetPathFromBrowse of soundSetFolders) {
                        const soundSetName = decodeURIComponent(fullSoundSetPathFromBrowse.split('/').pop());
                        const soundSetId = `Folder-${fullSoundSetPathFromBrowse}`;

                        const newSoundSet: SoundSet = {
                            id: soundSetId,
                            display_name: soundSetName,
                            hurt_sounds: [],
                            attack_sounds: [],
                            death_sounds: [],
                            creatures: [],
                            keywords: [],
                            traits: [],
                            size: -1
                        };

                        const soundTypeMap: Record<string, "attack_sounds" | "hurt_sounds" | "death_sounds"> = {
                            "attack": "attack_sounds",
                            "hurt": "hurt_sounds",
                            "death": "death_sounds"
                        };

                        const soundTypeSubFolders = await FilePickerClass.browse(source, fullSoundSetPathFromBrowse);

                        for (const fullSubDirPathFromBrowse of soundTypeSubFolders.dirs) { 
                            const subDirName = fullSubDirPathFromBrowse.split('/').pop();

                            const soundType = soundTypeMap[subDirName.toLowerCase()];
                            if (soundType) {
                                const soundFiles =
                                    await FilePickerClass.browse(source, fullSubDirPathFromBrowse);

                                for (const filePath of soundFiles.files) {
                                    if (filePath.match(/\.(mp3|ogg|wav)$/i)) {
                                        newSoundSet[soundType].push(filePath);
                                    }
                                }
                            }
                        }
                        if (newSoundSet.attack_sounds.length > 0 ||
                            newSoundSet.hurt_sounds.length > 0 ||
                            newSoundSet.death_sounds.length > 0) {
                            await updateCustomSoundSet(newSoundSet);
                            importedCount++;
                        }
                    }

                    postUINotification(
                        `Successfully imported ${importedCount} custom sound sets.`, "info");
                    this.render(); 
                } catch (error: unknown) {
                    console.error("Error importing sound sets from folder:", error);
                    if (error instanceof Error) {
                        postUINotification(
                            `Error importing sound sets from folder: ${error.message}`, "error");
                    }
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
