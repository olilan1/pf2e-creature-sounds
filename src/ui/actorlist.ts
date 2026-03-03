import { findSoundSet, playSoundForCreature } from "../creaturesounds.ts";
import { ActorPF2e } from "foundry-pf2e";
import { ActorSoundSelectApp } from "./actorsoundselect.ts";
import { ApplicationClosingOptions, ApplicationConfiguration, ApplicationRenderOptions } from "foundry-pf2e/foundry/client/applications/_module.mjs";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;
const ImagePopout = foundry.applications.apps.ImagePopout;

export class ActorListApp extends HandlebarsApplicationMixin(ApplicationV2) {

    // Default to the party folder
    #selectedFolderId: string = "THEPARTY";
    #scrollPosTable: number = 0;
    #scrollPosFolders: number = 0;
    #hookId: number | null = null;

    static override DEFAULT_OPTIONS = {
        tag: "form",
        id: "actor-list",
        classes: ["standard-form"],
        window: {
            title: "Overview of Actors and their associated soundsets",
            resizable: true,
            icon: "fas fa-users",
            contentClasses: ["standard-content"]
        },
        position: {
            width: 1200,
            height: 700
        },
        actions: {
            play_attack_sound: ActorListApp.playAttackSound,
            play_hurt_sound: ActorListApp.playHurtSound,
            play_death_sound: ActorListApp.playDeathSound,
            open_actor_sound_select: ActorListApp.openActorSoundSelectDialog,
            open_character_sheet: ActorListApp.openActorCharacterSheet,
            open_actor_image: ActorListApp.openActorCharacterImage,
            select_actor_folder: ActorListApp.selectActorFolder
        }
    };

    static override PARTS = {
        content: {
            template: "modules/pf2e-creature-sounds/templates/actor-list.hbs"
        }
    };

    override async _prepareContext() {

        const selectedFolderId = this.#selectedFolderId;

        const actorFolders = getActorFolders(selectedFolderId);

        // The party isn't actually a folder, so we have to add it manually
        actorFolders.unshift({
            id: "THEPARTY",
            name: "The Party",
            selected: selectedFolderId === "THEPARTY" ? true : false
        });

        // Actors in Root directory have no folder so needs to be added manually
        actorFolders.push({
            id: "ROOT",
            name: "No Folder",
            selected: selectedFolderId === "ROOT" ? true : false
        });

        const folderIds = getChildrenFolderIds(selectedFolderId);

        let actorsToDisplay: ActorPF2e[] = [];
        const partyMembers = (game.actors.party?.members ?? []) as ActorPF2e[];

        if (selectedFolderId === "THEPARTY") {
            actorsToDisplay = partyMembers;
        } else if (selectedFolderId === "ROOT") {
            actorsToDisplay = game.actors.contents.filter(actor => !actor.folder && !partyMembers.includes(actor));
        } else {
            actorsToDisplay = game.actors.contents.filter(actor =>
                folderIds.includes(actor.folder?.id || "")
            );
        }

        actorsToDisplay = actorsToDisplay.filter(actor =>
            ["character", "npc", "familiar"].includes(actor.type)
        );

        const actorPromises = actorsToDisplay.map(async (actor: ActorPF2e) => {

            const traits = actor.system.traits?.value ?? [];

            const traitsMap = traits.map((trait: string) => {
                const label = game.i18n.localize(CONFIG.PF2E?.creatureTraits?.[trait as keyof typeof CONFIG.PF2E.creatureTraits] || trait);
                const tooltip = game.i18n.localize(CONFIG.PF2E?.traitsDescriptions[trait as keyof typeof CONFIG.PF2E.traitsDescriptions]);
                return { label, tooltip };
            });

            let soundSetName = `No Soundset`;
            let isNoSoundSet = true;

            const soundSet = await findSoundSet(actor);

            if (soundSet) {
                soundSetName = soundSet.display_name;
                isNoSoundSet = false;
            }

            const isOverriden = !!actor.getFlag("pf2e-creature-sounds", "soundset");

            return {
                id: actor.id,
                name: actor.name,
                img: actor.img,
                traits: traitsMap,
                soundSetName: soundSetName,
                isOverriden: isOverriden,
                isNoSoundSet: isNoSoundSet
            };
        });

        const actorData = await Promise.all(actorPromises);

        return {
            selectedFolderId,
            actorFolders,
            actors: actorData
        };
    }

