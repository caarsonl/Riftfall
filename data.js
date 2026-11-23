/* ==========================================================================
   RIFTFALL — DATA CONFIGURATION (data.js)
   20 Campaign Dungeons (T1–T20) + 4 Special Endgame Dungeons,
   6 Difficulty Tiers (Normal -> Apocalypse), 20 2pc/3pc Set Bonuses,
   60 Enemy Types, 20 Bosses, 6 Signature Special Weapons & 48 Combat Skills.
   ========================================================================== */

window.GAME_DATA = {
  GAME_TITLE: "Riftfall",
  SAVE_KEY: "riftfall_save_v1",

  CONSTANTS: {
    INVENTORY_CAPACITY: 75,
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
    XP_GROWTH: 1.28,
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
      desc: "Master of temporal fractures who bends cooldowns and slows enemies in time.",
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

  /* ------------------------------------------------------------------------
     6 DIFFICULTY TIERS (Includes New Endgame Apocalypse Tier)
     ------------------------------------------------------------------------ */
  DIFFICULTIES: {
    normal:     { id: "normal",     name: "Normal",     hpMult: 1.0,  dmgMult: 1.0,  hazardMult: 1.0,  lootMult: 1.0,  xpMult: 1.0,  rarityLuck: 0.0,  renownFirstClear: 2,  powerMult: 1.0,  minBossRarity: "common", armorPenBonus: 0.0 },
    nightmare:  { id: "nightmare",  name: "Nightmare",  hpMult: 2.1,  dmgMult: 1.55, hazardMult: 1.22, lootMult: 2.2,  xpMult: 2.0,  rarityLuck: 0.28, renownFirstClear: 4,  powerMult: 1.75, minBossRarity: "rare",   armorPenBonus: 0.05 },
    abyssal:    { id: "abyssal",    name: "Abyssal",    hpMult: 4.2,  dmgMult: 2.25, hazardMult: 1.45, lootMult: 4.5,  xpMult: 3.6,  rarityLuck: 0.60, renownFirstClear: 7,  powerMult: 2.9,  minBossRarity: "rare",   armorPenBonus: 0.12 },
    torment:    { id: "torment",    name: "Torment",    hpMult: 7.8,  dmgMult: 3.20, hazardMult: 1.65, lootMult: 7.2,  xpMult: 5.5,  rarityLuck: 0.95, renownFirstClear: 11, powerMult: 4.5,  minBossRarity: "epic",   armorPenBonus: 0.20 },
    cataclysm:  { id: "cataclysm",  name: "Cataclysm",  hpMult: 13.5, dmgMult: 4.35, hazardMult: 1.85, lootMult: 11.0, xpMult: 8.2,  rarityLuck: 1.35, renownFirstClear: 16, powerMult: 6.6,  minBossRarity: "epic",   armorPenBonus: 0.28 },
    apocalypse: { id: "apocalypse", name: "Apocalypse", hpMult: 22.0, dmgMult: 6.20, hazardMult: 2.10, lootMult: 16.0, xpMult: 12.0, rarityLuck: 1.80, renownFirstClear: 24, powerMult: 9.2,  minBossRarity: "mythic", armorPenBonus: 0.36 }
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
     4 SPECIAL DUNGEONS + 20 CAMPAIGN REALMS (T1 – T20)
     ------------------------------------------------------------------------ */
  DUNGEONS: [
    /* --- 4 SPECIAL DUNGEONS (Separate Mode Tab in Rift Gate) --- */
    {
      id: "endless_gauntlet",
      name: "Endless Rift Gauntlet",
      isSpecial: true,
      isEndless: true,
      specialMode: "endless",
      themeLabel: "★ Special • Infinite",
      themeColor: "#ffd447",
      dropClass: "all",
      desc: "Infinite procedural descent shifting across all 20 dungeon realms, hazards, and bosses every floor. Bosses appear every 5th floor!",
      rooms: 999,
      recommendedPower: 400,
      baseGold: 160,
      baseShards: 16,
      baseXp: 175,
      hazard: {
        type: "oxygen",
        name: "Shifting Realm Hazard",
        icon: "∞",
        cssOverlay: "hazard-gravity",
        barTheme: "",
        shortDesc: "Shifting Realms: Each floor adopts a random realm's theme, enemies, and survival hazard.",
        tip: "Adapt to the active floor's hazard! Bosses spawn every 5 floors.",
        drainPerSec: 5.5,
        restorePerSec: 38.0,
        suffocateDpsPct: 0.05
      },
      palette: {
        bgTop: "#141026", bgBottom: "#06040d", tileA: "#241d42", tileB: "#1b1533", tileBorder: "#0f0b1f",
        wallTop: "#f59e0b", wallLeft: "#4c1d95", wallRight: "#1e1b4b", pillarTop: "#38bdf8", chasm: "#070412", accent: "#ffd447"
      },
      enemies: ["crystal_crawler", "clockwork_hound", "spore_stalker", "void_wraith"],
      bossId: "obsidian_colossus",
      lootPool: ["seismic_hammer", "blaze_chakrams", "sporeburst_staff", "nova_grimoire", "permafrost_halberd"],
      lootSummary: ["Floor-Scaled Realm Sets", "Progressive Drops", "Best Floor Record"]
    },
    {
      id: "boss_rush_pantheon",
      name: "Boss Rush: Pantheon",
      isSpecial: true,
      specialMode: "boss_rush",
      themeLabel: "★ Special • 6 Bosses",
      themeColor: "#f43f5e",
      dropClass: "all",
      desc: "Zero trash rooms. Face 6 consecutive escalating Rift Guardians back-to-back in a grand colosseum for guaranteed Epic/Mythic drops!",
      rooms: 6,
      recommendedPower: 3200,
      baseGold: 3400,
      baseShards: 320,
      baseXp: 4200,
      hazard: {
        type: "storm",
        name: "Colosseum Static",
        icon: "⚡",
        cssOverlay: "hazard-storm",
        barTheme: "theme-storm",
        shortDesc: "Arena Surge: Static builds during boss fights; discharge at Copper Conduits or by Dashing.",
        tip: "Discharge static at Copper Conduits or Dash while dodging consecutive bosses!",
        chargePerSec: 10.5,
        dischargePerSec: 48.0,
        dashDischarge: 30.0,
        strikeDmgPct: 0.20
      },
      palette: {
        bgTop: "#1f0814", bgBottom: "#090206", tileA: "#331424", tileB: "#260e1a", tileBorder: "#14060d",
        wallTop: "#f43f5e", wallLeft: "#881337", wallRight: "#4c0519", pillarTop: "#ffd447", chasm: "#14030b", accent: "#f43f5e"
      },
      enemies: ["dread_knight", "radiant_warden"],
      bossId: "malakor_sovereign",
      lootPool: ["muramasa_katana", "valkyrie_spear_shield", "storm_caller_longbow", "void_chain_whipblade", "solaris_greatshield_mace"],
      lootSummary: ["6 Consecutive Bosses", "Muramasa & Valkyrie", "Massive Shards"]
    },
    {
      id: "abyssal_horde",
      name: "Abyssal Horde Survival",
      isSpecial: true,
      specialMode: "horde",
      themeLabel: "★ Special • 90s Siege",
      themeColor: "#fb923c",
      dropClass: "all",
      desc: "Survive a relentless 90-second siege of Elites & Rift Champions, culminating in a final Abyssal Overlord ambush!",
      rooms: 1,
      recommendedPower: 7500,
      baseGold: 8500,
      baseShards: 780,
      baseXp: 11000,
      hazard: {
        type: "blood",
        name: "Siege Bloodlust",
        icon: "🩸",
        cssOverlay: "hazard-blood",
        barTheme: "theme-blood",
        shortDesc: "Horde Frenzy: Blood curse rises fast—slay waves of enemies or stand in Sanguine Fonts to survive.",
        tip: "Keep slaying the endless horde to purge Bloodlust for 90 seconds!",
        cursePerSec: 12.0,
        killPurgeAmount: 18.0,
        fontPurgePerSec: 46.0,
        bleedDpsPct: 0.06
      },
      palette: {
        bgTop: "#1c0d07", bgBottom: "#090402", tileA: "#2e1911", tileB: "#24120c", tileBorder: "#140905",
        wallTop: "#fb923c", wallLeft: "#9a3412", wallRight: "#431407", pillarTop: "#fde047", chasm: "#1a0702", accent: "#fb923c"
      },
      enemies: ["sanguine_executioner", "basalt_behemoth", "abyssal_crab", "pendulum_titan"],
      bossId: "pyrax_ash_wyrm",
      lootPool: ["plague_censer", "aether_railcannon", "chrono_twin_revolvers", "nether_frost_staff", "chronos_scepter"],
      lootSummary: ["90s Non-Stop Siege", "Censer & Rail-Cannon", "Elite Loot Rain"]
    },
    {
      id: "cursed_vault_trials",
      name: "Cursed Vault: Glass Trials",
      isSpecial: true,
      specialMode: "cursed_vault",
      themeLabel: "★ Special • -50% Heal",
      themeColor: "#c084fc",
      dropClass: "all",
      desc: "High-lethality treasure vault: Healing & Shields are reduced by 50%, every room holds Champions/Goblins/Shrines, and Shard drops are tripled!",
      rooms: 5,
      recommendedPower: 16000,
      baseGold: 22000,
      baseShards: 2400,
      baseXp: 30000,
      hazard: {
        type: "voidcore",
        name: "Cursed Collapse",
        icon: "💀",
        cssOverlay: "hazard-voidcore",
        barTheme: "theme-voidcore",
        shortDesc: "Cursed Vault: Healing & Shields -50%. Reality Collapses every 12s—shelter in Reality Anchors!",
        tip: "Healing is halved! Use Reality Anchors and burst down Champions & Goblins.",
        cycleSeconds: 12.0,
        collapseDmgPct: 0.34
      },
      palette: {
        bgTop: "#160724", bgBottom: "#07020d", tileA: "#26103b", tileB: "#1c0b2b", tileBorder: "#0f0517",
        wallTop: "#c084fc", wallLeft: "#6b21a8", wallRight: "#3b0764", pillarTop: "#ffd447", chasm: "#0a0212", accent: "#e879f9"
      },
      enemies: ["mirror_phantom", "prism_golem", "rift_harbinger", "singularity_titan"],
      bossId: "omega_rift_origin",
      lootPool: ["riftlord_pistols", "apocalypse_grimoire", "omega_riftblade", "primordial_carapace", "genesis_core_relic"],
      lootSummary: ["3x Rift Shards", "Pistols & Apocalypse Tome", "Mythic Signature Gear"]
    },

    /* --- T1 – T14 CAMPAIGN DUNGEONS --- */
    {
      id: "sunken_quarry", name: "Sunken Quarry", themeLabel: "T1 • Earth / Crystal", themeColor: "#38bdf8", dropClass: "vanguard",
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
      id: "cinder_foundry", name: "Cinder Foundry", themeLabel: "T2 • Fire / Clockwork", themeColor: "#f97316", dropClass: "shadowblade",
      desc: "Superheated dwarven blast furnaces suspended above molten slag rivers.",
      rooms: 4, recommendedPower: 480, baseGold: 245, baseShards: 22, baseXp: 270,
      hazard: {
        type: "heat", name: "Core Overheat", icon: "🔥", cssOverlay: "hazard-heat", barTheme: "theme-heat",
        shortDesc: "Overheat Meter: Standing still builds scorching heat; moving & dashing cools down.",
        tip: "Keep moving or dash to vent heat! At 100% you suffer burn damage.",
        idleHeatPerSec: 21.0, moveCoolPerSec: 28.0, dashCoolBurst: 36.0, burnDpsPct: 0.055
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
      id: "whispering_marsh", name: "Whispering Marsh", themeLabel: "T3 • Poison / Bio", themeColor: "#22c55e", dropClass: "warden",
      desc: "Bioluminescent fungal wetlands linked by moss bridges over toxic bogs.",
      rooms: 5, recommendedPower: 760, baseGold: 420, baseShards: 36, baseXp: 460,
      hazard: {
        type: "poison", name: "Toxin Exposure", icon: "☣", cssOverlay: "hazard-poison", barTheme: "theme-poison",
        shortDesc: "Toxic Spores: Expanding venom pools erupt across the floor; avoid or out-heal them.",
        tip: "Dodge expanding green spore pools or use Lifesteal / Survival Flasks.",
        poolSpawnInterval: 4.2, poolMaxRadius: 2.35, toxinGainInPool: 34.0, toxinDecayPerSec: 20.0, poisonDpsPct: 0.055
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
      id: "astral_observatory", name: "Astral Observatory", themeLabel: "T4 • Void / Gravity", themeColor: "#c084fc", dropClass: "arcanist",
      desc: "A shattered celestial spire suspended over a void where gravity flips every 15s.",
      rooms: 5, recommendedPower: 1150, baseGold: 710, baseShards: 60, baseXp: 790,
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
      id: "frostbite_sanctum", name: "Frostbite Sanctum", themeLabel: "T5 • Ice / Glacial", themeColor: "#7dd3fc", dropClass: "vanguard",
      desc: "A frozen citadel swept by sub-zero blizzards that numb limbs away from warming braziers.",
      rooms: 5, recommendedPower: 1680, baseGold: 1120, baseShards: 94, baseXp: 1280,
      hazard: {
        type: "frost", name: "Hypothermia", icon: "❄", cssOverlay: "hazard-frost", barTheme: "theme-frost",
        shortDesc: "Hypothermia Chill: Frost stacks up away from Fire Braziers, slowing speed & dealing frostbite.",
        tip: "Warm up near glowing orange Fire Braziers to thaw Hypothermia.",
        chillPerSec: 10.5, thawPerSec: 42.0, frostDpsPct: 0.058
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
      id: "abyssal_throne", name: "Abyssal Throne", themeLabel: "T6 • Shadow / Eclipse", themeColor: "#e879f9", dropClass: "warden",
      desc: "The heart of the Rift where encroaching eclipse corruption tests ascended champions.",
      rooms: 6, recommendedPower: 2350, baseGold: 1740, baseShards: 142, baseXp: 2050,
      hazard: {
        type: "shadow", name: "Eclipse Corruption", icon: "☾", cssOverlay: "hazard-shadow", barTheme: "theme-shadow",
        shortDesc: "Eclipse Corruption: Darkness steadily corrupts your soul; touch Radiant Light Orbs to purge it.",
        tip: "Collect floating golden Light Orbs in the arena to purge Eclipse Corruption.",
        corruptPerSec: 8.8, orbPurgeAmount: 52.0, corruptDpsPct: 0.06
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
      id: "stormspire_citadel", name: "Stormspire Citadel", themeLabel: "T7 • Storm / Lightning", themeColor: "#38bdf8", dropClass: "shadowblade",
      desc: "A cloud-piercing sky fortress lashed by perpetual thunderbolts and living arc-constructs.",
      rooms: 6, recommendedPower: 3200, baseGold: 2650, baseShards: 210, baseXp: 3150,
      hazard: {
        type: "storm", name: "Static Overload", icon: "⚡", cssOverlay: "hazard-storm", barTheme: "theme-storm",
        shortDesc: "Static Overload: Storm charge builds up; stand near Copper Conduits or Dash to discharge before 100%.",
        tip: "Discharge static at glowing Copper Conduits or by Dashing before a bolt strikes you!",
        chargePerSec: 12.2, dischargePerSec: 46.0, dashDischarge: 28.0, strikeDmgPct: 0.22
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
      id: "celestial_crucible", name: "Celestial Crucible", themeLabel: "T8 • Radiant / Solar", themeColor: "#fde047", dropClass: "arcanist",
      desc: "A golden sun-forged apex where blinding solar flares incinerate all outside Umbral Wards.",
      rooms: 6, recommendedPower: 4250, baseGold: 3900, baseShards: 300, baseXp: 4750,
      hazard: {
        type: "solar", name: "Solar Flare Charge", icon: "☀", cssOverlay: "hazard-solar", barTheme: "theme-solar",
        shortDesc: "Solar Flare: Every 14s a searing sun-wave sweeps the arena. Shelter inside purple Umbral Wards!",
        tip: "Step inside glowing purple Umbral Wards before Solar Charge hits 100%!",
        cycleSeconds: 14.0, flareDmgPct: 0.30
      },
      palette: {
        bgTop: "#241908", bgBottom: "#100a03", tileA: "#3d2f18", tileB: "#302412", tileBorder: "#1c1409",
        wallTop: "#f59e0b", wallLeft: "#854d0e", wallRight: "#451a03", pillarTop: "#fef08a", chasm: "#1c1204", accent: "#fde047"
      },
      enemies: ["seraph_lancer", "radiant_warden", "prism_cherub"],
      bossId: "solarius_architect",
      lootPool: ["dawnstar_greatsword", "seraphic_aegis", "infinity_hourglass_relic"],
      lootSummary: ["Dawnstar Greatsword", "Seraphic Aegis", "Infinity Hourglass"]
    },
    {
      id: "crimson_catacombs", name: "Crimson Catacombs", themeLabel: "T9 • Blood / Gothic", themeColor: "#ef4444", dropClass: "vanguard",
      desc: "Sanguine vaults beneath a fallen cathedral where cursed blood-mist drains the hesitant.",
      rooms: 6, recommendedPower: 5500, baseGold: 5600, baseShards: 420, baseXp: 6900,
      hazard: {
        type: "blood", name: "Blood Tithe", icon: "🩸", cssOverlay: "hazard-blood", barTheme: "theme-blood",
        shortDesc: "Blood Tithe: Sanguine curse rises steadily; slay enemies or stand inside Sanguine Fonts to purge.",
        tip: "Stay aggressive! Slaying foes or entering crimson Sanguine Fonts purges Blood Tithe.",
        cursePerSec: 9.5, killPurgeAmount: 24.0, fontPurgePerSec: 44.0, bleedDpsPct: 0.06
      },
      palette: {
        bgTop: "#1f080d", bgBottom: "#0b0305", tileA: "#33141b", tileB: "#260e14", tileBorder: "#140609",
        wallTop: "#b91c1c", wallLeft: "#7f1d1d", wallRight: "#450a0a", pillarTop: "#fb7185", chasm: "#240409", accent: "#ef4444"
      },
      enemies: ["blood_ghoul", "sanguine_executioner", "crimson_cantor"],
      bossId: "vladimir_blood_duke",
      lootPool: ["sanguine_greataxe", "bloodlord_plate", "crimson_chalice_relic"],
      lootSummary: ["Sanguine Greataxe", "Bloodlord Plate", "Crimson Chalice"]
    },
    {
      id: "ashen_caldera", name: "Ashen Caldera", themeLabel: "T10 • Ash / Volcanic", themeColor: "#fb923c", dropClass: "shadowblade",
      desc: "A collapsing volcanic crater shrouded in choking pyroclastic soot and obsidian fissures.",
      rooms: 6, recommendedPower: 7000, baseGold: 7900, baseShards: 580, baseXp: 9800,
      hazard: {
        type: "ash", name: "Pyroclastic Ash", icon: "🌋", cssOverlay: "hazard-ash", barTheme: "theme-ash",
        shortDesc: "Pyroclastic Ash: Choking ash pools erupt across the caldera; Dash or stand near Wind Vents to clear soot.",
        tip: "Avoid glowing ash clouds and Dash to shake off choking soot before it hits 100%.",
        poolSpawnInterval: 3.8, poolMaxRadius: 2.5, ashGainPerSec: 7.5, ashGainInPool: 30.0, dashClear: 30.0, ventClearPerSec: 45.0, ashDpsPct: 0.062
      },
      palette: {
        bgTop: "#1a1310", bgBottom: "#090706", tileA: "#2b2320", tileB: "#211b18", tileBorder: "#120e0d",
        wallTop: "#a8a29e", wallLeft: "#57534e", wallRight: "#292524", pillarTop: "#fb923c", chasm: "#7c2d12", accent: "#fb923c"
      },
      enemies: ["cinder_stalker", "basalt_behemoth", "magma_weaver"],
      bossId: "pyrax_ash_wyrm",
      lootPool: ["obsidian_daggers", "ashwalker_garb", "volcanic_heart_relic"],
      lootSummary: ["Obsidian Fangs", "Ashwalker Garb", "Volcanic Heart"]
    },
    {
      id: "sunken_leviathan", name: "Sunken Leviathan", themeLabel: "T11 • Abyssal Sea", themeColor: "#0ea5e9", dropClass: "warden",
      desc: "The drowned ribcage of an ancient sea god crushed under five miles of abyssal ocean.",
      rooms: 6, recommendedPower: 8800, baseGold: 11000, baseShards: 790, baseXp: 13800,
      hazard: {
        type: "pressure", name: "Abyssal Pressure", icon: "🌊", cssOverlay: "hazard-pressure", barTheme: "theme-pressure",
        shortDesc: "Crush Depth: Ocean pressure climbs continuously; step inside glowing Air Domes to equalize pressure.",
        tip: "Equalize pressure inside turquoise Air Domes before crushing depth damages you!",
        risePerSec: 11.0, equalizePerSec: 48.0, crushDpsPct: 0.065
      },
      palette: {
        bgTop: "#061926", bgBottom: "#020b12", tileA: "#102d40", tileB: "#0c2230", tileBorder: "#06131c",
        wallTop: "#0284c7", wallLeft: "#075985", wallRight: "#0c4a6e", pillarTop: "#67e8f9", chasm: "#031524", accent: "#0ea5e9"
      },
      enemies: ["trench_ripper", "abyssal_crab", "siren_wisp"],
      bossId: "thalassa_leviathan",
      lootPool: ["abyssal_trident", "leviathan_scale", "tidal_pearl_relic"],
      lootSummary: ["Abyssal Trident", "Leviathan Scale", "Tidal Pearl"]
    },
    {
      id: "shattered_clockwork", name: "Shattered Clockwork", themeLabel: "T12 • Chrono / Brass", themeColor: "#facc15", dropClass: "arcanist",
      desc: "A fractured temporal engine suspended inside giant bronze gears where time warps every 12s.",
      rooms: 6, recommendedPower: 11000, baseGold: 15200, baseShards: 1060, baseXp: 19200,
      hazard: {
        type: "chrono", name: "Temporal Flux", icon: "⚙", cssOverlay: "hazard-chrono", barTheme: "theme-chrono",
        shortDesc: "Temporal Desync: Shifts every 12s between Overdrive (+30% Speed & +15% CDR) and Dilation (+40% Skill DMG, -20% Speed).",
        tip: "Chain dashes during Overdrive, then unleash massive Q/E combos during Dilation!",
        cycleSeconds: 12.0, overdriveSpeedBonus: 0.30, overdriveCdrBonus: 0.15, dilationDmgBonus: 0.40, dilationSpeedPenalty: 0.20
      },
      palette: {
        bgTop: "#1a170b", bgBottom: "#090804", tileA: "#2e2918", tileB: "#242012", tileBorder: "#141209",
        wallTop: "#eab308", wallLeft: "#854d0e", wallRight: "#422006", pillarTop: "#38bdf8", chasm: "#0a1624", accent: "#facc15"
      },
      enemies: ["chrono_spider", "pendulum_titan", "gear_arcanist"],
      bossId: "kronos_horologist",
      lootPool: ["chronos_scepter", "clockwork_mantle", "paradox_gear_relic"],
      lootSummary: ["Chronos Scepter", "Clockwork Mantle", "Paradox Gear"]
    },
    {
      id: "mirror_labyrinth", name: "Mirror Labyrinth", themeLabel: "T13 • Prism / Astral", themeColor: "#f472b6", dropClass: "all",
      desc: "A kaleidoscopic crystal hall where blinding prism reflections test masters of every discipline.",
      rooms: 6, recommendedPower: 13600, baseGold: 20800, baseShards: 1420, baseXp: 26500,
      hazard: {
        type: "prism", name: "Refraction Glare", icon: "💎", cssOverlay: "hazard-prism", barTheme: "theme-prism",
        shortDesc: "Prism Glare: Blinding light intensifies continuously; shatter floating Prism Orbs or Dash to stay clear.",
        tip: "Collect shimmering Prism Orbs or Dash frequently to disperse blinding Refraction Glare.",
        glarePerSec: 10.5, orbClearAmount: 55.0, dashClear: 22.0, glareDpsPct: 0.065
      },
      palette: {
        bgTop: "#1b0d26", bgBottom: "#090410", tileA: "#2a1b3d", tileB: "#211430", tileBorder: "#120a1c",
        wallTop: "#ec4899", wallLeft: "#6366f1", wallRight: "#312e81", pillarTop: "#fde047", chasm: "#140826", accent: "#f472b6"
      },
      enemies: ["mirror_phantom", "prism_golem", "refraction_mage"],
      bossId: "auriel_prism_monarch",
      lootPool: ["prismatic_glaive", "mirrorweave_armor", "kaleidoscope_relic"],
      lootSummary: ["Prismatic Glaive", "Mirrorweave Armor", "Kaleidoscope Core"]
    },
    {
      id: "primordial_singularity", name: "Primordial Singularity", themeLabel: "T14 • Voidcore / Gate", themeColor: "#fb7185", dropClass: "all",
      desc: "The origin wound of the Rift itself — periodic reality collapses annihilate all outside Reality Anchors.",
      rooms: 7, recommendedPower: 16800, baseGold: 29000, baseShards: 1950, baseXp: 37000,
      hazard: {
        type: "voidcore", name: "Reality Collapse", icon: "◎", cssOverlay: "hazard-voidcore", barTheme: "theme-voidcore",
        shortDesc: "Reality Collapse: Every 13s a primordial shockwave tears across the void. Shelter inside Reality Anchors!",
        tip: "Rush into glowing gold-violet Reality Anchors before Collapse Charge reaches 100%!",
        cycleSeconds: 13.0, collapseDmgPct: 0.34
      },
      palette: {
        bgTop: "#1a061c", bgBottom: "#07010a", tileA: "#29102e", tileB: "#1f0b24", tileBorder: "#110514",
        wallTop: "#fb7185", wallLeft: "#7e22ce", wallRight: "#3b0764", pillarTop: "#fde047", chasm: "#09010d", accent: "#fb7185"
      },
      enemies: ["rift_harbinger", "singularity_titan", "star_devourer"],
      bossId: "omega_rift_origin",
      lootPool: ["omega_riftblade", "primordial_carapace", "genesis_core_relic"],
      lootSummary: ["Omega Riftblade", "Primordial Carapace", "Genesis Core"]
    },

    /* --- T15 – T20 DEEP ENDGAME CAMPAIGN DUNGEONS --- */
    {
      id: "astral_necropolis", name: "Astral Necropolis", themeLabel: "T15 • Necrotic / Soul", themeColor: "#34d399", dropClass: "warden",
      desc: "A floating ossuary of dead titans where necrotic soul-rot withers any who stray from Soul Lanterns.",
      rooms: 7, recommendedPower: 22000, baseGold: 41000, baseShards: 2650, baseXp: 51000,
      hazard: {
        type: "necrotic", name: "Soul-Rot Miasma", icon: "☠", cssOverlay: "hazard-necrotic", barTheme: "theme-necrotic",
        shortDesc: "Soul-Rot: Necrotic decay builds rapidly; slay foes or stand inside emerald Soul Lanterns to cleanse.",
        tip: "Cleanse Soul-Rot inside emerald Soul Lanterns or by slaying undead enemies!",
        rotPerSec: 11.5, killPurgeAmount: 22.0, lanternPurgePerSec: 48.0, rotDpsPct: 0.068
      },
      palette: {
        bgTop: "#061c17", bgBottom: "#020a08", tileA: "#102e26", tileB: "#0b241d", tileBorder: "#051410",
        wallTop: "#10b981", wallLeft: "#065f46", wallRight: "#022c22", pillarTop: "#a7f3d0", chasm: "#031712", accent: "#34d399"
      },
      enemies: ["bone_colossus", "soul_reaper", "lich_hierophant"],
      bossId: "malkorath_undying",
      lootPool: ["necrotic_scythe", "soulforged_shroud", "phylactery_relic"],
      lootSummary: ["Soul-Severing Scythe", "Soul-Forged Shroud", "Lich Phylactery"]
    },
    {
      id: "eldritch_abyss", name: "Eldritch Abyss", themeLabel: "T16 • Eldritch / Void", themeColor: "#e879f9", dropClass: "arcanist",
      desc: "A non-Euclidean nightmare trench watched by a thousand cosmic eyes that fracture mortal sanity.",
      rooms: 7, recommendedPower: 29000, baseGold: 57000, baseShards: 3550, baseXp: 70000,
      hazard: {
        type: "madness", name: "Eldritch Frenzy", icon: "👁", cssOverlay: "hazard-madness", barTheme: "theme-madness",
        shortDesc: "Eldritch Gaze: Madness climbs steadily; touch Lucid Eye Orbs or Dash to stay sane before Mind-Shatter!",
        tip: "Collect glowing Lucid Eye Orbs or Dash frequently to prevent Mind-Shatter bursts!",
        madnessPerSec: 12.5, orbClearAmount: 55.0, dashClear: 24.0, shatterDmgPct: 0.28
      },
      palette: {
        bgTop: "#150726", bgBottom: "#06020d", tileA: "#24103d", tileB: "#1b0b2e", tileBorder: "#0f051a",
        wallTop: "#a855f7", wallLeft: "#581c87", wallRight: "#2e1065", pillarTop: "#f5d0fe", chasm: "#0b0217", accent: "#e879f9"
      },
      enemies: ["mind_flayer", "tentacle_horror", "void_oracle"],
      bossId: "azathor_abyssal_eye",
      lootPool: ["eldritch_codex", "abyssal_mantle", "allseeing_eye_relic"],
      lootSummary: ["Necronomicon Codex", "Abyssal Mantle", "All-Seeing Eye"]
    },
    {
      id: "dragons_apex", name: "Dragon's Apex", themeLabel: "T17 • Dragonfire / Sky", themeColor: "#fb923c", dropClass: "vanguard",
      desc: "The volcanic sky-throne of ancient wyrms where dragon-breath scorches all outside Frost-Scale Wards.",
      rooms: 7, recommendedPower: 38000, baseGold: 79000, baseShards: 4750, baseXp: 96000,
      hazard: {
        type: "dragon", name: "Wyrm-Scorch Heat", icon: "🐉", cssOverlay: "hazard-dragon", barTheme: "theme-dragon",
        shortDesc: "Wyrm-Scorch: Dragonfire builds unless moving, Dashing, or cooling inside Frost-Scale Wards.",
        tip: "Keep moving or stand in Frost-Scale Wards to extinguish Wyrm-Scorch!",
        heatPerSec: 16.0, moveCoolPerSec: 22.0, wardCoolPerSec: 52.0, dashCool: 32.0, scorchDpsPct: 0.072
      },
      palette: {
        bgTop: "#240e06", bgBottom: "#0d0402", tileA: "#38180d", tileB: "#2b1209", tileBorder: "#170904",
        wallTop: "#f97316", wallLeft: "#9a3412", wallRight: "#431407", pillarTop: "#fef08a", chasm: "#5c1606", accent: "#fb923c"
      },
      enemies: ["drake_wyvern", "dragonkin_knight", "flame_breath_wyrm"],
      bossId: "ignis_draco_emperor",
      lootPool: ["dragon_slayer_blade", "dragonscale_plate", "dragon_heart_relic"],
      lootSummary: ["Wyrm-Slayer Greatsword", "Dragonscale Plate", "Ignis Dragon Heart"]
    },
    {
      id: "chaos_nexus", name: "Chaos Nexus", themeLabel: "T18 • Entropy / Rift", themeColor: "#f43f5e", dropClass: "shadowblade",
      desc: "A volatile dimensional crossroads where wild entropy flips combat physics every 10 seconds.",
      rooms: 7, recommendedPower: 50000, baseGold: 110000, baseShards: 6300, baseXp: 132000,
      hazard: {
        type: "entropy", name: "Entropy Polarity", icon: "⚡", cssOverlay: "hazard-entropy", barTheme: "theme-entropy",
        shortDesc: "Entropy Shift: Alternates every 10s between Surge (+45% Crit, +35% Spd) and Collapse (+55% DMG, -25% Spd).",
        tip: "Exploit Surge mobility and unleash devastating crits during Collapse!",
        cycleSeconds: 10.0, surgeCritBonus: 0.45, surgeSpeedBonus: 0.35, collapseDmgBonus: 0.55, collapseSpeedPenalty: 0.25
      },
      palette: {
        bgTop: "#1f0816", bgBottom: "#090206", tileA: "#301224", tileB: "#240c1b", tileBorder: "#14060e",
        wallTop: "#f43f5e", wallLeft: "#881337", wallRight: "#3b0764", pillarTop: "#38bdf8", chasm: "#120312", accent: "#f43f5e"
      },
      enemies: ["chaos_stalker", "entropy_golem", "rift_warlock"],
      bossId: "khaos_unbound",
      lootPool: ["chaos_twinblades", "entropy_vestments", "chaos_orb_relic"],
      lootSummary: ["Entropy Twinblades", "Chaos-Weaver Garb", "Unbound Chaos Orb"]
    },
    {
      id: "pantheon_of_gods", name: "Pantheon of Gods", themeLabel: "T19 • Divine / Astral", themeColor: "#fde047", dropClass: "all",
      desc: "The marble citadel of the Astral Pantheon where divine judgment incinerates all outside Sanctified Pillars.",
      rooms: 7, recommendedPower: 64000, baseGold: 152000, baseShards: 8400, baseXp: 180000,
      hazard: {
        type: "divine", name: "Divine Judgment", icon: "👑", cssOverlay: "hazard-divine", barTheme: "theme-divine",
        shortDesc: "Divine Wrath: Every 12s blinding judgment strikes the arena. Shelter inside Sanctified Pillars!",
        tip: "Rush into golden Sanctified Pillars before Divine Judgment hits 100%!",
        cycleSeconds: 12.0, wrathDmgPct: 0.38
      },
      palette: {
        bgTop: "#241b08", bgBottom: "#0d0902", tileA: "#3b2f16", tileB: "#2e2410", tileBorder: "#1a1408",
        wallTop: "#fde047", wallLeft: "#b45309", wallRight: "#78350f", pillarTop: "#ffffff", chasm: "#1c1404", accent: "#fde047"
      },
      enemies: ["valkyrie_seraph", "divine_archon", "celestial_sentinel"],
      bossId: "aurelius_god_king",
      lootPool: ["godslayer_halberd", "aegis_of_pantheon", "divine_crown_relic"],
      lootSummary: ["God-Slayer Halberd", "Aegis of Pantheon", "Astral Crown"]
    },
    {
      id: "the_rift_terminus", name: "The Rift Terminus", themeLabel: "T20 • Oblivion / Final", themeColor: "#ff3b5c", dropClass: "all",
      desc: "The absolute end of all timelines — twin reality collapses and void storms test true legends of Riftfall.",
      rooms: 8, recommendedPower: 80000, baseGold: 215000, baseShards: 11500, baseXp: 250000,
      hazard: {
        type: "oblivion", name: "Oblivion Collapse", icon: "❖", cssOverlay: "hazard-oblivion", barTheme: "theme-oblivion",
        shortDesc: "Oblivion Collapse: Every 11s an annihilating void wave detonates. Shelter inside Genesis Beacons!",
        tip: "Sprint into glowing Genesis Beacons before Oblivion Collapse hits 100%!",
        cycleSeconds: 11.0, oblivionDmgPct: 0.42
      },
      palette: {
        bgTop: "#17041c", bgBottom: "#050108", tileA: "#260b2e", tileB: "#1b0721", tileBorder: "#0d0312",
        wallTop: "#ff3b5c", wallLeft: "#6b21a8", wallRight: "#1e052b", pillarTop: "#ffd447", chasm: "#07010a", accent: "#ff3b5c"
      },
      enemies: ["oblivion_reaper", "terminus_colossus", "omega_seraph"],
      bossId: "nihilus_void_god",
      lootPool: ["terminus_eternity_blade", "oblivion_sovereign_plate", "void_heart_relic"],
      lootSummary: ["Terminus Eternity Blade", "Oblivion Sovereign Plate", "Heart of Oblivion"]
    }
  ],

  /* ------------------------------------------------------------------------
     60 ENEMY TEMPLATES (T1 – T20 Progression + Endgame Armor Penetration)
     ------------------------------------------------------------------------ */
  ENEMIES: {
    crystal_crawler:      { id: "crystal_crawler",      name: "Crystal Crawler",      hp: 85,     atk: 14,   speed: 3.1,  range: 1.05, attackCd: 1.15, radius: 0.42, height: 0.65, ai: "chaser",  color: "#38bdf8", trim: "#bae6fd", gold: 14,    xp: 18 },
    quarry_golem:         { id: "quarry_golem",         name: "Quarry Golem",         hp: 160,    atk: 24,   speed: 1.9,  range: 1.35, attackCd: 1.8,  radius: 0.56, height: 1.15, ai: "bruiser", color: "#64748b", trim: "#38bdf8", gold: 25,    xp: 30 },
    prism_slinger:        { id: "prism_slinger",        name: "Prism Slinger",        hp: 75,     atk: 18,   speed: 2.3,  range: 5.6,  attackCd: 2.0,  radius: 0.4,  height: 0.9,  ai: "ranged",  projColor: "#7dd3fc", projSpeed: 6.4, color: "#0ea5e9", trim: "#e0f2fe", gold: 19,    xp: 24 },

    clockwork_hound:      { id: "clockwork_hound",      name: "Clockwork Hound",      hp: 160,    atk: 25,   speed: 3.7,  range: 1.05, attackCd: 0.98, radius: 0.42, height: 0.65, ai: "chaser",  color: "#d97706", trim: "#fef08a", gold: 27,    xp: 34 },
    slag_brutes:          { id: "slag_brutes",          name: "Slag Automaton",       hp: 305,    atk: 38,   speed: 2.1,  range: 1.4,  attackCd: 1.75, radius: 0.6,  height: 1.25, ai: "bruiser", color: "#9a3412", trim: "#fb923c", gold: 42,    xp: 50 },
    ember_turret:         { id: "ember_turret",         name: "Ember Artificer",      hp: 142,    atk: 30,   speed: 2.2,  range: 6.2,  attackCd: 1.85, radius: 0.44, height: 0.95, ai: "ranged",  projColor: "#f97316", projSpeed: 7.2, color: "#ea580c", trim: "#fde68a", gold: 33,    xp: 40 },

    spore_stalker:        { id: "spore_stalker",        name: "Spore Stalker",        hp: 285,    atk: 42,   speed: 3.5,  range: 1.1,  attackCd: 1.0,  radius: 0.44, height: 0.85, ai: "chaser",  color: "#15803d", trim: "#86efac", gold: 48,    xp: 60 },
    mire_hulk:            { id: "mire_hulk",            name: "Mire Hulk",            hp: 530,    atk: 58,   speed: 2.0,  range: 1.45, attackCd: 1.8,  radius: 0.62, height: 1.35, ai: "bruiser", color: "#14532d", trim: "#a3e635", gold: 70,    xp: 86 },
    blight_spitter:       { id: "blight_spitter",       name: "Blight Spitter",       hp: 250,    atk: 49,   speed: 2.35, range: 6.4,  attackCd: 1.8,  radius: 0.44, height: 0.95, ai: "ranged",  projColor: "#84cc16", projSpeed: 7.0, color: "#4d7c0f", trim: "#d9f99d", gold: 56,    xp: 70 },

    void_wraith:          { id: "void_wraith",          name: "Void Wraith",          hp: 490,    atk: 66,   speed: 3.8,  range: 1.15, attackCd: 0.96, radius: 0.44, height: 1.05, ai: "chaser",  color: "#7e22ce", trim: "#f0abfc", gold: 82,    xp: 105 },
    astral_sentinel:      { id: "astral_sentinel",      name: "Astral Sentinel",      hp: 890,    atk: 88,   speed: 2.3,  range: 1.5,  attackCd: 1.7,  radius: 0.64, height: 1.45, ai: "bruiser", color: "#4c1d95", trim: "#38bdf8", gold: 120,   xp: 148 },
    pulsar_orb:           { id: "pulsar_orb",           name: "Pulsar Construct",     hp: 430,    atk: 78,   speed: 2.6,  range: 6.8,  attackCd: 1.65, radius: 0.45, height: 1.0,  ai: "ranged",  projColor: "#e879f9", projSpeed: 7.8, color: "#a21caf", trim: "#fde047", gold: 98,    xp: 122 },

    frost_wolf:           { id: "frost_wolf",           name: "Rime Direwolf",        hp: 760,    atk: 96,   speed: 4.0,  range: 1.15, attackCd: 0.92, radius: 0.44, height: 0.85, ai: "chaser",  color: "#0284c7", trim: "#e0f2fe", gold: 135,   xp: 170 },
    glacial_juggernaut:   { id: "glacial_juggernaut",   name: "Glacial Juggernaut",   hp: 1400,   atk: 126,  speed: 2.15, range: 1.5,  attackCd: 1.7,  radius: 0.66, height: 1.5,  ai: "bruiser", color: "#1e3a8a", trim: "#7dd3fc", gold: 195,   xp: 235 },
    icicle_weaver:        { id: "icicle_weaver",        name: "Icicle Weaver",        hp: 680,    atk: 110,  speed: 2.5,  range: 7.0,  attackCd: 1.6,  radius: 0.44, height: 1.0,  ai: "ranged",  projColor: "#bae6fd", projSpeed: 8.4, color: "#0369a1", trim: "#f0f9ff", gold: 158,   xp: 195 },

    abyssal_stalker:      { id: "abyssal_stalker",      name: "Eclipse Fiend",        hp: 1180,   atk: 135,  speed: 4.15, range: 1.2,  attackCd: 0.9,  radius: 0.46, height: 1.1,  ai: "chaser",  color: "#581c87", trim: "#f43f5e", gold: 215,   xp: 265 },
    dread_knight:         { id: "dread_knight",         name: "Abyssal Dreadknight",  hp: 2160,   atk: 175,  speed: 2.4,  range: 1.55, attackCd: 1.6,  radius: 0.68, height: 1.55, ai: "bruiser", color: "#1e1b4b", trim: "#e879f9", gold: 305,   xp: 370 },
    eclipse_acolyte:      { id: "eclipse_acolyte",      name: "Eclipse Acolyte",      hp: 1060,   atk: 155,  speed: 2.65, range: 7.2,  attackCd: 1.55, radius: 0.45, height: 1.05, ai: "ranged",  projColor: "#f43f5e", projSpeed: 8.6, color: "#831843", trim: "#fda4af", gold: 250,   xp: 305 },

    volt_imp:             { id: "volt_imp",             name: "Volt Spark-Imp",       hp: 1780,   atk: 180,  speed: 4.35, range: 1.2,  attackCd: 0.88, radius: 0.44, height: 0.95, ai: "chaser",  color: "#0284c7", trim: "#fde047", gold: 330,   xp: 410 },
    thunder_colossus:     { id: "thunder_colossus",     name: "Thunder Automaton",    hp: 3250,   atk: 230,  speed: 2.5,  range: 1.6,  attackCd: 1.55, radius: 0.7,  height: 1.6,  ai: "bruiser", color: "#1e3a8a", trim: "#38bdf8", gold: 465,   xp: 560 },
    arc_pylon:            { id: "arc_pylon",            name: "Arc Conduit",          hp: 1620,   atk: 205,  speed: 2.75, range: 7.4,  attackCd: 1.5,  radius: 0.46, height: 1.15, ai: "ranged",  projColor: "#fde047", projSpeed: 9.2, color: "#0369a1", trim: "#fef08a", gold: 380,   xp: 465 },

    seraph_lancer:        { id: "seraph_lancer",        name: "Seraph Lancer",        hp: 2650,   atk: 235,  speed: 4.45, range: 1.35, attackCd: 0.85, radius: 0.46, height: 1.2,  ai: "chaser",  color: "#b45309", trim: "#fef08a", gold: 500,   xp: 610 },
    radiant_warden:       { id: "radiant_warden",       name: "Radiant Templar",      hp: 4800,   atk: 298,  speed: 2.6,  range: 1.65, attackCd: 1.5,  radius: 0.72, height: 1.68, ai: "bruiser", color: "#78350f", trim: "#fde047", gold: 700,   xp: 840 },
    prism_cherub:         { id: "prism_cherub",         name: "Solar Cherub",         hp: 2400,   atk: 265,  speed: 2.9,  range: 7.6,  attackCd: 1.45, radius: 0.46, height: 1.15, ai: "ranged",  projColor: "#fef08a", projSpeed: 9.6, color: "#d97706", trim: "#ffffff", gold: 575,   xp: 695 },

    blood_ghoul:          { id: "blood_ghoul",          name: "Sanguine Thrall",      hp: 3850,   atk: 295,  speed: 4.5,  range: 1.25, attackCd: 0.84, radius: 0.45, height: 1.05, ai: "chaser",  color: "#991b1b", trim: "#fda4af", gold: 730,   xp: 890 },
    sanguine_executioner: { id: "sanguine_executioner", name: "Crimson Executioner",  hp: 6950,   atk: 375,  speed: 2.65, range: 1.65, attackCd: 1.48, radius: 0.72, height: 1.65, ai: "bruiser", color: "#7f1d1d", trim: "#fb7185", gold: 1020,  xp: 1220 },
    crimson_cantor:       { id: "crimson_cantor",       name: "Blood Cantor",         hp: 3500,   atk: 335,  speed: 2.9,  range: 7.6,  attackCd: 1.42, radius: 0.46, height: 1.1,  ai: "ranged",  projColor: "#f43f5e", projSpeed: 9.8, color: "#be123c", trim: "#fecdd3", gold: 840,   xp: 1010 },

    cinder_stalker:       { id: "cinder_stalker",       name: "Ash Stalker",          hp: 5450,   atk: 365,  speed: 4.6,  range: 1.25, attackCd: 0.82, radius: 0.45, height: 1.0,  ai: "chaser",  color: "#57534e", trim: "#fb923c", gold: 1040,  xp: 1260 },
    basalt_behemoth:      { id: "basalt_behemoth",      name: "Basalt Behemoth",      hp: 9800,   atk: 465,  speed: 2.55, range: 1.7,  attackCd: 1.48, radius: 0.74, height: 1.72, ai: "bruiser", color: "#292524", trim: "#f97316", gold: 1450,  xp: 1740 },
    magma_weaver:         { id: "magma_weaver",         name: "Pyroclast Weaver",     hp: 4950,   atk: 415,  speed: 2.95, range: 7.8,  attackCd: 1.4,  radius: 0.46, height: 1.12, ai: "ranged",  projColor: "#fb923c", projSpeed: 10.0,color: "#9a3412", trim: "#fed7aa", gold: 1190,  xp: 1440 },

    trench_ripper:        { id: "trench_ripper",        name: "Trench Ripper",        hp: 7600,   atk: 445,  speed: 4.65, range: 1.3,  attackCd: 0.82, radius: 0.46, height: 1.05, ai: "chaser",  armorPen: 0.08, color: "#0369a1", trim: "#67e8f9", gold: 1460,  xp: 1780 },
    abyssal_crab:         { id: "abyssal_crab",         name: "Leviathan Crusher",    hp: 13600,  atk: 565,  speed: 2.6,  range: 1.7,  attackCd: 1.45, radius: 0.75, height: 1.72, ai: "bruiser", armorPen: 0.10, color: "#0c4a6e", trim: "#38bdf8", gold: 2040,  xp: 2450 },
    siren_wisp:           { id: "siren_wisp",           name: "Abyssal Siren",        hp: 6900,   atk: 505,  speed: 3.0,  range: 7.8,  attackCd: 1.38, radius: 0.46, height: 1.15, ai: "ranged",  armorPen: 0.08, projColor: "#38bdf8", projSpeed: 10.2,color: "#0e7490", trim: "#cffafe", gold: 1680,  xp: 2040 },

    chrono_spider:        { id: "chrono_spider",        name: "Chrono Skitterer",     hp: 10500,  atk: 535,  speed: 4.75, range: 1.3,  attackCd: 0.8,  radius: 0.46, height: 0.95, ai: "chaser",  armorPen: 0.10, color: "#a16207", trim: "#fde047", gold: 2020,  xp: 2480 },
    pendulum_titan:       { id: "pendulum_titan",       name: "Pendulum Titan",       hp: 18800,  atk: 680,  speed: 2.65, range: 1.75, attackCd: 1.42, radius: 0.76, height: 1.76, ai: "bruiser", armorPen: 0.12, color: "#713f12", trim: "#38bdf8", gold: 2820,  xp: 3400 },
    gear_arcanist:        { id: "gear_arcanist",        name: "Horologium Mage",      hp: 9500,   atk: 610,  speed: 3.05, range: 8.0,  attackCd: 1.35, radius: 0.46, height: 1.15, ai: "ranged",  armorPen: 0.10, projColor: "#facc15", projSpeed: 10.4,color: "#854d0e", trim: "#fef08a", gold: 2320,  xp: 2840 },

    mirror_phantom:       { id: "mirror_phantom",       name: "Mirror Phantom",       hp: 14200,  atk: 640,  speed: 4.85, range: 1.35, attackCd: 0.78, radius: 0.46, height: 1.15, ai: "chaser",  armorPen: 0.12, color: "#db2777", trim: "#fbcfe8", gold: 2780,  xp: 3420 },
    prism_golem:          { id: "prism_golem",          name: "Prism Colossus",       hp: 25400,  atk: 810,  speed: 2.7,  range: 1.75, attackCd: 1.4,  radius: 0.76, height: 1.8,  ai: "bruiser", armorPen: 0.15, color: "#4338ca", trim: "#f472b6", gold: 3880,  xp: 4680 },
    refraction_mage:      { id: "refraction_mage",      name: "Refraction Seer",      hp: 12900,  atk: 725,  speed: 3.1,  range: 8.2,  attackCd: 1.32, radius: 0.46, height: 1.18, ai: "ranged",  armorPen: 0.12, projColor: "#f472b6", projSpeed: 10.6,color: "#6d28d9", trim: "#fef08a", gold: 3180,  xp: 3920 },

    rift_harbinger:       { id: "rift_harbinger",       name: "Rift Harbinger",       hp: 19200,  atk: 760,  speed: 4.95, range: 1.4,  attackCd: 0.76, radius: 0.48, height: 1.25, ai: "chaser",  armorPen: 0.15, color: "#9f1239", trim: "#fde047", gold: 3850,  xp: 4750 },
    singularity_titan:    { id: "singularity_titan",    name: "Singularity Warden",   hp: 34200,  atk: 960,  speed: 2.8,  range: 1.8,  attackCd: 1.38, radius: 0.78, height: 1.85, ai: "bruiser", armorPen: 0.18, color: "#3b0764", trim: "#fb7185", gold: 5350,  xp: 6500 },
    star_devourer:        { id: "star_devourer",        name: "Star Devourer",        hp: 17400,  atk: 860,  speed: 3.15, range: 8.4,  attackCd: 1.3,  radius: 0.48, height: 1.22, ai: "ranged",  armorPen: 0.15, projColor: "#fb7185", projSpeed: 10.8,color: "#581c87", trim: "#fef08a", gold: 4400,  xp: 5450 },

    /* --- NEW T15 – T20 ENDGAME ENEMIES --- */
    bone_colossus:        { id: "bone_colossus",        name: "Ossuary Titan",        hp: 46500,  atk: 1180, speed: 2.85, range: 1.85, attackCd: 1.35, radius: 0.78, height: 1.88, ai: "bruiser", armorPen: 0.20, color: "#065f46", trim: "#a7f3d0", gold: 7400,  xp: 9000 },
    soul_reaper:          { id: "soul_reaper",          name: "Astral Soul-Reaper",   hp: 26200,  atk: 940,  speed: 5.05, range: 1.45, attackCd: 0.74, radius: 0.48, height: 1.25, ai: "chaser",  armorPen: 0.18, color: "#047857", trim: "#34d399", gold: 5350,  xp: 6600 },
    lich_hierophant:      { id: "lich_hierophant",      name: "Lich Hierophant",      hp: 23800,  atk: 1060, speed: 3.2,  range: 8.6,  attackCd: 1.28, radius: 0.48, height: 1.22, ai: "ranged",  armorPen: 0.18, projColor: "#34d399", projSpeed: 11.0,color: "#064e3b", trim: "#fde047", gold: 6100,  xp: 7500 },

    mind_flayer:          { id: "mind_flayer",          name: "Abyssal Mind-Weaver",  hp: 32500,  atk: 1320, speed: 3.25, range: 8.8,  attackCd: 1.25, radius: 0.48, height: 1.25, ai: "ranged",  armorPen: 0.22, projColor: "#e879f9", projSpeed: 11.4,color: "#581c87", trim: "#f5d0fe", gold: 8400,  xp: 10400 },
    tentacle_horror:      { id: "tentacle_horror",      name: "Eldritch Leviathan",   hp: 63500,  atk: 1480, speed: 2.95, range: 1.9,  attackCd: 1.32, radius: 0.80, height: 1.92, ai: "bruiser", armorPen: 0.24, color: "#3b0764", trim: "#c084fc", gold: 10200, xp: 12400 },
    void_oracle:          { id: "void_oracle",          name: "Madness Stalker",      hp: 35800,  atk: 1180, speed: 5.15, range: 1.45, attackCd: 0.72, radius: 0.48, height: 1.25, ai: "chaser",  armorPen: 0.22, color: "#701a75", trim: "#fde047", gold: 7400,  xp: 9100 },

    drake_wyvern:         { id: "drake_wyvern",         name: "Skyfire Wyvern",       hp: 49000,  atk: 1480, speed: 5.25, range: 1.5,  attackCd: 0.70, radius: 0.50, height: 1.3,  ai: "chaser",  armorPen: 0.24, color: "#9a3412", trim: "#fde047", gold: 10200, xp: 12600 },
    dragonkin_knight:     { id: "dragonkin_knight",     name: "Draconic Vanguard",    hp: 86500,  atk: 1850, speed: 3.05, range: 1.95, attackCd: 1.28, radius: 0.80, height: 1.95, ai: "bruiser", armorPen: 0.26, color: "#7c2d12", trim: "#fb923c", gold: 14000, xp: 17000 },
    flame_breath_wyrm:    { id: "flame_breath_wyrm",    name: "Cinder-Breath Drake",  hp: 44500,  atk: 1650, speed: 3.35, range: 9.0,  attackCd: 1.22, radius: 0.50, height: 1.28, ai: "ranged",  armorPen: 0.24, projColor: "#f97316", projSpeed: 11.8,color: "#c2410c", trim: "#fef08a", gold: 11500, xp: 14200 },

    chaos_stalker:        { id: "chaos_stalker",        name: "Entropy Assassin",     hp: 67000,  atk: 1850, speed: 5.4,  range: 1.5,  attackCd: 0.68, radius: 0.50, height: 1.3,  ai: "chaser",  armorPen: 0.28, color: "#881337", trim: "#38bdf8", gold: 14000, xp: 17400 },
    entropy_golem:        { id: "entropy_golem",        name: "Chaos Juggernaut",     hp: 118000, atk: 2300, speed: 3.15, range: 2.0,  attackCd: 1.25, radius: 0.82, height: 2.0,  ai: "bruiser", armorPen: 0.30, color: "#4c0519", trim: "#f43f5e", gold: 19200, xp: 23500 },
    rift_warlock:         { id: "rift_warlock",         name: "Nexus Arch-Warlock",   hp: 61000,  atk: 2050, speed: 3.45, range: 9.2,  attackCd: 1.18, radius: 0.50, height: 1.3,  ai: "ranged",  armorPen: 0.28, projColor: "#f43f5e", projSpeed: 12.2,color: "#701a75", trim: "#fde047", gold: 15800, xp: 19600 },

    valkyrie_seraph:      { id: "valkyrie_seraph",      name: "Pantheon Valkyrie",    hp: 91000,  atk: 2300, speed: 5.5,  range: 1.55, attackCd: 0.66, radius: 0.50, height: 1.35, ai: "chaser",  armorPen: 0.30, color: "#b45309", trim: "#ffffff", gold: 19200, xp: 24000 },
    divine_archon:        { id: "divine_archon",        name: "Astral Archon",        hp: 83000,  atk: 2550, speed: 3.55, range: 9.4,  attackCd: 1.15, radius: 0.50, height: 1.35, ai: "ranged",  armorPen: 0.30, projColor: "#fde047", projSpeed: 12.6,color: "#d97706", trim: "#fef08a", gold: 21800, xp: 27000 },
    celestial_sentinel:   { id: "celestial_sentinel",   name: "God-Forged Colossus",  hp: 160000, atk: 2850, speed: 3.2,  range: 2.05, attackCd: 1.22, radius: 0.84, height: 2.05, ai: "bruiser", armorPen: 0.32, color: "#78350f", trim: "#fde047", gold: 26500, xp: 32500 },

    oblivion_reaper:      { id: "oblivion_reaper",      name: "Oblivion Executioner", hp: 124000, atk: 2850, speed: 5.65, range: 1.6,  attackCd: 0.64, radius: 0.52, height: 1.38, ai: "chaser",  armorPen: 0.34, color: "#4c0519", trim: "#ffd447", gold: 26500, xp: 33000 },
    terminus_colossus:    { id: "terminus_colossus",    name: "Terminus World-Eater", hp: 218000, atk: 3550, speed: 3.3,  range: 2.1,  attackCd: 1.18, radius: 0.85, height: 2.1,  ai: "bruiser", armorPen: 0.36, color: "#1e052b", trim: "#ff3b5c", gold: 36500, xp: 45000 },
    omega_seraph:         { id: "omega_seraph",         name: "Omega Void-Seraph",    hp: 112000, atk: 3150, speed: 3.65, range: 9.6,  attackCd: 1.12, radius: 0.52, height: 1.38, ai: "ranged",  armorPen: 0.34, projColor: "#ff3b5c", projSpeed: 13.0,color: "#581c87", trim: "#ffd447", gold: 30000, xp: 37500 }
  },

  /* ------------------------------------------------------------------------
     20 BOSSES (Includes T15–T20 Apex Guardians + Phase 2 Enrage Support)
     ------------------------------------------------------------------------ */
  BOSSES: {
    obsidian_colossus:    { id: "obsidian_colossus",    name: "Obsidian Colossus",          subtitle: "Warden of the Sunken Vein",        hp: 1050,    atk: 36,   speed: 2.1,  radius: 0.95, height: 2.1,  color: "#1e293b", trim: "#38bdf8", gold: 210,    shards: 18,    xp: 260,    patterns: [ { type: "slam_circle", name: "Seismic Crush", telegraph: 1.15, radius: 2.8, dmgMult: 1.45, cooldown: 3.4 }, { type: "line_charge", name: "Quarry Bullrush", telegraph: 1.0, width: 1.6, length: 8.5, dmgMult: 1.35, cooldown: 4.0 }, { type: "triple_drop", name: "Crystal Barrage", telegraph: 1.1, radius: 1.8, count: 4, dmgMult: 1.15, cooldown: 3.6 } ] },
    arch_forge_automaton: { id: "arch_forge_automaton", name: "Ignis Prime",                subtitle: "Arch-Forge Automaton",             hp: 2200,    atk: 56,   speed: 2.5,  radius: 0.98, height: 2.15, color: "#7c2d12", trim: "#facc15", gold: 400,    shards: 34,    xp: 490,    patterns: [ { type: "ring_nova", name: "Smelter Ring", telegraph: 1.15, innerRadius: 1.8, outerRadius: 5.2, dmgMult: 1.45, cooldown: 3.3 }, { type: "cross_beam", name: "Crucible Crossfire", telegraph: 1.2, width: 1.35, length: 10.0, dmgMult: 1.55, cooldown: 3.8 }, { type: "line_charge", name: "Piston Overdrive", telegraph: 0.95, width: 1.7, length: 9.2, dmgMult: 1.35, cooldown: 3.2 } ] },
    mycelial_matriarch:   { id: "mycelial_matriarch",   name: "Vespera the Rot-Queen",      subtitle: "Mycelial Matriarch",               hp: 4200,    atk: 84,   speed: 2.4,  radius: 1.05, height: 2.25, color: "#14532d", trim: "#a3e635", gold: 690,    shards: 55,    xp: 860,    patterns: [ { type: "triple_drop", name: "Venom Cluster", telegraph: 1.05, radius: 2.1, count: 5, dmgMult: 1.25, cooldown: 3.0, leavesPoison: true }, { type: "slam_circle", name: "Spore Detonation", telegraph: 1.1, radius: 3.6, dmgMult: 1.6, cooldown: 3.6 }, { type: "radial_volley", name: "Thorn Spiral", telegraph: 0.95, count: 12, dmgMult: 1.1, cooldown: 3.1 } ] },
    chronos_archon:       { id: "chronos_archon",       name: "Aethelgard, Star-Eater",     subtitle: "Chronos Archon of the Singularity",hp: 7600,    atk: 120,  speed: 2.8,  radius: 1.05, height: 2.35, color: "#3b0764", trim: "#f0abfc", gold: 1180,   shards: 92,    xp: 1520,   patterns: [ { type: "cross_beam", name: "Event Horizon Beams", telegraph: 1.15, width: 1.4, length: 11.0, dmgMult: 1.65, cooldown: 3.2 }, { type: "ring_nova", name: "Gravity Collapse", telegraph: 1.1, innerRadius: 2.0, outerRadius: 5.8, dmgMult: 1.55, cooldown: 3.3 }, { type: "triple_drop", name: "Supernova Rain", telegraph: 1.0, radius: 2.1, count: 6, dmgMult: 1.35, cooldown: 2.9 }, { type: "radial_volley", name: "Astral Barrage", telegraph: 0.85, count: 14, dmgMult: 1.2, cooldown: 2.8 } ] },
    valkyr_frost_warden:  { id: "valkyr_frost_warden",  name: "Valkyr, Frost-Warden",       subtitle: "Sovereign of the Glacial Spire",   hp: 12800,   atk: 165,  speed: 2.9,  radius: 1.08, height: 2.4,  color: "#0c4a6e", trim: "#bae6fd", gold: 1920,   shards: 148,   xp: 2550,   patterns: [ { type: "ring_nova", name: "Absolute Zero Ring", telegraph: 1.05, innerRadius: 1.9, outerRadius: 6.0, dmgMult: 1.6, cooldown: 3.0 }, { type: "line_charge", name: "Glacial Lance", telegraph: 0.88, width: 1.7, length: 10.5, dmgMult: 1.5, cooldown: 3.0 }, { type: "triple_drop", name: "Avalanche Shards", telegraph: 0.95, radius: 2.2, count: 6, dmgMult: 1.38, cooldown: 2.8 }, { type: "radial_volley", name: "Blizzard Fan", telegraph: 0.85, count: 16, dmgMult: 1.2, cooldown: 2.7 } ] },
    malakor_sovereign:    { id: "malakor_sovereign",    name: "Malakor, Rift Sovereign",    subtitle: "Emperor of the Abyssal Throne",    hp: 20500,   atk: 220,  speed: 3.05, radius: 1.15, height: 2.55, color: "#2e1065", trim: "#f43f5e", gold: 3050,   shards: 230,   xp: 4100,   patterns: [ { type: "cross_beam", name: "Eclipse Cataclysm", telegraph: 1.05, width: 1.5, length: 11.5, dmgMult: 1.7, cooldown: 2.9 }, { type: "slam_circle", name: "Abyssal Judgment", telegraph: 1.0, radius: 4.0, dmgMult: 1.65, cooldown: 3.1 }, { type: "triple_drop", name: "Soulfire Rain", telegraph: 0.92, radius: 2.2, count: 7, dmgMult: 1.4, cooldown: 2.7 }, { type: "radial_volley", name: "Shadow Annihilation", telegraph: 0.82, count: 18, dmgMult: 1.25, cooldown: 2.5 } ] },
    raijin_tempest:       { id: "raijin_tempest",       name: "Raijin, Storm Sovereign",    subtitle: "Lord of the Stormspire",           hp: 31500,   atk: 285,  speed: 3.2,  radius: 1.15, height: 2.55, color: "#0c4a6e", trim: "#fde047", gold: 4700,   shards: 350,   xp: 6400,   patterns: [ { type: "cross_beam", name: "Tempest Grid", telegraph: 0.95, width: 1.55, length: 12.0, dmgMult: 1.72, cooldown: 2.7 }, { type: "line_charge", name: "Lightning Flash", telegraph: 0.8, width: 1.8, length: 11.5, dmgMult: 1.6, cooldown: 2.6 }, { type: "triple_drop", name: "Thunderbolt Barrage", telegraph: 0.88, radius: 2.3, count: 7, dmgMult: 1.45, cooldown: 2.5 }, { type: "radial_volley", name: "Static Nova", telegraph: 0.8, count: 18, dmgMult: 1.3, cooldown: 2.5 } ] },
    solarius_architect:   { id: "solarius_architect",   name: "Solarius, Sun Architect",    subtitle: "Apex of the Celestial Crucible",   hp: 47000,   atk: 365,  speed: 3.25, radius: 1.22, height: 2.65, color: "#78350f", trim: "#fef08a", gold: 7100,   shards: 515,   xp: 9800,   patterns: [ { type: "ring_nova", name: "Corona Collapse", telegraph: 0.95, innerRadius: 2.2, outerRadius: 6.8, dmgMult: 1.75, cooldown: 2.7 }, { type: "cross_beam", name: "Divine Judgment", telegraph: 0.95, width: 1.65, length: 13.0, dmgMult: 1.78, cooldown: 2.7 }, { type: "triple_drop", name: "Sunfire Pillars", telegraph: 0.85, radius: 2.4, count: 8, dmgMult: 1.48, cooldown: 2.5 }, { type: "radial_volley", name: "Starlight Halo", telegraph: 0.8, count: 20, dmgMult: 1.32, cooldown: 2.4 } ] },
    vladimir_blood_duke:  { id: "vladimir_blood_duke",  name: "Lord Carmine, Blood Duke",   subtitle: "Sovereign of Crimson Catacombs",   hp: 68000,   atk: 455,  speed: 3.3,  radius: 1.18, height: 2.55, color: "#7f1d1d", trim: "#fb7185", gold: 10400,  shards: 740,   xp: 14400,  patterns: [ { type: "line_charge", name: "Crimson Lunge", telegraph: 0.82, width: 1.85, length: 12.0, dmgMult: 1.68, cooldown: 2.6 }, { type: "slam_circle", name: "Blood Moon Crush", telegraph: 0.95, radius: 4.2, dmgMult: 1.72, cooldown: 2.9 }, { type: "radial_volley", name: "Sanguine Spiral", telegraph: 0.8, count: 20, dmgMult: 1.3, cooldown: 2.5 }, { type: "triple_drop", name: "Hemorrhage Spires", telegraph: 0.88, radius: 2.3, count: 7, dmgMult: 1.48, cooldown: 2.6 } ] },
    pyrax_ash_wyrm:       { id: "pyrax_ash_wyrm",       name: "Pyrax, Caldera Wyrm",        subtitle: "Ember Heart of the Ashen Crater",  hp: 96000,   atk: 560,  speed: 3.2,  radius: 1.25, height: 2.65, color: "#431407", trim: "#fb923c", gold: 14800,  shards: 1040,  xp: 20600,  patterns: [ { type: "triple_drop", name: "Pyroclastic Rain", telegraph: 0.88, radius: 2.4, count: 8, dmgMult: 1.5, cooldown: 2.5, leavesAsh: true }, { type: "ring_nova", name: "Caldera Eruption", telegraph: 0.95, innerRadius: 2.1, outerRadius: 6.8, dmgMult: 1.76, cooldown: 2.7 }, { type: "cross_beam", name: "Magma Fissures", telegraph: 0.95, width: 1.65, length: 13.0, dmgMult: 1.78, cooldown: 2.8 }, { type: "line_charge", name: "Cinder Charge", telegraph: 0.8, width: 2.0, length: 12.0, dmgMult: 1.65, cooldown: 2.6 } ] },
    thalassa_leviathan:   { id: "thalassa_leviathan",   name: "Thalassa, Abyssal Maw",      subtitle: "Drowned Leviathan of the Trench",  hp: 134000,  atk: 680,  speed: 3.15, radius: 1.28, height: 2.7,  color: "#082f49", trim: "#67e8f9", gold: 20800,  shards: 1440,  xp: 29200,  armorPen: 0.10, patterns: [ { type: "slam_circle", name: "Abyssal Undertow", telegraph: 0.95, radius: 4.5, dmgMult: 1.75, cooldown: 2.8 }, { type: "ring_nova", name: "Maelstrom Surge", telegraph: 0.92, innerRadius: 2.2, outerRadius: 7.0, dmgMult: 1.78, cooldown: 2.7 }, { type: "radial_volley", name: "Tidal Volley", telegraph: 0.78, count: 22, dmgMult: 1.32, cooldown: 2.4 }, { type: "triple_drop", name: "Depth Charges", telegraph: 0.86, radius: 2.4, count: 8, dmgMult: 1.5, cooldown: 2.5 } ] },
    kronos_horologist:    { id: "kronos_horologist",    name: "Kronos, Grand Horologist",   subtitle: "Keeper of the Shattered Gears",    hp: 184000,  atk: 820,  speed: 3.35, radius: 1.22, height: 2.65, color: "#422006", trim: "#facc15", gold: 29000,  shards: 1960,  xp: 41000,  armorPen: 0.12, patterns: [ { type: "cross_beam", name: "Clockhand Sweep", telegraph: 0.92, width: 1.65, length: 13.5, dmgMult: 1.8, cooldown: 2.5 }, { type: "ring_nova", name: "Gearwheel Collapse", telegraph: 0.9, innerRadius: 2.3, outerRadius: 7.2, dmgMult: 1.78, cooldown: 2.6 }, { type: "triple_drop", name: "Temporal Bombs", telegraph: 0.85, radius: 2.4, count: 8, dmgMult: 1.52, cooldown: 2.4 }, { type: "radial_volley", name: "Chrono Shards", telegraph: 0.76, count: 22, dmgMult: 1.35, cooldown: 2.3 } ] },
    auriel_prism_monarch: { id: "auriel_prism_monarch", name: "Auriel, Prism Monarch",      subtitle: "Sovereign of a Thousand Mirrors",  hp: 248000,  atk: 980,  speed: 3.45, radius: 1.25, height: 2.7,  color: "#312e81", trim: "#f472b6", gold: 40000,  shards: 2650,  xp: 57000,  armorPen: 0.15, patterns: [ { type: "cross_beam", name: "Prismatic Lasers", telegraph: 0.9, width: 1.7, length: 14.0, dmgMult: 1.82, cooldown: 2.5 }, { type: "line_charge", name: "Mirror Blink", telegraph: 0.76, width: 1.9, length: 12.5, dmgMult: 1.7, cooldown: 2.5 }, { type: "radial_volley", name: "Kaleidoscope Burst", telegraph: 0.75, count: 24, dmgMult: 1.35, cooldown: 2.3 }, { type: "triple_drop", name: "Crystal Mirrors", telegraph: 0.84, radius: 2.5, count: 9, dmgMult: 1.52, cooldown: 2.4 } ] },
    omega_rift_origin:    { id: "omega_rift_origin",    name: "Omega, The Rift Origin",     subtitle: "Primordial Heart of the Gate",     hp: 330000,  atk: 1160, speed: 3.5,  radius: 1.32, height: 2.85, color: "#1e052b", trim: "#fb7185", gold: 56000,  shards: 3650,  xp: 80000,  armorPen: 0.18, patterns: [ { type: "ring_nova", name: "Genesis Singularity", telegraph: 0.92, innerRadius: 2.4, outerRadius: 7.5, dmgMult: 1.85, cooldown: 2.5 }, { type: "cross_beam", name: "Rift Fracture", telegraph: 0.9, width: 1.75, length: 14.5, dmgMult: 1.85, cooldown: 2.5 }, { type: "triple_drop", name: "Cataclysmic Stars", telegraph: 0.84, radius: 2.6, count: 9, dmgMult: 1.55, cooldown: 2.4 }, { type: "radial_volley", name: "Primordial Annihilation", telegraph: 0.75, count: 24, dmgMult: 1.38, cooldown: 2.3 } ] },

    /* --- NEW T15 – T20 ENDGAME BOSSES --- */
    malkorath_undying:    { id: "malkorath_undying",    name: "Malkorath, The Undying",     subtitle: "Arch-Lich of the Astral Ossuary",  hp: 455000,  atk: 1420, speed: 3.5,  radius: 1.28, height: 2.8,  color: "#022c22", trim: "#34d399", gold: 78000,  shards: 4950,  xp: 110000, armorPen: 0.22, patterns: [ { type: "ring_nova", name: "Necrotic Cataclysm", telegraph: 0.88, innerRadius: 2.2, outerRadius: 7.4, dmgMult: 1.86, cooldown: 2.4 }, { type: "slam_circle", name: "Soul Phylactery Slam", telegraph: 0.85, radius: 4.6, dmgMult: 1.82, cooldown: 2.5 }, { type: "radial_volley", name: "Wraith Barrage", telegraph: 0.74, count: 26, dmgMult: 1.4, cooldown: 2.2 }, { type: "triple_drop", name: "Graveyard Eruption", telegraph: 0.82, radius: 2.6, count: 9, dmgMult: 1.58, cooldown: 2.3 } ] },
    azathor_abyssal_eye:  { id: "azathor_abyssal_eye",  name: "Azathor, The Abyssal Eye",   subtitle: "Dreamer of the Eldritch Trench",   hp: 620000,  atk: 1750, speed: 3.55, radius: 1.32, height: 2.85, color: "#2e1065", trim: "#e879f9", gold: 108000, shards: 6700,  xp: 152000, armorPen: 0.25, patterns: [ { type: "cross_beam", name: "Gaze of Madness", telegraph: 0.85, width: 1.8, length: 15.0, dmgMult: 1.9, cooldown: 2.3 }, { type: "ring_nova", name: "Void Rupture", telegraph: 0.86, innerRadius: 2.4, outerRadius: 7.8, dmgMult: 1.88, cooldown: 2.4 }, { type: "triple_drop", name: "Eldritch Meteors", telegraph: 0.8, radius: 2.7, count: 10, dmgMult: 1.6, cooldown: 2.2 }, { type: "radial_volley", name: "Tentacle Spiral", telegraph: 0.72, count: 28, dmgMult: 1.42, cooldown: 2.1 } ] },
    ignis_draco_emperor:  { id: "ignis_draco_emperor",  name: "Vaelgor, Dragon Emperor",    subtitle: "Apex Wyrm of the Sky-Caldera",     hp: 850000,  atk: 2150, speed: 3.65, radius: 1.38, height: 2.95, color: "#431407", trim: "#fb923c", gold: 150000, shards: 9000,  xp: 210000, armorPen: 0.28, patterns: [ { type: "line_charge", name: "Inferno Dive", telegraph: 0.75, width: 2.1, length: 14.0, dmgMult: 1.88, cooldown: 2.3 }, { type: "slam_circle", name: "Dragon Meteor", telegraph: 0.84, radius: 4.8, dmgMult: 1.92, cooldown: 2.4 }, { type: "triple_drop", name: "Dragonfire Breath", telegraph: 0.8, radius: 2.7, count: 10, dmgMult: 1.62, cooldown: 2.2, leavesAsh: true }, { type: "radial_volley", name: "Cinder Nova", telegraph: 0.7, count: 28, dmgMult: 1.44, cooldown: 2.1 } ] },
    khaos_unbound:        { id: "khaos_unbound",        name: "Khaos, The Unbound",         subtitle: "Incarnation of Rift Entropy",      hp: 1160000, atk: 2650, speed: 3.75, radius: 1.35, height: 2.9,  color: "#4c0519", trim: "#38bdf8", gold: 210000, shards: 12200, xp: 290000, armorPen: 0.30, patterns: [ { type: "cross_beam", name: "Dimensional Shear", telegraph: 0.82, width: 1.85, length: 15.5, dmgMult: 1.95, cooldown: 2.2 }, { type: "line_charge", name: "Rift Blink Strike", telegraph: 0.72, width: 2.0, length: 14.0, dmgMult: 1.85, cooldown: 2.2 }, { type: "ring_nova", name: "Entropy Implosion", telegraph: 0.84, innerRadius: 2.5, outerRadius: 8.0, dmgMult: 1.92, cooldown: 2.3 }, { type: "radial_volley", name: "Chaos Storm", telegraph: 0.68, count: 30, dmgMult: 1.46, cooldown: 2.0 } ] },
    aurelius_god_king:    { id: "aurelius_god_king",    name: "Aurelius, Astral God-King",  subtitle: "Sovereign of the Celestial Throne",hp: 1580000, atk: 3250, speed: 3.8,  radius: 1.40, height: 3.0,  color: "#78350f", trim: "#fde047", gold: 295000, shards: 16500, xp: 400000, armorPen: 0.33, patterns: [ { type: "ring_nova", name: "Pantheon Judgment", telegraph: 0.82, innerRadius: 2.5, outerRadius: 8.2, dmgMult: 1.98, cooldown: 2.2 }, { type: "cross_beam", name: "Astral Crossfire", telegraph: 0.8, width: 1.9, length: 16.0, dmgMult: 1.98, cooldown: 2.2 }, { type: "triple_drop", name: "Divine Spears", telegraph: 0.78, radius: 2.8, count: 11, dmgMult: 1.66, cooldown: 2.1 }, { type: "radial_volley", name: "Supernova Corona", telegraph: 0.68, count: 32, dmgMult: 1.48, cooldown: 2.0 } ] },
    nihilus_void_god:     { id: "nihilus_void_god",     name: "Nihilus, Architect of Oblivion",subtitle: "Final Warden of the Rift Terminus",hp: 2150000, atk: 4000, speed: 3.9,  radius: 1.45, height: 3.1,  color: "#0d0312", trim: "#ff3b5c", gold: 420000, shards: 22500, xp: 560000, armorPen: 0.36, patterns: [ { type: "ring_nova", name: "Oblivion Horizon", telegraph: 0.8, innerRadius: 2.6, outerRadius: 8.5, dmgMult: 2.05, cooldown: 2.1 }, { type: "cross_beam", name: "Timeline Severance", telegraph: 0.78, width: 1.95, length: 16.5, dmgMult: 2.05, cooldown: 2.1 }, { type: "triple_drop", name: "World-Eater Meteors", telegraph: 0.76, radius: 2.9, count: 12, dmgMult: 1.72, cooldown: 2.0 }, { type: "radial_volley", name: "Omega Singularity", telegraph: 0.65, count: 36, dmgMult: 1.52, cooldown: 1.9 } ] }
  },

  /* ------------------------------------------------------------------------
     48 COMBAT SKILLS (27 Weapon [Q] Skills + 21 Relic [E] Skills)
     ------------------------------------------------------------------------ */
  SKILLS: {
    // --- T1–T14 WEAPON [Q] SKILLS ---
    iron_cleave:         { id: "iron_cleave",         name: "Whirl Cleave",      icon: "⚔", cooldown: 4.5,  type: "aoe_melee",      animType: "whirl_slash",     heroAnim: "spin",  radius: 2.9, atkMult: 2.15, spellMult: 0.45, color: "#e2e8f0", desc: "Spin 360° with twin steel arcs, dealing 215% ATK to all nearby foes." },
    seismic_shatter:     { id: "seismic_shatter",     name: "Seismic Slam",      icon: "⛰", cooldown: 5.5,  type: "shockwave",      animType: "seismic_pillars", heroAnim: "slam",  radius: 3.8, atkMult: 2.75, spellMult: 0.55, stunDuration: 1.5, color: "#38bdf8", desc: "Leap and shatter the earth with 8 crystal spires for 275% ATK + 1.5s Stun." },
    inferno_ring:        { id: "inferno_ring",        name: "Blaze Orbit",       icon: "✴", cooldown: 4.8,  type: "proj_fan",       animType: "flame_nova",      heroAnim: "spin",  count: 8, range: 7.5, atkMult: 1.55, spellMult: 0.8, guaranteedCrit: true, color: "#fb923c", desc: "Hurl 8 flaming chakrams outward; guaranteed Crits for 155% ATK + 80% Spell." },
    spore_eruption:      { id: "spore_eruption",      name: "Spore Nova",        icon: "✹", cooldown: 5.2,  type: "drain_nova",     animType: "spore_geysers",   heroAnim: "raise", radius: 3.9, atkMult: 0.75, spellMult: 2.45, healPctDmg: 0.25, color: "#4ade80", desc: "Erupt toxic geysers for 245% Spell damage and heal for 25% of damage dealt." },
    starfall_cataclysm:  { id: "starfall_cataclysm",  name: "Starfall",          icon: "✦", cooldown: 5.6,  type: "meteor_cluster", animType: "starfall_beams",  heroAnim: "raise", count: 5, radius: 2.4, atkMult: 0.45, spellMult: 2.45, repeatDmgMult: 0.45, color: "#e879f9", desc: "Call down 5 astral laser meteors on living foes for 245% Spell Power each (45% on repeat hits)." },
    glacial_tempest:     { id: "glacial_tempest",     name: "Glacial Impale",    icon: "❄", cooldown: 5.4,  type: "shockwave",      animType: "ice_spikes",      heroAnim: "slam",  radius: 4.2, atkMult: 2.85, spellMult: 1.05, stunDuration: 1.6, color: "#7dd3fc", desc: "Erupt concentric permafrost spires for 285% ATK + 105% Spell and freeze foes for 1.6s." },
    abyssal_reap:        { id: "abyssal_reap",        name: "Soul Harvest",      icon: "☾", cooldown: 5.0,  type: "drain_nova",     animType: "shadow_scythes",  heroAnim: "spin",  radius: 4.3, atkMult: 2.4,  spellMult: 2.4,  healPctDmg: 0.26, color: "#f43f5e", desc: "Sweep colossal eclipse scythes for 240% ATK + 240% Spell and siphon 26% life." },
    thunderstep_barrage: { id: "thunderstep_barrage", name: "Thunderstep",       icon: "⚡", cooldown: 4.8,  type: "chain_barrage",  animType: "thunder_web",     heroAnim: "spin",  count: 6, radius: 6.5, atkMult: 2.6,  spellMult: 1.75, guaranteedCrit: true, color: "#38bdf8", desc: "Unleash 6 guaranteed-Crit lightning strikes jumping across foes for 260% ATK + 175% Spell." },
    celestial_cleave:    { id: "celestial_cleave",    name: "Dawnbreaker Blade", icon: "☀", cooldown: 5.5,  type: "shockwave",      animType: "sky_greatsword",  heroAnim: "slam",  radius: 4.8, atkMult: 3.15, spellMult: 2.55, stunDuration: 1.5, color: "#fde047", desc: "Summon a colossal golden greatsword from the heavens for 315% ATK + 255% Spell + Stun." },
    sanguine_whirlwind:  { id: "sanguine_whirlwind",  name: "Crimson Rend",      icon: "🪓", cooldown: 5.0,  type: "drain_nova",     animType: "shadow_scythes",  heroAnim: "spin",  radius: 4.4, atkMult: 3.25, spellMult: 1.4,  healPctDmg: 0.24, color: "#ef4444", desc: "Carve a crimson vortex for 325% ATK + 140% Spell and drain 24% of damage dealt as HP." },
    ash_fan_knives:      { id: "ash_fan_knives",      name: "Cinder Fan",        icon: "🗡", cooldown: 4.6,  type: "proj_fan",       animType: "flame_nova",      heroAnim: "spin",  count: 10, range: 8.2, atkMult: 2.1, spellMult: 1.0, guaranteedCrit: true, color: "#fb923c", desc: "Unleash 10 volcanic obsidian daggers in a ring; guaranteed Crits for 210% ATK + 100% Spell." },
    maelstrom_impale:    { id: "maelstrom_impale",    name: "Tidal Maelstrom",   icon: "🔱", cooldown: 5.3,  type: "shockwave",      animType: "seismic_pillars", heroAnim: "slam",  radius: 4.6, atkMult: 2.2,  spellMult: 3.1,  stunDuration: 1.6, color: "#0ea5e9", desc: "Erupt abyssal geysers for 220% ATK + 310% Spell and stagger foes for 1.6s." },
    chrono_barrage:      { id: "chrono_barrage",      name: "Temporal Meteors",  icon: "⌛", cooldown: 5.4,  type: "meteor_cluster", animType: "starfall_beams",  heroAnim: "raise", count: 6, radius: 2.5, atkMult: 0.8, spellMult: 2.75, repeatDmgMult: 0.45, color: "#facc15", desc: "Drop 6 fractured time-beams across foes for 275% Spell Power each (45% on repeat hits)." },
    prism_shatter:       { id: "prism_shatter",       name: "Prism Refraction",  icon: "💎", cooldown: 4.9,  type: "chain_barrage",  animType: "thunder_web",     heroAnim: "spin",  count: 7, radius: 7.2, atkMult: 2.8,  spellMult: 2.5, guaranteedCrit: true, color: "#f472b6", desc: "Ricochet 7 guaranteed-Crit prism beams across enemies for 280% ATK + 250% Spell." },
    omega_cataclysm:     { id: "omega_cataclysm",     name: "Genesis Cleave",    icon: "◎", cooldown: 5.5,  type: "shockwave",      animType: "sky_greatsword",  heroAnim: "slam",  radius: 5.2, atkMult: 3.55, spellMult: 3.25, stunDuration: 1.6, color: "#fb7185", desc: "Split reality with an apex Riftblade strike for 355% ATK + 325% Spell + 1.6s Stun." },

    // --- NEW T15–T20 ENDGAME WEAPON [Q] SKILLS ---
    soul_shatter:        { id: "soul_shatter",        name: "Necrotic Reap",     icon: "☠", cooldown: 5.0,  type: "drain_nova",     animType: "spore_geysers",   heroAnim: "spin",  radius: 5.2, atkMult: 2.6,  spellMult: 3.8,  healPctDmg: 0.28, color: "#34d399", desc: "Detonate necrotic soul-geysers for 260% ATK + 380% Spell and siphon 28% life." },
    eldritch_beam:       { id: "eldritch_beam",       name: "Abyssal Gaze",      icon: "👁", cooldown: 4.9,  type: "chain_barrage",  animType: "thunder_web",     heroAnim: "raise", count: 8, radius: 7.8, atkMult: 1.8,  spellMult: 3.6,  guaranteedCrit: true, color: "#e879f9", desc: "Fire 8 guaranteed-Crit eldritch mind-rays across foes for 180% ATK + 360% Spell." },
    dragon_cataclysm:    { id: "dragon_cataclysm",    name: "Wyrm-Fire Slam",    icon: "🐉", cooldown: 5.4,  type: "shockwave",      animType: "flame_nova",      heroAnim: "slam",  radius: 5.5, atkMult: 4.1,  spellMult: 2.4,  stunDuration: 1.6, color: "#fb923c", desc: "Cleave the earth with dragonfire for 410% ATK + 240% Spell + 1.6s Stun." },
    chaos_vortex:        { id: "chaos_vortex",        name: "Entropy Storm",     icon: "⚡", cooldown: 4.6,  type: "proj_fan",       animType: "shadow_scythes",  heroAnim: "spin",  count: 12, range: 8.8, atkMult: 2.75, spellMult: 1.9, guaranteedCrit: true, color: "#f43f5e", desc: "Fling 12 guaranteed-Crit entropy blades in a circle for 275% ATK + 190% Spell." },
    pantheon_wrath:      { id: "pantheon_wrath",      name: "God-King's Verdict",icon: "👑", cooldown: 5.5,  type: "shockwave",      animType: "sky_greatsword",  heroAnim: "slam",  radius: 5.8, atkMult: 4.3,  spellMult: 3.9,  stunDuration: 1.7, color: "#fde047", desc: "Call down a titanic astral colossus blade for 430% ATK + 390% Spell + 1.7s Stun." },
    oblivion_annihilation:{ id: "oblivion_annihilation",name: "Oblivion Starfall", icon: "❖", cooldown: 5.4,  type: "meteor_cluster", animType: "starfall_beams",  heroAnim: "raise", count: 8, radius: 2.8, atkMult: 2.2,  spellMult: 3.85, repeatDmgMult: 0.60, color: "#ff3b5c", desc: "Rain 8 Oblivion beams onto enemies for 220% ATK + 385% Spell each (60% repeat)." },

    // --- 6 SIGNATURE SPECIAL WEAPON [Q] ABILITIES ---
    judgment_cut:        { id: "judgment_cut",        name: "Judgment Cut",      icon: "⚔", cooldown: 4.5,  type: "judgment_cut",   animType: "shadow_scythes",  heroAnim: "spin",  count: 8, radius: 7.5, atkMult: 2.95, spellMult: 2.2,  guaranteedCrit: true, color: "#38bdf8", desc: "Flash-step across up to 8 enemies in a razor slash web; guaranteed Crits for 295% ATK + 220% Spell." },
    orbital_hyperbeam:   { id: "orbital_hyperbeam",   name: "Aether Hyperbeam",  icon: "🔦", cooldown: 5.2,  type: "hyperbeam",      animType: "starfall_beams",  heroAnim: "raise", length: 12.5, width: 1.8, atkMult: 1.5, spellMult: 5.2, color: "#c084fc", desc: "Fire a colossal piercing Aether Rail-Beam 12.5 tiles forward for 150% ATK + 520% Spell!" },
    aegis_phalanx:       { id: "aegis_phalanx",       name: "Valkyrie Phalanx",  icon: "🛡", cooldown: 5.4,  type: "phalanx_charge", animType: "sky_greatsword",  heroAnim: "slam",  radius: 4.6, shieldPctHp: 0.32, atkMult: 3.4, spellMult: 2.6, stunDuration: 1.6, color: "#fde047", desc: "Grant a 32% HP Shield, stun foes for 1.6s, deal 340% ATK + 260% Spell & hurl 6 spears!" },
    pandemonium_miasma:  { id: "pandemonium_miasma",  name: "Plague Pandemic",   icon: "☣", cooldown: 5.0,  type: "drain_nova",     animType: "spore_geysers",   heroAnim: "raise", radius: 5.4, atkMult: 1.4,  spellMult: 4.2,  healPctDmg: 0.32, hazardPurge: 55, color: "#84cc16", desc: "Erupt a massive plague cloud for 140% ATK + 420% Spell, heal 32% dealt & purge 55% hazards!" },
    bullet_hell_waltz:   { id: "bullet_hell_waltz",   name: "Bullet Hell Waltz", icon: "🔫", cooldown: 4.8,  type: "bullet_hell",    animType: "flame_nova",      heroAnim: "spin",  count: 24, range: 10.0, atkMult: 1.65, spellMult: 1.35, color: "#fb923c", desc: "Spin and fire 24 piercing Rift bullets in a double spiral for 165% ATK + 135% Spell each!" },
    supernova_apocalypse:{ id: "supernova_apocalypse",name: "Apocalypse Nova",   icon: "☄", cooldown: 5.8,  type: "supernova",      animType: "black_hole",      heroAnim: "raise", radius: 6.2, count: 6, atkMult: 2.5, spellMult: 4.6, color: "#ffae19", desc: "Detonate a 6.2-tile cosmic Supernova + 6 astral meteors for 250% ATK + 460% Spell!" },
    storm_arrow_rain:    { id: "storm_arrow_rain",    name: "Tempest Arrow Rain",icon: "🏹", cooldown: 5.0,  type: "arrow_rain",     animType: "thunder_web",     heroAnim: "raise", count: 14, radius: 4.2, atkMult: 2.35, spellMult: 1.45, color: "#38bdf8", desc: "Call down 14 piercing sky-arrows in a 4.2-tile storm zone for 235% ATK + 145% Spell!" },
    abyssal_whip_lash:   { id: "abyssal_whip_lash",   name: "Abyssal Lash",      icon: "⛓", cooldown: 4.8,  type: "whip_lash",      animType: "shadow_scythes",  heroAnim: "spin",  radius: 5.4, atkMult: 2.1,  spellMult: 3.15, healPctDmg: 0.24, color: "#c084fc", desc: "Crack 4 crossing void-whips across 5.4 tiles, pulling foes inward for 210% ATK + 315% Spell & 24% drain!" },
    bastion_reflect:     { id: "bastion_reflect",     name: "Bastion Aegis Slam",icon: "🛡", cooldown: 5.4,  type: "bastion_slam",   animType: "aegis_dome",      heroAnim: "slam",  radius: 4.4, shieldPctHp: 0.36, atkMult: 3.1, spellMult: 2.2, stunDuration: 1.7, color: "#fde047", desc: "Gain a 36% Max HP Shield, stun nearby foes for 1.7s, and convert enemy projectiles into 300% counter-bolts!" },
    desperado_barrage:   { id: "desperado_barrage",   name: "Desperado Barrage", icon: "🔫", cooldown: 4.7,  type: "desperado",      animType: "lightning_surge", heroAnim: "spin",  count: 18, radius: 7.5, atkMult: 2.25, spellMult: 1.85, guaranteedCrit: true, color: "#facc15", desc: "Blink rapidly and fire 18 guaranteed-Crit homing chrono-rounds for 225% ATK + 185% Spell!" },
    absolute_zero:       { id: "absolute_zero",       name: "Absolute Zero",     icon: "❄", cooldown: 5.6,  type: "absolute_zero",  animType: "ice_spikes",      heroAnim: "raise", radius: 6.4, atkMult: 1.4,  spellMult: 4.4,  stunDuration: 2.2, color: "#7dd3fc", desc: "Encase all foes within 6.4 tiles in glacial ice (2.2s Freeze) and shatter them for 140% ATK + 440% Spell!" },

    // --- T1–T14 RELIC [E] SKILLS ---
    sanctuary_aegis:     { id: "sanctuary_aegis",     name: "Gate Aegis",        icon: "🛡", cooldown: 9.0,  type: "shield_buff",    animType: "aegis_dome",      heroAnim: "raise", shieldPctHp: 0.30, duration: 5.0, color: "#60a5fa", desc: "Weave a protective barrier equal to 30% of your Max HP for 5s." },
    crystal_bastion:     { id: "crystal_bastion",     name: "Crystal Ward",      icon: "◈", cooldown: 10.0, type: "shield_cleanse", animType: "crystal_cage",    heroAnim: "raise", shieldPctHp: 0.42, hazardRestore: 55, duration: 6.0, color: "#38bdf8", desc: "Gain a 42% Max HP crystalline shield and purge 55% of active dungeon hazards." },
    overclock_surge:     { id: "overclock_surge",     name: "Overclock",         icon: "⚡", cooldown: 10.5, type: "haste_buff",     animType: "lightning_surge", heroAnim: "raise", speedBonus: 0.38, atkSpeedBonus: 0.48, critBonus: 0.22, duration: 6.0, color: "#f97316", desc: "+48% Attack Speed, +22% Crit Chance, and +38% Move Speed for 6s." },
    venom_bloom:         { id: "venom_bloom",         name: "Bio-Regen",         icon: "❦", cooldown: 9.5,  type: "heal_pulse",     animType: "verdant_bloom",   heroAnim: "raise", healPctHp: 0.35, radius: 3.5, spellMult: 1.8, color: "#22c55e", desc: "Restore 35% Max HP, purge hazards, and lash nearby foes for 180% Spell." },
    singularity_rift:    { id: "singularity_rift",    name: "Void Vortex",       icon: "◎", cooldown: 11.0, type: "vortex_pull",    animType: "black_hole",      heroAnim: "raise", radius: 5.0, spellMult: 2.85, shieldPctHp: 0.25, color: "#c084fc", desc: "Pull enemies inward for 285% Spell damage and gain a 25% HP barrier." },
    solar_hearth:        { id: "solar_hearth",        name: "Hearth Nova",       icon: "☀", cooldown: 10.0, type: "shield_cleanse", animType: "solar_flare",     heroAnim: "raise", shieldPctHp: 0.48, hazardRestore: 75, duration: 6.5, color: "#fde047", desc: "48% Max HP shield and purges 75% Hypothermia/dungeon hazards." },
    dawnbreaker_burst:   { id: "dawnbreaker_burst",   name: "Eclipse Purge",     icon: "✹", cooldown: 10.5, type: "heal_pulse",     animType: "radiant_pillar",  heroAnim: "raise", healPctHp: 0.42, radius: 4.5, spellMult: 3.1, color: "#f0abfc", desc: "Heals 42% HP, purges Eclipse Corruption, and blasts foes for 310% Spell." },
    tempest_overdrive:   { id: "tempest_overdrive",   name: "Storm Orbit",       icon: "⚡", cooldown: 10.5, type: "haste_storm",    animType: "storm_orbit",     heroAnim: "raise", speedBonus: 0.42, atkSpeedBonus: 0.52, critBonus: 0.25, shieldPctHp: 0.32, radius: 4.6, spellMult: 2.6, duration: 6.5, color: "#38bdf8", desc: "Summon a crackling Storm Shield (+32% HP, +52% Atk Spd) and zap all foes for 260% Spell." },
    chrono_sanctuary:    { id: "chrono_sanctuary",    name: "Time Freeze",       icon: "⌛", cooldown: 12.0, type: "time_freeze",    animType: "chrono_clock",    heroAnim: "raise", healPctHp: 0.36, shieldPctHp: 0.42, stunDuration: 2.0, radius: 7.5, spellMult: 3.0, color: "#fde047", desc: "Freeze foes for 2.0s (reduced on Bosses), deal 300% Spell, heal 36% HP & gain a 42% Shield." },
    crimson_covenant:    { id: "crimson_covenant",    name: "Blood Pact",        icon: "🩸", cooldown: 10.0, type: "heal_pulse",     animType: "radiant_pillar",  heroAnim: "raise", healPctHp: 0.45, shieldPctHp: 0.30, radius: 4.8, spellMult: 3.2, color: "#ef4444", desc: "Restore 45% HP, weave a 30% Shield, purge hazards, and blast foes for 320% Spell." },
    volcanic_frenzy:     { id: "volcanic_frenzy",     name: "Pyroclast Surge",   icon: "🌋", cooldown: 10.5, type: "haste_storm",    animType: "flame_nova",      heroAnim: "raise", speedBonus: 0.44, atkSpeedBonus: 0.56, critBonus: 0.26, shieldPctHp: 0.30, radius: 4.8, spellMult: 2.9, duration: 6.5, color: "#fb923c", desc: "Ignite +56% Atk Speed, +26% Crit & +30% Shield while scorching nearby foes for 290% Spell." },
    abyssal_tide:        { id: "abyssal_tide",        name: "Tidal Bastion",     icon: "🌊", cooldown: 10.0, type: "shield_cleanse", animType: "crystal_cage",    heroAnim: "raise", shieldPctHp: 0.52, hazardRestore: 85, duration: 6.5, color: "#0ea5e9", desc: "Raise an abyssal 52% Max HP barrier and purge 85% of active dungeon hazards." },
    paradox_rewind:      { id: "paradox_rewind",      name: "Paradox Rewind",    icon: "⚙", cooldown: 11.5, type: "time_freeze",    animType: "chrono_clock",    heroAnim: "raise", healPctHp: 0.42, shieldPctHp: 0.40, stunDuration: 2.0, radius: 7.8, spellMult: 3.3, color: "#facc15", desc: "Rewind 42% HP, gain 40% Shield, freeze nearby enemies for 2.0s & deal 330% Spell." },
    prism_singularity:   { id: "prism_singularity",   name: "Mirror Vortex",     icon: "💎", cooldown: 10.5, type: "vortex_pull",    animType: "black_hole",      heroAnim: "raise", radius: 5.8, spellMult: 3.5, shieldPctHp: 0.36, hazardRestore: 65, color: "#f472b6", desc: "Pull enemies into a prism singularity for 350% Spell, purge hazards & gain a 36% Shield." },
    genesis_aegis:       { id: "genesis_aegis",       name: "Genesis Pulse",     icon: "◎", cooldown: 11.5, type: "time_freeze",    animType: "radiant_pillar",  heroAnim: "raise", healPctHp: 0.45, shieldPctHp: 0.50, stunDuration: 2.1, radius: 8.2, spellMult: 3.7, color: "#fb7185", desc: "Apex Rift surge: heal 45% HP, gain 50% Shield, freeze foes & detonate 370% Spell Power." },

    // --- NEW T15–T20 ENDGAME RELIC [E] SKILLS ---
    soul_bastion:        { id: "soul_bastion",        name: "Phylactery Ward",   icon: "☠", cooldown: 10.0, type: "heal_pulse",     animType: "verdant_bloom",   heroAnim: "raise", healPctHp: 0.48, shieldPctHp: 0.38, radius: 5.2, spellMult: 3.9, color: "#34d399", desc: "Restore 48% HP, weave a 38% Shield, purge hazards, and blast foes for 390% Spell." },
    abyssal_gaze:        { id: "abyssal_gaze",        name: "Eldritch Stasis",   icon: "👁", cooldown: 11.5, type: "time_freeze",    animType: "chrono_clock",    heroAnim: "raise", healPctHp: 0.44, shieldPctHp: 0.45, stunDuration: 2.2, radius: 8.2, spellMult: 4.1, color: "#e879f9", desc: "Petrify enemies in eldritch terror for 2.2s, deal 410% Spell, heal 44% HP & gain 45% Shield." },
    dragon_roar:         { id: "dragon_roar",         name: "Dragonheart Roar",  icon: "🐉", cooldown: 10.5, type: "haste_storm",    animType: "flame_nova",      heroAnim: "raise", speedBonus: 0.46, atkSpeedBonus: 0.62, critBonus: 0.30, shieldPctHp: 0.42, radius: 5.5, spellMult: 3.8, duration: 7.0, color: "#fb923c", desc: "+62% Atk Speed, +30% Crit, +42% Shield & scorch all nearby foes for 380% Spell." },
    entropy_shift:       { id: "entropy_shift",       name: "Chaos Singularity", icon: "⚡", cooldown: 10.5, type: "vortex_pull",    animType: "black_hole",      heroAnim: "raise", radius: 6.5, spellMult: 4.3, shieldPctHp: 0.44, hazardRestore: 80, color: "#f43f5e", desc: "Collapse space inward for 430% Spell, purge 80% hazards & gain a 44% Shield." },
    divine_ascension:    { id: "divine_ascension",    name: "Pantheon Grace",    icon: "👑", cooldown: 11.5, type: "time_freeze",    animType: "radiant_pillar",  heroAnim: "raise", healPctHp: 0.50, shieldPctHp: 0.55, stunDuration: 2.2, radius: 8.5, spellMult: 4.6, color: "#fde047", desc: "Ascend in divine light: heal 50% HP, gain 55% Shield, stun foes & detonate 460% Spell." },
    genesis_oblivion:    { id: "genesis_oblivion",    name: "Terminus Rebirth",  icon: "❖", cooldown: 12.0, type: "time_freeze",    animType: "radiant_pillar",  heroAnim: "raise", healPctHp: 0.55, shieldPctHp: 0.60, stunDuration: 2.3, radius: 9.0, spellMult: 5.2, color: "#ff3b5c", desc: "Ultimate Rift miracle: heal 55% HP, gain 60% Shield, freeze foes & detonate 520% Spell." }
  },

  /* ------------------------------------------------------------------------
     GEAR TEMPLATES (Starter + 20 3-Piece Sets + 6 Signature Special Weapons)
     ------------------------------------------------------------------------ */
  GEAR_TEMPLATES: {
    // --- STARTER (All Classes) ---
    iron_blade:               { id: "iron_blade",               name: "Gatekeeper Blade",        slot: "weapon", classReq: "all",         setTag: "Starter",         weaponStyle: "sword",        icon: "⚔", attackType: "melee",       range: 2.1,  attackRate: 1.45, weaponColor: "#cbd5e1", trailColor: "#94a3b8", skillId: "iron_cleave",        baseStats: { atk: 18, spell: 6, crit: 0.03 }, desc: "Reliable forged steel blade issued to new Rift scouts." },
    traveler_tunic:           { id: "traveler_tunic",           name: "Scout's Mantle",          slot: "armor",  classReq: "all",         setTag: "Starter",         icon: "🛡", visuals: { body: "#334155", cloak: "#2563eb", trim: "#cbd5e1", aura: null }, baseStats: { hp: 85, armor: 8, speed: 0.15, hazardResist: 0.05 }, desc: "Stitched leather and ward-cloth built for swift reconnaissance." },
    cracked_waystone:         { id: "cracked_waystone",         name: "Sanctuary Waystone",      slot: "relic",  classReq: "all",         setTag: "Starter",         icon: "✦", skillId: "sanctuary_aegis", baseStats: { hp: 40, spell: 10, hazardResist: 0.05 }, desc: "Hums softly with defensive energy from the Sanctuary Gate." },

    // --- 6 SIGNATURE SPECIAL WEAPONS (Drop in Special Dungeons & Craftable) ---
    muramasa_katana:          { id: "muramasa_katana",          name: "Muramasa Chrono-Katana",  slot: "weapon", classReq: "shadowblade", setTag: "Special",         weaponStyle: "katana",       dungeonId: "abyssal_throne",         craftCost: 650,  icon: "⚔", attackType: "melee_wave",  range: 3.3,  attackRate: 2.25, projSpeed: 14.5, projStyle: "crescent", weaponColor: "#38bdf8", trailColor: "#e0f2fe", skillId: "judgment_cut",        baseStats: { atk: 340, spell: 280, crit: 0.20, speed: 0.65 }, desc: "Signature Blade: Fires spatial slash-waves and executes Judgment Cut across 8 foes." },
    valkyrie_spear_shield:    { id: "valkyrie_spear_shield",    name: "Valkyrie Spear-Shield",   slot: "weapon", classReq: "vanguard",    setTag: "Special",         weaponStyle: "spear_shield", dungeonId: "celestial_crucible",     craftCost: 950,  icon: "🛡", attackType: "melee_wave",  range: 3.4,  attackRate: 1.85, projSpeed: 13.5, projStyle: "bolt",     weaponColor: "#fde047", trailColor: "#ffffff", skillId: "aegis_phalanx",       baseStats: { atk: 460, spell: 340, hp: 950, armor: 45 }, desc: "Signature Armament: Combines heavy spear thrusts with a 32% HP Phalanx Barrier." },
    plague_censer:            { id: "plague_censer",            name: "Plague-Bringer Censer",   slot: "weapon", classReq: "warden",      setTag: "Special",         weaponStyle: "censer",       dungeonId: "ashen_caldera",          craftCost: 1450, icon: "☣", attackType: "ranged_orb",  range: 7.4,  attackRate: 1.90, projSpeed: 12.5, projStyle: "orb",      weaponColor: "#84cc16", trailColor: "#bef264", skillId: "pandemonium_miasma",  baseStats: { atk: 480, spell: 690, lifesteal: 0.10, hazardResist: 0.20 }, desc: "Signature Censer: Launches virulent orbs and purges 55% dungeon hazards on [Q]." },
    aether_railcannon:        { id: "aether_railcannon",        name: "Aether Rail-Cannon",      slot: "weapon", classReq: "arcanist",    setTag: "Special",         weaponStyle: "cannon",       dungeonId: "shattered_clockwork",    craftCost: 2400, icon: "🔦", attackType: "ranged_nova", range: 8.2,  attackRate: 1.75, projSpeed: 15.5, projStyle: "bolt",     weaponColor: "#c084fc", trailColor: "#f5d0fe", skillId: "orbital_hyperbeam",   baseStats: { atk: 620, spell: 980, crit: 0.18, cdr: 0.16 }, desc: "Signature Cannon: Fires hyper-velocity bolts and a 12.5-tile Orbital Hyperbeam." },
    riftlord_pistols:         { id: "riftlord_pistols",         name: "Rift-Lord's Twin Pistols", slot: "weapon", classReq: "all",         setTag: "Special",         weaponStyle: "pistols",      dungeonId: "primordial_singularity", craftCost: 4200, icon: "🔫", attackType: "ranged_proj", range: 7.8,  attackRate: 2.65, projSpeed: 16.0, projStyle: "bullet",   weaponColor: "#fb923c", trailColor: "#fde047", skillId: "bullet_hell_waltz",   baseStats: { atk: 1380, spell: 1180, crit: 0.22, speed: 0.70 }, desc: "Signature Firearms: Blistering fire rate + 24-bullet Bullet Hell Waltz." },
    apocalypse_grimoire:      { id: "apocalypse_grimoire",      name: "Apocalypse Grimoire",     slot: "weapon", classReq: "all",         setTag: "Special",         weaponStyle: "grimoire",     dungeonId: "dragons_apex",           craftCost: 7800, icon: "☄", attackType: "ranged_nova", range: 8.6,  attackRate: 2.10, projSpeed: 15.0, projStyle: "star",     weaponColor: "#ffae19", trailColor: "#ff3b5c", skillId: "supernova_apocalypse",baseStats: { atk: 1950, spell: 2450, crit: 0.24, cdr: 0.18, lifesteal: 0.08 }, desc: "Signature Tome: Unleashes cosmic Supernovas and astral meteor storms." },
    storm_caller_longbow:     { id: "storm_caller_longbow",     name: "Storm-Caller Longbow",    slot: "weapon", classReq: "shadowblade", setTag: "Special",         weaponStyle: "bow",          dungeonId: "stormspire_citadel",     craftCost: 520,  icon: "🏹", attackType: "ranged_bow",  range: 8.4,  attackRate: 1.95, projSpeed: 16.5, projStyle: "bolt",     weaponColor: "#38bdf8", trailColor: "#fde047", skillId: "storm_arrow_rain",    baseStats: { atk: 240, spell: 165, crit: 0.18, speed: 0.55 }, desc: "Signature Longbow: Fires piercing storm-arrows (3-arrow fan every 3rd shot) + Tempest Arrow Rain." },
    void_chain_whipblade:     { id: "void_chain_whipblade",     name: "Void-Chain Whipblade",    slot: "weapon", classReq: "warden",      setTag: "Special",         weaponStyle: "whip",         dungeonId: "abyssal_throne",         craftCost: 720,  icon: "⛓", attackType: "melee_whip",  range: 4.4,  attackRate: 1.85, weaponColor: "#c084fc", trailColor: "#f0abfc", skillId: "abyssal_whip_lash",   baseStats: { atk: 310, spell: 340, lifesteal: 0.08, crit: 0.15 }, desc: "Signature Whipblade: Long-reach 4.4-tile void lashes that pull enemies inward + Abyssal Lash." },
    solaris_greatshield_mace: { id: "solaris_greatshield_mace", name: "Solaris Greatshield & Mace",slot:"weapon", classReq: "vanguard",    setTag: "Special",         weaponStyle: "spear_shield", dungeonId: "celestial_crucible",     craftCost: 1100, icon: "🛡", attackType: "melee_shield",range: 3.1,  attackRate: 1.70, weaponColor: "#fde047", trailColor: "#ffffff", skillId: "bastion_reflect",     baseStats: { atk: 430, spell: 320, hp: 1150, armor: 55 }, desc: "Signature Greatshield: Every swing grants a 3% HP Barrier; [Q] converts enemy shots into 300% counter-bolts." },
    chrono_twin_revolvers:    { id: "chrono_twin_revolvers",    name: "Chrono-Twin Revolvers",   slot: "weapon", classReq: "shadowblade", setTag: "Special",         weaponStyle: "pistols",      dungeonId: "shattered_clockwork",    craftCost: 2600, icon: "🔫", attackType: "ranged_burst",range: 7.6,  attackRate: 2.35, projSpeed: 16.5, projStyle: "bullet",   weaponColor: "#facc15", trailColor: "#38bdf8", skillId: "desperado_barrage",   baseStats: { atk: 880, spell: 720, crit: 0.21, cdr: 0.14, speed: 0.65 }, desc: "Signature Revolvers: Fires rapid 2-round bursts that build double Combo + Desperado Barrage." },
    nether_frost_staff:       { id: "nether_frost_staff",       name: "Nether-Frost Staff",      slot: "weapon", classReq: "arcanist",    setTag: "Special",         weaponStyle: "staff",        dungeonId: "frostbite_sanctum",      craftCost: 3400, icon: "❄", attackType: "ranged_beam", range: 8.2,  attackRate: 2.15, projSpeed: 17.0, projStyle: "bolt",     weaponColor: "#7dd3fc", trailColor: "#e0f2fe", skillId: "absolute_zero",       baseStats: { atk: 780, spell: 1180, crit: 0.19, cdr: 0.16 }, desc: "Signature Staff: Fires piercing frost-beams that chill enemies + Absolute Zero screen freeze." },

    // --- T1: SUNKEN QUARRY (Warrior / Vanguard) ---
    seismic_hammer:           { id: "seismic_hammer",           name: "Seismic Hammer",          slot: "weapon", classReq: "vanguard",    setTag: "Earthshaker",     weaponStyle: "hammer",       dungeonId: "sunken_quarry",          craftCost: 30,   icon: "🔨", attackType: "melee_heavy", range: 2.4,  attackRate: 1.2,  weaponColor: "#38bdf8", trailColor: "#7dd3fc", skillId: "seismic_shatter",     baseStats: { atk: 34, hp: 70, crit: 0.04 }, desc: "Massive crystal-bound maul that cleaves wide arcs and crushes armor." },
    earthshaker_plate:        { id: "earthshaker_plate",        name: "Earthshaker Plate",       slot: "armor",  classReq: "vanguard",    setTag: "Earthshaker",     dungeonId: "sunken_quarry",          craftCost: 30,   icon: "🛡", visuals: { body: "#1e3a5f", cloak: "#0284c7", trim: "#7dd3fc", aura: "rgba(56,189,248,0.28)" }, baseStats: { hp: 200, armor: 20, hazardResist: 0.16 }, desc: "Heavy quarry plate infused with oxygen-retaining crystal veins." },
    crystal_heart_relic:      { id: "crystal_heart_relic",      name: "Crystal Heart",           slot: "relic",  classReq: "vanguard",    setTag: "Earthshaker",     dungeonId: "sunken_quarry",          craftCost: 30,   icon: "◈", skillId: "crystal_bastion", baseStats: { hp: 115, atk: 12, hazardResist: 0.14 }, desc: "A resonant geode core that fortifies vitality and purifies dungeon air." },

    // --- T2: CINDER FOUNDRY (Rogue / Shadowblade) ---
    blaze_chakrams:           { id: "blaze_chakrams",           name: "Blaze Chakrams",          slot: "weapon", classReq: "shadowblade", setTag: "Forge-Lord",      weaponStyle: "chakram",      dungeonId: "cinder_foundry",         craftCost: 60,   icon: "✴", attackType: "ranged_proj", range: 5.8,  attackRate: 1.65, projSpeed: 11.0, projStyle: "chakram", weaponColor: "#f97316", trailColor: "#fde047", skillId: "inferno_ring",       baseStats: { atk: 48, crit: 0.10, speed: 0.30 }, desc: "Twin spinning razor furnace rings hurled at blistering speed." },
    forgelord_mail:           { id: "forgelord_mail",           name: "Forge-Lord Mail",         slot: "armor",  classReq: "shadowblade", setTag: "Forge-Lord",      dungeonId: "cinder_foundry",         craftCost: 60,   icon: "🔥", visuals: { body: "#7c2d12", cloak: "#ea580c", trim: "#facc15", aura: "rgba(249,115,22,0.3)" }, baseStats: { hp: 295, atk: 24, crit: 0.07, speed: 0.40, hazardResist: 0.16 }, desc: "Clockwork-vented battle armor engineered for agile critical strikers." },
    furnace_core_relic:       { id: "furnace_core_relic",       name: "Furnace Core",            slot: "relic",  classReq: "shadowblade", setTag: "Forge-Lord",      dungeonId: "cinder_foundry",         craftCost: 60,   icon: "⚙", skillId: "overclock_surge", baseStats: { hp: 95, atk: 24, crit: 0.08, cdr: 0.07 }, desc: "A pressurized brass turbine that supercharges reflexes on demand." },

    // --- T3: WHISPERING MARSH (Mystic / Warden) ---
    sporeburst_staff:         { id: "sporeburst_staff",         name: "Spore-Burst Staff",       slot: "weapon", classReq: "warden",      setTag: "Venom-Weaver",    weaponStyle: "staff",        dungeonId: "whispering_marsh",       craftCost: 105,  icon: "🌿", attackType: "ranged_orb",  range: 6.2,  attackRate: 1.50, projSpeed: 9.8, projStyle: "orb", weaponColor: "#22c55e", trailColor: "#a3e635", skillId: "spore_eruption",     baseStats: { atk: 38, spell: 78, lifesteal: 0.06 }, desc: "Living mycelial staff firing volatile bio-orbs that siphon vitality." },
    venomweaver_shroud:       { id: "venomweaver_shroud",       name: "Venom-Weaver Shroud",     slot: "armor",  classReq: "warden",      setTag: "Venom-Weaver",    dungeonId: "whispering_marsh",       craftCost: 105,  icon: "☣", visuals: { body: "#14532d", cloak: "#16a34a", trim: "#bef264", aura: "rgba(34,197,94,0.3)" }, baseStats: { hp: 450, spell: 46, lifesteal: 0.05, hazardResist: 0.20 }, desc: "Symbiotic marsh-silk cloak that converts toxins into cellular regeneration." },
    emerald_gland_relic:      { id: "emerald_gland_relic",      name: "Emerald Bloom",           slot: "relic",  classReq: "warden",      setTag: "Venom-Weaver",    dungeonId: "whispering_marsh",       craftCost: 105,  icon: "❦", skillId: "venom_bloom",     baseStats: { hp: 205, spell: 40, lifesteal: 0.05, hazardResist: 0.16 }, desc: "A pulsing floral core that blooms with restorative nectar in battle." },

    // --- T4: ASTRAL OBSERVATORY (Mage / Arcanist) ---
    nova_grimoire:            { id: "nova_grimoire",            name: "Nova Grimoire",           slot: "weapon", classReq: "arcanist",    setTag: "Starlight",       weaponStyle: "grimoire",     dungeonId: "astral_observatory",     craftCost: 175,  icon: "✦", attackType: "ranged_nova", range: 6.8,  attackRate: 1.55, projSpeed: 12.0, projStyle: "star", weaponColor: "#c084fc", trailColor: "#f0abfc", skillId: "starfall_cataclysm", baseStats: { atk: 54, spell: 124, crit: 0.10, cdr: 0.08 }, desc: "An unbound levitating tome firing piercing cosmic star-bolts." },
    starlight_vestments:      { id: "starlight_vestments",      name: "Starlight Vestments",     slot: "armor",  classReq: "arcanist",    setTag: "Starlight",       dungeonId: "astral_observatory",     craftCost: 175,  icon: "✧", visuals: { body: "#3b0764", cloak: "#7e22ce", trim: "#f5d0fe", aura: "rgba(192,132,252,0.36)" }, baseStats: { hp: 660, spell: 82, crit: 0.08, cdr: 0.08, speed: 0.40, hazardResist: 0.22 }, desc: "Celestial robes stitched from compressed nebula threads." },
    singularity_prism_relic:  { id: "singularity_prism_relic",  name: "Singularity Prism",       slot: "relic",  classReq: "arcanist",    setTag: "Starlight",       dungeonId: "astral_observatory",     craftCost: 175,  icon: "◎", skillId: "singularity_rift",baseStats: { hp: 315, spell: 76, crit: 0.08, cdr: 0.10 }, desc: "A miniature black hole trapped in glass that bends spacetime around foes." },

    // --- T5: FROSTBITE SANCTUM (Warrior / Vanguard) ---
    permafrost_halberd:       { id: "permafrost_halberd",       name: "Permafrost Halberd",      slot: "weapon", classReq: "vanguard",    setTag: "Glacier-Guard",   weaponStyle: "halberd",      dungeonId: "frostbite_sanctum",      craftCost: 270,  icon: "❄", attackType: "melee_heavy", range: 2.75, attackRate: 1.45, weaponColor: "#7dd3fc", trailColor: "#e0f2fe", skillId: "glacial_tempest",    baseStats: { atk: 145, spell: 92, crit: 0.11, hp: 230 }, desc: "A towering glacial polearm that shatters frozen armor in wide sweeps." },
    glacierguard_plate:       { id: "glacierguard_plate",       name: "Glacier-Guard Plate",     slot: "armor",  classReq: "vanguard",    setTag: "Glacier-Guard",   dungeonId: "frostbite_sanctum",      craftCost: 270,  icon: "🛡", visuals: { body: "#0c4a6e", cloak: "#0284c7", trim: "#e0f2fe", aura: "rgba(125,211,252,0.35)" }, baseStats: { hp: 980, atk: 58, spell: 44, armor: 34, hazardResist: 0.26 }, desc: "Runed frost-forged armor lined with thermal phoenix wool." },
    hearthstone_relic:        { id: "hearthstone_relic",        name: "Eternal Hearthstone",     slot: "relic",  classReq: "vanguard",    setTag: "Glacier-Guard",   dungeonId: "frostbite_sanctum",      craftCost: 270,  icon: "☀", skillId: "solar_hearth",    baseStats: { hp: 460, atk: 52, spell: 52, hazardResist: 0.22 }, desc: "Radiates unquenchable warmth that melts hypothermia and fortifies shields." },

    // --- T6: ABYSSAL THRONE (Mystic / Warden) ---
    soulreaver_scythe:        { id: "soulreaver_scythe",        name: "Soul-Reaver Scythe",      slot: "weapon", classReq: "warden",      setTag: "Eclipse-Lord",    weaponStyle: "scythe",       dungeonId: "abyssal_throne",         craftCost: 400,  icon: "☾", attackType: "melee_heavy", range: 2.95, attackRate: 1.65, weaponColor: "#f43f5e", trailColor: "#f0abfc", skillId: "abyssal_reap",       baseStats: { atk: 205, spell: 185, crit: 0.13, lifesteal: 0.07 }, desc: "Sovereign war-scythe forged from collapsed eclipse starlight." },
    eclipselord_regalia:      { id: "eclipselord_regalia",      name: "Eclipse-Lord Regalia",    slot: "armor",  classReq: "warden",      setTag: "Eclipse-Lord",    dungeonId: "abyssal_throne",         craftCost: 400,  icon: "♛", visuals: { body: "#2e1065", cloak: "#9f1239", trim: "#fda4af", aura: "rgba(244,63,94,0.36)" }, baseStats: { hp: 1420, atk: 90, spell: 92, crit: 0.10, armor: 44, hazardResist: 0.28 }, desc: "Imperial Rift armor worn by the conquerors of the Abyssal Throne." },
    dawnbreaker_sigil_relic:  { id: "dawnbreaker_sigil_relic",  name: "Dawnbreaker Sigil",       slot: "relic",  classReq: "warden",      setTag: "Eclipse-Lord",    dungeonId: "abyssal_throne",         craftCost: 400,  icon: "✹", skillId: "dawnbreaker_burst",baseStats: { hp: 670, atk: 78, spell: 102, cdr: 0.11, lifesteal: 0.06 }, desc: "A blinding celestial crest that banishes abyssal corruption." },

    // --- T7: STORMSPIRE CITADEL (Rogue / Shadowblade) ---
    volt_twinblades:          { id: "volt_twinblades",          name: "Volt-Reaver Twinblades",  slot: "weapon", classReq: "shadowblade", setTag: "Stormcaller",     weaponStyle: "twinblades",   dungeonId: "stormspire_citadel",     craftCost: 580,  icon: "⚡", attackType: "melee_wave",  range: 3.1,  attackRate: 2.1,  projSpeed: 13.0, projStyle: "bolt", weaponColor: "#38bdf8", trailColor: "#fde047", skillId: "thunderstep_barrage", baseStats: { atk: 275, spell: 225, crit: 0.15, speed: 0.50 }, desc: "Crackling dual storm-blades that unleash rapid lightning arcs on every strike." },
    stormcaller_plate:        { id: "stormcaller_plate",        name: "Stormcaller Plate",       slot: "armor",  classReq: "shadowblade", setTag: "Stormcaller",     dungeonId: "stormspire_citadel",     craftCost: 580,  icon: "⚡", visuals: { body: "#0c4a6e", cloak: "#1d4ed8", trim: "#fde047", aura: "rgba(56,189,248,0.4)" }, baseStats: { hp: 2020, atk: 128, spell: 118, crit: 0.12, speed: 0.45, armor: 52, hazardResist: 0.30 }, desc: "Conductive sky-iron armor humming with supercharged voltage." },
    thunderheart_relic:       { id: "thunderheart_relic",       name: "Thunderheart Core",       slot: "relic",  classReq: "shadowblade", setTag: "Stormcaller",     dungeonId: "stormspire_citadel",     craftCost: 580,  icon: "✦", skillId: "tempest_overdrive", baseStats: { hp: 960, atk: 116, spell: 128, crit: 0.11, cdr: 0.13 }, desc: "An eternal storm core that wraps its bearer in orbiting lightning." },

    // --- T8: CELESTIAL CRUCIBLE (Mage / Arcanist) ---
    dawnstar_greatsword:      { id: "dawnstar_greatsword",      name: "Dawnstar Greatsword",     slot: "weapon", classReq: "arcanist",    setTag: "Chrono-Seraph",   weaponStyle: "greatsword",   dungeonId: "celestial_crucible",     craftCost: 820,  icon: "☀", attackType: "melee_wave",  range: 3.35, attackRate: 1.75, projSpeed: 12.5, projStyle: "crescent", weaponColor: "#fde047", trailColor: "#ffffff", skillId: "celestial_cleave", baseStats: { atk: 360, spell: 340, crit: 0.16, lifesteal: 0.07 }, desc: "A titanic solar spellblade launching golden crescent shockwaves with every swing." },
    seraphic_aegis:           { id: "seraphic_aegis",           name: "Seraphic Aegis",          slot: "armor",  classReq: "arcanist",    setTag: "Chrono-Seraph",   dungeonId: "celestial_crucible",     craftCost: 820,  icon: "☀", visuals: { body: "#78350f", cloak: "#d97706", trim: "#fef08a", aura: "rgba(253,224,71,0.42)" }, baseStats: { hp: 2800, atk: 172, spell: 185, crit: 0.13, armor: 64, cdr: 0.12, hazardResist: 0.32 }, desc: "Radiant primordial vestments forged at the dawn of the Rift Gate." },
    infinity_hourglass_relic: { id: "infinity_hourglass_relic", name: "Infinity Hourglass",      slot: "relic",  classReq: "arcanist",    setTag: "Chrono-Seraph",   dungeonId: "celestial_crucible",     craftCost: 820,  icon: "⌛", skillId: "chrono_sanctuary", baseStats: { hp: 1340, atk: 155, spell: 195, cdr: 0.14, crit: 0.13 }, desc: "Halts the flow of time itself, freezing Rift Guardians in golden stasis." },

    // --- T9: CRIMSON CATACOMBS (Warrior / Vanguard) ---
    sanguine_greataxe:        { id: "sanguine_greataxe",        name: "Sanguine Greataxe",       slot: "weapon", classReq: "vanguard",    setTag: "Bloodlord",       weaponStyle: "halberd",      dungeonId: "crimson_catacombs",      craftCost: 1120, icon: "🪓", attackType: "melee_wave",  range: 3.3,  attackRate: 1.65, projSpeed: 12.5, projStyle: "crescent", weaponColor: "#ef4444", trailColor: "#fda4af", skillId: "sanguine_whirlwind", baseStats: { atk: 460, spell: 310, hp: 580, lifesteal: 0.08 }, desc: "A crimson executioner's axe that cleaves blood-waves across the crypt." },
    bloodlord_plate:          { id: "bloodlord_plate",          name: "Bloodlord Plate",         slot: "armor",  classReq: "vanguard",    setTag: "Bloodlord",       dungeonId: "crimson_catacombs",      craftCost: 1120, icon: "🩸", visuals: { body: "#7f1d1d", cloak: "#be123c", trim: "#fda4af", aura: "rgba(239,68,68,0.38)" }, baseStats: { hp: 3850, atk: 225, spell: 180, armor: 82, lifesteal: 0.06, hazardResist: 0.34 }, desc: "Crimson cathedral plate forged from solidified sanguine steel." },
    crimson_chalice_relic:    { id: "crimson_chalice_relic",    name: "Crimson Chalice",         slot: "relic",  classReq: "vanguard",    setTag: "Bloodlord",       dungeonId: "crimson_catacombs",      craftCost: 1120, icon: "🏆", skillId: "crimson_covenant", baseStats: { hp: 1850, atk: 205, spell: 215, lifesteal: 0.07, hazardResist: 0.28 }, desc: "Overflowing ruby goblet granting unrelenting vitality in deep Rifts." },

    // --- T10: ASHEN CALDERA (Rogue / Shadowblade) ---
    obsidian_daggers:         { id: "obsidian_daggers",         name: "Obsidian Fangs",          slot: "weapon", classReq: "shadowblade", setTag: "Ashwalker",       weaponStyle: "twinblades",   dungeonId: "ashen_caldera",          craftCost: 1520, icon: "🗡", attackType: "melee_wave",  range: 3.25, attackRate: 2.25, projSpeed: 13.5, projStyle: "chakram", weaponColor: "#fb923c", trailColor: "#fed7aa", skillId: "ash_fan_knives", baseStats: { atk: 580, spell: 420, crit: 0.18, speed: 0.60 }, desc: "Razor volcanic glass fangs that spit white-hot ember arcs." },
    ashwalker_garb:           { id: "ashwalker_garb",           name: "Ashwalker Garb",          slot: "armor",  classReq: "shadowblade", setTag: "Ashwalker",       dungeonId: "ashen_caldera",          craftCost: 1520, icon: "🌋", visuals: { body: "#292524", cloak: "#c2410c", trim: "#fed7aa", aura: "rgba(251,146,60,0.38)" }, baseStats: { hp: 4900, atk: 300, spell: 245, crit: 0.15, speed: 0.55, armor: 88, hazardResist: 0.35 }, desc: "Cinder-woven assassin leather impervious to pyroclastic storms." },
    volcanic_heart_relic:     { id: "volcanic_heart_relic",     name: "Volcanic Heart",          slot: "relic",  classReq: "shadowblade", setTag: "Ashwalker",       dungeonId: "ashen_caldera",          craftCost: 1520, icon: "🔥", skillId: "volcanic_frenzy", baseStats: { hp: 2350, atk: 270, spell: 275, crit: 0.14, cdr: 0.14 }, desc: "A molten magma core pulsing with explosive adrenaline." },

    // --- T11: SUNKEN LEVIATHAN (Mystic / Warden) ---
    abyssal_trident:          { id: "abyssal_trident",          name: "Abyssal Trident",         slot: "weapon", classReq: "warden",      setTag: "Leviathan",       weaponStyle: "staff",        dungeonId: "sunken_leviathan",       craftCost: 2050, icon: "🔱", attackType: "ranged_nova", range: 7.2,  attackRate: 1.75, projSpeed: 13.0, projStyle: "bolt", weaponColor: "#0ea5e9", trailColor: "#67e8f9", skillId: "maelstrom_impale", baseStats: { atk: 540, spell: 720, lifesteal: 0.08, hp: 720 }, desc: "Trench-forged royal trident hurling pressurized hydro-spears." },
    leviathan_scale:          { id: "leviathan_scale",          name: "Leviathan Scale",         slot: "armor",  classReq: "warden",      setTag: "Leviathan",       dungeonId: "sunken_leviathan",       craftCost: 2050, icon: "🌊", visuals: { body: "#082f49", cloak: "#0284c7", trim: "#67e8f9", aura: "rgba(14,165,233,0.4)" }, baseStats: { hp: 6250, atk: 310, spell: 385, armor: 102, lifesteal: 0.07, hazardResist: 0.38 }, desc: "Iridescent abyssal scales that shrug off crush-depth pressure." },
    tidal_pearl_relic:        { id: "tidal_pearl_relic",        name: "Tidal Pearl",             slot: "relic",  classReq: "warden",      setTag: "Leviathan",       dungeonId: "sunken_leviathan",       craftCost: 2050, icon: "🫧", skillId: "abyssal_tide", baseStats: { hp: 3050, atk: 295, spell: 365, cdr: 0.14, hazardResist: 0.34 }, desc: "An ancient leviathan pearl humming with restorative ocean wards." },

    // --- T12: SHATTERED CLOCKWORK (Mage / Arcanist) ---
    chronos_scepter:          { id: "chronos_scepter",          name: "Chronos Scepter",         slot: "weapon", classReq: "arcanist",    setTag: "Horologium",      weaponStyle: "grimoire",     dungeonId: "shattered_clockwork",    craftCost: 2750, icon: "⚙", attackType: "ranged_nova", range: 7.4,  attackRate: 1.80, projSpeed: 13.5, projStyle: "star", weaponColor: "#facc15", trailColor: "#fef08a", skillId: "chrono_barrage", baseStats: { atk: 650, spell: 890, crit: 0.17, cdr: 0.14 }, desc: "A levitating brass astrolabe launching piercing temporal star-bolts." },
    clockwork_mantle:         { id: "clockwork_mantle",         name: "Clockwork Mantle",        slot: "armor",  classReq: "arcanist",    setTag: "Horologium",      dungeonId: "shattered_clockwork",    craftCost: 2750, icon: "⌛", visuals: { body: "#422006", cloak: "#ca8a04", trim: "#38bdf8", aura: "rgba(250,204,21,0.4)" }, baseStats: { hp: 7800, atk: 400, spell: 490, crit: 0.14, armor: 114, cdr: 0.14, hazardResist: 0.38 }, desc: "Gilded horological robes synchronized to the heartbeat of the Rift." },
    paradox_gear_relic:       { id: "paradox_gear_relic",       name: "Paradox Gear",            slot: "relic",  classReq: "arcanist",    setTag: "Horologium",      dungeonId: "shattered_clockwork",    craftCost: 2750, icon: "🕰", skillId: "paradox_rewind", baseStats: { hp: 3800, atk: 375, spell: 465, cdr: 0.16, crit: 0.14 }, desc: "An impossible brass cogwheel that spins backward to mend mortal wounds." },

    // --- T13: MIRROR LABYRINTH (All Classes) ---
    prismatic_glaive:         { id: "prismatic_glaive",         name: "Prismatic Glaive",        slot: "weapon", classReq: "all",         setTag: "Prism-Monarch",   weaponStyle: "halberd",      dungeonId: "mirror_labyrinth",       craftCost: 3650, icon: "💎", attackType: "melee_wave",  range: 3.55, attackRate: 1.95, projSpeed: 14.0, projStyle: "bolt", weaponColor: "#f472b6", trailColor: "#fef08a", skillId: "prism_shatter", baseStats: { atk: 1060, spell: 1040, crit: 0.18, speed: 0.55 }, desc: "A refractive crystal glaive suited to any master, firing blinding prism bolts." },
    mirrorweave_armor:        { id: "mirrorweave_armor",        name: "Mirrorweave Armor",       slot: "armor",  classReq: "all",         setTag: "Prism-Monarch",   dungeonId: "mirror_labyrinth",       craftCost: 3650, icon: "🪞", visuals: { body: "#312e81", cloak: "#db2777", trim: "#fde047", aura: "rgba(244,114,182,0.42)" }, baseStats: { hp: 9600, atk: 540, spell: 540, crit: 0.15, armor: 132, cdr: 0.14, hazardResist: 0.40 }, desc: "Kaleidoscopic battlegear that bends incoming strikes into fractured light." },
    kaleidoscope_relic:       { id: "kaleidoscope_relic",       name: "Kaleidoscope Core",       slot: "relic",  classReq: "all",         setTag: "Prism-Monarch",   dungeonId: "mirror_labyrinth",       craftCost: 3650, icon: "✦", skillId: "prism_singularity", baseStats: { hp: 4750, atk: 490, spell: 520, crit: 0.15, cdr: 0.15, lifesteal: 0.06 }, desc: "A radiant crystal prism that pulls enemies into refracted chaos." },

    // --- T14: PRIMORDIAL SINGULARITY (All Classes) ---
    omega_riftblade:          { id: "omega_riftblade",          name: "Omega Riftblade",         slot: "weapon", classReq: "all",         setTag: "Primordial",      weaponStyle: "greatsword",   dungeonId: "primordial_singularity", craftCost: 4900, icon: "◎", attackType: "melee_wave",  range: 3.7,  attackRate: 2.0,  projSpeed: 14.5, projStyle: "crescent", weaponColor: "#fb7185", trailColor: "#fde047", skillId: "omega_cataclysm", baseStats: { atk: 1280, spell: 1260, crit: 0.20, lifesteal: 0.08, speed: 0.60 }, desc: "The primordial origin blade — sends reality-rending crescents across the arena." },
    primordial_carapace:      { id: "primordial_carapace",      name: "Primordial Carapace",     slot: "armor",  classReq: "all",         setTag: "Primordial",      dungeonId: "primordial_singularity", craftCost: 4900, icon: "♛", visuals: { body: "#1e052b", cloak: "#be123c", trim: "#fde047", aura: "rgba(251,113,133,0.48)" }, baseStats: { hp: 11800, atk: 680, spell: 680, crit: 0.16, armor: 155, cdr: 0.16, hazardResist: 0.42 }, desc: "Forged from the first light and final shadow of the Rift Gate." },
    genesis_core_relic:       { id: "genesis_core_relic",       name: "Genesis Core",            slot: "relic",  classReq: "all",         setTag: "Primordial",      dungeonId: "primordial_singularity", craftCost: 4900, icon: "✹", skillId: "genesis_aegis", baseStats: { hp: 5900, atk: 620, spell: 650, crit: 0.16, cdr: 0.16, lifesteal: 0.08 }, desc: "A miniature universe pulsing with boundless defensive and offensive power." },

    // --- T15: ASTRAL NECROPOLIS (Mystic / Warden) ---
    necrotic_scythe:          { id: "necrotic_scythe",          name: "Soul-Severing Scythe",    slot: "weapon", classReq: "warden",      setTag: "Soul-Forged",     weaponStyle: "scythe",       dungeonId: "astral_necropolis",      craftCost: 6600, icon: "☠", attackType: "melee_wave",  range: 3.7,  attackRate: 1.95, projSpeed: 14.5, projStyle: "crescent", weaponColor: "#34d399", trailColor: "#a7f3d0", skillId: "soul_shatter", baseStats: { atk: 1450, spell: 1850, crit: 0.19, lifesteal: 0.09 }, desc: "An ossuary war-scythe that reaps soul-waves from astral titans." },
    soulforged_shroud:        { id: "soulforged_shroud",        name: "Soul-Forged Shroud",      slot: "armor",  classReq: "warden",      setTag: "Soul-Forged",     dungeonId: "astral_necropolis",      craftCost: 6600, icon: "🛡", visuals: { body: "#022c22", cloak: "#059669", trim: "#a7f3d0", aura: "rgba(52,211,153,0.44)" }, baseStats: { hp: 15200, atk: 820, spell: 980, armor: 185, lifesteal: 0.08, hazardResist: 0.44 }, desc: "Woven from the phylactery silk of immortal lich lords." },
    phylactery_relic:         { id: "phylactery_relic",         name: "Lich Phylactery",         slot: "relic",  classReq: "warden",      setTag: "Soul-Forged",     dungeonId: "astral_necropolis",      craftCost: 6600, icon: "⚱", skillId: "soul_bastion", baseStats: { hp: 7600, atk: 750, spell: 920, cdr: 0.16, lifesteal: 0.08 }, desc: "An eternal soul-vessel that converts death into surging regeneration." },

    // --- T16: ELDRITCH ABYSS (Mage / Arcanist) ---
    eldritch_codex:           { id: "eldritch_codex",           name: "Necronomicon Codex",      slot: "weapon", classReq: "arcanist",    setTag: "Eldritch",        weaponStyle: "grimoire",     dungeonId: "eldritch_abyss",         craftCost: 8800, icon: "👁", attackType: "ranged_nova", range: 8.0,  attackRate: 2.0,  projSpeed: 15.0, projStyle: "star", weaponColor: "#e879f9", trailColor: "#f5d0fe", skillId: "eldritch_beam", baseStats: { atk: 1750, spell: 2450, crit: 0.21, cdr: 0.17 }, desc: "A forbidden cosmic grimoire firing piercing void-star barrages." },
    abyssal_mantle:           { id: "abyssal_mantle",           name: "Abyssal Mantle",          slot: "armor",  classReq: "arcanist",    setTag: "Eldritch",        dungeonId: "eldritch_abyss",         craftCost: 8800, icon: "✦", visuals: { body: "#2e1065", cloak: "#7e22ce", trim: "#f5d0fe", aura: "rgba(232,121,249,0.46)" }, baseStats: { hp: 19200, atk: 1050, spell: 1320, crit: 0.17, armor: 215, cdr: 0.17, hazardResist: 0.45 }, desc: "Robes stitched from the fabric of the deep eldritch void." },
    allseeing_eye_relic:      { id: "allseeing_eye_relic",      name: "All-Seeing Eye",          slot: "relic",  classReq: "arcanist",    setTag: "Eldritch",        dungeonId: "eldritch_abyss",         craftCost: 8800, icon: "◎", skillId: "abyssal_gaze", baseStats: { hp: 9600, atk: 980, spell: 1240, cdr: 0.18, crit: 0.17 }, desc: "An unblinking abyssal orb that freezes foes in cosmic dread." },

    // --- T17: DRAGON'S APEX (Warrior / Vanguard) ---
    dragon_slayer_blade:      { id: "dragon_slayer_blade",      name: "Wyrm-Slayer Greatsword",  slot: "weapon", classReq: "vanguard",    setTag: "Dragonscale",     weaponStyle: "greatsword",   dungeonId: "dragons_apex",           craftCost: 11800,icon: "🐉", attackType: "melee_wave",  range: 3.85, attackRate: 1.9,  projSpeed: 15.0, projStyle: "crescent", weaponColor: "#fb923c", trailColor: "#fef08a", skillId: "dragon_cataclysm", baseStats: { atk: 3150, spell: 2200, hp: 3200, crit: 0.21 }, desc: "Colossal greatsword forged from the fang of an ancient sky-wyrm." },
    dragonscale_plate:        { id: "dragonscale_plate",        name: "Dragonscale Plate",       slot: "armor",  classReq: "vanguard",    setTag: "Dragonscale",     dungeonId: "dragons_apex",           craftCost: 11800,icon: "🛡", visuals: { body: "#431407", cloak: "#ea580c", trim: "#fef08a", aura: "rgba(251,146,60,0.46)" }, baseStats: { hp: 25500, atk: 1550, spell: 1250, armor: 265, hazardResist: 0.48 }, desc: "Impervious wyrm-scale armor quenched in dragonfire." },
    dragon_heart_relic:       { id: "dragon_heart_relic",       name: "Ignis Dragon Heart",      slot: "relic",  classReq: "vanguard",    setTag: "Dragonscale",     dungeonId: "dragons_apex",           craftCost: 11800,icon: "🔥", skillId: "dragon_roar", baseStats: { hp: 12800, atk: 1420, spell: 1380, lifesteal: 0.08, hazardResist: 0.42 }, desc: "Beats with unstoppable draconic fury, igniting all nearby enemies." },

    // --- T18: CHAOS NEXUS (Rogue / Shadowblade) ---
    chaos_twinblades:         { id: "chaos_twinblades",         name: "Entropy Twinblades",      slot: "weapon", classReq: "shadowblade", setTag: "Chaos-Weaver",    weaponStyle: "twinblades",   dungeonId: "chaos_nexus",            craftCost: 15800,icon: "⚡", attackType: "melee_wave",  range: 3.8,  attackRate: 2.5,  projSpeed: 16.0, projStyle: "bolt", weaponColor: "#f43f5e", trailColor: "#38bdf8", skillId: "chaos_vortex", baseStats: { atk: 4050, spell: 3100, crit: 0.25, speed: 0.75 }, desc: "Twin dimensional daggers that tear open lightning rifts on every strike." },
    entropy_vestments:        { id: "entropy_vestments",        name: "Chaos-Weaver Garb",       slot: "armor",  classReq: "shadowblade", setTag: "Chaos-Weaver",    dungeonId: "chaos_nexus",            craftCost: 15800,icon: "🗡", visuals: { body: "#4c0519", cloak: "#be123c", trim: "#38bdf8", aura: "rgba(244,63,94,0.48)" }, baseStats: { hp: 31500, atk: 2050, spell: 1750, crit: 0.20, speed: 0.65, armor: 295, hazardResist: 0.48 }, desc: "Phase-shifting battle-shroud worn by masters of the Chaos Nexus." },
    chaos_orb_relic:          { id: "chaos_orb_relic",          name: "Unbound Chaos Orb",       slot: "relic",  classReq: "shadowblade", setTag: "Chaos-Weaver",    dungeonId: "chaos_nexus",            craftCost: 15800,icon: "✦", skillId: "entropy_shift", baseStats: { hp: 15800, atk: 1880, spell: 1850, crit: 0.19, cdr: 0.18 }, desc: "Collapses local gravity to drag foes into lethal melee range." },

    // --- T19: PANTHEON OF GODS (All Classes) ---
    godslayer_halberd:        { id: "godslayer_halberd",        name: "God-Slayer Halberd",      slot: "weapon", classReq: "all",         setTag: "God-Slayer",      weaponStyle: "halberd",      dungeonId: "pantheon_of_gods",       craftCost: 21000,icon: "👑", attackType: "melee_wave",  range: 4.0,  attackRate: 2.15, projSpeed: 16.0, projStyle: "crescent", weaponColor: "#fde047", trailColor: "#ffffff", skillId: "pantheon_wrath", baseStats: { atk: 5200, spell: 5000, crit: 0.24, speed: 0.65 }, desc: "Celestial polearm forged to dethrone the Astral Pantheon." },
    aegis_of_pantheon:        { id: "aegis_of_pantheon",        name: "Aegis of Pantheon",       slot: "armor",  classReq: "all",         setTag: "God-Slayer",      dungeonId: "pantheon_of_gods",       craftCost: 21000,icon: "☀", visuals: { body: "#78350f", cloak: "#f59e0b", trim: "#ffffff", aura: "rgba(253,224,71,0.52)" }, baseStats: { hp: 41000, atk: 2650, spell: 2650, crit: 0.19, armor: 345, cdr: 0.18, hazardResist: 0.50 }, desc: "Radiant god-plate gleaming with the light of a thousand suns." },
    divine_crown_relic:       { id: "divine_crown_relic",       name: "Astral Crown",            slot: "relic",  classReq: "all",         setTag: "God-Slayer",      dungeonId: "pantheon_of_gods",       craftCost: 21000,icon: "♕", skillId: "divine_ascension", baseStats: { hp: 20500, atk: 2450, spell: 2550, crit: 0.18, cdr: 0.18, lifesteal: 0.09 }, desc: "Bestows sovereign divine protection and celestial burst." },

    // --- T20: THE RIFT TERMINUS (All Classes — Ultimate Endgame Set) ---
    terminus_eternity_blade:  { id: "terminus_eternity_blade",  name: "Terminus Eternity Blade", slot: "weapon", classReq: "all",         setTag: "Oblivion",        weaponStyle: "greatsword",   dungeonId: "the_rift_terminus",      craftCost: 28000,icon: "❖", attackType: "melee_wave",  range: 4.2,  attackRate: 2.25, projSpeed: 16.5, projStyle: "crescent", weaponColor: "#ff3b5c", trailColor: "#ffd447", skillId: "oblivion_annihilation", baseStats: { atk: 6800, spell: 6600, crit: 0.26, lifesteal: 0.10, speed: 0.70 }, desc: "The ultimate weapon of Riftfall — cleaves timelines apart in crimson starlight." },
    oblivion_sovereign_plate: { id: "oblivion_sovereign_plate", name: "Oblivion Sovereign Plate",slot: "armor",  classReq: "all",         setTag: "Oblivion",        dungeonId: "the_rift_terminus",      craftCost: 28000,icon: "♛", visuals: { body: "#0d0312", cloak: "#9f1239", trim: "#ffd447", aura: "rgba(255,59,92,0.55)" }, baseStats: { hp: 54000, atk: 3500, spell: 3500, crit: 0.22, armor: 410, cdr: 0.20, hazardResist: 0.54 }, desc: "Forged from the core of the Rift Terminus itself." },
    void_heart_relic:         { id: "void_heart_relic",         name: "Heart of Oblivion",       slot: "relic",  classReq: "all",         setTag: "Oblivion",        dungeonId: "the_rift_terminus",      craftCost: 28000,icon: "✹", skillId: "genesis_oblivion", baseStats: { hp: 27000, atk: 3200, spell: 3350, crit: 0.20, cdr: 0.20, lifesteal: 0.10 }, desc: "The beating heart of the Rift — grants near-immortal resilience and annihilating power." }
  },

  /* ------------------------------------------------------------------------
     20 DUNGEON SET BONUSES (2-Piece Stat Bonus + 3-Piece Combat Passive)
     ------------------------------------------------------------------------ */
  SET_BONUSES: {
    "Earthshaker":   { name: "Earthshaker",   color: "#38bdf8", twoPieceDesc: "+18% Max HP & +18 Armor.",                        twoPieceMods: { hpPct: 0.18, armor: 18 },                                  threePieceDesc: "Taking or blocking damage erupts a Seismic Pulse every 3s for 140% ATK.", threePieceId: "earthshaker_pulse" },
    "Forge-Lord":    { name: "Forge-Lord",    color: "#f97316", twoPieceDesc: "+12% Crit Chance & +10% Move Speed.",             twoPieceMods: { crit: 0.12, speedPct: 0.10 },                              threePieceDesc: "Critical hits deal +30% bonus Crit Damage and vent 8% active hazards.",    threePieceId: "forgelord_crit" },
    "Venom-Weaver":  { name: "Venom-Weaver",  color: "#22c55e", twoPieceDesc: "+6% Lifesteal & +15% Spell Power.",               twoPieceMods: { lifesteal: 0.06, spellPct: 0.15 },                         threePieceDesc: "Attacks corrode enemy defenses, increasing all damage they take by +22%.", threePieceId: "venom_melt" },
    "Starlight":     { name: "Starlight",     color: "#c084fc", twoPieceDesc: "+12% Cooldown Reduction & +18% Spell Power.",     twoPieceMods: { cdr: 0.12, spellPct: 0.18 },                               threePieceDesc: "Casting [Q] or [E] triggers a free Astral Pulse for 150% Spell Power.",     threePieceId: "starlight_echo" },
    "Glacier-Guard": { name: "Glacier-Guard", color: "#7dd3fc", twoPieceDesc: "+22% Max HP & +20% Hazard Resistance.",           twoPieceMods: { hpPct: 0.22, hazardResist: 0.20 },                         threePieceDesc: "All attacks chill foes for 2.5s; chilled enemies take +25% bonus damage.",   threePieceId: "glacier_shatter" },
    "Eclipse-Lord":  { name: "Eclipse-Lord",  color: "#f43f5e", twoPieceDesc: "+16% ATK & Spell Power, +5% Lifesteal.",          twoPieceMods: { atkPct: 0.16, spellPct: 0.16, lifesteal: 0.05 },           threePieceDesc: "Overhealing converts into an Eclipse Shield (up to 35% of Max HP).",        threePieceId: "eclipse_overheal" },
    "Stormcaller":   { name: "Stormcaller",   color: "#38bdf8", twoPieceDesc: "+20% Attack Speed & +10% Crit Chance.",           twoPieceMods: { atkSpeedMult: 0.20, crit: 0.10 },                          threePieceDesc: "Every Critical Hit guarantees an extra Chain Lightning jump.",              threePieceId: "stormcaller_arc" },
    "Chrono-Seraph": { name: "Chrono-Seraph", color: "#fde047", twoPieceDesc: "+15% ATK & Spell Power, +12% Cooldown Red.",      twoPieceMods: { atkPct: 0.15, spellPct: 0.15, cdr: 0.12 },                 threePieceDesc: "Active [Q] & [E] skills deal +28% damage and grant +25% Move Speed.",       threePieceId: "chrono_ascend" },
    "Bloodlord":     { name: "Bloodlord",     color: "#ef4444", twoPieceDesc: "+22% Max HP & +7% Lifesteal.",                    twoPieceMods: { hpPct: 0.22, lifesteal: 0.07 },                          threePieceDesc: "Overhealing grants Shield (35% cap) & taking hits triggers 150% ATK burst.", threePieceId: "bloodlord_pact" },
    "Ashwalker":     { name: "Ashwalker",     color: "#fb923c", twoPieceDesc: "+14% Crit Chance & +22% Attack Speed.",           twoPieceMods: { crit: 0.14, atkSpeedMult: 0.22 },                          threePieceDesc: "Dashing grants 2.5s of guaranteed Crit and +35% bonus Crit Damage.",        threePieceId: "ashwalker_frenzy" },
    "Leviathan":     { name: "Leviathan",     color: "#0ea5e9", twoPieceDesc: "+24% Max HP, +22% Hazard Resist & +28 Armor.",    twoPieceMods: { hpPct: 0.24, hazardResist: 0.22, armor: 28 },              threePieceDesc: "Attacks chill foes (+25% dmg vs chilled) & purge 6% hazards on Crit.",     threePieceId: "leviathan_undertow" },
    "Horologium":    { name: "Horologium",    color: "#facc15", twoPieceDesc: "+16% Cooldown Red. & +20% Spell Power.",          twoPieceMods: { cdr: 0.16, spellPct: 0.20 },                               threePieceDesc: "Casting [Q] or [E] fires a 165% Spell temporal nova & +25% skill DMG.",     threePieceId: "horologium_surge" },
    "Prism-Monarch": { name: "Prism-Monarch", color: "#f472b6", twoPieceDesc: "+18% All Power, +10% Crit & +15% Attack Speed.",  twoPieceMods: { atkPct: 0.18, spellPct: 0.18, crit: 0.10, atkSpeedMult: 0.15 }, threePieceDesc: "Crits chain Prism Lightning & refract +24% vulnerability onto foes.",     threePieceId: "prism_refract" },
    "Primordial":    { name: "Primordial",    color: "#fb7185", twoPieceDesc: "+22% Max HP, +22% All Power & +12% CDR.",         twoPieceMods: { hpPct: 0.22, atkPct: 0.22, spellPct: 0.22, cdr: 0.12 },    threePieceDesc: "Crits chain lightning, overheal grants Shield, and [Q]/[E] deal +30% DMG.", threePieceId: "primordial_apex" },
    "Soul-Forged":   { name: "Soul-Forged",   color: "#34d399", twoPieceDesc: "+25% Spell Power & +8% Lifesteal.",               twoPieceMods: { spellPct: 0.25, lifesteal: 0.08 },                         threePieceDesc: "Overhealing grants Shield (35% cap) & attacks corrode foes (+22% DMG).",    threePieceId: "soulforged_reap" },
    "Eldritch":      { name: "Eldritch",      color: "#e879f9", twoPieceDesc: "+26% Spell Power, +18% CDR & +12% Crit.",         twoPieceMods: { spellPct: 0.26, cdr: 0.18, crit: 0.12 },                   threePieceDesc: "Casting [Q]/[E] triggers a 165% Spell void nova & +25% skill DMG.",         threePieceId: "eldritch_ascend" },
    "Dragonscale":   { name: "Dragonscale",   color: "#fb923c", twoPieceDesc: "+28% Max HP, +24% ATK & +45 Armor.",              twoPieceMods: { hpPct: 0.28, atkPct: 0.24, armor: 45 },                    threePieceDesc: "Crits deal +35% Crit DMG, vent 8% hazards, and trigger 140% ATK quake.",    threePieceId: "dragonscale_fury" },
    "Chaos-Weaver":  { name: "Chaos-Weaver",  color: "#f43f5e", twoPieceDesc: "+18% Crit, +26% Attack Speed & +15% Move Speed.", twoPieceMods: { crit: 0.18, atkSpeedMult: 0.26, speedPct: 0.15 },          threePieceDesc: "Dashing grants 2.5s guaranteed Crit & Crits chain Lightning (+24% vuln).",   threePieceId: "chaos_overload" },
    "God-Slayer":    { name: "God-Slayer",    color: "#fde047", twoPieceDesc: "+26% All Power, +25% Max HP & +15% Crit.",        twoPieceMods: { atkPct: 0.26, spellPct: 0.26, hpPct: 0.25, crit: 0.15 },   threePieceDesc: "Pantheon Might: [Q]/[E] deal +30% DMG, Crits chain Lightning & +35% Crit.", threePieceId: "godslayer_wrath" },
    "Oblivion":      { name: "Oblivion",      color: "#ff3b5c", twoPieceDesc: "+32% All Power, +32% Max HP & +20% CDR.",         twoPieceMods: { atkPct: 0.32, spellPct: 0.32, hpPct: 0.32, cdr: 0.20 },    threePieceDesc: "Terminus Dominion: Chain Lightning, Overheal Shield, +35% Crit & +30% Skill.",threePieceId: "oblivion_dominion" }
  },

  SUBSTAT_POOL: [
    { key: "crit",         label: "Crit Chance",        min: 0.015, max: 0.07,  isPct: true },
    { key: "lifesteal",    label: "Lifesteal",          min: 0.01,  max: 0.045, isPct: true },
    { key: "cdr",          label: "Cooldown Reduction", min: 0.025, max: 0.085, isPct: true },
    { key: "speed",        label: "Move Speed",         min: 0.15,  max: 0.55,  isPct: false },
    { key: "hazardResist", label: "Hazard Resist",      min: 0.04,  max: 0.15,  isPct: true },
    { key: "atk",          label: "Bonus ATK",          min: 8,     max: 26,    isPct: false, scalesWithTier: true },
    { key: "spell",        label: "Spell Power",        min: 8,     max: 28,    isPct: false, scalesWithTier: true },
    { key: "hp",           label: "Max HP",             min: 35,    max: 120,   isPct: false, scalesWithTier: true }
  ],

  BLESSINGS: [
    { id: "bless_vitality",  name: "Titan's Blood",       desc: "+12% Max HP per rank.",                                    stat: "hpPct",        perRank: 0.12, maxRank: 15, baseCost: 1, costStep: 1 },
    { id: "bless_might",     name: "Riftbreaker Might",   desc: "+10% ATK & Spell Power per rank.",                         stat: "powerPct",     perRank: 0.10, maxRank: 15, baseCost: 1, costStep: 1 },
    { id: "bless_fortune",   name: "Gilded Gate",         desc: "+18% Gold & Rift Shards from combat & bounties per rank.", stat: "currencyPct",  perRank: 0.18, maxRank: 15, baseCost: 1, costStep: 1 },
    { id: "bless_survival",  name: "Aegis of Adaptation", desc: "+8% Environmental Hazard Resistance per rank.",            stat: "hazardResist", perRank: 0.08, maxRank: 12, baseCost: 2, costStep: 1 },
    { id: "bless_swiftness", name: "Chrono Stride",       desc: "+5% Move Speed & +3% Cooldown Reduction per rank.",        stat: "swiftness",    perRank: 0.05, cdrPerRank: 0.03, maxRank: 12, baseCost: 2, costStep: 1 },
    { id: "bless_luck",      name: "Artisan's Fortune",   desc: "+0.12 Rarity Drop Luck on all loot per rank.",             stat: "rarityLuck",   perRank: 0.12, maxRank: 10, baseCost: 2, costStep: 2 }
  ],

  /* ------------------------------------------------------------------------
     3-BRANCH HERO MASTERY TREE (1 Point per Hero Level above Lv. 1)
     ------------------------------------------------------------------------ */
  MASTERY_TREE: [
    {
      id: "warlord",
      name: "Warlord Path",
      icon: "⚔",
      color: "#ef4444",
      subtitle: "Raw Damage, Crit & Attack Speed",
      nodes: [
        { id: "m_brutality", name: "Relentless Force", icon: "⚔", maxRank: 10, reqBranchPts: 0, stat: "powerPct", perRank: 0.04, desc: "+4% ATK & Spell Power per rank." },
        { id: "m_precision", name: "Lethal Precision", icon: "🎯", maxRank: 8,  reqBranchPts: 0, stat: "crit",     perRank: 0.015, desc: "+1.5% Crit Chance per rank." },
        { id: "m_zeal",      name: "Blade Tempo",      icon: "⚡", maxRank: 6,  reqBranchPts: 3, stat: "atkSpeedMult", perRank: 0.04, desc: "+4% Attack Speed per rank (Req. 3 Warlord pts)." },
        { id: "m_key_carnage", name: "KEYSTONE: Overwhelming Carnage", icon: "🔥", maxRank: 1, reqBranchPts: 6, isKeystone: true, desc: "Critical hits deal +35% bonus Crit Damage and reduce [Q] cooldown by 0.25s." }
      ]
    },
    {
      id: "bastion",
      name: "Bastion Path",
      icon: "🛡",
      color: "#38bdf8",
      subtitle: "Vitality, Armor & Siphon",
      nodes: [
        { id: "m_fortitude", name: "Titan Heart",      icon: "❤", maxRank: 10, reqBranchPts: 0, stat: "hpPct",    perRank: 0.05, desc: "+5% Max HP per rank." },
        { id: "m_bulwark",   name: "Runed Plating",    icon: "🛡", maxRank: 8,  reqBranchPts: 0, stat: "armor",    perRank: 6,    desc: "+6 Armor per rank." },
        { id: "m_siphon",    name: "Crimson Hunger",   icon: "🩸", maxRank: 6,  reqBranchPts: 3, stat: "lifesteal",perRank: 0.01, desc: "+1% Lifesteal per rank (Req. 3 Bastion pts)." },
        { id: "m_key_aegis", name: "KEYSTONE: Immortal Sentinel", icon: "💠", maxRank: 1, reqBranchPts: 6, isKeystone: true, desc: "Entering any dungeon room grants a 25% Max HP Shield and +15% Hazard Resistance." }
      ]
    },
    {
      id: "riftwalker",
      name: "Riftwalker Path",
      icon: "✦",
      color: "#c084fc",
      subtitle: "Cooldowns, Mobility & Fortune",
      nodes: [
        { id: "m_haste",     name: "Temporal Flow",    icon: "⌛", maxRank: 8,  reqBranchPts: 0, stat: "cdr",      perRank: 0.02, desc: "+2% Cooldown Reduction per rank." },
        { id: "m_stride",    name: "Windrunner",       icon: "👟", maxRank: 8,  reqBranchPts: 0, stat: "speedPct", perRank: 0.025, desc: "+2.5% Move Speed per rank." },
        { id: "m_warding",   name: "Rift Attunement",  icon: "◈", maxRank: 6,  reqBranchPts: 3, stat: "hazardResist", perRank: 0.03, desc: "+3% Hazard Resistance per rank (Req. 3 Riftwalker pts)." },
        { id: "m_key_nova",  name: "KEYSTONE: Astral Conduit", icon: "🌟", maxRank: 1, reqBranchPts: 6, isKeystone: true, desc: "Dashing triggers a shockwave for 120% Spell Power and restores 8% Max HP." }
      ]
    }
  ],

  /* ------------------------------------------------------------------------
     RIFT REBIRTH (PRESTIGE AT LV. 30+) & WEAPON SOUL-AWAKENING
     ------------------------------------------------------------------------ */
  REBIRTH_REQ_LEVEL: 30,
  REBIRTH_PERKS: [
    { id: "rb_essence_power", name: "Transcendent Might",  icon: "⚔", desc: "+15% Base ATK & Spell Power per rank.",               stat: "powerPct",    perRank: 0.15, maxRank: 20, cost: 1 },
    { id: "rb_essence_hp",    name: "Eternal Vessel",      icon: "❤", desc: "+18% Base Max HP per rank.",                          stat: "hpPct",       perRank: 0.18, maxRank: 20, cost: 1 },
    { id: "rb_start_boon",    name: "Astral Inheritance",  icon: "✦", desc: "Start every dungeon expedition with +1 free Boon.",    stat: "startBoons",  perRank: 1,    maxRank: 3,  cost: 2 },
    { id: "rb_mythic_luck",   name: "Primordial Fortune",  icon: "◈", desc: "+0.25 Rarity Luck & +25% Gold/Shards per rank.",      stat: "luckAndGold", perRank: 0.25, maxRank: 10, cost: 1 }
  ],

  WEAPON_AWAKENING_TIERS: [
    { tier: 0, name: "Unawakened",   kills: 0,   powerMult: 1.00, atkSpdBonus: 0.00, auraColor: null },
    { tier: 1, name: "Soul-Bound I", kills: 60,  powerMult: 1.12, atkSpdBonus: 0.06, auraColor: "#38bdf8" },
    { tier: 2, name: "Awakened II",  kills: 200, powerMult: 1.26, atkSpdBonus: 0.12, auraColor: "#c084fc" },
    { tier: 3, name: "Ascended III", kills: 500, powerMult: 1.45, atkSpdBonus: 0.20, auraColor: "#ffd447" }
  ]
};