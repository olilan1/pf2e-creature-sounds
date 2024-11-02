var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
const SETTINGS_NAMESPACE = "pf2e-creature-sounds";
const SETTINGS = {
  CREATURE_SOUNDS: "creatureSounds_enable",
  CREATURE_SOUNDS_CHARACTER: "creatureSounds_characters",
  CREATURE_SOUNDS_VOLUME: "creatureSounds_volume",
  CREATURE_ATTACK_SOUNDS: "creatureSounds_attack_enable",
  CREATURE_HURT_SOUNDS: "creatureSounds_hurt_enable",
  PLAYERS_CAN_EDIT: "players_can_edit",
  DEBUG_LOGGING: "debug_logging"
};
function registerSettings() {
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
    // @ts-ignore
    range: {
      min: 0,
      max: 1,
      step: 0.1
    },
    type: Number
  });
  game.settings.register(SETTINGS_NAMESPACE, SETTINGS.PLAYERS_CAN_EDIT, {
    name: "Allow Players to Edit Sounds",
    hint: "Allow players to edit creature sounds for actors they own",
    scope: "world",
    config: true,
    default: true,
    type: Boolean
  });
  game.settings.register(SETTINGS_NAMESPACE, SETTINGS.DEBUG_LOGGING, {
    name: "Debug logging",
    hint: "Log debug info to console",
    scope: "world",
    config: true,
    default: false,
    type: Boolean
  });
}
function getSetting(setting) {
  return game.settings.get(SETTINGS_NAMESPACE, setting);
}
const MODULE_ID = "pf2e-creature-sounds";
function getHashCode(str) {
  let hash = 0;
  if (str.length === 0) return hash;
  for (let i = 0; i < str.length; i++) {
    let char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash;
}
function logd(message) {
  if (getSetting(SETTINGS.DEBUG_LOGGING)) {
    console.log(message);
  }
}
function hasKey(obj, key) {
  return key in obj;
}
function isNPC(obj) {
  return obj.type === "npc";
}
function isCharacter(obj) {
  return obj.type === "character";
}
const Aberration = {
  display_name: "Aberration",
  notes: "",
  hurt_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Aberration/Aberration_Hurt/CREAHmn_Aberration_Hurt_01.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Aberration/Aberration_Hurt/CREAHmn_Aberration_Hurt_02.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Aberration/Aberration_Hurt/CREAHmn_Aberration_Hurt_04.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Aberration/Aberration_Hurt/CREAHmn_Aberration_Hurt_05.wav"
  ],
  attack_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Aberration/Aberration_Attack/CREAHmn_Aberration_Attack_01.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Aberration/Aberration_Attack/CREAHmn_Aberration_Attack_02.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Aberration/Aberration_Attack/CREAHmn_Aberration_Attack_03.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Aberration/Aberration_Attack/CREAHmn_Aberration_Attack_04.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Aberration/Aberration_Attack/CREAHmn_Aberration_Attack_05.wav"
  ],
  death_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Aberration/Aberration_Death/CREAHmn_Aberration_Death_01.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Aberration/Aberration_Death/CREAHmn_Aberration_Death_02.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Aberration/Aberration_Death/CREAHmn_Aberration_Death_03.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Aberration/Aberration_Death/CREAHmn_Aberration_Death_04.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Aberration/Aberration_Death/CREAHmn_Aberration_Death_05.wav"
  ],
  creatures: [],
  keywords: [],
  traits: [
    "aberration",
    "qlippoth"
  ],
  size: 3
};
const Behemoth = {
  display_name: "Behemoth",
  notes: "Big Cat would work here",
  hurt_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Behemoth/Behemoth_Hurt/CREAMnstr_Behemoth_Hurt_01.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Behemoth/Behemoth_Hurt/CREAMnstr_Behemoth_Hurt_02.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Behemoth/Behemoth_Hurt/CREAMnstr_Behemoth_Hurt_03.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Behemoth/Behemoth_Hurt/CREAMnstr_Behemoth_Hurt_04.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Behemoth/Behemoth_Hurt/CREAMnstr_Behemoth_Hurt_05.wav"
  ],
  attack_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Behemoth/Behemoth_Attack/CREAMnstr_Behemoth_Attack_01.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Behemoth/Behemoth_Attack/CREAMnstr_Behemoth_Attack_02.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Behemoth/Behemoth_Attack/CREAMnstr_Behemoth_Attack_03.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Behemoth/Behemoth_Attack/CREAMnstr_Behemoth_Attack_04.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Behemoth/Behemoth_Attack/CREAMnstr_Behemoth_Attack_05.wav"
  ],
  death_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Behemoth/Behemoth_Death/CREAMnstr_Behemoth_Death_01.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Behemoth/Behemoth_Death/CREAMnstr_Behemoth_Death_02.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Behemoth/Behemoth_Death/CREAMnstr_Behemoth_Death_03.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Behemoth/Behemoth_Death/CREAMnstr_Behemoth_Death_04.wav"
  ],
  creatures: [],
  keywords: [
    "tiger",
    "lion",
    "leopard",
    "bandersnatch",
    "chimera"
  ],
  traits: [],
  size: -1
};
const Dragon = {
  display_name: "Dragon",
  notes: "",
  hurt_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Dragon/Dragon_Hurt/CREADrgn_Dragon_Hurt_01.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Dragon/Dragon_Hurt/CREADrgn_Dragon_Hurt_02.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Dragon/Dragon_Hurt/CREADrgn_Dragon_Hurt_03.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Dragon/Dragon_Hurt/CREADrgn_Dragon_Hurt_04.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Dragon/Dragon_Hurt/CREADrgn_Dragon_Hurt_05.wav"
  ],
  attack_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Dragon/Dragon_Attack/CREADrgn_Dragon_Attack_01.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Dragon/Dragon_Attack/CREADrgn_Dragon_Attack_02.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Dragon/Dragon_Attack/CREADrgn_Dragon_Attack_03.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Dragon/Dragon_Attack/CREADrgn_Dragon_Attack_04.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Dragon/Dragon_Attack/CREADrgn_Dragon_Attack_05.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Dragon/Dragon_Attack/CREADrgn_Dragon_Attack_06.wav"
  ],
  death_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Dragon/Dragon_Death/CREADrgn_Dragon_Death_01.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Dragon/Dragon_Death/CREADrgn_Dragon_Death_02.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Dragon/Dragon_Death/CREADrgn_Dragon_Death_03.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Dragon/Dragon_Death/CREADrgn_Dragon_Death_04.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Dragon/Dragon_Death/CREADrgn_Dragon_Death_05.wav"
  ],
  creatures: [],
  keywords: [
    "hydra",
    "yamaraj"
  ],
  traits: [
    "dragon"
  ],
  size: -1
};
const Goblin = {
  display_name: "Goblin",
  notes: "",
  hurt_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Goblin/Goblin_Hurt/CREAHmn_Goblin_Hurt_01.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Goblin/Goblin_Hurt/CREAHmn_Goblin_Hurt_02.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Goblin/Goblin_Hurt/CREAHmn_Goblin_Hurt_03.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Goblin/Goblin_Hurt/CREAHmn_Goblin_Hurt_04.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Goblin/Goblin_Hurt/CREAHmn_Goblin_Hurt_05.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Goblin/Goblin_Hurt/CREAHmn_Goblin_Hurt_06.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Goblin/Goblin_Hurt/CREAHmn_Goblin_Hurt_07.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Goblin/Goblin_Hurt/CREAHmn_Goblin_Hurt_08.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Goblin/Goblin_Hurt/CREAHmn_Goblin_Hurt_09.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Goblin/Goblin_Hurt/CREAHmn_Goblin_Hurt_10.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Goblin/Goblin_Hurt/CREAHmn_Goblin_Hurt_11.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Goblin/Goblin_Hurt/CREAHmn_Goblin_Hurt_12.wav"
  ],
  attack_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Goblin/Goblin_Attack/CREAHmn_Goblin_Attack_01.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Goblin/Goblin_Attack/CREAHmn_Goblin_Attack_02.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Goblin/Goblin_Attack/CREAHmn_Goblin_Attack_03.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Goblin/Goblin_Attack/CREAHmn_Goblin_Attack_04.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Goblin/Goblin_Attack/CREAHmn_Goblin_Attack_05.wav"
  ],
  death_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Goblin/Goblin_Death/CREAHmn_Goblin_Death_01.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Goblin/Goblin_Death/CREAHmn_Goblin_Death_02.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Goblin/Goblin_Death/CREAHmn_Goblin_Death_03.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Goblin/Goblin_Death/CREAHmn_Goblin_Death_04.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Goblin/Goblin_Death/CREAHmn_Goblin_Death_05.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Goblin/Goblin_Death/CREAHmn_Goblin_Death_06.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Goblin/Goblin_Death/CREAHmn_Goblin_Death_07.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Goblin/Goblin_Death/CREAHmn_Goblin_Death_08.wav"
  ],
  creatures: [],
  keywords: [],
  traits: [
    "goblin",
    "kobold"
  ],
  size: -1
};
const Insect = {
  display_name: "Insect (Large)",
  notes: "",
  hurt_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Insect/Insect_Hurt/CREAInsc_Insect_Hurt_01.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Insect/Insect_Hurt/CREAInsc_Insect_Hurt_02.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Insect/Insect_Hurt/CREAInsc_Insect_Hurt_03.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Insect/Insect_Hurt/CREAInsc_Insect_Hurt_04.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Insect/Insect_Hurt/CREAInsc_Insect_Hurt_05.wav"
  ],
  attack_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Insect/Insect_Attack/CREAInsc_Insect_Attack_01.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Insect/Insect_Attack/CREAInsc_Insect_Attack_02.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Insect/Insect_Attack/CREAInsc_Insect_Attack_03.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Insect/Insect_Attack/CREAInsc_Insect_Attack_04.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Insect/Insect_Attack/CREAInsc_Insect_Attack_05.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Insect/Insect_Attack/CREAInsc_Insect_Attack_06.wav"
  ],
  death_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Insect/Insect_Death/CREAInsc_Insect_Death_01.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Insect/Insect_Death/CREAInsc_Insect_Death_02.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Insect/Insect_Death/CREAInsc_Insect_Death_03.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Insect/Insect_Death/CREAInsc_Insect_Death_04.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Insect/Insect_Death/CREAInsc_Insect_Death_05.wav"
  ],
  creatures: [],
  keywords: [
    "ankhrav",
    "ant",
    "beetle",
    "centipede",
    "cockroach",
    "dragonfly",
    "fly",
    "mantis",
    "mosquito",
    "scorpion",
    "seugathi",
    "spider",
    "sportlebore",
    "tarantula",
    "tick",
    "wasp",
    "wihsaak",
    "con rit",
    "mukradi",
    "vescavor"
  ],
  traits: [],
  size: 3
};
const Orc = {
  display_name: "Orc",
  notes: "",
  hurt_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Orc/Orc_Hurt/CREAHmn_Orc_Hurt_01.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Orc/Orc_Hurt/CREAHmn_Orc_Hurt_02.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Orc/Orc_Hurt/CREAHmn_Orc_Hurt_03.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Orc/Orc_Hurt/CREAHmn_Orc_Hurt_04.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Orc/Orc_Hurt/CREAHmn_Orc_Hurt_05.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Orc/Orc_Hurt/CREAHmn_Orc_Hurt_06.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Orc/Orc_Hurt/CREAHmn_Orc_Hurt_07.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Orc/Orc_Hurt/CREAHmn_Orc_Hurt_08.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Orc/Orc_Hurt/CREAHmn_Orc_Hurt_09.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Orc/Orc_Hurt/CREAHmn_Orc_Hurt_10.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Orc/Orc_Hurt/CREAHmn_Orc_Hurt_11.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Orc/Orc_Hurt/CREAHmn_Orc_Hurt_12.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Orc/Orc_Hurt/CREAHmn_Orc_Hurt_13.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Orc/Orc_Hurt/CREAHmn_Orc_Hurt_14.wav"
  ],
  attack_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Orc/Orc_Attack/CREAHmn_Orc_Attack_01.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Orc/Orc_Attack/CREAHmn_Orc_Attack_02.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Orc/Orc_Attack/CREAHmn_Orc_Attack_03.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Orc/Orc_Attack/CREAHmn_Orc_Attack_04.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Orc/Orc_Attack/CREAHmn_Orc_Attack_05.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Orc/Orc_Attack/CREAHmn_Orc_Attack_06.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Orc/Orc_Attack/CREAHmn_Orc_Attack_07.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Orc/Orc_Attack/CREAHmn_Orc_Attack_08.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Orc/Orc_Attack/CREAHmn_Orc_Attack_09.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Orc/Orc_Attack/CREAHmn_Orc_Attack_10.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Orc/Orc_Attack/CREAHmn_Orc_Attack_11.wav"
  ],
  death_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Orc/Orc_Death/CREAHmn_Orc_Death_01.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Orc/Orc_Death/CREAHmn_Orc_Death_02.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Orc/Orc_Death/CREAHmn_Orc_Death_03.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Orc/Orc_Death/CREAHmn_Orc_Death_04.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Orc/Orc_Death/CREAHmn_Orc_Death_05.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Orc/Orc_Death/CREAHmn_Orc_Death_06.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Orc/Orc_Death/CREAHmn_Orc_Death_07.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Orc/Orc_Death/CREAHmn_Orc_Death_08.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Orc/Orc_Death/CREAHmn_Orc_Death_09.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Orc/Orc_Death/CREAHmn_Orc_Death_10.wav"
  ],
  creatures: [],
  keywords: [],
  traits: [
    "orc",
    "dromaar",
    "half-orc",
    "hobgoblin",
    "bugbear"
  ],
  size: -1
};
const Skeleton = {
  display_name: "Skeleton",
  notes: "",
  hurt_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Skeleton/Skeleton_Hurt/CREAHmn_Skeleton_Hurt_01.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Skeleton/Skeleton_Hurt/CREAHmn_Skeleton_Hurt_02.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Skeleton/Skeleton_Hurt/CREAHmn_Skeleton_Hurt_03.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Skeleton/Skeleton_Hurt/CREAHmn_Skeleton_Hurt_04.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Skeleton/Skeleton_Hurt/CREAHmn_Skeleton_Hurt_05.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Skeleton/Skeleton_Hurt/CREAHmn_Skeleton_Hurt_06.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Skeleton/Skeleton_Hurt/CREAHmn_Skeleton_Hurt_07.wav"
  ],
  attack_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Skeleton/Skeleton_Attack/CREAHmn_Skeleton_Attack_01.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Skeleton/Skeleton_Attack/CREAHmn_Skeleton_Attack_02.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Skeleton/Skeleton_Attack/CREAHmn_Skeleton_Attack_03.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Skeleton/Skeleton_Attack/CREAHmn_Skeleton_Attack_04.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Skeleton/Skeleton_Attack/CREAHmn_Skeleton_Attack_05.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Skeleton/Skeleton_Attack/CREAHmn_Skeleton_Attack_06.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Skeleton/Skeleton_Attack/CREAHmn_Skeleton_Attack_07.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Skeleton/Skeleton_Attack/CREAHmn_Skeleton_Attack_08.wav"
  ],
  death_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Skeleton/Skeletons_Death/CREAHmn_Skeleton_Death_01 .wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Skeleton/Skeletons_Death/CREAHmn_Skeleton_Death_02.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Skeleton/Skeletons_Death/CREAHmn_Skeleton_Death_03.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Skeleton/Skeletons_Death/CREAHmn_Skeleton_Death_04.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Skeleton/Skeletons_Death/CREAHmn_Skeleton_Death_05.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Skeleton/Skeletons_Death/CREAHmn_Skeleton_Death_06.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Skeleton/Skeletons_Death/CREAHmn_Skeleton_Death_07.wav"
  ],
  creatures: [],
  keywords: [],
  traits: [
    "skeleton",
    "undead"
  ],
  size: -1
};
const Spectre = {
  display_name: "Spectre",
  notes: "",
  hurt_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Spectre/Spectre_Hurt/CREAEthr_Spectre_Hurt_01.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Spectre/Spectre_Hurt/CREAEthr_Spectre_Hurt_02.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Spectre/Spectre_Hurt/CREAEthr_Spectre_Hurt_03.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Spectre/Spectre_Hurt/CREAEthr_Spectre_Hurt_04.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Spectre/Spectre_Hurt/CREAEthr_Spectre_Hurt_05.wav"
  ],
  attack_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Spectre/Spectre_Attack/CREAEthr_Spectre_Attack_01.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Spectre/Spectre_Attack/CREAEthr_Spectre_Attack_02.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Spectre/Spectre_Attack/CREAEthr_Spectre_Attack_03.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Spectre/Spectre_Attack/CREAEthr_Spectre_Attack_04.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Spectre/Spectre_Attack/CREAEthr_Spectre_Attack_05.wav"
  ],
  death_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Spectre/Spectre_Death/CREAEthr_Spectre_Death_01.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Spectre/Spectre_Death/CREAEthr_Spectre_Death_02.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Spectre/Spectre_Death/CREAEthr_Spectre_Death_03.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Spectre/Spectre_Death/CREAEthr_Spectre_Death_04.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Spectre/Spectre_Death/CREAEthr_Spectre_Death_05.wav"
  ],
  creatures: [],
  keywords: [],
  traits: [
    "incorporeal",
    "wraith",
    "ghost",
    "undead",
    "phantom"
  ],
  size: -1
};
const Spider = {
  display_name: "Insect (Tiny)",
  notes: "",
  hurt_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Spider/Spider_Hurt/CREAInsc_Spider_Hurt_01.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Spider/Spider_Hurt/CREAInsc_Spider_Hurt_02.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Spider/Spider_Hurt/CREAInsc_Spider_Hurt_03.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Spider/Spider_Hurt/CREAInsc_Spider_Hurt_04.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Spider/Spider_Hurt/CREAInsc_Spider_Hurt_05.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Spider/Spider_Hurt/CREAInsc_Spider_Hurt_06.wav"
  ],
  attack_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Spider/Spider_Attack/CREAInsc_Spider_Attack_01.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Spider/Spider_Attack/CREAInsc_Spider_Attack_02.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Spider/Spider_Attack/CREAInsc_Spider_Attack_03.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Spider/Spider_Attack/CREAInsc_Spider_Attack_04.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Spider/Spider_Attack/CREAInsc_Spider_Attack_05.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Spider/Spider_Attack/CREAInsc_Spider_Attack_06.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Spider/Spider_Attack/CREAInsc_Spider_Attack_07.wav"
  ],
  death_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Spider/Spider_Death/CREAInsc_Spider_Death_01.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Spider/Spider_Death/CREAInsc_Spider_Death_02.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Spider/Spider_Death/CREAInsc_Spider_Death_03.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Spider/Spider_Death/CREAInsc_Spider_Death_04.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Spider/Spider_Death/CREAInsc_Spider_Death_05.wav"
  ],
  creatures: [],
  keywords: [
    "ankhrav",
    "ant",
    "beetle",
    "centipede",
    "cockroach",
    "dragonfly",
    "fly",
    "mantis",
    "mosquito",
    "scorpion",
    "seugathi",
    "spider",
    "sportlebore",
    "tarantula",
    "tick",
    "wasp",
    "wihsaak"
  ],
  traits: [],
  size: 0
};
const Troll = {
  display_name: "Troll",
  notes: "",
  hurt_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Troll/Troll_Hurt/CREAMnstr_Troll_Hurt_01.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Troll/Troll_Hurt/CREAMnstr_Troll_Hurt_02.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Troll/Troll_Hurt/CREAMnstr_Troll_Hurt_03.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Troll/Troll_Hurt/CREAMnstr_Troll_Hurt_04.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Troll/Troll_Hurt/CREAMnstr_Troll_Hurt_05.wav"
  ],
  attack_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Troll/Troll_Attack/CREAMnstr_Troll_Attack_01.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Troll/Troll_Attack/CREAMnstr_Troll_Attack_02.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Troll/Troll_Attack/CREAMnstr_Troll_Attack_03.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Troll/Troll_Attack/CREAMnstr_Troll_Attack_04.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Troll/Troll_Attack/CREAMnstr_Troll_Attack_05.wav"
  ],
  death_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Troll/Troll_Death/CREAMnstr_Troll_Death_01.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Troll/Troll_Death/CREAMnstr_Troll_Death_02.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Troll/Troll_Death/CREAMnstr_Troll_Death_03.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Khron_Monster_Library/Troll/Troll_Death/CREAMnstr_Troll_Death_04.wav"
  ],
  creatures: [],
  keywords: [],
  traits: [
    "troll"
  ],
  size: -1
};
const Ancient_Dragon = {
  display_name: "Dinosaur",
  notes: "",
  hurt_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Ancient_Dragon/Ancient_Dragon_Monster_Pain_1_Dinosaur_Creature_Hurt_Squeal_Vocalization.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Ancient_Dragon/Ancient_Dragon_Monster_Pain_2_Dinosaur_Creature_Hurt_Squeal_Vocalization.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Ancient_Dragon/Ancient_Dragon_Monster_Pain_3_Dinosaur_Creature_Hurt_Squeal_Vocalization.wav"
  ],
  attack_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Ancient_Dragon/Ancient_Dragon_Monster_Attack_1_Dinosaur_Creature_Roar_Growl_Moan_Groan.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Ancient_Dragon/Ancient_Dragon_Monster_Attack_2_Dinosaur_Creature_Roar_Growl_Moan_Groan.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Ancient_Dragon/Ancient_Dragon_Monster_Attack_3_Dinosaur_Creature_Roar_Growl_Moan_Groan.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Ancient_Dragon/Ancient_Dragon_Monster_Attack_4_Dinosaur_Creature_Roar_Growl_Moan_Groan.wav"
  ],
  death_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Ancient_Dragon/Ancient_Dragon_Monster_Death_1_Dinosaur_Creature_Pain_Screech_Scream_Roar_Groan.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Ancient_Dragon/Ancient_Dragon_Monster_Death_2_Dinosaur_Creature_Pain_Screech_Scream_Roar_Groan.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Ancient_Dragon/Ancient_Dragon_Monster_Death_3_Dinosaur_Creature_Pain_Screech_Scream_Roar_Groan.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Ancient_Dragon/Ancient_Dragon_Monster_Death_4_Dinosaur_Creature_Pain_Screech_Scream_Roar_Groan.wav"
  ],
  creatures: [],
  keywords: [],
  traits: [
    "dinosaur"
  ],
  size: 3
};
const Balor = {
  display_name: "Balor",
  notes: "",
  hurt_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Balor/Balor_Monster_Pain_1_Supernatural_Creature_Groan_Hurt_Death_Hit_Vocalization.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Balor/Balor_Monster_Pain_2_Supernatural_Creature_Groan_Hurt_Death_Hit_Vocalization.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Balor/Balor_Monster_Pain_3_Supernatural_Creature_Groan_Hurt_Death_Hit_Vocalization.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Balor/Balor_Monster_Pain_4_Supernatural_Creature_Groan_Hurt_Death_Hit_Vocalization.wav"
  ],
  attack_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Balor/Balor_Monster_Attack_1_Supernatural_Creature_Yell_Growl_Grunt.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Balor/Balor_Monster_Attack_2_Supernatural_Creature_Yell_Growl_Grunt.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Balor/Balor_Monster_Attack_3_Supernatural_Creature_Yell_Growl_Grunt.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Balor/Balor_Monster_Attack_4_Supernatural_Creature_Yell_Growl_Grunt.wav"
  ],
  death_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Balor/Balor_Monster_Death_1_Supernatural_Creature_Scream_Pain_Groan_Moan.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Balor/Balor_Monster_Death_2_Supernatural_Creature_Scream_Pain_Groan_Moan.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Balor/Balor_Monster_Death_3_Supernatural_Creature_Scream_Pain_Groan_Moan.wav"
  ],
  creatures: [],
  keywords: [],
  traits: [
    "fiend"
  ],
  size: 3
};
const Basilisk = {
  display_name: "Basilisk",
  notes: "",
  hurt_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Basilisk/Basilisk_Monster_Pain_1_Lizard_Reptile_Creature_Grunt_Short_Hit_Death_Hurt_Moan.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Basilisk/Basilisk_Monster_Pain_2_Lizard_Reptile_Creature_Grunt_Short_Hit_Death_Hurt_Moan.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Basilisk/Basilisk_Monster_Pain_3_Lizard_Reptile_Creature_Grunt_Short_Hit_Death_Hurt_Moan.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Basilisk/Basilisk_Monster_Pain_4_Lizard_Reptile_Creature_Grunt_Short_Hit_Death_Hurt_Moan.wav"
  ],
  attack_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Basilisk/Basilisk_Monster_Attack_1_Lizard_Reptile_Creature_Hiss_Hit_Roar_Growl.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Basilisk/Basilisk_Monster_Attack_2_Lizard_Reptile_Creature_Hiss_Hit_Roar_Growl.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Basilisk/Basilisk_Monster_Attack_3_Lizard_Reptile_Creature_Hiss_Hit_Roar_Growl.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Basilisk/Basilisk_Monster_Attack_4_Lizard_Reptile_Creature_Hiss_Hit_Roar_Growl.wav"
  ],
  death_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Basilisk/Basilisk_Monster_Death_1_Lizard_Reptile_Creature_Hiss_Groan_Moan_Screech_Squeal.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Basilisk/Basilisk_Monster_Death_2_Lizard_Reptile_Creature_Hiss_Groan_Moan_Screech_Squeal.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Basilisk/Basilisk_Monster_Death_3_Lizard_Reptile_Creature_Hiss_Groan_Moan_Screech_Squeal.wav"
  ],
  creatures: [],
  keywords: [
    "basilisk",
    "cave worm",
    "krooth"
  ],
  traits: [],
  size: -1
};
const Frost_Giant = {
  display_name: "Bear",
  notes: "",
  hurt_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Frost_Giant/Frost_Giant_Monster_Pain_1_Human_Creature_Short_Grunt_Hit_Hurt.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Frost_Giant/Frost_Giant_Monster_Pain_2_Human_Creature_Short_Grunt_Hit_Hurt.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Frost_Giant/Frost_Giant_Monster_Pain_3_Human_Creature_Short_Grunt_Hit_Hurt.wav"
  ],
  attack_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Frost_Giant/Frost_Giant_Monster_Attack_1_Human_Creature_Growl_Grunt.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Frost_Giant/Frost_Giant_Monster_Attack_2_Human_Creature_Growl_Grunt.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Frost_Giant/Frost_Giant_Monster_Attack_3_Human_Creature_Growl_Grunt.wav"
  ],
  death_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Frost_Giant/Frost_Giant_Monster_Death_1_Human_Creature_Growl_Pain_Groan_Moan_Hurt.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Frost_Giant/Frost_Giant_Monster_Death_2_Human_Creature_Growl_Pain_Groan_Moan_Hurt.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Frost_Giant/Frost_Giant_Monster_Death_3_Human_Creature_Growl_Pain_Groan_Moan_Hurt.wav"
  ],
  creatures: [],
  keywords: [
    "bear"
  ],
  traits: [],
  size: -1
};
const Kraken = {
  display_name: "Kraken",
  notes: "",
  hurt_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Kraken/Kraken_Monster_Pain_1_Hurt_Death_Howl_Moan.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Kraken/Kraken_Monster_Pain_2_Hurt_Death_Howl_Moan.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Kraken/Kraken_Monster_Pain_3_Hurt_Death_Howl_Moan.wav"
  ],
  attack_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Kraken/Kraken_Monster_Attack_1_Fight_Growl_Grunt.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Kraken/Kraken_Monster_Attack_2_Fight_Growl_Grunt.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Kraken/Kraken_Monster_Attack_3_Fight_Growl_Grunt.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Kraken/Kraken_Monster_Attack_3_No_Pre_Clank_Fight_Growl_Grunt.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Kraken/Kraken_Monster_Attack_4_Fight_Growl_Grunt.wav"
  ],
  death_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Kraken/Kraken_Monster_Death_1_Ghost_Magic_Disappear_Appear_Die_Moan_Transition.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Kraken/Kraken_Monster_Death_2_Ghost_Magic_Disappear_Appear_Die_Moan_Transition.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Kraken/Kraken_Monster_Death_2_No_Post_Clank_Ghost_Magic_Disappear_Appear_Die_Moan_Transition.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Kraken/Kraken_Monster_Death_3_Ghost_Magic_Disappear_Appear_Die_Moan_Transition.wav"
  ],
  creatures: [],
  keywords: [
    "kraken"
  ],
  traits: [],
  size: -1
};
const Mammoth = {
  display_name: "Mammoth",
  notes: "",
  hurt_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Mammoth/Mammoth_Monster_Pain_1_Elephant_Vocalization_Grunt_Breath.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Mammoth/Mammoth_Monster_Pain_2_Elephant_Vocalization_Grunt_Breath.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Mammoth/Mammoth_Monster_Pain_3_Elephant_Vocalization_Grunt_Breath.wav"
  ],
  attack_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Mammoth/Mammoth_Monster_Attack_1_Elephant_Vocalization_Roar_Squeal.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Mammoth/Mammoth_Monster_Attack_2_Elephant_Vocalization_Roar_Squeal.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Mammoth/Mammoth_Monster_Attack_3_Elephant_Vocalization_Roar_Squeal.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Mammoth/Mammoth_Monster_Attack_4_Stomp_Elephant.wav"
  ],
  death_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Mammoth/Mammoth_Monster_Death_1_Elephant_Vocalization_Roar_Moan_Groan_Pain.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Mammoth/Mammoth_Monster_Death_2_Elephant_Vocalization_Roar_Moan_Groan_Pain.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Mammoth/Mammoth_Monster_Death_3_Elephant_Vocalization_Roar_Moan_Groan_Pain.wav"
  ],
  creatures: [],
  keywords: [
    "mammoth",
    "elephant"
  ],
  traits: [],
  size: -1
};
const Roc = {
  display_name: "Roc",
  notes: "",
  hurt_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Roc/Roc_Monster_Pain_1_Dinosaur_Bird_Squeal_Die_Death_Hit.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Roc/Roc_Monster_Pain_2_Dinosaur_Bird_Squeal_Die_Death_Hit.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Roc/Roc_Monster_Pain_3_Dinosaur_Bird_Squeal_Die_Death_Hit.wav"
  ],
  attack_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Roc/Roc_Monster_Attack_1_Dinosaur_Bird_Squeal_Chirp_Yelp.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Roc/Roc_Monster_Attack_2_Dinosaur_Bird_Squeal_Chirp_Yelp.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Roc/Roc_Monster_Attack_3_Dinosaur_Bird_Squeal_Chirp_Yelp.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Roc/Roc_Monster_Attack_4_Dinosaur_Bird_Squeal_Chirp_Yelp.wav"
  ],
  death_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Roc/Roc_Monster_Death_1_Dinosaur_Bird_Squeal_Chirp_Moan_Groan.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Roc/Roc_Monster_Death_2_Dinosaur_Bird_Squeal_Chirp_Moan_Groan.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Roc/Roc_Monster_Death_3_Dinosaur_Bird_Squeal_Chirp_Moan_Groan.wav"
  ],
  creatures: [],
  keywords: [
    "roc",
    "phoenix",
    "bird",
    "thunderbird",
    "eagle",
    "falcon",
    "hawk",
    "hippogriff",
    "griffon",
    "raven",
    "vulture",
    "cauthooj",
    "cockatrice",
    "coatl",
    "pteranodon",
    "quetzalcoatlus"
  ],
  traits: [],
  size: -1
};
const Sphinx = {
  display_name: "Sphinx",
  notes: "",
  hurt_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Sphinx/Sphinx_Monster_Pain_1_Saber_Tooth_Lion_Tiger_Growl_Grunt_Death.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Sphinx/Sphinx_Monster_Pain_2_Saber_Tooth_Lion_Tiger_Growl_Grunt_Death.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Sphinx/Sphinx_Monster_Pain_3_Saber_Tooth_Lion_Tiger_Growl_Grunt_Death.wav"
  ],
  attack_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Sphinx/Sphinx_Monster_Attack_1_Saber_Tooth_Lion_Tiger_Roar_Growl.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Sphinx/Sphinx_Monster_Attack_2_Saber_Tooth_Lion_Tiger_Roar_Growl.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Sphinx/Sphinx_Monster_Attack_3_Saber_Tooth_Lion_Tiger_Roar_Growl.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Sphinx/Sphinx_Monster_Attack_4_Saber_Tooth_Lion_Tiger_Roar_Growl.wav"
  ],
  death_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Sphinx/Sphinx_Monster_Death_1_Saber_Tooth_Lion_Tiger_Groan_Pain_Moan_Hurt.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Sphinx/Sphinx_Monster_Death_2_Saber_Tooth_Lion_Tiger_Groan_Pain_Moan_Hurt.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Sphinx/Sphinx_Monster_Death_3_Saber_Tooth_Lion_Tiger_Groan_Pain_Moan_Hurt.wav"
  ],
  creatures: [],
  keywords: [
    "sphinx",
    "smilodon"
  ],
  traits: [],
  size: -1
};
const Spider_Queen = {
  display_name: "Insect (Medium)",
  notes: "",
  hurt_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Spider_Queen/Spider_Queen_Monster_Pain_1_Insect_Bug_Screech_Chirp_Death_Hit_Squish.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Spider_Queen/Spider_Queen_Monster_Pain_2_Insect_Bug_Screech_Chirp_Death_Hit_Squish.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Spider_Queen/Spider_Queen_Monster_Pain_3_Insect_Bug_Screech_Chirp_Death_Hit_Squish.wav"
  ],
  attack_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Spider_Queen/Spider_Queen_Monster_Attack_1_Insect_Bug_Screech_Squeal_Angry_Combat.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Spider_Queen/Spider_Queen_Monster_Attack_2_Insect_Bug_Screech_Squeal_Angry_Combat.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Spider_Queen/Spider_Queen_Monster_Attack_3_Insect_Bug_Screech_Squeal_Angry_Combat.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Spider_Queen/Spider_Queen_Monster_Attack_4_Insect_Bug_Screech_Squeal_Angry_Combat.wav"
  ],
  death_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Spider_Queen/Spider_Queen_Monster_Death_1_Insect_Bug_Screech_Squeal_Pain_Hurt_Moan_Groan.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Spider_Queen/Spider_Queen_Monster_Death_2_Insect_Bug_Screech_Squeal_Pain_Hurt_Moan_Groan.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Spider_Queen/Spider_Queen_Monster_Death_3_Insect_Bug_Screech_Squeal_Pain_Hurt_Moan_Groan.wav"
  ],
  creatures: [],
  keywords: [
    "ankhrav",
    "ant",
    "beetle",
    "centipede",
    "cockroach",
    "dragonfly",
    "fly",
    "mantis",
    "mosquito",
    "scorpion",
    "seugathi",
    "spider",
    "sportlebore",
    "tarantula",
    "tick",
    "wasp",
    "wihsaak"
  ],
  traits: [],
  size: 2
};
const Treant = {
  display_name: "Arboreal",
  notes: "",
  hurt_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Treant/Treant_Monster_Pain_1_Tree_Creature_Croak_Groan_Moan_Squeal.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Treant/Treant_Monster_Pain_2_Tree_Creature_Croak_Groan_Moan_Squeal.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Treant/Treant_Monster_Pain_3_Tree_Creature_Croak_Groan_Moan_Squeal.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Treant/Treant_Monster_Pain_4_Tree_Creature_Croak_Groan_Moan_Squeal.wav"
  ],
  attack_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Treant/Treant_Monster_Attack_1_Tree_Creature_Swing_Growl_Roar.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Treant/Treant_Monster_Attack_2_Tree_Creature_Swing_Growl_Roar.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Treant/Treant_Monster_Attack_3_Tree_Creature_Swing_Growl_Roar.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Treant/Treant_Monster_Attack_4_Stomp_Tree_Creature_Impact_Hit.wav"
  ],
  death_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Treant/Treant_Monster_Death_1_Tree_Creature_Groan_Pain_Hurt_Moan_Die.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Treant/Treant_Monster_Death_2_Tree_Creature_Groan_Pain_Hurt_Moan_Die.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures/Treant/Treant_Monster_Death_3_Tree_Creature_Groan_Pain_Hurt_Moan_Die.wav"
  ],
  creatures: [],
  keywords: [
    "arboreal"
  ],
  traits: [],
  size: 4
};
const Gnoll = {
  display_name: "Kholo",
  notes: "",
  hurt_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Gnoll/Gnoll_Monster_Pain_1_Wolf_Hyena_Dog_Creature_.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Gnoll/Gnoll_Monster_Pain_2_Wolf_Hyena_Dog_Creature_.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Gnoll/Gnoll_Monster_Pain_3_Wolf_Hyena_Dog_Creature_.wav"
  ],
  attack_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Gnoll/Gnoll_Monster_Attack_1_Wolf_Hyena_Dog_Creature_.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Gnoll/Gnoll_Monster_Attack_2_Wolf_Hyena_Dog_Creature_.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Gnoll/Gnoll_Monster_Attack_3_Wolf_Hyena_Dog_Creature_.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Gnoll/Gnoll_Monster_Attack_4_Wolf_Hyena_Dog_Creature_.wav"
  ],
  death_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Gnoll/Gnoll_Monster_Death_1_Wolf_Hyena_Dog_Creature_.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Gnoll/Gnoll_Monster_Death_2_Wolf_Hyena_Dog_Creature_.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Gnoll/Gnoll_Monster_Death_3_Wolf_Hyena_Dog_Creature_.wav"
  ],
  creatures: [],
  keywords: [
    "hyena",
    "hyaenodon"
  ],
  traits: [
    "gnoll",
    "kholo"
  ],
  size: -1
};
const Harpy = {
  display_name: "Harpy",
  notes: "",
  hurt_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Harpy/Harpy_Monster_Pain_1_Bird_Dinosaur_Witch_Creature.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Harpy/Harpy_Monster_Pain_2_Bird_Dinosaur_Witch_Creature.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Harpy/Harpy_Monster_Pain_3_Bird_Dinosaur_Witch_Creature.wav"
  ],
  attack_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Harpy/Harpy_Monster_Attack_1_Bird_Dinosaur_Witch_Creature.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Harpy/Harpy_Monster_Attack_2_Bird_Dinosaur_Witch_Creature.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Harpy/Harpy_Monster_Attack_3_Bird_Dinosaur_Witch_Creature.wav"
  ],
  death_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Harpy/Harpy_Monster_Death_1_Bird_Dinosaur_Witch_Creature.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Harpy/Harpy_Monster_Death_2_Bird_Dinosaur_Witch_Creature.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Harpy/Harpy_Monster_Death_3_Bird_Dinosaur_Witch_Creature.wav"
  ],
  creatures: [],
  keywords: [
    "harpy"
  ],
  traits: [],
  size: -1
};
const Hellhound = {
  display_name: "Hellhound",
  notes: "",
  hurt_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Hell_Hound/Hellhound_Monster_Pain_1_Dog_Wolf_Creature.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Hell_Hound/Hellhound_Monster_Pain_2_Dog_Wolf_Creature.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Hell_Hound/Hellhound_Monster_Pain_3_Dog_Wolf_Creature.wav"
  ],
  attack_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Hell_Hound/Hellhound_Monster_Attack_1_Dog_Wolf_Creature.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Hell_Hound/Hellhound_Monster_Attack_2_Dog_Wolf_Creature.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Hell_Hound/Hellhound_Monster_Attack_3_Dog_Wolf_Creature.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Hell_Hound/Hellhound_Monster_Attack_4_Dog_Wolf_Creature.wav"
  ],
  death_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Hell_Hound/Hellhound_Monster_Death_1_Dog_Wolf_Creature.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Hell_Hound/Hellhound_Monster_Death_2_Dog_Wolf_Creature.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Hell_Hound/Hellhound_Monster_Death_3_Dog_Wolf_Creature.wav"
  ],
  creatures: [],
  keywords: [
    "hound",
    "dog",
    "wolf",
    "warhound",
    "barghest",
    "warg",
    "witchwarg"
  ],
  traits: [],
  size: -1
};
const Kelpie = {
  display_name: "Kelpie",
  notes: "",
  hurt_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Kelpie/Kelpie_Monster_Pain_1_Water_Spirit_Horse_Creature.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Kelpie/Kelpie_Monster_Pain_2_Water_Spirit_Horse_Creature.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Kelpie/Kelpie_Monster_Pain_3_Water_Spirit_Horse_Creature.wav"
  ],
  attack_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Kelpie/Kelpie_Monster_Attack_1_Water_Spirit_Horse_Creature.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Kelpie/Kelpie_Monster_Attack_2_Water_Spirit_Horse_Creature.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Kelpie/Kelpie_Monster_Attack_3_Water_Spirit_Horse_Creature.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Kelpie/Kelpie_Monster_Attack_4_Water_Spirit_Horse_Creature.wav"
  ],
  death_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Kelpie/Kelpie_Monster_Death_1_Water_Spirit_Horse_Creature.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Kelpie/Kelpie_Monster_Death_2_Water_Spirit_Horse_Creature.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Kelpie/Kelpie_Monster_Death_3_Water_Spirit_Horse_Creature.wav"
  ],
  creatures: [],
  keywords: [
    "kelpie",
    "nightmare",
    "horse",
    "hippocampus",
    "pegasus",
    "unicorn",
    "alicorn",
    "karkadann"
  ],
  traits: [],
  size: -1
};
const Mimic = {
  display_name: "Mimic",
  notes: "",
  hurt_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Mimic/Mimic_Monster_Pain_1_Robotic_Humanoid_Creature_Mechanical.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Mimic/Mimic_Monster_Pain_2_Robotic_Humanoid_Creature_Mechanical.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Mimic/Mimic_Monster_Pain_3_Robotic_Humanoid_Creature_Mechanical.wav"
  ],
  attack_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Mimic/Mimic_Monster_Attack_1_Robotic_Humanoid_Creature_Mechanical.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Mimic/Mimic_Monster_Attack_2_Robotic_Humanoid_Creature_Mechanical.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Mimic/Mimic_Monster_Attack_3_Robotic_Humanoid_Creature_Mechanical.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Mimic/Mimic_Monster_Attack_4_Robotic_Humanoid_Creature_Mechanical.wav"
  ],
  death_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Mimic/Mimic_Monster_Death_1_Robotic_Humanoid_Creature_Mechanical.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Mimic/Mimic_Monster_Death_2_Robotic_Humanoid_Creature_Mechanical.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Mimic/Mimic_Monster_Death_3_Robotic_Humanoid_Creature_Mechanical.wav"
  ],
  creatures: [],
  keywords: [
    "mimic"
  ],
  traits: [],
  size: -1
};
const EGC_Orc = {
  display_name: "Giant",
  notes: "",
  hurt_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Orc/Orc_Monster_Pain_1_Humanoid_Troll_Tribal_Creature.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Orc/Orc_Monster_Pain_2_Humanoid_Troll_Tribal_Creature.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Orc/Orc_Monster_Pain_3_Humanoid_Troll_Tribal_Creature.wav"
  ],
  attack_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Orc/Orc_Monster_Attack_1_Humanoid_Troll_Tribal_Creature.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Orc/Orc_Monster_Attack_2_Humanoid_Troll_Tribal_Creature.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Orc/Orc_Monster_Attack_3_Humanoid_Troll_Tribal_Creature.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Orc/Orc_Monster_Attack_4_Humanoid_Troll_Tribal_Creature.wav"
  ],
  death_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Orc/Orc_Monster_Death_1_Humanoid_Troll_Tribal_Creature.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Orc/Orc_Monster_Death_2_Humanoid_Troll_Tribal_Creature.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Orc/Orc_Monster_Death_3_Humanoid_Troll_Tribal_Creature.wav"
  ],
  creatures: [],
  keywords: [],
  traits: [
    "giant"
  ],
  size: -1
};
const Owlbear = {
  display_name: "Owlbear",
  notes: "",
  hurt_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Owlbear/Owlbear_Monster_Pain_1_Bird_Mammal_Creature.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Owlbear/Owlbear_Monster_Pain_2_Bird_Mammal_Creature.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Owlbear/Owlbear_Monster_Pain_3_Bird_Mammal_Creature.wav"
  ],
  attack_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Owlbear/Owlbear_Monster_Attack_1_Bird_Mammal_Creature.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Owlbear/Owlbear_Monster_Attack_2_Bird_Mammal_Creature.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Owlbear/Owlbear_Monster_Attack_3_Bird_Mammal_Creature.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Owlbear/Owlbear_Monster_Attack_4_Bird_Mammal_Creature.wav"
  ],
  death_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Owlbear/Owlbear_Monster_Death_1_Bird_Mammal_Creature.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Owlbear/Owlbear_Monster_Death_2_Bird_Mammal_Creature.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Owlbear/Owlbear_Monster_Death_3_Bird_Mammal_Creature.wav"
  ],
  creatures: [],
  keywords: [
    "owlbear"
  ],
  traits: [],
  size: -1
};
const Rock_Golem = {
  display_name: "Rock Golem",
  notes: "",
  hurt_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Rock_Golem/Rock_Golem_Monster_Pain_1_Supernatural_Mythical_Creature.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Rock_Golem/Rock_Golem_Monster_Pain_2_Supernatural_Mythical_Creature.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Rock_Golem/Rock_Golem_Monster_Pain_3_Supernatural_Mythical_Creature.wav"
  ],
  attack_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Rock_Golem/Rock_Golem_Monster_Attack_1_Supernatural_Mythical_Creature.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Rock_Golem/Rock_Golem_Monster_Attack_2_Supernatural_Mythical_Creature.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Rock_Golem/Rock_Golem_Monster_Attack_3_Supernatural_Mythical_Creature.wav"
  ],
  death_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Rock_Golem/Rock_Golem_Monster_Death_1_Supernatural_Mythical_Creature.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Rock_Golem/Rock_Golem_Monster_Death_2_Supernatural_Mythical_Creature.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Rock_Golem/Rock_Golem_Monster_Death_3_Supernatural_Mythical_Creature.wav"
  ],
  creatures: [],
  keywords: [],
  traits: [
    "construct",
    "earth"
  ],
  size: 3
};
const Wight = {
  display_name: "Wight",
  notes: "",
  hurt_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Wight/Wight_Monster_Pain_1_Spirit_Fairy_Ghost_Creature.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Wight/Wight_Monster_Pain_2_Spirit_Fairy_Ghost_Creature.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Wight/Wight_Monster_Pain_3_Spirit_Fairy_Ghost_Creature.wav"
  ],
  attack_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Wight/Wight_Monster_Attack_1_Spirit_Fairy_Ghost_Creature.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Wight/Wight_Monster_Attack_2_Spirit_Fairy_Ghost_Creature.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Wight/Wight_Monster_Attack_3_Spirit_Fairy_Ghost_Creature.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Wight/Wight_Monster_Attack_4_Spirit_Fairy_Ghost_Creature.wav"
  ],
  death_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Wight/Wight_Monster_Death_1_Spirit_Fairy_Ghost_Creature.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Wight/Wight_Monster_Death_2_Spirit_Fairy_Ghost_Creature.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Wight/Wight_Monster_Death_3_Spirit_Fairy_Ghost_Creature.wav"
  ],
  creatures: [],
  keywords: [],
  traits: [
    "wight",
    "undead"
  ],
  size: -1
};
const Wraith = {
  display_name: "Wraith",
  notes: "",
  hurt_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Wraith/Wraith_Monster_Pain_1_Spirit_Fairy_Ghost_Creature.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Wraith/Wraith_Monster_Pain_2_Spirit_Fairy_Ghost_Creature.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Wraith/Wraith_Monster_Pain_3_Spirit_Fairy_Ghost_Creature.wav"
  ],
  attack_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Wraith/Wraith_Monster_Attack_1_Spirit_Fairy_Ghost_Creature.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Wraith/Wraith_Monster_Attack_2_Spirit_Fairy_Ghost_Creature.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Wraith/Wraith_Monster_Attack_3_Spirit_Fairy_Ghost_Creature.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Wraith/Wraith_Monster_Attack_4_Spirit_Fairy_Ghost_Creature.wav"
  ],
  death_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Wraith/Wraith_Monster_Death_1_Spirit_Fairy_Ghost_Creature.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Wraith/Wraith_Monster_Death_2_Spirit_Fairy_Ghost_Creature.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Evolved_Game_Creatures_2/Wraith/Wraith_Monster_Death_3_Spirit_Fairy_Ghost_Creature.wav"
  ],
  creatures: [],
  keywords: [],
  traits: [
    "incorporeal",
    "wraith",
    "ghost",
    "undead"
  ],
  size: -1
};
const Brute = {
  display_name: "Minotaur",
  notes: "",
  hurt_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Brute/CREAHmn_Brute Pain Painful Angry Grunt Ahh Hurt 01_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Brute/CREAHmn_Brute Pain Roaing Painful Grunt Angry Rawr 02_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Brute/CREAHmn_Brute Pain Short Painful Grunt Damaged Hurt 03_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Brute/CREAHmn_Brute Pain Short Painful Grunt Oof Roar 04_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Brute/CREAHmn_Brute Pain Short Roaring Grunt Ooh Damaged 05_ESM_HC2.wav"
  ],
  attack_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Brute/CREAHmn_Brute Attack Big Heavy Attack Massive Effort 01_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Brute/CREAHmn_Brute Attack Big Uppercut Swing Damage Roar 02_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Brute/CREAHmn_Brute Attack Heavy Swing Big Effort Grunt 03_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Brute/CREAHmn_Brute Attack Missed Attack Grunting Roar Effort 04_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Brute/CREAHmn_Brute Attack Quick Attack Deal Damage Roar 05_ESM_HC2.wav"
  ],
  death_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Brute/CREAHmn_Brute Death Long Roaring Fading Out Slowly 01_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Brute/CREAHmn_Brute Death Long Roaring Mono Tone Death 02_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Brute/CREAHmn_Brute Death Short Dying Loud Angry Roar 03_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Brute/CREAHmn_Brute Death Short Quick Dying Roar Loud 04_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Brute/CREAHmn_Brute Death Short Roaring Dying Painful Groan 05_ESM_HC2.wav"
  ],
  creatures: [],
  keywords: [
    "minotaur",
    "yeti"
  ],
  traits: [
    "minotaur"
  ],
  size: -1
};
const Ghoul = {
  display_name: "Ghoul",
  notes: "",
  hurt_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Ghoul/CREAHmn_Ghoul Pain Ahh Short Gurgle Gargling Damaged 01_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Ghoul/CREAHmn_Ghoul Pain Ahh Short Painful Throaty Gargle 02_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Ghoul/CREAHmn_Ghoul Pain Short And Throaty Hiss Gurgle Oof 03_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Ghoul/CREAHmn_Ghoul Pain Short Intense Hissing Painful Damaged 04_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Ghoul/CREAHmn_Ghoul Pain Short Painful Damaged Hiss Harsh 05_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Ghoul/CREAHmn_Ghoul Pain Short Painful Hissing Throaty Scream 06_ESM_HC2.wav"
  ],
  attack_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Ghoul/CREAHmn_Ghoul Attack Furious Frenzy Attack Ferocious Hissing 01_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Ghoul/CREAHmn_Ghoul Attack Jibbering Fury Attack Ferocious Flurry 02_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Ghoul/CREAHmn_Ghoul Attack Short Attack Hissing Quick Furious 03_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Ghoul/CREAHmn_Ghoul Attack Short Ferocious Attacking Slash Brutal 04_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Ghoul/CREAHmn_Ghoul Attack Short Quick Attack Furious Slashing 05_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Ghoul/CREAHmn_Ghoul Attack Short Slashing Attack Angry Shout 06_ESM_HC2.wav"
  ],
  death_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Ghoul/CREAHmn_Ghoul Death High Pitched Death Trailing Off 01_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Ghoul/CREAHmn_Ghoul Death Long Drawn Out Wet Gurgling 02_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Ghoul/CREAHmn_Ghoul Death Short Crackling Throaty Gritty Painful 03_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Ghoul/CREAHmn_Ghoul Death Short Quick Harsh Crackling Fall 04_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Ghoul/CREAHmn_Ghoul Death Slow Gurgling Dying Painful Wet 05_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Ghoul/CREAHmn_Ghoul Death Wet Gurgling Bloody Painful Drowning 06_ESM_HC2.wav"
  ],
  creatures: [],
  keywords: [
    "boggard"
  ],
  traits: [
    "ghoul",
    "undead",
    "morlock",
    "grippli"
  ],
  size: -1
};
const Hellspawn = {
  display_name: "Imp",
  notes: "",
  hurt_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Hellspawn/CREAHmn_Hellspawn Pain Painful Hissing Grunt Falling Off 01_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Hellspawn/CREAHmn_Hellspawn Pain Short Crunch Chomp Bite Damaged 02_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Hellspawn/CREAHmn_Hellspawn Pain Short Growling Crackling Throaty Damaged 03_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Hellspawn/CREAHmn_Hellspawn Pain Short Throaty Hissing Gurgling Damaged 04_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Hellspawn/CREAHmn_Hellspawn Pain Throaty Bright Hissing Quick Short 05_ESM_HC2.wav"
  ],
  attack_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Hellspawn/CREAHmn_Hellspawn Attack Demonic Cursing Flying Jibbering Hiss 01_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Hellspawn/CREAHmn_Hellspawn Attack Demonic Talking Fast Chittering Hissing 02_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Hellspawn/CREAHmn_Hellspawn Attack Heavy Attack Short Fast Throaty 03_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Hellspawn/CREAHmn_Hellspawn Attack Hissing Throaty Chittering Jibber Slash 04_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Hellspawn/CREAHmn_Hellspawn Attack Short Big Swinging Furious Flurry 05_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Hellspawn/CREAHmn_Hellspawn Attack Short Furious Demonic Chittering Fast 06_ESM_HC2.wav"
  ],
  death_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Hellspawn/CREAHmn_Hellspawn Death Harsh Angry Defiant Screaming Throaty 01_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Hellspawn/CREAHmn_Hellspawn Death Hissing Throaty Harsh Cackling Crunchy 02_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Hellspawn/CREAHmn_Hellspawn Death Long Screaming Hissing Crackle Falling 03_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Hellspawn/CREAHmn_Hellspawn Death Long Screaming Throaty Hissing Falling 04_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Hellspawn/CREAHmn_Hellspawn Death Squealing Hissing Crackly Harsh Bright 05_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Hellspawn/CREAHmn_Hellspawn Death Throaty High Pitched Screaming Falling 06_ESM_HC2.wav"
  ],
  creatures: [],
  keywords: [],
  traits: [
    "fiend"
  ],
  size: 0
};
const Mutant = {
  display_name: "Vrock",
  notes: "",
  hurt_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Mutant/CREAHmn_Mutant Pain Damaged Screech Defiant Fearful Throaty 01_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Mutant/CREAHmn_Mutant Pain Long Animalistic Screech Harsh Bright 02_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Mutant/CREAHmn_Mutant Pain Long Bird Like Screech Damaged 03_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Mutant/CREAHmn_Mutant Pain Long Drawn Out Screeching Bright 04_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Mutant/CREAHmn_Mutant Pain Short Screeching Harsh Bright Scream 05_ESM_HC2.wav"
  ],
  attack_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Mutant/CREAHmn_Mutant Attack Animalistic Screaming Gurgle Wet Organic 01_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Mutant/CREAHmn_Mutant Attack Furious Screaming Throaty Animalistic Fast 02_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Mutant/CREAHmn_Mutant Attack Organic Squishy Gurgling Throaty Wet 03_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Mutant/CREAHmn_Mutant Attack Screaming Wet Gurgling Fast Angry 04_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Mutant/CREAHmn_Mutant Attack Short Quick Biological Furious Wet 05_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Mutant/CREAHmn_Mutant Attack Short Quick Throaty Screaming Fast 06_ESM_HC2.wav"
  ],
  death_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Mutant/CREAHmn_Mutant Death High Pitched Screaming Bird Like 01_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Mutant/CREAHmn_Mutant Death Long Drawn Out Screaming Fading 02_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Mutant/CREAHmn_Mutant Death Long Low Pitched Screaming Fading 03_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Mutant/CREAHmn_Mutant Death Long Screaming Bird Like Harsh 04_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Mutant/CREAHmn_Mutant Death Screaming Bird Like Fading Throaty 05_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Mutant/CREAHmn_Mutant Death Screaming Throaty Crunchy Harsh Hissing 06_ESM_HC2.wav"
  ],
  creatures: [],
  keywords: [
    "nuckelavee",
    "vrock"
  ],
  traits: [],
  size: -1
};
const Sludgeman = {
  display_name: "Sludgeman",
  notes: "",
  hurt_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Sludgeman/CREAHmn_Sludgeman Pain Deep Gutteral Disgusting Throaty Wet 01_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Sludgeman/CREAHmn_Sludgeman Pain Roaring Gurgling Throaty Bubbling Gross 02_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Sludgeman/CREAHmn_Sludgeman Pain Roaring Snarling Quick Short Wet 03_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Sludgeman/CREAHmn_Sludgeman Pain Short Quick Damaged Wet Harsh 04_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Sludgeman/CREAHmn_Sludgeman Pain Short Quick Roaring Snarling Bubbling 05_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Sludgeman/CREAHmn_Sludgeman Pain Short Quick Roaring Wet Throaty 06_ESM_HC2.wav"
  ],
  attack_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Sludgeman/CREAHmn_Sludgeman Attack Angry Gross Gargling Throaty Snorting 01_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Sludgeman/CREAHmn_Sludgeman Attack Angry Roaring Furious Bubbling Throaty 02_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Sludgeman/CREAHmn_Sludgeman Attack Deep Bubbling Muddy Gargle Gritty 03_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Sludgeman/CREAHmn_Sludgeman Attack Furious Gargling Disgusting Spewing Bubbling 04_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Sludgeman/CREAHmn_Sludgeman Attack Quick Short Bubbly Deep Gargle 05_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Sludgeman/CREAHmn_Sludgeman Attack Short Quick Sludgy Gross Gargle 06_ESM_HC2.wav"
  ],
  death_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Sludgeman/CREAHmn_Sludgeman Death Long Drawn Out Snarl Roar 01_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Sludgeman/CREAHmn_Sludgeman Death Long Gargling Burbling Gooey Wet 02_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Sludgeman/CREAHmn_Sludgeman Death Roaring Snarling Long Bubbling Angry 03_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Sludgeman/CREAHmn_Sludgeman Death Snoring Snarling Wet Throaty Short 04_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Sludgeman/CREAHmn_Sludgeman Death Throaty Stuttering Long Trailing Off 05_ESM_HC2.wav"
  ],
  creatures: [],
  keywords: [
    "charnel creation",
    "quai dau to",
    "terotricus",
    "warsworn",
    "ort",
    "omox"
  ],
  traits: [
    "ooze"
  ],
  size: -1
};
const Strigoi = {
  display_name: "Xulgath",
  notes: "",
  hurt_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Strigoi/CREAHmn_Strigoi Pain Ew Bleck Short Quick Gross 01_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Strigoi/CREAHmn_Strigoi Pain Hurling Gross Throaty Short Quick 02_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Strigoi/CREAHmn_Strigoi Pain Short Quick Coughing Throaty Hiss 03_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Strigoi/CREAHmn_Strigoi Pain Short Quick Damaged Throaty Gurgling 04_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Strigoi/CREAHmn_Strigoi Pain Short Quick Guttural Painful Hissing 05_ESM_HC2.wav"
  ],
  attack_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Strigoi/CREAHmn_Strigoi Attack Short Quick Chomping Biting Snarling 01_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Strigoi/CREAHmn_Strigoi Attack Short Quick Furious Slashing Clawed 02_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Strigoi/CREAHmn_Strigoi Attack Short Quick Snarling Angry Bestial 03_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Strigoi/CREAHmn_Strigoi Attack Short Quick Snarling Throaty Biting 04_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Strigoi/CREAHmn_Strigoi Attack Snarling Jibbering Slobbery Biting Swing 05_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Strigoi/CREAHmn_Strigoi Attack Throaty Hissing Angry Terrifying Agressive 06_ESM_HC2.wav"
  ],
  death_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Strigoi/CREAHmn_Strigoi Death Gargling Hissing Burning Dark Throaty 01_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Strigoi/CREAHmn_Strigoi Death Gutteral Throaty Harsh Dark Fading 02_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Strigoi/CREAHmn_Strigoi Death Long Drawn Out Throaty Fading 03_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Strigoi/CREAHmn_Strigoi Death Long Drawn Out Throaty Hissing 04_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Strigoi/CREAHmn_Strigoi Death Multiple Gargling Hissing Pitiful Dying 05_ESM_HC2.wav"
  ],
  creatures: [],
  keywords: [],
  traits: [
    "aberration",
    "xulgath",
    "qlippoth"
  ],
  size: 2
};
const Voidling = {
  display_name: "Venedaemon",
  notes: "",
  hurt_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Voidling/CREAHmn_Voidling Pain Harsh Breathy Light Ghost Like 01_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Voidling/CREAHmn_Voidling Pain Short Breathy Eerie Quiet Light 02_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Voidling/CREAHmn_Voidling Pain Short Quick Whispery Light Eerie 03_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Voidling/CREAHmn_Voidling Pain Throaty Breathy Whisper Light Gentle 04_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Voidling/CREAHmn_Voidling Pain Whaa Breathy Short Light Weird 05_ESM_HC2.wav"
  ],
  attack_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Voidling/CREAHmn_Voidling Attack Alien Ethereal Dissonant Quiet Gentle 01_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Voidling/CREAHmn_Voidling Attack High Freq Crackly Ghostly Light 02_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Voidling/CREAHmn_Voidling Attack Short Quick Breathy Other Worldly 03_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Voidling/CREAHmn_Voidling Attack Short Quick Effected Light Ethereal 04_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Voidling/CREAHmn_Voidling Attack Short Quick Ghostly Light Phantasmal 05_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Voidling/CREAHmn_Voidling Attack Throaty Fading Void Like Whisper 06_ESM_HC2.wav"
  ],
  death_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Voidling/CREAHmn_Voidling Death Fading Wrath Like Spiritual Eerie 01_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Voidling/CREAHmn_Voidling Death Long Drawn Out Breathy Fading 02_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Voidling/CREAHmn_Voidling Death Long Drawn Out Deathly Breathy 03_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Voidling/CREAHmn_Voidling Death Long Drawn Out Haunting Weird 04_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Voidling/CREAHmn_Voidling Death Short Quick Creepy Weird Ethereal 05_ESM_HC2.wav"
  ],
  creatures: [],
  keywords: [
    "wisp",
    "shining child",
    "venedaemon"
  ],
  traits: [],
  size: 1
};
const Zombie = {
  display_name: "Zombie",
  notes: "",
  hurt_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Zombie/CREAHmn_Zombie Pain Airy Throaty Breathy Short Quick 01_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Zombie/CREAHmn_Zombie Pain Chomping Short Quick Harsh Breathy 02_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Zombie/CREAHmn_Zombie Pain Damaged Throaty Guttural Wet Gargling 03_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Zombie/CREAHmn_Zombie Pain Ferocious Throaty Dry Undead Short 04_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Zombie/CREAHmn_Zombie Pain Short Quick Breathy Brutal Harsh 05_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Zombie/CREAHmn_Zombie Pain Short Quick Breathy Throaty Dry 06_ESM_HC2.wav"
  ],
  attack_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Zombie/CREAHmn_Zombie Attack Angry High Pitched Snarling Gargling 01_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Zombie/CREAHmn_Zombie Attack Angry Roaring Throaty Snarling Brutal 02_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Zombie/CREAHmn_Zombie Attack Gargling Throaty Snarling Angry Brutal 03_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Zombie/CREAHmn_Zombie Attack Quick Intense Short Fury Angry 04_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Zombie/CREAHmn_Zombie Attack Short Quick Throaty Snarling Ferocious 05_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Zombie/CREAHmn_Zombie Attack Snarling Roaring Throaty Angry Fury 06_ESM_HC2.wav"
  ],
  death_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Zombie/CREAHmn_Zombie Death Breathy Fading Snarling Throaty Pathetic 01_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Zombie/CREAHmn_Zombie Death Breathy Throaty Pathetic Pitiful Light 02_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Zombie/CREAHmn_Zombie Death Harsh Painful Short Quick Brutal 03_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Zombie/CREAHmn_Zombie Death Long Drawn Out Breathy Throaty 04_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Zombie/CREAHmn_Zombie Death Quick Short Snarling Snorty Breathy 05_ESM_HC2.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Male_Zombie/CREAHmn_Zombie Death Throaty Snarling Airy Breathy Short 06_ESM_HC2.wav"
  ],
  creatures: [],
  keywords: [
    "chupacabra"
  ],
  traits: [
    "zombie",
    "undead"
  ],
  size: -1
};
const Human_Female_A = {
  display_name: "Humanoid Feminine A",
  notes: "",
  hurt_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female A/voice_female_a_hurt_pain_01.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female A/voice_female_a_hurt_pain_02.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female A/voice_female_a_hurt_pain_03.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female A/voice_female_a_hurt_pain_04.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female A/voice_female_a_hurt_pain_05.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female A/voice_female_a_hurt_pain_06.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female A/voice_female_a_hurt_pain_07.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female A/voice_female_a_hurt_pain_08.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female A/voice_female_a_hurt_pain_09.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female A/voice_female_a_hurt_pain_10.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female A/voice_female_a_hurt_pain_11.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female A/voice_female_a_hurt_pain_12.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female A/voice_female_a_hurt_pain_13.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female A/voice_female_a_hurt_pain_14.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female A/voice_female_a_hurt_pain_15.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female A/voice_female_a_hurt_pain_16.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female A/voice_female_a_hurt_pain_17.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female A/voice_female_a_hurt_pain_18.wav"
  ],
  attack_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female A/voice_female_a_attack_01.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female A/voice_female_a_attack_02.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female A/voice_female_a_attack_03.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female A/voice_female_a_attack_04.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female A/voice_female_a_attack_05.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female A/voice_female_a_attack_06.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female A/voice_female_a_attack_07.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female A/voice_female_a_attack_08.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female A/voice_female_a_attack_09.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female A/voice_female_a_attack_10.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female A/voice_female_a_attack_11.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female A/voice_female_a_attack_12.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female A/voice_female_a_attack_13.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female A/voice_female_a_attack_14.wav"
  ],
  death_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female A/voice_female_a_death_01.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female A/voice_female_a_death_02.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female A/voice_female_a_death_03.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female A/voice_female_a_death_04.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female A/voice_female_a_death_05.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female A/voice_female_a_death_06.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female A/voice_female_a_death_07.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female A/voice_female_a_death_08.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female A/voice_female_a_death_09.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female A/voice_female_a_death_10.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female A/voice_female_a_death_11.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female A/voice_female_a_death_12.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female A/voice_female_a_death_13.wav"
  ],
  creatures: [],
  keywords: [],
  traits: [
    "female",
    "human",
    "halfling",
    "dwarf",
    "centaur"
  ],
  size: 2
};
const Human_Female_B1 = {
  display_name: "Humanoid Feminine B",
  notes: "",
  hurt_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female B/voice_female_b_hurt_pain_mild_01.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female B/voice_female_b_hurt_pain_mild_02.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female B/voice_female_b_hurt_pain_mild_05.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female B/voice_female_b_hurt_pain_mild_06.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female B/voice_female_b_hurt_pain_mild_07.wav"
  ],
  attack_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female B/voice_female_b_attack_set1_01.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female B/voice_female_b_attack_set1_02.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female B/voice_female_b_attack_set1_03.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female B/voice_female_b_attack_set1_04.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female B/voice_female_b_attack_set1_05.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female B/voice_female_b_attack_set1_06.wav"
  ],
  death_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female B/voice_female_b_death_10.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female B/voice_female_b_death_11.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female B/voice_female_b_death_13.wav"
  ],
  creatures: [],
  keywords: [],
  traits: [
    "female",
    "human",
    "halfling",
    "elf",
    "centaur"
  ],
  size: 2
};
const Human_Female_B2 = {
  display_name: "Humanoid Feminine C",
  notes: "",
  hurt_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female B/voice_female_b_hurt_pain_low_01.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female B/voice_female_b_hurt_pain_low_02.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female B/voice_female_b_hurt_pain_low_03.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female B/voice_female_b_hurt_pain_low_04.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female B/voice_female_b_hurt_pain_low_05.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female B/voice_female_b_hurt_pain_low_06.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female B/voice_female_b_hurt_pain_low_07.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female B/voice_female_b_hurt_pain_low_08.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female B/voice_female_b_hurt_pain_low_09.wav"
  ],
  attack_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female B/voice_female_b_attack_set2_01.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female B/voice_female_b_attack_set2_02.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female B/voice_female_b_attack_set2_03.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female B/voice_female_b_attack_set2_04.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female B/voice_female_b_attack_set2_05.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female B/voice_female_b_attack_set2_06.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female B/voice_female_b_attack_set2_07.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female B/voice_female_b_attack_set3_01.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female B/voice_female_b_attack_set3_02.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female B/voice_female_b_attack_set3_03.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female B/voice_female_b_attack_set3_04.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female B/voice_female_b_attack_set3_05.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female B/voice_female_b_attack_set3_06.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female B/voice_female_b_attack_set4_01.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female B/voice_female_b_attack_set4_02.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female B/voice_female_b_attack_set4_03.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female B/voice_female_b_attack_set4_04.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female B/voice_female_b_attack_set4_05.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female B/voice_female_b_attack_set4_06.wav"
  ],
  death_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female B/voice_female_b_death_01.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female B/voice_female_b_death_02.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female B/voice_female_b_death_03.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female B/voice_female_b_death_04.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female B/voice_female_b_death_05.wav"
  ],
  creatures: [],
  keywords: [],
  traits: [
    "female",
    "human",
    "halfling",
    "elf",
    "centaur"
  ],
  size: 2
};
const Human_Female_C = {
  display_name: "Humanoid Feminine D",
  notes: "",
  hurt_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female C/voice_female_c_hurt_pain_01.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female C/voice_female_c_hurt_pain_02.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female C/voice_female_c_hurt_pain_03.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female C/voice_female_c_hurt_pain_04.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female C/voice_female_c_hurt_pain_05.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female C/voice_female_c_hurt_pain_06.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female C/voice_female_c_hurt_pain_07.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female C/voice_female_c_hurt_pain_08.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female C/voice_female_c_hurt_pain_09.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female C/voice_female_c_hurt_pain_10.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female C/voice_female_c_hurt_pain_11.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female C/voice_female_c_hurt_pain_12.wav"
  ],
  attack_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female C/voice_female_c_attack_01.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female C/voice_female_c_attack_02.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female C/voice_female_c_attack_03.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female C/voice_female_c_attack_04.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female C/voice_female_c_attack_05.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female C/voice_female_c_attack_06.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female C/voice_female_c_attack_07.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female C/voice_female_c_attack_08.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female C/voice_female_c_attack_09.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female C/voice_female_c_attack_10.wav"
  ],
  death_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female C/voice_female_c_death_01.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female C/voice_female_c_death_02.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female C/voice_female_c_death_03.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female C/voice_female_c_death_04.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female C/voice_female_c_death_05.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female C/voice_female_c_death_06.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female C/voice_female_c_death_07.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female C/voice_female_c_death_08.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female C/voice_female_c_death_09.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Female C/voice_female_c_death_10.wav"
  ],
  creatures: [],
  keywords: [],
  traits: [
    "female",
    "human",
    "halfling",
    "elf",
    "gnome",
    "leshy"
  ],
  size: 2
};
const Human_Male_A = {
  display_name: "Humanoid Masculine A",
  notes: "",
  hurt_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male A/voice_male_grunt_pain_01.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male A/voice_male_grunt_pain_02.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male A/voice_male_grunt_pain_03.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male A/voice_male_grunt_pain_04.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male A/voice_male_grunt_pain_05.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male A/voice_male_grunt_pain_06.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male A/voice_male_grunt_pain_07.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male A/voice_male_grunt_pain_08.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male A/voice_male_grunt_pain_09.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male A/voice_male_grunt_pain_10.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male A/voice_male_grunt_pain_11.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male A/voice_male_grunt_pain_12.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male A/voice_male_grunt_pain_13.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male A/voice_male_grunt_pain_14.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male A/voice_male_grunt_pain_15.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male A/voice_male_grunt_pain_16.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male A/voice_male_grunt_pain_17.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male A/voice_male_grunt_pain_18.wav"
  ],
  attack_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male A/voice_male_effort_grunt_01.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male A/voice_male_effort_grunt_02.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male A/voice_male_effort_grunt_03.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male A/voice_male_effort_grunt_04.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male A/voice_male_effort_grunt_05.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male A/voice_male_effort_grunt_06.wav"
  ],
  death_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male A/voice_male_grunt_pain_death_01.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male A/voice_male_grunt_pain_death_02.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male A/voice_male_grunt_pain_death_03.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male A/voice_male_grunt_pain_death_04.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male A/voice_male_grunt_pain_death_05.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male A/voice_male_grunt_pain_death_06.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male A/voice_male_grunt_pain_death_07.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male A/voice_male_grunt_pain_death_08.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male A/voice_male_grunt_pain_death_09.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male A/voice_male_grunt_pain_death_10.wav"
  ],
  creatures: [],
  keywords: [],
  traits: [
    "male",
    "human",
    "halfling",
    "elf"
  ],
  size: 2
};
const Human_Male_B1 = {
  display_name: "Humanoid Masculine B",
  notes: "",
  hurt_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_hurt_pain_set_1_01.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_hurt_pain_set_1_02.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_hurt_pain_set_1_03.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_hurt_pain_set_1_04.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_hurt_pain_set_1_05.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_hurt_pain_set_1_06.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_hurt_pain_set_1_07.wav"
  ],
  attack_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_attack_set1_01.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_attack_set1_02.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_attack_set1_03.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_attack_set1_04.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_attack_set1_05.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_attack_set1_06.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_attack_set1_07.wav"
  ],
  death_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_death_low_01.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_death_low_02.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_death_low_03.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_death_low_04.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_death_low_05.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_death_low_07.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_death_low_10.wav"
  ],
  creatures: [],
  keywords: [],
  traits: [
    "male",
    "human",
    "halfling",
    "elf"
  ],
  size: 2
};
const Human_Male_B2 = {
  display_name: "Humanoid Masculine C",
  notes: "",
  hurt_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_hurt_pain_set_2_01.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_hurt_pain_set_2_02.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_hurt_pain_set_2_03.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_hurt_pain_set_2_04.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_hurt_pain_set_2_05.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_hurt_pain_set_2_06.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_hurt_pain_set_2_07.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_hurt_pain_set_2_08.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_hurt_pain_set_2_09.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_hurt_pain_set_2_10.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_hurt_pain_set_2_11.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_hurt_pain_set_2_12.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_hurt_pain_set_2_13.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_hurt_pain_set_2_14.wav"
  ],
  attack_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_attack_set2_01.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_attack_set2_02.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_attack_set2_03.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_attack_set2_04.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_attack_set2_05.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_attack_set2_06.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_attack_set2_07.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_attack_set2_08.wav"
  ],
  death_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_death_low_01.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_death_low_02.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_death_low_03.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_death_low_04.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_death_low_05.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_death_low_07.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_death_low_10.wav"
  ],
  creatures: [],
  keywords: [],
  traits: [
    "male",
    "human",
    "halfling",
    "elf",
    "gnome",
    "leshy"
  ],
  size: 2
};
const Human_Male_B3 = {
  display_name: "Humanoid Masculine D",
  notes: "",
  hurt_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_hurt_pain_set_3_01.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_hurt_pain_set_3_02.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_hurt_pain_set_3_03.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_hurt_pain_set_3_04.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_hurt_pain_set_3_05.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_hurt_pain_set_3_06.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_hurt_pain_set_3_07.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_hurt_pain_set_3_08.wav"
  ],
  attack_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_attack_set3_01.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_attack_set3_02.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_attack_set3_03.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_attack_set3_04.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_attack_set3_05.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_attack_set3_06.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_attack_set3_07.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_attack_set3_08.wav"
  ],
  death_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_death_low_01.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_death_low_02.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_death_low_03.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_death_low_04.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_death_low_05.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_death_low_07.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_death_low_10.wav"
  ],
  creatures: [],
  keywords: [],
  traits: [
    "male",
    "human",
    "halfling",
    "elf",
    "gnome",
    "leshy"
  ],
  size: 2
};
const Human_Male_B4 = {
  display_name: "Humanoid Masculine E",
  notes: "",
  hurt_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_hurt_pain_set_4_01.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_hurt_pain_set_4_02.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_hurt_pain_set_4_03.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_hurt_pain_set_4_04.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_hurt_pain_set_4_05.wav"
  ],
  attack_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_attack_set4_01.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_attack_set4_02.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_attack_set4_03.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_attack_set4_04.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_attack_set4_05.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_attack_set4_06.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_attack_set4_07.wav"
  ],
  death_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_death_low_01.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_death_low_02.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_death_low_03.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_death_low_04.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_death_low_05.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_death_low_07.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male B/voice_male_b_death_low_10.wav"
  ],
  creatures: [],
  keywords: [],
  traits: [
    "male",
    "human",
    "halfling",
    "elf"
  ],
  size: 2
};
const Human_Male_C = {
  display_name: "Humanoid Masculine F",
  notes: "",
  hurt_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male C/voice_male_c_hurt_pain_01.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male C/voice_male_c_hurt_pain_02.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male C/voice_male_c_hurt_pain_03.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male C/voice_male_c_hurt_pain_04.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male C/voice_male_c_hurt_pain_05.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male C/voice_male_c_hurt_pain_06.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male C/voice_male_c_hurt_pain_07.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male C/voice_male_c_hurt_pain_08.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male C/voice_male_c_hurt_pain_09.wav"
  ],
  attack_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male C/voice_male_c_attack_01.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male C/voice_male_c_attack_02.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male C/voice_male_c_attack_03.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male C/voice_male_c_attack_04.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male C/voice_male_c_attack_05.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male C/voice_male_c_attack_06.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male C/voice_male_c_attack_07.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male C/voice_male_c_attack_08.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male C/voice_male_c_attack_10.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male C/voice_male_c_attack_11.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male C/voice_male_c_attack_12.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male C/voice_male_c_attack_13.wav"
  ],
  death_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male C/voice_male_c_death_01.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male C/voice_male_c_death_02.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male C/voice_male_c_death_03.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male C/voice_male_c_death_04.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male C/voice_male_c_death_05.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male C/voice_male_c_death_06.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male C/voice_male_c_death_07.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male C/voice_male_c_death_08.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male C/voice_male_c_death_09.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male C/voice_male_c_death_10.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male C/voice_male_c_death_11.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male C/voice_male_c_death_12.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male C/voice_male_c_death_13.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male C/voice_male_c_death_14.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male C/voice_male_c_death_15.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male C/voice_male_c_death_16.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male C/voice_male_c_death_17.wav"
  ],
  creatures: [],
  keywords: [],
  traits: [
    "male",
    "human",
    "halfling",
    "dwarf",
    "centaur"
  ],
  size: 2
};
const Human_Male_D = {
  display_name: "Humanoid Masculine G",
  notes: "",
  hurt_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male D/voice_male_d_hurt_pain_01.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male D/voice_male_d_hurt_pain_02.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male D/voice_male_d_hurt_pain_03.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male D/voice_male_d_hurt_pain_04.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male D/voice_male_d_hurt_pain_05.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male D/voice_male_d_hurt_pain_06.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male D/voice_male_d_hurt_pain_07.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male D/voice_male_d_hurt_pain_08.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male D/voice_male_d_hurt_pain_09.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male D/voice_male_d_hurt_pain_10.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male D/voice_male_d_hurt_pain_11.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male D/voice_male_d_hurt_pain_low_01.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male D/voice_male_d_hurt_pain_low_02.wav"
  ],
  attack_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male D/voice_male_d_attack_groan_01.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male D/voice_male_d_attack_groan_02.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male D/voice_male_d_attack_groan_03.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male D/voice_male_d_attack_groan_04.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male D/voice_male_d_attack_groan_05.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male D/voice_male_d_attack_groan_06.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male D/voice_male_d_attack_groan_07.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male D/voice_male_d_attack_groan_08.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male D/voice_male_d_attack_groan_09.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male D/voice_male_d_attack_groan_10.wav"
  ],
  death_sounds: [
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male D/voice_male_d_death_01.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male D/voice_male_d_death_02.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male D/voice_male_d_death_03.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male D/voice_male_d_death_04.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male D/voice_male_d_death_05.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male D/voice_male_d_death_06.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male D/voice_male_d_death_07.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male D/voice_male_d_death_08.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male D/voice_male_d_death_09.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male D/voice_male_d_death_10.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male D/voice_male_d_death_11.wav",
    "modules/pf2e-creature-sounds/sounds/GameDevMarket/Gamemaster_Audio_Human_Vocalizations/Human Male D/voice_male_d_death_12.wav"
  ],
  creatures: [],
  keywords: [],
  traits: [
    "male",
    "human",
    "halfling",
    "dwarf",
    "centaur"
  ],
  size: 2
};
const creature_sounds_db = {
  Aberration,
  Behemoth,
  Dragon,
  Goblin,
  Insect,
  Orc,
  Skeleton,
  Spectre,
  Spider,
  Troll,
  Ancient_Dragon,
  Balor,
  Basilisk,
  Frost_Giant,
  Kraken,
  Mammoth,
  Roc,
  Sphinx,
  Spider_Queen,
  Treant,
  Gnoll,
  Harpy,
  Hellhound,
  Kelpie,
  Mimic,
  EGC_Orc,
  Owlbear,
  Rock_Golem,
  Wight,
  Wraith,
  "Female Creature": {
    display_name: "Hag",
    notes: "",
    hurt_sounds: [
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Creature/CREAHmn_Female Creature Pain Monstrosity Raspy Grunt Cry 01_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Creature/CREAHmn_Female Creature Pain Monstrosity Raspy Grunt Cry 02_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Creature/CREAHmn_Female Creature Pain Monstrosity Raspy Scream Cry 01_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Creature/CREAHmn_Female Creature Pain Monstrosity Raspy Scream Cry 02_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Creature/CREAHmn_Female Creature Pain Monstrosity Raspy Scream Cry 03_ESM_HC2.wav"
    ],
    attack_sounds: [
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Creature/CREAHmn_Female Creature Attack Monstrosity Raspy Grunt Yell 01_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Creature/CREAHmn_Female Creature Attack Monstrosity Raspy Grunt Yell 02_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Creature/CREAHmn_Female Creature Attack Monstrosity Raspy Grunt Yell 03_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Creature/CREAHmn_Female Creature Attack Monstrosity Raspy Grunt Yell 04_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Creature/CREAHmn_Female Creature Attack Monstrosity Raspy Grunt Yell 05_ESM_HC2.wav"
    ],
    death_sounds: [
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Creature/CREAHmn_Female Creature Death Monstrosity Raspy Yell Cry Groan 01_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Creature/CREAHmn_Female Creature Death Monstrosity Raspy Yell Cry Groan 02_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Creature/CREAHmn_Female Creature Death Monstrosity Raspy Yell Cry Groan 03_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Creature/CREAHmn_Female Creature Death Monstrosity Raspy Yell Cry Groan 04_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Creature/CREAHmn_Female Creature Death Monstrosity Raspy Yell Cry Groan 05_ESM_HC2.wav"
    ],
    creatures: [],
    keywords: [],
    traits: [
      "hag"
    ],
    size: -1
  },
  "Female Naga Gorgon": {
    display_name: "Medusa",
    notes: "",
    hurt_sounds: [
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Naga_Gorgon/CREAHmn_Female Naga Gorgon Pain Injured Groan Snake Rattle 01_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Naga_Gorgon/CREAHmn_Female Naga Gorgon Pain Injured Groan Snake Rattle 02_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Naga_Gorgon/CREAHmn_Female Naga Gorgon Pain Injured Groan Snake Rattle 03_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Naga_Gorgon/CREAHmn_Female Naga Gorgon Pain Injured Hiss Snake Rattle 01_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Naga_Gorgon/CREAHmn_Female Naga Gorgon Pain Injured Hiss Snake Rattle 02_ESM_HC2.wav"
    ],
    attack_sounds: [
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Naga_Gorgon/CREAHmn_Female Naga Gorgon Attack Battle Effort Hiss 01_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Naga_Gorgon/CREAHmn_Female Naga Gorgon Attack Battle Effort Hiss 02_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Naga_Gorgon/CREAHmn_Female Naga Gorgon Attack Battle Effort Hiss 03_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Naga_Gorgon/CREAHmn_Female Naga Gorgon Attack Battle Effort Hiss 04_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Naga_Gorgon/CREAHmn_Female Naga Gorgon Attack Battle Effort Hiss 05_ESM_HC2.wav"
    ],
    death_sounds: [
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Naga_Gorgon/CREAHmn_Female Naga Gorgon Death Killed Hiss Growl Groan Snake 01_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Naga_Gorgon/CREAHmn_Female Naga Gorgon Death Killed Hiss Growl Groan Snake 02_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Naga_Gorgon/CREAHmn_Female Naga Gorgon Death Killed Hiss Growl Groan Snake 03_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Naga_Gorgon/CREAHmn_Female Naga Gorgon Death Killed Hiss Growl Groan Snake 04_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Naga_Gorgon/CREAHmn_Female Naga Gorgon Death Killed Hiss Growl Groan Snake 05_ESM_HC2.wav"
    ],
    creatures: [],
    keywords: [
      "medusa",
      "lamia"
    ],
    traits: [],
    size: -1
  },
  "Female Sprite Gnome": {
    display_name: "Sprite",
    notes: "",
    hurt_sounds: [
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Sprite_Gnome/CREAHmn_Female Sprite Gnome Pain Injured Hit Shout Cry 01_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Sprite_Gnome/CREAHmn_Female Sprite Gnome Pain Injured Hit Shout Cry 02_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Sprite_Gnome/CREAHmn_Female Sprite Gnome Pain Injured Hit Shout Cry 03_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Sprite_Gnome/CREAHmn_Female Sprite Gnome Pain Injured Hit Shout Cry 04_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Sprite_Gnome/CREAHmn_Female Sprite Gnome Pain Injured Hit Shout Cry 05_ESM_HC2.wav"
    ],
    attack_sounds: [
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Sprite_Gnome/CREAHmn_Female Sprite Gnome Attack Wild Swing Grunt 01_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Sprite_Gnome/CREAHmn_Female Sprite Gnome Attack Wild Swing Grunt 02_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Sprite_Gnome/CREAHmn_Female Sprite Gnome Attack Wild Swing Scream 01_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Sprite_Gnome/CREAHmn_Female Sprite Gnome Attack Wild Swing Scream 02_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Sprite_Gnome/CREAHmn_Female Sprite Gnome Attack Wild Swing Scream 03_ESM_HC2.wav"
    ],
    death_sounds: [
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Sprite_Gnome/CREAHmn_Female Sprite Gnome Death Fallen Defeated Cry Wail 01_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Sprite_Gnome/CREAHmn_Female Sprite Gnome Death Fallen Defeated Cry Wail 02_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Sprite_Gnome/CREAHmn_Female Sprite Gnome Death Fallen Defeated Cry Wail 03_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Sprite_Gnome/CREAHmn_Female Sprite Gnome Death Fallen Defeated Cry Wail 04_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Sprite_Gnome/CREAHmn_Female Sprite Gnome Death Fallen Defeated Cry Wail 05_ESM_HC2.wav"
    ],
    creatures: [],
    keywords: [
      "fairy",
      "brownie",
      "pukwudgie"
    ],
    traits: [
      "sprite",
      "gremlin"
    ],
    size: 0
  },
  "Female Succubus Demon": {
    display_name: "Succubus",
    notes: "",
    hurt_sounds: [
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Succubus_Demon/CREAHmn_Female Succubus Demon Pain Groan Hit Grunt Cry 01_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Succubus_Demon/CREAHmn_Female Succubus Demon Pain Groan Hit Shout Cry 02_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Succubus_Demon/CREAHmn_Female Succubus Demon Pain Groan Hit Shout Cry 03_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Succubus_Demon/CREAHmn_Female Succubus Demon Pain Groan Hit Shout Cry 04_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Succubus_Demon/CREAHmn_Female Succubus Demon Pain Groan Hit Shout Cry 05_ESM_HC2.wav"
    ],
    attack_sounds: [
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Succubus_Demon/CREAHmn_Female Succubus Demon Attack Confident Shout 01_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Succubus_Demon/CREAHmn_Female Succubus Demon Attack Confident Shout 02_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Succubus_Demon/CREAHmn_Female Succubus Demon Attack Confident Shout 03_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Succubus_Demon/CREAHmn_Female Succubus Demon Attack Confident Shout 04_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Succubus_Demon/CREAHmn_Female Succubus Demon Attack Confident Shout 05_ESM_HC2.wav"
    ],
    death_sounds: [
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Succubus_Demon/CREAHmn_Female Succubus Demon Death Defeated Scream Cry Wail Grunt 01_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Succubus_Demon/CREAHmn_Female Succubus Demon Death Defeated Scream Cry Wail Grunt 02_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Succubus_Demon/CREAHmn_Female Succubus Demon Death Defeated Scream Cry Wail Grunt 03_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Succubus_Demon/CREAHmn_Female Succubus Demon Death Defeated Scream Cry Wail Grunt 04_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Succubus_Demon/CREAHmn_Female Succubus Demon Death Defeated Scream Cry Wail Grunt 05_ESM_HC2.wav"
    ],
    creatures: [],
    keywords: [
      "succubus",
      "norn"
    ],
    traits: [
      "nymph"
    ],
    size: -1
  },
  "Female Infected Undead": {
    display_name: "Revenant",
    notes: "",
    hurt_sounds: [
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Undead/CREAHmn_Female Infected Undead Pain Zombie Spawn Grunt Scream Cry 01_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Undead/CREAHmn_Female Infected Undead Pain Zombie Spawn Grunt Scream Cry 02_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Undead/CREAHmn_Female Infected Undead Pain Zombie Spawn Grunt Scream Cry 03_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Undead/CREAHmn_Female Infected Undead Pain Zombie Spawn Grunt Scream Cry 04_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Undead/CREAHmn_Female Infected Undead Pain Zombie Spawn Grunt Scream Cry 05_ESM_HC2.wav"
    ],
    attack_sounds: [
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Undead/CREAHmn_Female Infected Undead Attack Zombie Spawn Grunt Scream 01_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Undead/CREAHmn_Female Infected Undead Attack Zombie Spawn Grunt Scream 02_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Undead/CREAHmn_Female Infected Undead Attack Zombie Spawn Grunt Scream 03_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Undead/CREAHmn_Female Infected Undead Attack Zombie Spawn Grunt Scream 04_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Undead/CREAHmn_Female Infected Undead Attack Zombie Spawn Grunt Scream 05_ESM_HC2.wav"
    ],
    death_sounds: [
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Undead/CREAHmn_Female Infected Undead Death Zombie Spawn Groan Grunt Scream Cry 01_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Undead/CREAHmn_Female Infected Undead Death Zombie Spawn Groan Grunt Scream Cry 02_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Undead/CREAHmn_Female Infected Undead Death Zombie Spawn Groan Grunt Scream Cry 03_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Undead/CREAHmn_Female Infected Undead Death Zombie Spawn Groan Grunt Scream Cry 04_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Undead/CREAHmn_Female Infected Undead Death Zombie Spawn Groan Grunt Scream Cry 05_ESM_HC2.wav"
    ],
    creatures: [],
    keywords: [
      "revenant",
      "seraptis"
    ],
    traits: [],
    size: -1
  },
  "Female Werewolf Shifter": {
    display_name: "Werewolf",
    notes: "",
    hurt_sounds: [
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Werewolf_Shifter/CREAHmn_Female Werewolf Shifter Pain Hit Injured Scream Yelp Whimper 01_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Werewolf_Shifter/CREAHmn_Female Werewolf Shifter Pain Hit Injured Scream Yelp Whimper 02_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Werewolf_Shifter/CREAHmn_Female Werewolf Shifter Pain Hit Injured Scream Yelp Whimper 03_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Werewolf_Shifter/CREAHmn_Female Werewolf Shifter Pain Hit Injured Scream Yelp Whimper 04_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Werewolf_Shifter/CREAHmn_Female Werewolf Shifter Pain Hit Injured Scream Yelp Whimper 05_ESM_HC2.wav"
    ],
    attack_sounds: [
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Werewolf_Shifter/CREAHmn_Female Werewolf Shifter Attack Glottal Throaty Scream Growl Bark 01_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Werewolf_Shifter/CREAHmn_Female Werewolf Shifter Attack Glottal Throaty Scream Growl Bark 02_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Werewolf_Shifter/CREAHmn_Female Werewolf Shifter Attack Glottal Throaty Scream Growl Bark 03_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Werewolf_Shifter/CREAHmn_Female Werewolf Shifter Attack Glottal Throaty Scream Growl Bark 04_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Werewolf_Shifter/CREAHmn_Female Werewolf Shifter Attack Glottal Throaty Scream Growl Bark 05_ESM_HC2.wav"
    ],
    death_sounds: [
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Werewolf_Shifter/CREAHmn_Female Werewolf Shifter Death Defeated Dying Grunt Growl 01_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Werewolf_Shifter/CREAHmn_Female Werewolf Shifter Death Defeated Dying Grunt Growl 02_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Werewolf_Shifter/CREAHmn_Female Werewolf Shifter Death Defeated Dying Howl 01_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Werewolf_Shifter/CREAHmn_Female Werewolf Shifter Death Defeated Dying Whimper Growl 01_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Werewolf_Shifter/CREAHmn_Female Werewolf Shifter Death Defeated Dying Whimper Growl 02_ESM_HC2.wav"
    ],
    creatures: [],
    keywords: [],
    traits: [
      "werecreature"
    ],
    size: -1
  },
  "Female Wisp Spirit": {
    display_name: "Wisp",
    notes: "",
    hurt_sounds: [
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Wisp_Spirit/CREAHmn_Female Wisp Spirit Pain Yelp Cry Hit Short Ethereal Ghost 01_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Wisp_Spirit/CREAHmn_Female Wisp Spirit Pain Yelp Cry Hit Short Ethereal Ghost 02_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Wisp_Spirit/CREAHmn_Female Wisp Spirit Pain Yelp Cry Hit Short Ethereal Ghost 03_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Wisp_Spirit/CREAHmn_Female Wisp Spirit Pain Yelp Cry Hit Short Ethereal Ghost 04_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Wisp_Spirit/CREAHmn_Female Wisp Spirit Pain Yelp Cry Hit Short Ethereal Ghost 05_ESM_HC2.wav"
    ],
    attack_sounds: [
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Wisp_Spirit/CREAHmn_Female Wisp Spirit Attack Vocalization Ethereal Ghost Call 01_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Wisp_Spirit/CREAHmn_Female Wisp Spirit Attack Vocalization Ethereal Ghost Call 02_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Wisp_Spirit/CREAHmn_Female Wisp Spirit Attack Vocalization Ethereal Ghost Call 03_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Wisp_Spirit/CREAHmn_Female Wisp Spirit Attack Vocalization Ethereal Ghost Call 04_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Wisp_Spirit/CREAHmn_Female Wisp Spirit Attack Vocalization Ethereal Ghost Call 05_ESM_HC2.wav"
    ],
    death_sounds: [
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Wisp_Spirit/CREAHmn_Female Wisp Spirit Death Defeated Pitch Drop Ethereal Ghost Cry 01_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Wisp_Spirit/CREAHmn_Female Wisp Spirit Death Defeated Pitch Drop Ethereal Ghost Cry 02_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Wisp_Spirit/CREAHmn_Female Wisp Spirit Death Defeated Pitch Drop Ethereal Ghost Cry 03_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Wisp_Spirit/CREAHmn_Female Wisp Spirit Death Defeated Pitch Drop Ethereal Ghost Cry 04_ESM_HC2.wav",
      "modules/pf2e-creature-sounds/sounds/GameDevMarket/Humanoid_Creatures_2/Female_Wisp_Spirit/CREAHmn_Female Wisp Spirit Death Defeated Pitch Drop Ethereal Ghost Cry 05_ESM_HC2.wav"
    ],
    creatures: [],
    keywords: [
      "wisp"
    ],
    traits: [],
    size: 0
  },
  Brute,
  Ghoul,
  Hellspawn,
  Mutant,
  Sludgeman,
  Strigoi,
  Voidling,
  Zombie,
  Human_Female_A,
  Human_Female_B1,
  Human_Female_B2,
  Human_Female_C,
  Human_Male_A,
  Human_Male_B1,
  Human_Male_B2,
  Human_Male_B3,
  Human_Male_B4,
  Human_Male_C,
  Human_Male_D
};
const soundsDatabase = Object.fromEntries(
  Object.entries(creature_sounds_db).map(([key, value]) => [
    key,
    { ...value, name: key }
    // Add the new field here
  ])
);
const KEYWORD_NAME_SCORE = 5;
const KEYWORD_BLURB_SCORE = 4;
const TRAIT_SCORE = 1;
const NO_SOUND_SET = "none";
const NO_SOUND_SET_DISPLAY_NAME = "--- no sound ---";
function getNameOptions() {
  const sortedArray = Object.entries(soundsDatabase).map(([key, value]) => [key, value.display_name]).sort((a, b) => a[1].localeCompare(b[1]));
  sortedArray.unshift([NO_SOUND_SET, NO_SOUND_SET_DISPLAY_NAME]);
  return Object.fromEntries(sortedArray);
}
function creatureSoundOnDamage(actor, options) {
  var _a;
  if (actor.type === "character" && !getSetting(SETTINGS.CREATURE_SOUNDS_CHARACTER)) {
    return;
  }
  if (!("damageTaken" in options)) {
    return;
  }
  if (options.damageTaken <= 0) {
    return;
  }
  const soundType = ((_a = actor.system.attributes.hp) == null ? void 0 : _a.value) === 0 ? "death" : "hurt";
  playRandomMatchingSound(actor, soundType);
}
function creatureSoundOnAttack(message) {
  var _a, _b;
  if (((_a = message.flags.pf2e.context) == null ? void 0 : _a.type) !== "attack-roll") {
    return;
  }
  if (!message.speaker.token) {
    return;
  }
  let attackingToken = (_b = canvas.scene) == null ? void 0 : _b.tokens.get(message.speaker.token);
  let attackingActor = attackingToken.actor;
  if (attackingActor.type === "character" && !getSetting(SETTINGS.CREATURE_SOUNDS_CHARACTER)) {
    return;
  }
  playRandomMatchingSound(attackingActor, "attack");
}
function playRandomMatchingSound(actor, soundType, allPlayers = true) {
  let soundSet = findSoundSet(actor);
  if (!soundSet) {
    return;
  }
  const returnedSounds = getSoundsOfType(soundSet, soundType);
  playRandomSound(returnedSounds, allPlayers);
}
function findSoundSet(actor) {
  var _a, _b;
  const chosenSoundSet = (_b = (_a = actor.flags) == null ? void 0 : _a[MODULE_ID]) == null ? void 0 : _b.soundset;
  if (chosenSoundSet) {
    if (chosenSoundSet === NO_SOUND_SET) {
      return null;
    }
    if (hasKey(soundsDatabase, chosenSoundSet)) {
      return soundsDatabase[chosenSoundSet];
    }
  }
  let soundSet = findSoundSetByCreatureName(actor.name);
  if (soundSet) {
    return soundSet;
  }
  soundSet = findSoundSetByScoring(actor);
  if (soundSet) {
    return soundSet;
  }
  logd("No Sounds found.");
  return null;
}
function findSoundSetByScoring(actor) {
  const scoredSoundSets = scoreSoundSets(actor);
  let highestScore = 1;
  let soundsWithHighestValue = [];
  for (let [soundSet, score] of scoredSoundSets) {
    if (score > highestScore) {
      highestScore = score;
      soundsWithHighestValue = [soundSet];
    } else if (score === highestScore) {
      soundsWithHighestValue.push(soundSet);
    }
  }
  if (soundsWithHighestValue.length === 0) {
    return null;
  }
  let hash = Math.abs(getHashCode(actor.name));
  return soundsWithHighestValue[hash % soundsWithHighestValue.length];
}
function scoreSoundSets(actor) {
  var _a, _b;
  const soundSetScores = /* @__PURE__ */ new Map();
  let traits = extractTraits(actor);
  let creatureSize = extractSize(actor);
  for (const [, soundSet] of Object.entries(soundsDatabase)) {
    let score = 0;
    const blurb = isNPC(actor) ? (_b = (_a = actor == null ? void 0 : actor.system) == null ? void 0 : _a.details) == null ? void 0 : _b.blurb : null;
    for (const keyword of soundSet.keywords) {
      const regex = new RegExp("\\b" + keyword + "\\b", "i");
      if (actor.name.match(regex)) {
        score += KEYWORD_NAME_SCORE;
      }
      if (blurb && blurb.match(regex)) {
        score += KEYWORD_BLURB_SCORE;
      }
    }
    const matchingTraits = soundSet.traits.filter((trait) => traits.includes(trait)).length;
    score += matchingTraits * TRAIT_SCORE;
    if (score > 0 && soundSet.size != -1 && creatureSize != -1) {
      logd("creaturesize=" + creatureSize);
      let scoreAdj = (2 - Math.abs(creatureSize - soundSet.size)) / 10;
      score += scoreAdj;
    }
    soundSetScores.set(soundSet, score);
  }
  logd(soundSetScores);
  return soundSetScores;
}
function findSoundSetByCreatureName(creatureName) {
  var _a;
  for (const [, soundSet] of Object.entries(soundsDatabase)) {
    if ((_a = soundSet.creatures) == null ? void 0 : _a.includes(creatureName)) {
      logd("Exact Match found for " + creatureName);
      return soundSet;
    }
  }
  return null;
}
function getSoundsOfType(soundSet, soundType) {
  switch (soundType) {
    case "hurt":
      return soundSet.hurt_sounds;
    case "death":
      if (soundSet.death_sounds.length != 0) {
        return soundSet.death_sounds;
      }
      logd("No death sounds found, so using hurt sound as fallback");
      return soundSet.hurt_sounds;
    case "attack":
      return soundSet.attack_sounds;
    default:
      logd(`No sounds found for soundType=${soundType}`);
      return [];
  }
}
function extractTraits(actor) {
  const rollOptions = actor.flags.pf2e.rollOptions.all;
  const traits = [];
  for (const key in rollOptions) {
    if (key.startsWith("self:trait:") || key.startsWith("origin:trait:")) {
      const trait = key.slice(key.lastIndexOf(":") + 1);
      traits.push(trait);
    }
  }
  let gender = getGenderFromPronouns(actor);
  if (!gender) {
    gender = getGenderFromBlurb(actor);
  }
  if (gender) {
    traits.push(gender);
  }
  return traits;
}
function getGenderFromBlurb(actor) {
  var _a, _b;
  const blurb = isNPC(actor) ? (_b = (_a = actor == null ? void 0 : actor.system) == null ? void 0 : _a.details) == null ? void 0 : _b.blurb : null;
  if (!blurb) {
    return null;
  }
  const regexMale = /\bmale\b/i;
  const regexFemale = /\bfemale\b/i;
  if (blurb.match(regexFemale)) {
    return "female";
  }
  if (blurb.match(regexMale)) {
    return "male";
  }
  return null;
}
function getGenderFromPronouns(actor) {
  var _a, _b, _c;
  const pronouns = isCharacter(actor) ? (_c = (_b = (_a = actor == null ? void 0 : actor.system) == null ? void 0 : _a.details) == null ? void 0 : _b.gender) == null ? void 0 : _c.value : null;
  if (!pronouns) {
    return null;
  }
  const regexMale = /\b(he|him)\b/i;
  const regexFemale = /\b(she|her)\b/i;
  if (pronouns.match(regexFemale)) {
    return "female";
  }
  if (pronouns.match(regexMale)) {
    return "male";
  }
  return null;
}
function extractSize(actor) {
  const rollOptions = actor.flags.pf2e.rollOptions.all;
  const regex = /^(self|origin):size:(\d+)$/;
  for (const key in rollOptions) {
    let matches = key.match(regex);
    if (!matches) {
      continue;
    }
    const parsedValue = parseInt(matches[2], 10);
    if (!isNaN(parsedValue)) {
      return parsedValue;
    }
  }
  logd(`Size not found`);
  return -1;
}
function playRandomSound(sounds, allPlayers) {
  playSound(sounds[Math.floor(Math.random() * sounds.length)], allPlayers);
}
function playSound(sound, allPlayers) {
  logd(`sound to play: ${sound}`);
  foundry.audio.AudioHelper.play({
    src: sound,
    volume: getSetting(SETTINGS.CREATURE_SOUNDS_VOLUME),
    autoplay: true,
    loop: false
  }, allPlayers);
}
const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;
const _ActorSoundSelectApp = class _ActorSoundSelectApp extends HandlebarsApplicationMixin(ApplicationV2) {
  constructor(actor, options) {
    super(options);
    __publicField(this, "actor");
    this.actor = actor;
  }
  async _prepareContext() {
    var _a;
    const currentSoundSet = ((_a = findSoundSet(this.actor)) == null ? void 0 : _a.name) ?? NO_SOUND_SET;
    const dropDownNames = getNameOptions();
    const canEdit = game.user.isGM || this.actor.getUserLevel(game.user) == CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER && getSetting(SETTINGS.PLAYERS_CAN_EDIT);
    return {
      currentSoundSet,
      dropDownNames,
      canEdit
    };
  }
  async _onChangeForm(_formConfig, event) {
    var _a;
    await this.actor.setFlag(MODULE_ID, "soundset", (_a = event.target) == null ? void 0 : _a.value);
    this.render();
  }
  static async setToDefault() {
    await this.actor.unsetFlag(MODULE_ID, "soundset");
    this.render();
  }
  static playAttackSound() {
    playRandomMatchingSound(this.actor, "attack", false);
  }
  static playHurtSound() {
    playRandomMatchingSound(this.actor, "hurt", false);
  }
  static playDeathSound() {
    playRandomMatchingSound(this.actor, "death", false);
  }
};
__publicField(_ActorSoundSelectApp, "PARTS", {
  form: {
    template: "modules/pf2e-creature-sounds/templates/actor-sound-select.hbs"
  }
});
__publicField(_ActorSoundSelectApp, "DEFAULT_OPTIONS", {
  id: "creature-sounds-app",
  tag: "form",
  window: {
    title: "Creature Sounds"
  },
  actions: {
    play_attack_sound: _ActorSoundSelectApp.playAttackSound,
    play_hurt_sound: _ActorSoundSelectApp.playHurtSound,
    play_death_sound: _ActorSoundSelectApp.playDeathSound,
    default_sound: _ActorSoundSelectApp.setToDefault
  }
});
let ActorSoundSelectApp = _ActorSoundSelectApp;
Hooks.on("init", () => {
  registerSettings();
});
Hooks.on("updateActor", (actor, _changed, options, _userId) => {
  hook(creatureSoundOnDamage, actor, options).ifEnabled(SETTINGS.CREATURE_SOUNDS, SETTINGS.CREATURE_HURT_SOUNDS).ifGM().run();
});
Hooks.on("createChatMessage", (message) => {
  switch (getMessageType(message)) {
    case "attack-roll":
      hook(creatureSoundOnAttack, message).ifEnabled(SETTINGS.CREATURE_SOUNDS, SETTINGS.CREATURE_ATTACK_SOUNDS).ifGM().run();
      break;
  }
});
Hooks.on("getCreatureSheetPF2eHeaderButtons", (actorSheet, buttons) => {
  const actor = actorSheet.object;
  if (actor.getUserLevel(game.user) < CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER) {
    return;
  }
  buttons.unshift({
    class: "sounds-control",
    icon: "fas fa-volume-up",
    label: "Sounds",
    onclick: () => {
      new ActorSoundSelectApp(actor, {}).render(true);
    }
  });
});
function getMessageType(message) {
  var _a, _b, _c, _d, _e, _f;
  return ((_c = (_b = (_a = message.flags) == null ? void 0 : _a.pf2e) == null ? void 0 : _b.context) == null ? void 0 : _c.type) ?? ((_f = (_e = (_d = message.flags) == null ? void 0 : _d.pf2e) == null ? void 0 : _e.origin) == null ? void 0 : _f.type);
}
function hook(func, ...args) {
  return new HookRunner(func, ...args);
}
class HookRunner {
  constructor(func, ...args) {
    __publicField(this, "func");
    __publicField(this, "args");
    __publicField(this, "shouldRun");
    this.func = func;
    this.args = args;
    this.shouldRun = true;
  }
  ifEnabled(...settings) {
    for (const setting of settings) {
      if (!getSetting(setting)) {
        this.shouldRun = false;
      }
    }
    return this;
  }
  ifGM() {
    if (!game.user.isGM) {
      this.shouldRun = false;
    }
    return this;
  }
  ifMessagePoster() {
    const message = this.args[0];
    if (message.constructor.name != "ChatMessagePF2e") {
      throw new Error("First arg is not ChatMessagePF2e");
    }
    if (game.user.id != message.user.id) {
      this.shouldRun = false;
    }
    return this;
  }
  run() {
    if (this.shouldRun) {
      this.func(...this.args);
    }
  }
}
