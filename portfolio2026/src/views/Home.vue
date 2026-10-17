<script setup>
import { ref, reactive, onMounted, onUnmounted, nextTick } from "vue";

import Hero from "../components/Hero.vue";
import About from "../components/About.vue";
import Projects from "../components/Projects.vue";
import Multimedia from "../components/Multimedia.vue";
import Contact from "../components/Contact.vue";
import RoomDecor from "../components/RoomDecor.vue";
import RoomMap from "../components/RoomMap.vue";

// Celá stránka je Andreina izba. Každá sekcia je vec v izbe (stena nad posteľou, zošit, polička, stôl...).
// Scroll hýbe kamerou: pri veci je priblížená, medzi vecami sa oddiali, prejde k ďalšej a znova sa priblíži.
// Zastávky kamery v poradí; "skills" je druhá dvojstrana zošita – medzi about a skills sa len otočí strana.
const STOPS = ["hero", "about", "skills", "projects", "multimedia", "contact"];
const SPOT_OF = { skills: "about" };
const SPOT_IDS = ["hero", "about", "projects", "multimedia", "contact"];
const spotOf = (stop) => SPOT_OF[stop] || stop;

// zastávky, ktoré sa zmestia celé na obrazovku – kamera pri nich nejde dole, scroll hneď pokračuje ďalej
const FIT = new Set(["hero", "about", "skills", "projects", "multimedia", "contact"]);

// krátka nápoveda nad mapkou: čo sa pri veci dá robiť (na dotykových zariadeniach "tap")
const touch = window.matchMedia("(pointer: coarse)").matches;
const HINTS = {
  hero: "welcome to my room ♡ use the map at the bottom to visit every corner",
  about: "click the notebook page to turn to my skills",
  skills: "click “back” on the page for about me",
  projects: "click on a book to open a web development project",
  multimedia: "click a photo to watch the video or see the design up close",
  contact: "write me a message on the screen – LinkedIn & GitHub are in the dock ♡"
};
const hintFor = (stop) => {
  const text = HINTS[stop] || "";
  return touch ? text.replace(/click/g, "tap") : text;
};

// svetlo pri každej zastávke: dim = prítmie v izbe, lava = lávová lampa, screen = monitor.
// Tma prichádza pri ceste ku knihám, drží sa pri fotkách a pri stole ostane trochu šero.
const LIGHT = {
  hero: { dim: 0, lava: 0, screen: 0 },
  about: { dim: 0, lava: 0, screen: 0 },
  skills: { dim: 0, lava: 0, screen: 0 },
  projects: { dim: 1, lava: 1, screen: 0 },
  multimedia: { dim: 1, lava: 1, screen: 0 },
  contact: { dim: 0.6, lava: 0.3, screen: 1 }
};

// rozmery izby v px sveta (≈ 1 px = 0,6 mm)
const FLOOR_Y = 4200;
const DESK_TOP = FLOOR_Y - 1250;
const BED_W = 3330;

const world = ref(null);
const spacer = ref(null);
const floorBand = ref(null);
const floorPattern = ref(null);
const baseboard = ref(null);
const ceilingBand = ref(null);
const dimLayer = ref(null);
const lampLight = ref(null);
const roomMap = ref(null);
const notebook = ref(null);
const spotEls = {};
const setSpot = (id) => (el) => { if (el) spotEls[id] = el; };

const room = reactive({ stops: {}, anchors: {}, map: [] });
const activeIndex = ref(0);
// nápoveda sa schová len v strede presunu (kamera oddialená), pri príchode k veci sa už ukáže
const hintHidden = ref(false);

let timeline = [];
let view = { w: 0, h: 0 };
let lamp = null;
let screens = [];
let frame = 0;
let measureFrame = 0;
let lastTime = 0;
let targetScroll = 0;
let cameraScroll = 0;
let cameraVelocity = 0;
// ako dlho kamera dobieha scroll (s); pružina si drží rýchlosť medzi cvaknutiami kolieska
const SMOOTH_TIME = 0.32;
let resizeObserver;
let currentSpot = null;
// animácia presunu pri kliku na šípku / v menu
let tween = 0;
const styleCache = new WeakMap();
const scrollStorageKey = "portfolio-scroll-position";
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smoother = (t) => t * t * t * (t * (t * 6 - 15) + 10);

// poloha elementu vnútri jeho miesta v izbe (bez vplyvu transformácie kamery)
const offsetWithin = (el, ancestor) => {
  let x = 0;
  let y = 0;
  let node = el;
  while (node && node !== ancestor) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent;
  }
  return { x, y };
};

