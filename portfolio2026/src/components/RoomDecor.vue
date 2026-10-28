<script setup>
import { computed } from "vue";

// Andreina izba okolo vecí, na ktorých sú sekcie – rozmery v px sveta (≈ 1 px = 0,6 mm),
// polohy prichádzajú z rozloženia v Home
const props = defineProps({
  anchors: { type: Object, required: true },
  floorY: { type: Number, required: true }
});

const px = (v) => `${Math.round(v)}px`;
const box = (x, y, w, h) => ({ left: px(x), top: px(y), width: px(w), height: px(h) });

// púčiky levandule: [x, y, natočenie] pozdĺž vrchnej časti stoniek
const buds = [
  [48, 70, -28], [52, 88, -26], [56, 106, -24], [60, 124, -22],
  [90, 40, -6], [91, 58, -6], [92, 76, -5], [93, 94, -4], [94, 112, -4],
  [128, 30, 6], [127, 48, 6], [126, 66, 5], [125, 84, 5], [124, 102, 4],
  [166, 76, 26], [162, 94, 24], [158, 112, 22], [154, 130, 20],
  [72, 120, -16], [74, 138, -15], [76, 156, -14],
  [146, 116, 16], [143, 134, 15], [140, 152, 14]
];

const items = computed(() => {
  const a = props.anchors;
  if (!a.desk) return null;

  const floor = props.floorY;
  const deskTop = floor - 1250;
  const { x: deskX, w: deskW } = a.desk;
  const { x: bedX, w: bedW } = a.bed;
  const windowW = 1800;
  const windowX = deskX + (deskW - windowW) / 2;

  return {
    lantern: box(a.lantern.x - 420, 0, 840, a.lantern.bottom),
    window: box(windowX, 650, windowW, deskTop - 300 - 650),
    curtains: box(windowX - 260, 520, windowW + 520, floor - 520),
    desk: box(deskX, deskTop, deskW, 1250),
    ringLamp: box(deskX + 170, deskTop - 620, 280, 620),
    tumbler: box(deskX + deskW - 260, deskTop - 480, 160, 480),
    chair: box(a.chair.x - 450, floor - 1380, 900, 1380),
    bed: box(bedX, floor - 1100, bedW, 1100),
    nightstand: box(a.nightstand.x, floor - 1000, 650, 1000),
    tableLamp: box(a.nightstand.x + 170, floor - 2000, 420, 1000),
    lavender: box(a.nightstand.x + 50, floor - 1000 - 470, 210, 480),
    radiator: box(a.radiator.x, floor - 900, 1200, 680),
    // mäkké tiene nábytku na podlahe
    shadows: [
      [a.nightstand.x - 30, 710],
      [bedX - 40, bedW + 80],
      [deskX - 40, deskW + 80],
      [a.chair.x - 470, 940],
      [a.shelf.x - 40, a.shelf.w + 80]
    ].map(([x, w]) => box(x, floor - 50, w, 110))
  };
});
</script>

