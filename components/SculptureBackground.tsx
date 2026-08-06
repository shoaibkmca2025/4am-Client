import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * SculptureBackground — a fixed, scroll-driven mechanical-watch *calibre* that
 * disassembles as the camera orbits it across ten stages (assembled → crystal
 * off → selector → bezel → crown → plates → going train → rotor → reserve →
 * cased up). Ported from the reference "Calibre 4AM" artifact and adapted to
 * the warm cream site: the scene fog fades to the page colour, the dark grade
 * overlays are dropped, and horizontal placement (so the watch sits beside the
 * text, not behind it) is driven by `window.__sculptSideX` (set per section by
 * LandingPage) via a camera view-offset. Reads window.scrollY (Lenis-driven).
 *
 * Desktop / idle-gated by the caller (LandingPage) — never mounted on phones,
 * reduced-motion, save-data or weak CPUs.
 */

type Xf = { p: number[]; r: number[]; s: number };

export default function SculptureBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gradeLRef = useRef<HTMLDivElement>(null);
  const gradeRRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const TAU = Math.PI * 2, PI = Math.PI;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    let dpr = Math.min(window.devicePixelRatio, 1.25); // full-screen 3D: fewer pixels = big GPU win
    renderer.setPixelRatio(dpr);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.28;

    const scene = new THREE.Scene();
    const bg = getComputedStyle(document.body).getPropertyValue('--color-bg').trim() || '#f5ead8';
    const BG = new THREE.Color(bg);
    scene.fog = new THREE.FogExp2(BG.getHex(), 0.022); // soft fade into the cream page

    // Cream side-grades — fade the (large) watch into the page behind the copy
    // so text stays readable; the opposite (lit) side shows the watch in full.
    const cm = bg.match(/^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i);
    const cream = cm ? `${parseInt(cm[1], 16)}, ${parseInt(cm[2], 16)}, ${parseInt(cm[3], 16)}` : '245, 234, 216';
    const gradeL = gradeLRef.current, gradeR = gradeRRef.current;
    if (gradeL) gradeL.style.background = `linear-gradient(90deg, rgb(${cream}) 0%, rgba(${cream},0.92) 27%, rgba(${cream},0) 60%)`;
    if (gradeR) gradeR.style.background = `linear-gradient(270deg, rgb(${cream}) 0%, rgba(${cream},0.92) 27%, rgba(${cream},0) 60%)`;

    const camera = new THREE.PerspectiveCamera(32, 1, 0.05, 160);

    // ---- dark studio environment: black room with three soft strip lights
    // (gives the metals crisp reflections; the page colour still shows through
    // the transparent canvas — this only lights/reflects the object).
    let envTex: THREE.Texture | null = null;
    (function () {
      const c = document.createElement('canvas'); c.width = 256; c.height = 128;
      const g = c.getContext('2d')!;
      g.fillStyle = '#0b0a09'; g.fillRect(0, 0, 256, 128);
      g.filter = 'blur(9px)';
      g.fillStyle = '#ffffff'; g.fillRect(24, 8, 74, 26);
      g.fillStyle = '#cfd6e4'; g.fillRect(150, 2, 60, 18);
      g.fillStyle = '#e0a469'; g.fillRect(96, 62, 130, 16);
      g.fillStyle = '#2b2724'; g.fillRect(0, 92, 256, 36);
      const t = new THREE.CanvasTexture(c);
      t.mapping = THREE.EquirectangularReflectionMapping; t.colorSpace = THREE.SRGBColorSpace;
      scene.environment = t; envTex = t;
    })();
    const key = new THREE.DirectionalLight(0xfff2e0, 2.6); key.position.set(3.5, 4.2, 5.5); scene.add(key);
    const rim = new THREE.DirectionalLight(0xa9c2e8, 1.5); rim.position.set(-5, 1.5, -3); scene.add(rim);
    const warm = new THREE.PointLight(0xe0a469, 14, 12, 2); warm.position.set(-1.6, -1.4, 2.4); scene.add(warm);
    scene.add(new THREE.AmbientLight(0xffffff, 0.18)); // lifted a touch so the object reads on cream

    // ---- materials
    const std = (name: string, color: number, roughness: number, metalness: number, extra: THREE.MeshStandardMaterialParameters = {}) => {
      const m = new THREE.MeshStandardMaterial({ color: new THREE.Color(color), roughness, metalness, envMapIntensity: 1.55, ...extra });
      m.name = name; return m;
    };
    const M: Record<string, THREE.MeshStandardMaterial> = {
      rose: std('rose-gold-polished', 0xd7965d, 0.14, 1),
      roseSat: std('rose-gold-brushed', 0xbd7b46, 0.32, 1),
      chrome: std('polished-steel', 0xe6e8e6, 0.10, 1),
      rhodium: std('rhodium-plate', 0xd2d5d2, 0.25, 1),
      steelSat: std('steel-satin', 0xa9adaa, 0.40, 1),
      gilt: std('gilt-brass', 0xd8ae61, 0.22, 1),
      blued: std('blued-steel', 0x2a4a94, 0.14, 1),
      ruby: std('ruby-jewel', 0xa11c3c, 0.16, 0.15),
      tungsten: std('tungsten-weight', 0x6f6a66, 0.34, 1),
      glass: std('sapphire-crystal', 0xdfe9f5, 0.02, 0.06, { transparent: true, opacity: 0.10, depthWrite: false, side: THREE.DoubleSide }),
    };

    // ---- dial texture (Roman chapter ring)
    const DIAL_R = 1.94;
    (function () {
      const Sz = 1024, c = document.createElement('canvas'); c.width = c.height = Sz;
      const g = c.getContext('2d')!, C = Sz / 2, u = C / DIAL_R;
      g.translate(C, C);
      g.beginPath(); g.arc(0, 0, 1.94 * u, 0, TAU); g.arc(0, 0, 1.58 * u, 0, TAU, true);
      g.fillStyle = '#141210'; g.fill();
      g.strokeStyle = '#d7965d'; g.lineWidth = 0.010 * u;
      g.beginPath(); g.arc(0, 0, 1.912 * u, 0, TAU); g.stroke();
      g.beginPath(); g.arc(0, 0, 1.598 * u, 0, TAU); g.stroke();
      for (let i = 0; i < 60; i++) {
        const a = i / 60 * TAU, r0 = 1.855 * u, r1 = (i % 5 === 0 ? 1.765 : 1.815) * u;
        g.beginPath(); g.lineWidth = (i % 5 === 0 ? 0.019 : 0.008) * u;
        g.strokeStyle = i % 5 === 0 ? '#e6b482' : '#8d7a67';
        g.moveTo(Math.cos(a) * r0, Math.sin(a) * r0); g.lineTo(Math.cos(a) * r1, Math.sin(a) * r1); g.stroke();
      }
      const NUM = ['XII', 'I', 'II', 'III', 'IIII', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];
      g.fillStyle = '#e8bd8c'; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.font = '600 ' + (0.195 * u).toFixed(0) + 'px Georgia, "Times New Roman", serif';
      NUM.forEach((n, i) => { g.save(); g.rotate(i / 12 * TAU); g.translate(0, -1.705 * u); g.fillText(n, 0, 0); g.restore(); });
      const t = new THREE.CanvasTexture(c);
      t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
      t.center.set(0.5, 0.5); t.rotation = PI;
      t.repeat.set(1 / (2 * DIAL_R), 1 / (2 * DIAL_R)); t.offset.set(0.5, 0.5); t.anisotropy = 4;
      M.dial = std('dial-chapter-ring', 0xffffff, 0.34, 0.5, { map: t });
    })();

    // ---- geometry helpers
    const ex = (shape: THREE.Shape, depth: number, bevel: number, seg?: number) => {
      const g = new THREE.ExtrudeGeometry(shape, { depth, curveSegments: seg || 24, bevelEnabled: bevel > 0, bevelSize: bevel, bevelThickness: bevel, bevelSegments: 1 });
      g.translate(0, 0, -depth / 2); g.computeVertexNormals(); return g;
    };
    const ringShape = (rOut: number, rIn: number) => {
      const s = new THREE.Shape(); s.absarc(0, 0, rOut, 0, TAU, false);
      const h = new THREE.Path(); h.absarc(0, 0, rIn, 0, TAU, true); s.holes.push(h); return s;
    };
    const annulus = (rOut: number, rIn: number, d: number, b = 0.005, seg = 40) => ex(ringShape(rOut, rIn), d, b, seg);
    const discGeo = (r: number, d: number, b = 0.004) => { const s = new THREE.Shape(); s.absarc(0, 0, r, 0, TAU, false); return ex(s, d, b, 34); };
    const arcPlate = (rOut: number, rIn: number, a0: number, a1: number, d: number) => {
      const s = new THREE.Shape(); s.absarc(0, 0, rOut, a0, a1, false); s.absarc(0, 0, rIn, a1, a0, true);
      return ex(s, d, 0.004, 28);
    };
    const MODULE = 0.052;
    function gearGeo(r: number, depth: number, skeleton: number) {
      const teeth = Math.max(8, Math.round(TAU * r / MODULE)), td = MODULE * 0.62, rRoot = r - td, step = TAU / teeth, pts: THREE.Vector2[] = [];
      for (let i = 0; i < teeth; i++) {
        const a = i * step;
        pts.push(new THREE.Vector2(Math.cos(a) * rRoot, Math.sin(a) * rRoot));
        pts.push(new THREE.Vector2(Math.cos(a + step * .18) * r, Math.sin(a + step * .18) * r));
        pts.push(new THREE.Vector2(Math.cos(a + step * .34) * r, Math.sin(a + step * .34) * r));
        pts.push(new THREE.Vector2(Math.cos(a + step * .5) * rRoot, Math.sin(a + step * .5) * rRoot));
      }
      const s = new THREE.Shape(pts);
      const hub = new THREE.Path(); hub.absarc(0, 0, r * 0.17, 0, TAU, true); s.holes.push(hub);
      if (skeleton) {
        const hr = rRoot * 0.56, cr = rRoot * 0.30;
        for (let i = 0; i < skeleton; i++) {
          const a = i / skeleton * TAU + 0.25, p = new THREE.Path();
          p.absarc(Math.cos(a) * hr, Math.sin(a) * hr, cr, 0, TAU, true); s.holes.push(p);
        }
      }
      return ex(s, depth, 0.003, 8);
    }
    function caseGeo() {
      const prof = [[1.58, .30], [1.66, .345], [1.84, .365], [2.02, .325], [2.13, .225], [2.175, .07],
        [2.16, -.10], [2.09, -.235], [1.95, -.315], [1.72, -.355], [1.40, -.365], [1.08, -.345],
        [1.02, -.30], [1.30, -.28], [1.66, -.27], [1.66, .02], [1.60, .16], [1.58, .30]]
        .map(([r, y]) => new THREE.Vector2(r, y));
      const g = new THREE.LatheGeometry(prof, 84); g.rotateX(-PI / 2); g.computeVertexNormals(); return g;
    }
    function handGeo(len: number, w: number, tail: number) {
      const s = new THREE.Shape(); s.moveTo(-tail, 0);
      s.bezierCurveTo(-tail * .5, w * 1.15, len * .42, w, len, 0);
      s.bezierCurveTo(len * .42, -w, -tail * .5, -w * 1.15, -tail, 0);
      return ex(s, 0.028, 0.003, 16);
    }
    function hairspringGeo() {
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= 120; i++) { const u = i / 120, a = u * TAU * 3.2, r = 0.075 + u * 0.26; pts.push(new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, u * 0.018)); }
      return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 130, 0.0072, 5, false);
    }

    // ---- the calibre
    const rig = new THREE.Group(); scene.add(rig);
    const parts: THREE.Mesh[] = [];
    function P(name: string, geo: THREE.BufferGeometry, material: THREE.Material, group: string, layer: number, hm: Xf, spin = 0) {
      const m = new THREE.Mesh(geo, material);
      m.name = name;
      m.userData = { group, layer, home: hm, spin, angle: 0, i: parts.length };
      rig.add(m); parts.push(m); return m;
    }
    const H = (x: number, y: number, z: number, rz?: number, s?: number): Xf => ({ p: [x, y, z], r: [0, 0, rz || 0], s: s === undefined ? 1 : s });

    (P('case', caseGeo(), M.rose, 'case', 0, H(0, 0, 0)).material as THREE.MeshStandardMaterial).side = THREE.DoubleSide;
    P('bezel', annulus(2.06, 1.58, 0.16, 0.028, 80), M.rose, 'bezel', 7, H(0, 0, 0.40));
    P('crystal', discGeo(1.62, 0.04, 0.008), M.glass, 'glass', 8, H(0, 0, 0.44));
    P('crown', new THREE.CylinderGeometry(0.16, 0.16, 0.20, 26, 1), M.roseSat, 'crown', 0, H(2.34, 0, 0)).geometry.rotateZ(PI / 2);
    P('crown-tube', new THREE.CylinderGeometry(0.075, 0.075, 0.22, 16), M.rose, 'crown', 0, H(2.16, 0, 0)).geometry.rotateZ(PI / 2);
    P('selector-wheel', gearGeo(0.30, 0.055, 0), M.gilt, 'selector', 2, H(1.62, 0, -0.02), -0.62);
    P('selector-jewel', (() => { const g = new THREE.CylinderGeometry(0.05, 0.05, 0.036, 14); g.rotateX(PI / 2); return g; })(), M.ruby, 'selector', 3, H(1.62, 0, 0.06));
    P('chapter-ring', annulus(DIAL_R, 1.575, 0.042, 0.004, 68), M.dial, 'dial', 5, H(0, 0, 0.29));

    const TRAIN: [string, number, number, number, THREE.MeshStandardMaterial, number, number, number][] = [
      ['barrel', -0.852, 0.597, 0.62, M.gilt, 0.070, 0.10, 6],
      ['centre-wheel', 0.000, 0.000, 0.42, M.gilt, 0.062, -0.1476, 5],
      ['third-wheel', 0.623, 0.436, 0.34, M.gilt, 0.056, 0.1824, 4],
      ['fourth-wheel', 1.098, 0.037, 0.28, M.rhodium, 0.050, -0.2215, 4],
      ['escape-wheel', 0.944, -0.386, 0.17, M.rhodium, 0.044, 0.3648, 0],
    ];
    (function () {
      const s = ringShape(1.56, 0.34);
      TRAIN.forEach(([n, x, y, r]) => { if (n === 'centre-wheel') return; const p = new THREE.Path(); p.absarc(x, y, r * 0.78, 0, TAU, true); s.holes.push(p); });
      const t = new THREE.Path(); t.absarc(0.02, -0.95, 0.50, 0, TAU, true); s.holes.push(t);
      P('mainplate', ex(s, 0.085, 0.005, 32), M.steelSat, 'plate', 1, H(0, 0, -0.18));
    })();
    P('bridge-barrel', arcPlate(1.48, 0.58, 2.10, 3.50, 0.072), M.rhodium, 'bridge', 3, H(0, 0, 0.02));
    P('bridge-train', arcPlate(1.46, 0.62, 5.25, 6.42, 0.072), M.rhodium, 'bridge', 3, H(0, 0, 0.02));
    P('bridge-cock', arcPlate(1.34, 0.86, 3.62, 4.42, 0.068), M.rhodium, 'bridge', 4, H(0, 0, 0.10));

    const hubGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.20, 12); hubGeo.rotateX(PI / 2);
    const jewelGeo = new THREE.CylinderGeometry(0.052, 0.052, 0.036, 12); jewelGeo.rotateX(PI / 2);
    const screwGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.044, 14); screwGeo.rotateX(PI / 2);
    TRAIN.forEach(([n, x, y, r, material, d, spin, sk]) => {
      P(n, gearGeo(r, d, sk), material, 'gear', 2, H(x, y, -0.06), spin * 2.4);
      P(n + '-pinion', hubGeo, M.chrome, 'hub', 2, H(x, y, -0.06));
      P(n + '-jewel', jewelGeo, M.ruby, 'jewel', 3, H(x, y, 0.075));
    });

    const TB = [0.02, -0.95];
    P('cage', annulus(0.50, 0.445, 0.042, 0.004, 44), M.chrome, 'tourb', 2, H(TB[0], TB[1], -0.03), 0.34);
    for (let i = 0; i < 3; i++) {
      const a = i / 3 * TAU;
      P('cage-arm-' + (i + 1), new THREE.BoxGeometry(0.46, 0.04, 0.036), M.chrome, 'tourb', 2,
        H(TB[0] + Math.cos(a) * 0.235, TB[1] + Math.sin(a) * 0.235, -0.03, a), 0.34);
    }
    P('balance-wheel', annulus(0.36, 0.305, 0.042, 0.004, 40), M.gilt, 'balance', 2, H(TB[0], TB[1], 0.01));
    P('balance-bar', new THREE.BoxGeometry(0.66, 0.046, 0.036), M.gilt, 'balance', 2, H(TB[0], TB[1], 0.01));
    P('hairspring', hairspringGeo(), M.steelSat, 'balance', 3, H(TB[0], TB[1], 0.07));
    P('balance-staff', hubGeo, M.chrome, 'hub', 2, H(TB[0], TB[1], 0.01));
    P('pallet-fork', new THREE.BoxGeometry(0.30, 0.052, 0.034), M.chrome, 'escape', 3, H(0.66, -0.60, 0.02, 0.95));

    // self-winding module: weighted rotor over the back
    P('rotor', arcPlate(1.44, 0.34, 0.10, PI - 0.10, 0.085), M.tungsten, 'rotor', 0, H(0, 0, -0.30), 0.55);
    P('rotor-rim', arcPlate(1.44, 1.26, 0.06, PI - 0.06, 0.10), M.rose, 'rotor', 0, H(0, 0, -0.30), 0.55);
    P('rotor-hub', new THREE.CylinderGeometry(0.16, 0.16, 0.14, 20), M.chrome, 'rotor', 0, H(0, 0, -0.30)).geometry.rotateX(PI / 2);
    P('reduction-wheel', gearGeo(0.36, 0.05, 4), M.gilt, 'gear', 1, H(-0.55, -0.62, -0.24), -0.42);

    for (let i = 0; i < 6; i++) { const a = i / 6 * TAU + 0.45; P('screw-' + (i + 1), screwGeo, M.blued, 'screw', 3, H(Math.cos(a) * 1.40, Math.sin(a) * 1.40, 0.075)); }
    for (let i = 0; i < 4; i++) { const a = i / 4 * TAU + 1.1; P('jewel-' + (i + 1), jewelGeo, M.ruby, 'jewel', 3, H(Math.cos(a) * 1.02, Math.sin(a) * 1.02, 0.085)); }

    P('hand-hour', handGeo(0.74, 0.068, 0.15), M.blued, 'hand', 6, H(0, 0, 0.20, PI / 2 - TAU / 3), 0);
    P('hand-minute', handGeo(1.22, 0.054, 0.15), M.blued, 'hand', 6, H(0, 0, 0.235, PI / 2), 0);
    P('hand-seconds', handGeo(0.44, 0.023, 0.14), M.rose, 'hand', 6, H(TB[0], TB[1], 0.13, 0.6), 0);
    P('hand-boss', (() => { const g = new THREE.CylinderGeometry(0.08, 0.08, 0.10, 16); g.rotateX(PI / 2); return g; })(), M.blued, 'hand', 6, H(0, 0, 0.25));

    const spinning = parts.filter(p => p.userData.spin);
    const balanceParts = parts.filter(p => p.userData.group === 'balance');
    const fork = parts.find(p => p.name === 'pallet-fork');
    const hands = { h: parts.find(p => p.name === 'hand-hour'), m: parts.find(p => p.name === 'hand-minute'), s: parts.find(p => p.name === 'hand-seconds') };

    const T = (p: number[], r?: number[], s?: number): Xf => ({ p, r: r || [0, 0, 0], s: s === undefined ? 1 : s });
    const homeOf = (p: THREE.Mesh): Xf => T((p.userData.home as Xf).p.slice(), (p.userData.home as Xf).r.slice(), (p.userData.home as Xf).s);
    const lift = (t: Xf, dz: number, dx?: number, dy?: number) => { t.p[0] += dx || 0; t.p[1] += dy || 0; t.p[2] += dz || 0; return t; };

    // ---- ten stages · the camera orbits, the object stays a watch
    type Stage = { m: Record<string, Xf>; at?: number[]; focus?: string; az: number; el: number; dist: number; shift: number; rot: number[] };
    // Large "full background" framing like the reference. TWELVE phases — one
    // per editorial section — telling assemble → disassemble → reassemble as
    // you scroll. The cream side-grade (below) fades the watch into the page
    // behind the copy so text stays readable even though the object is big.
    const STAGES: (() => Stage)[] = [
      // 1 · home — assembled, reading 4:00
      () => { const m: Record<string, Xf> = {}; parts.forEach(p => m[p.name] = homeOf(p));
        return { m, at: [0, 0, 0], az: 8, el: 6, dist: 7.8, shift: 1, rot: [0.04, -0.10, 0] }; },
      // 2 · why — the crystal lifts off
      () => { const m: Record<string, Xf> = {}; parts.forEach(p => { const t = homeOf(p), g = p.userData.group;
        if (g === 'glass') lift(t, 2.4); if (g === 'bezel') lift(t, 0.5); m[p.name] = t; });
        return { m, at: [0, 0, 0.1], az: 20, el: 12, dist: 7.6, shift: -1, rot: [0.08, -0.06, 0] }; },
      // 3 · focus — dial + hands rise, the movement shows through
      () => { const m: Record<string, Xf> = {}; parts.forEach(p => { const t = homeOf(p), g = p.userData.group;
        if (g === 'glass') lift(t, 3.0); if (g === 'bezel') lift(t, 0.9); if (g === 'dial') lift(t, 1.0); if (g === 'hand') lift(t, 1.3); if (g === 'selector') lift(t, 0.3); m[p.name] = t; });
        return { m, at: [0, 0.1, 0.1], az: 32, el: 16, dist: 7.4, shift: 1, rot: [0.07, -0.02, 0] }; },
      // 4 · services — the bezel unscrews and turns
      () => { const m: Record<string, Xf> = {}; parts.forEach(p => { const t = homeOf(p), g = p.userData.group;
        if (g === 'glass') lift(t, 3.4); if (g === 'bezel') { lift(t, 1.6); t.s = 1.06; } if (g === 'dial') lift(t, 1.4); if (g === 'hand') lift(t, 1.8); m[p.name] = t; });
        return { m, at: [0, 0.2, 0.2], az: 46, el: 22, dist: 7.4, shift: -1, rot: [0.06, 0.02, 0] }; },
      // 5 · software — the bridges lift, exposing the structure
      () => { const m: Record<string, Xf> = {}; parts.forEach(p => { const t = homeOf(p), g = p.userData.group;
        if (g === 'glass') lift(t, 3.8); if (g === 'bezel') lift(t, 2.0); if (g === 'dial') lift(t, 1.8); if (g === 'hand') lift(t, 2.2); if (g === 'bridge') lift(t, 0.9); if (g === 'crown') lift(t, 0, 0.28); m[p.name] = t; });
        return { m, at: [0, 0.1, 0.1], az: 30, el: 26, dist: 7.6, shift: 1, rot: [0.05, 0.05, 0] }; },
      // 6 · reach — the going train, exposed
      () => { const m: Record<string, Xf> = {}; parts.forEach(p => { const t = homeOf(p), g = p.userData.group;
        if (g === 'glass') lift(t, 4.0); if (g === 'bezel') lift(t, 2.2); if (g === 'dial') lift(t, 2.0); if (g === 'hand') lift(t, 2.4); if (g === 'bridge') lift(t, 1.4); if (g === 'jewel' || g === 'screw') lift(t, 0.4); m[p.name] = t; });
        return { m, at: [0, 0, 0], az: 16, el: 24, dist: 7.6, shift: -1, rot: [0.05, 0.04, 0] }; },
      // 7 · method — fully exploded along the axis
      () => { const m: Record<string, Xf> = {}; const K = 0.9; parts.forEach(p => { const u = p.userData, h2 = u.home as Xf;
        m[p.name] = T([h2.p[0] * K, h2.p[1] * K, (u.layer * 0.82 - 3.0) * K], h2.r, K); });
        return { m, at: [0, 0, -0.4], az: 36, el: 30, dist: 9.6, shift: 1, rot: [0.05, 0.06, 0] }; },
      // 8 · network — around the back: the self-winding rotor
      () => { const m: Record<string, Xf> = {}; parts.forEach(p => { const t = homeOf(p), g = p.userData.group;
        if (g === 'glass') lift(t, 4.6); if (g === 'bezel') lift(t, 2.8); if (g === 'dial') lift(t, 2.2); if (g === 'hand') lift(t, 3.0); if (g === 'rotor') lift(t, -0.70); m[p.name] = t; });
        return { m, at: [0, 0, -0.3], az: 168, el: 16, dist: 7.8, shift: -1, rot: [0.04, 0.03, 0] }; },
      // 9 · work — the barrel comes out: the reserve
      () => { const m: Record<string, Xf> = {}; parts.forEach(p => { const t = homeOf(p), g = p.userData.group;
        if (g === 'glass') lift(t, 5.0); if (g === 'bezel') lift(t, 3.0); if (g === 'dial') lift(t, 2.4); if (g === 'hand') lift(t, 3.2); if (g === 'rotor') lift(t, -1.55); if (p.name.indexOf('barrel') === 0) lift(t, -1.35); m[p.name] = t; });
        return { m, at: [0, 0, -0.2], az: 190, el: 14, dist: 7.6, shift: 1, rot: [0.04, 0.02, 0] }; },
      // 10 · about — the balance & escapement side
      () => { const m: Record<string, Xf> = {}; parts.forEach(p => { const t = homeOf(p), g = p.userData.group;
        if (g === 'glass') lift(t, 4.2); if (g === 'bezel') lift(t, 2.4); if (g === 'dial') lift(t, 1.9); if (g === 'hand') lift(t, 2.6); if (g === 'bridge') lift(t, 0.7); m[p.name] = t; });
        return { m, at: [0, -0.2, 0], az: 150, el: 24, dist: 7.2, shift: -1, rot: [0.05, -0.03, 0] }; },
      // 11 · testimonials — the movement settles back together
      () => { const m: Record<string, Xf> = {}; parts.forEach(p => { const t = homeOf(p), g = p.userData.group;
        if (g === 'glass') lift(t, 2.0); if (g === 'bezel') lift(t, 0.9); if (g === 'dial') lift(t, 0.6); if (g === 'hand') lift(t, 0.8); m[p.name] = t; });
        return { m, at: [0, 0, 0.1], az: 70, el: 12, dist: 7.6, shift: 1, rot: [0.05, -0.05, 0] }; },
      // 12 · contact — cased up, resting at four o'clock
      () => { const m: Record<string, Xf> = {}; parts.forEach(p => m[p.name] = homeOf(p));
        return { m, at: [0, 0, 0], az: 352, el: 6, dist: 7.8, shift: 1, rot: [0.04, -0.08, 0] }; },
    ];

    // ---- blending
    const cache = STAGES.map(f => f());
    const usesFocus = cache.some((s) => !!s.focus); // skip the per-frame world-matrix update if unused
    const va = new THREE.Vector3(), vb = new THREE.Vector3();
    const e1 = new THREE.Euler(), e2 = new THREE.Euler();
    const qa = new THREE.Quaternion(), qb = new THREE.Quaternion(), qz = new THREE.Quaternion();
    const ZAXIS = new THREE.Vector3(0, 0, 1);
    const camLook = new THREE.Vector3(), camPos = new THREE.Vector3();
    const tA = new THREE.Vector3(), tB = new THREE.Vector3(), fw = new THREE.Vector3();
    const rq1 = new THREE.Quaternion(), rq2 = new THREE.Quaternion();
    const byName: Record<string, THREE.Mesh> = {}; parts.forEach(p => byName[p.name] = p);
    const DEG = Math.PI / 180;
    let kx = 1;
    const ease = (t: number) => t * t * (3 - 2 * t);
    const mix = (a: number, b: number, f: number) => a + (b - a) * f;
    const mixAngle = (a: number, b: number, f: number) => { const d = ((b - a) % 360 + 540) % 360 - 180; return a + d * f; };

    function stageTarget(St: Stage, out: THREE.Vector3) {
      if (St.focus && byName[St.focus]) { byName[St.focus].getWorldPosition(fw); out.copy(fw); }
      else out.fromArray(St.at || [0, 0, 0]);
    }

    function apply(t: number) {
      const i = Math.max(0, Math.min(STAGES.length - 1, Math.floor(t)));
      const j = Math.min(STAGES.length - 1, i + 1);
      const f = ease(Math.max(0, Math.min(1, t - i)));
      const A = cache[i], B = cache[j];

      for (const p of parts) {
        const ta = A.m[p.name], tb = B.m[p.name], u = p.userData;
        va.fromArray(ta.p); vb.fromArray(tb.p);
        p.position.copy(va).lerp(vb, f);
        e1.set(ta.r[0], ta.r[1], ta.r[2]); e2.set(tb.r[0], tb.r[1], tb.r[2]);
        qa.setFromEuler(e1); qb.setFromEuler(e2);
        p.quaternion.copy(qa).slerp(qb, f);
        if (u.angle) { qz.setFromAxisAngle(ZAXIS, u.angle); p.quaternion.multiply(qz); }
        p.scale.setScalar(mix(ta.s, tb.s, f));
      }

      e1.set(A.rot[0], A.rot[1], A.rot[2]); e2.set(B.rot[0], B.rot[1], B.rot[2]);
      rq1.setFromEuler(e1); rq2.setFromEuler(e2);
      rig.quaternion.copy(rq1).slerp(rq2, f);
      rig.position.set(0, 0, 0);
      if (usesFocus) rig.updateMatrixWorld(true); // only needed for focus-targeted (macro) stages

      stageTarget(A, tA); stageTarget(B, tB);
      camLook.copy(tA).lerp(tB, f);
      const az = mixAngle(A.az, B.az, f) * DEG;
      const el = mix(A.el, B.el, f) * DEG;
      const dist = mix(A.dist, B.dist, f);
      camPos.set(
        camLook.x + Math.sin(az) * Math.cos(el) * dist,
        camLook.y + Math.sin(el) * dist,
        camLook.z + Math.cos(az) * Math.cos(el) * dist,
      );
      return dist;
    }

    // constant-rate mechanism — nothing driven by scroll speed, so nothing jumps
    function mechanism(dt: number, time: number) {
      for (const p of spinning) p.userData.angle += p.userData.spin * dt;
      const osc = Math.sin(time * 8) * 0.85;
      for (const p of balanceParts) p.userData.angle = osc;
      if (fork) fork.userData.angle = Math.sin(time * 8 + 1.5) * 0.13;
      // Hour + minute hands stay frozen at their home 4:00 setting (the "4AM"
      // signature); only the small-seconds keeps sweeping, so the movement
      // still reads as alive while the watch always shows four o'clock.
      if (hands.s) hands.s.userData.angle -= 1.05 * dt;
    }

    // ---- scroll (Lenis updates window.scrollY, so this reads it directly).
    // The phase target is driven by each SECTION's centre, not raw scroll
    // fraction, so every section locks to exactly one watch phase however tall
    // it is — 12 sections ↔ 12 phases, synchronised. Section centres are cached
    // and only re-measured when the document height changes (images/resize).
    let target = 0, current = 0;
    let centers: number[] = [], lastH = -1;
    function ensureCenters() {
      const h = document.documentElement.scrollHeight;
      if (h === lastH && centers.length) return;
      lastH = h;
      centers = Array.from(document.querySelectorAll('main .o-section')).map((s) => {
        const r = (s as HTMLElement).getBoundingClientRect();
        return r.top + window.scrollY + r.height / 2;
      });
    }
    function onScroll() {
      const N = STAGES.length;
      ensureCenters();
      const last = centers.length - 1;
      if (last > 0) {
        const probe = window.scrollY + window.innerHeight / 2;
        let prog: number;
        if (probe <= centers[0]) prog = 0;
        else if (probe >= centers[last]) prog = last;
        else {
          let k = 0; while (k < last && probe >= centers[k + 1]) k++;
          const span = centers[k + 1] - centers[k];
          prog = k + (span > 0 ? (probe - centers[k]) / span : 0);
        }
        target = prog * (N - 1) / last; // section index → phase index (1:1 when counts match)
      } else {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        target = (max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0) * (N - 1);
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    let px = 0, py = 0, sx = 0, sy = 0;
    const onPointer = (e: PointerEvent) => { px = (e.clientX / window.innerWidth - .5) * 2; py = (e.clientY / window.innerHeight - .5) * 2; };
    window.addEventListener('pointermove', onPointer, { passive: true });

    function resize() {
      renderer.setSize(window.innerWidth, window.innerHeight, false);
      camera.aspect = window.innerWidth / window.innerHeight;
      kx = Math.max(0, Math.min(1, (camera.aspect - 1.05) / 0.6));
      camera.updateProjectionMatrix();
    }
    const onResize = () => { resize(); onScroll(); };
    window.addEventListener('resize', onResize);
    resize(); onScroll(); current = target;

    let paused = false;
    const onVis = () => { paused = document.hidden; };
    document.addEventListener('visibilitychange', onVis);

    // ---- loop (with one-way, hysteresis-guarded resolution drop)
    const w = window as unknown as { __sculptSideX?: number };
    let sideCurrent = 0;
    let slow = 0, acc = 0, frames = 0, prev = performance.now(), rafId = 0, lastRender = 0;
    function loop(now: number) {
      rafId = requestAnimationFrame(loop);
      if (paused) { prev = now; lastRender = now; return; }
      // Cap the 3D near 60fps — on 120/144Hz displays this halves GPU work
      // while the page/scroll keeps running at the native refresh. No effect
      // on 60Hz. (dt/prev only advance on rendered frames, so motion stays
      // time-correct.)
      if (now - lastRender < 10.5) return;
      const dt = Math.min(0.05, (now - prev) / 1000); prev = now; lastRender = now;
      acc += dt; frames++;
      if (acc > 1.0) {
        const fps = frames / acc; acc = 0; frames = 0;
        // React quickly: if a second dips below ~52fps, shed pixels immediately.
        if (fps < 55) { if (++slow >= 1 && dpr > 0.9) { dpr = Math.max(0.9, dpr - 0.2); renderer.setPixelRatio(dpr); slow = 0; } }
        else slow = 0;
      }

      const damp = 1 - Math.pow(0.055, dt);
      current += (target - current) * damp;
      if (Math.abs(target - current) < 0.0002) current = target;

      const dist = apply(current);
      mechanism(dt, now / 1000);

      // parallax scaled to shot distance, so macro views don't swim
      const pk = Math.min(1, dist / 7) * 0.22;
      sx += (px * pk - sx) * damp * 0.5; sy += (py * pk * 0.7 - sy) * damp * 0.5;

      const back = 1 + Math.max(0, 1.6 - camera.aspect) * 0.45;
      camera.position.copy(camPos).sub(camLook).multiplyScalar(back).add(camLook);
      camera.position.x += sx; camera.position.y -= sy;
      camera.lookAt(camLook);

      // horizontal placement from the active section (beside the text, in frame)
      const sideRaw = (typeof w.__sculptSideX === 'number') ? w.__sculptSideX : 0;
      sideCurrent += (sideRaw - sideCurrent) * damp;
      const W = window.innerWidth, Hh = window.innerHeight, s = sideCurrent * 0.42 * kx;
      if (Math.abs(s) > 0.001) camera.setViewOffset(W, Hh, -s * W, 0, W, Hh);
      else camera.clearViewOffset();

      // fade the watch into the page behind the text (cream grade on the text side)
      const gr = Math.max(-1, Math.min(1, sideCurrent / 0.5));
      if (gradeL) gradeL.style.opacity = Math.max(0, gr).toFixed(3);
      if (gradeR) gradeR.style.opacity = Math.max(0, -gr).toFixed(3);

      renderer.render(scene, camera);
    }
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVis);
      const geoSet = new Set<THREE.BufferGeometry>(), matSet = new Set<THREE.Material>();
      rig.traverse((o) => {
        const mm = o as THREE.Mesh;
        if (mm.isMesh) {
          geoSet.add(mm.geometry);
          (Array.isArray(mm.material) ? mm.material : [mm.material]).forEach((x) => matSet.add(x));
        }
      });
      geoSet.forEach((g) => g.dispose());
      matSet.forEach((m) => { const sm = m as THREE.MeshStandardMaterial; if (sm.map) sm.map.dispose(); m.dispose(); });
      if (envTex) envTex.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <>
      <canvas id="o-scene" ref={canvasRef} aria-hidden="true" />
      <div className="o-grade" ref={gradeLRef} aria-hidden="true" />
      <div className="o-grade" ref={gradeRRef} aria-hidden="true" />
    </>
  );
}