const place = (id, x, y) => {
  const el = spotEls[id];
  el.style.left = `${Math.round(x)}px`;
  el.style.top = `${Math.round(y)}px`;
  return { x, y, w: el.offsetWidth, h: el.offsetHeight };
};

// rozloženie izby zľava doprava; z neho trasa kamery
const measure = () => {
  measureFrame = 0;
  if (!world.value) return;

  const W = window.innerWidth;
  const H = window.innerHeight;
  const mobile = W < 768;
  // voľná plocha pre vec v izbe: okraje a dole miesto pre mapku
  const area = {
    left: mobile ? 12 : 40,
    right: W - (mobile ? 12 : 40),
    top: 24,
    bottom: H - (mobile ? 160 : 195)
  };
  view = { w: W, h: H };

  const size = (id) => ({ w: spotEls[id].offsetWidth, h: spotEls[id].offsetHeight });
  const spots = {};
  const anchors = {};

  // posteľ, nad ňou filmový pás s plagátmi – tu sa začína
  const bedX = 0;
  anchors.bed = { x: bedX, w: BED_W };
  const gallery = size("hero");
  spots.hero = place("hero", bedX + BED_W / 2 - gallery.w / 2, FLOOR_Y - 950 - gallery.h);
  // nočný stolík s lampou a levanduľou naľavo pri hlave postele
  anchors.nightstand = { x: bedX - 650 - 50 };
  // na posteli zošit (about + skills), leží na pravej strane na pletenom pléde
  const nb = size("about");
  spots.about = place("about", bedX + BED_W - 640 - nb.w / 2, FLOOR_Y - 650 - nb.h);
  // lampión zo stropu, nízko a v strede tesne nad plagátom Tame Impala (ten má vrch 300 px pod vrchom steny s plagátmi)
  anchors.lantern = { x: spots.hero.x + spots.hero.w / 2, bottom: spots.hero.y + 170 };
  // kovová polička s knihami a lávovou lampou hneď za posteľou
  spots.projects = place("projects", bedX + BED_W + 320, FLOOR_Y - size("projects").h);
  anchors.shelf = { x: spots.projects.x, w: spots.projects.w };
  // fotky na šnúrach hneď vedľa lávovej lampy, pod nimi radiátor
  const mmSize = size("multimedia");
  spots.multimedia = place("multimedia", spots.projects.x + spots.projects.w + 280, Math.max(500, FLOOR_Y - 1250 - mmSize.h));
  anchors.radiator = { x: spots.multimedia.x + mmSize.w / 2 - 600 };
  // stôl pod oknom s monitorom – nová správa (kontakt)
  const deskX = spots.multimedia.x + mmSize.w + 420;
  spots.contact = place("contact", deskX + 520, DESK_TOP - size("contact").h);
  anchors.desk = { x: deskX, w: 520 + spots.contact.w + 380 };
  anchors.chair = { x: spots.contact.x + spots.contact.w / 2 };

  room.anchors = anchors;

  // na čo sa kamera pri každej veci pozerá ([data-focus] vnútri, inak celé miesto)
  const focusOf = (id) => {
    const spot = spots[id];
    const el = spotEls[id].matches("[data-focus]") ? spotEls[id] : spotEls[id].querySelector("[data-focus]");
    if (!el) return { x: spot.x, y: spot.y, w: spot.w, h: spot.h };
    const off = offsetWithin(el, spotEls[id]);
    return { x: spot.x + off.x, y: spot.y + off.y, w: el.offsetWidth, h: el.offsetHeight };
  };

  // lávová lampa a monitor svietia, keď je v izbe šero
  const lightEl = spotEls.projects.querySelector("[data-light]");
  const lightOff = offsetWithin(lightEl, spotEls.projects);
  lamp = {
    x: spots.projects.x + lightOff.x + lightEl.offsetWidth / 2,
    y: spots.projects.y + lightOff.y + lightEl.offsetHeight * 0.35
  };
  screens = ["contact"].map((id) => {
    const f = focusOf(id);
    return { x: f.x + f.w / 2, y: f.y + f.h / 2, w: f.w, h: f.h, r: Math.max(f.w, f.h) * 1.1 };
  });

  // trasa: "stay" = kamera pri veci (ide po nej dole), "move" = presun k ďalšej
  const rest = H * 0.3;
  const moveLen = H * 1.0;
  const pageLen = H * 0.8;
  let pos = 0;
  const stops = {};
  timeline = [];

  STOPS.forEach((stop, i) => {
    const focus = focusOf(spotOf(stop));
    // úvod a zošit sa zmestia celé na obrazovku (pri otočení strany sa už nescrolluje dole),
    // ostatné veci sa čítajú pri plnej veľkosti
    const isNotebook = spotOf(stop) === "about";
    // rámček zošita má navrchu a dole voľné miesto na tieň – pri ňom sa ráta len so samotným zošitom,
    // aby sa priblížil viac a dal sa pohodlne čítať
    const fitPad = isNotebook ? -40 : 60;
    const fitH = FIT.has(stop) ? (area.bottom - area.top) / (focus.h + fitPad) : Infinity;
    // malý filmový pás a zmenšený zošit sa priblížia viac, ostatné veci sa čítajú pri plnej veľkosti
    const maxScale = i === 0 ? 1.35 : isNotebook ? 2.6 : 1;
    const scale = Math.min(maxScale, (area.right - area.left) / (focus.w + 120), fitH);
    const cx = focus.x + focus.w / 2 - ((area.left + area.right) / 2 - W / 2) / scale;
    // zošit sa ráta bez voľného miesta na tieň (ako pri fitH) – inak by ho kamera pri čítaní posúvala dole
    const tall = (focus.h + (isNotebook ? fitPad : 0)) * scale > area.bottom - area.top + 0.5;
    // vysoká vec: kamera ide od jej vrchu po spodok; nízka: je v strede voľnej plochy
    // úvod: filmový pás opticky trochu vyššie nad stredom obrazovky
    // zošit: o kúsok nižšie, jeho rámček má navrchu menej voľného miesta ako dole
    const lift = i === 0 ? H * 0.06 / scale : isNotebook ? -18 / scale : 0;
    const cyStart = lift + (tall
      ? focus.y - (area.top - H / 2) / scale
      : focus.y + focus.h / 2 - ((area.top + area.bottom) / 2 - H / 2) / scale);
    const cyEnd = tall ? focus.y + focus.h - (area.bottom - H / 2) / scale : cyStart;
    const pan = (cyEnd - cyStart) * scale;
    // za poslednou zastávkou (kontakt) sa už nedá scrollovať ďalej
    const stayRest = i === 0 ? H * 0.15 : i === STOPS.length - 1 ? 0 : rest;

    stops[stop] = { scrollStart: pos };
    timeline.push({ type: "stay", index: i, start: pos, len: pan + stayRest, pan, rest: stayRest, cx, cyStart, cyEnd, scale, focus });
    pos += pan + stayRest;

    if (i < STOPS.length - 1) {
      // v zošite sa len otočí strana, kamera ostáva
      const turn = spotOf(STOPS[i + 1]) === spotOf(stop);
      timeline.push({ type: "move", index: i, start: pos, len: turn ? pageLen : moveLen, turn });
      pos += turn ? pageLen : moveLen;
    }
  });

  // presuny: oddialiť len toľko, aby boli vidno obe veci (aj kus izby okolo)
  const shelfTop = spots.projects.y;
  timeline.forEach((seg, i) => {
    if (seg.type !== "move") return;
    const from = timeline[i - 1];
    const to = timeline[i + 1];
    const left = Math.min(from.focus.x, to.focus.x) - 250;
    const right = Math.max(from.focus.x + from.focus.w, to.focus.x + to.focus.w) + 250;
    // pri poličke ide záber až nad ňu, aby bolo pri presune vidno Marshall navrchu
    const peekTop = (seg) => (spotOf(STOPS[seg.index]) === "projects" ? Math.min(seg.focus.y, shelfTop - 380) : seg.focus.y);
    const top = Math.min(peekTop(from), peekTop(to)) - 200;
    const bottom = Math.max(from.focus.y + from.focus.h, to.focus.y + to.focus.h) + 200;
    const far = Math.min(0.7, (area.right - area.left) / (right - left), (area.bottom - area.top) / (bottom - top));
    Object.assign(seg, {
      ax: from.cx, ay: from.cyEnd, as: from.scale,
      bx: to.cx, by: to.cyStart, bs: to.scale,
      far: seg.turn || reduceMotion.matches ? Math.min(from.scale, to.scale) : Math.min(far, from.scale * 0.85, to.scale * 0.85)
    });
  });

  room.stops = stops;

  // mapka dole: zastávky v poradí, ako idú po izbe
  const labels = { hero: "hi!", about: "about", skills: "skills", projects: "projects", multimedia: "multimedia", contact: "contact" };
  room.map = STOPS.map((stop) => ({ id: stop, label: labels[stop] }));

  spacer.value.style.height = `${pos + H}px`;
  render(cameraScroll);
};