<template>
  <div v-if="items" class="room-decor" aria-hidden="true">
    <span v-for="(shadow, i) in items.shadows" :key="i" class="floor-shadow" :style="shadow"></span>

    <!-- okno za stolom: večerná obloha medzi pootvorenými pruhovanými závesmi -->
    <div class="window" :style="items.window">
      <span class="window-sky"></span>
      <span class="window-moon"></span>
      <span class="window-cross"></span>
      <span class="window-sill"></span>
    </div>
    <div class="curtains" :style="items.curtains">
      <span class="curtain-rod"></span>
      <span class="curtain curtain-left"></span>
      <span class="curtain curtain-right"></span>
    </div>

    <!-- papierový lampión zo stropu -->
    <div class="lantern" :style="items.lantern">
      <span class="lantern-cord"></span>
      <span class="lantern-ball"></span>
    </div>

    <!-- radiátor pod fotkami -->
    <div class="radiator" :style="items.radiator"></div>

    <!-- biely stôl s kruhovou lampičkou a termohrnčekom (notebook a monitor sú sekcie) -->
    <!-- biela kruhová LED lampička na ohybnom ramene -->
    <svg class="ring-lamp" :style="items.ringLamp" viewBox="0 0 280 620">
      <defs>
        <radialGradient id="ring-glow">
          <stop offset="0.45" stop-color="rgb(215, 232, 255)" stop-opacity="0.65" />
          <stop offset="1" stop-color="rgb(215, 232, 255)" stop-opacity="0" />
        </radialGradient>
        <linearGradient id="ring-white" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#ffffff" />
          <stop offset="1" stop-color="#dcdcd8" />
        </linearGradient>
      </defs>
      <circle cx="140" cy="130" r="160" fill="url(#ring-glow)" />
      <path d="M140 566 C 138 470, 104 390, 128 318 C 140 280, 146 250, 140 230" fill="none" stroke="#f3f3f1" stroke-width="18" stroke-linecap="round" />
      <path d="M140 566 C 138 470, 104 390, 128 318 C 140 280, 146 250, 140 230" fill="none" stroke="#d8d8d4" stroke-width="18" stroke-dasharray="2 12" />
      <circle cx="140" cy="130" r="98" fill="none" stroke="url(#ring-white)" stroke-width="36" />
      <circle cx="140" cy="130" r="98" fill="none" stroke="#e8f1ff" stroke-width="18" />
      <circle cx="140" cy="130" r="98" fill="none" stroke="#ffffff" stroke-width="5" />
      <path d="M58 620 Q 60 556 140 552 Q 220 556 222 620 Z" fill="url(#ring-white)" />
      <ellipse cx="140" cy="556" rx="30" ry="8" fill="#cfcfcb" />
    </svg>
    <div class="tumbler" :style="items.tumbler">
      <span class="tumbler-straw"></span>
      <span class="tumbler-cup"></span>
    </div>
    <div class="desk" :style="items.desk">
      <span class="desk-top"></span>
      <span class="desk-leg desk-leg-back desk-leg-1"></span>
      <span class="desk-leg desk-leg-back desk-leg-2"></span>
      <span class="desk-leg desk-leg-3"></span>
      <span class="desk-leg desk-leg-4"></span>
    </div>

    <!-- sivá zamatová stolička -->
    <div class="chair" :style="items.chair">
      <span class="chair-back"></span>
      <span class="chair-arm chair-arm-left"></span>
      <span class="chair-arm chair-arm-right"></span>
      <span class="chair-seat"></span>
      <span class="chair-pole"></span>
      <span class="chair-base"></span>
    </div>

    <!-- posteľ s károvanými vankúšmi, nočný stolík s lampou a levanduľou -->
    <div class="bed" :style="items.bed">
      <span class="bed-headboard"></span>
      <span class="bed-footboard"></span>
      <span class="bed-rail"></span>
      <span class="bed-mattress"></span>
      <span class="bed-pillow bed-pillow-2"></span>
      <span class="bed-pillow bed-pillow-1"></span>
      <!-- károvačky: nafúknuté vankúšiky so špicatými rohmi, opreté o vankúše -->
      <svg class="bed-cushions" viewBox="0 0 640 460">
        <defs>
          <pattern id="gingham" width="26" height="26" patternUnits="userSpaceOnUse" patternTransform="rotate(-3)">
            <rect width="26" height="26" fill="#f4f1ea" />
            <rect width="13" height="26" fill="rgba(52, 70, 112, 0.42)" />
            <rect width="26" height="13" fill="rgba(52, 70, 112, 0.42)" />
          </pattern>
          <radialGradient id="cushion-shade" cx="0.45" cy="0.4" r="0.65">
            <stop offset="0" stop-color="#ffffff" stop-opacity="0.35" />
            <stop offset="0.55" stop-color="#ffffff" stop-opacity="0" />
            <stop offset="1" stop-color="#141c34" stop-opacity="0.38" />
          </radialGradient>
          <path id="cushion-shape" d="M14 18 C 60 6, 140 6, 186 16 C 197 60, 197 140, 188 184 C 140 195, 60 195, 12 186 C 3 140, 3 60, 14 18 Z" />
        </defs>
        <g transform="translate(40 40) rotate(-12 165 380) scale(1.65 1.9)">
          <use href="#cushion-shape" fill="url(#gingham)" />
          <use href="#cushion-shape" fill="url(#cushion-shade)" />
          <path class="cushion-crease" d="M14 18 Q 40 40 52 66 M186 16 Q 160 40 150 64 M12 186 Q 38 162 52 140 M188 184 Q 162 160 150 138" />
          <use href="#cushion-shape" class="cushion-piping" />
        </g>
        <g transform="translate(300 130) rotate(-5 140 300) scale(1.4 1.5)">
          <use href="#cushion-shape" fill="url(#gingham)" />
          <use href="#cushion-shape" fill="url(#cushion-shade)" />
          <path class="cushion-crease" d="M14 18 Q 40 40 52 66 M186 16 Q 160 40 150 64 M12 186 Q 38 162 52 140 M188 184 Q 162 160 150 138" />
          <use href="#cushion-shape" class="cushion-piping" />
        </g>
      </svg>
      <span class="bed-duvet"><span class="bed-duvet-cuff"></span></span>
      <span class="bed-throw-fold"></span>
      <span class="bed-throw"></span>
    </div>
    <!-- nočný stolík: biely kovový rám, sklenená doska, tri sieťové šuplíky -->
    <div class="nightstand" :style="items.nightstand">
      <span class="nightstand-top"></span>
      <span class="nightstand-body">
        <span class="drawer"><span class="drawer-handle"></span></span>
        <span class="drawer"><span class="drawer-handle"></span></span>
        <span class="drawer"><span class="drawer-handle"></span></span>
      </span>
      <span class="nightstand-leg nightstand-leg-left"></span>
      <span class="nightstand-leg nightstand-leg-right"></span>
    </div>
    <div class="table-lamp" :style="items.tableLamp">
      <span class="table-lamp-glow"></span>
      <span class="table-lamp-base"></span>
      <span class="table-lamp-pole"></span>
      <span class="table-lamp-shade"></span>
    </div>
    <!-- sušená levanduľa v rebrovanej sklenej váze -->
    <svg class="lavender" :style="items.lavender" viewBox="0 0 210 480">
      <g class="lavender-stems">
        <path d="M105 330 C 100 240, 70 160, 48 70" />
        <path d="M105 330 C 104 230, 96 140, 90 40" />
        <path d="M106 330 C 110 230, 122 140, 128 30" />
        <path d="M107 330 C 116 240, 146 160, 166 76" />
        <path d="M106 330 C 108 250, 82 190, 72 120" />
        <path d="M107 330 C 112 250, 134 190, 146 116" />
      </g>
      <g class="lavender-buds">
        <ellipse v-for="(bud, i) in buds" :key="i" :cx="bud[0]" :cy="bud[1]" rx="6" ry="9" :transform="`rotate(${bud[2]} ${bud[0]} ${bud[1]})`" />
      </g>
      <path class="vase" d="M78 300 C 78 318, 90 326, 90 340 C 90 352, 40 370, 40 418 C 40 460, 70 478, 105 478 C 140 478, 170 460, 170 418 C 170 370, 120 352, 120 340 C 120 326, 132 318, 132 300 Z" />
      <path class="vase-ribs" d="M62 380 C 56 410, 58 446, 72 466 M 84 360 C 78 400, 80 446, 88 474 M 105 356 V 478 M 126 360 C 132 400, 130 446, 122 474 M 148 380 C 154 410, 152 446, 138 466" />
      <path class="vase-water" d="M48 430 C 70 438, 140 438, 162 430 C 160 458, 140 474, 105 474 C 70 474, 50 458, 48 430 Z" />
    </svg>
  </div>
