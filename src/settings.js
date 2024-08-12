const SETTINGS_NAMESPACE = "samioli-module";

export const SETTINGS = {
    CREATURE_SOUNDS_ENABLE: "creatureSounds_enable",
    CREATURE_SOUNDS_CHARACTER_ENABLE: "creatureSounds_characters",
    CREATURE_SOUNDS_VOLUME: "creatureSounds_volume"
};

export function registerSettings() {
    game.settings.register(SETTINGS_NAMESPACE, SETTINGS.CREATURE_SOUNDS_ENABLE, {
        name: "Creature sounds",
        hint: "Enable creature-specific sounds",
        scope: "world",
        config: true,
        default: true,
        type: Boolean
    });

    game.settings.register(SETTINGS_NAMESPACE, SETTINGS.CREATURE_SOUNDS_CHARACTER_ENABLE, {
        name: "Character sounds",
        hint: "Enable creature sounds functionality for player characters",
        scope: "world",
        config: true,
        default: true,
        type: Boolean
    });

    game.settings.register(SETTINGS_NAMESPACE, SETTINGS.CREATURE_SOUNDS_VOLUME, {
        name: "Creature sound volume",
        hint: "Volume for those creature sounds",
        scope: "client",
        config: true,
        default: 0.5,
        range: {
            min: 0,
            max: 1,
            step: 0.1
        },
        type: Number
    });
}

export function getSetting(setting) {
    return game.settings.get(SETTINGS_NAMESPACE, setting);
}