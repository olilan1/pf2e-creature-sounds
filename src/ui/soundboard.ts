import { playSoundForCreature, SoundType } from "../creaturesounds.ts";
import { getSelectedActor } from "../utils.ts";

const SOUNDBOARD_HTML = `
        <div class="expandable">
        <div class="wrapper">
            <div class="pf2ecs-soundboard-buttons">
                <button id="play_attack_sound" data-tooltip="Broadcast to all players an attack sound for the selected token."><i class="fa-solid fa-burst"></i> Attack</button>
                <button id="play_hurt_sound" data-tooltip="Broadcast to all players a hurt sound for the selected token."><i class="fa-solid fa-person-falling-burst"></i> Hurt</button>
                <button id="play_death_sound" data-tooltip="Broadcast to all players a death sound for the selected token."><i class="fa-solid fa-skull"></i> Death</button>
            </div>
        </div>
        </div>
        `;

const V13_HEADER = `
        <header class="playlist-header" data-action="volumeExpand">
            <i class="expand fa-solid fa-angle-up"></i>
            <strong>PF2e Creature Sounds</strong>
        </header>
        `;
        

const V12_HEADER = `
        <header class="playlist-header flexrow">
            <h4>
                PF2e Creature Sounds
            </h4>
        </header>
        `;

function handleSoundboardButtonClick(soundType: SoundType) {
    const selectedActor = getSelectedActor();
    if (!selectedActor) {
        return;
    }
    playSoundForCreature(selectedActor, soundType, true, true);
}

export function loadSoundboardUI(html: HTMLElement) {

    // Check if the soundboard has already been added
    if (html.querySelector("#creature-soundboard")) {
        return;
    }

    // Find the global volume controls to insert the soundboard after
    // It's an id in v12, but a class in v13
    const globalVolume = html.querySelector(".global-volume, #global-volume");

    if (globalVolume) {
        const soundboardDiv = document.createElement('div');
        soundboardDiv.id = 'creature-soundboard';
        soundboardDiv.className = 'global-volume global-control expanded';
        soundboardDiv.dataset.applicationPart = 'controls';
        
        soundboardDiv.innerHTML =
            (foundry.utils.isNewerVersion(game.version, "13") ? V13_HEADER : V12_HEADER)
            + SOUNDBOARD_HTML;

        // Append the soundboard div after the volume controls
        globalVolume.after(soundboardDiv);

        const attackButton = soundboardDiv.querySelector<HTMLButtonElement>("#play_attack_sound");
        const hurtButton = soundboardDiv.querySelector<HTMLButtonElement>("#play_hurt_sound");
        const deathButton = soundboardDiv.querySelector<HTMLButtonElement>("#play_death_sound");

        // Add event listeners to the buttons
        attackButton?.addEventListener("click", () => {handleSoundboardButtonClick("attack");});
        hurtButton?.addEventListener("click", () => {handleSoundboardButtonClick("hurt");});
        deathButton?.addEventListener("click", () => {handleSoundboardButtonClick("death");});
    }
}