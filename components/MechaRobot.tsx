import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useAnimations, Environment, Lightformer } from '@react-three/drei';
import { clone as skeletonClone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import * as THREE from 'three';

// Self-hosted Draco decoder (public/draco) — no external CDN dependency.
const MODEL = '/models/mecha.glb';
const DRACO = '/draco/';
useGLTF.preload(MODEL, DRACO);

interface Props { morphRef: React.MutableRefObject<number> }

function Model({ morphRef }: Props) {
  const { scene, animations } = useGLTF(MODEL, DRACO);
  const { viewport } = useThree();
  const group = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });

  // Centre the geometry at the origin SYNCHRONOUSLY (useGLTF has already
  // resolved, so all geometry/matrices exist here) and record its unscaled
  // size. SkeletonUtils.clone (NOT scene.clone) is required — this model is a
  // rig of skinned meshes, and a plain clone leaves them bound to the ORIGINAL
  // skeleton, so group transforms (centre + fit-scale) would be ignored and
  // the robot renders at its raw pose (feet at origin, head off-canvas).
  const { object, size } = useMemo(() => {
    const clone = skeletonClone(scene);
    clone.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(clone);
    const center = box.getCenter(new THREE.Vector3());
    clone.position.sub(center); // pivot -> geometric centre
    const s = box.getSize(new THREE.Vector3());
    clone.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh && m.material) {
        const mat = m.material as THREE.MeshStandardMaterial;
        mat.envMapIntensity = 1.1; // let the baked studio env light the metal
        mat.needsUpdate = true;
      }
    });
    return { object: clone, size: s };
  }, [scene]);

  // Aspect-aware fit: scale so the FULL robot fills the frame at any
  // viewport/aspect (recomputes on resize). The robot is frozen on an
  // arms-DOWN stance (not the wide T-pose bind size we measure), so height
  // drives the size; the width guard assumes the posed silhouette is ~55% of
  // the arms-out width, keeping room for the cursor look-around.
  const fitScale = useMemo(() => {
    const byH = (viewport.height * 0.93) / (size.y || 1);
    const byW = (viewport.width * 1.0) / ((size.x * 0.55) || 1);
    return Math.min(byH, byW);
  }, [viewport.width, viewport.height, size]);

  // Freeze the model's built-in clip on a natural standing stance (instead of
  // looping the walk cycle) — this pulls the mech out of its stiff bind T-pose
  // and holds a good pose, while the cursor still turns the whole body/head.
  const { actions, names, mixer } = useAnimations(animations, group);
  useEffect(() => {
    const key = names[0];
    const action = key ? actions[key] : null;
    if (!action) return;
    action.reset().play(); // time 0 = the clip's clean, arms-down standing pose
    mixer.update(0);        // apply that pose to the skeleton
    action.paused = true;   // ...and hold it — no walking
    return () => { action.stop(); };
  }, [actions, names, mixer]);

  // Track the cursor globally (works regardless of pointer-events on the layer).
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    // 0 = hero (full look-around), 1 = backdrop (gentle, damped).
    const p = morphRef.current;
    // Body/head turn toward the cursor — the primary interaction now that the
    // walk is frozen. Larger amplitude so the movement reads clearly.
    const yaw = mouse.current.x * 0.7 * (1 - 0.6 * p);
    const pitch = mouse.current.y * 0.3 * (1 - 0.7 * p);
    g.rotation.y += (yaw - g.rotation.y) * 0.06;
    g.rotation.x += (-pitch - g.rotation.x) * 0.06;
    // Idle float (a gentle hover, not a walk). Small upward bias: the frozen
    // arms-down stance sits lower than the T-pose we centre on, so lift it to
    // balance the head/feet margins in the frame.
    g.position.y = 0.15 + Math.sin(state.clock.elapsedTime * 0.8) * 0.045;
  });

  return (
    <group ref={group} scale={fitScale}>
      <primitive object={object} />
    </group>
  );
}

export default function MechaRobot({ morphRef }: Props) {
  return (
    <Canvas
      dpr={[1, 1.25]}
      camera={{ position: [0, 0, 6.2], fov: 34 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ width: '100%', height: '100%' }}
      frameloop="always"
    >
      {/* Key + fill + brand rims */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 6, 6]} intensity={2.6} />
      <directionalLight position={[-6, 2, -4]} intensity={1.6} color="#8B5CF6" />
      <directionalLight position={[6, -2, 3]} intensity={1.0} color="#22D3EE" />
      {/* Cheap baked studio environment (no HDR download) so the metal armour
          actually reflects light instead of rendering near-black. */}
      <Environment resolution={256} frames={1}>
        <Lightformer intensity={3} position={[0, 4, 5]} scale={[12, 12, 1]} color="#ffffff" />
        <Lightformer intensity={1.6} position={[-6, 1, 2]} scale={[8, 8, 1]} color="#b9a5ff" />
        <Lightformer intensity={1.6} position={[6, 1, 2]} scale={[8, 8, 1]} color="#a5f0ff" />
        <Lightformer intensity={2} position={[0, -4, 3]} scale={[12, 6, 1]} color="#ffffff" />
      </Environment>
      <Suspense fallback={null}>
        <Model morphRef={morphRef} />
      </Suspense>
    </Canvas>
  );
}
