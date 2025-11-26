import { findSoundSet, playSoundForCreature } from "../creaturesounds.ts";
import { ActorPF2e } from "foundry-pf2e";
import { ActorSoundSelectApp } from "./actorsoundselect.ts";
import { ApplicationClosingOptions, ApplicationConfiguration, ApplicationRenderOptions } from "foundry-pf2e/foundry/client/applications/_module.mjs";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;
const ImagePopout = foundry.applications.apps.ImagePopout;

export class ActorListApp extends HandlebarsApplicationMixin(ApplicationV2) {

    #hookId: number | null = null;
    #scrollPos: number = 0;

    static override DEFAULT_OPTIONS = {
        tag: "form",
        id: "my-actor-list",
        classes: ["standard-form"],
        window: {
            title: "Actor List",
            resizable: true,
            icon: "fas fa-users",
            contentClasses: ["standard-content"]
        },
        position: {
            width: 1000,
            height: 800
        },
        actions: {
            play_attack_sound: ActorListApp.playAttackSound,
            play_hurt_sound: ActorListApp.playHurtSound,
            play_death_sound: ActorListApp.playDeathSound,
            open_actor_sound_select: ActorListApp.openActorSoundSelectDialog,
            open_character_sheet: ActorListApp.openActorCharacterSheet,
            open_actor_image: ActorListApp.openActorCharacterImage
        }
    };

    static override PARTS = {
        content: {
            template: "modules/pf2e-creature-sounds/templates/my-actor-list.hbs",
            scrollable: [".my-actor-list-content"]
        }
    };


    override async _prepareContext() {

        const actors = game.actors.contents;

        const filteredActors = actors.filter(actor => {
            return actor.type === "character" || actor.type === "npc" || actor.type === "familiar";
        });

        const actorPromises = filteredActors.map(async (actor: ActorPF2e) => {

            const rawTraits = actor.system.traits?.value || [];

            const localisedTraits = rawTraits.map((trait: string) => {
                const label = CONFIG.PF2E?.creatureTraits?.[trait as keyof typeof CONFIG.PF2E.creatureTraits] || trait;
                return game.i18n.localize(label);
            });

            let soundSetName = `No Soundset Selected`;

            const soundSet = await findSoundSet(actor);

            if (soundSet) {
                soundSetName = soundSet.display_name;
            }

            const override = actor.getFlag("pf2e-creature-sounds", "soundset");
            let isOverriden = false;
            if (override) {
                isOverriden = true;
            }

            return {
                id: actor.id,
                name: actor.name,
                img: actor.img,
                traits: localisedTraits.sort(),
                soundSetName: soundSetName,
                isOverriden: isOverriden
            };
        });

        const actorData = await Promise.all(actorPromises);

        return {
            actors: actorData
        };
    }

    constructor(options: Partial<ApplicationConfiguration> = {}) {
        super(options);
        if (!this.#hookId) {
            this.#hookId = Hooks.on("updateActor", (_actor: ActorPF2e) => {
                this.render(); 
            });
        }
    }

    override async render(options: Partial<ApplicationRenderOptions> = {}): Promise<this> {
        const scrollContainer = this.element?.querySelector(".my-actor-list-content");
        
        if (scrollContainer) {
            this.#scrollPos = scrollContainer.scrollTop;
        }

        return super.render(options);
    }

    override async close(options: ApplicationClosingOptions = {}): Promise<this> {
        if (this.#hookId) {
            Hooks.off("updateActor", this.#hookId);
            this.#hookId = null;
        }
        await super.close(options);
        return this;
    }

    protected override async _onRender(context: object, options: ApplicationRenderOptions): Promise<void> {

        await super._onRender(context, options);
        const scrollContainer = this.element.querySelector(".my-actor-list-content");
        
        if (scrollContainer && this.#scrollPos > 0) {
            scrollContainer.scrollTop = this.#scrollPos;
        }
    }

    static playAttackSound(this: ActorListApp, _event: PointerEvent, target: HTMLElement) {
        const actor = game.actors.get(target.dataset.id as string);
        if (!actor) return;
        playSoundForCreature(actor, "attack", false, true);
    }

    static playHurtSound(this: ActorListApp, _event: PointerEvent, target: HTMLElement) {
        const actor = game.actors.get(target.dataset.id as string);
        if (!actor) return;
        playSoundForCreature(actor, "hurt", false, true);
    }

    static playDeathSound(this: ActorListApp, _event: PointerEvent, target: HTMLElement) {
        const actor = game.actors.get(target.dataset.id as string);
        if (!actor) return;
        playSoundForCreature(actor, "death", false, true);
    }

    static openActorSoundSelectDialog(this: ActorListApp, _event: PointerEvent, target: HTMLElement){
        const actor = game.actors.get(target.dataset.id as string);
        if (!actor) return;
        new ActorSoundSelectApp(actor).render(true);
    }

    static openActorCharacterSheet(this: ActorListApp, _event: PointerEvent, target: HTMLElement){

        const actorId = target.dataset.id; 
        if (!actorId) return;
        const actor = game.actors.get(actorId);
        if (actor) {
            actor.sheet.render(true);
        } else {
            ui.notifications.warn("Could not find this actor!");
        }
    }

    static openActorCharacterImage(this: ActorListApp, _event: PointerEvent, target: HTMLElement){
        const actorId = target.dataset.id; 
        if (!actorId) return;
        const actor = game.actors.get(actorId);
        if (!actor) return;
        const popout = new ImagePopout({src: actor.img, window: { title: actor.name } });
        popout.render(true);
    }
}