import { playSoundForCreature } from "../creaturesounds.ts";
import { getSelectedActor } from "../utils.ts";

function handleSoundboardButtonClick(soundType: "attack" | "hurt" | "death") {
    const selectedActor = getSelectedActor();
    if (!selectedActor) {
        return;
    }
    playSoundForCreature(selectedActor, soundType, true, true);
}

export function loadSoundboardUI() {
    // Use a setTimeout to wait for the DOM to be fully ready
    setTimeout(() => {
        const html = $("#sidebar").find("#playlists");

        // Check if the soundboard has already been added
        if (html.find(".creature-soundboard").length > 0) {
            return;
        }

        // Find the header of the Playlists directory
        const header = html.find(".directory-header");

        if (header.length > 0) {
            // Create a wrapper div for the soundboard
            const soundboardDiv = $(`
                <div class="creature-soundboard" style="text-align: center; padding: 5px 0;">
                    <h4 style="display: flex; align-items: center; justify-content: center; border-bottom: 1px solid var(--color-border-light-tertiary); margin: 0 0 5px 0; padding-bottom: 2px;">
                        PF2e Creature Sounds Soundboard
                        <i class="fa-solid fa-circle-question" style="margin-left: 8px; cursor: help;" title="Broadcast a sound for the currently selected token to all players."></i>
                    </h4>
                    <div class="soundboard-buttons" style="display: flex; justify-content: center; gap: 5px;">
                    </div>
                </div>
            `);

            const attackButton = $(`<button class="play_attack_sound"><i class="fa-solid fa-burst"></i> Attack</button>`);
            const hurtButton = $(`<button class="play_hurt_sound"><i class="fa-solid fa-person-falling-burst"></i> Hurt</button>`);
            const deathButton = $(`<button class="play_death_sound"><i class="fa-solid fa-skull"></i> Death</button>`);

            // Append buttons to the container inside the new div
            const buttonsContainer = soundboardDiv.find('.soundboard-buttons');
            buttonsContainer.append(attackButton, hurtButton, deathButton);

            // Append the whole soundboard div after the directory header
            header.after(soundboardDiv);

            attackButton.on("click", (event) => { event.preventDefault(); handleSoundboardButtonClick("attack"); });
            hurtButton.on("click", (event) => { event.preventDefault(); handleSoundboardButtonClick("hurt"); });
            deathButton.on("click", (event) => { event.preventDefault(); handleSoundboardButtonClick("death"); });
        }
    }, 0);
}