const cameraAt = (scroll) => {
  const seg = timeline.find((s) => scroll < s.start + s.len) || timeline[timeline.length - 1];
  const t = clamp01((scroll - seg.start) / seg.len);
  const turnSeg = timeline.find((s) => s.turn);
  // otočenie strany v zošite: 0 = about, 1 = skills
  const page = !turnSeg || scroll < turnSeg.start ? 0 : scroll >= turnSeg.start + turnSeg.len ? 1 : smoother(clamp01((scroll - turnSeg.start) / turnSeg.len));

  if (seg.type === "stay") {
    const u = seg.pan > 0 ? clamp01((scroll - seg.start - seg.rest / 2) / seg.pan) : 0;
    return {
      cx: seg.cx, cy: lerp(seg.cyStart, seg.cyEnd, u), scale: seg.scale, index: seg.index, slot: seg.index,
      moving: false, hideHint: false, light: LIGHT[STOPS[seg.index]], page
    };
  }

  // tri fázy, ktoré sa prekrývajú: oddiali sa → prejde k ďalšej veci → priblíži sa
  const out = smoother(clamp01(t / 0.38));
  const back = smoother(clamp01((1 - t) / 0.38));
  const along = smoother(clamp01((t - 0.14) / 0.72));
  const zoom = out * back;

  // svetlo v izbe sa plynulo mení počas celého presunu (žiadny skok tmy)
  const a = LIGHT[STOPS[seg.index]];
  const b = LIGHT[STOPS[seg.index + 1]];
  const fade = smoother(clamp01((t - 0.1) / 0.8));
  const light = { dim: lerp(a.dim, b.dim, fade), lava: lerp(a.lava, b.lava, fade), screen: lerp(a.screen, b.screen, fade) };

  return {
    // kamera sa najprv len oddiali na mieste, posúva sa až v strede presunu
    cx: lerp(seg.ax, seg.bx, along),
    cy: lerp(seg.ay, seg.by, along),
    scale: lerp(lerp(seg.as, seg.bs, along), seg.far, zoom),
    index: t < 0.5 ? seg.index : seg.index + 1,
    slot: seg.index + (seg.turn ? smoother(t) : along),
    moving: !seg.turn && t > 0 && t < 1,
    hideHint: !seg.turn && t > 0.2 && t < 0.75,
    light,
    page
  };
};

