/* ==========================================================================
   RIFTFALL — CORE ENGINE & RPG RUNTIME (game.js) — PART 1 OF 2
   Pixel-Art 2.5D Isometric Engine, Distinct Enemy & Boss Sprites,
   Directional Character Eyes, Survival Hazards, Loot Physics, Web Audio Synth,
   Idle Mercenaries, Blacksmith Forging, and Crash-Proof Game Loop.
   ========================================================================== */

(() => {
  "use strict";

  const DATA = window.GAME_DATA;
  const C = DATA.CONSTANTS;

  /* ========================================================================
     UTILITIES & MATH HELPERS
     ======================================================================== */
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const dist = (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1);
  const randRange = (min, max) => min + Math.random() * (max - min);
  const randInt = (min, max) => Math.floor(randRange(min, max + 1));
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const uid = () => "it_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 7);

  function fmtNum(n) {
    if (n === undefined || n === null || Number.isNaN(n)) return "0";
    const abs = Math.abs(n);
    if (abs >= 1e9) return (n / 1e9).toFixed(2) + "B";
    if (abs >= 1e6) return (n / 1e6).toFixed(2) + "M";
    if (abs >= 1e4) return (n / 1e3).toFixed(1) + "K";
    return Math.floor(n).toLocaleString();
  }

  function fmtStatVal(key, val) {
    if (key === "crit" || key === "lifesteal" || key === "cdr" || key === "hazardResist") {
      return (val * 100).toFixed(1).replace(/\.0$/, "") + "%";
    }
    if (key === "speed") return val.toFixed(2);
    return Math.round(val).toLocaleString();
  }

  const STAT_LABELS = {
    hp: "Max HP",
    atk: "Attack Power",
    spell: "Spell Power",
    crit: "Crit Chance",
    speed: "Move Speed",
    hazardResist: "Hazard Resist",
    lifesteal: "Lifesteal",
    cdr: "Cooldown Red.",
    armor: "Armor"
  };

  /* ========================================================================
     WEB AUDIO SYNTHESIZER (Zero External Audio Assets)
     ======================================================================== */
  class SoundEngine {
    constructor() {
      this.ctx = null;
      this.muted = false;
      this.volume = 0.45;
      this.noiseBuffer = null;
    }

    init() {
      try {
        if (this.ctx) {
          if (this.ctx.state === "suspended") this.ctx.resume().catch(() => {});
          return;
        }
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        this.ctx = new AudioCtx();
        const len = Math.floor(this.ctx.sampleRate * 0.4);
        this.noiseBuffer = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
        const data = this.noiseBuffer.getChannelData(0);
        for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
      } catch (e) {
        this.ctx = null;
      }
    }

    tone(freqStart, freqEnd, duration, type = "triangle", gainPeak = 0.25, delay = 0) {
      if (this.muted || this.volume <= 0) return;
      try {
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime + delay;
        const dur = Math.max(0.02, duration);
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(Math.max(30, freqStart), now);
        osc.frequency.exponentialRampToValueAtTime(Math.max(30, freqEnd), now + dur);

        const peak = Math.max(0.001, gainPeak * this.volume);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(peak, now + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + dur + 0.02);
      } catch (e) {}
    }

    noise(duration, filterFreq = 900, gainPeak = 0.22, delay = 0) {
      if (this.muted || this.volume <= 0) return;
      try {
        this.init();
        if (!this.ctx || !this.noiseBuffer) return;

        const now = this.ctx.currentTime + delay;
        const dur = Math.max(0.02, duration);
        const src = this.ctx.createBufferSource();
        src.buffer = this.noiseBuffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(filterFreq, now);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(Math.max(0.001, gainPeak * this.volume), now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

        src.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        src.start(now);
        src.stop(now + dur + 0.02);
      } catch (e) {}
    }

    swing() {
      this.tone(420, 140, 0.11, "sawtooth", 0.12);
      this.noise(0.07, 1400, 0.1);
    }

    rangedCast() {
      this.tone(580, 920, 0.1, "sine", 0.13);
    }

    hit() {
      this.tone(190, 75, 0.08, "square", 0.11);
    }

    crit() {
      this.tone(540, 880, 0.09, "triangle", 0.16);
      this.tone(880, 1280, 0.12, "sine", 0.14, 0.04);
    }

    skillQ() {
      this.tone(240, 620, 0.16, "sawtooth", 0.18);
      this.noise(0.18, 1200, 0.16, 0.03);
    }

    skillE() {
      this.tone(360, 740, 0.22, "sine", 0.18);
      this.tone(540, 960, 0.26, "triangle", 0.15, 0.06);
    }

    dash() {
      this.noise(0.14, 1800, 0.16);
      this.tone(280, 520, 0.12, "sine", 0.1);
    }

    playerHurt() {
      this.tone(150, 58, 0.16, "sawtooth", 0.22);
      this.noise(0.12, 500, 0.18);
    }

    bossWarn() {
      this.tone(180, 130, 0.28, "sawtooth", 0.24);
      this.tone(130, 95, 0.34, "sawtooth", 0.24, 0.22);
    }

    bossSlam() {
      this.tone(120, 38, 0.28, "triangle", 0.32);
      this.noise(0.24, 600, 0.28);
    }

    loot(rarity) {
      if (rarity === "mythic") {
        this.tone(523, 523, 0.12, "triangle", 0.2, 0);
        this.tone(659, 659, 0.12, "triangle", 0.2, 0.09);
        this.tone(784, 784, 0.14, "triangle", 0.22, 0.18);
        this.tone(1046, 1046, 0.32, "sine", 0.24, 0.28);
      } else if (rarity === "epic") {
        this.tone(587, 784, 0.14, "triangle", 0.18);
        this.tone(880, 1174, 0.22, "sine", 0.18, 0.1);
      } else {
        this.tone(660, 940, 0.12, "sine", 0.14);
      }
    }

    upgrade() {
      this.tone(330, 660, 0.12, "triangle", 0.2);
      this.tone(660, 990, 0.2, "sine", 0.2, 0.08);
    }

    flask() {
      this.tone(420, 840, 0.18, "sine", 0.18);
      this.tone(620, 1020, 0.16, "triangle", 0.12, 0.08);
    }

    portal() {
      this.tone(240, 720, 0.32, "sine", 0.2);
      this.tone(360, 960, 0.35, "triangle", 0.14, 0.08);
    }

    levelUp() {
      const notes = [440, 554, 659, 880];
      notes.forEach((n, i) => this.tone(n, n * 1.02, 0.2, "triangle", 0.2, i * 0.08));
    }

    victory() {
      const notes = [523, 659, 784, 1046];
      notes.forEach((n, i) => this.tone(n, n, 0.26, "triangle", 0.22, i * 0.11));
    }

    defeat() {
      this.tone(260, 180, 0.24, "sawtooth", 0.2, 0);
      this.tone(180, 110, 0.38, "sawtooth", 0.2, 0.22);
    }

    uiClick() {
      this.tone(640, 480, 0.05, "sine", 0.08);
    }
  }

  /* ========================================================================
     GEAR & STAT COMPUTATION SYSTEM
     ======================================================================== */
  const GearSystem = {
    getTemplate(templateId) {
      return DATA.GEAR_TEMPLATES[templateId] || DATA.GEAR_TEMPLATES.iron_blade;
    },

    getDungeonTierIndex(dungeonId) {
      const idx = DATA.DUNGEONS.findIndex((d) => d.id === dungeonId);
      return idx >= 0 ? idx + 1 : 1;
    },

    rollSubstats(rarityId, tierIndex = 1) {
      const rar = DATA.RARITIES[rarityId] || DATA.RARITIES.common;
      const count = rar.substatCount;
      const pool = [...DATA.SUBSTAT_POOL];
      const chosen = [];
      for (let i = 0; i < count && pool.length > 0; i++) {
        const idx = Math.floor(Math.random() * pool.length);
        const def = pool.splice(idx, 1)[0];
        let val = randRange(def.min, def.max);
        if (def.scalesWithTier) {
          val *= 1 + (tierIndex - 1) * 0.65;
          val *= rar.statMult * 0.85;
          val = Math.round(val);
        } else {
          val = Number((val * (0.85 + rar.order * 0.12)).toFixed(3));
        }
        chosen.push({ key: def.key, value: val });
      }
      return chosen;
    },

    createItem(templateId, rarityId = "common", upgradeLevel = 0) {
      const tpl = this.getTemplate(templateId);
      const safeRar = DATA.RARITIES[rarityId] ? rarityId : "common";
      const tierIndex = this.getDungeonTierIndex(tpl.dungeonId);
      return {
        uid: uid(),
        templateId: tpl.id,
        slot: tpl.slot,
        rarity: safeRar,
        level: upgradeLevel,
        locked: false,
        substats: this.rollSubstats(safeRar, tierIndex)
      };
    },

    rollRarity(luckBonus = 0, minRarity = "common") {
      const rarities = ["common", "rare", "epic", "mythic"];
      const minOrder = (DATA.RARITIES[minRarity] || DATA.RARITIES.common).order;
      const weights = rarities.map((id) => {
        const r = DATA.RARITIES[id];
        if (r.order < minOrder) return 0;
        if (id === "common") return Math.max(36, r.dropWeight - luckBonus * 14);
        if (id === "rare") return r.dropWeight + luckBonus * 8.0;
        if (id === "epic") return r.dropWeight + luckBonus * 3.8;
        return r.dropWeight + luckBonus * 1.4;
      });
      const total = weights.reduce((a, b) => a + b, 0);
      let roll = Math.random() * total;
      for (let i = 0; i < rarities.length; i++) {
        roll -= weights[i];
        if (roll <= 0) return rarities[i];
      }
      return rarities[rarities.length - 1];
    },

    computeItemStats(item, levelOverride = null) {
      if (!item) return {};
      const tpl = this.getTemplate(item.templateId);
      const rar = DATA.RARITIES[item.rarity] || DATA.RARITIES.common;
      const lvl = levelOverride !== null ? levelOverride : item.level || 0;
      const mult = rar.statMult * (1 + lvl * 0.085);
      const out = {};

      for (const [k, baseVal] of Object.entries(tpl.baseStats)) {
        if (k === "crit" || k === "lifesteal" || k === "cdr" || k === "hazardResist" || k === "speed") {
          out[k] = Number((baseVal * (1 + (rar.order - 1) * 0.2 + lvl * 0.014)).toFixed(4));
        } else {
          out[k] = Math.round(baseVal * mult);
        }
      }

      for (const sub of item.substats || []) {
        out[sub.key] = (out[sub.key] || 0) + sub.value;
      }
      return out;
    },

    computeItemPower(item) {
      const s = this.computeItemStats(item);
      let p = 0;
      p += (s.hp || 0) * 0.25;
      p += (s.atk || 0) * 2.2;
      p += (s.spell || 0) * 2.0;
      p += (s.armor || 0) * 1.4;
      p += (s.crit || 0) * 380;
      p += (s.lifesteal || 0) * 420;
      p += (s.cdr || 0) * 320;
      p += (s.hazardResist || 0) * 160;
      p += (s.speed || 0) * 45;
      return Math.round(p);
    },

    getSellValue(item) {
      const rar = DATA.RARITIES[item.rarity] || DATA.RARITIES.common;
      const tpl = this.getTemplate(item.templateId);
      const tier = this.getDungeonTierIndex(tpl.dungeonId);
      return Math.round(rar.sellBase * (1 + (tier - 1) * 0.85) * (1 + item.level * 0.22));
    },

    getSalvageValue(item) {
      const rar = DATA.RARITIES[item.rarity] || DATA.RARITIES.common;
      const tpl = this.getTemplate(item.templateId);
      const tier = this.getDungeonTierIndex(tpl.dungeonId);
      return Math.max(1, Math.round(rar.salvageBase * (1 + (tier - 1) * 0.7) * (1 + item.level * 0.14)));
    },

    getUpgradeCost(item) {
      const rar = DATA.RARITIES[item.rarity] || DATA.RARITIES.common;
      const tpl = this.getTemplate(item.templateId);
      const tier = this.getDungeonTierIndex(tpl.dungeonId);
      return Math.round((40 + item.level * 30) * Math.pow(1.11, item.level) * (0.85 + rar.order * 0.2) * (0.8 + tier * 0.35));
    },

    getRerollCost(item) {
      const rar = DATA.RARITIES[item.rarity] || DATA.RARITIES.common;
      return Math.round(C.REROLL_BASE_SHARDS * (0.75 + rar.order * 0.45));
    }
  };

  /* ========================================================================
     ISOMETRIC PIXEL PROJECTION & 2.5D RENDER HELPERS
     ======================================================================== */
  const ISO = {
    PIXEL_SCALE: 2,
    TILE_W: 48,
    TILE_H: 24,
    Z_SCALE: 20,

    toScreen(wx, wy, wz = 0, camX = 0, camY = 0, halfW = 0, halfH = 0) {
      const rx = wx - camX;
      const ry = wy - camY;
      return {
        x: Math.round((rx - ry) * (this.TILE_W * 0.5) + halfW),
        y: Math.round((rx + ry) * (this.TILE_H * 0.5) - wz * this.Z_SCALE + halfH)
      };
    },

    worldDirToScreen(wx, wy) {
      const sx = (wx - wy) * (this.TILE_W * 0.5);
      const sy = (wx + wy) * (this.TILE_H * 0.5);
      const len = Math.hypot(sx, sy) || 1;
      return { x: sx / len, y: sy / len };
    }
  };

  function drawIsoDiamond(ctx, cx, cy, w, h, fill, stroke = null, lineWidth = 1) {
    const x = Math.round(cx);
    const y = Math.round(cy);
    const hw = Math.round(w * 0.5);
    const hh = Math.round(h * 0.5);
    ctx.beginPath();
    ctx.moveTo(x, y - hh);
    ctx.lineTo(x + hw, y);
    ctx.lineTo(x, y + hh);
    ctx.lineTo(x - hw, y);
    ctx.closePath();
    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }
  }

  function drawIsoBlock(ctx, sx, sy, tileW, tileH, heightPx, colTop, colLeft, colRight, stroke = "#090c14") {
    const x = Math.round(sx);
    const y = Math.round(sy);
    const hw = Math.round(tileW * 0.5);
    const hh = Math.round(tileH * 0.5);
    const h = Math.round(heightPx);

    // Left face
    ctx.beginPath();
    ctx.moveTo(x - hw, y - h);
    ctx.lineTo(x, y + hh - h);
    ctx.lineTo(x, y + hh);
    ctx.lineTo(x - hw, y);
    ctx.closePath();
    ctx.fillStyle = colLeft;
    ctx.fill();

    // Right face
    ctx.beginPath();
    ctx.moveTo(x + hw, y - h);
    ctx.lineTo(x, y + hh - h);
    ctx.lineTo(x, y + hh);
    ctx.lineTo(x + hw, y);
    ctx.closePath();
    ctx.fillStyle = colRight;
    ctx.fill();

    // Top face
    ctx.beginPath();
    ctx.moveTo(x, y - hh - h);
    ctx.lineTo(x + hw, y - h);
    ctx.lineTo(x, y + hh - h);
    ctx.lineTo(x - hw, y - h);
    ctx.closePath();
    ctx.fillStyle = colTop;
    ctx.fill();

    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, y - hh - h);
      ctx.lineTo(x + hw, y - h);
      ctx.lineTo(x + hw, y);
      ctx.lineTo(x, y + hh);
      ctx.lineTo(x - hw, y);
      ctx.lineTo(x - hw, y - h);
      ctx.closePath();
      ctx.stroke();

      ctx.strokeStyle = "rgba(255,255,255,0.22)";
      ctx.beginPath();
      ctx.moveTo(x - hw + 1, y - h);
      ctx.lineTo(x, y - hh - h + 1);
      ctx.lineTo(x + hw - 1, y - h);
      ctx.stroke();
    }
  }

  function drawIsoGroundEllipse(ctx, sx, sy, radiusTiles, fill, stroke = null, lineWidth = 1) {
    const r = Number.isFinite(radiusTiles) ? Math.max(0.05, radiusTiles) : 0.5;
    const rx = Math.max(1, Math.round(r * ISO.TILE_W * 0.52));
    const ry = Math.max(1, Math.round(r * ISO.TILE_H * 0.52));
    ctx.beginPath();
    ctx.ellipse(Math.round(sx), Math.round(sy), rx, ry, 0, 0, Math.PI * 2);
    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }
  }

  /* ========================================================================
     MAIN GAME CONTROLLER
     ======================================================================== */
  class RiftfallGame {
    constructor() {
      document.title = DATA.GAME_TITLE + " — Pixel 2.5D Isometric Dungeon RPG";

      this.canvas = document.getElementById("game-canvas");
      this.ctx = this.canvas.getContext("2d");
      this.minimapCanvas = document.getElementById("minimap-canvas");
      this.minimapCtx = this.minimapCanvas.getContext("2d");

      this.sfx = new SoundEngine();

      this.save = this.createDefaultSave();
      this.loadGame();

      this.mode = "hub";
      this.activeModal = null;
      this.selectedInvUid = null;
      this.invFilter = "all";
      this.invSort = "rarity";
      this.forgeSlot = "weapon";

      this.keys = new Set();

      this.world = null;
      this.cam = { x: 7.5, y: 7.5, shakeTime: 0, shakeMag: 0 };
      this.elapsed = 0;

      this.player = {
        x: 7.5,
        y: 8.5,
        z: 0,
        vx: 0,
        vy: 0,
        facing: { x: 0, y: 1 },
        hp: 240,
        maxHp: 240,
        shield: 0,
        shieldTimer: 0,
        attackTimer: 0,
        qCd: 0,
        eCd: 0,
        dashCd: 0,
        dashTimer: 0,
        dashDir: { x: 0, y: 1 },
        iframeTimer: 0,
        flaskCd: 0,
        hurtFlash: 0,
        swingAnim: 0,
        hasteTimer: 0,
        hasteData: null,
        afterimages: []
      };

      this.run = null;

      this.projectiles = [];
      this.telegraphs = [];
      this.particles = [];
      this.floatingTexts = [];
      this.slashArcs = [];
      this.lootDrops = [];

      this.lastFrame = performance.now();
      this.autoSaveTimer = 0;
      this.idleGoldFrac = 0;
      this.idleShardFrac = 0;
      this.hudSyncTimer = 0;
      this.bossBannerTimer = 0;
      this.hazardDamageFlash = 0;
      this.nearbyStation = null;

      this.bindDOM();
      this.enterSanctuary();
      this.resizeCanvas();
      this.syncAllHUD();

      window.addEventListener("resize", () => this.resizeCanvas());
      requestAnimationFrame((t) => this.loop(t));
    }

    /* ======================================================================
       SAVE / LOAD & SANITIZATION
       ====================================================================== */
    createDefaultSave() {
      return {
        version: 1,
        level: 1,
        xp: 0,
        gold: 120,
        shards: 18,
        renown: 0,
        flasks: 3,
        equipped: {
          weapon: GearSystem.createItem("iron_blade", "common", 0),
          armor: GearSystem.createItem("traveler_tunic", "common", 0),
          relic: GearSystem.createItem("cracked_waystone", "common", 0)
        },
        inventory: [],
        cleared: {},
        mercenaries: {},
        blessings: {},
        selectedDungeonId: "sunken_quarry",
        selectedDiff: "normal",
        selectedMutators: [],
        settings: {
          volume: 45,
          muted: false,
          showDmgNums: true,
          screenShake: true
        },
        lastTimestamp: Date.now()
      };
    }

    saveGame(showToast = false) {
      this.save.lastTimestamp = Date.now();
      try {
        localStorage.setItem(DATA.SAVE_KEY, JSON.stringify(this.save));
        if (showToast) this.toast("Progress saved to local chronicle.", "success");
      } catch (err) {
        if (showToast) this.toast("Unable to write to LocalStorage.", "danger");
      }
    }

    loadGame() {
      try {
        const raw = localStorage.getItem(DATA.SAVE_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw);
        const def = this.createDefaultSave();
        this.save = { ...def, ...parsed };
        this.save.settings = { ...def.settings, ...(parsed.settings || {}) };

        // Sanitize critical fields so old/corrupted saves never freeze dungeons
        if (!Array.isArray(this.save.inventory)) this.save.inventory = [];
        if (!Array.isArray(this.save.selectedMutators)) this.save.selectedMutators = [];
        if (!DATA.DUNGEONS.some((d) => d.id === this.save.selectedDungeonId)) {
          this.save.selectedDungeonId = "sunken_quarry";
        }
        if (!DATA.DIFFICULTIES[this.save.selectedDiff]) {
          this.save.selectedDiff = "normal";
        }
        if (!this.save.equipped || typeof this.save.equipped !== "object") {
          this.save.equipped = def.equipped;
        }
        for (const slot of ["weapon", "armor", "relic"]) {
          const it = this.save.equipped[slot];
          if (!it || !DATA.GEAR_TEMPLATES[it.templateId]) {
            this.save.equipped[slot] = def.equipped[slot];
          }
        }

        this.sfx.volume = this.save.settings.volume / 100;
        this.sfx.muted = !!this.save.settings.muted;

        const rates = this.getPassiveRates();
        if (this.save.lastTimestamp && (rates.goldPerSec > 0 || rates.shardsPerSec > 0)) {
          const secs = clamp((Date.now() - this.save.lastTimestamp) / 1000, 0, 14400);
          if (secs >= 30) {
            const gEarned = Math.floor(secs * rates.goldPerSec);
            const sEarned = Math.floor(secs * rates.shardsPerSec);
            if (gEarned > 0 || sEarned > 0) {
              this.save.gold += gEarned;
              this.save.shards += sEarned;
              setTimeout(() => {
                this.toast(
                  `Mercenaries gathered +${fmtNum(gEarned)} Gold & +${fmtNum(sEarned)} Shards while away!`,
                  "success"
                );
              }, 500);
            }
          }
        }
      } catch (err) {
        console.warn("Save load failed, using default state.", err);
      }
    }

    /* ======================================================================
       HERO STATS, BLESSINGS & PASSIVE MERCENARY INCOME
       ====================================================================== */
    getBlessingBonus(statKey) {
      let total = 0;
      for (const b of DATA.BLESSINGS) {
        const rank = this.save.blessings[b.id] || 0;
        if (rank <= 0) continue;
        if (b.stat === statKey) total += rank * b.perRank;
        if (statKey === "cdr" && b.stat === "swiftness") total += rank * (b.cdrPerRank || 0);
        if (statKey === "speedPct" && b.stat === "swiftness") total += rank * b.perRank;
      }
      return total;
    }

    getHeroStats() {
      const base = C.BASE_PLAYER_STATS;
      const lvl = this.save.level - 1;

      const s = {
        hp: base.hp + lvl * 28,
        atk: base.atk + lvl * 4,
        spell: base.spell + lvl * 4,
        crit: base.crit,
        critMult: base.critMult,
        speed: base.speed,
        hazardResist: base.hazardResist,
        lifesteal: base.lifesteal,
        cdr: base.cdr,
        armor: base.armor + lvl * 1.5,
        atkSpeedMult: 1.0,
        dmgOutMult: 1.0
      };

      for (const slot of ["weapon", "armor", "relic"]) {
        const item = this.save.equipped[slot];
        if (!item) continue;
        const gs = GearSystem.computeItemStats(item);
        for (const [k, v] of Object.entries(gs)) {
          if (s[k] !== undefined) s[k] += v;
        }
      }

      s.hp = Math.round(s.hp * (1 + this.getBlessingBonus("hpPct")));
      const powerMult = 1 + this.getBlessingBonus("powerPct");
      s.atk = Math.round(s.atk * powerMult);
      s.spell = Math.round(s.spell * powerMult);
      s.hazardResist += this.getBlessingBonus("hazardResist");
      s.cdr += this.getBlessingBonus("cdr");
      s.speed *= 1 + this.getBlessingBonus("speedPct");

      if (this.player.hasteTimer > 0 && this.player.hasteData) {
        s.speed *= 1 + (this.player.hasteData.speedBonus || 0);
        s.atkSpeedMult += this.player.hasteData.atkSpeedBonus || 0;
        s.crit += this.player.hasteData.critBonus || 0;
      }

      if (this.mode === "dungeon" && this.run) {
        if (this.run.mutators.includes("hyper_speed")) {
          s.speed *= 1.15;
        }
        if (this.run.mutators.includes("glass_cannon")) {
          s.dmgOutMult *= 1.5;
        }
        if (this.run.dungeon.hazard.type === "gravity") {
          const h = this.run.dungeon.hazard;
          if (this.run.hazardState.phase === "low") {
            s.speed *= 1 + h.lowGSpeedBonus;
          } else {
            s.speed *= 1 - h.heavyGSpeedPenalty;
            s.dmgOutMult *= 1 + h.heavyGDmgBonus;
          }
        }
      }

      s.crit = clamp(s.crit, 0.05, 0.9);
      s.cdr = clamp(s.cdr, 0, 0.55);
      s.hazardResist = clamp(s.hazardResist, 0, 0.75);
      s.lifesteal = clamp(s.lifesteal, 0, 0.45);
      s.speed = clamp(s.speed, 2.5, 9.5);
      return s;
    }

    getHeroPowerScore() {
      const s = this.getHeroStats();
      return Math.round(
        s.hp * 0.22 +
        s.atk * 2.1 +
        s.spell * 1.9 +
        s.crit * 320 +
        s.lifesteal * 350 +
        s.cdr * 260 +
        s.armor * 1.2
      );
    }

    getXpNeeded(level) {
      return Math.round(C.XP_BASE * Math.pow(C.XP_GROWTH, level - 1));
    }

    grantXp(amount) {
      this.save.xp += Math.round(amount);
      let leveled = false;
      while (this.save.xp >= this.getXpNeeded(this.save.level)) {
        this.save.xp -= this.getXpNeeded(this.save.level);
        this.save.level += 1;
        leveled = true;
      }
      if (leveled) {
        const stats = this.getHeroStats();
        this.player.maxHp = stats.hp;
        this.player.hp = stats.hp;
        this.sfx.levelUp();
        this.spawnFloatingText(this.player.x, this.player.y, 1.5, `LEVEL ${this.save.level}!`, "#fde047", true);
        this.spawnBurst(this.player.x, this.player.y, "#fde047", 24, 3.8);
        this.toast(`Level Up! Reached Hero Level ${this.save.level}.`, "success");
      }
    }

    getPassiveRates() {
      const currencyMult = 1 + this.getBlessingBonus("currencyPct");
      let goldPerSec = 0;
      let shardsPerSec = 0;
      for (const m of DATA.MERCENARIES) {
        const lvl = this.save.mercenaries[m.id] || 0;
        if (lvl <= 0) continue;
        const mult = Math.pow(1.28, lvl - 1) * lvl;
        goldPerSec += m.goldPerSecBase * mult * currencyMult;
        shardsPerSec += m.shardsPerSecBase * mult * currencyMult;
      }
      return { goldPerSec, shardsPerSec };
    }

    isDungeonCleared(dungeonId, diff = null) {
      const rec = this.save.cleared[dungeonId];
      if (!rec) return false;
      if (diff) return !!rec[diff];
      return !!(rec.normal || rec.nightmare || rec.abyssal);
    }

    /* ======================================================================
       SANCTUARY BASE CAMP & PROCEDURAL DUNGEON GENERATION
       ====================================================================== */
    enterSanctuary() {
      this.mode = "hub";
      this.run = null;
      this.clearCombatFX();

      const sz = DATA.SANCTUARY.size;
      const grid = Array.from({ length: sz }, (_, y) =>
        Array.from({ length: sz }, (_, x) => (x === 0 || y === 0 || x === sz - 1 || y === sz - 1 ? 1 : 0))
      );
      [
        [2, 2],
        [sz - 3, 2],
        [2, sz - 3],
        [sz - 3, sz - 3]
      ].forEach(([px, py]) => {
        grid[py][px] = 2;
      });

      this.world = {
        size: sz,
        grid,
        palette: DATA.SANCTUARY.palette,
        stations: DATA.SANCTUARY.stations,
        enemies: [],
        vents: [],
        poisonPools: [],
        chests: [],
        portal: null
      };

      const stats = this.getHeroStats();
      this.player.x = DATA.SANCTUARY.spawn.x;
      this.player.y = DATA.SANCTUARY.spawn.y;
      this.player.maxHp = stats.hp;
      this.player.hp = stats.hp;
      this.player.shield = 0;
      this.player.qCd = 0;
      this.player.eCd = 0;
      this.player.dashCd = 0;
      this.player.flaskCd = 0;
      this.cam.x = this.player.x;
      this.cam.y = this.player.y;

      document.getElementById("camp-tabs").classList.remove("hidden");
      document.getElementById("dungeon-actions").classList.add("hidden");
      document.getElementById("boss-hud").classList.add("hidden");
      document.getElementById("survival-hud").classList.add("hidden");
      document.getElementById("difficulty-badge").classList.add("hidden");
      document.getElementById("hazard-overlay").className = "hazard-overlay";
      document.getElementById("location-badge").textContent = "Sanctuary Camp";
      document.getElementById("room-indicator").textContent = "Walk to stations or press 1-4";
      document.getElementById("mutator-badges").innerHTML = "";

      this.syncAllHUD();
    }

    startDungeon(dungeonId, diffId, mutatorIds) {
      const dungeon = DATA.DUNGEONS.find((d) => d.id === dungeonId) || DATA.DUNGEONS[0];
      const diff = DATA.DIFFICULTIES[diffId] || DATA.DIFFICULTIES.normal;
      const safeMutators = Array.isArray(mutatorIds) ? [...mutatorIds] : [];

      this.closeAllModals();
      this.sfx.portal();
      this.mode = "dungeon";

      let rewardMult = diff.lootMult;
      let rarityLuck = diff.rarityLuck;
      for (const mid of safeMutators) {
        const m = DATA.MUTATORS.find((x) => x.id === mid);
        if (m) {
          rewardMult += m.rewardBonus;
          rarityLuck += m.rarityLuck;
        }
      }

      this.run = {
        dungeon,
        diff,
        mutators: safeMutators,
        rewardMult,
        rarityLuck,
        roomIndex: 0,
        totalRooms: dungeon.rooms,
        startTime: performance.now(),
        damageDealt: 0,
        enemiesSlain: 0,
        goldEarned: 0,
        shardsEarned: 0,
        renownEarned: 0,
        lootCollected: [],
        meteorTimer: 3.5,
        finished: false,
        hazardState: {
          value: dungeon.hazard.type === "oxygen" ? 100 : 0,
          phase: "low",
          phaseTimer: dungeon.hazard.cycleSeconds || 15,
          poolSpawnTimer: 2.5,
          dpsTick: 0
        }
      };

      const stats = this.getHeroStats();
      this.player.maxHp = stats.hp;
      this.player.hp = stats.hp;
      this.player.shield = 0;
      this.player.qCd = 0;
      this.player.eCd = 0;
      this.player.dashCd = 0;

      document.getElementById("camp-tabs").classList.add("hidden");
      document.getElementById("dungeon-actions").classList.remove("hidden");
      document.getElementById("location-badge").textContent = dungeon.name;

      const diffEl = document.getElementById("difficulty-badge");
      diffEl.textContent = diff.name;
      diffEl.className = "difficulty-badge diff-" + diff.id;

      const mutEl = document.getElementById("mutator-badges");
      mutEl.innerHTML = safeMutators
        .map((id) => {
          const m = DATA.MUTATORS.find((x) => x.id === id);
          return m ? `<span class="mutator-chip" title="${m.name}: ${m.desc}">${m.icon} ${m.name}</span>` : "";
        })
        .join("");

      const survHud = document.getElementById("survival-hud");
      survHud.classList.remove("hidden", "danger-pulse");
      document.getElementById("hazard-icon").textContent = dungeon.hazard.icon;
      document.getElementById("hazard-name").textContent = dungeon.hazard.name;
      document.getElementById("hazard-tip").textContent = dungeon.hazard.tip;
      const barFill = document.getElementById("hazard-bar-fill");
      barFill.className = "bar-fill hazard-fill " + (dungeon.hazard.barTheme || "");

      this.generateDungeonRoom(0);
      this.syncAllHUD();
    }

    generateDungeonRoom(roomIndex) {
      this.clearCombatFX();
      const { dungeon, diff, totalRooms } = this.run;
      const isBossRoom = roomIndex === totalRooms - 1;
      const size = isBossRoom ? 17 : 15;
      const cx = Math.floor(size / 2);

      const grid = Array.from({ length: size }, (_, y) =>
        Array.from({ length: size }, (_, x) => (x === 0 || y === 0 || x === size - 1 || y === size - 1 ? 1 : 0))
      );

      const pillarCount = isBossRoom ? 4 : randInt(4, 7);
      let placed = 0;
      let attempts = 0;
      while (placed < pillarCount && attempts < 60) {
        attempts++;
        const px = randInt(3, size - 4);
        const py = randInt(3, size - 4);
        if (Math.abs(px - cx) <= 1 && (py >= size - 4 || py <= 3)) continue;
        if (dist(px + 0.5, py + 0.5, cx + 0.5, cx + 0.5) < 2.2) continue;
        if (grid[py][px] === 0) {
          grid[py][px] = 2;
          placed++;
        }
      }

      const vents = [];
      if (dungeon.hazard.type === "oxygen") {
        const ventSpots = isBossRoom
          ? [
              [3.5, 4.5],
              [size - 3.5, 4.5],
              [3.5, size - 4.5],
              [size - 3.5, size - 4.5]
            ]
          : [
              [3.5, 5.5],
              [size - 3.5, 5.5],
              [cx + 0.5, cx + 0.5]
            ];
        for (const [vx, vy] of ventSpots) {
          if (grid[Math.floor(vy)][Math.floor(vx)] === 0) {
            vents.push({ x: vx, y: vy, radius: 1.85 });
          }
        }
      }

      this.world = {
        size,
        grid,
        palette: dungeon.palette,
        stations: [],
        enemies: [],
        vents,
        poisonPools: [],
        chests: [],
        portal: null,
        isBossRoom
      };

      this.player.x = cx + 0.5;
      this.player.y = size - 2.3;
      this.cam.x = this.player.x;
      this.cam.y = this.player.y;

      if (dungeon.hazard.type === "oxygen") this.run.hazardState.value = 100;
      if (dungeon.hazard.type === "heat") this.run.hazardState.value = 0;
      if (dungeon.hazard.type === "poison") this.run.hazardState.value = 0;

      document.getElementById("room-indicator").textContent = isBossRoom
        ? `Room ${roomIndex + 1} / ${totalRooms} — BOSS CHAMBER`
        : `Room ${roomIndex + 1} / ${totalRooms}`;

      if (isBossRoom) {
        this.spawnBossEncounter();
      } else {
        document.getElementById("boss-hud").classList.add("hidden");
        const count = 4 + roomIndex * 2 + (diff.id === "abyssal" ? 2 : diff.id === "nightmare" ? 1 : 0);
        for (let i = 0; i < count; i++) {
          const tplId = pick(dungeon.enemies);
          const pos = this.findOpenSpot(size, grid, 2, size - 5);
          this.world.enemies.push(this.createEnemy(tplId, pos.x, pos.y, roomIndex));
        }
      }
    }

    findOpenSpot(size, grid, minY = 2, maxY = size - 3) {
      for (let tries = 0; tries < 50; tries++) {
        const x = randInt(2, size - 3) + 0.5;
        const y = randInt(minY, maxY) + 0.5;
        if (grid[Math.floor(y)][Math.floor(x)] === 0 && dist(x, y, this.player.x, this.player.y) > 3.5) {
          return { x, y };
        }
      }
      return { x: size * 0.5, y: 4.5 };
    }

    createEnemy(templateId, x, y, roomIndex) {
      const tpl = DATA.ENEMIES[templateId] || DATA.ENEMIES.crystal_crawler;
      const diff = this.run.diff;
      const roomScale = 1 + roomIndex * 0.14;
      const speedMult = this.run.mutators.includes("hyper_speed") ? 1.35 : 1.0;
      const dmgMut = this.run.mutators.includes("glass_cannon") ? 1.5 : 1.0;

      const maxHp = Math.round(tpl.hp * diff.hpMult * roomScale);
      return {
        id: uid(),
        isBoss: false,
        template: tpl,
        name: tpl.name,
        x,
        y,
        z: 0,
        hp: maxHp,
        maxHp,
        atk: Math.round(tpl.atk * diff.dmgMult * roomScale * dmgMut),
        speed: tpl.speed * speedMult,
        range: tpl.range,
        attackCd: tpl.attackCd / speedMult,
        attackTimer: randRange(0.4, 1.2),
        radius: tpl.radius,
        height: tpl.height,
        color: tpl.color,
        trim: tpl.trim,
        stunTimer: 0,
        hurtFlash: 0,
        facing: { x: 0, y: 1 }
      };
    }

    spawnBossEncounter() {
      const bossTpl = DATA.BOSSES[this.run.dungeon.bossId];
      const diff = this.run.diff;
      const isTwin = this.run.mutators.includes("double_boss");
      const speedMult = this.run.mutators.includes("hyper_speed") ? 1.35 : 1.0;
      const dmgMut = this.run.mutators.includes("glass_cannon") ? 1.5 : 1.0;

      const count = isTwin ? 2 : 1;
      const cx = this.world.size * 0.5;

      for (let i = 0; i < count; i++) {
        const hpScale = isTwin ? 0.65 : 1.0;
        const maxHp = Math.round(bossTpl.hp * diff.hpMult * hpScale);
        const offset = isTwin ? (i === 0 ? -2.2 : 2.2) : 0;
        this.world.enemies.push({
          id: uid(),
          isBoss: true,
          template: bossTpl,
          name: isTwin ? `${bossTpl.name} ${i === 0 ? "Alpha" : "Omega"}` : bossTpl.name,
          subtitle: bossTpl.subtitle,
          x: cx + offset,
          y: 4.5,
          z: 0,
          hp: maxHp,
          maxHp,
          atk: Math.round(bossTpl.atk * diff.dmgMult * dmgMut),
          speed: bossTpl.speed * speedMult,
          radius: bossTpl.radius,
          height: bossTpl.height,
          color: bossTpl.color,
          trim: bossTpl.trim,
          stunTimer: 0,
          hurtFlash: 0,
          facing: { x: 0, y: 1 },
          patternIdx: i % bossTpl.patterns.length,
          patternTimer: 1.8 + i * 0.9,
          casting: false,
          chargeVel: null,
          chargeTimer: 0
        });
      }

      this.sfx.bossWarn();
      const banner = document.getElementById("boss-banner");
      document.getElementById("boss-banner-sub").textContent = isTwin
        ? "TWIN RIFT GUARDIANS AWAKEN"
        : bossTpl.subtitle.toUpperCase();
      document.getElementById("boss-banner-title").textContent = bossTpl.name.toUpperCase();
      banner.classList.remove("hidden");
      this.bossBannerTimer = 2.6;

      document.getElementById("boss-hud").classList.remove("hidden");
      document.getElementById("boss-name").textContent = isTwin ? `Twin ${bossTpl.name}` : bossTpl.name;
      document.getElementById("boss-subtitle").textContent = bossTpl.subtitle;
      const tags = document.getElementById("boss-tags");
      tags.innerHTML =
        `<span class="boss-tag">${diff.name}</span>` +
        (isTwin ? `<span class="boss-tag">Twin Bosses</span>` : "");
    }

    clearCombatFX() {
      this.projectiles = [];
      this.telegraphs = [];
      this.particles = [];
      this.floatingTexts = [];
      this.slashArcs = [];
      this.lootDrops = [];
    }

    /* ======================================================================
       CRASH-PROOF MAIN LOOP
       ====================================================================== */
    loop(now) {
      // Always schedule the next frame first so a transient error can never freeze the loop
      requestAnimationFrame((t) => this.loop(t));

      try {
        const dt = Math.min(0.05, Math.max(0.001, (now - this.lastFrame) / 1000));
        this.lastFrame = now;
        this.elapsed += dt;

        this.updateIdleEconomy(dt);

        if (!this.activeModal) {
          this.updateWorld(dt);
        }

        this.render();
        this.renderMinimap();

        this.hudSyncTimer += dt;
        if (this.hudSyncTimer >= 0.1) {
          this.hudSyncTimer = 0;
          this.syncLiveHUD();
        }

        this.autoSaveTimer += dt;
        if (this.autoSaveTimer >= C.AUTO_SAVE_INTERVAL) {
          this.autoSaveTimer = 0;
          this.saveGame(false);
        }
      } catch (err) {
        console.error("Riftfall frame error recovered:", err);
      }
    }

    updateIdleEconomy(dt) {
      const rates = this.getPassiveRates();
      if (rates.goldPerSec > 0) {
        this.idleGoldFrac += rates.goldPerSec * dt;
        const wholeG = Math.floor(this.idleGoldFrac);
        if (wholeG > 0) {
          this.save.gold += wholeG;
          this.idleGoldFrac -= wholeG;
        }
      }
      if (rates.shardsPerSec > 0) {
        this.idleShardFrac += rates.shardsPerSec * dt;
        const wholeS = Math.floor(this.idleShardFrac);
        if (wholeS > 0) {
          this.save.shards += wholeS;
          this.idleShardFrac -= wholeS;
        }
      }
    }

    updateWorld(dt) {
      const stats = this.getHeroStats();
      this.player.maxHp = stats.hp;
      if (this.player.hp > stats.hp) this.player.hp = stats.hp;

      if (this.bossBannerTimer > 0) {
        this.bossBannerTimer -= dt;
        if (this.bossBannerTimer <= 0) {
          document.getElementById("boss-banner").classList.add("hidden");
        }
      }

      if (this.hazardDamageFlash > 0) this.hazardDamageFlash -= dt;

      this.player.qCd = Math.max(0, this.player.qCd - dt);
      this.player.eCd = Math.max(0, this.player.eCd - dt);
      this.player.dashCd = Math.max(0, this.player.dashCd - dt);
      this.player.flaskCd = Math.max(0, this.player.flaskCd - dt);
      this.player.iframeTimer = Math.max(0, this.player.iframeTimer - dt);
      this.player.hurtFlash = Math.max(0, this.player.hurtFlash - dt);
      this.player.swingAnim = Math.max(0, this.player.swingAnim - dt);

      if (this.player.shieldTimer > 0) {
        this.player.shieldTimer -= dt;
        if (this.player.shieldTimer <= 0) this.player.shield = 0;
      }
      if (this.player.hasteTimer > 0) {
        this.player.hasteTimer -= dt;
        if (this.player.hasteTimer <= 0) this.player.hasteData = null;
      }

      this.updatePlayerMovement(dt, stats);

      this.cam.x = lerp(this.cam.x, this.player.x, clamp(dt * 8.5, 0, 1));
      this.cam.y = lerp(this.cam.y, this.player.y, clamp(dt * 8.5, 0, 1));
      if (this.cam.shakeTime > 0) this.cam.shakeTime = Math.max(0, this.cam.shakeTime - dt);

      if (this.mode === "hub") {
        this.updateSanctuaryInteractions();
      } else if (this.mode === "dungeon" && this.run && !this.run.finished) {
        this.updateAutoAttack(dt, stats);
        this.updateDungeonHazard(dt, stats);
        this.updateMutatorEvents(dt);
        this.updateEnemies(dt);
        this.updateTelegraphs(dt);
        this.updateProjectiles(dt, stats);
        this.updateLootAndPortals(dt);
      }

      this.updateParticlesAndText(dt);
    }

    updatePlayerMovement(dt, stats) {
      let screenX = 0;
      let screenY = 0;
      if (this.keys.has("KeyW") || this.keys.has("ArrowUp")) screenY -= 1;
      if (this.keys.has("KeyS") || this.keys.has("ArrowDown")) screenY += 1;
      if (this.keys.has("KeyA") || this.keys.has("ArrowLeft")) screenX -= 1;
      if (this.keys.has("KeyD") || this.keys.has("ArrowRight")) screenX += 1;

      let wx = screenX + screenY;
      let wy = screenY - screenX;
      const len = Math.hypot(wx, wy);
      if (len > 0) {
        wx /= len;
        wy /= len;
        this.player.facing.x = wx;
        this.player.facing.y = wy;
      }

      if (this.player.dashTimer > 0) {
        this.player.dashTimer -= dt;
        const dashSpeed = stats.speed * 2.85;
        this.player.vx = this.player.dashDir.x * dashSpeed;
        this.player.vy = this.player.dashDir.y * dashSpeed;
        this.player.afterimages.push({ x: this.player.x, y: this.player.y, life: 0.22 });
      } else {
        this.player.vx = wx * stats.speed;
        this.player.vy = wy * stats.speed;
      }

      this.moveEntityWithCollision(this.player, this.player.vx * dt, this.player.vy * dt, 0.36);

      for (let i = this.player.afterimages.length - 1; i >= 0; i--) {
        this.player.afterimages[i].life -= dt;
        if (this.player.afterimages[i].life <= 0) this.player.afterimages.splice(i, 1);
      }
    }

    moveEntityWithCollision(ent, dx, dy, radius) {
      const sz = this.world.size;
      const isSolid = (nx, ny) => {
        const checks = [
          [nx - radius, ny - radius],
          [nx + radius, ny - radius],
          [nx - radius, ny + radius],
          [nx + radius, ny + radius]
        ];
        for (const [cx, cy] of checks) {
          const tx = Math.floor(cx);
          const ty = Math.floor(cy);
          if (tx < 0 || ty < 0 || tx >= sz || ty >= sz) return true;
          if (this.world.grid[ty][tx] !== 0) return true;
        }
        return false;
      };

      if (!isSolid(ent.x + dx, ent.y)) ent.x += dx;
      if (!isSolid(ent.x, ent.y + dy)) ent.y += dy;
    }

    updateSanctuaryInteractions() {
      let nearest = null;
      let bestDist = Infinity;
      for (const st of this.world.stations) {
        const d = dist(this.player.x, this.player.y, st.x, st.y);
        if (d <= st.radius && d < bestDist) {
          bestDist = d;
          nearest = st;
        }
      }
      this.nearbyStation = nearest;
      const prompt = document.getElementById("interact-prompt");
      if (nearest) {
        document.getElementById("interact-prompt-text").textContent = nearest.prompt;
        prompt.classList.remove("hidden");
      } else {
        prompt.classList.add("hidden");
      }
    }

    /* ======================================================================
       COMBAT: AUTO-ATTACK, DASH, Q / E SKILLS & FLASK
       ====================================================================== */
    triggerDash() {
      if (this.activeModal || this.player.dashCd > 0) return;
      const stats = this.getHeroStats();
      this.player.dashCd = C.DASH_COOLDOWN * (1 - stats.cdr * 0.5);
      this.player.dashTimer = C.DASH_DURATION;
      this.player.iframeTimer = C.DASH_IFRAMES;
      this.player.dashDir = { x: this.player.facing.x, y: this.player.facing.y };
      this.sfx.dash();
      this.spawnBurst(this.player.x, this.player.y, "#38bdf8", 10, 2.4);

      if (this.mode === "dungeon" && this.run && this.run.dungeon.hazard.type === "heat") {
        const h = this.run.dungeon.hazard;
        this.run.hazardState.value = Math.max(0, this.run.hazardState.value - h.dashCoolBurst);
        this.spawnFloatingText(this.player.x, this.player.y, 1.1, "VENTED!", "#7dd3fc");
      }
    }

    useFlask() {
      if (this.mode !== "dungeon" || this.activeModal || !this.run || this.run.finished) return;
      if (this.save.flasks <= 0) {
        this.toast("Out of Survival Flasks! Buy more at the Blacksmith.", "danger");
        return;
      }
      if (this.player.flaskCd > 0) return;

      this.save.flasks -= 1;
      this.player.flaskCd = C.FLASK_COOLDOWN;
      const heal = Math.round(this.player.maxHp * C.FLASK_HEAL_PCT);
      this.healPlayer(heal);

      const hType = this.run.dungeon.hazard.type;
      if (hType === "oxygen") this.run.hazardState.value = 100;
      if (hType === "heat") this.run.hazardState.value = 0;
      if (hType === "poison") this.run.hazardState.value = 0;

      this.sfx.flask();
      this.spawnBurst(this.player.x, this.player.y, "#4ade80", 16, 2.8);
      this.spawnFloatingText(this.player.x, this.player.y, 1.4, `+${heal} HP`, "#4ade80", true);
      this.syncLiveHUD();
    }

    updateAutoAttack(dt, stats) {
      this.player.attackTimer -= dt;
      if (this.player.attackTimer > 0) return;

      const wepItem = this.save.equipped.weapon;
      const wep = GearSystem.getTemplate(wepItem.templateId);
      const target = this.findNearestEnemy(this.player.x, this.player.y, wep.range);
      if (!target) return;

      this.player.attackTimer = 1 / (wep.attackRate * stats.atkSpeedMult);
      const angle = Math.atan2(target.y - this.player.y, target.x - this.player.x);
      this.player.facing.x = Math.cos(angle);
      this.player.facing.y = Math.sin(angle);
      this.player.swingAnim = 0.18;

      if (wep.attackType.startsWith("melee")) {
        this.sfx.swing();
        const arcSpan = wep.attackType === "melee_heavy" ? 1.8 : 1.35;
        this.slashArcs.push({
          x: this.player.x,
          y: this.player.y,
          angle,
          radius: wep.range,
          span: arcSpan,
          color: wep.trailColor,
          life: 0.18,
          maxLife: 0.18
        });

        for (const e of [...this.world.enemies]) {
          const d = dist(this.player.x, this.player.y, e.x, e.y) - e.radius;
          if (d <= wep.range + 0.15) {
            const ea = Math.atan2(e.y - this.player.y, e.x - this.player.x);
            let diffA = Math.abs(ea - angle);
            if (diffA > Math.PI) diffA = Math.PI * 2 - diffA;
            if (diffA <= arcSpan * 0.65 || d < 0.9) {
              const rawDmg = (stats.atk * 1.05 + stats.spell * 0.2) * stats.dmgOutMult;
              this.damageEnemy(e, rawDmg, false, stats);
            }
          }
        }
      } else {
        this.sfx.rangedCast();
        const isMagic = wep.attackType === "ranged_orb" || wep.attackType === "ranged_nova";
        const baseDmg = isMagic
          ? (stats.spell * 1.0 + stats.atk * 0.35) * stats.dmgOutMult
          : (stats.atk * 1.02 + stats.spell * 0.2) * stats.dmgOutMult;
        this.projectiles.push({
          friendly: true,
          x: this.player.x,
          y: this.player.y,
          vx: Math.cos(angle) * (wep.projSpeed || 9.5),
          vy: Math.sin(angle) * (wep.projSpeed || 9.5),
          radius: wep.attackType === "ranged_nova" ? 0.34 : 0.26,
          damage: baseDmg,
          pierce: wep.attackType === "ranged_nova" ? 2 : 0,
          hitIds: new Set(),
          color: wep.weaponColor,
          trailColor: wep.trailColor,
          life: (wep.range + 1.5) / (wep.projSpeed || 9.5)
        });
      }
    }

    castSkillQ() {
      if (this.mode !== "dungeon" || this.activeModal || !this.run || this.run.finished) return;
      if (this.player.qCd > 0) return;

      const stats = this.getHeroStats();
      const wep = GearSystem.getTemplate(this.save.equipped.weapon.templateId);
      const sk = DATA.SKILLS[wep.skillId];
      if (!sk) return;

      this.player.qCd = sk.cooldown * (1 - stats.cdr);
      this.sfx.skillQ();
      this.addScreenShake(0.18, 6);

      const calcSkillDmg = () => (stats.atk * (sk.atkMult || 0) + stats.spell * (sk.spellMult || 0)) * stats.dmgOutMult;

      if (sk.type === "aoe_melee" || sk.type === "shockwave" || sk.type === "drain_nova") {
        this.slashArcs.push({
          x: this.player.x,
          y: this.player.y,
          angle: 0,
          radius: sk.radius,
          span: Math.PI * 2,
          color: sk.color,
          life: 0.3,
          maxLife: 0.3
        });
        this.spawnBurst(this.player.x, this.player.y, sk.color, 26, 4.2);

        let totalDealt = 0;
        for (const e of [...this.world.enemies]) {
          if (dist(this.player.x, this.player.y, e.x, e.y) <= sk.radius + e.radius) {
            const dealt = this.damageEnemy(e, calcSkillDmg(), false, stats);
            totalDealt += dealt;
            if (sk.stunDuration) e.stunTimer = Math.max(e.stunTimer, sk.stunDuration);
          }
        }
        if (sk.healPctDmg && totalDealt > 0) {
          const h = Math.round(totalDealt * sk.healPctDmg);
          this.healPlayer(h);
          this.spawnFloatingText(this.player.x, this.player.y, 1.3, `+${h}`, "#4ade80");
        }
      } else if (sk.type === "proj_fan") {
        const count = sk.count || 6;
        const baseAngle = Math.atan2(this.player.facing.y, this.player.facing.x);
        for (let i = 0; i < count; i++) {
          const a = baseAngle + (i / count) * Math.PI * 2;
          this.projectiles.push({
            friendly: true,
            x: this.player.x,
            y: this.player.y,
            vx: Math.cos(a) * 10.5,
            vy: Math.sin(a) * 10.5,
            radius: 0.36,
            damage: calcSkillDmg(),
            guaranteedCrit: !!sk.guaranteedCrit,
            pierce: 3,
            hitIds: new Set(),
            color: sk.color,
            trailColor: "#fef08a",
            life: 0.72
          });
        }
      } else if (sk.type === "meteor_cluster") {
        const count = sk.count || 4;
        const targets = [...this.world.enemies];
        for (let i = 0; i < count; i++) {
          let tx, ty;
          if (targets.length > 0) {
            const pickE = targets[i % targets.length];
            tx = pickE.x + randRange(-0.5, 0.5);
            ty = pickE.y + randRange(-0.5, 0.5);
          } else {
            tx = this.player.x + randRange(-3, 3);
            ty = this.player.y + randRange(-3, 3);
          }
          this.spawnBurst(tx, ty, sk.color, 20, 3.8);
          this.slashArcs.push({
            x: tx,
            y: ty,
            angle: 0,
            radius: sk.radius,
            span: Math.PI * 2,
            color: sk.color,
            life: 0.28,
            maxLife: 0.28
          });
          for (const e of [...this.world.enemies]) {
            if (dist(tx, ty, e.x, e.y) <= sk.radius + e.radius) {
              this.damageEnemy(e, calcSkillDmg(), false, stats);
            }
          }
        }
      }
    }

    castSkillE() {
      if (this.mode !== "dungeon" || this.activeModal || !this.run || this.run.finished) return;
      if (this.player.eCd > 0) return;

      const stats = this.getHeroStats();
      const relic = GearSystem.getTemplate(this.save.equipped.relic.templateId);
      const sk = DATA.SKILLS[relic.skillId];
      if (!sk) return;

      this.player.eCd = sk.cooldown * (1 - stats.cdr);
      this.sfx.skillE();
      this.spawnBurst(this.player.x, this.player.y, sk.color, 22, 3.4);

      if (sk.shieldPctHp) {
        const amt = Math.round(stats.hp * sk.shieldPctHp);
        this.player.shield = Math.max(this.player.shield, amt);
        this.player.shieldTimer = sk.duration || 5.0;
        this.spawnFloatingText(this.player.x, this.player.y, 1.35, `SHIELD +${amt}`, "#38bdf8", true);
      }

      if (sk.hazardRestore && this.run) {
        const hType = this.run.dungeon.hazard.type;
        if (hType === "oxygen") this.run.hazardState.value = Math.min(100, this.run.hazardState.value + sk.hazardRestore);
        if (hType === "heat" || hType === "poison") {
          this.run.hazardState.value = Math.max(0, this.run.hazardState.value - sk.hazardRestore);
        }
      }

      if (sk.type === "haste_buff") {
        this.player.hasteTimer = sk.duration;
        this.player.hasteData = sk;
        this.spawnFloatingText(this.player.x, this.player.y, 1.4, "OVERCLOCK!", "#fb923c", true);
      }

      if (sk.type === "heal_pulse") {
        const h = Math.round(stats.hp * sk.healPctHp);
        this.healPlayer(h);
        if (this.run.dungeon.hazard.type === "poison") this.run.hazardState.value = 0;
        this.spawnFloatingText(this.player.x, this.player.y, 1.4, `+${h} HP`, "#4ade80", true);
        this.slashArcs.push({
          x: this.player.x,
          y: this.player.y,
          angle: 0,
          radius: sk.radius,
          span: Math.PI * 2,
          color: sk.color,
          life: 0.3,
          maxLife: 0.3
        });
        const dmg = stats.spell * sk.spellMult * stats.dmgOutMult;
        for (const e of [...this.world.enemies]) {
          if (dist(this.player.x, this.player.y, e.x, e.y) <= sk.radius + e.radius) {
            this.damageEnemy(e, dmg, false, stats);
          }
        }
      }

      if (sk.type === "vortex_pull") {
        this.slashArcs.push({
          x: this.player.x,
          y: this.player.y,
          angle: 0,
          radius: sk.radius,
          span: Math.PI * 2,
          color: sk.color,
          life: 0.38,
          maxLife: 0.38
        });
        const dmg = stats.spell * sk.spellMult * stats.dmgOutMult;
        for (const e of [...this.world.enemies]) {
          const d = dist(this.player.x, this.player.y, e.x, e.y);
          if (d <= sk.radius + e.radius) {
            if (d > 1.2) {
              const ang = Math.atan2(this.player.y - e.y, this.player.x - e.x);
              this.moveEntityWithCollision(e, Math.cos(ang) * (d * 0.45), Math.sin(ang) * (d * 0.45), e.radius);
            }
            this.damageEnemy(e, dmg, false, stats);
          }
        }
      }
    }

    damageEnemy(enemy, rawDamage, forceCrit = false, stats = null) {
      if (!enemy || enemy.hp <= 0) return 0;
      const st = stats || this.getHeroStats();
      const isCrit = forceCrit || Math.random() < st.crit;
      const variance = randRange(0.92, 1.08);
      const finalDmg = Math.max(1, Math.round(rawDamage * (isCrit ? st.critMult : 1.0) * variance));

      enemy.hp -= finalDmg;
      enemy.hurtFlash = 0.12;
      if (this.run) this.run.damageDealt += finalDmg;

      if (isCrit) {
        this.sfx.crit();
        this.spawnFloatingText(enemy.x, enemy.y, enemy.height + 0.35, `${finalDmg}!`, "#fde047", true);
      } else {
        this.sfx.hit();
        this.spawnFloatingText(enemy.x, enemy.y, enemy.height + 0.25, `${finalDmg}`, "#ffffff", false);
      }

      if (st.lifesteal > 0) {
        const ls = Math.max(1, Math.round(finalDmg * st.lifesteal));
        this.healPlayer(ls);
      }

      this.spawnBurst(enemy.x, enemy.y, isCrit ? "#fde047" : enemy.trim, isCrit ? 9 : 5, 2.2);

      if (enemy.hp <= 0) {
        this.handleEnemyDeath(enemy);
      }
      return finalDmg;
    }

    handleEnemyDeath(enemy) {
      const idx = this.world.enemies.indexOf(enemy);
      if (idx >= 0) this.world.enemies.splice(idx, 1);

      this.run.enemiesSlain += 1;
      this.spawnBurst(enemy.x, enemy.y, enemy.trim, enemy.isBoss ? 42 : 16, enemy.isBoss ? 5.0 : 3.0);

      if (!enemy.isBoss && this.run.mutators.includes("volatile_blood")) {
        this.telegraphs.push({
          type: "circle",
          x: enemy.x,
          y: enemy.y,
          radius: 1.75,
          elapsed: 0,
          duration: 0.9,
          damage: Math.round(enemy.atk * 1.25),
          color: "#f43f5e"
        });
      }

      const currencyMult = (1 + this.getBlessingBonus("currencyPct")) * this.run.rewardMult;
      const goldGain = Math.round(enemy.template.gold * currencyMult);
      const xpGain = Math.round(enemy.template.xp * this.run.diff.xpMult);
      this.save.gold += goldGain;
      this.run.goldEarned += goldGain;
      this.grantXp(xpGain);

      if (enemy.isBoss) {
        const shardGain = Math.round((enemy.template.shards || 12) * currencyMult);
        this.save.shards += shardGain;
        this.run.shardsEarned += shardGain;
        this.addScreenShake(0.4, 12);
        this.dropLootItem(enemy.x, enemy.y, true);
        if (Math.random() < 0.35 + this.run.rarityLuck * 0.2) {
          this.dropLootItem(enemy.x + randRange(-0.8, 0.8), enemy.y + randRange(-0.8, 0.8), true);
        }
      } else if (Math.random() < 0.13 + this.run.rarityLuck * 0.04) {
        this.dropLootItem(enemy.x, enemy.y, false);
      }

      if (this.world.enemies.length === 0) {
        this.onRoomCleared();
      }
    }

    onRoomCleared() {
      if (this.world.isBossRoom) {
        this.completeDungeonVictory();
      } else {
        const cx = Math.floor(this.world.size / 2) + 0.5;
        this.world.portal = { x: cx, y: 1.85, radius: 1.25 };
        this.world.chests.push({
          x: cx,
          y: Math.floor(this.world.size / 2) + 0.5,
          opened: false
        });
        this.sfx.portal();
        this.toast("Room cleared! Open the Rift Chest and enter the North Portal.", "success");
      }
    }

    dropLootItem(x, y, isBossDrop) {
      const pool = this.run.dungeon.lootPool;
      const tplId = pick(pool);
      const minRarity =
        isBossDrop && (this.run.diff.id === "nightmare" || this.run.diff.id === "abyssal")
          ? "rare"
          : "common";
      const rarity = GearSystem.rollRarity(this.run.rarityLuck + (isBossDrop ? 0.25 : 0), minRarity);
      const item = GearSystem.createItem(tplId, rarity, 0);

      this.lootDrops.push({
        item,
        x,
        y,
        z: 0.2,
        vx: randRange(-1.8, 1.8),
        vy: randRange(-1.8, 1.8),
        vz: randRange(3.2, 4.8),
        life: 0
      });
    }

    collectLootDrop(drop) {
      const item = drop.item;
      const tpl = GearSystem.getTemplate(item.templateId);
      const rar = DATA.RARITIES[item.rarity];
      this.sfx.loot(item.rarity);

      if (this.save.inventory.length < C.INVENTORY_CAPACITY) {
        this.save.inventory.push(item);
        this.run.lootCollected.push(item);
        this.spawnFloatingText(this.player.x, this.player.y, 1.5, `[${rar.name}] ${tpl.name}`, rar.color, item.rarity === "mythic");
        if (item.rarity === "epic" || item.rarity === "mythic") {
          this.toast(`Found ${rar.name} ${tpl.name}!`, item.rarity === "mythic" ? "mythic" : "loot");
        }
      } else {
        const shards = GearSystem.getSalvageValue(item);
        this.save.shards += shards;
        this.run.shardsEarned += shards;
        this.spawnFloatingText(this.player.x, this.player.y, 1.5, `Bag Full: +${shards} Shards`, "#c084fc");
      }
    }

    damagePlayer(rawAmount, isHazard = false) {
      if (!isHazard && this.player.iframeTimer > 0) return;
      if (this.run && this.run.finished) return;

      const stats = this.getHeroStats();
      let dmg = rawAmount;
      if (!isHazard) {
        const mitigation = stats.armor / (stats.armor + 120);
        dmg = Math.max(1, Math.round(rawAmount * (1 - mitigation)));
      } else {
        dmg = Math.max(1, Math.round(rawAmount * (1 - stats.hazardResist)));
      }

      if (this.player.shield > 0) {
        const absorbed = Math.min(this.player.shield, dmg);
        this.player.shield -= absorbed;
        dmg -= absorbed;
      }

      if (dmg > 0) {
        this.player.hp = Math.max(0, this.player.hp - dmg);
        this.player.hurtFlash = 0.18;
        this.hazardDamageFlash = 0.22;
        if (!isHazard) {
          this.sfx.playerHurt();
          this.addScreenShake(0.16, 7);
        }
        this.spawnFloatingText(this.player.x, this.player.y, 1.25, `-${dmg}`, isHazard ? "#fb923c" : "#f43f5e", !isHazard);
      }

      if (this.player.hp <= 0) {
        this.handlePlayerDefeat();
      }
    }

    healPlayer(amount) {
      this.player.hp = Math.min(this.player.maxHp, this.player.hp + Math.round(amount));
    }

    // === END OF PART 1/2 — REPLY "2" FOR PART 2/2 ===
    /* ======================================================================
       ENVIRONMENTAL SURVIVAL HAZARDS & MUTATORS
       ====================================================================== */
    updateDungeonHazard(dt, stats) {
      const h = this.run.dungeon.hazard;
      const hs = this.run.hazardState;
      const hMult = this.run.diff.hazardMult * (1 - stats.hazardResist * 0.65);
      const overlay = document.getElementById("hazard-overlay");
      const survHud = document.getElementById("survival-hud");
      let inDanger = false;

      if (h.type === "oxygen") {
        const inVent = this.world.vents.some((v) => dist(this.player.x, this.player.y, v.x, v.y) <= v.radius);
        if (inVent) {
          hs.value = Math.min(100, hs.value + h.restorePerSec * dt);
        } else {
          hs.value = Math.max(0, hs.value - h.drainPerSec * hMult * dt);
        }
        inDanger = hs.value <= 20;
        if (hs.value <= 0) {
          hs.dpsTick += dt;
          if (hs.dpsTick >= 0.75) {
            hs.dpsTick = 0;
            this.damagePlayer(this.player.maxHp * h.suffocateDpsPct, true);
          }
        }
      } else if (h.type === "heat") {
        const moving = Math.hypot(this.player.vx, this.player.vy) > 0.4;
        if (moving) {
          hs.value = Math.max(0, hs.value - h.moveCoolPerSec * dt);
        } else {
          hs.value = Math.min(100, hs.value + h.idleHeatPerSec * hMult * dt);
        }
        inDanger = hs.value >= 75;
        if (hs.value >= 100) {
          hs.dpsTick += dt;
          if (hs.dpsTick >= 0.65) {
            hs.dpsTick = 0;
            this.damagePlayer(this.player.maxHp * h.burnDpsPct, true);
          }
        }
      } else if (h.type === "poison") {
        hs.poolSpawnTimer -= dt;
        if (hs.poolSpawnTimer <= 0 && this.world.enemies.length > 0) {
          hs.poolSpawnTimer = h.poolSpawnInterval / Math.sqrt(this.run.diff.hazardMult);
          const pos = this.findOpenSpot(this.world.size, this.world.grid, 2, this.world.size - 3);
          this.world.poisonPools.push({
            x: pos.x,
            y: pos.y,
            radius: 0.45,
            maxRadius: h.poolMaxRadius,
            life: 10.5
          });
        }
        let standingInPool = false;
        for (let i = this.world.poisonPools.length - 1; i >= 0; i--) {
          const p = this.world.poisonPools[i];
          p.life -= dt;
          p.radius = Math.min(p.maxRadius, p.radius + dt * 0.48);
          if (dist(this.player.x, this.player.y, p.x, p.y) <= p.radius) standingInPool = true;
          if (p.life <= 0) this.world.poisonPools.splice(i, 1);
        }
        if (standingInPool) {
          hs.value = Math.min(100, hs.value + h.toxinGainInPool * hMult * dt);
        } else {
          hs.value = Math.max(0, hs.value - h.toxinDecayPerSec * dt);
        }
        inDanger = standingInPool || hs.value >= 65;
        if (hs.value >= 50) {
          hs.dpsTick += dt;
          if (hs.dpsTick >= 0.75) {
            hs.dpsTick = 0;
            const scale = hs.value / 100;
            this.damagePlayer(this.player.maxHp * h.poisonDpsPct * scale, true);
          }
        }
      } else if (h.type === "gravity") {
        hs.phaseTimer -= dt;
        if (hs.phaseTimer <= 0) {
          hs.phase = hs.phase === "low" ? "heavy" : "low";
          hs.phaseTimer = h.cycleSeconds;
          this.spawnFloatingText(
            this.player.x,
            this.player.y,
            1.6,
            hs.phase === "low" ? "LOW-G (+35% SPD)" : "HEAVY-G (+35% DMG)",
            hs.phase === "low" ? "#38bdf8" : "#e879f9",
            true
          );
          this.sfx.portal();
        }
        hs.value = (hs.phaseTimer / h.cycleSeconds) * 100;
        inDanger = hs.phase === "heavy";
      }

      survHud.classList.toggle("danger-pulse", inDanger);
      if (this.hazardDamageFlash > 0) {
        overlay.className = "hazard-overlay hazard-damage";
      } else if (inDanger) {
        overlay.className = "hazard-overlay " + h.cssOverlay;
      } else {
        overlay.className = "hazard-overlay";
      }
    }

    updateMutatorEvents(dt) {
      if (this.run.mutators.includes("meteor_shower") && this.world.enemies.length > 0) {
        this.run.meteorTimer -= dt;
        if (this.run.meteorTimer <= 0) {
          this.run.meteorTimer = 4.5;
          const baseDmg = Math.round(35 * this.run.diff.dmgMult * (1 + Math.max(0, this.getDungeonOrder()) * 0.6));
          for (let i = 0; i < 2; i++) {
            const tx = clamp(this.player.x + randRange(-2.8, 2.8), 1.5, this.world.size - 1.5);
            const ty = clamp(this.player.y + randRange(-2.8, 2.8), 1.5, this.world.size - 1.5);
            this.telegraphs.push({
              type: "circle",
              x: tx,
              y: ty,
              radius: 1.65,
              elapsed: 0,
              duration: 1.15,
              damage: baseDmg,
              color: "#f97316"
            });
          }
        }
      }
    }

    getDungeonOrder() {
      return DATA.DUNGEONS.findIndex((d) => d.id === this.run.dungeon.id);
    }

    /* ======================================================================
       ENEMY & BOSS AI + TELEGRAPHED ATTACKS
       ====================================================================== */
    updateEnemies(dt) {
      for (const e of this.world.enemies) {
        e.hurtFlash = Math.max(0, e.hurtFlash - dt);
        if (e.stunTimer > 0) {
          e.stunTimer -= dt;
          continue;
        }

        const dx = this.player.x - e.x;
        const dy = this.player.y - e.y;
        const d = Math.hypot(dx, dy) || 0.001;
        e.facing.x = dx / d;
        e.facing.y = dy / d;

        if (e.isBoss) {
          this.updateBossAI(e, dt, dx, dy, d);
          continue;
        }

        const tpl = e.template;
        e.attackTimer -= dt;

        if (tpl.ai === "ranged") {
          if (d > e.range * 0.85) {
            this.moveEntityWithCollision(e, (dx / d) * e.speed * dt, (dy / d) * e.speed * dt, e.radius);
          } else if (d < 2.6) {
            this.moveEntityWithCollision(e, -(dx / d) * e.speed * 0.7 * dt, -(dy / d) * e.speed * 0.7 * dt, e.radius);
          }
          if (d <= e.range && e.attackTimer <= 0) {
            e.attackTimer = e.attackCd;
            const ang = Math.atan2(dy, dx);
            this.projectiles.push({
              friendly: false,
              x: e.x,
              y: e.y,
              vx: Math.cos(ang) * (tpl.projSpeed || 6.4),
              vy: Math.sin(ang) * (tpl.projSpeed || 6.4),
              radius: 0.25,
              damage: e.atk,
              color: tpl.projColor || "#f43f5e",
              trailColor: "#fca5a5",
              life: 1.8
            });
          }
        } else {
          if (d > e.range) {
            this.moveEntityWithCollision(e, (dx / d) * e.speed * dt, (dy / d) * e.speed * dt, e.radius);
          } else if (e.attackTimer <= 0) {
            e.attackTimer = e.attackCd;
            this.damagePlayer(e.atk, false);
            this.spawnBurst(this.player.x, this.player.y, "#f43f5e", 6, 2.0);
          }
        }
      }
    }

    updateBossAI(boss, dt, dx, dy, d) {
      if (boss.chargeTimer > 0 && boss.chargeVel) {
        boss.chargeTimer -= dt;
        this.moveEntityWithCollision(boss, boss.chargeVel.x * dt, boss.chargeVel.y * dt, boss.radius);
        if (dist(boss.x, boss.y, this.player.x, this.player.y) <= boss.radius + 0.55) {
          this.damagePlayer(boss.atk * 1.15, false);
          boss.chargeTimer = 0;
        }
        return;
      }

      if (d > 2.2) {
        this.moveEntityWithCollision(boss, (dx / d) * boss.speed * dt, (dy / d) * boss.speed * dt, boss.radius);
      }

      boss.patternTimer -= dt;
      if (boss.patternTimer > 0) return;

      const patterns = boss.template.patterns;
      const pat = patterns[boss.patternIdx % patterns.length];
      boss.patternIdx++;
      const speedMult = this.run.mutators.includes("hyper_speed") ? 1.35 : 1.0;
      boss.patternTimer = pat.cooldown / speedMult;
      const teleDur = pat.telegraph / Math.sqrt(speedMult);
      const dmg = Math.round(boss.atk * pat.dmgMult);

      this.spawnFloatingText(boss.x, boss.y, boss.height + 0.6, pat.name.toUpperCase(), "#fca5a5", true);

      if (pat.type === "slam_circle") {
        this.telegraphs.push({
          type: "circle",
          x: this.player.x,
          y: this.player.y,
          radius: pat.radius,
          elapsed: 0,
          duration: teleDur,
          damage: dmg,
          color: "#ef4444"
        });
      } else if (pat.type === "ring_nova") {
        this.telegraphs.push({
          type: "ring",
          x: boss.x,
          y: boss.y,
          innerRadius: pat.innerRadius,
          outerRadius: pat.outerRadius,
          elapsed: 0,
          duration: teleDur,
          damage: dmg,
          color: "#f97316"
        });
      } else if (pat.type === "line_charge") {
        const ang = Math.atan2(dy, dx);
        this.telegraphs.push({
          type: "line",
          x: boss.x,
          y: boss.y,
          angle: ang,
          length: pat.length,
          width: pat.width,
          elapsed: 0,
          duration: teleDur,
          damage: dmg,
          color: "#ef4444",
          onDetonate: () => {
            boss.chargeVel = { x: Math.cos(ang) * 14, y: Math.sin(ang) * 14 };
            boss.chargeTimer = 0.42;
          }
        });
      } else if (pat.type === "cross_beam") {
        const baseA = Math.random() < 0.5 ? 0 : Math.PI * 0.25;
        for (let k = 0; k < 4; k++) {
          this.telegraphs.push({
            type: "line",
            x: boss.x,
            y: boss.y,
            angle: baseA + (k * Math.PI) / 2,
            length: pat.length,
            width: pat.width,
            elapsed: 0,
            duration: teleDur,
            damage: dmg,
            color: "#f43f5e"
          });
        }
      } else if (pat.type === "triple_drop") {
        for (let i = 0; i < pat.count; i++) {
          const tx = i === 0 ? this.player.x : clamp(this.player.x + randRange(-3.2, 3.2), 1.6, this.world.size - 1.6);
          const ty = i === 0 ? this.player.y : clamp(this.player.y + randRange(-3.2, 3.2), 1.6, this.world.size - 1.6);
          this.telegraphs.push({
            type: "circle",
            x: tx,
            y: ty,
            radius: pat.radius,
            elapsed: 0,
            duration: teleDur + i * 0.14,
            damage: dmg,
            color: pat.leavesPoison ? "#22c55e" : "#ef4444",
            leavesPoison: !!pat.leavesPoison
          });
        }
      } else if (pat.type === "radial_volley") {
        const count = pat.count || 10;
        this.telegraphs.push({
          type: "circle",
          x: boss.x,
          y: boss.y,
          radius: 1.8,
          elapsed: 0,
          duration: teleDur,
          damage: Math.round(dmg * 0.7),
          color: "#e879f9",
          onDetonate: () => {
            for (let i = 0; i < count; i++) {
              const a = (i / count) * Math.PI * 2 + this.elapsed;
              this.projectiles.push({
                friendly: false,
                x: boss.x,
                y: boss.y,
                vx: Math.cos(a) * 6.5,
                vy: Math.sin(a) * 6.5,
                radius: 0.28,
                damage: dmg,
                color: boss.trim,
                trailColor: "#f0abfc",
                life: 2.2
              });
            }
          }
        });
      }
    }

    updateTelegraphs(dt) {
      for (let i = this.telegraphs.length - 1; i >= 0; i--) {
        const t = this.telegraphs[i];
        t.elapsed += dt;
        if (t.elapsed < t.duration) continue;

        this.telegraphs.splice(i, 1);
        this.sfx.bossSlam();
        this.addScreenShake(0.18, 7);
        this.spawnBurst(t.x, t.y, t.color, 18, 3.8);

        if (t.onDetonate) t.onDetonate();

        if (t.leavesPoison) {
          this.world.poisonPools.push({ x: t.x, y: t.y, radius: t.radius * 0.75, maxRadius: t.radius, life: 9.0 });
        }

        let hit = false;
        if (t.type === "circle") {
          hit = dist(this.player.x, this.player.y, t.x, t.y) <= t.radius;
        } else if (t.type === "ring") {
          const pd = dist(this.player.x, this.player.y, t.x, t.y);
          hit = pd >= t.innerRadius && pd <= t.outerRadius;
        } else if (t.type === "line") {
          const px = this.player.x - t.x;
          const py = this.player.y - t.y;
          const cos = Math.cos(-t.angle);
          const sin = Math.sin(-t.angle);
          const lx = px * cos - py * sin;
          const ly = px * sin + py * cos;
          hit = lx >= 0 && lx <= t.length && Math.abs(ly) <= t.width * 0.5 + 0.25;
        }
        if (hit) this.damagePlayer(t.damage, false);
      }
    }

    updateProjectiles(dt, stats) {
      const sz = this.world.size;
      for (let i = this.projectiles.length - 1; i >= 0; i--) {
        const p = this.projectiles[i];
        p.life -= dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        const tx = Math.floor(p.x);
        const ty = Math.floor(p.y);
        if (p.life <= 0 || tx < 0 || ty < 0 || tx >= sz || ty >= sz || this.world.grid[ty][tx] !== 0) {
          this.spawnBurst(p.x, p.y, p.color, 4, 1.4);
          this.projectiles.splice(i, 1);
          continue;
        }

        if (p.friendly) {
          let remove = false;
          for (const e of [...this.world.enemies]) {
            if (p.hitIds.has(e.id)) continue;
            if (dist(p.x, p.y, e.x, e.y) <= p.radius + e.radius) {
              p.hitIds.add(e.id);
              this.damageEnemy(e, p.damage, !!p.guaranteedCrit, stats);
              if (p.pierce > 0) {
                p.pierce--;
              } else {
                remove = true;
                break;
              }
            }
          }
          if (remove) this.projectiles.splice(i, 1);
        } else {
          if (dist(p.x, p.y, this.player.x, this.player.y) <= p.radius + 0.36) {
            this.damagePlayer(p.damage, false);
            this.projectiles.splice(i, 1);
          }
        }
      }
    }

    updateLootAndPortals(dt) {
      for (let i = this.lootDrops.length - 1; i >= 0; i--) {
        const d = this.lootDrops[i];
        d.life += dt;
        if (d.z > 0 || d.vz > 0) {
          d.vz -= 12 * dt;
          d.z += d.vz * dt;
          d.x = clamp(d.x + d.vx * dt, 1.3, this.world.size - 1.3);
          d.y = clamp(d.y + d.vy * dt, 1.3, this.world.size - 1.3);
          if (d.z <= 0) {
            d.z = 0;
            d.vz = 0;
            d.vx = 0;
            d.vy = 0;
          }
        } else {
          const pd = dist(this.player.x, this.player.y, d.x, d.y);
          if (pd < 2.8) {
            const ang = Math.atan2(this.player.y - d.y, this.player.x - d.x);
            d.x += Math.cos(ang) * 7.5 * dt;
            d.y += Math.sin(ang) * 7.5 * dt;
          }
          if (pd < 0.72) {
            this.collectLootDrop(d);
            this.lootDrops.splice(i, 1);
          }
        }
      }

      for (const ch of this.world.chests) {
        if (!ch.opened && dist(this.player.x, this.player.y, ch.x, ch.y) < 1.15) {
          ch.opened = true;
          const bonusGold = Math.round(this.run.dungeon.baseGold * 0.45 * this.run.rewardMult);
          this.save.gold += bonusGold;
          this.run.goldEarned += bonusGold;
          this.sfx.loot("rare");
          this.spawnBurst(ch.x, ch.y, "#f6c453", 18, 3.2);
          this.spawnFloatingText(ch.x, ch.y, 1.3, `+${bonusGold} Gold`, "#f6c453", true);
          if (Math.random() < 0.45) this.dropLootItem(ch.x, ch.y, false);
        }
      }

      const prompt = document.getElementById("interact-prompt");
      if (this.world.portal) {
        const pd = dist(this.player.x, this.player.y, this.world.portal.x, this.world.portal.y);
        if (pd < this.world.portal.radius) {
          while (this.lootDrops.length > 0) this.collectLootDrop(this.lootDrops.pop());
          this.run.roomIndex += 1;
          this.sfx.portal();
          this.generateDungeonRoom(this.run.roomIndex);
          prompt.classList.add("hidden");
        }
      } else {
        prompt.classList.add("hidden");
      }
    }

    completeDungeonVictory() {
      this.run.finished = true;
      while (this.lootDrops.length > 0) this.collectLootDrop(this.lootDrops.pop());

      const { dungeon, diff } = this.run;
      const currencyMult = (1 + this.getBlessingBonus("currencyPct")) * this.run.rewardMult;
      const clearGold = Math.round(dungeon.baseGold * currencyMult);
      const clearShards = Math.round(dungeon.baseShards * currencyMult);
      this.save.gold += clearGold;
      this.save.shards += clearShards;
      this.run.goldEarned += clearGold;
      this.run.shardsEarned += clearShards;
      this.grantXp(dungeon.baseXp * diff.xpMult);

      if (!this.save.cleared[dungeon.id]) this.save.cleared[dungeon.id] = {};
      if (!this.save.cleared[dungeon.id][diff.id]) {
        const wasNeverCleared = !this.isDungeonCleared(dungeon.id);
        this.save.cleared[dungeon.id][diff.id] = true;
        this.save.renown += diff.renownFirstClear;
        this.run.renownEarned = diff.renownFirstClear;
        if (wasNeverCleared) {
          this.toast(`Mercenary Guild unlocked auto-farming for ${dungeon.name}!`, "success");
        }
      }

      this.sfx.victory();
      this.saveGame(false);
      this.showRunSummary(true);
    }

    handlePlayerDefeat() {
      this.run.finished = true;
      this.sfx.defeat();
      this.saveGame(false);
      this.showRunSummary(false);
    }

    showRunSummary(victory) {
      const elapsedSec = Math.max(1, Math.round((performance.now() - this.run.startTime) / 1000));
      const titleEl = document.getElementById("summary-title");
      titleEl.textContent = victory ? "RIFT CONQUERED" : "FALLEN IN THE RIFT";
      titleEl.style.color = victory ? "#fde047" : "#fda4af";

      document.getElementById("summary-subtitle").textContent = `${this.run.dungeon.name} — ${this.run.diff.name} (${elapsedSec}s)`;

      const statsEl = document.getElementById("summary-stats");
      statsEl.innerHTML = `
        <div class="summary-stat-card">
          <div class="summary-stat-label">Gold Earned</div>
          <div class="summary-stat-val gold-text">+${fmtNum(this.run.goldEarned)}</div>
        </div>
        <div class="summary-stat-card">
          <div class="summary-stat-label">Rift Shards</div>
          <div class="summary-stat-val shard-text">+${fmtNum(this.run.shardsEarned)}</div>
        </div>
        <div class="summary-stat-card">
          <div class="summary-stat-label">Guild Renown</div>
          <div class="summary-stat-val renown-text">+${this.run.renownEarned}</div>
        </div>
        <div class="summary-stat-card">
          <div class="summary-stat-label">Enemies Slain</div>
          <div class="summary-stat-val">${this.run.enemiesSlain}</div>
        </div>
        <div class="summary-stat-card">
          <div class="summary-stat-label">Damage Dealt</div>
          <div class="summary-stat-val">${fmtNum(this.run.damageDealt)}</div>
        </div>
        <div class="summary-stat-card">
          <div class="summary-stat-label">Reward Multiplier</div>
          <div class="summary-stat-val gold-text">${this.run.rewardMult.toFixed(2)}x</div>
        </div>
      `;

      const lootEl = document.getElementById("summary-loot");
      if (this.run.lootCollected.length === 0) {
        lootEl.innerHTML = `<div class="muted-text">No gear drops collected this expedition.</div>`;
      } else {
        lootEl.innerHTML = "";
        for (const item of this.run.lootCollected) {
          lootEl.appendChild(this.buildGearCardEl(item, false));
        }
      }

      this.openModal("run-summary");
    }

    findNearestEnemy(x, y, maxRange) {
      let best = null;
      let bestD = maxRange;
      for (const e of this.world.enemies) {
        const d = dist(x, y, e.x, e.y) - e.radius;
        if (d <= bestD) {
          bestD = d;
          best = e;
        }
      }
      return best;
    }

    /* ======================================================================
       PARTICLES, FLOATING NUMBERS & SCREEN SHAKE
       ====================================================================== */
    addScreenShake(duration, magnitude) {
      if (!this.save.settings.screenShake) return;
      this.cam.shakeTime = Math.max(this.cam.shakeTime, duration);
      this.cam.shakeMag = Math.max(this.cam.shakeMag, magnitude);
    }

    spawnBurst(wx, wy, color, count = 10, speed = 2.6) {
      for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2;
        const sp = randRange(speed * 0.35, speed);
        this.particles.push({
          x: wx,
          y: wy,
          z: randRange(0.2, 0.7),
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          vz: randRange(1.2, 3.4),
          color,
          size: randRange(2.2, 5.2),
          life: randRange(0.25, 0.55),
          maxLife: 0.55
        });
      }
    }

    spawnFloatingText(wx, wy, wz, text, color = "#ffffff", big = false) {
      if (!this.save.settings.showDmgNums && !big) return;
      this.floatingTexts.push({
        x: wx + randRange(-0.25, 0.25),
        y: wy + randRange(-0.25, 0.25),
        z: wz,
        text,
        color,
        big,
        life: big ? 1.05 : 0.72,
        maxLife: big ? 1.05 : 0.72
      });
    }

    updateParticlesAndText(dt) {
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.life -= dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vz -= 7.5 * dt;
        p.z = Math.max(0, p.z + p.vz * dt);
        if (p.life <= 0) this.particles.splice(i, 1);
      }

      for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
        const f = this.floatingTexts[i];
        f.life -= dt;
        f.z += dt * 1.15;
        if (f.life <= 0) this.floatingTexts.splice(i, 1);
      }

      for (let i = this.slashArcs.length - 1; i >= 0; i--) {
        this.slashArcs[i].life -= dt;
        if (this.slashArcs[i].life <= 0) this.slashArcs.splice(i, 1);
      }
    }

    /* ======================================================================
       2.5D PIXEL-ART ISOMETRIC RENDERING ENGINE
       ====================================================================== */
    resizeCanvas() {
      const w = Math.max(320, Math.floor(this.canvas.clientWidth / ISO.PIXEL_SCALE));
      const h = Math.max(200, Math.floor(this.canvas.clientHeight / ISO.PIXEL_SCALE));
      this.canvas.width = w;
      this.canvas.height = h;
      this.ctx.imageSmoothingEnabled = false;
    }

    render() {
      const ctx = this.ctx;
      const w = this.canvas.width;
      const h = this.canvas.height;
      const pal = this.world.palette;

      ctx.imageSmoothingEnabled = false;
      ctx.fillStyle = pal.bgBottom;
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = pal.bgTop;
      ctx.fillRect(0, 0, w, Math.floor(h * 0.62));

      let shakeX = 0;
      let shakeY = 0;
      if (this.cam.shakeTime > 0) {
        shakeX = Math.round(randRange(-this.cam.shakeMag, this.cam.shakeMag) * 0.5);
        shakeY = Math.round(randRange(-this.cam.shakeMag, this.cam.shakeMag) * 0.5);
      }
      const halfW = Math.floor(w * 0.5) + shakeX;
      const halfH = Math.floor(h * 0.52) + shakeY;

      const toS = (wx, wy, wz = 0) => ISO.toScreen(wx, wy, wz, this.cam.x, this.cam.y, halfW, halfH);

      // 1. Floor Tiles with Retro Pixel Stone Speckling
      const sz = this.world.size;
      for (let y = 0; y < sz; y++) {
        for (let x = 0; x < sz; x++) {
          const p = toS(x + 0.5, y + 0.5, 0);
          const col = (x + y) % 2 === 0 ? pal.tileA : pal.tileB;
          drawIsoDiamond(ctx, p.x, p.y, ISO.TILE_W, ISO.TILE_H, col, pal.tileBorder, 1);

          const hash = (x * 37 + y * 91) & 7;
          if (hash === 1 || hash === 4) {
            ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
            ctx.fillRect(p.x - 4, p.y - 1, 2, 1);
            ctx.fillRect(p.x + 3, p.y + 2, 2, 1);
          } else if (hash === 2) {
            ctx.fillStyle = "rgba(0, 0, 0, 0.22)";
            ctx.fillRect(p.x - 2, p.y + 1, 3, 1);
          }
        }
      }

      // 2. Ground Effects
      this.renderGroundEffects(ctx, toS);

      // 3. Depth-Sorted 2.5D Renderables
      const renderables = [];

      for (let y = 0; y < sz; y++) {
        for (let x = 0; x < sz; x++) {
          const cell = this.world.grid[y][x];
          if (cell === 1 || cell === 2) {
            const isFrontBorder = cell === 1 && (x === sz - 1 || y === sz - 1);
            const heightPx = isFrontBorder ? 9 : cell === 2 ? 32 : 19;
            const topCol = cell === 2 && pal.pillarTop ? pal.pillarTop : pal.wallTop;
            renderables.push({
              depth: x + y + 0.5,
              draw: () => {
                const p = toS(x + 0.5, y + 0.5, 0);
                drawIsoBlock(
                  ctx,
                  p.x,
                  p.y,
                  ISO.TILE_W,
                  ISO.TILE_H,
                  heightPx,
                  topCol,
                  pal.wallLeft,
                  pal.wallRight,
                  "#07090f"
                );
              }
            });
          }
        }
      }

      for (const st of this.world.stations) {
        renderables.push({
          depth: st.x + st.y,
          draw: () => this.drawStation(ctx, st, toS)
        });
      }

      for (const ch of this.world.chests) {
        renderables.push({
          depth: ch.x + ch.y,
          draw: () => this.drawChest(ctx, ch, toS)
        });
      }

      for (const drop of this.lootDrops) {
        renderables.push({
          depth: drop.x + drop.y,
          draw: () => this.drawLootDrop(ctx, drop, toS)
        });
      }

      for (const img of this.player.afterimages) {
        renderables.push({
          depth: img.x + img.y - 0.05,
          draw: () => {
            const p = toS(img.x, img.y, 0);
            ctx.save();
            ctx.globalAlpha = img.life * 2.2;
            drawIsoBlock(ctx, p.x, p.y, 18, 9, 22, "#7dd3fc", "#0ea5e9", "#0284c7", "#07090f");
            ctx.restore();
          }
        });
      }

      renderables.push({
        depth: this.player.x + this.player.y,
        draw: () => this.drawHero(ctx, toS)
      });

      for (const e of this.world.enemies) {
        renderables.push({
          depth: e.x + e.y,
          draw: () => this.drawEnemy(ctx, e, toS)
        });
      }

      for (const pr of this.projectiles) {
        renderables.push({
          depth: pr.x + pr.y + 0.1,
          draw: () => this.drawProjectile(ctx, pr, toS)
        });
      }

      renderables.sort((a, b) => a.depth - b.depth);
      for (const r of renderables) r.draw();

      // 4. Square Pixel Particles
      for (const pt of this.particles) {
        const p = toS(pt.x, pt.y, pt.z);
        const szPx = Math.max(2, Math.round(pt.size * 0.7));
        ctx.save();
        ctx.globalAlpha = clamp(pt.life / pt.maxLife, 0, 1);
        ctx.fillStyle = pt.color;
        ctx.fillRect(p.x - Math.floor(szPx * 0.5), p.y - Math.floor(szPx * 0.5), szPx, szPx);
        ctx.restore();
      }

      // 5. Pixel Floating Combat Numbers
      for (const ft of this.floatingTexts) {
        const p = toS(ft.x, ft.y, ft.z);
        ctx.save();
        ctx.globalAlpha = clamp(ft.life / (ft.maxLife * 0.6), 0, 1);
        ctx.font = ft.big ? "bold 11px 'Courier New', monospace" : "bold 9px 'Courier New', monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = "#05070c";
        ctx.fillText(ft.text, p.x + 1, p.y + 1);
        ctx.fillText(ft.text, p.x - 1, p.y + 1);
        ctx.fillStyle = ft.color;
        ctx.fillText(ft.text, p.x, p.y);
        ctx.restore();
      }
    }

    renderGroundEffects(ctx, toS) {
      for (const v of this.world.vents) {
        const p = toS(v.x, v.y, 0);
        const pulse = 0.92 + Math.sin(this.elapsed * 3.5) * 0.08;
        drawIsoGroundEllipse(ctx, p.x, p.y, v.radius * pulse, "rgba(56, 189, 248, 0.16)", "rgba(125, 211, 252, 0.72)", 1);
        drawIsoBlock(ctx, p.x, p.y, 12, 6, 13, "#bae6fd", "#38bdf8", "#0284c7", "#07090f");
      }

      for (const pool of this.world.poisonPools) {
        const p = toS(pool.x, pool.y, 0);
        const alpha = clamp(pool.life / 2, 0, 1);
        drawIsoGroundEllipse(
          ctx,
          p.x,
          p.y,
          pool.radius,
          `rgba(34, 197, 94, ${0.28 * alpha})`,
          `rgba(163, 230, 53, ${0.8 * alpha})`,
          1
        );
      }

      if (this.world.portal) {
        const p = toS(this.world.portal.x, this.world.portal.y, 0);
        const pulse = 1 + Math.sin(this.elapsed * 5) * 0.12;
        drawIsoGroundEllipse(ctx, p.x, p.y, 1.25 * pulse, "rgba(56, 189, 248, 0.28)", "#7dd3fc", 2);
        ctx.save();
        ctx.strokeStyle = "#e0f2fe";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(p.x, p.y - 18, 14, 22, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = "rgba(56, 189, 248, 0.35)";
        ctx.fill();
        ctx.fillStyle = "#e0f2fe";
        ctx.font = "bold 9px 'Courier New', monospace";
        ctx.textAlign = "center";
        ctx.fillText("NEXT ROOM", p.x, p.y - 44);
        ctx.restore();
      }

      for (const t of this.telegraphs) {
        const prog = clamp(t.elapsed / t.duration, 0, 1);
        if (t.type === "circle") {
          const p = toS(t.x, t.y, 0);
          drawIsoGroundEllipse(ctx, p.x, p.y, t.radius, "rgba(239, 68, 68, 0.18)", "rgba(248, 113, 113, 0.92)", 1);
          drawIsoGroundEllipse(ctx, p.x, p.y, Math.max(0.1, t.radius * prog), "rgba(239, 68, 68, 0.38)", null);
        } else if (t.type === "ring") {
          const p = toS(t.x, t.y, 0);
          drawIsoGroundEllipse(ctx, p.x, p.y, t.outerRadius, "rgba(249, 115, 22, 0.22)", "#fb923c", 2);
          drawIsoGroundEllipse(
            ctx,
            p.x,
            p.y,
            lerp(t.innerRadius, t.outerRadius, prog),
            null,
            "rgba(254, 240, 138, 0.9)",
            1
          );
          drawIsoGroundEllipse(ctx, p.x, p.y, t.innerRadius, "rgba(15, 23, 42, 0.65)", "#4ade80", 1);
        } else if (t.type === "line") {
          const cos = Math.cos(t.angle);
          const sin = Math.sin(t.angle);
          const hw = t.width * 0.5;
          const corners = [
            toS(t.x - sin * hw, t.y + cos * hw, 0),
            toS(t.x + sin * hw, t.y - cos * hw, 0),
            toS(t.x + cos * t.length + sin * hw, t.y + sin * t.length - cos * hw, 0),
            toS(t.x + cos * t.length - sin * hw, t.y + sin * t.length + cos * hw, 0)
          ];
          ctx.beginPath();
          ctx.moveTo(corners[0].x, corners[0].y);
          for (let k = 1; k < 4; k++) ctx.lineTo(corners[k].x, corners[k].y);
          ctx.closePath();
          ctx.fillStyle = `rgba(239, 68, 68, ${0.16 + prog * 0.34})`;
          ctx.fill();
          ctx.strokeStyle = "rgba(252, 165, 165, 0.95)";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      for (const arc of this.slashArcs) {
        const p = toS(arc.x, arc.y, 0.25);
        const alpha = clamp(arc.life / arc.maxLife, 0, 1);
        ctx.save();
        ctx.globalAlpha = alpha * 0.82;
        if (arc.span >= Math.PI * 1.9) {
          drawIsoGroundEllipse(ctx, p.x, p.y, arc.radius * (1.15 - alpha * 0.25), null, arc.color, 3);
        } else {
          const tip = toS(arc.x + Math.cos(arc.angle), arc.y + Math.sin(arc.angle), 0.25);
          const screenAng = Math.atan2(tip.y - p.y, tip.x - p.x);
          ctx.strokeStyle = arc.color;
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.arc(p.x, p.y, arc.radius * 18, screenAng - arc.span * 0.45, screenAng + arc.span * 0.45);
          ctx.stroke();
        }
        ctx.restore();
      }
    }

    drawStation(ctx, st, toS) {
      const p = toS(st.x, st.y, 0);
      const pulse = 0.94 + Math.sin(this.elapsed * 3) * 0.06;
      drawIsoGroundEllipse(ctx, p.x, p.y, 1.35 * pulse, st.glow.replace(/0\.\d+/, "0.18"), st.color, 1);

      if (st.shape === "portal") {
        drawIsoBlock(ctx, p.x - 16, p.y, 12, 6, 34, "#475569", "#1e293b", "#0f172a", "#07090f");
        drawIsoBlock(ctx, p.x + 16, p.y, 12, 6, 34, "#475569", "#1e293b", "#0f172a", "#07090f");
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(p.x, p.y - 20, 12, 18, 0, 0, Math.PI * 2);
        ctx.fillStyle = st.glow;
        ctx.fill();
        ctx.strokeStyle = "#e0f2fe";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
      } else {
        drawIsoBlock(ctx, p.x, p.y, 24, 12, 18, st.color, "#1e293b", "#0f172a", "#07090f");
      }

      ctx.save();
      ctx.font = "bold 9px 'Courier New', monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = "rgba(8, 12, 22, 0.9)";
      const label = st.name.toUpperCase();
      const tw = ctx.measureText(label).width + 10;
      ctx.fillRect(p.x - Math.floor(tw * 0.5), p.y - 50, tw, 14);
      ctx.strokeStyle = st.color;
      ctx.lineWidth = 1;
      ctx.strokeRect(p.x - Math.floor(tw * 0.5), p.y - 50, tw, 14);
      ctx.fillStyle = "#f8fafc";
      ctx.fillText(label, p.x, p.y - 40);
      ctx.restore();
    }

    drawChest(ctx, ch, toS) {
      const p = toS(ch.x, ch.y, 0);
      drawIsoGroundEllipse(ctx, p.x, p.y, 0.65, "rgba(0,0,0,0.48)");
      const topCol = ch.opened ? "#475569" : "#f59e0b";
      drawIsoBlock(ctx, p.x, p.y, 18, 9, ch.opened ? 7 : 13, topCol, "#78350f", "#451a03", "#07090f");
    }

    drawLootDrop(ctx, drop, toS) {
      const rar = DATA.RARITIES[drop.item.rarity];
      const ground = toS(drop.x, drop.y, 0);
      const bob = Math.sin(this.elapsed * 5 + drop.life) * 0.14;
      const p = toS(drop.x, drop.y, drop.z + 0.3 + bob);

      drawIsoGroundEllipse(ctx, ground.x, ground.y, 0.36, "rgba(0,0,0,0.52)");

      if (drop.item.rarity !== "common") {
        const beamH = drop.item.rarity === "mythic" ? 56 : drop.item.rarity === "epic" ? 38 : 24;
        const grad = ctx.createLinearGradient(ground.x, ground.y, ground.x, ground.y - beamH);
        grad.addColorStop(0, rar.color);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.fillRect(ground.x - 3, ground.y - beamH, 6, beamH);
      }

      ctx.save();
      ctx.fillStyle = rar.color;
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y - 6);
      ctx.lineTo(p.x + 5, p.y);
      ctx.lineTo(p.x, p.y + 6);
      ctx.lineTo(p.x - 5, p.y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    drawHero(ctx, toS) {
      const armorTpl = GearSystem.getTemplate(this.save.equipped.armor.templateId);
      const wepTpl = GearSystem.getTemplate(this.save.equipped.weapon.templateId);
      const vis = armorTpl.visuals || { body: "#334155", cloak: "#2563eb", trim: "#e2e8f0", aura: null };

      const p = toS(this.player.x, this.player.y, 0);
      const moving = Math.hypot(this.player.vx, this.player.vy) > 0.2;
      const bob = moving ? Math.round(Math.abs(Math.sin(this.elapsed * 14)) * 3) : Math.round(Math.sin(this.elapsed * 3));

      // Screen-space 8-way facing direction
      const f = ISO.worldDirToScreen(this.player.facing.x, this.player.facing.y);
      const facingAway = f.y < -0.35;

      drawIsoGroundEllipse(ctx, p.x, p.y + 1, 0.55, "rgba(0, 0, 0, 0.58)");
      if (vis.aura) {
        drawIsoGroundEllipse(ctx, p.x, p.y, 0.72, vis.aura, vis.trim, 1);
      }

      if (this.player.shield > 0) {
        drawIsoGroundEllipse(ctx, p.x, p.y - 11, 0.75, "rgba(56, 189, 248, 0.16)", "#7dd3fc", 1);
      }

      const bodyCol = this.player.hurtFlash > 0 ? "#ffffff" : vis.body;
      const cloakCol = this.player.hurtFlash > 0 ? "#fecaca" : vis.cloak;
      const trimCol = this.player.iframeTimer > 0 ? "#7dd3fc" : vis.trim;

      // Cape behind hero
      if (!facingAway) {
        const capeX = Math.round(p.x - f.x * 5);
        const capeY = Math.round(p.y - 14 - bob - f.y * 2);
        ctx.fillStyle = cloakCol;
        ctx.fillRect(capeX - 5, capeY, 10, 12);
        ctx.strokeStyle = "#07090f";
        ctx.lineWidth = 1;
        ctx.strokeRect(capeX - 5, capeY, 10, 12);
      }

      // 2.5D Pixel Torso
      drawIsoBlock(ctx, p.x, p.y - bob, 18, 9, 18, trimCol, cloakCol, bodyCol, "#07090f");

      // Cape in front when facing North (away from camera)
      if (facingAway) {
        ctx.fillStyle = cloakCol;
        ctx.fillRect(p.x - 6, p.y - 17 - bob, 12, 13);
        ctx.strokeStyle = "#07090f";
        ctx.lineWidth = 1;
        ctx.strokeRect(p.x - 6, p.y - 17 - bob, 12, 13);
      }

      // 2.5D Pixel Head / Helm
      const headY = p.y - 18 - bob;
      drawIsoBlock(ctx, p.x, headY, 14, 7, 10, trimCol, bodyCol, "#0f172a", "#07090f");

      // Directional Face Visor & Pixel Eyes
      const eyeY = headY - 6;
      if (f.y > -0.62) {
        const shiftX = Math.round(f.x * 3);
        if (f.y >= -0.22) {
          ctx.fillStyle = "#fde68a";
          ctx.fillRect(p.x - 4 + shiftX, eyeY - 1, 8, 3);

          const leftEyeX = p.x - 3 + shiftX;
          const rightEyeX = p.x + 2 + shiftX;
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(leftEyeX, eyeY - 1, 2, 2);
          ctx.fillRect(rightEyeX, eyeY - 1, 2, 2);

          const pupilShift = f.x > 0.25 ? 1 : 0;
          ctx.fillStyle = "#07090f";
          ctx.fillRect(leftEyeX + pupilShift, eyeY - 1, 1, 2);
          ctx.fillRect(rightEyeX + pupilShift, eyeY - 1, 1, 2);
        } else {
          const sideSign = f.x >= 0 ? 1 : -1;
          const peekX = p.x + sideSign * 4;
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(peekX, eyeY - 1, 2, 2);
          ctx.fillStyle = "#07090f";
          ctx.fillRect(peekX + (sideSign > 0 ? 1 : 0), eyeY - 1, 1, 2);
        }
      } else {
        ctx.fillStyle = trimCol;
        ctx.fillRect(p.x - 1, headY - 11, 2, 5);
      }

      // Directional Equipped Weapon
      const swingAng = this.player.swingAnim > 0 ? Math.sin(this.player.swingAnim * 30) * 1.1 : 0;
      const baseAng = Math.atan2(f.y, f.x) + swingAng;
      const handX = Math.round(p.x + f.x * 6 - f.y * 4);
      const handY = Math.round(p.y - 12 - bob + f.y * 3);
      const tipX = Math.round(handX + Math.cos(baseAng) * 13);
      const tipY = Math.round(handY + Math.sin(baseAng) * 10 - 4);

      ctx.strokeStyle = "#07090f";
      ctx.lineWidth = wepTpl.attackType === "melee_heavy" ? 5 : 4;
      ctx.beginPath();
      ctx.moveTo(handX, handY);
      ctx.lineTo(tipX, tipY);
      ctx.stroke();

      ctx.strokeStyle = wepTpl.weaponColor;
      ctx.lineWidth = wepTpl.attackType === "melee_heavy" ? 3 : 2;
      ctx.beginPath();
      ctx.moveTo(handX, handY);
      ctx.lineTo(tipX, tipY);
      ctx.stroke();

      ctx.fillStyle = wepTpl.trailColor;
      ctx.fillRect(tipX - 2, tipY - 2, 4, 4);
    }

    drawEnemy(ctx, e, toS) {
      const p = toS(e.x, e.y, 0);
      const hurt = e.hurtFlash > 0;
      const stunned = e.stunTimer > 0;
      const f = ISO.worldDirToScreen(e.facing.x, e.facing.y);

      drawIsoGroundEllipse(ctx, p.x, p.y + 1, e.radius * 1.2, "rgba(0, 0, 0, 0.58)");

      if (e.isBoss) {
        this.drawBossSprite(ctx, e, p, f, hurt, stunned);
      } else {
        this.drawMobSprite(ctx, e, p, f, hurt, stunned);
      }

      if (stunned) {
        const topOffset = Math.round(e.height * 22) + (e.isBoss ? 18 : 10);
        const spin = this.elapsed * 7;
        ctx.fillStyle = "#38bdf8";
        ctx.fillRect(p.x + Math.round(Math.cos(spin) * 7) - 1, p.y - topOffset, 2, 2);
        ctx.fillStyle = "#fde047";
        ctx.fillRect(p.x + Math.round(Math.cos(spin + Math.PI) * 7) - 1, p.y - topOffset + 1, 2, 2);
      }

      if (!e.isBoss && e.hp < e.maxHp) {
        const barW = 26;
        const topY = p.y - Math.round(e.height * 22) - 12;
        const pct = clamp(e.hp / e.maxHp, 0, 1);
        ctx.fillStyle = "#07090f";
        ctx.fillRect(p.x - Math.floor(barW * 0.5) - 1, topY, barW + 2, 5);
        ctx.fillStyle = "#ef4444";
        ctx.fillRect(p.x - Math.floor(barW * 0.5), topY + 1, Math.round(barW * pct), 3);
      }
    }

    drawMobSprite(ctx, e, p, f, hurt, stunned) {
      const id = e.template.id;
      const ai = e.template.ai;
      const cMain = hurt ? "#ffffff" : e.color;
      const cTrim = hurt ? "#fef08a" : e.trim;
      const cDark = hurt ? "#fca5a5" : "#0b0f1c";
      const eyeCol = stunned ? "#38bdf8" : "#fef08a";
      const eyeShiftX = Math.round(f.x * 3);
      const stride = Math.sin(this.elapsed * 12 + e.x * 3);
      const bob = Math.round(Math.abs(stride) * 2);

      // 1. CHASERS
      if (id === "crystal_crawler") {
        ctx.strokeStyle = "#07090f";
        ctx.lineWidth = 2;
        for (const side of [-1, 1]) {
          for (let i = -1; i <= 1; i++) {
            const legLift = Math.round(Math.sin(this.elapsed * 16 + i * 2 + side) * 2);
            ctx.beginPath();
            ctx.moveTo(p.x + side * 5, p.y - 4);
            ctx.lineTo(p.x + side * 12, p.y - 6 + i * 2 + legLift);
            ctx.lineTo(p.x + side * 14, p.y + 1 + i * 2);
            ctx.stroke();
          }
        }
        drawIsoBlock(ctx, p.x, p.y - bob, 20, 10, 7, cMain, cMain, cDark, "#07090f");
        drawIsoBlock(ctx, p.x - Math.round(f.x * 2), p.y - 7 - bob, 10, 5, 10, "#ffffff", cTrim, cMain, "#07090f");
        if (f.y > -0.45) {
          ctx.fillStyle = eyeCol;
          ctx.fillRect(p.x - 4 + eyeShiftX, p.y - 5 - bob, 2, 2);
          ctx.fillRect(p.x + 2 + eyeShiftX, p.y - 5 - bob, 2, 2);
          ctx.fillRect(p.x - 2 + eyeShiftX, p.y - 3 - bob, 1, 1);
          ctx.fillRect(p.x + 1 + eyeShiftX, p.y - 3 - bob, 1, 1);
        }
        return;
      }

      if (id === "clockwork_hound") {
        ctx.fillStyle = cDark;
        const l1 = Math.round(stride * 3);
        ctx.fillRect(p.x - 8, p.y - 5 + l1, 3, 6);
        ctx.fillRect(p.x + 5, p.y - 5 - l1, 3, 6);
        ctx.fillRect(p.x - 4, p.y - 3 - l1, 3, 5);
        ctx.fillRect(p.x + 2, p.y - 3 + l1, 3, 5);

        drawIsoBlock(ctx, p.x, p.y - 3 - bob, 22, 11, 9, cTrim, cMain, cDark, "#07090f");
        ctx.fillStyle = "#475569";
        ctx.fillRect(p.x - Math.round(f.x * 4) - 2, p.y - 16 - bob, 3, 5);
        const hx = p.x + Math.round(f.x * 6);
        const hy = p.y - 7 - bob + Math.round(f.y * 3);
        drawIsoBlock(ctx, hx, hy, 12, 6, 7, cTrim, cMain, cDark, "#07090f");
        if (f.y > -0.45) {
          ctx.fillStyle = "#ef4444";
          ctx.fillRect(hx - 3 + Math.round(f.x * 2), hy - 5, 2, 2);
          ctx.fillRect(hx + 2 + Math.round(f.x * 2), hy - 5, 2, 2);
        }
        return;
      }

      if (id === "spore_stalker") {
        ctx.fillStyle = cDark;
        ctx.fillRect(p.x - 5, p.y - 5 + Math.round(stride * 2), 3, 6);
        ctx.fillRect(p.x + 2, p.y - 5 - Math.round(stride * 2), 3, 6);
        drawIsoBlock(ctx, p.x, p.y - 3 - bob, 14, 7, 10, cMain, cMain, cDark, "#07090f");
        const capY = p.y - 12 - bob;
        drawIsoBlock(ctx, p.x, capY, 26, 13, 7, cTrim, cMain, cDark, "#07090f");
        ctx.fillStyle = "#fef08a";
        ctx.fillRect(p.x - 5, capY - 7, 2, 2);
        ctx.fillRect(p.x + 3, capY - 6, 2, 2);
        if (f.y > -0.45) {
          ctx.fillStyle = eyeCol;
          ctx.fillRect(p.x - 3 + eyeShiftX, p.y - 10 - bob, 2, 2);
          ctx.fillRect(p.x + 1 + eyeShiftX, p.y - 10 - bob, 2, 2);
        }
        return;
      }

      if (id === "void_wraith" || ai === "chaser") {
        const hover = 5 + Math.round(Math.sin(this.elapsed * 5 + e.x) * 2);
        ctx.fillStyle = cMain;
        ctx.fillRect(p.x - 7, p.y - hover - 2, 3, 5);
        ctx.fillRect(p.x - 1, p.y - hover, 3, 6);
        ctx.fillRect(p.x + 5, p.y - hover - 2, 3, 5);
        drawIsoBlock(ctx, p.x, p.y - hover, 18, 9, 13, cMain, cMain, cDark, "#07090f");
        drawIsoBlock(ctx, p.x, p.y - 13 - hover, 13, 7, 8, cTrim, cMain, cDark, "#07090f");
        ctx.fillStyle = cTrim;
        ctx.fillRect(p.x - 11, p.y - 10 - hover + bob, 3, 3);
        ctx.fillRect(p.x + 8, p.y - 10 - hover - bob, 3, 3);
        if (f.y > -0.45) {
          ctx.fillStyle = "#f0abfc";
          ctx.fillRect(p.x - 3 + eyeShiftX, p.y - 18 - hover, 2, 2);
          ctx.fillRect(p.x + 1 + eyeShiftX, p.y - 18 - hover, 2, 2);
        }
        return;
      }

      // 2. BRUISERS
      if (id === "quarry_golem" || id === "mire_hulk" || id === "slag_brutes" || id === "astral_sentinel" || ai === "bruiser") {
        const isSlag = id === "slag_brutes";
        const isHulk = id === "mire_hulk";
        const isSentinel = id === "astral_sentinel";

        ctx.fillStyle = cDark;
        ctx.fillRect(p.x - 9, p.y - 6 + Math.round(stride * 2), 5, 7);
        ctx.fillRect(p.x + 4, p.y - 6 - Math.round(stride * 2), 5, 7);

        drawIsoBlock(ctx, p.x, p.y - 4 - bob, 28, 14, 18, cTrim, cMain, cDark, "#07090f");

        if (f.y > -0.3) {
          ctx.fillStyle = isSlag ? "#f97316" : isHulk ? "#a3e635" : "#38bdf8";
          ctx.fillRect(p.x - 3 + eyeShiftX, p.y - 14 - bob, 6, 5);
          if (isSlag) {
            ctx.fillStyle = "#07090f";
            ctx.fillRect(p.x - 1 + eyeShiftX, p.y - 14 - bob, 1, 5);
            ctx.fillRect(p.x + 1 + eyeShiftX, p.y - 14 - bob, 1, 5);
          }
        }

        const swing = Math.round(stride * 3);
        if (isSentinel) {
          drawIsoBlock(ctx, p.x - 16, p.y - 8 - bob, 8, 5, 16, "#38bdf8", "#1d4ed8", "#0f172a", "#07090f");
          ctx.fillStyle = "#e879f9";
          ctx.fillRect(p.x + 14, p.y - 24 - bob + swing, 3, 18);
        } else {
          drawIsoBlock(ctx, p.x - 16, p.y - 6 - bob + swing, 10, 5, 10, cTrim, cMain, cDark, "#07090f");
          drawIsoBlock(ctx, p.x + 16, p.y - 6 - bob - swing, 10, 5, 10, cTrim, cMain, cDark, "#07090f");
        }

        drawIsoBlock(ctx, p.x, p.y - 22 - bob, 16, 8, 8, cTrim, cMain, cDark, "#07090f");
        if (isSlag) {
          ctx.fillStyle = "#475569";
          ctx.fillRect(p.x - 11, p.y - 29 - bob, 4, 7);
          ctx.fillRect(p.x + 7, p.y - 29 - bob, 4, 7);
        } else if (isHulk || isSentinel) {
          ctx.fillStyle = cTrim;
          ctx.fillRect(p.x - 8, p.y - 31 - bob, 2, 6);
          ctx.fillRect(p.x + 6, p.y - 31 - bob, 2, 6);
        }

        if (f.y > -0.45) {
          ctx.fillStyle = eyeCol;
          ctx.fillRect(p.x - 4 + eyeShiftX, p.y - 27 - bob, 2, 2);
          ctx.fillRect(p.x + 2 + eyeShiftX, p.y - 27 - bob, 2, 2);
        }
        return;
      }

      // 3. RANGED ARCHETYPES
      const hover = 4 + Math.round(Math.sin(this.elapsed * 4.5 + e.y) * 2);

      if (id === "ember_turret") {
        ctx.strokeStyle = "#07090f";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y - 8);
        ctx.lineTo(p.x - 11, p.y + 2);
        ctx.moveTo(p.x, p.y - 8);
        ctx.lineTo(p.x + 11, p.y + 2);
        ctx.moveTo(p.x, p.y - 8);
        ctx.lineTo(p.x, p.y + 4);
        ctx.stroke();

        drawIsoBlock(ctx, p.x, p.y - 7, 18, 9, 11, cTrim, cMain, cDark, "#07090f");
        const bx = p.x + Math.round(f.x * 11);
        const by = p.y - 13 + Math.round(f.y * 5);
        ctx.strokeStyle = "#07090f";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y - 13);
        ctx.lineTo(bx, by);
        ctx.stroke();
        ctx.strokeStyle = "#fde047";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y - 13);
        ctx.lineTo(bx, by);
        ctx.stroke();
        return;
      }

      if (id === "blight_spitter") {
        drawIsoBlock(ctx, p.x, p.y, 20, 10, 9, cMain, cMain, cDark, "#07090f");
        const pulse = Math.round(Math.sin(this.elapsed * 6) * 2);
        drawIsoBlock(ctx, p.x, p.y - 9, 14 + pulse, 7 + Math.floor(pulse * 0.5), 8, "#bef264", cTrim, cMain, "#07090f");
        if (f.y > -0.45) {
          ctx.fillStyle = "#fef08a";
          ctx.fillRect(p.x - 3 + eyeShiftX, p.y - 6, 2, 2);
          ctx.fillRect(p.x + 1 + eyeShiftX, p.y - 6, 2, 2);
        }
        return;
      }

      drawIsoBlock(ctx, p.x, p.y - hover - 4, 14, 7, 14, "#ffffff", cTrim, cMain, "#07090f");
      const orbA = this.elapsed * 3.5 + e.x;
      const ox1 = p.x + Math.round(Math.cos(orbA) * 14);
      const oy1 = p.y - hover - 10 + Math.round(Math.sin(orbA) * 6);
      const ox2 = p.x + Math.round(Math.cos(orbA + Math.PI) * 14);
      const oy2 = p.y - hover - 10 + Math.round(Math.sin(orbA + Math.PI) * 6);
      ctx.fillStyle = cTrim;
      ctx.fillRect(ox1 - 2, oy1 - 2, 4, 4);
      ctx.fillRect(ox2 - 2, oy2 - 2, 4, 4);
      if (f.y > -0.5) {
        ctx.fillStyle = "#07090f";
        ctx.fillRect(p.x - 3 + eyeShiftX, p.y - hover - 13, 6, 4);
        ctx.fillStyle = "#fef08a";
        ctx.fillRect(p.x - 1 + eyeShiftX, p.y - hover - 12, 3, 2);
      }
    }

    drawBossSprite(ctx, boss, p, f, hurt, stunned) {
      const id = boss.template.id;
      const cMain = hurt ? "#ffffff" : boss.color;
      const cTrim = hurt ? "#fef08a" : boss.trim;
      const cDark = hurt ? "#fca5a5" : "#090c16";
      const eyeShiftX = Math.round(f.x * 5);
      const bob = Math.round(Math.abs(Math.sin(this.elapsed * 6)) * 3);

      // BOSS 1: OBSIDIAN COLOSSUS
      if (id === "obsidian_colossus") {
        ctx.fillStyle = cDark;
        ctx.fillRect(p.x - 14, p.y - 8, 8, 9);
        ctx.fillRect(p.x + 6, p.y - 8, 8, 9);

        drawIsoBlock(ctx, p.x, p.y - 6 - bob, 44, 22, 26, "#334155", cMain, cDark, "#07090f");

        if (f.y > -0.3) {
          ctx.fillStyle = "#38bdf8";
          ctx.fillRect(p.x - 2 + eyeShiftX, p.y - 24 - bob, 4, 12);
          ctx.fillRect(p.x - 5 + eyeShiftX, p.y - 20 - bob, 10, 3);
        }

        drawIsoBlock(ctx, p.x - 24, p.y - 18 - bob, 18, 9, 14, cTrim, "#0284c7", cDark, "#07090f");
        drawIsoBlock(ctx, p.x + 24, p.y - 18 - bob, 18, 9, 14, cTrim, "#0284c7", cDark, "#07090f");

        const fistWave = Math.round(Math.sin(this.elapsed * 5) * 4);
        drawIsoBlock(ctx, p.x - 28, p.y - 4 - bob + fistWave, 14, 7, 12, cTrim, cMain, cDark, "#07090f");
        drawIsoBlock(ctx, p.x + 28, p.y - 4 - bob - fistWave, 14, 7, 12, cTrim, cMain, cDark, "#07090f");

        drawIsoBlock(ctx, p.x, p.y - 32 - bob, 22, 11, 12, cTrim, cMain, cDark, "#07090f");
        drawIsoBlock(ctx, p.x, p.y - 44 - bob, 8, 4, 9, "#e0f2fe", "#38bdf8", "#0284c7", "#07090f");

        if (f.y > -0.45) {
          ctx.fillStyle = stunned ? "#38bdf8" : "#fef08a";
          ctx.fillRect(p.x - 6 + eyeShiftX, p.y - 38 - bob, 4, 3);
          ctx.fillRect(p.x + 2 + eyeShiftX, p.y - 38 - bob, 4, 3);
        }
        return;
      }

      // BOSS 2: IGNIS PRIME
      if (id === "arch_forge_automaton") {
        const haloY = p.y - 28 - bob;
        ctx.strokeStyle = cTrim;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(p.x, haloY, 24, 0, Math.PI * 2);
        ctx.stroke();
        for (let k = 0; k < 8; k++) {
          const a = this.elapsed * 2 + (k * Math.PI) / 4;
          ctx.fillStyle = "#fde047";
          ctx.fillRect(p.x + Math.round(Math.cos(a) * 25) - 2, haloY + Math.round(Math.sin(a) * 25) - 2, 4, 4);
        }

        ctx.fillStyle = "#1e293b";
        ctx.fillRect(p.x - 14, p.y - 8, 9, 9);
        ctx.fillRect(p.x + 5, p.y - 8, 9, 9);

        drawIsoBlock(ctx, p.x, p.y - 6 - bob, 46, 23, 26, cTrim, cMain, cDark, "#07090f");

        if (f.y > -0.3) {
          ctx.fillStyle = "#f97316";
          ctx.fillRect(p.x - 9 + eyeShiftX, p.y - 22 - bob, 18, 10);
          ctx.fillStyle = "#fef08a";
          ctx.fillRect(p.x - 7 + eyeShiftX, p.y - 20 - bob, 14, 6);
          ctx.fillStyle = "#07090f";
          for (let gx = -5; gx <= 5; gx += 4) {
            ctx.fillRect(p.x + gx + eyeShiftX, p.y - 22 - bob, 1, 10);
          }
        }

        drawIsoBlock(ctx, p.x - 18, p.y - 30 - bob, 8, 4, 14, "#94a3b8", "#475569", "#1e293b", "#07090f");
        drawIsoBlock(ctx, p.x + 18, p.y - 30 - bob, 8, 4, 14, "#94a3b8", "#475569", "#1e293b", "#07090f");

        drawIsoBlock(ctx, p.x - 27, p.y - 12 - bob, 14, 7, 14, cTrim, "#9a3412", cDark, "#07090f");
        drawIsoBlock(ctx, p.x + 27, p.y - 12 - bob, 14, 7, 14, cTrim, "#9a3412", cDark, "#07090f");

        drawIsoBlock(ctx, p.x, p.y - 32 - bob, 22, 11, 11, "#fde047", cTrim, cMain, "#07090f");
        if (f.y > -0.45) {
          ctx.fillStyle = "#ef4444";
          ctx.fillRect(p.x - 7 + eyeShiftX, p.y - 38 - bob, 14, 3);
        }
        return;
      }

      // BOSS 3: VESPERA THE ROT-QUEEN
      if (id === "mycelial_matriarch") {
        for (let t = -3; t <= 3; t++) {
          const sway = Math.round(Math.sin(this.elapsed * 5 + t) * 3);
          ctx.fillStyle = t % 2 === 0 ? cMain : "#166534";
          ctx.fillRect(p.x + t * 6 + sway - 2, p.y - 9, 4, 10);
        }

        drawIsoBlock(ctx, p.x, p.y - 6 - bob, 32, 16, 26, cTrim, cMain, cDark, "#07090f");

        drawIsoBlock(ctx, p.x - 20, p.y - 20 - bob, 14, 7, 10, "#bef264", "#22c55e", cDark, "#07090f");
        drawIsoBlock(ctx, p.x + 20, p.y - 20 - bob, 14, 7, 10, "#bef264", "#22c55e", cDark, "#07090f");

        drawIsoBlock(ctx, p.x, p.y - 32 - bob, 56, 28, 10, "#bef264", "#16a34a", "#14532d", "#07090f");
        drawIsoBlock(ctx, p.x, p.y - 42 - bob, 34, 17, 8, "#fef08a", "#4ade80", "#15803d", "#07090f");

        if (f.y > -0.45) {
          ctx.fillStyle = "#fef08a";
          ctx.fillRect(p.x - 7 + eyeShiftX, p.y - 26 - bob, 3, 3);
          ctx.fillRect(p.x + 4 + eyeShiftX, p.y - 26 - bob, 3, 3);
          ctx.fillRect(p.x - 2 + eyeShiftX, p.y - 23 - bob, 4, 2);
        }
        return;
      }

      // BOSS 4: AETHELGARD, STAR-EATER
      const hover = 10 + Math.round(Math.sin(this.elapsed * 4) * 3);
      drawIsoGroundEllipse(ctx, p.x, p.y - hover - 22, 1.55, null, "#e879f9", 2);
      for (let m = 0; m < 4; m++) {
        const a = this.elapsed * 2.8 + (m * Math.PI) / 2;
        const mx = p.x + Math.round(Math.cos(a) * 34);
        const my = p.y - hover - 22 + Math.round(Math.sin(a) * 14);
        ctx.fillStyle = m % 2 === 0 ? "#38bdf8" : "#fde047";
        ctx.fillRect(mx - 3, my - 3, 6, 6);
      }

      const wingFlap = Math.round(Math.sin(this.elapsed * 5) * 4);
      drawIsoBlock(ctx, p.x - 28, p.y - hover - 14 + wingFlap, 14, 7, 22, "#f0abfc", "#9333ea", cDark, "#07090f");
      drawIsoBlock(ctx, p.x + 28, p.y - hover - 14 + wingFlap, 14, 7, 22, "#f0abfc", "#9333ea", cDark, "#07090f");

      drawIsoBlock(ctx, p.x, p.y - hover, 34, 17, 26, cTrim, cMain, cDark, "#07090f");

      drawIsoBlock(ctx, p.x, p.y - hover - 26, 22, 11, 11, "#f5d0fe", "#7e22ce", cDark, "#07090f");
      ctx.fillStyle = "#fde047";
      ctx.fillRect(p.x - 8, p.y - hover - 42, 3, 6);
      ctx.fillRect(p.x - 1, p.y - hover - 45, 3, 9);
      ctx.fillRect(p.x + 6, p.y - hover - 42, 3, 6);

      if (f.y > -0.45) {
        ctx.fillStyle = "#38bdf8";
        ctx.fillRect(p.x - 6 + eyeShiftX, p.y - hover - 32, 3, 3);
        ctx.fillRect(p.x + 3 + eyeShiftX, p.y - hover - 32, 3, 3);
        ctx.fillStyle = "#fde047";
        ctx.fillRect(p.x - 1 + eyeShiftX, p.y - hover - 35, 3, 3);
      }
    }

    drawProjectile(ctx, pr, toS) {
      const p = toS(pr.x, pr.y, 0.45);
      const rOuter = Math.max(3, Math.round(pr.radius * 14));
      const rInner = Math.max(1, Math.round(pr.radius * 6));
      ctx.fillStyle = pr.color;
      ctx.fillRect(p.x - rOuter, p.y - rOuter, rOuter * 2, rOuter * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(p.x - rInner, p.y - rInner, rInner * 2, rInner * 2);
    }

    renderMinimap() {
      const mctx = this.minimapCtx;
      const mw = this.minimapCanvas.width;
      const mh = this.minimapCanvas.height;
      mctx.clearRect(0, 0, mw, mh);

      const sz = this.world.size;
      const scale = Math.min((mw - 12) / sz, (mh - 12) / sz);
      const ox = (mw - sz * scale) * 0.5;
      const oy = (mh - sz * scale) * 0.5;

      for (let y = 0; y < sz; y++) {
        for (let x = 0; x < sz; x++) {
          const cell = this.world.grid[y][x];
          mctx.fillStyle = cell === 0 ? "#18233a" : cell === 2 ? "#475569" : "#0b1120";
          mctx.fillRect(ox + x * scale, oy + y * scale, scale - 0.5, scale - 0.5);
        }
      }

      for (const v of this.world.vents) {
        mctx.fillStyle = "#38bdf8";
        mctx.fillRect(ox + v.x * scale - 2, oy + v.y * scale - 2, 4, 4);
      }

      for (const st of this.world.stations) {
        mctx.fillStyle = st.color;
        mctx.fillRect(ox + st.x * scale - 2.5, oy + st.y * scale - 2.5, 5, 5);
      }

      if (this.world.portal) {
        mctx.fillStyle = "#7dd3fc";
        mctx.fillRect(ox + this.world.portal.x * scale - 3, oy + this.world.portal.y * scale - 3, 6, 6);
      }

      for (const e of this.world.enemies) {
        mctx.fillStyle = e.isBoss ? "#f59e0b" : "#ef4444";
        const s = e.isBoss ? 6 : 4;
        mctx.fillRect(ox + e.x * scale - s * 0.5, oy + e.y * scale - s * 0.5, s, s);
      }

      mctx.fillStyle = "#4ade80";
      mctx.fillRect(ox + this.player.x * scale - 2.5, oy + this.player.y * scale - 2.5, 5, 5);
    }

    /* ======================================================================
       HUD SYNCHRONIZATION
       ====================================================================== */
    syncAllHUD() {
      const wep = GearSystem.getTemplate(this.save.equipped.weapon.templateId);
      const rel = GearSystem.getTemplate(this.save.equipped.relic.templateId);
      const qSk = DATA.SKILLS[wep.skillId] || DATA.SKILLS.iron_cleave;
      const eSk = DATA.SKILLS[rel.skillId] || DATA.SKILLS.sanctuary_aegis;

      document.getElementById("skill-auto-icon").textContent = wep.icon;
      document.getElementById("skill-auto-name").textContent = wep.name.split(" ")[0];
      document.getElementById("skill-q-icon").textContent = qSk.icon;
      document.getElementById("skill-q-name").textContent = qSk.name;
      document.getElementById("skill-e-icon").textContent = eSk.icon;
      document.getElementById("skill-e-name").textContent = eSk.name;

      document.getElementById("mute-icon").textContent = this.sfx.muted ? "🔇" : "🔊";
      this.syncLiveHUD();
    }

    syncLiveHUD() {
      document.getElementById("hud-gold").textContent = fmtNum(this.save.gold);
      document.getElementById("hud-shards").textContent = fmtNum(this.save.shards);
      document.getElementById("hud-renown").textContent = fmtNum(this.save.renown);

      const rates = this.getPassiveRates();
      const gRate = document.getElementById("hud-gold-rate");
      const sRate = document.getElementById("hud-shards-rate");
      if (rates.goldPerSec > 0) {
        gRate.textContent = `+${rates.goldPerSec.toFixed(1)}/s`;
        gRate.classList.remove("hidden");
      } else {
        gRate.classList.add("hidden");
      }
      if (rates.shardsPerSec > 0) {
        sRate.textContent = `+${rates.shardsPerSec.toFixed(2)}/s`;
        sRate.classList.remove("hidden");
      } else {
        sRate.classList.add("hidden");
      }

      const xpNeed = this.getXpNeeded(this.save.level);
      document.getElementById("player-level").textContent = this.save.level;
      document.getElementById("player-power-score").textContent = `PWR ${fmtNum(this.getHeroPowerScore())}`;
      document.getElementById("xp-text").textContent = `${fmtNum(this.save.xp)} / ${fmtNum(xpNeed)} XP`;
      document.getElementById("xp-bar-fill").style.width = `${clamp((this.save.xp / xpNeed) * 100, 0, 100)}%`;

      const hpPct = clamp((this.player.hp / this.player.maxHp) * 100, 0, 100);
      const shPct = clamp((this.player.shield / this.player.maxHp) * 100, 0, 100);
      document.getElementById("hp-bar-fill").style.width = `${hpPct}%`;
      document.getElementById("shield-bar-fill").style.width = `${shPct}%`;
      document.getElementById("hp-text").textContent =
        this.player.shield > 0
          ? `${Math.ceil(this.player.hp)} (+${Math.ceil(this.player.shield)}) / ${this.player.maxHp}`
          : `${Math.ceil(this.player.hp)} / ${this.player.maxHp}`;

      document.getElementById("flask-count").textContent = `${this.save.flasks} Left`;
      const fcd = document.getElementById("flask-cd");
      if (this.player.flaskCd > 0) {
        fcd.classList.remove("hidden");
        fcd.style.transform = `scaleY(${this.player.flaskCd / C.FLASK_COOLDOWN})`;
      } else {
        fcd.classList.add("hidden");
      }

      const stats = this.getHeroStats();
      const wep = GearSystem.getTemplate(this.save.equipped.weapon.templateId);
      const rel = GearSystem.getTemplate(this.save.equipped.relic.templateId);
      const qSk = DATA.SKILLS[wep.skillId] || DATA.SKILLS.iron_cleave;
      const eSk = DATA.SKILLS[rel.skillId] || DATA.SKILLS.sanctuary_aegis;
      this.syncCooldownSlot("skill-q", this.player.qCd, qSk.cooldown * (1 - stats.cdr));
      this.syncCooldownSlot("skill-e", this.player.eCd, eSk.cooldown * (1 - stats.cdr));
      this.syncCooldownSlot("skill-dash", this.player.dashCd, C.DASH_COOLDOWN * (1 - stats.cdr * 0.5));

      if (this.mode === "dungeon" && this.run) {
        const hs = this.run.hazardState;
        const hType = this.run.dungeon.hazard.type;
        document.getElementById("hazard-bar-fill").style.width = `${clamp(hs.value, 0, 100)}%`;
        const statusEl = document.getElementById("hazard-status-text");
        if (hType === "gravity") {
          statusEl.textContent = `${hs.phase === "low" ? "LOW-G" : "HEAVY-G"} ${Math.ceil(hs.phaseTimer)}s`;
        } else {
          statusEl.textContent = `${Math.round(hs.value)}%`;
        }

        const bosses = this.world.enemies.filter((e) => e.isBoss);
        if (bosses.length > 0) {
          const curHp = bosses.reduce((s, b) => s + Math.max(0, b.hp), 0);
          const maxHp = bosses.reduce((s, b) => s + b.maxHp, 0);
          document.getElementById("boss-hp-fill").style.width = `${clamp((curHp / maxHp) * 100, 0, 100)}%`;
          document.getElementById("boss-hp-text").textContent = `${fmtNum(curHp)} / ${fmtNum(maxHp)}`;
        }
      }
    }

    syncCooldownSlot(id, cur, max) {
      const slot = document.getElementById(id);
      const curtain = document.getElementById(id + "-cd");
      const txt = document.getElementById(id + "-cd-text");
      if (cur > 0.05) {
        slot.classList.add("on-cooldown");
        curtain.classList.remove("hidden");
        txt.classList.remove("hidden");
        curtain.style.transform = `scaleY(${clamp(cur / Math.max(0.1, max), 0, 1)})`;
        txt.textContent = cur.toFixed(1);
      } else {
        slot.classList.remove("on-cooldown");
        curtain.classList.add("hidden");
        txt.classList.add("hidden");
      }
    }

    toast(message, type = "info") {
      const container = document.getElementById("toast-container");
      const el = document.createElement("div");
      el.className = "toast" + (type !== "info" ? " toast-" + type : "");
      el.textContent = message;
      container.appendChild(el);
      setTimeout(() => {
        el.style.opacity = "0";
        el.style.transition = "opacity 0.25s ease";
        setTimeout(() => el.remove(), 260);
      }, 3200);
    }

    /* ======================================================================
       MODALS & RPG UI RENDERING
       ====================================================================== */
    openModal(name) {
      this.sfx.uiClick();
      this.hideTooltip();
      this.activeModal = name;
      document.getElementById("modal-backdrop").classList.remove("hidden");

      const ids = ["dungeon", "armory", "forge", "guild", "run-summary", "settings"];
      for (const id of ids) {
        const el = document.getElementById("modal-" + id);
        if (el) el.classList.toggle("hidden", id !== name);
      }

      document.querySelectorAll(".hud-tab").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.tab === name);
      });

      if (name === "dungeon") this.renderDungeonModal();
      if (name === "armory") this.renderArmoryModal();
      if (name === "forge") this.renderForgeModal();
      if (name === "guild") this.renderGuildModal();
      if (name === "settings") this.renderSettingsModal();
    }

    closeAllModals() {
      this.activeModal = null;
      this.hideTooltip();
      document.getElementById("modal-backdrop").classList.add("hidden");
      document.querySelectorAll(".hud-tab").forEach((btn) => btn.classList.remove("active"));
    }

    /* --- 1. DUNGEON GATE MODAL --- */
    renderDungeonModal() {
      const list = document.getElementById("dungeon-list");
      list.innerHTML = "";
      const selId = this.save.selectedDungeonId;

      for (const d of DATA.DUNGEONS) {
        const card = document.createElement("div");
        card.className = "dungeon-card" + (d.id === selId ? " selected" : "");
        const clr = this.save.cleared[d.id] || {};
        card.innerHTML = `
          <div class="dungeon-card-top">
            <span class="dungeon-theme-pill" style="background:${d.themeColor}22;color:${d.themeColor};border:1px solid ${d.themeColor}66">${d.themeLabel}</span>
            <span class="muted-text">${d.rooms} Rooms</span>
          </div>
          <h3>${d.name}</h3>
          <div class="dungeon-hazard-tag">${d.hazard.icon} ${d.hazard.shortDesc}</div>
          <div class="dungeon-clear-badges">
            <span class="clear-pip ${clr.normal ? "cleared" : ""}">Normal</span>
            <span class="clear-pip ${clr.nightmare ? "cleared" : ""}">Nightmare</span>
            <span class="clear-pip ${clr.abyssal ? "cleared" : ""}">Abyssal</span>
          </div>
        `;
        card.addEventListener("click", () => {
          this.save.selectedDungeonId = d.id;
          this.sfx.uiClick();
          this.renderDungeonModal();
        });
        list.appendChild(card);
      }

      const d = DATA.DUNGEONS.find((x) => x.id === selId) || DATA.DUNGEONS[0];
      const diff = DATA.DIFFICULTIES[this.save.selectedDiff] || DATA.DIFFICULTIES.normal;

      document.getElementById("cfg-dungeon-name").textContent = d.name;
      document.getElementById("cfg-dungeon-desc").textContent = d.desc;
      document.getElementById("cfg-hazard-box").innerHTML = `<strong>${d.hazard.icon} Survival Mechanic:</strong> ${d.hazard.shortDesc}`;
      document.getElementById("cfg-loot-preview").innerHTML = d.lootSummary
        .map((l) => `<span class="loot-tag">${l}</span>`)
        .join("");

      document.querySelectorAll(".diff-btn").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.diff === diff.id);
      });

      const recPower = Math.round(d.recommendedPower * diff.powerMult);
      const myPower = this.getHeroPowerScore();
      const powerClass = myPower >= recPower ? "stat-up" : "stat-down";
      document.getElementById("cfg-rec-power").innerHTML =
        `Recommended Power: <strong>${fmtNum(recPower)}</strong> (Your Power: <span class="${powerClass}">${fmtNum(myPower)}</span>)`;

      const mutList = document.getElementById("mutator-list");
      mutList.innerHTML = "";
      let totalMult = diff.lootMult;
      for (const m of DATA.MUTATORS) {
        const active = this.save.selectedMutators.includes(m.id);
        if (active) totalMult += m.rewardBonus;
        const row = document.createElement("div");
        row.className = "mutator-row" + (active ? " active" : "");
        row.innerHTML = `
          <div class="mutator-info">
            <span class="mutator-title">${m.icon} ${m.name}</span>
            <span class="mutator-desc">${m.desc}</span>
          </div>
          <span class="mutator-bonus">+${Math.round(m.rewardBonus * 100)}% Loot</span>
        `;
        row.addEventListener("click", () => {
          const idx = this.save.selectedMutators.indexOf(m.id);
          if (idx >= 0) this.save.selectedMutators.splice(idx, 1);
          else this.save.selectedMutators.push(m.id);
          this.sfx.uiClick();
          this.renderDungeonModal();
        });
        mutList.appendChild(row);
      }

      document.getElementById("total-reward-mult").textContent = `Rewards: ${totalMult.toFixed(2)}x`;
    }

    /* --- 2. ARMORY & INVENTORY MODAL --- */
    renderArmoryModal() {
      for (const slot of ["weapon", "armor", "relic"]) {
        const item = this.save.equipped[slot];
        const container = document.getElementById("slot-" + slot);
        const tpl = GearSystem.getTemplate(item.templateId);
        container.className = `gear-card slot-card rarity-${item.rarity}`;
        container.innerHTML = `
          ${item.level > 0 ? `<span class="gear-level-badge">+${item.level}</span>` : ""}
          <span class="gear-icon">${tpl.icon}</span>
          <span class="gear-name text-${item.rarity}">${tpl.name}</span>
          <span class="gear-power-pill">PWR ${GearSystem.computeItemPower(item)}</span>
        `;
        container.onmouseenter = (ev) => this.showTooltip(item, ev, false);
        container.onmousemove = (ev) => this.moveTooltip(ev);
        container.onmouseleave = () => this.hideTooltip();
      }

      const wep = GearSystem.getTemplate(this.save.equipped.weapon.templateId);
      const rel = GearSystem.getTemplate(this.save.equipped.relic.templateId);
      const qSk = DATA.SKILLS[wep.skillId] || DATA.SKILLS.iron_cleave;
      const eSk = DATA.SKILLS[rel.skillId] || DATA.SKILLS.sanctuary_aegis;
      document.getElementById("equipped-skills-preview").innerHTML = `
        <div class="skill-preview-item">
          <kbd>Q</kbd>
          <div><strong>${qSk.icon} ${qSk.name}</strong> <span class="muted-text">(${qSk.cooldown}s)</span><br/><span class="muted-text">${qSk.desc}</span></div>
        </div>
        <div class="skill-preview-item">
          <kbd>E</kbd>
          <div><strong>${eSk.icon} ${eSk.name}</strong> <span class="muted-text">(${eSk.cooldown}s)</span><br/><span class="muted-text">${eSk.desc}</span></div>
        </div>
      `;

      const st = this.getHeroStats();
      const statKeys = ["hp", "atk", "spell", "armor", "crit", "lifesteal", "cdr", "speed", "hazardResist"];
      document.getElementById("char-stats-grid").innerHTML = statKeys
        .map(
          (k) => `
          <div class="stat-row">
            <span class="stat-row-label">${STAT_LABELS[k]}</span>
            <span class="stat-row-val">${fmtStatVal(k, st[k])}</span>
          </div>
        `
        )
        .join("");

      document.getElementById("inv-count").textContent = `${this.save.inventory.length} / ${C.INVENTORY_CAPACITY}`;
      let items = this.save.inventory.filter((it) => this.invFilter === "all" || it.slot === this.invFilter);
      items.sort((a, b) => {
        if (this.invSort === "rarity") {
          const diff = (DATA.RARITIES[b.rarity]?.order || 1) - (DATA.RARITIES[a.rarity]?.order || 1);
          return diff !== 0 ? diff : GearSystem.computeItemPower(b) - GearSystem.computeItemPower(a);
        }
        if (this.invSort === "level") return b.level - a.level;
        return GearSystem.computeItemPower(b) - GearSystem.computeItemPower(a);
      });

      const grid = document.getElementById("inventory-grid");
      grid.innerHTML = "";
      if (items.length === 0) {
        grid.innerHTML = `<div class="muted-text" style="grid-column:1/-1;padding:18px;text-align:center">No gear in this category. Clear Rift dungeons to collect loot!</div>`;
      } else {
        for (const item of items) {
          const card = this.buildGearCardEl(item, true);
          if (item.uid === this.selectedInvUid) card.classList.add("selected-item");
          card.addEventListener("click", () => {
            this.selectedInvUid = item.uid;
            this.sfx.uiClick();
            this.renderArmoryModal();
          });
          card.addEventListener("dblclick", () => this.equipInventoryItem(item.uid));
          grid.appendChild(card);
        }
      }

      const bar = document.getElementById("selected-item-bar");
      const sel = this.save.inventory.find((x) => x.uid === this.selectedInvUid);
      if (!sel) {
        bar.innerHTML = `<span class="muted-text">Click an item to inspect, equip, sell, or salvage (double-click to quick-equip).</span>`;
      } else {
        const tpl = GearSystem.getTemplate(sel.templateId);
        const sellVal = GearSystem.getSellValue(sel);
        const salvVal = GearSystem.getSalvageValue(sel);
        bar.innerHTML = `
          <div>
            <strong class="text-${sel.rarity}">${tpl.name} ${sel.level > 0 ? "+" + sel.level : ""}</strong>
            <span class="muted-text">(${(DATA.RARITIES[sel.rarity] || DATA.RARITIES.common).name} ${sel.slot})</span>
          </div>
          <div style="display:flex;gap:6px;flex-wrap:wrap">
            <button id="act-equip" class="btn btn-primary btn-sm">Equip</button>
            <button id="act-lock" class="btn btn-secondary btn-sm">${sel.locked ? "Unlock" : "Lock"}</button>
            <button id="act-sell" class="btn btn-secondary btn-sm" ${sel.locked ? "disabled" : ""}>Sell (+${sellVal}g)</button>
            <button id="act-salvage" class="btn btn-accent btn-sm" ${sel.locked ? "disabled" : ""}>Salvage (+${salvVal} Shards)</button>
          </div>
        `;
        document.getElementById("act-equip").onclick = () => this.equipInventoryItem(sel.uid);
        document.getElementById("act-lock").onclick = () => {
          sel.locked = !sel.locked;
          this.renderArmoryModal();
        };
        document.getElementById("act-sell").onclick = () => this.sellInventoryItem(sel.uid);
        document.getElementById("act-salvage").onclick = () => this.salvageInventoryItem(sel.uid);
      }
    }

    buildGearCardEl(item, compareEquipped) {
      const tpl = GearSystem.getTemplate(item.templateId);
      const card = document.createElement("div");
      card.className = `gear-card rarity-${item.rarity}`;
      card.innerHTML = `
        ${item.locked ? `<span class="gear-lock-badge">🔒</span>` : ""}
        ${item.level > 0 ? `<span class="gear-level-badge">+${item.level}</span>` : ""}
        <span class="gear-icon">${tpl.icon}</span>
        <span class="gear-name text-${item.rarity}">${tpl.name}</span>
        <span class="gear-power-pill">PWR ${GearSystem.computeItemPower(item)}</span>
      `;
      card.onmouseenter = (ev) => this.showTooltip(item, ev, compareEquipped);
      card.onmousemove = (ev) => this.moveTooltip(ev);
      card.onmouseleave = () => this.hideTooltip();
      return card;
    }

    equipInventoryItem(uidVal) {
      const idx = this.save.inventory.findIndex((x) => x.uid === uidVal);
      if (idx < 0) return;
      const item = this.save.inventory[idx];
      const prev = this.save.equipped[item.slot];
      this.save.equipped[item.slot] = item;
      this.save.inventory.splice(idx, 1);
      if (prev) this.save.inventory.push(prev);
      this.selectedInvUid = null;

      const stats = this.getHeroStats();
      this.player.maxHp = stats.hp;
      if (this.mode === "hub") this.player.hp = stats.hp;

      this.sfx.upgrade();
      this.syncAllHUD();
      this.renderArmoryModal();
      this.saveGame(false);
    }

    equipBestGear() {
      const oldPower = this.getHeroPowerScore();
      let changedCount = 0;

      for (const slot of ["weapon", "armor", "relic"]) {
        const current = this.save.equipped[slot];
        let bestItem = current;
        let bestPower = current ? GearSystem.computeItemPower(current) : -1;

        for (const candidate of this.save.inventory) {
          if (candidate.slot !== slot) continue;
          const pwr = GearSystem.computeItemPower(candidate);
          if (pwr > bestPower) {
            bestPower = pwr;
            bestItem = candidate;
          }
        }

        if (bestItem && bestItem !== current) {
          const invIdx = this.save.inventory.indexOf(bestItem);
          if (invIdx >= 0) {
            this.save.inventory.splice(invIdx, 1);
            if (current) this.save.inventory.push(current);
            this.save.equipped[slot] = bestItem;
            changedCount++;
          }
        }
      }

      if (changedCount === 0) {
        this.sfx.uiClick();
        this.toast("Already wearing your highest-power gear!", "info");
        return;
      }

      const stats = this.getHeroStats();
      this.player.maxHp = stats.hp;
      if (this.mode === "hub") this.player.hp = stats.hp;

      const newPower = this.getHeroPowerScore();
      const delta = newPower - oldPower;
      this.selectedInvUid = null;
      this.sfx.upgrade();
      this.syncAllHUD();
      this.renderArmoryModal();
      this.saveGame(false);
      this.toast(
        `Equipped ${changedCount} upgrade${changedCount > 1 ? "s" : ""}! (+${fmtNum(delta)} PWR)`,
        "success"
      );
    }

    sellInventoryItem(uidVal) {
      const idx = this.save.inventory.findIndex((x) => x.uid === uidVal);
      if (idx < 0 || this.save.inventory[idx].locked) return;
      const val = GearSystem.getSellValue(this.save.inventory[idx]);
      this.save.inventory.splice(idx, 1);
      this.save.gold += val;
      this.selectedInvUid = null;
      this.sfx.uiClick();
      this.syncLiveHUD();
      this.renderArmoryModal();
    }

    salvageInventoryItem(uidVal) {
      const idx = this.save.inventory.findIndex((x) => x.uid === uidVal);
      if (idx < 0 || this.save.inventory[idx].locked) return;
      const val = GearSystem.getSalvageValue(this.save.inventory[idx]);
      this.save.inventory.splice(idx, 1);
      this.save.shards += val;
      this.selectedInvUid = null;
      this.sfx.uiClick();
      this.syncLiveHUD();
      this.renderArmoryModal();
    }

    bulkDispose(mode) {
      let count = 0;
      let total = 0;
      const keep = [];
      for (const item of this.save.inventory) {
        if (!item.locked && (item.rarity === "common" || item.rarity === "rare")) {
          count++;
          total += mode === "sell" ? GearSystem.getSellValue(item) : GearSystem.getSalvageValue(item);
        } else {
          keep.push(item);
        }
      }
      if (count === 0) {
        this.toast("No unlocked Common or Rare items to dispose.", "info");
        return;
      }
      this.save.inventory = keep;
      if (mode === "sell") {
        this.save.gold += total;
        this.toast(`Sold ${count} items for +${fmtNum(total)} Gold.`, "success");
      } else {
        this.save.shards += total;
        this.toast(`Salvaged ${count} items into +${fmtNum(total)} Rift Shards.`, "success");
      }
      this.selectedInvUid = null;
      this.sfx.upgrade();
      this.syncLiveHUD();
      this.renderArmoryModal();
      this.saveGame(false);
    }

    /* --- 3. BLACKSMITH FORGE MODAL --- */
    renderForgeModal() {
      document.querySelectorAll(".forge-slot-btn").forEach((b) => {
        b.classList.toggle("active", b.dataset.forgeSlot === this.forgeSlot);
      });

      const item = this.save.equipped[this.forgeSlot];
      const tpl = GearSystem.getTemplate(item.templateId);
      const curStats = GearSystem.computeItemStats(item);
      const nextStats = GearSystem.computeItemStats(item, Math.min(C.MAX_UPGRADE_LEVEL, item.level + 1));

      const card = document.getElementById("forge-selected-card");
      card.className = `forge-preview-card rarity-${item.rarity}`;
      card.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div>
            <div class="text-${item.rarity}" style="font-size:15px;font-weight:900">${tpl.icon} ${tpl.name} ${item.level > 0 ? "+" + item.level : ""}</div>
            <div class="muted-text">${(DATA.RARITIES[item.rarity] || DATA.RARITIES.common).name} ${tpl.setTag} ${tpl.slot}</div>
          </div>
          <div class="power-score">PWR ${GearSystem.computeItemPower(item)}</div>
        </div>
      `;

      const upCost = GearSystem.getUpgradeCost(item);
      const isMax = item.level >= C.MAX_UPGRADE_LEVEL;
      document.getElementById("forge-upgrade-cost").textContent = isMax ? "MAX LEVEL" : `${fmtNum(upCost)} Gold`;

      const deltaEl = document.getElementById("forge-upgrade-delta");
      if (isMax) {
        deltaEl.innerHTML = `<span class="stat-up">Equipment reached maximum +${C.MAX_UPGRADE_LEVEL} temper!</span>`;
      } else {
        deltaEl.innerHTML = Object.keys(tpl.baseStats)
          .map((k) => `<span>${STAT_LABELS[k]}: ${fmtStatVal(k, curStats[k])} &rarr; <span class="stat-up">${fmtStatVal(k, nextStats[k])}</span></span>`)
          .join("");
      }

      document.getElementById("btn-forge-upgrade").disabled = isMax || this.save.gold < upCost;

      const rrCost = GearSystem.getRerollCost(item);
      document.getElementById("forge-reroll-cost").textContent = `${fmtNum(rrCost)} Shards`;
      document.getElementById("forge-substats-list").innerHTML = (item.substats || [])
        .map((s) => `<div class="substat-pill">&#10022; +${fmtStatVal(s.key, s.value)} ${STAT_LABELS[s.key]}</div>`)
        .join("");
      document.getElementById("btn-forge-reroll").disabled = this.save.shards < rrCost;

      document.getElementById("forge-flask-owned").textContent = `Owned: ${this.save.flasks} / ${C.MAX_FLASKS}`;
      document.getElementById("forge-flask-cost").textContent = C.FLASK_COST_GOLD;
      document.getElementById("btn-buy-flask").disabled =
        this.save.flasks >= C.MAX_FLASKS || this.save.gold < C.FLASK_COST_GOLD;

      const craftList = document.getElementById("craft-gear-list");
      craftList.innerHTML = "";
      for (const tplDef of Object.values(DATA.GEAR_TEMPLATES)) {
        if (!tplDef.craftCost) continue;
        const row = document.createElement("div");
        row.className = "craft-row";
        const canAfford = this.save.shards >= tplDef.craftCost && this.save.inventory.length < C.INVENTORY_CAPACITY;
        row.innerHTML = `
          <div class="craft-row-info">
            <h5>${tplDef.icon} ${tplDef.name} <span class="muted-text">(${tplDef.setTag})</span></h5>
            <p>${tplDef.desc}</p>
          </div>
          <button class="btn btn-accent btn-sm" ${canAfford ? "" : "disabled"}>Craft (${tplDef.craftCost} Shards)</button>
        `;
        row.querySelector("button").onclick = () => {
          if (this.save.shards < tplDef.craftCost || this.save.inventory.length >= C.INVENTORY_CAPACITY) return;
          this.save.shards -= tplDef.craftCost;
          const rar = GearSystem.rollRarity(0.35, "common");
          const crafted = GearSystem.createItem(tplDef.id, rar, 0);
          this.save.inventory.push(crafted);
          this.sfx.loot(rar);
          this.toast(`Crafted ${DATA.RARITIES[rar].name} ${tplDef.name}!`, rar === "mythic" ? "mythic" : "loot");
          this.syncLiveHUD();
          this.renderForgeModal();
          this.saveGame(false);
        };
        craftList.appendChild(row);
      }
    }

    /* --- 4. MERCENARY GUILD MODAL --- */
    renderGuildModal() {
      const rates = this.getPassiveRates();
      document.getElementById("guild-passive-gold").textContent = `${rates.goldPerSec.toFixed(1)} / sec`;
      document.getElementById("guild-passive-shards").textContent = `${rates.shardsPerSec.toFixed(2)} / sec`;
      document.getElementById("guild-renown-val").textContent = fmtNum(this.save.renown);

      const mList = document.getElementById("mercenary-list");
      mList.innerHTML = "";
      const currencyMult = 1 + this.getBlessingBonus("currencyPct");

      for (const m of DATA.MERCENARIES) {
        const unlocked = this.isDungeonCleared(m.dungeonId);
        const lvl = this.save.mercenaries[m.id] || 0;
        const dung = DATA.DUNGEONS.find((d) => d.id === m.dungeonId);
        const card = document.createElement("div");
        card.className = "merc-card" + (!unlocked ? " locked" : lvl > 0 ? " active-dispatch" : "");

        if (!unlocked) {
          card.innerHTML = `
            <div class="merc-info">
              <h4>${m.icon} ${m.name}</h4>
              <div class="merc-meta">Defeat the boss of <strong>${dung.name}</strong> to unlock this squad.</div>
            </div>
            <button class="btn btn-secondary btn-sm" disabled>Locked</button>
          `;
        } else if (lvl === 0) {
          const canHire = this.save.renown >= m.hireCostRenown;
          card.innerHTML = `
            <div class="merc-info">
              <h4>${m.icon} ${m.name}</h4>
              <div class="merc-meta">${m.role}</div>
              <div class="merc-yield">Yields +${(m.goldPerSecBase * currencyMult).toFixed(1)} Gold/s &amp; +${(m.shardsPerSecBase * currencyMult).toFixed(2)} Shards/s</div>
            </div>
            <button class="btn btn-primary btn-sm" ${canHire ? "" : "disabled"}>Hire (${m.hireCostRenown} Renown)</button>
          `;
          card.querySelector("button").onclick = () => {
            if (this.save.renown < m.hireCostRenown) return;
            this.save.renown -= m.hireCostRenown;
            this.save.mercenaries[m.id] = 1;
            this.sfx.upgrade();
            this.toast(`${m.name} dispatched to ${dung.name}!`, "success");
            this.syncLiveHUD();
            this.renderGuildModal();
            this.saveGame(false);
          };
        } else {
          const mult = Math.pow(1.28, lvl - 1) * lvl;
          const upCost = Math.round(m.upgradeGoldBase * Math.pow(m.upgradeGoldGrowth, lvl - 1));
          const canUp = this.save.gold >= upCost;
          card.innerHTML = `
            <div class="merc-info">
              <h4>${m.icon} ${m.name} <span class="gold-text">Lv.${lvl}</span></h4>
              <div class="merc-meta">${m.role} (Active)</div>
              <div class="merc-yield">+${(m.goldPerSecBase * mult * currencyMult).toFixed(1)} Gold/s &bull; +${(m.shardsPerSecBase * mult * currencyMult).toFixed(2)} Shards/s</div>
            </div>
            <button class="btn btn-secondary btn-sm" ${canUp ? "" : "disabled"}>Train (${fmtNum(upCost)}g)</button>
          `;
          card.querySelector("button").onclick = () => {
            if (this.save.gold < upCost) return;
            this.save.gold -= upCost;
            this.save.mercenaries[m.id] = lvl + 1;
            this.sfx.upgrade();
            this.syncLiveHUD();
            this.renderGuildModal();
            this.saveGame(false);
          };
        }
        mList.appendChild(card);
      }

      const bList = document.getElementById("blessing-list");
      bList.innerHTML = "";
      for (const b of DATA.BLESSINGS) {
        const rank = this.save.blessings[b.id] || 0;
        const isMax = rank >= b.maxRank;
        const cost = b.baseCost + rank * b.costStep;
        const card = document.createElement("div");
        card.className = "blessing-card";
        card.innerHTML = `
          <div class="blessing-info">
            <h4>${b.name} <span class="renown-text">${rank} / ${b.maxRank}</span></h4>
            <div class="blessing-desc">${b.desc}</div>
          </div>
          <button class="btn btn-accent btn-sm" ${isMax || this.save.renown < cost ? "disabled" : ""}>
            ${isMax ? "MAX" : `Bless (${cost} Renown)`}
          </button>
        `;
        card.querySelector("button").onclick = () => {
          if (isMax || this.save.renown < cost) return;
          this.save.renown -= cost;
          this.save.blessings[b.id] = rank + 1;
          this.sfx.levelUp();
          this.syncLiveHUD();
          this.renderGuildModal();
          this.saveGame(false);
        };
        bList.appendChild(card);
      }
    }

    /* --- 5. SETTINGS MODAL --- */
    renderSettingsModal() {
      document.getElementById("setting-volume").value = this.save.settings.volume;
      document.getElementById("setting-mute").checked = this.save.settings.muted;
      document.getElementById("setting-dmg-nums").checked = this.save.settings.showDmgNums;
      document.getElementById("setting-shake").checked = this.save.settings.screenShake;
    }

    /* --- FLOATING GEAR COMPARISON TOOLTIP --- */
    showTooltip(item, ev, compareEquipped) {
      const tip = document.getElementById("item-tooltip");
      const eq = compareEquipped ? this.save.equipped[item.slot] : null;
      const showCompare = eq && eq.uid !== item.uid;

      tip.innerHTML =
        this.buildTooltipCardHTML(item, showCompare ? "HOVERED GEAR" : "EQUIPPED GEAR", showCompare ? eq : null) +
        (showCompare ? this.buildTooltipCardHTML(eq, "CURRENTLY EQUIPPED", null) : "");

      tip.classList.remove("hidden");
      this.moveTooltip(ev);
    }

    buildTooltipCardHTML(item, labelTag, compareAgainst) {
      const tpl = GearSystem.getTemplate(item.templateId);
      const stats = GearSystem.computeItemStats(item);
      const cmpStats = compareAgainst ? GearSystem.computeItemStats(compareAgainst) : null;
      const allKeys = new Set([...Object.keys(stats), ...(cmpStats ? Object.keys(cmpStats) : [])]);

      let statsHTML = "";
      for (const k of allKeys) {
        const val = stats[k] || 0;
        let deltaHTML = "";
        if (cmpStats) {
          const diff = val - (cmpStats[k] || 0);
          if (Math.abs(diff) > 0.0005) {
            const cls = diff > 0 ? "stat-up" : "stat-down";
            const sign = diff > 0 ? "+" : "-";
            deltaHTML = ` <span class="${cls}">(${sign}${fmtStatVal(k, Math.abs(diff))})</span>`;
          }
        }
        if (val > 0 || deltaHTML) {
          statsHTML += `
            <div class="tooltip-stat">
              <span>${STAT_LABELS[k] || k}</span>
              <span>${fmtStatVal(k, val)}${deltaHTML}</span>
            </div>
          `;
        }
      }

      const subHTML = (item.substats || [])
        .map((s) => `<div class="tooltip-substat">&#10022; +${fmtStatVal(s.key, s.value)} ${STAT_LABELS[s.key]}</div>`)
        .join("");

      let skillHTML = "";
      if (tpl.skillId && DATA.SKILLS[tpl.skillId]) {
        const sk = DATA.SKILLS[tpl.skillId];
        skillHTML = `<div class="tooltip-divider"></div><div class="tooltip-skill"><strong>${tpl.slot === "weapon" ? "[Q]" : "[E]"} ${sk.name}:</strong> ${sk.desc}</div>`;
      }

      return `
        <div class="tooltip-card rarity-${item.rarity}">
          <div class="tooltip-tag">${labelTag}</div>
          <div class="tooltip-title text-${item.rarity}">${tpl.icon} ${tpl.name} ${item.level > 0 ? "+" + item.level : ""}</div>
          <div class="tooltip-type">${(DATA.RARITIES[item.rarity] || DATA.RARITIES.common).name} ${tpl.setTag} ${tpl.slot} &bull; PWR ${GearSystem.computeItemPower(item)}</div>
          <div class="tooltip-divider"></div>
          ${statsHTML}
          ${subHTML ? `<div class="tooltip-divider"></div>${subHTML}` : ""}
          ${skillHTML}
        </div>
      `;
    }

    moveTooltip(ev) {
      const tip = document.getElementById("item-tooltip");
      if (tip.classList.contains("hidden")) return;
      const rect = tip.getBoundingClientRect();
      let left = ev.clientX + 16;
      let top = ev.clientY + 14;
      if (left + rect.width > window.innerWidth - 10) left = ev.clientX - rect.width - 16;
      if (top + rect.height > window.innerHeight - 10) top = window.innerHeight - rect.height - 10;
      tip.style.left = Math.max(8, left) + "px";
      tip.style.top = Math.max(8, top) + "px";
    }

    hideTooltip() {
      document.getElementById("item-tooltip").classList.add("hidden");
    }

    /* ======================================================================
       DOM & INPUT EVENT BINDINGS
       ====================================================================== */
    bindDOM() {
      window.addEventListener("keydown", (e) => {
        if (document.activeElement && document.activeElement.tagName === "TEXTAREA") return;

        this.keys.add(e.code);

        if (e.code === "Escape") {
          if (this.activeModal && this.activeModal !== "run-summary") this.closeAllModals();
          else if (!this.activeModal) this.openModal("settings");
          return;
        }
        if (e.code === "KeyM") {
          this.toggleMute();
          return;
        }

        if (this.activeModal) return;

        if (e.code === "Space") {
          e.preventDefault();
          this.triggerDash();
        } else if (e.code === "KeyQ") {
          this.castSkillQ();
        } else if (e.code === "KeyE") {
          this.castSkillE();
        } else if (e.code === "KeyR") {
          this.useFlask();
        } else if (e.code === "KeyF" && this.mode === "hub" && this.nearbyStation) {
          this.openModal(this.nearbyStation.id);
        } else if (this.mode === "hub") {
          if (e.code === "Digit1") this.openModal("dungeon");
          if (e.code === "Digit2") this.openModal("armory");
          if (e.code === "Digit3") this.openModal("forge");
          if (e.code === "Digit4") this.openModal("guild");
        }
      });

      window.addEventListener("keyup", (e) => this.keys.delete(e.code));
      window.addEventListener("blur", () => this.keys.clear());

      document.querySelectorAll(".hud-tab").forEach((btn) => {
        btn.addEventListener("click", () => {
          if (this.mode === "hub") this.openModal(btn.dataset.tab);
        });
      });

      document.getElementById("btn-retreat")?.addEventListener("click", () => {
        this.sfx.uiClick();
        this.enterSanctuary();
        this.toast("Retreated safely to Sanctuary.", "info");
      });

      document.getElementById("skill-q")?.addEventListener("click", () => this.castSkillQ());
      document.getElementById("skill-e")?.addEventListener("click", () => this.castSkillE());
      document.getElementById("skill-dash")?.addEventListener("click", () => this.triggerDash());
      document.getElementById("btn-flask")?.addEventListener("click", () => this.useFlask());

      document.getElementById("btn-mute")?.addEventListener("click", () => this.toggleMute());
      document.getElementById("btn-settings")?.addEventListener("click", () => this.openModal("settings"));

      document.querySelectorAll("[data-close-modal]").forEach((btn) => {
        btn.addEventListener("click", () => this.closeAllModals());
      });
      document.getElementById("modal-backdrop")?.addEventListener("click", (e) => {
        if (e.target.id === "modal-backdrop" && this.activeModal !== "run-summary") {
          this.closeAllModals();
        }
      });

      document.querySelectorAll(".diff-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          this.save.selectedDiff = btn.dataset.diff;
          this.sfx.uiClick();
          this.renderDungeonModal();
        });
      });
      document.getElementById("btn-enter-dungeon")?.addEventListener("click", () => {
        this.startDungeon(this.save.selectedDungeonId, this.save.selectedDiff, this.save.selectedMutators);
      });

      document.querySelectorAll(".filter-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          this.invFilter = btn.dataset.filter;
          document.querySelectorAll(".filter-btn").forEach((b) => b.classList.toggle("active", b === btn));
          this.renderArmoryModal();
        });
      });
      document.getElementById("inv-sort")?.addEventListener("change", (e) => {
        this.invSort = e.target.value;
        this.renderArmoryModal();
      });
      document.getElementById("btn-equip-best")?.addEventListener("click", () => this.equipBestGear());
      document.getElementById("btn-bulk-sell")?.addEventListener("click", () => this.bulkDispose("sell"));
      document.getElementById("btn-bulk-salvage")?.addEventListener("click", () => this.bulkDispose("salvage"));

      document.querySelectorAll(".forge-slot-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          this.forgeSlot = btn.dataset.forgeSlot;
          this.sfx.uiClick();
          this.renderForgeModal();
        });
      });

      document.getElementById("btn-forge-upgrade")?.addEventListener("click", () => {
        const item = this.save.equipped[this.forgeSlot];
        const cost = GearSystem.getUpgradeCost(item);
        if (item.level >= C.MAX_UPGRADE_LEVEL || this.save.gold < cost) return;
        this.save.gold -= cost;
        item.level += 1;
        this.sfx.upgrade();
        this.syncAllHUD();
        this.renderForgeModal();
        this.saveGame(false);
      });

      document.getElementById("btn-forge-reroll")?.addEventListener("click", () => {
        const item = this.save.equipped[this.forgeSlot];
        const cost = GearSystem.getRerollCost(item);
        if (this.save.shards < cost) return;
        this.save.shards -= cost;
        const tpl = GearSystem.getTemplate(item.templateId);
        item.substats = GearSystem.rollSubstats(item.rarity, GearSystem.getDungeonTierIndex(tpl.dungeonId));
        this.sfx.upgrade();
        this.syncAllHUD();
        this.renderForgeModal();
        this.saveGame(false);
      });

      document.getElementById("btn-buy-flask")?.addEventListener("click", () => {
        if (this.save.flasks >= C.MAX_FLASKS || this.save.gold < C.FLASK_COST_GOLD) return;
        this.save.gold -= C.FLASK_COST_GOLD;
        this.save.flasks += 1;
        this.sfx.flask();
        this.syncLiveHUD();
        this.renderForgeModal();
      });

      document.getElementById("btn-summary-hub")?.addEventListener("click", () => {
        this.closeAllModals();
        this.enterSanctuary();
      });
      document.getElementById("btn-summary-retry")?.addEventListener("click", () => {
        const dId = this.run.dungeon.id;
        const diffId = this.run.diff.id;
        const muts = [...this.run.mutators];
        this.startDungeon(dId, diffId, muts);
      });

      document.getElementById("setting-volume")?.addEventListener("input", (e) => {
        this.save.settings.volume = Number(e.target.value);
        this.sfx.volume = this.save.settings.volume / 100;
      });
      document.getElementById("setting-mute")?.addEventListener("change", (e) => {
        this.save.settings.muted = e.target.checked;
        this.sfx.muted = e.target.checked;
        this.syncAllHUD();
      });
      document.getElementById("setting-dmg-nums")?.addEventListener("change", (e) => {
        this.save.settings.showDmgNums = e.target.checked;
      });
      document.getElementById("setting-shake")?.addEventListener("change", (e) => {
        this.save.settings.screenShake = e.target.checked;
      });

      document.getElementById("btn-save-now")?.addEventListener("click", () => this.saveGame(true));

      document.getElementById("btn-export-save")?.addEventListener("click", () => {
        const json = JSON.stringify(this.save);
        const area = document.getElementById("import-save-text");
        if (area) area.value = json;
        if (navigator.clipboard) {
          navigator.clipboard.writeText(json).catch(() => {});
        }
        this.toast("Save JSON copied & placed in text box!", "success");
      });

      document.getElementById("btn-import-save")?.addEventListener("click", () => {
        const raw = (document.getElementById("import-save-text")?.value || "").trim();
        if (!raw) return;
        try {
          const parsed = JSON.parse(raw);
          if (!parsed.equipped || !parsed.equipped.weapon) throw new Error("Invalid format");
          this.save = { ...this.createDefaultSave(), ...parsed };
          this.saveGame(false);
          this.closeAllModals();
          this.enterSanctuary();
          this.toast("Save chronicle imported successfully!", "success");
        } catch (err) {
          this.toast("Invalid Save JSON. Please check your pasted data.", "danger");
        }
      });

      document.getElementById("btn-reset-save")?.addEventListener("click", () => {
        if (!window.confirm("Erase all Riftfall progress, gear, and mercenaries?")) return;
        localStorage.removeItem(DATA.SAVE_KEY);
        this.save = this.createDefaultSave();
        this.closeAllModals();
        this.enterSanctuary();
        this.toast("Progress reset to a fresh Hero.", "info");
      });
    }

    toggleMute() {
      this.save.settings.muted = !this.save.settings.muted;
      this.sfx.muted = this.save.settings.muted;
      this.syncAllHUD();
    }
  }

  /* ========================================================================
     BOOTSTRAP
     ======================================================================== */
  window.addEventListener("DOMContentLoaded", () => {
    window.riftfall = new RiftfallGame();
  });
})();