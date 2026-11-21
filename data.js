/* ==========================================================================
   RIFTFALL — DATA CONFIGURATION (data.js)
   8 Themed Dungeons, Class-Tagged Gear Sets, Active Rift Bounties,
   4 Base + 8 Advanced Classes, Custom Weapon Models & Choreographed Skills.
   ========================================================================== */

window.GAME_DATA = {
  GAME_TITLE: "Riftfall",
  SAVE_KEY: "riftfall_save_v1",

  CONSTANTS: {
    INVENTORY_CAPACITY: 48,
    MAX_UPGRADE_LEVEL: 50,
    MAX_FLASKS: 10,
    FLASK_COST_GOLD: 75,
    FLASK_HEAL_PCT: 0.45,
    FLASK_COOLDOWN: 6.0,
    DASH_COOLDOWN: 2.0,
    DASH_DURATION: 0.24,
    DASH_IFRAMES: 0.36,
    REROLL_BASE_SHARDS: 12,
    XP_BASE: 95,
    XP_GROWTH: 1.24,
    EVOLUTION_LEVEL_REQ: 6,
    CLASS_AFFINITY_BONUS: 0.15,
    AUTO_SAVE_INTERVAL: 15,
    BASE_PLAYER_STATS: {
      hp: 240,
      atk: 26,
      spell: 24,
      crit: 0.08,
      critMult: 1.65,
      speed: 5.0,
      hazardResist: 0.0,
      lifesteal: 0.0,
      cdr: 0.0,
      armor: 10
    }
  },

  /* ------------------------------------------------------------------------
     CLASS ARCHETYPE METADATA (For Gear Badges, Filters & Tooltips)
     ------------------------------------------------------------------------ */
  CLASS_META: {
    all:         { id: "all",         short: "All Classes", label: "All Classes",         icon: "◈", color: "#cbd5e1" },
    vanguard:    { id: "vanguard",    short: "Warrior",     label: "Warrior (Vanguard)",  icon: "⚔", color: "#38bdf8" },
    arcanist:    { id: "arcanist",    short: "Mage",        label: "Mage (Arcanist)",     icon: "✦", color: "#c084fc" },
    shadowblade: { id: "shadowblade", short: "Rogue",       label: "Rogue (Shadowblade)", icon: "🗡", color: "#f59e0b" },
    warden:      { id: "warden",      short: "Mystic",      label: "Mystic (Warden)",     icon: "🌿", color: "#22c55e" }
  },

  /* ------------------------------------------------------------------------
     ACTIVE RIFT BOUNTIES
     ------------------------------------------------------------------------ */
  BOUNTY_TEMPLATES: [
    { id: "bounty_slay",   track: "kills",        name: "Rift Exterminator", icon: "⚔", desc: "Slay enemies inside any Rift dungeon.",        baseTarget: 20, targetStep: 12, baseGold: 160, baseShards: 14, baseRenown: 1 },
    { id: "bounty_boss",   track: "bossKills",    name: "Guardian Hunter",   icon: "☠", desc: "Defeat Dungeon Bosses to earn Guild Renown.",  baseTarget: 2,  targetStep: 1,  baseGold: 320, baseShards: 28, baseRenown: 2 },
    { id: "bounty_urns",   track: "urns",         name: "Relic Breaker",     icon: "⚱", desc: "Smash Rift Urns across dungeon chambers.",     baseTarget: 8,  targetStep: 5,  baseGold: 140, baseShards: 16, baseRenown: 1 },
    { id: "bounty_elites", track: "eliteKills",   name: "Elite Challenger",  icon: "★", desc: "Defeat glowing golden Elite monsters.",        baseTarget: 3,  targetStep: 2,  baseGold: 280, baseShards: 26, baseRenown: 2 },
    { id: "bounty_rooms",  track: "roomsCleared", name: "Deep Delver",       icon: "◈", desc: "Clear dungeon rooms across any difficulty.",   baseTarget: 8,  targetStep: 5,  baseGold: 210, baseShards: 20, baseRenown: 1 }
  ],

  /* ------------------------------------------------------------------------
     ROGUELIKE RIFT BOONS (Picked Between Dungeon Rooms)
     ------------------------------------------------------------------------ */
  RUN_BOONS: [
    { id: "boon_frenzy",    name: "Quicksilver Fury",   icon: "⚡", desc: "+22% Attack Speed and +12% Move Speed for this run.",          mods: { atkSpeedMult: 0.22, speedPct: 0.12 } },
    { id: "boon_titan",     name: "Colossus Vitality",  icon: "❤", desc: "+28% Max HP and immediately heal 40% HP.",                     mods: { hpPct: 0.28 }, instantHealPct: 0.4 },
    { id: "boon_slayer",    name: "Executioner's Edge", icon: "⚔", desc: "+20% ATK & Spell Power and +10% Crit Chance.",                 mods: { powerPct: 0.2, crit: 0.1 } },
    { id: "boon_lightning", name: "Stormcaller Crits",  icon: "✦", desc: "Critical hits arc Chain Lightning for 65% Spell Power.",       mods: { chainLightning: true } },
    { id: "boon_chrono",    name: "Rift Acceleration",  icon: "⌛", desc: "+18% Cooldown Reduction and +15% Crit Damage.",                mods: { cdr: 0.18, critMult: 0.15 } },
    { id: "boon_vampiric",  name: "Crimson Siphon",     icon: "❦", desc: "+7% Lifesteal and +15% Hazard Resistance.",                    mods: { lifesteal: 0.07, hazardResist: 0.15 } },
    { id: "boon_fortune",   name: "Gilded Rift",        icon: "◈", desc: "+45% Gold & Shards earned and +0.25 Rarity Luck this run.",    mods: { lootMultBonus: 0.45, rarityLuck: 0.25 } },
    { id: "boon_bastion",   name: "Runic Ward",         icon: "🛡", desc: "+25 Armor and entering each room grants a 30% Max HP Shield.", mods: { armor: 25, roomShieldPct: 0.3 } }
  ],

  /* ------------------------------------------------------------------------
     CLASS & ADVANCED EVOLUTION SYSTEM (4 Base -> 8 Advanced at Lv. 6)
     ------------------------------------------------------------------------ */
  CLASSES: {
    vanguard: {
      id: "vanguard", name: "Vanguard", roleTitle: "Warrior / Tank", tier: "base", icon: "⚔", color: "#38bdf8", crest: "crown_steel",
      primaryStats: "Max HP • ATK • Armor",
      desc: "Frontline Warrior sentinel trained in heavy armor and retaliatory strikes.",
      bonuses: { hpPct: 0.16, atkPct: 0.10, armor: 12 },
      passiveName: "Iron Bulwark",
      passiveDesc: "Every 4th attack grants a protective barrier equal to 8% of Max HP.",
      evolutions: ["paladin", "berserker"]
    },
    arcanist: {
      id: "arcanist", name: "Arcanist", roleTitle: "Mage / Caster", tier: "base", icon: "✦", color: "#c084fc", crest: "halo_arcane",
      primaryStats: "Spell Power • Cooldown Red.",
      desc: "High-burst Mage channeling raw Rift energy to accelerate spell cadence.",
      bonuses: { spellPct: 0.18, cdr: 0.08, crit: 0.04 },
      passiveName: "Arcane Echo",
      passiveDesc: "Casting [Q] reduces the remaining cooldown of [E] by 2.0 seconds.",
      evolutions: ["chronomancer", "pyromancer"]
    },
    shadowblade: {
      id: "shadowblade", name: "Shadowblade", roleTitle: "Rogue / Striker", tier: "base", icon: "🗡", color: "#f59e0b", crest: "hood_shadow",
      primaryStats: "ATK • Crit Chance • Speed",
      desc: "Swift Rogue duelist striking vital weak points and dancing through boss attacks.",
      bonuses: { atkPct: 0.12, crit: 0.10, speedPct: 0.12 },
      passiveName: "Phantom Step",
      passiveDesc: "Dashing guarantees your next attack or skill within 2.5s is a Critical Hit.",
      evolutions: ["assassin", "ranger"]
    },
    warden: {
      id: "warden", name: "Warden", roleTitle: "Mystic / Hybrid", tier: "base", icon: "🌿", color: "#22c55e", crest: "antlers_verdant",
      primaryStats: "Spell • Lifesteal • Resist",
      desc: "Nature & Shadow Mystic attuned to life siphon and environmental purification.",
      bonuses: { hpPct: 0.10, spellPct: 0.10, lifesteal: 0.05, hazardResist: 0.12 },
      passiveName: "Verdant Pulse",
      passiveDesc: "Slaying an enemy restores 5% Max HP and purges 12% of active dungeon hazards.",
      evolutions: ["blight_sovereign", "geomancer"]
    },

    paladin: {
      id: "paladin", name: "Solar Paladin", roleTitle: "Ascended Warrior", tier: "advanced", baseId: "vanguard", icon: "☀", color: "#fde047", crest: "crown_solar",
      costGold: 450, costRenown: 2,
      desc: "Ascended templar radiating blinding solar shields and purifying flame.",
      bonuses: { hpPct: 0.30, atkPct: 0.18, spellPct: 0.14, armor: 26, hazardResist: 0.12 },
      passiveName: "Solar Judgment",
      passiveDesc: "Every 3rd attack grants a 12% HP Solar Shield and blasts nearby foes for 90% Spell Power."
    },
    berserker: {
      id: "berserker", name: "Rift Berserker", roleTitle: "Ascended Warrior", tier: "advanced", baseId: "vanguard", icon: "🪓", color: "#ef4444", crest: "horns_crimson",
      costGold: 450, costRenown: 2,
      desc: "Unchained warlord whose fury scales as blood spills across the arena.",
      bonuses: { hpPct: 0.18, atkPct: 0.32, crit: 0.12, lifesteal: 0.06, speedPct: 0.10 },
      passiveName: "Bloodlust Frenzy",
      passiveDesc: "Critical hits deal +35% bonus damage and restore 4% Max HP."
    },
    chronomancer: {
      id: "chronomancer", name: "Chronomancer", roleTitle: "Ascended Mage", tier: "advanced", baseId: "arcanist", icon: "⌛", color: "#38bdf8", crest: "halo_chrono",
      costGold: 450, costRenown: 2,
      desc: "Master of temporal fractures who bends cooldowns and freezes enemies in time.",
      bonuses: { spellPct: 0.28, cdr: 0.18, speedPct: 0.14, crit: 0.08 },
      passiveName: "Temporal Cascade",
      passiveDesc: "Casting [Q] or [E] refunds 25% of all active skill cooldowns and slows nearby foes."
    },
    pyromancer: {
      id: "pyromancer", name: "Void Pyromancer", roleTitle: "Ascended Mage", tier: "advanced", baseId: "arcanist", icon: "🔥", color: "#f97316", crest: "crown_flame",
      costGold: 450, costRenown: 2,
      desc: "Cataclysmic archmage raining astral embers with every spell cast.",
      bonuses: { spellPct: 0.36, atkPct: 0.12, crit: 0.12, cdr: 0.10 },
      passiveName: "Meteor Overload",
      passiveDesc: "Casting [Q] calls down an extra Void Meteor for 160% Spell Power."
    },
    assassin: {
      id: "assassin", name: "Phantom Assassin", roleTitle: "Ascended Rogue", tier: "advanced", baseId: "shadowblade", icon: "☠", color: "#e879f9", crest: "hood_phantom",
      costGold: 450, costRenown: 2,
      desc: "Lethal shadow-weaver executing wounded bosses with devastating criticals.",
      bonuses: { atkPct: 0.28, crit: 0.18, speedPct: 0.20, lifesteal: 0.05 },
      passiveName: "Shadow Execution",
      passiveDesc: "Dashing guarantees a Critical Hit and strikes enemies below 40% HP for +45% damage."
    },
    ranger: {
      id: "ranger", name: "Tempest Ranger", roleTitle: "Ascended Rogue", tier: "advanced", baseId: "shadowblade", icon: "🏹", color: "#34d399", crest: "crown_wind",
      costGold: 450, costRenown: 2,
      desc: "Storm-forged marksman unleashing rapid wind-bolts and lightning volleys.",
      bonuses: { atkPct: 0.24, crit: 0.14, speedPct: 0.24, cdr: 0.12 },
      passiveName: "Gale Volley",
      passiveDesc: "Every 3rd attack fires a piercing Tempest Bolt for 115% ATK damage."
    },
    blight_sovereign: {
      id: "blight_sovereign", name: "Blight Sovereign", roleTitle: "Ascended Mystic", tier: "advanced", baseId: "warden", icon: "☣", color: "#84cc16", crest: "crown_spore",
      costGold: 450, costRenown: 2,
      desc: "Plague-lord whose virulent spores melt armor and sustain unending vitality.",
      bonuses: { hpPct: 0.20, spellPct: 0.26, lifesteal: 0.10, hazardResist: 0.20 },
      passiveName: "Toxic Symbiosis",
      passiveDesc: "Slaying foes restores 8% Max HP and detonates a toxic burst for 110% Spell Power."
    },
    geomancer: {
      id: "geomancer", name: "Aegis Geomancer", roleTitle: "Ascended Mystic", tier: "advanced", baseId: "warden", icon: "◈", color: "#7dd3fc", crest: "crown_crystal",
      costGold: 450, costRenown: 2,
      desc: "Elemental bastion virtually impervious to dungeon hazards and boss slams.",
      bonuses: { hpPct: 0.34, spellPct: 0.18, armor: 24, hazardResist: 0.28 },
      passiveName: "Tectonic Immunity",
      passiveDesc: "Purges 20% of dungeon hazards on kill and grants +25% Shield strength on [E]."
    }
  },

  RARITIES: {
    common: { id: "common", name: "Common", order: 1, statMult: 1.0,  substatCount: 1, color: "#b4c0d3", sellBase: 28,  salvageBase: 5,  dropWeight: 76.0 },
    rare:   { id: "rare",   name: "Rare",   order: 2, statMult: 1.28, substatCount: 2, color: "#38bdf8", sellBase: 82,  salvageBase: 14, dropWeight: 18.0 },
    epic:   { id: "epic",   name: "Epic",   order: 3, statMult: 1.65, substatCount: 3, color: "#c084fc", sellBase: 230, salvageBase: 36, dropWeight: 4.8 },
    mythic: { id: "mythic", name: "Mythic", order: 4, statMult: 2.15, substatCount: 4, color: "#ffae19", sellBase: 600, salvageBase: 98, dropWeight: 1.2 }
  },

  DIFFICULTIES: {
    normal:    { id: "normal",    name: "Normal",    hpMult: 1.0,  dmgMult: 1.0,  hazardMult: 1.0,  lootMult: 1.0, xpMult: 1.0, rarityLuck: 0.0,  renownFirstClear: 2, powerMult: 1.0 },
    nightmare: { id: "nightmare", name: "Nightmare", hpMult: 2.25, dmgMult: 1.7,  hazardMult: 1.3,  lootMult: 2.2, xpMult: 2.0, rarityLuck: 0.3,  renownFirstClear: 4, powerMult: 1.85 },
    abyssal:   { id: "abyssal",   name: "Abyssal",   hpMult: 4.8,  dmgMult: 2.75, hazardMult: 1.65, lootMult: 4.5, xpMult: 3.8, rarityLuck: 0.7,  renownFirstClear: 8, powerMult: 3.3 }
  },

  MUTATORS: [
    { id: "double_boss",    name: "Twin Guardians",       desc: "Final room spawns TWO bosses simultaneously (65% HP each).",        rewardBonus: 0.75, rarityLuck: 0.22, icon: "☠" },
    { id: "hyper_speed",    name: "Hyper-Speed Rift",     desc: "Enemies move & attack 35% faster; Hero gains +15% Move Speed.",     rewardBonus: 0.45, rarityLuck: 0.12, icon: "⚡" },
    { id: "meteor_shower",  name: "Astral Meteor Shower", desc: "Telegraphed burning meteors rain across combat rooms every 4.5s.",   rewardBonus: 0.55, rarityLuck: 0.15, icon: "☄" },
    { id: "glass_cannon",   name: "Shattered Veil",       desc: "All damage dealt by both Hero and Enemies is increased by +50%.",    rewardBonus: 0.50, rarityLuck: 0.14, icon: "⚔" },
    { id: "volatile_blood", name: "Volatile Blood",       desc: "Slain monsters erupt after 0.9s, dealing AoE blast damage.",         rewardBonus: 0.40, rarityLuck: 0.10, icon: "✹" }
  ],

  SANCTUARY: {
    size: 17,
    spawn: { x: 8.5, y: 8.5 },
    palette: {
      bgTop: "#0b101e", bgBottom: "#05070e",
      tileA: "#1d2740", tileB: "#172036", tileBorder: "#0d1322",
      wallTop: "#3b4963", wallLeft: "#232d42", wallRight: "#131926",
      chasm: "#060912", accent: "#38bdf8"
    },
    stations: [
      { id: "dungeon", name: "Rift Gate",    prompt: "Open Rift Gate",            x: 8.5,  y: 3.0,  radius: 2.0, color: "#38bdf8", glow: "rgba(56, 189, 248, 0.55)",  icon: "⚔", shape: "portal" },
      { id: "armory",  name: "Armory",       prompt: "Open Armory & Gear",        x: 3.4,  y: 7.2,  radius: 1.8, color: "#f59e0b", glow: "rgba(245, 158, 11, 0.48)",  icon: "🛡", shape: "pedestal" },
      { id: "forge",   name: "Blacksmith",   prompt: "Open Blacksmith Forge",     x: 13.6, y: 7.2,  radius: 1.8, color: "#f97316", glow: "rgba(249, 115, 22, 0.52)",  icon: "⚒", shape: "anvil" },
      { id: "guild",   name: "Guild Hall",   prompt: "Open Bounties & Blessings", x: 12.6, y: 12.8, radius: 1.8, color: "#a855f7", glow: "rgba(168, 85, 247, 0.48)",  icon: "♕", shape: "banner" },
      { id: "class",   name: "Class Shrine", prompt: "Open Class & Evolution",    x: 4.4,  y: 12.8, radius: 1.8, color: "#fde047", glow: "rgba(253, 224, 71, 0.48)",  icon: "✦", shape: "shrine" }
    ]
  },

  /* ------------------------------------------------------------------------
     8 THEMED DUNGEONS (2 Dedicated Gear Sets Per Class!)
     ------------------------------------------------------------------------ */
  DUNGEONS: [
    {
      id: "sunken_quarry", name: "Sunken Quarry", themeLabel: "Earth / Crystal", themeColor: "#38bdf8", dropClass: "vanguard",
      desc: "Flooded subterranean crystal mines choked with stagnant air and crystalline golems.",
      rooms: 4, recommendedPower: 280, baseGold: 135, baseShards: 12, baseXp: 145,
      hazard: {
        type: "oxygen", name: "Oxygen Reserve", icon: "◈", cssOverlay: "hazard-oxygen", barTheme: "",
        shortDesc: "Oxygen Pockets: Air drains slowly away from glowing crystal vents.",
        tip: "Stand inside glowing cyan crystal vents to refill Oxygen.",
        drainPerSec: 5.8, restorePerSec: 38.0, suffocateDpsPct: 0.05
      },
      palette: {
        bgTop: "#091521", bgBottom: "#040a10", tileA: "#1b2e3d", tileB: "#152532", tileBorder: "#0c1721",
        wallTop: "#365870", wallLeft: "#1f374a", wallRight: "#12212e", pillarTop: "#38bdf8", chasm: "#071f33", accent: "#38bdf8"
      },
      enemies: ["crystal_crawler", "quarry_golem", "prism_slinger"],
      bossId: "obsidian_colossus",
      lootPool: ["seismic_hammer", "earthshaker_plate", "crystal_heart_relic"],
      lootSummary: ["Seismic Hammer", "Earthshaker Plate", "Crystal Heart Relic"]
    },
    {
      id: "cinder_foundry", name: "Cinder Foundry", themeLabel: "Fire / Clockwork", themeColor: "#f97316", dropClass: "shadowblade",
      desc: "Superheated dwarven blast furnaces suspended above molten slag rivers.",
      rooms: 4, recommendedPower: 480, baseGold: 260, baseShards: 22, baseXp: 285,
      hazard: {
        type: "heat", name: "Core Overheat", icon: "🔥", cssOverlay: "hazard-heat", barTheme: "theme-heat",
        shortDesc: "Overheat Meter: Standing still builds scorching heat; moving & dashing cools down.",
        tip: "Keep moving or dash to vent heat! At 100% you suffer burn damage.",
        idleHeatPerSec: 21.0, moveCoolPerSec: 28.0, dashCoolBurst: 36.0, burnDpsPct: 0.06
      },
      palette: {
        bgTop: "#1c0c09", bgBottom: "#0c0503", tileA: "#331d19", tileB: "#291613", tileBorder: "#170b09",
        wallTop: "#703929", wallLeft: "#4a2319", wallRight: "#2c140d", pillarTop: "#f97316", chasm: "#7c1d0a", accent: "#fb923c"
      },
      enemies: ["clockwork_hound", "slag_brutes", "ember_turret"],
      bossId: "arch_forge_automaton",
      lootPool: ["blaze_chakrams", "forgelord_mail", "furnace_core_relic"],
      lootSummary: ["Blaze Chakrams", "Forge-Lord Mail", "Furnace Core Relic"]
    },
    {
      id: "whispering_marsh", name: "Whispering Marsh", themeLabel: "Poison / Bio", themeColor: "#22c55e", dropClass: "warden",
      desc: "Bioluminescent fungal wetlands linked by moss bridges over toxic bogs.",
      rooms: 5, recommendedPower: 760, baseGold: 460, baseShards: 38, baseXp: 510,
      hazard: {
        type: "poison", name: "Toxin Exposure", icon: "☣", cssOverlay: "hazard-poison", barTheme: "theme-poison",
        shortDesc: "Toxic Spores: Expanding venom pools erupt across the floor; avoid or out-heal them.",
        tip: "Dodge expanding green spore pools or use Lifesteal / Survival Flasks.",
        poolSpawnInterval: 4.2, poolMaxRadius: 2.35, toxinGainInPool: 34.0, toxinDecayPerSec: 20.0, poisonDpsPct: 0.058
      },
      palette: {
        bgTop: "#091912", bgBottom: "#040b08", tileA: "#162d22", tileB: "#11241b", tileBorder: "#09140f",
        wallTop: "#2f5e44", wallLeft: "#1b3b29", wallRight: "#0f2117", pillarTop: "#4ade80", chasm: "#0b361a", accent: "#22c55e"
      },
      enemies: ["spore_stalker", "mire_hulk", "blight_spitter"],
      bossId: "mycelial_matriarch",
      lootPool: ["sporeburst_staff", "venomweaver_shroud", "emerald_gland_relic"],
      lootSummary: ["Spore-Burst Staff", "Venom-Weaver Shroud", "Emerald Bloom Relic"]
    },
    {
      id: "astral_observatory", name: "Astral Observatory", themeLabel: "Void / Gravity", themeColor: "#c084fc", dropClass: "arcanist",
      desc: "A shattered celestial spire suspended over a void where gravity flips every 15s.",
      rooms: 5, recommendedPower: 1150, baseGold: 810, baseShards: 68, baseXp: 940,
      hazard: {
        type: "gravity", name: "Gravity Phase", icon: "✦", cssOverlay: "hazard-gravity", barTheme: "theme-gravity",
        shortDesc: "Gravity Shifts: Alternates every 15s between Low-G (+35% Speed) and Heavy-G (+35% Damage, -20% Speed).",
        tip: "Exploit Low-G to reposition and Heavy-G to unleash massive Q/E burst.",
        cycleSeconds: 15.0, lowGSpeedBonus: 0.35, heavyGDmgBonus: 0.35, heavyGSpeedPenalty: 0.20
      },
      palette: {
        bgTop: "#110a20", bgBottom: "#06030d", tileA: "#21163a", tileB: "#19102e", tileBorder: "#0e081a",
        wallTop: "#573a91", wallLeft: "#35215c", wallRight: "#1e1236", pillarTop: "#e879f9", chasm: "#090314", accent: "#c084fc"
      },
      enemies: ["void_wraith", "astral_sentinel", "pulsar_orb"],
      bossId: "chronos_archon",
      lootPool: ["nova_grimoire", "starlight_vestments", "singularity_prism_relic"],
      lootSummary: ["Nova Grimoire", "Starlight Vestments", "Singularity Prism"]
    },
    {
      id: "frostbite_sanctum", name: "Frostbite Sanctum", themeLabel: "Ice / Glacial", themeColor: "#7dd3fc", dropClass: "vanguard",
      desc: "A frozen citadel swept by sub-zero blizzards that numb limbs away from warming braziers.",
      rooms: 5, recommendedPower: 1750, baseGold: 1380, baseShards: 112, baseXp: 1680,
      hazard: {
        type: "frost", name: "Hypothermia", icon: "❄", cssOverlay: "hazard-frost", barTheme: "theme-frost",
        shortDesc: "Hypothermia Chill: Frost stacks up away from Fire Braziers, slowing speed & dealing frostbite.",
        tip: "Warm up near glowing orange Fire Braziers to thaw Hypothermia.",
        chillPerSec: 10.5, thawPerSec: 42.0, frostDpsPct: 0.06
      },
      palette: {
        bgTop: "#091b2b", bgBottom: "#040b14", tileA: "#1e3a52", tileB: "#172e42", tileBorder: "#0d1b29",
        wallTop: "#67b7e6", wallLeft: "#2c5a80", wallRight: "#17344d", pillarTop: "#bae6fd", chasm: "#061b2e", accent: "#7dd3fc"
      },
      enemies: ["frost_wolf", "glacial_juggernaut", "icicle_weaver"],
      bossId: "valkyr_frost_warden",
      lootPool: ["permafrost_halberd", "glacierguard_plate", "hearthstone_relic"],
      lootSummary: ["Permafrost Halberd", "Glacier-Guard Plate", "Eternal Hearthstone"]
    },
    {
      id: "abyssal_throne", name: "Abyssal Throne", themeLabel: "Shadow / Eclipse", themeColor: "#e879f9", dropClass: "warden",
      desc: "The heart of the Rift where encroaching eclipse corruption tests ascended champions.",
      rooms: 6, recommendedPower: 2600, baseGold: 2450, baseShards: 195, baseXp: 3000,
      hazard: {
        type: "shadow", name: "Eclipse Corruption", icon: "☾", cssOverlay: "hazard-shadow", barTheme: "theme-shadow",
        shortDesc: "Eclipse Corruption: Darkness steadily corrupts your soul; touch Radiant Light Orbs to purge it.",
        tip: "Collect floating golden Light Orbs in the arena to purge Eclipse Corruption.",
        corruptPerSec: 8.8, orbPurgeAmount: 52.0, corruptDpsPct: 0.065
      },
      palette: {
        bgTop: "#14071c", bgBottom: "#06020a", tileA: "#241133", tileB: "#1b0c26", tileBorder: "#0e0514",
        wallTop: "#6b21a8", wallLeft: "#3b0764", wallRight: "#1e0533", pillarTop: "#f0abfc", chasm: "#12031f", accent: "#e879f9"
      },
      enemies: ["abyssal_stalker", "dread_knight", "eclipse_acolyte"],
      bossId: "malakor_sovereign",
      lootPool: ["soulreaver_scythe", "eclipselord_regalia", "dawnbreaker_sigil_relic"],
      lootSummary: ["Soul-Reaver Scythe", "Eclipse-Lord Regalia", "Dawnbreaker Sigil"]
    },
    {
      id: "stormspire_citadel", name: "Stormspire Citadel", themeLabel: "Storm / Lightning", themeColor: "#38bdf8", dropClass: "shadowblade",
      desc: "A cloud-piercing sky fortress lashed by perpetual thunderbolts and living arc-constructs.",
      rooms: 6, recommendedPower: 3750, baseGold: 4100, baseShards: 320, baseXp: 5100,
      hazard: {
        type: "storm", name: "Static Overload", icon: "⚡", cssOverlay: "hazard-storm", barTheme: "theme-storm",
        shortDesc: "Static Overload: Storm charge builds up; stand near Copper Conduits or Dash to discharge before 100%.",
        tip: "Discharge static at glowing Copper Conduits or by Dashing before a bolt strikes you!",
        chargePerSec: 12.5, dischargePerSec: 46.0, dashDischarge: 28.0, strikeDmgPct: 0.24
      },
      palette: {
        bgTop: "#0a162b", bgBottom: "#050914", tileA: "#1b2b4a", tileB: "#15223b", tileBorder: "#0c1424",
        wallTop: "#38bdf8", wallLeft: "#1e3a6e", wallRight: "#112242", pillarTop: "#fde047", chasm: "#071329", accent: "#38bdf8"
      },
      enemies: ["volt_imp", "thunder_colossus", "arc_pylon"],
      bossId: "raijin_tempest",
      lootPool: ["volt_twinblades", "stormcaller_plate", "thunderheart_relic"],
      lootSummary: ["Volt-Reaver Twinblades", "Stormcaller Plate", "Thunderheart Core"]
    },
    {
      id: "celestial_crucible", name: "Celestial Crucible", themeLabel: "Radiant / Primordial", themeColor: "#fde047", dropClass: "arcanist",
      desc: "The golden apex of the Gate where blinding solar flares incinerate all outside Umbral Wards.",
      rooms: 6, recommendedPower: 5300, baseGold: 6800, baseShards: 520, baseXp: 8600,
      hazard: {
        type: "solar", name: "Solar Flare Charge", icon: "☀", cssOverlay: "hazard-solar", barTheme: "theme-solar",
        shortDesc: "Solar Flare: Every 14s a searing sun-wave sweeps the arena. Shelter inside purple Umbral Wards!",
        tip: "Step inside glowing purple Umbral Wards before Solar Charge hits 100%!",
        cycleSeconds: 14.0, flareDmgPct: 0.34
      },
      palette: {
        bgTop: "#241908", bgBottom: "#100a03", tileA: "#3d2f18", tileB: "#302412", tileBorder: "#1c1409",
        wallTop: "#f59e0b", wallLeft: "#854d0e", wallRight: "#451a03", pillarTop: "#fef08a", chasm: "#1c1204", accent: "#fde047"
      },
      enemies: ["seraph_lancer", "radiant_warden", "prism_cherub"],
      bossId: "solarius_architect",
      lootPool: ["dawnstar_greatsword", "seraphic_aegis", "infinity_hourglass_relic"],
      lootSummary: ["Dawnstar Greatsword", "Seraphic Aegis", "Infinity Hourglass"]
    }
  ],

  ENEMIES: {
    crystal_crawler:    { id: "crystal_crawler",    name: "Crystal Crawler",    hp: 85,   atk: 14,  speed: 3.1, range: 1.05, attackCd: 1.15, radius: 0.42, height: 0.65, ai: "chaser",  color: "#38bdf8", trim: "#bae6fd", gold: 14,  xp: 18 },
    quarry_golem:       { id: "quarry_golem",       name: "Quarry Golem",       hp: 160,  atk: 24,  speed: 1.9, range: 1.35, attackCd: 1.8,  radius: 0.56, height: 1.15, ai: "bruiser", color: "#64748b", trim: "#38bdf8", gold: 25,  xp: 30 },
    prism_slinger:      { id: "prism_slinger",      name: "Prism Slinger",      hp: 75,   atk: 18,  speed: 2.3, range: 5.6,  attackCd: 2.0,  radius: 0.4,  height: 0.9,  ai: "ranged",  projColor: "#7dd3fc", projSpeed: 6.4, color: "#0ea5e9", trim: "#e0f2fe", gold: 19,  xp: 24 },

    clockwork_hound:    { id: "clockwork_hound",    name: "Clockwork Hound",    hp: 165,  atk: 26,  speed: 3.7, range: 1.05, attackCd: 0.98, radius: 0.42, height: 0.65, ai: "chaser",  color: "#d97706", trim: "#fef08a", gold: 28,  xp: 35 },
    slag_brutes:        { id: "slag_brutes",        name: "Slag Automaton",     hp: 315,  atk: 40,  speed: 2.1, range: 1.4,  attackCd: 1.75, radius: 0.6,  height: 1.25, ai: "bruiser", color: "#9a3412", trim: "#fb923c", gold: 44,  xp: 52 },
    ember_turret:       { id: "ember_turret",       name: "Ember Artificer",    hp: 148,  atk: 32,  speed: 2.2, range: 6.2,  attackCd: 1.85, radius: 0.44, height: 0.95, ai: "ranged",  projColor: "#f97316", projSpeed: 7.2, color: "#ea580c", trim: "#fde68a", gold: 34,  xp: 42 },

    spore_stalker:      { id: "spore_stalker",      name: "Spore Stalker",      hp: 300,  atk: 46,  speed: 3.5, range: 1.1,  attackCd: 1.0,  radius: 0.44, height: 0.85, ai: "chaser",  color: "#15803d", trim: "#86efac", gold: 52,  xp: 65 },
    mire_hulk:          { id: "mire_hulk",          name: "Mire Hulk",          hp: 560,  atk: 64,  speed: 2.0, range: 1.45, attackCd: 1.8,  radius: 0.62, height: 1.35, ai: "bruiser", color: "#14532d", trim: "#a3e635", gold: 76,  xp: 92 },
    blight_spitter:     { id: "blight_spitter",     name: "Blight Spitter",     hp: 265,  atk: 54,  speed: 2.35,range: 6.4,  attackCd: 1.8,  radius: 0.44, height: 0.95, ai: "ranged",  projColor: "#84cc16", projSpeed: 7.0, color: "#4d7c0f", trim: "#d9f99d", gold: 60,  xp: 75 },

    void_wraith:        { id: "void_wraith",        name: "Void Wraith",        hp: 540,  atk: 78,  speed: 3.9, range: 1.15, attackCd: 0.96, radius: 0.44, height: 1.05, ai: "chaser",  color: "#7e22ce", trim: "#f0abfc", gold: 92,  xp: 120 },
    astral_sentinel:    { id: "astral_sentinel",    name: "Astral Sentinel",    hp: 980,  atk: 105, speed: 2.3, range: 1.5,  attackCd: 1.7,  radius: 0.64, height: 1.45, ai: "bruiser", color: "#4c1d95", trim: "#38bdf8", gold: 135, xp: 168 },
    pulsar_orb:         { id: "pulsar_orb",         name: "Pulsar Construct",   hp: 470,  atk: 92,  speed: 2.6, range: 6.8,  attackCd: 1.65, radius: 0.45, height: 1.0,  ai: "ranged",  projColor: "#e879f9", projSpeed: 7.8, color: "#a21caf", trim: "#fde047", gold: 110, xp: 138 },

    frost_wolf:         { id: "frost_wolf",         name: "Rime Direwolf",      hp: 880,  atk: 124, speed: 4.1, range: 1.15, attackCd: 0.92, radius: 0.44, height: 0.85, ai: "chaser",  color: "#0284c7", trim: "#e0f2fe", gold: 160, xp: 205 },
    glacial_juggernaut: { id: "glacial_juggernaut", name: "Glacial Juggernaut", hp: 1620, atk: 165, speed: 2.15,range: 1.5,  attackCd: 1.7,  radius: 0.66, height: 1.5,  ai: "bruiser", color: "#1e3a8a", trim: "#7dd3fc", gold: 230, xp: 280 },
    icicle_weaver:      { id: "icicle_weaver",      name: "Icicle Weaver",      hp: 780,  atk: 142, speed: 2.5, range: 7.0,  attackCd: 1.6,  radius: 0.44, height: 1.0,  ai: "ranged",  projColor: "#bae6fd", projSpeed: 8.4, color: "#0369a1", trim: "#f0f9ff", gold: 185, xp: 230 },

    abyssal_stalker:    { id: "abyssal_stalker",    name: "Eclipse Fiend",      hp: 1450, atk: 200, speed: 4.3, range: 1.2,  attackCd: 0.9,  radius: 0.46, height: 1.1,  ai: "chaser",  color: "#581c87", trim: "#f43f5e", gold: 280, xp: 345 },
    dread_knight:       { id: "dread_knight",       name: "Abyssal Dreadknight",hp: 2680, atk: 258, speed: 2.45,range: 1.55, attackCd: 1.6,  radius: 0.68, height: 1.55, ai: "bruiser", color: "#1e1b4b", trim: "#e879f9", gold: 390, xp: 475 },
    eclipse_acolyte:    { id: "eclipse_acolyte",    name: "Eclipse Acolyte",    hp: 1320, atk: 228, speed: 2.7, range: 7.2,  attackCd: 1.55, radius: 0.45, height: 1.05, ai: "ranged",  projColor: "#f43f5e", projSpeed: 8.8, color: "#831843", trim: "#fda4af", gold: 320, xp: 385 },

    volt_imp:           { id: "volt_imp",           name: "Volt Spark-Imp",     hp: 2350, atk: 295, speed: 4.6, range: 1.2,  attackCd: 0.85, radius: 0.44, height: 0.95, ai: "chaser",  color: "#0284c7", trim: "#fde047", gold: 460, xp: 560 },
    thunder_colossus:   { id: "thunder_colossus",   name: "Thunder Automaton",  hp: 4300, atk: 375, speed: 2.55,range: 1.6,  attackCd: 1.55, radius: 0.7,  height: 1.6,  ai: "bruiser", color: "#1e3a8a", trim: "#38bdf8", gold: 640, xp: 780 },
    arc_pylon:          { id: "arc_pylon",          name: "Arc Conduit",        hp: 2150, atk: 335, speed: 2.8, range: 7.6,  attackCd: 1.45, radius: 0.46, height: 1.15, ai: "ranged",  projColor: "#fde047", projSpeed: 9.6, color: "#0369a1", trim: "#fef08a", gold: 520, xp: 630 },

    seraph_lancer:      { id: "seraph_lancer",      name: "Seraph Lancer",      hp: 3800, atk: 425, speed: 4.7, range: 1.35, attackCd: 0.82, radius: 0.46, height: 1.2,  ai: "chaser",  color: "#b45309", trim: "#fef08a", gold: 760, xp: 920 },
    radiant_warden:     { id: "radiant_warden",     name: "Radiant Templar",    hp: 6900, atk: 540, speed: 2.65,range: 1.65, attackCd: 1.5,  radius: 0.72, height: 1.68, ai: "bruiser", color: "#78350f", trim: "#fde047", gold: 1050,xp: 1280 },
    prism_cherub:       { id: "prism_cherub",       name: "Solar Cherub",       hp: 3450, atk: 480, speed: 3.0, range: 7.8,  attackCd: 1.4,  radius: 0.46, height: 1.15, ai: "ranged",  projColor: "#fef08a", projSpeed: 10.2,color: "#d97706", trim: "#ffffff", gold: 860, xp: 1040 }
  },

  BOSSES: {
    obsidian_colossus:    { id: "obsidian_colossus",    name: "Obsidian Colossus",         subtitle: "Warden of the Sunken Vein",       hp: 1050,  atk: 36,  speed: 2.1,  radius: 0.95, height: 2.1,  color: "#1e293b", trim: "#38bdf8", gold: 210,   shards: 18,  xp: 260,   patterns: [ { type: "slam_circle", name: "Seismic Crush", telegraph: 1.15, radius: 2.8, dmgMult: 1.45, cooldown: 3.4 }, { type: "line_charge", name: "Quarry Bullrush", telegraph: 1.0, width: 1.6, length: 8.5, dmgMult: 1.35, cooldown: 4.0 }, { type: "triple_drop", name: "Crystal Barrage", telegraph: 1.1, radius: 1.8, count: 4, dmgMult: 1.15, cooldown: 3.6 } ] },
    arch_forge_automaton: { id: "arch_forge_automaton", name: "Ignis Prime",               subtitle: "Arch-Forge Automaton",            hp: 2300,  atk: 60,  speed: 2.5,  radius: 0.98, height: 2.15, color: "#7c2d12", trim: "#facc15", gold: 420,   shards: 34,  xp: 510,   patterns: [ { type: "ring_nova", name: "Smelter Ring", telegraph: 1.15, innerRadius: 1.8, outerRadius: 5.2, dmgMult: 1.45, cooldown: 3.3 }, { type: "cross_beam", name: "Crucible Crossfire", telegraph: 1.2, width: 1.35, length: 10.0, dmgMult: 1.55, cooldown: 3.8 }, { type: "line_charge", name: "Piston Overdrive", telegraph: 0.95, width: 1.7, length: 9.2, dmgMult: 1.35, cooldown: 3.2 } ] },
    mycelial_matriarch:   { id: "mycelial_matriarch",   name: "Vespera the Rot-Queen",     subtitle: "Mycelial Matriarch",              hp: 4600,  atk: 92,  speed: 2.4,  radius: 1.05, height: 2.25, color: "#14532d", trim: "#a3e635", gold: 740,   shards: 58,  xp: 920,   patterns: [ { type: "triple_drop", name: "Venom Cluster", telegraph: 1.05, radius: 2.1, count: 5, dmgMult: 1.25, cooldown: 3.0, leavesPoison: true }, { type: "slam_circle", name: "Spore Detonation", telegraph: 1.1, radius: 3.6, dmgMult: 1.6, cooldown: 3.6 }, { type: "radial_volley", name: "Thorn Spiral", telegraph: 0.95, count: 12, dmgMult: 1.1, cooldown: 3.1 } ] },
    chronos_archon:       { id: "chronos_archon",       name: "Aethelgard, Star-Eater",    subtitle: "Chronos Archon of the Singularity", hp: 8800, atk: 142, speed: 2.8,  radius: 1.05, height: 2.35, color: "#3b0764", trim: "#f0abfc", gold: 1380,  shards: 105, xp: 1850,  patterns: [ { type: "cross_beam", name: "Event Horizon Beams", telegraph: 1.15, width: 1.4, length: 11.0, dmgMult: 1.7, cooldown: 3.2 }, { type: "ring_nova", name: "Gravity Collapse", telegraph: 1.1, innerRadius: 2.0, outerRadius: 5.8, dmgMult: 1.6, cooldown: 3.3 }, { type: "triple_drop", name: "Supernova Rain", telegraph: 1.0, radius: 2.1, count: 6, dmgMult: 1.35, cooldown: 2.9 }, { type: "radial_volley", name: "Astral Barrage", telegraph: 0.85, count: 14, dmgMult: 1.2, cooldown: 2.8 } ] },
    valkyr_frost_warden:  { id: "valkyr_frost_warden",  name: "Valkyr, Frost-Warden",      subtitle: "Sovereign of the Glacial Spire",  hp: 15500, atk: 215, speed: 2.9,  radius: 1.08, height: 2.4,  color: "#0c4a6e", trim: "#bae6fd", gold: 2450,  shards: 180, xp: 3300,  patterns: [ { type: "ring_nova", name: "Absolute Zero Ring", telegraph: 1.05, innerRadius: 1.9, outerRadius: 6.0, dmgMult: 1.65, cooldown: 3.0 }, { type: "line_charge", name: "Glacial Lance", telegraph: 0.88, width: 1.7, length: 10.5, dmgMult: 1.55, cooldown: 3.0 }, { type: "triple_drop", name: "Avalanche Shards", telegraph: 0.95, radius: 2.2, count: 6, dmgMult: 1.4, cooldown: 2.8 }, { type: "radial_volley", name: "Blizzard Fan", telegraph: 0.85, count: 16, dmgMult: 1.25, cooldown: 2.7 } ] },
    malakor_sovereign:    { id: "malakor_sovereign",    name: "Malakor, Rift Sovereign",   subtitle: "Emperor of the Abyssal Throne",   hp: 27000, atk: 310, speed: 3.1,  radius: 1.15, height: 2.55, color: "#2e1065", trim: "#f43f5e", gold: 4200,  shards: 310, xp: 5800,  patterns: [ { type: "cross_beam", name: "Eclipse Cataclysm", telegraph: 1.05, width: 1.5, length: 11.5, dmgMult: 1.75, cooldown: 2.9 }, { type: "slam_circle", name: "Abyssal Judgment", telegraph: 1.0, radius: 4.0, dmgMult: 1.7, cooldown: 3.1 }, { type: "triple_drop", name: "Soulfire Rain", telegraph: 0.92, radius: 2.2, count: 7, dmgMult: 1.45, cooldown: 2.7 }, { type: "radial_volley", name: "Shadow Annihilation", telegraph: 0.82, count: 18, dmgMult: 1.3, cooldown: 2.5 } ] },
    raijin_tempest:       { id: "raijin_tempest",       name: "Raijin, Storm Sovereign",   subtitle: "Lord of the Stormspire",          hp: 46000, atk: 430, speed: 3.35, radius: 1.15, height: 2.55, color: "#0c4a6e", trim: "#fde047", gold: 7200,  shards: 520, xp: 9800,  patterns: [ { type: "cross_beam", name: "Tempest Grid", telegraph: 0.95, width: 1.55, length: 12.0, dmgMult: 1.8, cooldown: 2.7 }, { type: "line_charge", name: "Lightning Flash", telegraph: 0.78, width: 1.8, length: 11.5, dmgMult: 1.65, cooldown: 2.6 }, { type: "triple_drop", name: "Thunderbolt Barrage", telegraph: 0.88, radius: 2.3, count: 7, dmgMult: 1.5, cooldown: 2.5 }, { type: "radial_volley", name: "Static Nova", telegraph: 0.8, count: 18, dmgMult: 1.35, cooldown: 2.5 } ] },
    solarius_architect:   { id: "solarius_architect",   name: "Solarius, Eternal Architect",subtitle: "Apex of the Celestial Crucible", hp: 76000, atk: 580, speed: 3.4,  radius: 1.25, height: 2.7,  color: "#78350f", trim: "#fef08a", gold: 12500, shards: 880, xp: 16500, patterns: [ { type: "ring_nova", name: "Corona Collapse", telegraph: 0.95, innerRadius: 2.2, outerRadius: 6.8, dmgMult: 1.85, cooldown: 2.7 }, { type: "cross_beam", name: "Divine Judgment", telegraph: 0.95, width: 1.65, length: 13.0, dmgMult: 1.9, cooldown: 2.7 }, { type: "triple_drop", name: "Sunfire Pillars", telegraph: 0.85, radius: 2.4, count: 8, dmgMult: 1.55, cooldown: 2.5 }, { type: "radial_volley", name: "Starlight Halo", telegraph: 0.78, count: 20, dmgMult: 1.4, cooldown: 2.4 } ] }
  },

  SKILLS: {
    iron_cleave:         { id: "iron_cleave",         name: "Whirl Cleave",      icon: "⚔", cooldown: 4.5,  type: "aoe_melee",      animType: "whirl_slash",     heroAnim: "spin",  radius: 2.9, atkMult: 2.15, spellMult: 0.45, color: "#e2e8f0", desc: "Spin 360° with twin steel arcs, dealing 215% ATK to all nearby foes." },
    seismic_shatter:     { id: "seismic_shatter",     name: "Seismic Slam",      icon: "⛰", cooldown: 5.5,  type: "shockwave",      animType: "seismic_pillars", heroAnim: "slam",  radius: 3.8, atkMult: 2.75, spellMult: 0.55, stunDuration: 1.5, color: "#38bdf8", desc: "Leap and shatter the earth with 8 crystal spires for 275% ATK + 1.5s Stun." },
    inferno_ring:        { id: "inferno_ring",        name: "Blaze Orbit",       icon: "✴", cooldown: 4.8,  type: "proj_fan",       animType: "flame_nova",      heroAnim: "spin",  count: 8, range: 7.5, atkMult: 1.55, spellMult: 0.8, guaranteedCrit: true, color: "#fb923c", desc: "Hurl 8 flaming chakrams outward; guaranteed Crits for 155% ATK + 80% Spell." },
    spore_eruption:      { id: "spore_eruption",      name: "Spore Nova",        icon: "✹", cooldown: 5.2,  type: "drain_nova",     animType: "spore_geysers",   heroAnim: "raise", radius: 3.9, atkMult: 0.75, spellMult: 2.45, healPctDmg: 0.25, color: "#4ade80", desc: "Erupt toxic geysers for 245% Spell damage and heal for 25% of damage dealt." },
    starfall_cataclysm:  { id: "starfall_cataclysm",  name: "Starfall",          icon: "✦", cooldown: 5.6,  type: "meteor_cluster", animType: "starfall_beams",  heroAnim: "raise", count: 5, radius: 2.5, atkMult: 0.5, spellMult: 2.95, color: "#e879f9", desc: "Call down 5 astral laser meteors on foes, each dealing 295% Spell Power." },
    glacial_tempest:     { id: "glacial_tempest",     name: "Glacial Impale",    icon: "❄", cooldown: 5.4,  type: "shockwave",      animType: "ice_spikes",      heroAnim: "slam",  radius: 4.2, atkMult: 2.85, spellMult: 1.05, stunDuration: 1.8, color: "#7dd3fc", desc: "Erupt concentric permafrost spires for 285% ATK + 105% Spell and freeze foes for 1.8s." },
    abyssal_reap:        { id: "abyssal_reap",        name: "Soul Harvest",      icon: "☾", cooldown: 5.0,  type: "drain_nova",     animType: "shadow_scythes",  heroAnim: "spin",  radius: 4.3, atkMult: 2.4,  spellMult: 2.4,  healPctDmg: 0.28, color: "#f43f5e", desc: "Sweep colossal eclipse scythes for 240% ATK + 240% Spell and siphon 28% life." },
    thunderstep_barrage: { id: "thunderstep_barrage", name: "Thunderstep",       icon: "⚡", cooldown: 4.8,  type: "chain_barrage",  animType: "thunder_web",     heroAnim: "spin",  count: 6, radius: 6.5, atkMult: 2.75, spellMult: 1.9, guaranteedCrit: true, color: "#38bdf8", desc: "Unleash 6 guaranteed-Crit lightning strikes jumping across the arena for 275% ATK + 190% Spell." },
    celestial_cleave:    { id: "celestial_cleave",    name: "Dawnbreaker Blade", icon: "☀", cooldown: 5.5,  type: "shockwave",      animType: "sky_greatsword",  heroAnim: "slam",  radius: 4.8, atkMult: 3.4,  spellMult: 2.8, stunDuration: 1.6, color: "#fde047", desc: "Summon a colossal golden greatsword from the heavens for 340% ATK + 280% Spell + Stun." },

    sanctuary_aegis:     { id: "sanctuary_aegis",     name: "Gate Aegis",        icon: "🛡", cooldown: 9.0,  type: "shield_buff",    animType: "aegis_dome",      heroAnim: "raise", shieldPctHp: 0.30, duration: 5.0, color: "#60a5fa", desc: "Weave a protective barrier equal to 30% of your Max HP for 5s." },
    crystal_bastion:     { id: "crystal_bastion",     name: "Crystal Ward",      icon: "◈", cooldown: 10.0, type: "shield_cleanse", animType: "crystal_cage",    heroAnim: "raise", shieldPctHp: 0.42, hazardRestore: 55, duration: 6.0, color: "#38bdf8", desc: "Gain a 42% Max HP crystalline shield and purge 55% of active dungeon hazards." },
    overclock_surge:     { id: "overclock_surge",     name: "Overclock",         icon: "⚡", cooldown: 10.5, type: "haste_buff",     animType: "lightning_surge", heroAnim: "raise", speedBonus: 0.38, atkSpeedBonus: 0.48, critBonus: 0.22, duration: 6.0, color: "#f97316", desc: "+48% Attack Speed, +22% Crit Chance, and +38% Move Speed for 6s." },
    venom_bloom:         { id: "venom_bloom",         name: "Bio-Regen",         icon: "❦", cooldown: 9.5,  type: "heal_pulse",     animType: "verdant_bloom",   heroAnim: "raise", healPctHp: 0.35, radius: 3.5, spellMult: 1.8, color: "#22c55e", desc: "Restore 35% Max HP, purge hazards, and lash nearby foes for 180% Spell." },
    singularity_rift:    { id: "singularity_rift",    name: "Void Vortex",       icon: "◎", cooldown: 11.0, type: "vortex_pull",    animType: "black_hole",      heroAnim: "raise", radius: 5.0, spellMult: 2.85, shieldPctHp: 0.25, color: "#c084fc", desc: "Pull enemies inward for 285% Spell damage and gain a 25% HP barrier." },
    solar_hearth:        { id: "solar_hearth",        name: "Hearth Nova",       icon: "☀", cooldown: 10.0, type: "shield_cleanse", animType: "solar_flare",     heroAnim: "raise", shieldPctHp: 0.48, hazardRestore: 75, duration: 6.5, color: "#fde047", desc: "48% Max HP shield and purges 75% Hypothermia/dungeon hazards." },
    dawnbreaker_burst:   { id: "dawnbreaker_burst",   name: "Eclipse Purge",     icon: "✹", cooldown: 10.5, type: "heal_pulse",     animType: "radiant_pillar",  heroAnim: "raise", healPctHp: 0.42, radius: 4.5, spellMult: 3.1, color: "#f0abfc", desc: "Heals 42% HP, purges Eclipse Corruption, and blasts foes for 310% Spell." },
    tempest_overdrive:   { id: "tempest_overdrive",   name: "Storm Orbit",       icon: "⚡", cooldown: 10.5, type: "haste_storm",    animType: "storm_orbit",     heroAnim: "raise", speedBonus: 0.42, atkSpeedBonus: 0.52, critBonus: 0.25, shieldPctHp: 0.32, radius: 4.6, spellMult: 2.6, duration: 6.5, color: "#38bdf8", desc: "Summon a crackling Storm Shield (+32% HP, +52% Atk Spd) and zap all foes for 260% Spell." },
    chrono_sanctuary:    { id: "chrono_sanctuary",    name: "Time Freeze",       icon: "⌛", cooldown: 12.0, type: "time_freeze",    animType: "chrono_clock",    heroAnim: "raise", healPctHp: 0.38, shieldPctHp: 0.45, stunDuration: 2.4, radius: 7.5, spellMult: 3.2, color: "#fde047", desc: "Freeze all foes in time for 2.4s, deal 320% Spell, heal 38% HP & gain a 45% Shield." }
  },

  /* ------------------------------------------------------------------------
     GEAR TEMPLATES (Explicit classReq on Every Item)
     ------------------------------------------------------------------------ */
  GEAR_TEMPLATES: {
    // --- STARTER (All Classes) ---
    iron_blade:               { id: "iron_blade",               name: "Gatekeeper Blade",      slot: "weapon", classReq: "all",         setTag: "Starter",        weaponStyle: "sword",      icon: "⚔", attackType: "melee",       range: 2.1,  attackRate: 1.45, weaponColor: "#cbd5e1", trailColor: "#94a3b8", skillId: "iron_cleave",        baseStats: { atk: 18, spell: 6, crit: 0.03 }, desc: "Reliable forged steel blade issued to new Rift scouts." },
    traveler_tunic:           { id: "traveler_tunic",           name: "Scout's Mantle",        slot: "armor",  classReq: "all",         setTag: "Starter",        icon: "🛡", visuals: { body: "#334155", cloak: "#2563eb", trim: "#cbd5e1", aura: null }, baseStats: { hp: 85, armor: 8, speed: 0.15, hazardResist: 0.05 }, desc: "Stitched leather and ward-cloth built for swift reconnaissance." },
    cracked_waystone:         { id: "cracked_waystone",         name: "Sanctuary Waystone",    slot: "relic",  classReq: "all",         setTag: "Starter",        icon: "✦", skillId: "sanctuary_aegis", baseStats: { hp: 40, spell: 10, hazardResist: 0.05 }, desc: "Hums softly with defensive energy from the Sanctuary Gate." },

    // --- DUNGEON 1: SUNKEN QUARRY (Warrior / Vanguard Set) ---
    seismic_hammer:           { id: "seismic_hammer",           name: "Seismic Hammer",        slot: "weapon", classReq: "vanguard",    setTag: "Earthshaker",    weaponStyle: "hammer",     dungeonId: "sunken_quarry",      craftCost: 30,  icon: "🔨", attackType: "melee_heavy", range: 2.4,  attackRate: 1.2,  weaponColor: "#38bdf8", trailColor: "#7dd3fc", skillId: "seismic_shatter",    baseStats: { atk: 34, hp: 70, crit: 0.04 }, desc: "Massive crystal-bound maul that cleaves wide arcs and crushes armor." },
    earthshaker_plate:        { id: "earthshaker_plate",        name: "Earthshaker Plate",     slot: "armor",  classReq: "vanguard",    setTag: "Earthshaker",    dungeonId: "sunken_quarry",      craftCost: 30,  icon: "🛡", visuals: { body: "#1e3a5f", cloak: "#0284c7", trim: "#7dd3fc", aura: "rgba(56,189,248,0.28)" }, baseStats: { hp: 200, armor: 20, hazardResist: 0.16 }, desc: "Heavy quarry plate infused with oxygen-retaining crystal veins." },
    crystal_heart_relic:      { id: "crystal_heart_relic",      name: "Crystal Heart",         slot: "relic",  classReq: "vanguard",    setTag: "Earthshaker",    dungeonId: "sunken_quarry",      craftCost: 30,  icon: "◈", skillId: "crystal_bastion", baseStats: { hp: 115, atk: 12, hazardResist: 0.14 }, desc: "A resonant geode core that fortifies vitality and purifies dungeon air." },

    // --- DUNGEON 2: CINDER FOUNDRY (Rogue / Shadowblade Set) ---
    blaze_chakrams:           { id: "blaze_chakrams",           name: "Blaze Chakrams",        slot: "weapon", classReq: "shadowblade", setTag: "Forge-Lord",     weaponStyle: "chakram",    dungeonId: "cinder_foundry",     craftCost: 65,  icon: "✴", attackType: "ranged_proj", range: 5.8,  attackRate: 1.65, projSpeed: 11.0, projStyle: "chakram", weaponColor: "#f97316", trailColor: "#fde047", skillId: "inferno_ring",       baseStats: { atk: 44, crit: 0.10, speed: 0.30 }, desc: "Twin spinning razor furnace rings hurled at blistering speed." },
    forgelord_mail:           { id: "forgelord_mail",           name: "Forge-Lord Mail",       slot: "armor",  classReq: "shadowblade", setTag: "Forge-Lord",     dungeonId: "cinder_foundry",     craftCost: 65,  icon: "🔥", visuals: { body: "#7c2d12", cloak: "#ea580c", trim: "#facc15", aura: "rgba(249,115,22,0.3)" }, baseStats: { hp: 295, atk: 24, crit: 0.07, speed: 0.40, hazardResist: 0.16 }, desc: "Clockwork-vented battle armor engineered for agile critical strikers." },
    furnace_core_relic:       { id: "furnace_core_relic",       name: "Furnace Core",          slot: "relic",  classReq: "shadowblade", setTag: "Forge-Lord",     dungeonId: "cinder_foundry",     craftCost: 65,  icon: "⚙", skillId: "overclock_surge", baseStats: { hp: 95, atk: 24, crit: 0.08, cdr: 0.07 }, desc: "A pressurized brass turbine that supercharges reflexes on demand." },

    // --- DUNGEON 3: WHISPERING MARSH (Mystic / Warden Set) ---
    sporeburst_staff:         { id: "sporeburst_staff",         name: "Spore-Burst Staff",     slot: "weapon", classReq: "warden",      setTag: "Venom-Weaver",   weaponStyle: "staff",      dungeonId: "whispering_marsh",   craftCost: 120, icon: "🌿", attackType: "ranged_orb",  range: 6.2,  attackRate: 1.50, projSpeed: 9.8, projStyle: "orb", weaponColor: "#22c55e", trailColor: "#a3e635", skillId: "spore_eruption",     baseStats: { atk: 38, spell: 78, lifesteal: 0.06 }, desc: "Living mycelial staff firing volatile bio-orbs that siphon vitality." },
    venomweaver_shroud:       { id: "venomweaver_shroud",       name: "Venom-Weaver Shroud",   slot: "armor",  classReq: "warden",      setTag: "Venom-Weaver",   dungeonId: "whispering_marsh",   craftCost: 120, icon: "☣", visuals: { body: "#14532d", cloak: "#16a34a", trim: "#bef264", aura: "rgba(34,197,94,0.3)" }, baseStats: { hp: 460, spell: 46, lifesteal: 0.05, hazardResist: 0.20 }, desc: "Symbiotic marsh-silk cloak that converts toxins into cellular regeneration." },
    emerald_gland_relic:      { id: "emerald_gland_relic",      name: "Emerald Bloom",         slot: "relic",  classReq: "warden",      setTag: "Venom-Weaver",   dungeonId: "whispering_marsh",   craftCost: 120, icon: "❦", skillId: "venom_bloom",     baseStats: { hp: 205, spell: 40, lifesteal: 0.05, hazardResist: 0.16 }, desc: "A pulsing floral core that blooms with restorative nectar in battle." },

    // --- DUNGEON 4: ASTRAL OBSERVATORY (Mage / Arcanist Set) ---
    nova_grimoire:            { id: "nova_grimoire",            name: "Nova Grimoire",         slot: "weapon", classReq: "arcanist",    setTag: "Starlight",      weaponStyle: "grimoire",   dungeonId: "astral_observatory", craftCost: 210, icon: "✦", attackType: "ranged_nova", range: 6.8,  attackRate: 1.55, projSpeed: 12.0, projStyle: "star", weaponColor: "#c084fc", trailColor: "#f0abfc", skillId: "starfall_cataclysm", baseStats: { atk: 56, spell: 134, crit: 0.10, cdr: 0.08 }, desc: "An unbound levitating tome firing piercing cosmic star-bolts." },
    starlight_vestments:      { id: "starlight_vestments",      name: "Starlight Vestments",   slot: "armor",  classReq: "arcanist",    setTag: "Starlight",      dungeonId: "astral_observatory", craftCost: 210, icon: "✧", visuals: { body: "#3b0764", cloak: "#7e22ce", trim: "#f5d0fe", aura: "rgba(192,132,252,0.36)" }, baseStats: { hp: 690, spell: 86, crit: 0.08, cdr: 0.08, speed: 0.40, hazardResist: 0.22 }, desc: "Celestial robes stitched from compressed nebula threads." },
    singularity_prism_relic:  { id: "singularity_prism_relic",  name: "Singularity Prism",     slot: "relic",  classReq: "arcanist",    setTag: "Starlight",      dungeonId: "astral_observatory", craftCost: 210, icon: "◎", skillId: "singularity_rift",baseStats: { hp: 330, spell: 80, crit: 0.08, cdr: 0.10 }, desc: "A miniature black hole trapped in glass that bends spacetime around foes." },

    // --- DUNGEON 5: FROSTBITE SANCTUM (Warrior / Vanguard Set) ---
    permafrost_halberd:       { id: "permafrost_halberd",       name: "Permafrost Halberd",    slot: "weapon", classReq: "vanguard",    setTag: "Glacier-Guard",  weaponStyle: "halberd",    dungeonId: "frostbite_sanctum",  craftCost: 340, icon: "❄", attackType: "melee_heavy", range: 2.75, attackRate: 1.45, weaponColor: "#7dd3fc", trailColor: "#e0f2fe", skillId: "glacial_tempest",    baseStats: { atk: 145, spell: 95, crit: 0.11, hp: 240 }, desc: "A towering glacial polearm that shatters frozen armor in wide sweeps." },
    glacierguard_plate:       { id: "glacierguard_plate",       name: "Glacier-Guard Plate",   slot: "armor",  classReq: "vanguard",    setTag: "Glacier-Guard",  dungeonId: "frostbite_sanctum",  craftCost: 340, icon: "🛡", visuals: { body: "#0c4a6e", cloak: "#0284c7", trim: "#e0f2fe", aura: "rgba(125,211,252,0.35)" }, baseStats: { hp: 1050, atk: 60, spell: 45, armor: 34, hazardResist: 0.28 }, desc: "Runed frost-forged armor lined with thermal phoenix wool." },
    hearthstone_relic:        { id: "hearthstone_relic",        name: "Eternal Hearthstone",   slot: "relic",  classReq: "vanguard",    setTag: "Glacier-Guard",  dungeonId: "frostbite_sanctum",  craftCost: 340, icon: "☀", skillId: "solar_hearth",    baseStats: { hp: 480, atk: 54, spell: 54, hazardResist: 0.24 }, desc: "Radiates unquenchable warmth that melts hypothermia and fortifies shields." },

    // --- DUNGEON 6: ABYSSAL THRONE (Mystic / Warden Set) ---
    soulreaver_scythe:        { id: "soulreaver_scythe",        name: "Soul-Reaver Scythe",    slot: "weapon", classReq: "warden",      setTag: "Eclipse-Lord",   weaponStyle: "scythe",     dungeonId: "abyssal_throne",     craftCost: 520, icon: "☾", attackType: "melee_heavy", range: 2.95, attackRate: 1.65, weaponColor: "#f43f5e", trailColor: "#f0abfc", skillId: "abyssal_reap",       baseStats: { atk: 215, spell: 195, crit: 0.14, lifesteal: 0.07 }, desc: "Sovereign war-scythe forged from collapsed eclipse starlight." },
    eclipselord_regalia:      { id: "eclipselord_regalia",      name: "Eclipse-Lord Regalia",  slot: "armor",  classReq: "warden",      setTag: "Eclipse-Lord",   dungeonId: "abyssal_throne",     craftCost: 520, icon: "♛", visuals: { body: "#2e1065", cloak: "#9f1239", trim: "#fda4af", aura: "rgba(244,63,94,0.36)" }, baseStats: { hp: 1580, atk: 98, spell: 98, crit: 0.11, armor: 44, hazardResist: 0.30 }, desc: "Imperial Rift armor worn by the conquerors of the Abyssal Throne." },
    dawnbreaker_sigil_relic:  { id: "dawnbreaker_sigil_relic",  name: "Dawnbreaker Sigil",     slot: "relic",  classReq: "warden",      setTag: "Eclipse-Lord",   dungeonId: "abyssal_throne",     craftCost: 520, icon: "✹", skillId: "dawnbreaker_burst",baseStats: { hp: 740, atk: 84, spell: 112, cdr: 0.12, lifesteal: 0.06 }, desc: "A blinding celestial crest that banishes abyssal corruption." },

    // --- DUNGEON 7: STORMSPIRE CITADEL (Rogue / Shadowblade Set) ---
    volt_twinblades:          { id: "volt_twinblades",          name: "Volt-Reaver Twinblades",slot: "weapon", classReq: "shadowblade", setTag: "Stormcaller",    weaponStyle: "twinblades", dungeonId: "stormspire_citadel", craftCost: 780, icon: "⚡", attackType: "melee_wave",  range: 3.1,  attackRate: 2.15, projSpeed: 13.0, projStyle: "bolt", weaponColor: "#38bdf8", trailColor: "#fde047", skillId: "thunderstep_barrage", baseStats: { atk: 310, spell: 255, crit: 0.16, speed: 0.55 }, desc: "Crackling dual storm-blades that unleash rapid lightning arcs on every strike." },
    stormcaller_plate:        { id: "stormcaller_plate",        name: "Stormcaller Plate",     slot: "armor",  classReq: "shadowblade", setTag: "Stormcaller",    dungeonId: "stormspire_citadel", craftCost: 780, icon: "⚡", visuals: { body: "#0c4a6e", cloak: "#1d4ed8", trim: "#fde047", aura: "rgba(56,189,248,0.4)" }, baseStats: { hp: 2300, atk: 145, spell: 135, crit: 0.13, speed: 0.45, armor: 54, hazardResist: 0.32 }, desc: "Conductive sky-iron armor humming with supercharged voltage." },
    thunderheart_relic:       { id: "thunderheart_relic",       name: "Thunderheart Core",     slot: "relic",  classReq: "shadowblade", setTag: "Stormcaller",    dungeonId: "stormspire_citadel", craftCost: 780, icon: "✦", skillId: "tempest_overdrive", baseStats: { hp: 1080, atk: 130, spell: 145, crit: 0.12, cdr: 0.14 }, desc: "An eternal storm core that wraps its bearer in orbiting lightning." },

    // --- DUNGEON 8: CELESTIAL CRUCIBLE (Mage / Arcanist Set) ---
    dawnstar_greatsword:      { id: "dawnstar_greatsword",      name: "Dawnstar Greatsword",   slot: "weapon", classReq: "arcanist",    setTag: "Chrono-Seraph",  weaponStyle: "greatsword", dungeonId: "celestial_crucible", craftCost: 1150, icon: "☀", attackType: "melee_wave", range: 3.4,  attackRate: 1.75, projSpeed: 12.5, projStyle: "crescent", weaponColor: "#fde047", trailColor: "#ffffff", skillId: "celestial_cleave", baseStats: { atk: 465, spell: 390, crit: 0.18, lifesteal: 0.08 }, desc: "A titanic solar spellblade launching golden crescent shockwaves with every swing." },
    seraphic_aegis:           { id: "seraphic_aegis",           name: "Seraphic Aegis",        slot: "armor",  classReq: "arcanist",    setTag: "Chrono-Seraph",  dungeonId: "celestial_crucible", craftCost: 1150, icon: "☀", visuals: { body: "#78350f", cloak: "#d97706", trim: "#fef08a", aura: "rgba(253,224,71,0.42)" }, baseStats: { hp: 3350, atk: 210, spell: 210, crit: 0.14, armor: 68, cdr: 0.12, hazardResist: 0.36 }, desc: "Radiant primordial vestments forged at the dawn of the Rift Gate." },
    infinity_hourglass_relic: { id: "infinity_hourglass_relic", name: "Infinity Hourglass",    slot: "relic",  classReq: "arcanist",    setTag: "Chrono-Seraph",  dungeonId: "celestial_crucible", craftCost: 1150, icon: "⌛", skillId: "chrono_sanctuary", baseStats: { hp: 1600, atk: 185, spell: 225, cdr: 0.16, crit: 0.14 }, desc: "Halts the flow of time itself, freezing Rift Guardians in golden stasis." }
  },

  SUBSTAT_POOL: [
    { key: "crit",         label: "Crit Chance",        min: 0.015, max: 0.07,  isPct: true },
    { key: "lifesteal",    label: "Lifesteal",          min: 0.01,  max: 0.045, isPct: true },
    { key: "cdr",          label: "Cooldown Reduction", min: 0.025, max: 0.085, isPct: true },
    { key: "speed",        label: "Move Speed",         min: 0.15,  max: 0.55,  isPct: false },
    { key: "hazardResist", label: "Hazard Resist",      min: 0.04,  max: 0.15,  isPct: true },
    { key: "atk",          label: "Bonus ATK",          min: 8,     max: 28,    isPct: false, scalesWithTier: true },
    { key: "spell",        label: "Spell Power",        min: 8,     max: 30,    isPct: false, scalesWithTier: true },
    { key: "hp",           label: "Max HP",             min: 35,    max: 130,   isPct: false, scalesWithTier: true }
  ],

  BLESSINGS: [
    { id: "bless_vitality",  name: "Titan's Blood",       desc: "+12% Max HP per rank.",                                    stat: "hpPct",        perRank: 0.12, maxRank: 10, baseCost: 1, costStep: 1 },
    { id: "bless_might",     name: "Riftbreaker Might",   desc: "+10% ATK & Spell Power per rank.",                         stat: "powerPct",     perRank: 0.10, maxRank: 10, baseCost: 1, costStep: 1 },
    { id: "bless_fortune",   name: "Gilded Gate",         desc: "+18% Gold & Rift Shards from combat & bounties per rank.", stat: "currencyPct",  perRank: 0.18, maxRank: 10, baseCost: 1, costStep: 1 },
    { id: "bless_survival",  name: "Aegis of Adaptation", desc: "+8% Environmental Hazard Resistance per rank.",            stat: "hazardResist", perRank: 0.08, maxRank: 8,  baseCost: 2, costStep: 1 },
    { id: "bless_swiftness", name: "Chrono Stride",       desc: "+5% Move Speed & +3% Cooldown Reduction per rank.",        stat: "swiftness",    perRank: 0.05, cdrPerRank: 0.03, maxRank: 8, baseCost: 2, costStep: 1 },
    { id: "bless_luck",      name: "Artisan's Fortune",   desc: "+0.12 Rarity Drop Luck on all loot per rank.",             stat: "rarityLuck",   perRank: 0.12, maxRank: 6,  baseCost: 2, costStep: 2 }
  ]
};