const setStyle = (el, prop, value) => {
  let cache = styleCache.get(el);
  if (!cache) styleCache.set(el, (cache = {}));
  if (cache[prop] === value) return;
  cache[prop] = value;
  if (prop.startsWith("--")) el.style.setProperty(prop, value);
  else el.style[prop] = value;
};

const render = (scroll, override = null) => {
  if (!world.value || !timeline.length) return;

  const { w: W, h: H } = view;
  const cam = override || cameraAt(scroll);
  const toScreenX = (x) => W / 2 + (x - cam.cx) * cam.scale;
  const toScreenY = (y) => H / 2 + (y - cam.cy) * cam.scale;

  const r1 = (v) => Math.round(v * 10) / 10;
  setStyle(world.value, "transform",
    `translate3d(${r1(toScreenX(0))}px, ${r1(toScreenY(0))}px, 0) scale(${cam.scale.toFixed(4)})`);

  // podlaha a strop sú pásy cez celú šírku okna – lacnejšie ako obrovské plochy vo svete
  setStyle(floorBand.value, "transform", `translate3d(0, ${r1(toScreenY(FLOOR_Y))}px, 0)`);
  // vzor dosiek: posun o celé dlaždice (aby vrstva vždy pokryla okno) + zväčšenie – len transformácia
  const tile = 1600 * cam.scale;
  const floorX = toScreenX(0) % tile;
  setStyle(floorPattern.value, "transform",
    `translate3d(${r1(floorX > 0 ? floorX - tile : floorX)}px, 0, 0) scale(${cam.scale.toFixed(4)})`);
  setStyle(baseboard.value, "transform", `scaleY(${cam.scale.toFixed(3)})`);
  setStyle(ceilingBand.value, "transform", `translate3d(0, ${r1(toScreenY(0) - H)}px, 0)`);

  // prítmie (vinetácia) + teplé svetlo lávovej lampy + studené svetlo monitora
  const { dim, lava, screen } = cam.light;
  setStyle(dimLayer.value, "opacity", dim.toFixed(3));
  // priehľadné vrstvy úplne vypnúť – inak ich prehliadač skladá každý snímok
  setStyle(dimLayer.value, "visibility", dim > 0.001 ? "visible" : "hidden");

  // svietiace veci (lávová lampa, monitor) majú v šere "dieru", aby žiarili naplno
  if (dim > 0.001 && lamp) {
    const hole = (x, y, rx, ry) =>
      `radial-gradient(ellipse ${rx * cam.scale}px ${ry * cam.scale}px at ${toScreenX(x)}px ${toScreenY(y)}px, transparent 55%, #000 100%)`;
    const holes = [hole(lamp.x, lamp.y, 150 * Math.max(lava, 0.001), 280 * Math.max(lava, 0.001))];
    if (screen > 0.001) screens.forEach((sc) => holes.push(hole(sc.x, sc.y, sc.w * 0.78, sc.h * 0.85)));
    const mask = holes.join(", ");
    setStyle(dimLayer.value, "webkitMaskImage", mask);
    setStyle(dimLayer.value, "maskImage", mask);
  }
  if ((lava > 0.001 || screen > 0.001) && lamp) {
    const r = 1500 * cam.scale;
    const glows = [
      `radial-gradient(circle at ${toScreenX(lamp.x)}px ${toScreenY(lamp.y)}px, rgba(255, 150, 70, ${0.5 * lava}) 0, rgba(255, 90, 60, ${0.3 * lava}) ${r * 0.3}px, rgba(255, 70, 90, ${0.12 * lava}) ${r * 0.7}px, rgba(255, 70, 90, 0) ${r}px)`,
      ...screens.map((sc) => {
        const sr = sc.r * cam.scale;
        return `radial-gradient(circle at ${toScreenX(sc.x)}px ${toScreenY(sc.y)}px, rgba(150, 190, 255, ${0.22 * screen}) 0, rgba(150, 190, 255, ${0.08 * screen}) ${sr * 0.6}px, rgba(150, 190, 255, 0) ${sr}px)`;
      })
    ];
    setStyle(lampLight.value, "background", glows.join(", "));
    setStyle(lampLight.value, "opacity", "1");
    setStyle(lampLight.value, "visibility", "visible");
  } else {
    setStyle(lampLight.value, "opacity", "0");
    setStyle(lampLight.value, "visibility", "hidden");
  }

  notebook.value?.setPage(cam.page);
  roomMap.value?.setProgress(cam.slot);
  world.value.classList.toggle("is-moving", cam.moving);
  if (hintHidden.value !== !!cam.hideHint) hintHidden.value = !!cam.hideHint;
  if (activeIndex.value !== cam.index) activeIndex.value = cam.index;

  // vec, ku ktorej kamera ide (alebo pri ktorej je), sa dá klikať hneď – aj kým kamera dobieha
  const spot = spotEls[spotOf(STOPS[cam.index])];
  if (spot !== currentSpot) {
    currentSpot?.classList.remove("is-current");
    spot?.classList.add("is-current");
    currentSpot = spot;
  }
};