</template>

<style scoped>
.room-decor > * {
  position: absolute;
}

.room-decor span {
  position: absolute;
  display: block;
}

/* okno */
.window {
  border: 40px solid #f6f6f4;
  box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.05), 0 0 0 30px #ebeae6;
}

.window-sky {
  inset: 0;
  background:
    radial-gradient(circle at 20% 22%, rgba(255, 255, 255, 0.9) 0 3px, transparent 4px),
    radial-gradient(circle at 74% 14%, rgba(255, 255, 255, 0.8) 0 3px, transparent 4px),
    radial-gradient(circle at 56% 36%, rgba(255, 255, 255, 0.7) 0 2px, transparent 3px),
    radial-gradient(circle at 34% 48%, rgba(255, 255, 255, 0.6) 0 2px, transparent 3px),
    linear-gradient(180deg, #1f2742 0%, #36406a 55%, #7a6d8f 88%, #c99a8a 100%);
}

.window-moon {
  top: 16%;
  left: 58%;
  width: 110px;
  height: 110px;
  border-radius: 50%;
  background: radial-gradient(circle at 40% 40%, #fffbe9, #f1e7c4);
  box-shadow: 0 0 60px 10px rgba(255, 246, 210, 0.35);
}

.window-cross {
  inset: 0;
  background:
    linear-gradient(90deg, transparent calc(50% - 16px), #f6f6f4 calc(50% - 16px) calc(50% + 16px), transparent calc(50% + 16px)),
    linear-gradient(180deg, transparent calc(40% - 16px), #f6f6f4 calc(40% - 16px) calc(40% + 16px), transparent calc(40% + 16px));
}

.window-sill {
  bottom: -70px;
  left: -90px;
  right: -90px;
  height: 40px;
  border-radius: 4px;
  background: linear-gradient(180deg, #ffffff, #e2e1dd);
  box-shadow: 0 12px 16px rgba(40, 30, 20, 0.1);
}

/* pruhované závesy (ružovo-pieskové a biele), pootvorené */
.curtain-rod {
  top: 0;
  left: 0;
  right: 0;
  height: 22px;
  border-radius: 11px;
  background: linear-gradient(180deg, #e6e7e8, #a9acaf);
}

.curtain {
  top: 14px;
  bottom: -30px;
  width: 26%;
  border-radius: 0 0 40px 40px;
  background:
    repeating-linear-gradient(90deg, rgba(0, 0, 0, 0.08) 0 50px, rgba(255, 255, 255, 0.12) 50px 100px, rgba(0, 0, 0, 0.03) 100px 150px),
    repeating-linear-gradient(90deg, #ead2c6 0 60px, #fbf8f4 60px 120px);
  box-shadow: 10px 16px 30px rgba(40, 30, 20, 0.12);
}

.curtain-left { left: 0; border-bottom-right-radius: 120px; }
.curtain-right { right: 0; border-bottom-left-radius: 120px; }

/* papierový lampión */
.lantern-cord {
  top: 0;
  bottom: 760px;
  left: 417px;
  width: 6px;
  background: #d8d6d2;
}

.lantern-ball {
  bottom: 0;
  left: 0;
  width: 840px;
  height: 790px;
  border-radius: 50%;
  background:
    repeating-linear-gradient(180deg, rgba(120, 115, 105, 0.12) 0 3px, transparent 3px 36px),
    radial-gradient(ellipse 30% 50% at 50% 50%, transparent 96%, rgba(120, 115, 105, 0.12) 98%, transparent 100%),
    radial-gradient(circle at 42% 38%, #ffffff, #f3f1ec 55%, #dcd8d0);
  box-shadow: 14px 34px 60px rgba(40, 30, 20, 0.12);
}

/* radiátor */
.radiator {
  border-radius: 10px;
  background:
    linear-gradient(180deg, #e8e7e3 0 46px, transparent 46px),
    repeating-linear-gradient(90deg, #f7f7f5 0 26px, #e2e1dd 26px 32px);
  box-shadow: 6px 12px 20px rgba(40, 30, 20, 0.08);
}

/* stôl */
.desk-top {
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  border-radius: 4px;
  background: linear-gradient(180deg, #ffffff, #ecebe8);
  box-shadow: 0 14px 24px rgba(40, 30, 20, 0.12);
}

.desk-leg {
  top: 60px;
  bottom: 0;
  width: 70px;
  border-radius: 0 0 10px 10px;
  background: linear-gradient(90deg, #e6e5e2, #ffffff 45%, #dcdbd7);
}

.desk-leg-back { bottom: 90px; opacity: 0.75; }
.desk-leg-1 { left: 200px; }
.desk-leg-2 { right: 200px; }
.desk-leg-3 { left: 60px; }
.desk-leg-4 { right: 60px; }

.tumbler-cup {
  bottom: 0;
  left: 0;
  width: 160px;
  height: 410px;
  border-radius: 18px 18px 28px 28px;
  background:
    linear-gradient(180deg, #d9d6cf 0 50px, transparent 50px),
    linear-gradient(90deg, #e8e2d6, #fbf8f2 40%, #ddd6c8);
}

.tumbler-straw {
  top: 0;
  left: 86px;
  width: 14px;
  height: 110px;
  background: #c9c6c0;
  transform: rotate(-12deg);
}

/* tieň pod nábytkom */
.floor-shadow {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(ellipse at 50% 50%, rgba(50, 30, 12, 0.24), rgba(50, 30, 12, 0) 70%);
}

/* sivá zamatová stolička s opierkami a čiernou hviezdicou */
/* zasunutá pod stolom – operadlo je tesne pod doskou */
.chair {
  transform: scale(0.82);
  transform-origin: 50% 100%;
}

.chair-back {
  top: 0;
  left: 70px;
  width: 760px;
  height: 660px;
  border-radius: 380px 380px 110px 110px;
  background:
    repeating-linear-gradient(90deg, rgba(0, 0, 0, 0.09) 0 5px, rgba(255, 255, 255, 0.03) 5px 8px, transparent 8px 126px),
    radial-gradient(ellipse 60% 50% at 42% 28%, rgba(255, 255, 255, 0.16), transparent 70%),
    linear-gradient(180deg, #77757d, #5b5960);
  box-shadow: inset 0 -30px 40px rgba(0, 0, 0, 0.15);
}

.chair-arm {
  top: 380px;
  width: 190px;
  height: 360px;
  border-radius: 95px 95px 60px 60px;
  background: linear-gradient(180deg, #6c6a72, #57555c);
  box-shadow: inset 0 18px 20px rgba(255, 255, 255, 0.06);
}

.chair-arm-left { left: 0; }
.chair-arm-right { right: 0; }

.chair-seat {
  top: 610px;
  left: 120px;
  width: 660px;
  height: 170px;
  border-radius: 80px;
  background: linear-gradient(180deg, #67656c, #504e55);
  box-shadow: 0 16px 20px rgba(0, 0, 0, 0.18);
}

.chair-pole {
  top: 780px;
  left: 432px;
  width: 36px;
  height: 470px;
  background: linear-gradient(90deg, #121214, #3a3a3e 50%, #121214);
}

.chair-base {
  bottom: 0;
  left: 40px;
  width: 820px;
  height: 160px;
  background:
    radial-gradient(circle at 44px 118px, #1a1a1b 0 40px, transparent 41px),
    radial-gradient(circle at 410px 124px, #1a1a1b 0 40px, transparent 41px),
    radial-gradient(circle at 776px 118px, #1a1a1b 0 40px, transparent 41px),
    linear-gradient(165deg, transparent 0 34%, #232325 34% 52%, transparent 52%),
    linear-gradient(15deg, transparent 0 34%, #232325 34% 52%, transparent 52%);
}

/* posteľ z borovice: tmavomodrá plachta, biele vankúše, károvačky, sivá deka a pletený pléd */
.bed-headboard {
  bottom: 0;
  left: 0;
  width: 140px;
  height: 1100px;
  border-radius: 16px 16px 6px 6px;
  background:
    linear-gradient(180deg, #ecd3a8 0 34px, transparent 34px),
    repeating-linear-gradient(90deg, rgba(150, 105, 55, 0.08) 0 3px, transparent 3px 22px),
    linear-gradient(90deg, #e8cc9c, #d6b07c 70%, #c99f6b);
  box-shadow: 6px 0 14px rgba(60, 40, 20, 0.12);
}

.bed-footboard {
  right: 0;
  bottom: 0;
  width: 110px;
  height: 700px;
  border-radius: 14px 14px 6px 6px;
  background:
    linear-gradient(180deg, #ecd3a8 0 30px, transparent 30px),
    linear-gradient(90deg, #e3c594, #cfa873);
  box-shadow: -6px 0 14px rgba(60, 40, 20, 0.1);
}

.bed-rail {
  bottom: 140px;
  left: 120px;
  right: 90px;
  height: 230px;
  border-radius: 6px;
  background:
    linear-gradient(180deg, #f0d9b0 0 18px, transparent 18px),
    repeating-linear-gradient(178deg, rgba(150, 105, 55, 0.07) 0 4px, transparent 4px 28px),
    linear-gradient(180deg, #e2c494, #cfa772);
}

/* matrac (≈ 15 cm) s tmavomodrou napínacou plachtou – vrch je trochu svetlejší */
.bed-mattress {
  bottom: 360px;
  left: 130px;
  right: 100px;
  height: 240px;
  border-radius: 40px 40px 26px 26px / 30px 30px 20px 20px;
  background:
    linear-gradient(180deg, #4a5a85 0 14px, transparent 14px),
    linear-gradient(180deg, #34446c, #27345a);
  box-shadow: inset 0 -16px 20px rgba(10, 15, 35, 0.25);
}

/* vankúše z boku: jeden opretý o čelo postele, jeden ležiaci pred ním */
.bed-pillow {
  border-radius: 110px 130px 100px 90px / 90px 100px 70px 70px;
  background:
    radial-gradient(ellipse 70% 45% at 45% 25%, rgba(255, 255, 255, 0.85), transparent 70%),
    linear-gradient(180deg, #faf8f3, #e2dcd0);
  box-shadow: inset 0 -18px 26px rgba(120, 100, 80, 0.14), 0 8px 12px rgba(40, 30, 20, 0.1);
}

.bed-pillow-1 { bottom: 585px; left: 150px; width: 820px; height: 190px; }
.bed-pillow-2 {
  bottom: 600px;
  left: 175px;
  width: 300px;
  height: 470px;
  border-radius: 130px 110px 60px 70px / 140px 120px 50px 60px;
  transform: rotate(-6deg);
  transform-origin: 50% 100%;
}

/* károvačky s tenkým lemom opreté o vankúše */
.bed-cushions {
  position: absolute;
  top: 40px;
  left: 380px;
  width: 640px;
  height: 460px;
  overflow: visible;
  filter: drop-shadow(0 12px 14px rgba(30, 30, 50, 0.18));
}

.cushion-piping {
  fill: none;
  stroke: #2d3d64;
  stroke-width: 6;
  vector-effect: non-scaling-stroke;
}

.cushion-crease {
  fill: none;
  stroke: rgba(20, 28, 52, 0.18);
  stroke-width: 5;
  stroke-linecap: round;
  vector-effect: non-scaling-stroke;
}

/* sivá prešívaná perina – leží na matraci a visí cez jeho bočnú hranu */
.bed-duvet {
  bottom: 300px;
  left: 900px;
  right: 108px;
  height: 370px;
  border-radius: 90px 34px 28px 50px / 70px 30px 24px 40px;
  background:
    linear-gradient(180deg, #8d8f97 0 60px, transparent 60px),
    /* záhyby: každý gradient sa kreslí len vo svojom obdĺžniku (nie cez celú perinu) – rovnaký vzhľad,
       ale posteľ sa pri pohybe kamery vykreslí asi o polovicu rýchlejšie.
       Elipsa 18 % × 70 % so stredom 22 % / 100 % = obdĺžnik 36 % × 140 % na pozícii 6,25 % / -75 % */
    radial-gradient(closest-side, rgba(0, 0, 0, 0.12), transparent 70%) 6.25% -75% / 36% 140% no-repeat,
    radial-gradient(closest-side, rgba(0, 0, 0, 0.1), transparent 70%) 47.22% -75% / 28% 140% no-repeat,
    radial-gradient(closest-side, rgba(0, 0, 0, 0.1), transparent 70%) 79.41% -75% / 32% 140% no-repeat,
    linear-gradient(180deg, #73757d, #5c5e66);
  box-shadow: 0 14px 18px rgba(30, 25, 35, 0.2);
}

/* prehnutý okraj periny pri vankúšoch */
.bed-duvet-cuff {
  top: -6px;
  bottom: 40px;
  left: -10px;
  width: 260px;
  border-radius: 90px 40px 50px 60px / 70px 40px 50px 60px;
  background: linear-gradient(180deg, #a5a7ae, #8a8c94);
  box-shadow: 8px 0 14px rgba(20, 20, 30, 0.2);
}

/* zložený pletený krémový pléd na nohách – visí cez bok, dole strapce */
.bed-throw {
  right: 140px;
  bottom: 250px;
  width: 1000px;
  height: 440px;
  border-radius: 40px 40px 18px 18px / 30px 30px 14px 14px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.55) 0 70px, rgba(120, 100, 70, 0.14) 70px 78px, transparent 78px),
    repeating-linear-gradient(90deg, rgba(120, 100, 70, 0.08) 0 12px, transparent 12px 26px),
    linear-gradient(180deg, #f5f0e6, #e0d7c6);
  box-shadow: 0 12px 16px rgba(40, 30, 20, 0.16);
}

/* zadná časť plédu je nahrnutá do vlny – zošit sa o ňu opiera a nevisí vo vzduchu */
.bed-throw-fold {
  right: 150px;
  bottom: 600px;
  width: 980px;
  height: 250px;
  border-radius: 300px 240px 0 0 / 220px 190px 0 0;
  background:
    radial-gradient(ellipse 40% 50% at 42% 18%, rgba(255, 255, 255, 0.55), transparent 70%),
    repeating-linear-gradient(90deg, rgba(120, 100, 70, 0.08) 0 12px, transparent 12px 26px),
    linear-gradient(180deg, #ece5d7, #d6cbb7);
  box-shadow: inset 0 -30px 30px rgba(90, 70, 40, 0.12);
}

.bed-throw::after {
  position: absolute;
  bottom: -38px;
  left: 30px;
  right: 30px;
  height: 42px;
  content: "";
  background: repeating-linear-gradient(90deg, #e6dece 0 6px, transparent 6px 16px);
}

/* nočný stolík – biely kovový rám, sklenená doska, sieťové šuplíky */
.nightstand {
  filter: drop-shadow(10px 16px 18px rgba(40, 30, 20, 0.14));
}

.nightstand-top {
  top: 0;
  left: -12px;
  right: -12px;
  height: 34px;
  border-radius: 8px;
  background:
    linear-gradient(100deg, rgba(255, 255, 255, 0) 30%, rgba(255, 255, 255, 0.9) 42%, rgba(255, 255, 255, 0) 54%),
    linear-gradient(180deg, #f4f6f6, #d9dedf);
  box-shadow: inset 0 -6px 0 #eceeee;
}

.nightstand-body {
  top: 34px;
  left: 0;
  right: 0;
  bottom: 60px;
  display: flex !important;
  flex-direction: column;
  gap: 16px;
  padding: 22px 26px 26px;
  border-radius: 0 0 10px 10px;
  background: linear-gradient(90deg, #f1f1ef, #ffffff 40%, #ecebe8);
}

.drawer {
  position: relative !important;
  flex: 1;
  border: 6px solid #f8f8f6;
  border-radius: 8px;
  background:
    repeating-linear-gradient(90deg, rgba(150, 150, 145, 0.28) 0 2px, transparent 2px 13px),
    repeating-linear-gradient(0deg, rgba(150, 150, 145, 0.28) 0 2px, transparent 2px 13px),
    #f3f2ef;
  box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.04), 0 4px 6px rgba(40, 30, 20, 0.06);
}

/* úchytka v strede šuplíka */
.drawer-handle {
  top: 16px;
  left: 50%;
  width: 120px;
  height: 22px;
  border-radius: 0 0 14px 14px;
  background: linear-gradient(180deg, #ffffff, #e2e1dd);
  box-shadow: 0 3px 4px rgba(40, 30, 20, 0.12);
  transform: translateX(-50%);
}

.nightstand-leg {
  bottom: 0;
  width: 26px;
  height: 64px;
  border-radius: 0 0 6px 6px;
  background: linear-gradient(90deg, #e6e5e2, #ffffff 45%, #dcdbd7);
}

.nightstand-leg-left { left: 22px; }
.nightstand-leg-right { right: 22px; }

/* stolová lampa */
.table-lamp-glow {
  top: -400px;
  left: -560px;
  width: 1540px;
  height: 1400px;
  border-radius: 50%;
  background: radial-gradient(ellipse, rgba(255, 238, 200, 0.55), rgba(255, 238, 200, 0) 65%);
}

.table-lamp-base {
  bottom: 0;
  left: 90px;
  width: 240px;
  height: 80px;
  border-radius: 120px 120px 14px 14px;
  background: linear-gradient(90deg, #8f9296, #e9ebed 45%, #a3a6aa);
}

.table-lamp-pole {
  bottom: 60px;
  left: 200px;
  width: 20px;
  height: 560px;
  background: linear-gradient(90deg, #9a9da1, #f1f2f3, #9a9da1);
}

.table-lamp-shade {
  top: 0;
  left: 30px;
  width: 360px;
  height: 400px;
  border-top: 10px solid #d8b56a;
  border-bottom: 10px solid #d8b56a;
  background:
    repeating-linear-gradient(90deg, rgba(220, 210, 190, 0.35) 0 4px, transparent 4px 18px),
    linear-gradient(180deg, #fffaf0, #fff4dc);
  clip-path: polygon(24% 0, 76% 0, 100% 100%, 0 100%);
}

/* levanduľa v rebrovanej sklenej váze */
.lavender-stems path {
  fill: none;
  stroke: #9fa07a;
  stroke-width: 3;
  stroke-linecap: round;
}

.lavender-buds ellipse {
  fill: #a58fc4;
}

.lavender-buds ellipse:nth-child(3n) { fill: #8d77b0; }
.lavender-buds ellipse:nth-child(4n) { fill: #b9a6d6; }

.vase {
  fill: rgba(225, 233, 236, 0.55);
  stroke: rgba(170, 185, 192, 0.8);
  stroke-width: 2;
}

.vase-ribs {
  fill: none;
  stroke: rgba(255, 255, 255, 0.75);
  stroke-width: 3;
  stroke-linecap: round;
}

.vase-water {
  fill: rgba(190, 210, 214, 0.35);
}
</style>
