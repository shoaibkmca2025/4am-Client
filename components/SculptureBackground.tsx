import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * SculptureBackground — a fixed, scroll-driven clay sculpture that morphs
 * through ten states as the visitor moves down the page (clock → orbit →
 * lens barrel → exploded → mast → dish → aperture → constellation → arc →
 * clock). Ported from the reference artifact's vanilla-three module and
 * wired to the project's smooth scroll (Lenis drives window.scrollY, which
 * this reads directly). Purely decorative: pointer-events are off and it
 * sits behind all editorial content.
 *
 * Desktop / idle-gated by the caller (LandingPage) — never mounted on
 * phones, reduced-motion, save-data or weak CPUs.
 */

type Transform = { p: number[]; r: number[]; s: number; o: number };

export default function SculptureBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const css = getComputedStyle(document.body);
    const tok = (n: string, f: string) => { const v = css.getPropertyValue(n).trim(); return v || f; };
    const BG = new THREE.Color(tok('--color-bg', '#f5ead8'));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.05, 100);
    scene.fog = new THREE.Fog(BG, 9, 26);

    // ---- lighting: soft studio on a warm ground
    scene.add(new THREE.HemisphereLight(0xffffff, BG.getHex(), 0.65));
    const key = new THREE.DirectionalLight(0xfff6e8, 2.1);
    key.position.set(3.4, 5.2, 3.0);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.near = 1; key.shadow.camera.far = 22;
    key.shadow.camera.left = -7; key.shadow.camera.right = 7;
    key.shadow.camera.top = 7; key.shadow.camera.bottom = -7;
    key.shadow.bias = -0.0012; key.shadow.radius = 3;
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xd8c6a6, 0.5); fill.position.set(-4, 1.5, -2.5); scene.add(fill);

    // ---- materials: matte clay, 4 voices
    const M = {
      clay: new THREE.MeshStandardMaterial({ color: new THREE.Color(tok('--color-neutral-200', '#eee7db')), roughness: 0.92, metalness: 0 }),
      terra: new THREE.MeshStandardMaterial({ color: new THREE.Color(tok('--color-accent', '#c67139')), roughness: 0.85, metalness: 0 }),
      sage: new THREE.MeshStandardMaterial({ color: new THREE.Color(tok('--color-accent-2', '#7a8a5e')), roughness: 0.88, metalness: 0 }),
      ink: new THREE.MeshStandardMaterial({ color: new THREE.Color(tok('--color-neutral-800', '#474238')), roughness: 0.78, metalness: 0 }),
    };

    // ---- ground shadow catcher
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.ShadowMaterial({ opacity: 0.14 }));
    ground.rotation.x = -Math.PI / 2; ground.position.y = -2.6; ground.receiveShadow = true;
    scene.add(ground);

    // ---- the object: one shared pool of named parts, relaid out per section.
    // Scaled below 1 so the sculpture keeps a clear margin around it — that
    // empty space is where the editorial text column sits (the object is
    // nudged to the opposite half per section, see LandingPage PLACE).
    const rig = new THREE.Group(); scene.add(rig);
    rig.scale.setScalar(0.96);
    const parts: THREE.Mesh[] = [];
    const disposables: (THREE.BufferGeometry)[] = [];
    const add = (name: string, geo: THREE.BufferGeometry, mat: THREE.Material, group: string) => {
      const m = new THREE.Mesh(geo, mat);
      m.name = name; m.castShadow = true; m.receiveShadow = true;
      m.userData.group = group;
      rig.add(m); parts.push(m); disposables.push(geo); return m;
    };

    const TICKS = 12, PETALS = 8, SHARDS = 14;
    for (let i = 0; i < TICKS; i++)
      add('tick-' + (i + 1), new THREE.BoxGeometry(0.3, 0.09, 0.09), i % 3 === 0 ? M.terra : M.clay, 'tick');
    for (let i = 0; i < 4; i++)
      add('ring-' + (i + 1), new THREE.TorusGeometry(1, 0.085, 20, 96), i === 0 ? M.ink : M.clay, 'ring');
    for (let i = 0; i < 3; i++)
      add('lens-' + (i + 1), new THREE.CylinderGeometry(0.6, 0.6, 0.08, 64), i === 2 ? M.sage : M.clay, 'lens');
    for (let i = 0; i < PETALS; i++)
      add('petal-' + (i + 1), new THREE.CylinderGeometry(0.055, 0.5, 1.55, 6, 1, false, 0, Math.PI), i % 2 ? M.clay : M.sage, 'petal');
    for (let i = 0; i < SHARDS; i++)
      add('shard-' + (i + 1), new THREE.BoxGeometry(0.26, 0.26, 0.26), i % 4 === 0 ? M.terra : M.clay, 'shard');
    add('hand-hour', new THREE.BoxGeometry(0.52, 0.1, 0.1), M.ink, 'hand').geometry.translate(0.26, 0, 0);
    add('hand-minute', new THREE.BoxGeometry(0.8, 0.08, 0.08), M.terra, 'hand').geometry.translate(0.4, 0, 0);
    add('core', new THREE.SphereGeometry(0.3, 48, 32), M.terra, 'core');
    add('mast', new THREE.CylinderGeometry(0.075, 0.11, 3.1, 24), M.ink, 'mast');

    const byGroup = (g: string) => parts.filter((p) => p.userData.group === g);
    const idx = (p: THREE.Mesh) => parseInt(p.name.split('-').pop() as string, 10) - 1 || 0;

    const TAU = Math.PI * 2;
    const rnd = (i: number, s: number) => { const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return x - Math.floor(x); };
    const T = (p: number[], r: number[] = [0, 0, 0], s = 1, o = 1): Transform => ({ p, r, s, o });
    const HIDE = T([0, 0, 0], [0, 0, 0], 0.0001, 0);

    type StageResult = { m: Record<string, Transform>; cam: number[]; look: number[]; rig: number[] };

    // each stage returns a map of part-name -> transform, plus camera
    const STAGES: (() => StageResult)[] = [
      // 1 — clock face assembled, reading 4:00
      () => {
        const m: Record<string, Transform> = {};
        byGroup('tick').forEach((p) => { const a = idx(p) / TICKS * TAU;
          m[p.name] = T([Math.cos(a) * 0.8, Math.sin(a) * 0.8, 0.06], [0, 0, a], 1); });
        byGroup('ring').forEach((p) => { const i = idx(p);
          m[p.name] = T([0, 0, -i * 0.16], [0, 0, 0], 1 - i * 0.07); });
        byGroup('lens').forEach((p) => m[p.name] = T([0, 0, -0.9 - idx(p) * 0.12], [Math.PI / 2, 0, 0], 0.8 - idx(p) * 0.12));
        byGroup('petal').forEach((p) => m[p.name] = HIDE);
        byGroup('shard').forEach((p) => { const a = idx(p) / SHARDS * TAU;
          m[p.name] = T([Math.cos(a) * 3.4, Math.sin(a) * 0.5 - 1.6, Math.sin(a) * 2.2], [rnd(idx(p), 1) * TAU, rnd(idx(p), 2) * TAU, 0], 0.55, 1); });
        m['hand-hour'] = T([0, 0, 0.16], [0, 0, -0.5236]);
        m['hand-minute'] = T([0, 0, 0.26], [0, 0, Math.PI / 2]);
        m['core'] = T([0, 0, 0.2], [0, 0, 0], 0.8);
        m['mast'] = HIDE;
        return { m, cam: [0, 0.35, 6.1], look: [0, 0, 0], rig: [1.7, 0, 0] };
      },
      // 2 — ticks release into a wide orbit, face opens
      () => {
        const m: Record<string, Transform> = {};
        byGroup('tick').forEach((p) => { const a = idx(p) / TICKS * TAU + 0.4;
          m[p.name] = T([Math.cos(a) * 2.55, Math.sin(a) * 0.9, Math.sin(a) * 2.55], [0, -a, Math.PI / 2], 1.1); });
        byGroup('ring').forEach((p) => { const i = idx(p);
          m[p.name] = T([0, 0, -i * 0.5], [0.2, 0, 0], 1 + i * 0.1); });
        byGroup('lens').forEach((p) => m[p.name] = T([0, 0, -1.6], [Math.PI / 2, 0, 0], 0.5));
        byGroup('petal').forEach((p) => m[p.name] = HIDE);
        byGroup('shard').forEach((p) => { const i = idx(p), a = i / SHARDS * TAU;
          m[p.name] = T([Math.cos(a) * 4.2, rnd(i, 3) * 3 - 1.5, Math.sin(a) * 3], [rnd(i, 1) * TAU, rnd(i, 2) * TAU, 0], 0.5); });
        m['hand-hour'] = T([0, 0, 0.5], [0, 0, -1.1], 1.1);
        m['hand-minute'] = T([0, 0, 0.7], [0, 0, 0.5], 1.1);
        m['core'] = T([0, 0, 0], [0, 0, 0], 1.5);
        m['mast'] = HIDE;
        return { m, cam: [1.9, 0.9, 5.4], look: [0, 0, 0], rig: [-1.7, -0.5, 0] };
      },
      // 3 — rings stack into a lens barrel, camera moves in
      () => {
        const m: Record<string, Transform> = {};
        byGroup('tick').forEach((p) => { const a = idx(p) / TICKS * TAU;
          m[p.name] = T([Math.cos(a) * 1.05, Math.sin(a) * 1.05, 0.9], [0, 0, -a], 0.9); });
        byGroup('ring').forEach((p) => { const i = idx(p);
          m[p.name] = T([0, 0, 0.6 - i * 0.62], [0, 0, 0], 0.92 - i * 0.05); });
        byGroup('lens').forEach((p) => m[p.name] = T([0, 0, 0.3 - idx(p) * 0.62], [Math.PI / 2, 0, 0], 0.9));
        byGroup('petal').forEach((p) => m[p.name] = HIDE);
        byGroup('shard').forEach((p) => { const i = idx(p), a = i / SHARDS * TAU;
          m[p.name] = T([Math.cos(a) * 3.2, Math.sin(a * 2) * 1.8, -2 - rnd(i, 4) * 3], [rnd(i, 1) * TAU, 0, 0], 0.42); });
        m['hand-hour'] = T([0, 0, 1.35], [0, 0, -1.2], 0.8);
        m['hand-minute'] = T([0, 0, 1.35], [0, 0, 1.9], 0.8);
        m['core'] = T([0, 0, -1.5], [0, 0, 0], 0.9);
        m['mast'] = HIDE;
        return { m, cam: [0.6, 0.5, 4.4], look: [0, 0, -0.3], rig: [1.6, 0, 0] };
      },
      // 4 — exploded view: every element pulled apart on one axis
      () => {
        const m: Record<string, Transform> = {};
        byGroup('tick').forEach((p) => { const i = idx(p);
          m[p.name] = T([(i % 4 - 1.5) * 0.9, Math.floor(i / 4) * 0.9 - 0.9, 2.2], [0, 0, 0], 0.85); });
        byGroup('ring').forEach((p) => { const i = idx(p);
          m[p.name] = T([0, 0, 1.3 - i * 1.15], [0.42, 0.2, 0], 0.85 - i * 0.04); });
        byGroup('lens').forEach((p) => m[p.name] = T([0, 0, 0.75 - idx(p) * 1.15], [Math.PI / 2 + 0.42, 0, 0.2], 0.8));
        byGroup('petal').forEach((p) => m[p.name] = HIDE);
        byGroup('shard').forEach((p) => { const i = idx(p);
          m[p.name] = T([(i % 7 - 3) * 0.72, i < 7 ? 1.9 : -1.9, -3.4], [0.42, 0, 0], 0.4); });
        m['hand-hour'] = T([-2.1, 0.6, 1.2], [0, 0, 0.4], 0.8);
        m['hand-minute'] = T([2.1, -0.6, 1.2], [0, 0, -0.4], 0.8);
        m['core'] = T([0, 0, -3.1], [0, 0, 0], 0.8);
        m['mast'] = HIDE;
        return { m, cam: [3.3, 1.5, 4.6], look: [0, 0, -0.6], rig: [-1.5, 0, 0] };
      },
      // 5 — collapses upright into a mast: software / structure
      () => {
        const m: Record<string, Transform> = {};
        byGroup('tick').forEach((p) => { const i = idx(p);
          m[p.name] = T([i % 2 ? 0.42 : -0.42, i * 0.26 - 1.5, 0], [0, Math.PI / 2, 0], 0.95); });
        byGroup('ring').forEach((p) => { const i = idx(p);
          m[p.name] = T([0, 1.45 - i * 0.95, 0], [Math.PI / 2, 0, 0], 0.5 + i * 0.13); });
        byGroup('lens').forEach((p) => m[p.name] = T([0, -1.9 + idx(p) * 0.14, 0], [0, 0, 0], 0.75 + idx(p) * 0.1));
        byGroup('petal').forEach((p) => m[p.name] = HIDE);
        byGroup('shard').forEach((p) => { const i = idx(p), a = i / SHARDS * TAU;
          m[p.name] = T([Math.cos(a) * 1.5, i * 0.24 - 1.7, Math.sin(a) * 1.5], [0, -a, 0], 0.38); });
        m['hand-hour'] = T([0, 1.9, 0], [0, 0, 0], 0.9);
        m['hand-minute'] = T([0, 2.1, 0], [0, 0, Math.PI / 2], 0.9);
        m['core'] = T([0, 2.35, 0], [0, 0, 0], 0.7);
        m['mast'] = T([0, 0.1, 0], [0, 0, 0], 1);
        return { m, cam: [2.4, 0.9, 5.4], look: [0, 0.2, 0], rig: [1.7, -0.2, 0] };
      },
      // 6 — a dish unfolds from petals: broadcast
      () => {
        const m: Record<string, Transform> = {};
        byGroup('petal').forEach((p) => { const i = idx(p), a = i / PETALS * TAU;
          m[p.name] = T([Math.cos(a) * 0.72, 0.62, Math.sin(a) * 0.72], [Math.PI / 2 - 0.62, -a + Math.PI / 2, 0], 1.05); });
        byGroup('ring').forEach((p) => { const i = idx(p);
          m[p.name] = T([0, 1.4 - i * 0.05, 0], [Math.PI / 2, 0, 0], 1.35 - i * 0.03); });
        byGroup('tick').forEach((p) => { const i = idx(p), a = i / TICKS * TAU;
          m[p.name] = T([Math.cos(a) * 1.35, 1.42, Math.sin(a) * 1.35], [0, -a, Math.PI / 2], 0.9); });
        byGroup('lens').forEach((p) => m[p.name] = T([0, -1.85 + idx(p) * 0.12, 0], [0, 0, 0], 0.9 + idx(p) * 0.16));
        byGroup('shard').forEach((p) => { const i = idx(p), a = i / SHARDS * TAU * 2;
          m[p.name] = T([Math.cos(a) * (2.6 + i * 0.1), 1.6 + i * 0.22, Math.sin(a) * (2.6 + i * 0.1)], [0, -a, 0], 0.3); });
        m['hand-hour'] = T([0, 0.1, 0], [0, 0, 0], 0.9);
        m['hand-minute'] = T([0, 2.05, 0], [0, 0, 0], 0.8);
        m['core'] = T([0, 1.55, 0], [0, 0, 0], 0.75);
        m['mast'] = T([0, -0.7, 0], [0, 0, 0], 0.95);
        return { m, cam: [3.1, 1.7, 5.2], look: [0, 0.5, 0], rig: [-1.6, -0.4, 0] };
      },
      // 7 — camera runs straight through the aperture
      () => {
        const m: Record<string, Transform> = {};
        byGroup('petal').forEach((p) => { const i = idx(p), a = i / PETALS * TAU;
          m[p.name] = T([Math.cos(a) * 1.4, 0, Math.sin(a) * 1.4], [Math.PI / 2, -a + Math.PI / 2, 0], 1.1); });
        byGroup('ring').forEach((p) => { const i = idx(p);
          m[p.name] = T([0, 0, -i * 2.4], [0, 0, 0], 1.8); });
        byGroup('tick').forEach((p) => { const i = idx(p), a = i / TICKS * TAU;
          m[p.name] = T([Math.cos(a) * 2.1, Math.sin(a) * 2.1, -1.2 - i * 0.4], [0, 0, -a], 1); });
        byGroup('lens').forEach((p) => m[p.name] = T([0, 0, -7 - idx(p) * 1.2], [Math.PI / 2, 0, 0], 1.4));
        byGroup('shard').forEach((p) => { const i = idx(p), a = i / SHARDS * TAU;
          m[p.name] = T([Math.cos(a) * 3, Math.sin(a) * 3, -0.5 - i * 0.7], [0, 0, a], 0.34); });
        m['hand-hour'] = T([0, 0, -9.5], [0, 0, 0.6], 1);
        m['hand-minute'] = T([0, 0, -9.5], [0, 0, -1.4], 1);
        m['core'] = T([0, 0, -11.5], [0, 0, 0], 1.1);
        m['mast'] = T([0, 0, -13], [Math.PI / 2, 0, 0], 1);
        return { m, cam: [0, 0, 2.2], look: [0, 0, -8], rig: [0, 0, 0] };
      },
      // 8 — the network: a scattered constellation grid
      () => {
        const m: Record<string, Transform> = {};
        const grid = (_n: number, i: number) => { const c = 5, x = i % c - (c - 1) / 2, y = Math.floor(i / c) % 3 - 1, z = Math.floor(i / (c * 3));
          return [x * 1.15, y * 1.15, -z * 1.3]; };
        parts.forEach((p, i) => {
          if (p.userData.group === 'mast') { m[p.name] = HIDE; return; }
          const g = grid(0, i);
          const j = rnd(i, 7);
          m[p.name] = T([g[0] + (j - 0.5) * 0.3, g[1] + (rnd(i, 8) - 0.5) * 0.3, g[2]],
            [rnd(i, 9) * 0.8, rnd(i, 10) * TAU, 0], p.userData.group === 'shard' ? 0.55 : 0.42);
        });
        return { m, cam: [1.2, 0.6, 6.6], look: [0, 0, -0.6], rig: [-1.4, 0, 0] };
      },
      // 9 — the quote: everything settles into a low calm arc
      () => {
        const m: Record<string, Transform> = {};
        parts.forEach((p, i) => {
          if (p.userData.group === 'mast') { m[p.name] = HIDE; return; }
          const a = (i / parts.length) * Math.PI * 1.15 + 0.3;
          m[p.name] = T([Math.cos(a) * 3.1, Math.sin(a) * 1.5 - 1.1, Math.sin(a * 1.7) * 1.4],
            [0, -a, a * 0.3], p.userData.group === 'ring' ? 0.5 : 0.45);
        });
        m['core'] = T([0, 0.35, 0.6], [0, 0, 0], 1.15);
        return { m, cam: [0, 0.5, 6.2], look: [0, -0.3, 0], rig: [0, 0, 0] };
      },
      // 10 — back to the clock, small, centred, resting
      () => {
        const m = STAGES[0]().m;
        const out: Record<string, Transform> = {};
        for (const k in m) out[k] = T(m[k].p.map((v) => v * 0.62), m[k].r, m[k].s * 0.62, m[k].o);
        return { m: out, cam: [0, 0.1, 5.4], look: [0, 0, 0], rig: [1.6, -0.15, 0] };
      },
    ];

    // ---- interpolation
    const cache = STAGES.map((f) => f());
    const a = new THREE.Vector3(), b = new THREE.Vector3(), e1 = new THREE.Euler(), e2 = new THREE.Euler();
    const q1 = new THREE.Quaternion(), q2 = new THREE.Quaternion();
    const camPos = new THREE.Vector3(...(cache[0].cam as [number, number, number]));
    const camLook = new THREE.Vector3(...(cache[0].look as [number, number, number]));
    const ease = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    function apply(t: number) {
      const i = Math.max(0, Math.min(STAGES.length - 1, Math.floor(t)));
      const j = Math.min(STAGES.length - 1, i + 1);
      const f = ease(Math.max(0, Math.min(1, t - i)));
      const A = cache[i], B = cache[j];
      for (const p of parts) {
        const ta = A.m[p.name] || HIDE, tb = B.m[p.name] || HIDE;
        a.fromArray(ta.p); b.fromArray(tb.p);
        p.position.copy(a).lerp(b, f);
        e1.set(ta.r[0], ta.r[1], ta.r[2]); e2.set(tb.r[0], tb.r[1], tb.r[2]);
        q1.setFromEuler(e1); q2.setFromEuler(e2);
        p.quaternion.copy(q1).slerp(q2, f);
        const s = ta.s + (tb.s - ta.s) * f;
        p.scale.setScalar(Math.max(0.0001, s));
        p.visible = s > 0.005;
      }
      camPos.set(
        A.cam[0] + (B.cam[0] - A.cam[0]) * f,
        A.cam[1] + (B.cam[1] - A.cam[1]) * f,
        A.cam[2] + (B.cam[2] - A.cam[2]) * f);
      camLook.set(
        A.look[0] + (B.look[0] - A.look[0]) * f,
        A.look[1] + (B.look[1] - A.look[1]) * f,
        A.look[2] + (B.look[2] - A.look[2]) * f);
      rig.position.set(
        A.rig[0] + (B.rig[0] - A.rig[0]) * f,
        A.rig[1] + (B.rig[1] - A.rig[1]) * f,
        A.rig[2] + (B.rig[2] - A.rig[2]) * f);
      rig.rotation.y = t * 0.22;
      rig.rotation.x = Math.sin(t * 0.7) * 0.06;
    }

    // ---- horizontal side control: LandingPage sets window.__sculptSideX (world
    // units, + = right / - = left) per active section so the object sits in the
    // EMPTY half beside the text. We override the stage's own x with this,
    // smoothed, so placement is deterministic regardless of the morph stage.
    const w = window as unknown as { __sculptSideX?: number };
    let sideTarget = typeof w.__sculptSideX === 'number' ? w.__sculptSideX : 0;
    let sideCurrent = sideTarget;

    // ---- scroll driving (Lenis updates window.scrollY, so this reads it directly)
    let target = 0, current = 0;
    function readScroll() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      target = p * (STAGES.length - 1);
    }
    window.addEventListener('scroll', readScroll, { passive: true });

    let pointerX = 0, pointerY = 0, pointerMovedAt = 0;
    const onPointer = (ev: PointerEvent) => {
      pointerX = (ev.clientX / window.innerWidth - 0.5) * 2;
      pointerY = (ev.clientY / window.innerHeight - 0.5) * 2;
      pointerMovedAt = performance.now();
    };
    window.addEventListener('pointermove', onPointer, { passive: true });

    function resize() {
      const w = window.innerWidth, h = window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', resize);
    resize(); readScroll();
    current = target;

    let paused = false;
    let warmup = 90; // render the opening frames so the object appears + settles
    const onVisibility = () => { paused = document.hidden; };
    document.addEventListener('visibilitychange', onVisibility);

    renderer.setAnimationLoop(() => {
      if (paused) return;
      if (typeof w.__sculptSideX === 'number') sideTarget = w.__sculptSideX;
      // Idle-skip: when nothing is moving (no scroll morph, no side-shift, no
      // recent pointer motion), don't render at all — keeps the GPU quiet and
      // scrolling smooth. The object is otherwise static between sections.
      const scrolling = Math.abs(target - current) > 0.0006;
      const sliding = Math.abs(sideTarget - sideCurrent) > 0.0006;
      const pointering = performance.now() - pointerMovedAt < 450;
      if (warmup > 0) warmup--;
      else if (!scrolling && !sliding && !pointering) return;

      current += (target - current) * 0.085;
      if (!scrolling) current = target;
      sideCurrent += (sideTarget - sideCurrent) * 0.06;
      if (!sliding) sideCurrent = sideTarget;
      apply(current);
      // Override the stage's horizontal placement with the section's target side
      // so the object always sits in the text's empty half. Pushed a touch
      // harder on wider screens; never fully centred where it'd overlap.
      const aspect = camera.aspect;
      const push = 0.72 + 0.36 * Math.max(0, Math.min(1, (aspect - 1.1) / 0.7));
      rig.position.x = sideCurrent * push;
      const back = 1 + Math.max(0, 1.6 - aspect) * 0.45;
      camera.position.set(camPos.x + pointerX * 0.32, camPos.y - pointerY * 0.22, camPos.z * back);
      camera.lookAt(camLook);
      renderer.render(scene, camera);
    });

    return () => {
      renderer.setAnimationLoop(null);
      window.removeEventListener('scroll', readScroll);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
      disposables.forEach((g) => g.dispose());
      Object.values(M).forEach((mat) => mat.dispose());
      (ground.material as THREE.Material).dispose();
      ground.geometry.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas id="o-scene" ref={canvasRef} aria-hidden="true" />;
}