// kamera plynulo dobieha scroll – koliesko myši potom nesekne po krokoch
const tick = (time) => {
  frame = 0;
  const dt = lastTime ? Math.min(64, time - lastTime) : 16.7;
  lastTime = time;

  // kriticky tlmená pružina: kamera sa rozbehne a zastaví plynulo a medzi cvaknutiami kolieska
  // nezastane (pri obyčajnom dobiehaní by sa po každom cvaknutí zastavila a znova poskočila)
  if (reduceMotion.matches) {
    cameraScroll = targetScroll;
    cameraVelocity = 0;
  } else {
    const omega = 2 / SMOOTH_TIME;
    const x = omega * (dt / 1000);
    const decay = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
    const change = cameraScroll - targetScroll;
    const temp = (cameraVelocity + omega * change) * (dt / 1000);
    cameraVelocity = (cameraVelocity - omega * temp) * decay;
    cameraScroll = targetScroll + (change + temp) * decay;
    if (Math.abs(targetScroll - cameraScroll) < 0.5 && Math.abs(cameraVelocity) < 5) {
      cameraScroll = targetScroll;
      cameraVelocity = 0;
    }
  }
  render(cameraScroll);

  if (cameraScroll !== targetScroll) frame = requestAnimationFrame(tick);
  else lastTime = 0;
};

const onScroll = () => {
  if (flying) return;
  targetScroll = window.scrollY;
  if (!frame) frame = requestAnimationFrame(tick);
};

// ---------- šípky a menu: kamera letí priamo k veci (scroll ostáva voľný) ----------
// Let nejde po trase scrollu – z kontaktu na skills preletí rovno, bez prechodu cez ostatné veci.
const scrollTop = (y) => window.scrollTo({ top: y, behavior: "instant" });
const stays = () => timeline.filter((seg) => seg.type === "stay");