    // Add scroll position listener when opening
    constructor(options: Partial<ApplicationConfiguration> = {}) {
        super(options);
        if (!this.#hookId) {
            this.#hookId = Hooks.on("updateActor", (_actor: ActorPF2e) => {
                this.render();
            });
        }
    }

    // Save scroll position before re-rendering
    override async render(options: Partial<ApplicationRenderOptions> & { resetTableScroll?: boolean } = {}): Promise<this> {
        this.#saveScrollPositions(options.resetTableScroll);
        return super.render(options);
    }

    #saveScrollPositions(resetTableScroll?: boolean) {

        const scrollContainerFolders = this.element?.querySelector(".pf2ecs-actorlist-folder-box");
        const scrollContainerTable = this.element?.querySelector(".pf2ecs-actorlist-right-column");

        if (scrollContainerFolders) {
            this.#scrollPosFolders = scrollContainerFolders.scrollTop;
        }

        if (scrollContainerTable && !resetTableScroll) {
            this.#scrollPosTable = scrollContainerTable.scrollTop;
        }

    }

    // Remove scroll position listener when closing
    override async close(options: ApplicationClosingOptions = {}): Promise<this> {
        if (this.#hookId) {
            Hooks.off("updateActor", this.#hookId);
            this.#hookId = null;
        }
        await super.close(options);
        return this;
    }

    // Restore scroll position after re-rendering
    protected override async _onRender(context: object, options: ApplicationRenderOptions): Promise<void> {

        await super._onRender(context, options);
        this.#restoreScrollPositions();
    }

    #restoreScrollPositions() {
        const scrollContainerLeft = this.element.querySelector(".pf2ecs-actorlist-folder-box");
        const scrollContainerRight = this.element.querySelector(".pf2ecs-actorlist-right-column");

        if (scrollContainerLeft && this.#scrollPosFolders > 0) {
            scrollContainerLeft.scrollTop = this.#scrollPosFolders;
        }

        if (scrollContainerRight && this.#scrollPosTable > 0) {
            scrollContainerRight.scrollTop = this.#scrollPosTable;
        }
    }

    static playAttackSound(this: ActorListApp, _event: PointerEvent, target: HTMLElement) {
        ActorListApp.#playSound(target, "attack");
    }

    static playHurtSound(this: ActorListApp, _event: PointerEvent, target: HTMLElement) {
        ActorListApp.#playSound(target, "hurt");
    }

    static playDeathSound(this: ActorListApp, _event: PointerEvent, target: HTMLElement) {
        ActorListApp.#playSound(target, "death");
    }

    static #playSound(target: HTMLElement, type: "attack" | "hurt" | "death") {
        const actor = game.actors.get(target.dataset.id as string);
        if (!actor) return;
        playSoundForCreature(actor, type, false, true);
    }

    static openActorSoundSelectDialog(this: ActorListApp, _event: PointerEvent, target: HTMLElement) {
        const actor = game.actors.get(target.dataset.id as string);
        if (!actor) return;
        new ActorSoundSelectApp(actor).render(true);
    }

    static openActorCharacterSheet(this: ActorListApp, _event: PointerEvent, target: HTMLElement) {
        const actor = game.actors.get(target.dataset.id as string);
        if (actor) {
            actor.sheet.render(true);
        } else {
            ui.notifications.warn("Could not find this actor!");
        }
    }

    static openActorCharacterImage(this: ActorListApp, _event: PointerEvent, target: HTMLElement) {
        const actor = game.actors.get(target.dataset.id as string);
        if (!actor) return;
        const popout = new ImagePopout({ src: actor.img, window: { title: actor.name } });
        popout.render(true);
    }

    static selectActorFolder(this: ActorListApp, _event: PointerEvent, target: HTMLElement) {

        // No need to re-render if we are already showing the selected folder
        const folderId = target.dataset.id;
        if (!folderId || folderId === this.#selectedFolderId) return;

        this.#selectedFolderId = folderId;

        // We want to force a table scroll reset when we change folders
        this.render({ resetTableScroll: true });

    }
}

function getActorFolders(selectedFolderId: string | null): { id: string, name: string, selected: boolean }[] {

    // Find only the root-level Actor folders
    const roots = game.folders.filter(f => f.type === "Actor" && !f.folder);

    const result: { id: string, name: string, selected: boolean }[] = [];

    function traverse(folder: Folder, prefix: string, isLastChild: boolean, isRoot: boolean) {
        let displayName = folder.name;

        const space = "\u00A0";

        if (!isRoot) {
            const connector = isLastChild ? `└─${space}` : `├─${space}`;
            displayName = `${prefix}${connector}${folder.name}`;
        }

        result.push({
            id: folder.id,
            name: displayName,
            selected: folder.id === selectedFolderId
        });

        const children = folder.getSubfolders();

        let childPrefix = prefix;
        if (!isRoot) {
            childPrefix += (isLastChild ? `${space}${space}${space}${space}` : `│${space}${space}${space}`);
        }

        children.forEach((child, index) => {
            const last = index === children.length - 1;
            traverse(child, childPrefix, last, false);
        });
    }

    roots.forEach(root => traverse(root, "", true, true));

    return result;
}

function getChildrenFolderIds(folderId: string): string[] {
    const parentFolder = game.folders.get(folderId);
    if (!parentFolder) return [];

    const descendantFolders = parentFolder.getSubfolders(true);

    return [folderId, ...descendantFolders.map(f => f.id)];
}