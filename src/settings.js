const SETTINGS_NAMESPACE = "samioli-module";

export const SETTINGS = {
    CREATURE_SOUNDS: "creatureSounds_enable",
    CREATURE_SOUNDS_CHARACTER: "creatureSounds_characters",
    CREATURE_SOUNDS_VOLUME: "creatureSounds_volume",
    CREATURE_ATTACK_SOUNDS: "creatureSounds_attack_enable",
    CREATURE_HURT_SOUNDS: "creatureSounds_hurt_enable",
    TEMPLATE_TARGET: "template_target_enable",
    AUTO_PANACHE: "automatic_panache_enable",
};

export function registerSettings() {
    game.settings.register(SETTINGS_NAMESPACE, SETTINGS.CREATURE_SOUNDS, {
        name: "Creature sounds",
        hint: "Enable creature-specific sounds",
        scope: "world",
        config: true,
        default: true,
        type: Boolean
    });

    game.settings.register(SETTINGS_NAMESPACE, SETTINGS.CREATURE_SOUNDS_CHARACTER, {
        name: "Character sounds",
        hint: "Enable creature sounds functionality for player characters",
        scope: "world",
        config: true,
        default: true,
        type: Boolean
    });

    game.settings.register(SETTINGS_NAMESPACE, SETTINGS.CREATURE_ATTACK_SOUNDS, {
        name: "Attack sounds",
        hint: "Enable creature sounds functionality for attacks",
        scope: "world",
        config: true,
        default: true,
        type: Boolean
    });

    game.settings.register(SETTINGS_NAMESPACE, SETTINGS.CREATURE_HURT_SOUNDS, {
        name: "Hurt sounds",
        hint: "Enable creature sounds functionality for being hurt",
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

    game.settings.register(SETTINGS_NAMESPACE, SETTINGS.TEMPLATE_TARGET, {
        name: "Template targetting",
        hint: "Automatically target all tokens under a placed template",
        scope: "world",
        config: true,
        default: false,
        type: Boolean
    });

    game.settings.register(SETTINGS_NAMESPACE, SETTINGS.AUTO_PANACHE, {
        name: "Automatic Panache",
        hint: "Automatically add and remove Panache",
        scope: "world",
        config: true,
        default: false,
        type: Boolean
    });
}

export function getSetting(setting) {
    return game.settings.get(SETTINGS_NAMESPACE, setting);
}