// pri ktorej veci práve si (medzi vecami = tá bližšia)
const stayIndexAt = (y) => {
  const seg = timeline.find((s) => y < s.start + s.len) || timeline[timeline.length - 1];
  if (seg.type === "stay") return seg.index;
  return (y - seg.start) / seg.len < 0.5 ? seg.index : seg.index + 1;
};

const easeInOut = (t) => -(Math.cos(Math.PI * t) - 1) / 2;

let flying = false;

// počas letu kamery koliesko ani prst nescrollujú (kamera by inak skočila späť);
// poslucháč je pripojený len počas letu, aby bežný scroll ostal plynulý (pasívny)
const blockWhileFlying = (e) => e.preventDefault();
const setFlying = (on) => {
  if (flying === on) return;
  flying = on;
  const method = on ? "addEventListener" : "removeEventListener";
  window[method]("wheel", blockWhileFlying, { passive: false });
  window[method]("touchmove", blockWhileFlying, { passive: false });
};

const cancelFlight = () => {
  cancelAnimationFrame(tween);
  tween = 0;
  setFlying(false);
};

const flyTo = (index) => {
  const target = stays()[Math.max(0, Math.min(STOPS.length - 1, index))];
  if (!target) return;
  const toY = target.start;
  cancelFlight();
  cancelAnimationFrame(frame);
  frame = 0;

  const fromY = cameraScroll;
  const A = cameraAt(fromY);
  const B = cameraAt(toY);
  if (reduceMotion.matches || Math.abs(toY - fromY) < 1) {
    scrollTop(toY);
    targetScroll = cameraScroll = toY;
    cameraVelocity = 0;
    render(toY);
    flightEnd = performance.now();
    return;
  }

  // v rámci zošita (otočenie strany) sa neoddiaľuje; inak toľko, aby boli vidno obe miesta
  const sameSpot = spotOf(STOPS[A.index]) === spotOf(STOPS[B.index]);
  const dx = Math.abs(A.cx - B.cx);
  const dy = Math.abs(A.cy - B.cy);
  const far = sameSpot
    ? Math.min(A.scale, B.scale)
    : Math.min(0.7, A.scale * 0.85, B.scale * 0.85, view.w / (dx + 1800), view.h / (dy + 1600));
  const duration = sameSpot ? 1400 : Math.min(3400, 2300 + dx * 0.12);

  const t0 = performance.now();
  setFlying(true);
  const frameStep = (now) => {
    const t = Math.min(1, (now - t0) / duration);
    // rovnaké tri fázy ako pri scrolle: oddiali sa → preletí → priblíži sa
    const out = smoother(clamp01(t / 0.38));
    const back = smoother(clamp01((1 - t) / 0.38));
    const along = sameSpot ? easeInOut(t) : smoother(clamp01((t - 0.14) / 0.72));
    const zoom = out * back;
    const fade = easeInOut(t);
    const cam = {
      cx: lerp(A.cx, B.cx, along),
      cy: lerp(A.cy, B.cy, along),
      scale: lerp(lerp(A.scale, B.scale, along), far, zoom),
      index: t < 0.5 ? A.index : B.index,
      slot: lerp(A.slot, B.slot, fade),
      moving: !sameSpot && t < 1,
      hideHint: !sameSpot && t > 0.2 && t < 0.75,
      light: {
        dim: lerp(A.light.dim, B.light.dim, fade),
        lava: lerp(A.light.lava, B.light.lava, fade),
        screen: lerp(A.light.screen, B.light.screen, fade)
      },
      page: lerp(A.page, B.page, fade)
    };
    render(toY, cam);
    if (t < 1) {
      tween = requestAnimationFrame(frameStep);
      return;
    }
    // na konci sa scroll potichu presunie k cieľu, aby voľný scroll pokračoval odtiaľ
    tween = 0;
    setFlying(false);
    flightEnd = performance.now();
    scrollTop(toY);
    targetScroll = cameraScroll = toY;
    cameraVelocity = 0;
    render(toY);
  };
  tween = requestAnimationFrame(frameStep);
};

const step = (dir) => flyTo(activeIndex.value + dir);

