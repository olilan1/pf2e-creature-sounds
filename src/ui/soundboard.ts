import { playSoundForCreature, SoundType } from "../creaturesounds.ts";
import { getSelectedActor } from "../utils.ts";

function handleSoundboardButtonClick(SoundType: SoundType) {
    const selectedActor = getSelectedActor();
    if (!selectedActor) {
        return;
    }
    playSoundForCreature(selectedActor, SoundType, true, true);
}

export function loadSoundboardUI(html: HTMLElement) {
    // The `html` parameter from a Foundry hook is a JQuery object. We need the underlying HTMLElement.

    // Use a setTimeout to wait for the DOM to be fully ready
    setTimeout(() => {

        // Check if the soundboard has already been added
        if (html.querySelector(".creature-soundboard")) {
            return;
        }

        // Find the directory list to insert the soundboard after
        const directoryList = html.querySelector(".directory-list");

        if (directoryList) {
            // Create a wrapper div for the soundboard, matching Foundry's volume control style
            const soundboardDiv = document.createElement('div');
            soundboardDiv.className = 'creature-soundboard global-volume global-control expanded';
            soundboardDiv.dataset.applicationPart = 'controls';
            
            soundboardDiv.innerHTML = `
            <header class="playlist-header" data-action="volumeExpand">
                <i class="expand fa-solid fa-angle-up"></i>
                <strong>PF2e Creature Sounds</strong>
            </header>
            <div class="expandable">
                <div class="wrapper">
                    <ul class="soundboard-controls plain">
                        <li class="soundboard-buttons flexrow">
                            <div class="soundboard-buttons-wrapper">
                                <button class="play_attack_sound" data-tooltip="Broadcast to all players an attack sound for the currently selected token."><i class="fa-solid fa-burst"></i> Attack</button>
                                <button class="play_hurt_sound" data-tooltip="Broadcast to all players a hurt sound for the currently selected token."><i class="fa-solid fa-person-falling-burst"></i> Hurt</button>
                                <button class="play_death_sound" data-tooltip="Broadcast to all players a death sound for the currently selected token."><i class="fa-solid fa-skull"></i> Death</button>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            `;

            // Append the whole soundboard div after the directory list
            directoryList.before(soundboardDiv);

            const attackButton = soundboardDiv.querySelector<HTMLButtonElement>(".play_attack_sound");
            const hurtButton = soundboardDiv.querySelector<HTMLButtonElement>(".play_hurt_sound");
            const deathButton = soundboardDiv.querySelector<HTMLButtonElement>(".play_death_sound");

            attackButton?.addEventListener("click", (event) => { event.preventDefault(); handleSoundboardButtonClick("attack"); });
            hurtButton?.addEventListener("click", (event) => { event.preventDefault(); handleSoundboardButtonClick("hurt"); });
            deathButton?.addEventListener("click", (event) => { event.preventDefault(); handleSoundboardButtonClick("death"); });
        }
    }, 0);
}