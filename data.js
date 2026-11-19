/* ==========================================================================
   RIFTFALL — DATA CONFIGURATION (data.js)
   Data-driven definitions for Dungeons, Survival Hazards, Enemies, Bosses,
   Equipment Sets, Active Skills, Mutators, Mercenaries, and Blessings.
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
    DASH_COOLDOWN: 2.2,
    DASH_DURATION: 0.24,
    DASH_IFRAMES: 0.34,
    REROLL_BASE_SHARDS: 12,
    XP_BASE: 100,
    XP_GROWTH: 1.26,
    AUTO_SAVE_INTERVAL: 15,
    BASE_PLAYER_STATS: {
      hp: 240,
      atk: 26,
      spell: 24,
      crit: 0.08,
      critMult: 1.65,
      speed: 4.6,
      hazardResist: 0.0,
      lifesteal: 0.0,
      cdr: 0.0,
      armor: 10
    }
  },

  /* ------------------------------------------------------------------------
     RARITY SYSTEM
     ------------------------------------------------------------------------ */
  RARITIES: {
    common: {
      id: "common",
      name: "Common",
      order: 1,
      statMult: 1.0,
      substatCount: 1,
      color: "#94a3b8",
      sellBase: 28,
      salvageBase: 4,
      dropWeight: 54
    },
    rare: {
      id: "rare",
      name: "Rare",
      order: 2,
      statMult: 1.32,
      substatCount: 2,
      color: "#38bdf8",
      sellBase: 72,
      salvageBase: 11,
      dropWeight: 30
    },
    epic: {
      id: "epic",
      name: "Epic",
      order: 3,
      statMult: 1.75,
      substatCount: 3,
      color: "#c084fc",
      sellBase: 185,
      salvageBase: 28,
      dropWeight: 12
    },
    mythic: {
      id: "mythic",
      name: "Mythic",
      order: 4,
      statMult: 2.35,
      substatCount: 4,
      color: "#f59e0b",
      sellBase: 460,
      salvageBase: 75,
      dropWeight: 4
    }
  },

  /* ------------------------------------------------------------------------
     DIFFICULTY TIERS
     ------------------------------------------------------------------------ */
  DIFFICULTIES: {
    normal: {
      id: "normal",
      name: "Normal",
      hpMult: 1.0,
      dmgMult: 1.0,
      hazardMult: 1.0,
      lootMult: 1.0,
      xpMult: 1.0,
      rarityLuck: 0.0,
      renownFirstClear: 2,
      powerMult: 1.0
    },
    nightmare: {
      id: "nightmare",
      name: "Nightmare",
      hpMult: 2.35,
      dmgMult: 1.75,
      hazardMult: 1.35,
      lootMult: 2.2,
      xpMult: 2.0,
      rarityLuck: 0.45,
      renownFirstClear: 4,
      powerMult: 2.1
    },
    abyssal: {
      id: "abyssal",
      name: "Abyssal",
      hpMult: 5.2,
      dmgMult: 2.9,
      hazardMult: 1.75,
      lootMult: 4.5,
      xpMult: 3.8,
      rarityLuck: 1.05,
      renownFirstClear: 8,
      powerMult: 4.2
    }
  },

  /* ------------------------------------------------------------------------
     ENDGAME RIFT KEY MUTATORS
     ------------------------------------------------------------------------ */
  MUTATORS: [
    {
      id: "double_boss",
      name: "Twin Guardians",
      desc: "Final room spawns TWO bosses simultaneously (65% HP each).",
      rewardBonus: 0.75,
      rarityLuck: 0.35,
      icon: "☠"
    },
    {
      id: "hyper_speed",
      name: "Hyper-Speed Rift",
      desc: "Enemies move and attack 35% faster; Hero gains +15% Move Speed.",
      rewardBonus: 0.45,
      rarityLuck: 0.2,
      icon: "⚡"
    },
    {
      id: "meteor_shower",
      name: "Astral Meteor Shower",
      desc: "Telegraphed burning meteors rain across combat rooms every 4.5s.",
      rewardBonus: 0.55,
      rarityLuck: 0.25,
      icon: "☄"
    },
    {
      id: "glass_cannon",
      name: "Shattered Veil",
      desc: "All damage dealt by both Hero and Enemies is increased by +50%.",
      rewardBonus: 0.50,
      rarityLuck: 0.2,
      icon: "⚔"
    },
    {
      id: "volatile_blood",
      name: "Volatile Blood",
      desc: "Slain monsters erupt after 0.9s, dealing AoE blast damage.",
      rewardBonus: 0.40,
      rarityLuck: 0.15,
      icon: "✹"
    }
  ],

  /* ------------------------------------------------------------------------
     SANCTUARY BASE CAMP STATIONS (World Grid Coordinates)
     ------------------------------------------------------------------------ */
  SANCTUARY: {
    size: 15,
    spawn: { x: 7.5, y: 8.5 },
    palette: {
      bgTop: "#0c1324",
      bgBottom: "#060912",
      tileA: "#1d2842",
      tileB: "#182238",
      tileBorder: "#29385a",
      wallTop: "#334155",
      wallLeft: "#1e293b",
      wallRight: "#0f172a",
      accent: "#38bdf8"
    },
    stations: [
      {
        id: "dungeon",
        name: "Rift Gate",
        prompt: "Open Rift Gate",
        x: 7.5,
        y: 3.0,
        radius: 1.9,
        color: "#38bdf8",
        glow: "rgba(56, 189, 248, 0.55)",
        icon: "⚔",
        shape: "portal"
      },
      {
        id: "armory",
        name: "Armory",
        prompt: "Open Armory & Gear",
        x: 3.2,
        y: 7.5,
        radius: 1.7,
        color: "#f59e0b",
        glow: "rgba(245, 158, 11, 0.48)",
        icon: "🛡",
        shape: "pedestal"
      },
      {
        id: "forge",
        name: "Blacksmith",
        prompt: "Open Blacksmith Forge",
        x: 11.8,
        y: 7.5,
        radius: 1.7,
        color: "#f97316",
        glow: "rgba(249, 115, 22, 0.52)",
        icon: "⚒",
        shape: "anvil"
      },
      {
        id: "guild",
        name: "Mercenary Guild",
        prompt: "Open Mercenary Guild",
        x: 7.5,
        y: 12.0,
        radius: 1.7,
        color: "#a855f7",
        glow: "rgba(168, 85, 247, 0.48)",
        icon: "♕",
        shape: "banner"
      }
    ]
  },

  /* ------------------------------------------------------------------------
     4 THEMED DUNGEONS + SURVIVAL GIMMICKS + PALETTES
     ------------------------------------------------------------------------ */
  DUNGEONS: [
    {
      id: "sunken_quarry",
      name: "Sunken Quarry",
      themeLabel: "Earth / Crystal",
      themeColor: "#38bdf8",
      desc: "Flooded subterranean crystal mines choked with stagnant air and crystalline golems.",
      rooms: 4,
      recommendedPower: 100,
      baseGold: 95,
      baseShards: 8,
      baseXp: 120,
      hazard: {
        type: "oxygen",
        name: "Oxygen Reserve",
        icon: "◈",
        cssOverlay: "hazard-oxygen",
        barTheme: "",
        shortDesc: "Oxygen Pockets: Air drains slowly away from glowing crystal vents.",
        tip: "Stand inside glowing cyan crystal vents to refill Oxygen.",
        drainPerSec: 6.2,
        restorePerSec: 34.0,
        suffocateDpsPct: 0.055
      },
      palette: {
        bgTop: "#0a1724",
        bgBottom: "#050b12",
        tileA: "#1b2e3c",
        tileB: "#162632",
        tileBorder: "#254054",
        wallTop: "#33546b",
        wallLeft: "#1e3647",
        wallRight: "#12222e",
        pillarTop: "#38bdf8",
        accent: "#38bdf8"
      },
      enemies: ["crystal_crawler", "quarry_golem", "prism_slinger"],
      bossId: "obsidian_colossus",
      lootPool: ["seismic_hammer", "earthshaker_plate", "crystal_heart_relic"],
      lootSummary: ["Seismic Hammer", "Earthshaker Tank Plate", "Crystal Heart Relic"]
    },
    {
      id: "cinder_foundry",
      name: "Cinder Foundry",
      themeLabel: "Fire / Clockwork",
      themeColor: "#f97316",
      desc: "Superheated dwarven blast furnaces patrolled by rogue brass automatons.",
      rooms: 4,
      recommendedPower: 220,
      baseGold: 185,
      baseShards: 16,
      baseXp: 240,
      hazard: {
        type: "heat",
        name: "Core Overheat",
        icon: "🔥",
        cssOverlay: "hazard-heat",
        barTheme: "theme-heat",
        shortDesc: "Overheat Meter: Standing still builds scorching heat; moving & dashing cools down.",
        tip: "Keep moving or dash to vent heat! At 100% you suffer burn damage.",
        idleHeatPerSec: 22.0,
        moveCoolPerSec: 26.0,
        dashCoolBurst: 32.0,
        burnDpsPct: 0.065
      },
      palette: {
        bgTop: "#1f0e0a",
        bgBottom: "#0e0604",
        tileA: "#331d19",
        tileB: "#2a1714",
        tileBorder: "#4d2a22",
        wallTop: "#6e3828",
        wallLeft: "#4a2319",
        wallRight: "#2e150e",
        pillarTop: "#f97316",
        accent: "#fb923c"
      },
      enemies: ["clockwork_hound", "slag_brutes", "ember_turret"],
      bossId: "arch_forge_automaton",
      lootPool: ["blaze_chakrams", "forgelord_mail", "furnace_core_relic"],
      lootSummary: ["Blaze Chakrams", "Forge-Lord Crit Mail", "Furnace Core Relic"]
    },
    {
      id: "whispering_marsh",
      name: "Whispering Marsh",
      themeLabel: "Poison / Bio",
      themeColor: "#22c55e",
      desc: "Bioluminescent fungal wetlands shrouded in corrosive spores and ancient root-beasts.",
      rooms: 5,
      recommendedPower: 420,
      baseGold: 340,
      baseShards: 28,
      baseXp: 440,
      hazard: {
        type: "poison",
        name: "Toxin Exposure",
        icon: "☣",
        cssOverlay: "hazard-poison",
        barTheme: "theme-poison",
        shortDesc: "Toxic Spores: Expanding venom pools erupt across the floor; avoid or out-heal them.",
        tip: "Dodge expanding green spore pools or use Lifesteal / Survival Flasks.",
        poolSpawnInterval: 4.4,
        poolMaxRadius: 2.35,
        toxinGainInPool: 36.0,
        toxinDecayPerSec: 18.0,
        poisonDpsPct: 0.06
      },
      palette: {
        bgTop: "#0a1c14",
        bgBottom: "#040d09",
        tileA: "#162d22",
        tileB: "#12251c",
        tileBorder: "#204231",
        wallTop: "#2d5c42",
        wallLeft: "#1b3b29",
        wallRight: "#102419",
        pillarTop: "#4ade80",
        accent: "#22c55e"
      },
      enemies: ["spore_stalker", "mire_hulk", "blight_spitter"],
      bossId: "mycelial_matriarch",
      lootPool: ["sporeburst_staff", "venomweaver_shroud", "emerald_gland_relic"],
      lootSummary: ["Spore-Burst Staff", "Venom-Weaver Shroud", "Emerald Gland Relic"]
    },
    {
      id: "astral_observatory",
      name: "Astral Observatory",
      themeLabel: "Void / Gravity",
      themeColor: "#c084fc",
      desc: "A shattered celestial spire suspended over a singularity where gravity fractures every 15 seconds.",
      rooms: 5,
      recommendedPower: 760,
      baseGold: 620,
      baseShards: 52,
      baseXp: 820,
      hazard: {
        type: "gravity",
        name: "Gravity Phase",
        icon: "✦",
        cssOverlay: "hazard-gravity",
        barTheme: "theme-gravity",
        shortDesc: "Gravity Shifts: Alternates every 15s between Low-G (+35% Speed) and Heavy-G (+35% Damage, -20% Speed).",
        tip: "Exploit Low-G to reposition and Heavy-G to unleash massive Q/E burst.",
        cycleSeconds: 15.0,
        lowGSpeedBonus: 0.35,
        heavyGDmgBonus: 0.35,
        heavyGSpeedPenalty: 0.20
      },
      palette: {
        bgTop: "#130b24",
        bgBottom: "#07040f",
        tileA: "#21163a",
        tileB: "#1a112f",
        tileBorder: "#34225c",
        wallTop: "#54388c",
        wallLeft: "#35215c",
        wallRight: "#20133a",
        pillarTop: "#e879f9",
        accent: "#c084fc"
      },
      enemies: ["void_wraith", "astral_sentinel", "pulsar_orb"],
      bossId: "chronos_archon",
      lootPool: ["nova_grimoire", "starlight_vestments", "singularity_prism_relic"],
      lootSummary: ["Nova Grimoire", "Starlight Vestments", "Singularity Prism"]
    }
  ],

  /* ------------------------------------------------------------------------
     ENEMY TEMPLATES
     ------------------------------------------------------------------------ */
  ENEMIES: {
    // Sunken Quarry
    crystal_crawler: {
      id: "crystal_crawler",
      name: "Crystal Crawler",
      hp: 85,
      atk: 14,
      speed: 3.1,
      range: 1.05,
      attackCd: 1.15,
      radius: 0.42,
      height: 0.65,
      ai: "chaser",
      color: "#38bdf8",
      trim: "#bae6fd",
      gold: 11,
      xp: 16
    },
    quarry_golem: {
      id: "quarry_golem",
      name: "Quarry Golem",
      hp: 165,
      atk: 24,
      speed: 1.9,
      range: 1.25,
      attackCd: 1.7,
      radius: 0.58,
      height: 1.15,
      ai: "bruiser",
      color: "#64748b",
      trim: "#38bdf8",
      gold: 20,
      xp: 28
    },
    prism_slinger: {
      id: "prism_slinger",
      name: "Prism Slinger",
      hp: 75,
      atk: 18,
      speed: 2.3,
      range: 5.2,
      attackCd: 2.0,
      radius: 0.4,
      height: 0.9,
      ai: "ranged",
      projColor: "#7dd3fc",
      projSpeed: 6.2,
      color: "#0ea5e9",
      trim: "#e0f2fe",
      gold: 16,
      xp: 22
    },

    // Cinder Foundry
    clockwork_hound: {
      id: "clockwork_hound",
      name: "Clockwork Hound",
      hp: 155,
      atk: 26,
      speed: 3.8,
      range: 1.05,
      attackCd: 0.95,
      radius: 0.42,
      height: 0.65,
      ai: "chaser",
      color: "#d97706",
      trim: "#fef08a",
      gold: 22,
      xp: 32
    },
    slag_brutes: {
      id: "slag_brutes",
      name: "Slag Automaton",
      hp: 310,
      atk: 40,
      speed: 2.1,
      range: 1.35,
      attackCd: 1.65,
      radius: 0.62,
      height: 1.25,
      ai: "bruiser",
      color: "#9a3412",
      trim: "#fb923c",
      gold: 36,
      xp: 50
    },
    ember_turret: {
      id: "ember_turret",
      name: "Ember Artificer",
      hp: 145,
      atk: 32,
      speed: 2.2,
      range: 5.8,
      attackCd: 1.85,
      radius: 0.44,
      height: 0.95,
      ai: "ranged",
      projColor: "#f97316",
      projSpeed: 7.0,
      color: "#ea580c",
      trim: "#fde68a",
      gold: 28,
      xp: 40
    },

    // Whispering Marsh
    spore_stalker: {
      id: "spore_stalker",
      name: "Spore Stalker",
      hp: 290,
      atk: 46,
      speed: 3.6,
      range: 1.1,
      attackCd: 1.0,
      radius: 0.44,
      height: 0.85,
      ai: "chaser",
      color: "#15803d",
      trim: "#86efac",
      gold: 42,
      xp: 62
    },
    mire_hulk: {
      id: "mire_hulk",
      name: "Mire Hulk",
      hp: 560,
      atk: 64,
      speed: 2.0,
      range: 1.4,
      attackCd: 1.75,
      radius: 0.65,
      height: 1.35,
      ai: "bruiser",
      color: "#14532d",
      trim: "#a3e635",
      gold: 64,
      xp: 88
    },
    blight_spitter: {
      id: "blight_spitter",
      name: "Blight Spitter",
      hp: 260,
      atk: 54,
      speed: 2.35,
      range: 6.0,
      attackCd: 1.8,
      radius: 0.44,
      height: 0.95,
      ai: "ranged",
      projColor: "#84cc16",
      projSpeed: 6.8,
      color: "#4d7c0f",
      trim: "#d9f99d",
      gold: 50,
      xp: 72
    },

    // Astral Observatory
    void_wraith: {
      id: "void_wraith",
      name: "Void Wraith",
      hp: 520,
      atk: 78,
      speed: 4.0,
      range: 1.15,
      attackCd: 0.95,
      radius: 0.44,
      height: 1.05,
      ai: "chaser",
      color: "#7e22ce",
      trim: "#f0abfc",
      gold: 78,
      xp: 115
    },
    astral_sentinel: {
      id: "astral_sentinel",
      name: "Astral Sentinel",
      hp: 980,
      atk: 105,
      speed: 2.3,
      range: 1.45,
      attackCd: 1.6,
      radius: 0.66,
      height: 1.45,
      ai: "bruiser",
      color: "#4c1d95",
      trim: "#38bdf8",
      gold: 115,
      xp: 160
    },
    pulsar_orb: {
      id: "pulsar_orb",
      name: "Pulsar Construct",
      hp: 460,
      atk: 92,
      speed: 2.6,
      range: 6.5,
      attackCd: 1.65,
      radius: 0.45,
      height: 1.0,
      ai: "ranged",
      projColor: "#e879f9",
      projSpeed: 7.6,
      color: "#a21caf",
      trim: "#fde047",
      gold: 92,
      xp: 132
    }
  },

  /* ------------------------------------------------------------------------
     BOSS TEMPLATES WITH TELEGRAPHED ATTACK PATTERNS
     ------------------------------------------------------------------------ */
  BOSSES: {
    obsidian_colossus: {
      id: "obsidian_colossus",
      name: "Obsidian Colossus",
      subtitle: "Warden of the Sunken Vein",
      hp: 1150,
      atk: 38,
      speed: 2.1,
      radius: 0.95,
      height: 2.1,
      color: "#1e293b",
      trim: "#38bdf8",
      gold: 160,
      shards: 14,
      xp: 220,
      patterns: [
        { type: "slam_circle", name: "Seismic Crush", telegraph: 1.15, radius: 2.7, dmgMult: 1.5, cooldown: 3.4 },
        { type: "line_charge", name: "Quarry Bullrush", telegraph: 1.0, width: 1.5, length: 6.8, dmgMult: 1.35, cooldown: 4.0 },
        { type: "triple_drop", name: "Crystal Barrage", telegraph: 1.1, radius: 1.65, count: 3, dmgMult: 1.15, cooldown: 3.6 }
      ]
    },
    arch_forge_automaton: {
      id: "arch_forge_automaton",
      name: "Ignis Prime",
      subtitle: "Arch-Forge Automaton",
      hp: 2550,
      atk: 64,
      speed: 2.55,
      radius: 0.98,
      height: 2.15,
      color: "#7c2d12",
      trim: "#facc15",
      gold: 320,
      shards: 26,
      xp: 440,
      patterns: [
        { type: "ring_nova", name: "Smelter Ring", telegraph: 1.15, innerRadius: 1.6, outerRadius: 4.5, dmgMult: 1.5, cooldown: 3.3 },
        { type: "cross_beam", name: "Crucible Crossfire", telegraph: 1.2, width: 1.25, length: 7.5, dmgMult: 1.6, cooldown: 3.8 },
        { type: "line_charge", name: "Piston Overdrive", telegraph: 0.9, width: 1.6, length: 7.4, dmgMult: 1.4, cooldown: 3.2 }
      ]
    },
    mycelial_matriarch: {
      id: "mycelial_matriarch",
      name: "Vespera the Rot-Queen",
      subtitle: "Mycelial Matriarch",
      hp: 5100,
      atk: 98,
      speed: 2.45,
      radius: 1.05,
      height: 2.25,
      color: "#14532d",
      trim: "#a3e635",
      gold: 580,
      shards: 45,
      xp: 820,
      patterns: [
        { type: "triple_drop", name: "Venom Cluster", telegraph: 1.05, radius: 2.0, count: 4, dmgMult: 1.3, cooldown: 3.0, leavesPoison: true },
        { type: "slam_circle", name: "Spore Detonation", telegraph: 1.1, radius: 3.3, dmgMult: 1.65, cooldown: 3.6 },
        { type: "radial_volley", name: "Thorn Spiral", telegraph: 0.95, count: 10, dmgMult: 1.1, cooldown: 3.1 }
      ]
    },
    chronos_archon: {
      id: "chronos_archon",
      name: "Aethelgard, Star-Eater",
      subtitle: "Chronos Archon of the Singularity",
      hp: 10200,
      atk: 152,
      speed: 2.85,
      radius: 1.05,
      height: 2.35,
      color: "#3b0764",
      trim: "#f0abfc",
      gold: 1100,
      shards: 85,
      xp: 1650,
      patterns: [
        { type: "cross_beam", name: "Event Horizon Beams", telegraph: 1.15, width: 1.35, length: 8.5, dmgMult: 1.75, cooldown: 3.2 },
        { type: "ring_nova", name: "Gravity Collapse", telegraph: 1.1, innerRadius: 1.8, outerRadius: 5.2, dmgMult: 1.65, cooldown: 3.3 },
        { type: "triple_drop", name: "Supernova Rain", telegraph: 1.0, radius: 1.9, count: 5, dmgMult: 1.4, cooldown: 2.9 },
        { type: "radial_volley", name: "Astral Barrage", telegraph: 0.85, count: 12, dmgMult: 1.25, cooldown: 2.8 }
      ]
    }
  },

  /* ------------------------------------------------------------------------
     ACTIVE SKILLS (Q = Weapon Skill, E = Relic Skill)
     ------------------------------------------------------------------------ */
  SKILLS: {
    // Weapon Skills (Q)
    iron_cleave: {
      id: "iron_cleave",
      name: "Whirl Cleave",
      icon: "⚔",
      cooldown: 4.5,
      type: "aoe_melee",
      radius: 2.6,
      atkMult: 2.1,
      spellMult: 0.4,
      color: "#e2e8f0",
      desc: "Spin in a wide steel arc, dealing 210% ATK damage to all nearby foes."
    },
    seismic_shatter: {
      id: "seismic_shatter",
      name: "Seismic Slam",
      icon: "⛰",
      cooldown: 5.5,
      type: "shockwave",
      radius: 3.4,
      atkMult: 2.75,
      spellMult: 0.6,
      stunDuration: 1.4,
      color: "#38bdf8",
      desc: "Crush the earth for 275% ATK damage in a large radius and stun enemies for 1.4s."
    },
    inferno_ring: {
      id: "inferno_ring",
      name: "Blaze Orbit",
      icon: "✴",
      cooldown: 4.8,
      type: "proj_fan",
      count: 6,
      range: 6.5,
      atkMult: 1.65,
      spellMult: 0.9,
      guaranteedCrit: true,
      color: "#fb923c",
      desc: "Hurl 6 flaming chakrams outward; guaranteed Critical Hits for 165% ATK + 90% Spell."
    },
    spore_eruption: {
      id: "spore_eruption",
      name: "Spore Nova",
      icon: "✹",
      cooldown: 5.2,
      type: "drain_nova",
      radius: 3.5,
      atkMult: 0.8,
      spellMult: 2.5,
      healPctDmg: 0.30,
      color: "#4ade80",
      desc: "Detonate toxic spores for 250% Spell damage and heal for 30% of damage dealt."
    },
    starfall_cataclysm: {
      id: "starfall_cataclysm",
      name: "Starfall",
      icon: "✦",
      cooldown: 5.8,
      type: "meteor_cluster",
      count: 4,
      radius: 2.3,
      atkMult: 0.5,
      spellMult: 3.1,
      color: "#e879f9",
      desc: "Call down 4 astral meteors on nearby foes, each dealing 310% Spell Power damage."
    },

    // Relic / Armor Skills (E)
    sanctuary_aegis: {
      id: "sanctuary_aegis",
      name: "Gate Aegis",
      icon: "🛡",
      cooldown: 9.0,
      type: "shield_buff",
      shieldPctHp: 0.30,
      duration: 5.0,
      color: "#60a5fa",
      desc: "Weave a protective barrier equal to 30% of your Max HP for 5s."
    },
    crystal_bastion: {
      id: "crystal_bastion",
      name: "Crystal Ward",
      icon: "◈",
      cooldown: 10.0,
      type: "shield_cleanse",
      shieldPctHp: 0.45,
      hazardRestore: 55,
      duration: 6.0,
      color: "#38bdf8",
      desc: "Gain a 45% Max HP crystalline shield and restore/stabilize 55% of active dungeon hazards."
    },
    overclock_surge: {
      id: "overclock_surge",
      name: "Overclock",
      icon: "⚡",
      cooldown: 10.5,
      type: "haste_buff",
      speedBonus: 0.40,
      atkSpeedBonus: 0.55,
      critBonus: 0.25,
      duration: 6.0,
      color: "#f97316",
      desc: "Vent furnace steam: +55% Attack Speed, +25% Crit Chance, and +40% Move Speed for 6s."
    },
    venom_bloom: {
      id: "venom_bloom",
      name: "Bio-Regen",
      icon: "❦",
      cooldown: 9.5,
      type: "heal_pulse",
      healPctHp: 0.38,
      radius: 3.2,
      spellMult: 1.8,
      color: "#22c55e",
      desc: "Instantly restore 38% Max HP, cleanse Toxin buildup, and lash nearby foes for 180% Spell damage."
    },
    singularity_rift: {
      id: "singularity_rift",
      name: "Void Vortex",
      icon: "◎",
      cooldown: 11.0,
      type: "vortex_pull",
      radius: 4.5,
      spellMult: 2.9,
      shieldPctHp: 0.25,
      color: "#c084fc",
      desc: "Collapse space, pulling enemies inward for 290% Spell damage and granting a 25% HP barrier."
    }
  },

  /* ------------------------------------------------------------------------
     GEAR TEMPLATES (Weapons, Armors, Relics)
     ------------------------------------------------------------------------ */
  GEAR_TEMPLATES: {
    // --- STARTER LOADOUT ---
    iron_blade: {
      id: "iron_blade",
      name: "Gatekeeper Blade",
      slot: "weapon",
      setTag: "Starter",
      icon: "⚔",
      attackType: "melee",
      range: 1.95,
      attackRate: 1.45,
      weaponColor: "#cbd5e1",
      trailColor: "#94a3b8",
      skillId: "iron_cleave",
      baseStats: { atk: 18, spell: 6, crit: 0.03 },
      desc: "Reliable forged steel blade issued to new Rift scouts."
    },
    traveler_tunic: {
      id: "traveler_tunic",
      name: "Scout's Mantle",
      slot: "armor",
      setTag: "Starter",
      icon: "🛡",
      visuals: { body: "#334155", cloak: "#2563eb", trim: "#cbd5e1", aura: null },
      baseStats: { hp: 85, armor: 8, speed: 0.15, hazardResist: 0.05 },
      desc: "Stitched leather and ward-cloth built for swift reconnaissance."
    },
    cracked_waystone: {
      id: "cracked_waystone",
      name: "Sanctuary Waystone",
      slot: "relic",
      setTag: "Starter",
      icon: "✦",
      skillId: "sanctuary_aegis",
      baseStats: { hp: 40, spell: 10, hazardResist: 0.05 },
      desc: "Hums softly with defensive energy from the Sanctuary Gate."
    },

    // --- DUNGEON 1: SUNKEN QUARRY (Earthshaker Tank Set) ---
    seismic_hammer: {
      id: "seismic_hammer",
      name: "Seismic Hammer",
      slot: "weapon",
      setTag: "Earthshaker",
      dungeonId: "sunken_quarry",
      craftCost: 35,
      icon: "🔨",
      attackType: "melee_heavy",
      range: 2.25,
      attackRate: 1.15,
      weaponColor: "#38bdf8",
      trailColor: "#7dd3fc",
      skillId: "seismic_shatter",
      baseStats: { atk: 34, hp: 75, crit: 0.04 },
      desc: "Massive crystal-bound maul that cleaves wide arcs and crushes armor."
    },
    earthshaker_plate: {
      id: "earthshaker_plate",
      name: "Earthshaker Plate",
      slot: "armor",
      setTag: "Earthshaker",
      dungeonId: "sunken_quarry",
      craftCost: 35,
      icon: "🛡",
      visuals: { body: "#1e3a5f", cloak: "#0284c7", trim: "#7dd3fc", aura: "rgba(56,189,248,0.28)" },
      baseStats: { hp: 230, armor: 22, hazardResist: 0.18 },
      desc: "Heavy quarry plate infused with oxygen-retaining crystal veins."
    },
    crystal_heart_relic: {
      id: "crystal_heart_relic",
      name: "Crystal Heart",
      slot: "relic",
      setTag: "Earthshaker",
      dungeonId: "sunken_quarry",
      craftCost: 35,
      icon: "◈",
      skillId: "crystal_bastion",
      baseStats: { hp: 130, atk: 12, hazardResist: 0.15 },
      desc: "A resonant geode core that fortifies vitality and purifies dungeon air."
    },

    // --- DUNGEON 2: CINDER FOUNDRY (Forge-Lord Crit Set) ---
    blaze_chakrams: {
      id: "blaze_chakrams",
      name: "Blaze Chakrams",
      slot: "weapon",
      setTag: "Forge-Lord",
      dungeonId: "cinder_foundry",
      craftCost: 75,
      icon: "✴",
      attackType: "ranged_proj",
      range: 5.4,
      attackRate: 1.85,
      projSpeed: 10.5,
      weaponColor: "#f97316",
      trailColor: "#fde047",
      skillId: "inferno_ring",
      baseStats: { atk: 54, crit: 0.14, speed: 0.35 },
      desc: "Twin razor-edged furnace rings hurled at blistering speed."
    },
    forgelord_mail: {
      id: "forgelord_mail",
      name: "Forge-Lord Mail",
      slot: "armor",
      setTag: "Forge-Lord",
      dungeonId: "cinder_foundry",
      craftCost: 75,
      icon: "🔥",
      visuals: { body: "#7c2d12", cloak: "#ea580c", trim: "#facc15", aura: "rgba(249,115,22,0.3)" },
      baseStats: { hp: 310, atk: 24, crit: 0.09, speed: 0.45, hazardResist: 0.16 },
      desc: "Clockwork-vented battle armor engineered for agile critical strikers."
    },
    furnace_core_relic: {
      id: "furnace_core_relic",
      name: "Furnace Core",
      slot: "relic",
      setTag: "Forge-Lord",
      dungeonId: "cinder_foundry",
      craftCost: 75,
      icon: "⚙",
      skillId: "overclock_surge",
      baseStats: { atk: 28, crit: 0.10, cdr: 0.08 },
      desc: "A pressurized brass turbine that supercharges reflexes on demand."
    },

    // --- DUNGEON 3: WHISPERING MARSH (Venom-Weaver Lifesteal Set) ---
    sporeburst_staff: {
      id: "sporeburst_staff",
      name: "Spore-Burst Staff",
      slot: "weapon",
      setTag: "Venom-Weaver",
      dungeonId: "whispering_marsh",
      craftCost: 140,
      icon: "🌿",
      attackType: "ranged_orb",
      range: 5.8,
      attackRate: 1.55,
      projSpeed: 9.2,
      weaponColor: "#22c55e",
      trailColor: "#a3e635",
      skillId: "spore_eruption",
      baseStats: { atk: 44, spell: 88, lifesteal: 0.08 },
      desc: "Living mycelial staff firing volatile bio-orbs that siphon vitality."
    },
    venomweaver_shroud: {
      id: "venomweaver_shroud",
      name: "Venom-Weaver Shroud",
      slot: "armor",
      setTag: "Venom-Weaver",
      dungeonId: "whispering_marsh",
      craftCost: 140,
      icon: "☣",
      visuals: { body: "#14532d", cloak: "#16a34a", trim: "#bef264", aura: "rgba(34,197,94,0.3)" },
      baseStats: { hp: 480, spell: 46, lifesteal: 0.07, hazardResist: 0.24 },
      desc: "Symbiotic marsh-silk cloak that converts toxins into cellular regeneration."
    },
    emerald_gland_relic: {
      id: "emerald_gland_relic",
      name: "Emerald Bloom",
      slot: "relic",
      setTag: "Venom-Weaver",
      dungeonId: "whispering_marsh",
      craftCost: 140,
      icon: "❦",
      skillId: "venom_bloom",
      baseStats: { hp: 220, spell: 42, lifesteal: 0.06, hazardResist: 0.18 },
      desc: "A pulsing floral core that blooms with restorative nectar in battle."
    },

    // --- DUNGEON 4: ASTRAL OBSERVATORY (Starlight Spell Set) ---
    nova_grimoire: {
      id: "nova_grimoire",
      name: "Nova Grimoire",
      slot: "weapon",
      setTag: "Starlight",
      dungeonId: "astral_observatory",
      craftCost: 260,
      icon: "✦",
      attackType: "ranged_nova",
      range: 6.4,
      attackRate: 1.65,
      projSpeed: 11.4,
      weaponColor: "#c084fc",
      trailColor: "#f0abfc",
      skillId: "starfall_cataclysm",
      baseStats: { atk: 62, spell: 155, crit: 0.12, cdr: 0.10 },
      desc: "An unbound tome of starlight firing piercing cosmic bolts."
    },
    starlight_vestments: {
      id: "starlight_vestments",
      name: "Starlight Vestments",
      slot: "armor",
      setTag: "Starlight",
      dungeonId: "astral_observatory",
      craftCost: 260,
      icon: "✧",
      visuals: { body: "#3b0764", cloak: "#7e22ce", trim: "#f5d0fe", aura: "rgba(192,132,252,0.36)" },
      baseStats: { hp: 720, spell: 95, crit: 0.10, cdr: 0.10, speed: 0.5, hazardResist: 0.25 },
      desc: "Celestial robes stitched from compressed nebula threads."
    },
    singularity_prism_relic: {
      id: "singularity_prism_relic",
      name: "Singularity Prism",
      slot: "relic",
      setTag: "Starlight",
      dungeonId: "astral_observatory",
      craftCost: 260,
      icon: "◎",
      skillId: "singularity_rift",
      baseStats: { hp: 340, spell: 92, crit: 0.09, cdr: 0.12 },
      desc: "A miniature black hole trapped in glass that bends spacetime around foes."
    }
  },

  /* ------------------------------------------------------------------------
     BONUS SUB-STAT POOL (Rolled on Drops & Reforged at Blacksmith)
     ------------------------------------------------------------------------ */
  SUBSTAT_POOL: [
    { key: "crit", label: "Crit Chance", min: 0.02, max: 0.09, isPct: true },
    { key: "lifesteal", label: "Lifesteal", min: 0.015, max: 0.06, isPct: true },
    { key: "cdr", label: "Cooldown Reduction", min: 0.03, max: 0.10, isPct: true },
    { key: "speed", label: "Move Speed", min: 0.18, max: 0.65, isPct: false },
    { key: "hazardResist", label: "Hazard Resist", min: 0.05, max: 0.18, isPct: true },
    { key: "atk", label: "Bonus ATK", min: 8, max: 32, isPct: false, scalesWithTier: true },
    { key: "spell", label: "Spell Power", min: 8, max: 36, isPct: false, scalesWithTier: true },
    { key: "hp", label: "Max HP", min: 35, max: 145, isPct: false, scalesWithTier: true }
  ],

  /* ------------------------------------------------------------------------
     MERCENARY GUILD SQUADS (Idle Background Dungeon Farming)
     Unlocked by clearing the corresponding dungeon's Boss once.
     ------------------------------------------------------------------------ */
  MERCENARIES: [
    {
      id: "merc_quarry",
      dungeonId: "sunken_quarry",
      name: "Delver Vanguard",
      role: "Auto-farms Sunken Quarry",
      icon: "⛏",
      hireCostRenown: 1,
      upgradeGoldBase: 140,
      upgradeGoldGrowth: 1.48,
      goldPerSecBase: 3.5,
      shardsPerSecBase: 0.25
    },
    {
      id: "merc_foundry",
      dungeonId: "cinder_foundry",
      name: "Cinder Sappers",
      role: "Auto-farms Cinder Foundry",
      icon: "⚒",
      hireCostRenown: 2,
      upgradeGoldBase: 380,
      upgradeGoldGrowth: 1.52,
      goldPerSecBase: 9.5,
      shardsPerSecBase: 0.7
    },
    {
      id: "merc_marsh",
      dungeonId: "whispering_marsh",
      name: "Plague Stalkers",
      role: "Auto-farms Whispering Marsh",
      icon: "🌿",
      hireCostRenown: 3,
      upgradeGoldBase: 920,
      upgradeGoldGrowth: 1.55,
      goldPerSecBase: 24.0,
      shardsPerSecBase: 1.75
    },
    {
      id: "merc_astral",
      dungeonId: "astral_observatory",
      name: "Void Wardens",
      role: "Auto-farms Astral Observatory",
      icon: "✦",
      hireCostRenown: 5,
      upgradeGoldBase: 2200,
      upgradeGoldGrowth: 1.6,
      goldPerSecBase: 60.0,
      shardsPerSecBase: 4.5
    }
  ],

  /* ------------------------------------------------------------------------
     PERMANENT GUILD BLESSINGS (Purchased with Guild Renown)
     ------------------------------------------------------------------------ */
  BLESSINGS: [
    {
      id: "bless_vitality",
      name: "Titan's Blood",
      desc: "+12% Max HP per rank.",
      stat: "hpPct",
      perRank: 0.12,
      maxRank: 10,
      baseCost: 1,
      costStep: 1
    },
    {
      id: "bless_might",
      name: "Riftbreaker Might",
      desc: "+10% ATK & Spell Power per rank.",
      stat: "powerPct",
      perRank: 0.10,
      maxRank: 10,
      baseCost: 1,
      costStep: 1
    },
    {
      id: "bless_fortune",
      name: "Gilded Gate",
      desc: "+15% Gold & Rift Shards from all sources per rank.",
      stat: "currencyPct",
      perRank: 0.15,
      maxRank: 10,
      baseCost: 1,
      costStep: 1
    },
    {
      id: "bless_survival",
      name: "Aegis of Adaptation",
      desc: "+8% Environmental Hazard Resistance per rank.",
      stat: "hazardResist",
      perRank: 0.08,
      maxRank: 8,
      baseCost: 2,
      costStep: 1
    },
    {
      id: "bless_swiftness",
      name: "Chrono Stride",
      desc: "+5% Move Speed & +3% Cooldown Reduction per rank.",
      stat: "swiftness",
      perRank: 0.05,
      cdrPerRank: 0.03,
      maxRank: 8,
      baseCost: 2,
      costStep: 1
    }
  ]
};