// jeden scroll = presun na ďalšiu sekciu: kamera ide po tej istej trase ako pri voľnom scrolle
// (cez oddialený pohľad na izbu), len plynulo podľa času a bez zastavenia v strede
const scrollStep = (dir) => {
  // ide len po samotnom presune (bez pauzy pri zastávke, kde kamera stojí) – inak by pohyb
  // dostal len časť času a pôsobil by uponáhľane
  const i = activeIndex.value;
  const move = timeline.find((seg) => seg.type === "move" && seg.index === (dir > 0 ? i : i - 1));
  if (!move) return;
  const toY = dir > 0 ? move.start + move.len : move.start;
  const from = Math.min(move.start + move.len, Math.max(move.start, cameraScroll));
  cancelFlight();
  cancelAnimationFrame(frame);
  frame = 0;

  const finish = () => {
    tween = 0;
    setFlying(false);
    scrollTop(toY);
    targetScroll = cameraScroll = toY;
    cameraVelocity = 0;
    render(toY);
    flightEnd = performance.now();
  };
  if (reduceMotion.matches) return finish();

  const duration = move.turn ? 1400 : 2800;
  const t0 = performance.now();
  setFlying(true);
  const frameStep = (now) => {
    const t = Math.min(1, (now - t0) / duration);
    cameraScroll = lerp(from, toY, easeInOut(t));
    render(cameraScroll);
    if (t < 1) tween = requestAnimationFrame(frameStep);
    else finish();
  };
  tween = requestAnimationFrame(frameStep);
};

// koliesko, potiahnutie prstom a klávesy idú po zastávkach rovnakým plynulým letom ako menu
// (scroll po kúskoch sekal – kamera sa pri každom cvaknutí kolieska rozbehla a zastavila).
// Po prílete chvíľu čaká, aby dobiehajúca zotrvačnosť touchpadu neposlala kameru hneď ďalej.
let flightEnd = 0;
const canStep = () => !flying && performance.now() - flightEnd > 600;
const inRoom = (target) => target instanceof Element && !!target.closest(".office-page");

// jedno potiahnutie = jeden krok: nové potiahnutie začína po pauze v udalostiach kolieska,
// pri neprerušenom točení príde ďalší krok až chvíľu po prílete
let lastWheel = 0;
const onWheel = (e) => {
  if (e.ctrlKey || !inRoom(e.target) || e.target.closest("textarea")) return;
  e.preventDefault();
  const now = performance.now();
  const newGesture = now - lastWheel > 150;
  lastWheel = now;
  const delta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
  if (Math.abs(delta) < 2 || !canStep()) return;
  if (!newGesture && now - flightEnd < 1000) return;
  scrollStep(Math.sign(delta));
};

let touchY = null;
const onTouchStart = (e) => {
  touchY = inRoom(e.target) ? e.touches[0].clientY : null;
};
const onTouchMove = (e) => {
  if (touchY === null) return;
  e.preventDefault();
  const dy = touchY - e.touches[0].clientY;
  if (Math.abs(dy) < 40 || !canStep()) return;
  touchY = null;
  scrollStep(Math.sign(dy));
};

const STEP_KEYS = { ArrowDown: 1, PageDown: 1, " ": 1, ArrowUp: -1, PageUp: -1 };
const onPageKey = (e) => {
  const dir = STEP_KEYS[e.key];
  if (!dir || e.target.closest?.("input, textarea, select, button, [contenteditable], .room-map")) return;
  // otvorené okno s projektom (Teleport do body) má vlastný scroll
  if (document.querySelector("body > .fixed, body > .book-overlay")) return;
  e.preventDefault();
  if (canStep()) scrollStep(e.shiftKey && e.key === " " ? -1 : dir);
};

// posuvník v mapke: slot (0 … počet vecí − 1) → pozícia scrollu; kamera ide za ním
const scrollForSlot = (slot) => {
  const list = stays();
  const k = Math.max(0, Math.min(list.length - 1, Math.floor(slot)));
  const f = slot - k;
  const move = timeline.find((seg) => seg.type === "move" && seg.index === k);
  if (!move || f <= 0) return list[k].start;
  return move.start + f * move.len;
};

const onScrub = (slot) => {
  cancelFlight();
  scrollTop(scrollForSlot(slot));
};

// po pustení posuvníka kamera dôjde k najbližšej veci
const onScrubEnd = (slot) => flyTo(Math.round(slot));

const requestMeasure = () => {
  if (!measureFrame) measureFrame = requestAnimationFrame(measure);
};

const goTo = (id) => {
  const index = STOPS.indexOf(id);
  if (index >= 0) flyTo(index);
};

// klik v zošite: otočí stranu na zadanú (alebo opačnú) stranu
const turnPage = (to) => {
  goTo(to || (STOPS[activeIndex.value] === "skills" ? "about" : "skills"));
};

const saveScrollPosition = () => {
  sessionStorage.setItem(scrollStorageKey, String(Math.round(window.scrollY)));
};
// zápis do sessionStorage je synchrónny – počas scrollu by sekal, preto až po zastavení
let saveTimer = 0;
const saveScrollLater = () => {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveScrollPosition, 250);
};

onMounted(async () => {
  history.scrollRestoration = "manual";
  await nextTick();
  measure();

  // pri refreshi sa vrátime tam, kde kamera bola (bez preletu)
  const navigation = performance.getEntriesByType("navigation")[0];
  if (navigation?.type === "reload") {
    window.scrollTo({ top: Number(sessionStorage.getItem(scrollStorageKey) || 0), behavior: "instant" });
  }
  targetScroll = cameraScroll = window.scrollY;
  render(cameraScroll);

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("wheel", onWheel, { passive: false });
  window.addEventListener("touchstart", onTouchStart, { passive: true });
  window.addEventListener("touchmove", onTouchMove, { passive: false });
  window.addEventListener("keydown", onPageKey);
  window.addEventListener("scroll", saveScrollLater, { passive: true });
  window.addEventListener("pagehide", saveScrollPosition);
  window.addEventListener("resize", requestMeasure);
  // veľkosť vecí sa mení (fonty, filter v multimédiách)
  resizeObserver = new ResizeObserver(requestMeasure);
  SPOT_IDS.forEach((id) => resizeObserver.observe(spotEls[id]));
});

onUnmounted(() => {
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("wheel", onWheel);
  window.removeEventListener("touchstart", onTouchStart);
  window.removeEventListener("touchmove", onTouchMove);
  window.removeEventListener("keydown", onPageKey);
  window.removeEventListener("scroll", saveScrollLater);
  window.removeEventListener("pagehide", saveScrollPosition);
  clearTimeout(saveTimer);
  window.removeEventListener("resize", requestMeasure);
  resizeObserver?.disconnect();
  cancelFlight();
  cancelAnimationFrame(frame);
  cancelAnimationFrame(measureFrame);
});
</script>

<template>
  <div class="office-page">
    <!-- okno kamery: izba sa v ňom posúva a približuje -->
    <div class="office-viewport">
      <div ref="ceilingBand" class="room-ceiling" aria-hidden="true"></div>
      <div ref="floorBand" class="room-floor" aria-hidden="true">
        <span class="room-floor-clip">
          <span ref="floorPattern" class="room-floor-pattern"></span>
          <span class="room-floor-shade"></span>
        </span>
        <span ref="baseboard" class="room-baseboard"></span>
      </div>

      <div ref="world" class="office-world">
        <RoomDecor :anchors="room.anchors" :floor-y="FLOOR_Y" />

        <!-- stena nad posteľou: filmový pás a plagáty -->
        <div :ref="setSpot('hero')" class="office-spot">
          <Hero :active="activeIndex === 0" />
        </div>

        <!-- zošit na posteli: about me, po otočení strany skills -->
        <div :ref="setSpot('about')" class="office-spot">
          <About ref="notebook" :reading="activeIndex === 1 || activeIndex === 2" @turn="turnPage" />
        </div>

        <!-- polička s knihami a lávovou lampou -->
        <div :ref="setSpot('projects')" class="office-spot">
          <Projects />
        </div>

        <!-- fotky na šnúrach vedľa lávovej lampy -->
        <div :ref="setSpot('multimedia')" class="office-spot">
          <Multimedia />
        </div>

        <!-- monitor na stole s novou správou -->
        <div :ref="setSpot('contact')" class="office-spot">
          <Contact />
        </div>
      </div>

      <!-- prítmie a svetlo lávovej lampy a monitora -->
      <div ref="dimLayer" class="room-dim" aria-hidden="true"></div>
      <div ref="lampLight" class="room-lamp-light" aria-hidden="true"></div>
    </div>

    <!-- mapka izby namiesto menu -->
    <RoomMap
      ref="roomMap"
      :items="room.map"
      :active-id="STOPS[activeIndex]"
      :can-prev="activeIndex > 0"
      :can-next="activeIndex < STOPS.length - 1"
      @navigate="goTo"
      @step="step"
      @scrub="onScrub"
      @scrub-end="onScrubEnd"
    />

    <!-- nápoveda, čo sa pri veci dá robiť; počas presunu sa schová -->
    <p class="room-hint" :class="{ 'is-hidden': hintHidden }" aria-live="polite">
      <span :key="activeIndex">{{ hintFor(STOPS[activeIndex]) }}</span>
    </p>

    <!-- dĺžka scrollu = dĺžka cesty kamery -->
    <div ref="spacer" class="office-scroll" aria-hidden="true"></div>
  </div>
</template>
