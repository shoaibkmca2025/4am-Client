import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

// Configuration
const CONFIG = {
  globeColor: '#050B12',
  globeEmissive: '#0a1a2f',
  atmosphereColor: '#00D1FF',
  pointColor: '#00F0FF',
  connectionColor: '#00D1FF',
  connectionOpacity: 0.15,
  particleColor: '#ffffff',
  rotationSpeed: 0.05,
};

// Types
interface Point {
  lat: number;
  lng: number;
  size: number;
  label?: string;
}

// Extensive City List to Outline Continents and Key Hubs
const CITIES: Point[] = [
  // North America
  { lat: 40.7128, lng: -74.0060, size: 1.2, label: "New York" },
  { lat: 34.0522, lng: -118.2437, size: 1, label: "Los Angeles" },
  { lat: 41.8781, lng: -87.6298, size: 1 }, // Chicago
  { lat: 25.7617, lng: -80.1918, size: 1 }, // Miami
  { lat: 49.2827, lng: -123.1207, size: 1 }, // Vancouver
  { lat: 43.6532, lng: -79.3832, size: 1 }, // Toronto
  { lat: 19.4326, lng: -99.1332, size: 1.1 }, // Mexico City
  { lat: 37.7749, lng: -122.4194, size: 1 }, // San Francisco
  { lat: 29.7604, lng: -95.3698, size: 1 }, // Houston
  
  // South America
  { lat: -23.5505, lng: -46.6333, size: 1.1, label: "São Paulo" },
  { lat: -34.6037, lng: -58.3816, size: 1 }, // Buenos Aires
  { lat: -33.4489, lng: -70.6693, size: 1 }, // Santiago
  { lat: -12.0464, lng: -77.0428, size: 1 }, // Lima
  { lat: 4.7110, lng: -74.0721, size: 1 }, // Bogotá
  { lat: -22.9068, lng: -43.1729, size: 1 }, // Rio de Janeiro

  // Europe
  { lat: 51.5074, lng: -0.1278, size: 1.2, label: "London" },
  { lat: 48.8566, lng: 2.3522, size: 1.1, label: "Paris" },
  { lat: 52.5200, lng: 13.4050, size: 1 }, // Berlin
  { lat: 41.9028, lng: 12.4964, size: 1 }, // Rome
  { lat: 40.4168, lng: -3.7038, size: 1 }, // Madrid
  { lat: 55.7558, lng: 37.6173, size: 1.1, label: "Moscow" },
  { lat: 59.3293, lng: 18.0686, size: 1 }, // Stockholm
  { lat: 52.2297, lng: 21.0122, size: 1 }, // Warsaw
  { lat: 37.9838, lng: 23.7275, size: 1 }, // Athens
  { lat: 50.4501, lng: 30.5234, size: 1 }, // Kyiv
  { lat: 41.0082, lng: 28.9784, size: 1 }, // Istanbul

  // Africa
  { lat: 30.0444, lng: 31.2357, size: 1.1, label: "Cairo" },
  { lat: -26.2041, lng: 28.0473, size: 1.1, label: "Johannesburg" },
  { lat: 6.5244, lng: 3.3792, size: 1 }, // Lagos
  { lat: -1.2921, lng: 36.8219, size: 1 }, // Nairobi
  { lat: 33.5731, lng: -7.5898, size: 1 }, // Casablanca
  { lat: 9.0820, lng: 8.6753, size: 1 }, // Abuja
  { lat: -4.4419, lng: 15.2663, size: 1 }, // Kinshasa

  // Middle East
  { lat: 25.2048, lng: 55.2708, size: 1.1, label: "Dubai" },
  { lat: 24.7136, lng: 46.6753, size: 1 }, // Riyadh
  { lat: 32.0853, lng: 34.7818, size: 1 }, // Tel Aviv
  { lat: 35.6892, lng: 51.3890, size: 1 }, // Tehran

  // Asia
  { lat: 35.6762, lng: 139.6503, size: 1.2, label: "Tokyo" },
  { lat: 39.9042, lng: 116.4074, size: 1.1, label: "Beijing" },
  { lat: 31.2304, lng: 121.4737, size: 1.1 }, // Shanghai
  { lat: 22.3193, lng: 114.1694, size: 1.1, label: "Hong Kong" },
  { lat: 1.3521, lng: 103.8198, size: 1.1, label: "Singapore" },
  { lat: 19.0760, lng: 72.8777, size: 1.1, label: "Mumbai" },
  { lat: 28.6139, lng: 77.2090, size: 1 }, // New Delhi
  { lat: 13.7563, lng: 100.5018, size: 1 }, // Bangkok
  { lat: 37.5665, lng: 126.9780, size: 1 }, // Seoul
  { lat: -6.2088, lng: 106.8456, size: 1 }, // Jakarta
  { lat: 14.5995, lng: 120.9842, size: 1 }, // Manila
  { lat: 23.8103, lng: 90.4125, size: 1 }, // Dhaka
  { lat: 10.8231, lng: 106.6297, size: 1 }, // Ho Chi Minh City

  // Oceania
  { lat: -33.8688, lng: 151.2093, size: 1.1, label: "Sydney" },
  { lat: -37.8136, lng: 144.9631, size: 1 }, // Melbourne
  { lat: -36.8485, lng: 174.7633, size: 1 }, // Auckland
  { lat: -31.9505, lng: 115.8605, size: 1 }, // Perth
];

// Helper: Convert Lat/Lng to Vector3
const latLngToVector3 = (lat: number, lng: number, radius: number) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
};

// Component: Globe Mesh
const Globe: React.FC<{ isMobile: boolean; animate: boolean }> = ({ isMobile, animate }) => {
  const specularColor = useMemo(() => new THREE.Color("#222222"), []);
  const wireMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const atmosphereMaterialRef = useRef<THREE.MeshBasicMaterial>(null);

  useEffect(() => {
    if (!animate) return;
    const tweens: gsap.core.Tween[] = [];

    if (wireMaterialRef.current) {
      tweens.push(
        gsap.to(wireMaterialRef.current, {
          opacity: 0.06,
          duration: 3.2,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
        })
      );
    }

    if (atmosphereMaterialRef.current) {
      tweens.push(
        gsap.to(atmosphereMaterialRef.current, {
          opacity: 0.14,
          duration: 3.6,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
        })
      );
    }

    return () => {
      tweens.forEach((t) => t.kill());
    };
  }, [animate]);

  return (
    <group>
      {/* Core Sphere - Dark Tech Look */}
      <Sphere args={[5, isMobile ? 32 : 64, isMobile ? 32 : 64]}>
        <meshPhongMaterial 
          color={CONFIG.globeColor} 
          emissive={CONFIG.globeEmissive}
          emissiveIntensity={0.6}
          shininess={60}
          specular={specularColor}
        />
      </Sphere>
      
      {/* Subtle Wireframe Overlay for Cyber feel */}
      <Sphere args={[5.01, isMobile ? 18 : 32, isMobile ? 18 : 32]}>
        <meshBasicMaterial 
          ref={wireMaterialRef}
          color={CONFIG.connectionColor} 
          wireframe 
          transparent 
          opacity={0.03} 
        />
      </Sphere>

      {/* Atmosphere Glow */}
      <Sphere args={[5.2, isMobile ? 32 : 64, isMobile ? 32 : 64]}>
        <meshBasicMaterial 
          ref={atmosphereMaterialRef}
          color={CONFIG.atmosphereColor} 
          transparent 
          opacity={0.08} 
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>
    </group>
  );
};

// Component: City Points (Simplified for Stability)
const CityPoints: React.FC<{ isMobile: boolean }> = ({ isMobile }) => {
  const points = useMemo(() => {
    return CITIES.map(city => ({
      pos: latLngToVector3(city.lat, city.lng, 5.05),
      size: city.size
    }));
  }, []);

  return (
    <group>
      {points.map((p, i) => (
        <mesh key={i} position={p.pos}>
          <sphereGeometry args={[0.04 * p.size, isMobile ? 10 : 16, isMobile ? 10 : 16]} />
          <meshBasicMaterial color={CONFIG.pointColor} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
};

// Component: High-Density Connections (Single Mesh for Performance)
const Connections: React.FC<{ isMobile: boolean }> = ({ isMobile }) => {
  const { geometry, material } = useMemo(() => {
    const points: number[] = [];
    
    // Connect each city to MULTIPLE neighbors to create a dense web
    CITIES.forEach((start, i) => {
      const startPos = latLngToVector3(start.lat, start.lng, 5);
      
      // Find valid targets (exclude self)
      const targets = CITIES.filter((_, j) => i !== j);
      
      // Create MORE connections per city (3-5) for density
      // Prioritize closer cities but allow some long-distance ones
      targets.sort((a, b) => {
        const posA = latLngToVector3(a.lat, a.lng, 5);
        const posB = latLngToVector3(b.lat, b.lng, 5);
        return startPos.distanceTo(posA) - startPos.distanceTo(posB);
      });

      // Connect to 2 closest + 2 random far ones
      const selectedTargets = [
        ...targets.slice(0, isMobile ? 1 : 2),
        ...targets.slice(Math.floor(targets.length / 2), Math.floor(targets.length / 2) + (isMobile ? 1 : 2))
      ];
      
      selectedTargets.forEach((end) => {
        const endPos = latLngToVector3(end.lat, end.lng, 5);
        const distance = startPos.distanceTo(endPos);
        
        // Calculate curve points
        const midPoint = startPos.clone().add(endPos).multiplyScalar(0.5).normalize().multiplyScalar(5 + distance * (isMobile ? 0.35 : 0.5)); // Higher arc for longer distance
        const curve = new THREE.QuadraticBezierCurve3(startPos, midPoint, endPos);
        const curvePoints = curve.getPoints(isMobile ? 18 : 28);
        
        // Push segments
        for (let k = 0; k < curvePoints.length - 1; k++) {
          points.push(curvePoints[k].x, curvePoints[k].y, curvePoints[k].z);
          points.push(curvePoints[k + 1].x, curvePoints[k + 1].y, curvePoints[k + 1].z);
          
          // Color/Opacity logic (simulated with vertex colors if needed, but for now simple color)
          // We can use the same color for all segments for simplicity and performance
        }
      });
    });
    
    if (points.length === 0) return { geometry: new THREE.BufferGeometry(), material: new THREE.LineBasicMaterial() };

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    
    const mat = new THREE.LineBasicMaterial({
      color: CONFIG.connectionColor,
      transparent: true,
      opacity: isMobile ? 0.09 : 0.15,
      blending: THREE.AdditiveBlending,
    });

    return { geometry: geo, material: mat };
  }, [isMobile]);

  useEffect(() => {
    if (!material) return;
    const baseOpacity = isMobile ? 0.09 : 0.15;
    material.opacity = baseOpacity;
    const tween = gsap.to(material, {
      opacity: isMobile ? 0.11 : 0.2,
      duration: isMobile ? 3.8 : 3.2,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
    });

    return () => {
      tween.kill();
    };
  }, [isMobile, material]);

  return <lineSegments geometry={geometry} material={material} />;
};

// Component: Country-to-country dashed routes with GSAP blinking/motion
const CountryRoutes: React.FC<{ isMobile: boolean; animate: boolean }> = ({ isMobile, animate }) => {
  const routes = useMemo(
    () =>
      [
        // USA -> UK -> UAE -> India -> Singapore -> Australia
        { from: { lat: 40.7128, lng: -74.006 }, to: { lat: 51.5074, lng: -0.1278 } }, // New York -> London
        { from: { lat: 51.5074, lng: -0.1278 }, to: { lat: 25.2048, lng: 55.2708 } }, // London -> Dubai
        { from: { lat: 25.2048, lng: 55.2708 }, to: { lat: 28.6139, lng: 77.209 } }, // Dubai -> New Delhi
        { from: { lat: 28.6139, lng: 77.209 }, to: { lat: 1.3521, lng: 103.8198 } },  // New Delhi -> Singapore
        { from: { lat: 1.3521, lng: 103.8198 }, to: { lat: -33.8688, lng: 151.2093 } }, // Singapore -> Sydney
      ] as Array<{ from: { lat: number; lng: number }; to: { lat: number; lng: number } }>,
    []
  );

  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;
    const tweens: gsap.core.Tween[] = [];

    group.children.forEach((child) => {
      const line = child as THREE.Line;
      const mat = line.material as THREE.LineDashedMaterial;
      if (!mat) return;

      // Blink opacity subtly
      tweens.push(
        gsap.to(mat, {
          opacity: isMobile ? 0.35 : 0.55,
          duration: 1.6,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
          paused: !animate,
        })
      );

      // Move dashes along the path
      // dashOffset exists on LineDashedMaterial in our three version
      (mat as any).dashOffset = 0;
      tweens.push(
        gsap.to(mat as any, {
          dashOffset: -2,
          duration: 3.5,
          repeat: -1,
          ease: 'none',
          paused: !animate,
        })
      );
    });

    return () => tweens.forEach((t) => t.kill());
  }, [animate, isMobile]);

  const lines = useMemo(() => {
    const children: React.ReactNode[] = [];
    routes.forEach((r, idx) => {
      const start = latLngToVector3(r.from.lat, r.from.lng, 5);
      const end = latLngToVector3(r.to.lat, r.to.lng, 5);
      const dist = start.distanceTo(end);
      const mid = start
        .clone()
        .add(end)
        .multiplyScalar(0.5)
        .normalize()
        .multiplyScalar(5 + dist * (isMobile ? 0.45 : 0.6));
      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const points = curve.getPoints(isMobile ? 40 : 64);

      const geo = new THREE.BufferGeometry().setFromPoints(points);
      // Required for dashed lines to compute lengths
      const line = new THREE.Line(geo, new THREE.LineDashedMaterial({
        color: CONFIG.connectionColor,
        transparent: true,
        opacity: isMobile ? 0.25 : 0.45,
        dashSize: 0.25,
        gapSize: 0.14,
        scale: 1,
      }));
      line.computeLineDistances();

      children.push(<primitive key={`route-${idx}`} object={line} />);
    });
    return children;
  }, [routes, isMobile]);

  return <group ref={groupRef}>{lines}</group>;
};

const Rings: React.FC<{ isMobile: boolean; animate: boolean }> = ({ isMobile, animate }) => {
  const groupRef = useRef<THREE.Group>(null);
  const ringCount = isMobile ? 0 : 7;
  const baseRadius = 5.04;
  const spawnEvery = 0.85;
  const speed = 0.55;

  const ringMeshes = useMemo(() => {
    const geo = new THREE.RingGeometry(0.06, 0.12, 48);
    const meshes: THREE.Mesh[] = [];
    for (let i = 0; i < ringCount; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: CONFIG.connectionColor,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.visible = false;
      meshes.push(mesh);
    }
    return { geometry: geo, meshes };
  }, [ringCount]);

  const stateRef = useRef(
    Array.from({ length: ringCount }, () => ({
      active: false,
      t: 0,
      lat: 0,
      lng: 0,
    }))
  );

  const spawnTimerRef = useRef(0);

  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;
    group.clear();
    ringMeshes.meshes.forEach((m) => group.add(m));
  }, [ringMeshes]);

  useEffect(() => {
    return () => {
      ringMeshes.geometry.dispose();
      ringMeshes.meshes.forEach((m) => (m.material as THREE.Material).dispose());
    };
  }, [ringMeshes]);

  useFrame((_, delta) => {
    if (!animate || ringCount === 0) return;
    const group = groupRef.current;
    if (!group) return;
    try {
      spawnTimerRef.current += delta;
      if (spawnTimerRef.current >= spawnEvery) {
        spawnTimerRef.current = 0;
        const idx = stateRef.current.findIndex((s) => !s.active);
        if (idx >= 0) {
          const pick = CITIES[Math.floor(Math.random() * CITIES.length)];
          const s = stateRef.current[idx];
          s.active = true;
          s.t = 0;
          s.lat = pick.lat;
          s.lng = pick.lng;

          const mesh = ringMeshes.meshes[idx];
          mesh.visible = true;
          const pos = latLngToVector3(s.lat, s.lng, baseRadius);
          const normal = pos.clone().normalize();
          mesh.position.copy(pos);
          mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
          mesh.scale.setScalar(0.01);
          const mat = mesh.material as THREE.MeshBasicMaterial;
          mat.opacity = 0.65;
        }
      }

      stateRef.current.forEach((s, i) => {
        if (!s.active) return;
        s.t += delta * speed;
        const mesh = ringMeshes.meshes[i];
        const mat = mesh.material as THREE.MeshBasicMaterial;
        const p = Math.min(s.t, 1);
        const scale = 0.15 + p * 3.6;
        mesh.scale.setScalar(scale);
        mat.opacity = (1 - p) * 0.7;
        if (s.t >= 1) {
          s.active = false;
          mesh.visible = false;
          mat.opacity = 0;
        }
      });
    } catch (e) {
      void e;
    }
  });

  return <group ref={groupRef} />;
};

// Component: Moving Particles (Simplified for Stability)
const Particles: React.FC<{ isMobile: boolean; enabled: boolean }> = ({ isMobile, enabled }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Pre-calculate paths
  const paths = useMemo(() => {
    if (!enabled) return [];
    const pathsData: { curve: THREE.QuadraticBezierCurve3, speed: number, offset: number, tailLength: number }[] = [];
    
    CITIES.forEach((start, i) => {
      const startPos = latLngToVector3(start.lat, start.lng, 5);
      const targets = CITIES.filter((_, j) => i !== j);
      
      // Create MANY particles
      targets.slice(0, isMobile ? 2 : 4).forEach((end) => {
        const endPos = latLngToVector3(end.lat, end.lng, 5);
        const distance = startPos.distanceTo(endPos);
        const midPoint = startPos.clone().add(endPos).multiplyScalar(0.5).normalize().multiplyScalar(5 + distance * (isMobile ? 0.35 : 0.5));
        const curve = new THREE.QuadraticBezierCurve3(startPos, midPoint, endPos);
        
        // Add random particles per path
        if (Math.random() > (isMobile ? 0.6 : 0.3)) {
          pathsData.push({
            curve,
            speed: (isMobile ? 0.002 : 0.003) + Math.random() * (isMobile ? 0.003 : 0.005), // Varied speeds
            offset: Math.random(),
            tailLength: 0.05 + Math.random() * 0.05 // Varied tail lengths
          });
        }
      });
    });
    return pathsData;
  }, [enabled, isMobile]);

  useFrame(() => {
    try {
      if (!enabled) return;
      const group = groupRef.current;
      if (!group) return;
      
      paths.forEach((path, i) => {
        // Update position along curve
        path.offset += path.speed;
        if (path.offset > 1) path.offset = 0;
        
        // Safety check for curve
        if (!path.curve) return;

        const pos = path.curve.getPoint(path.offset);
        const tangent = path.curve.getTangent(path.offset).normalize();
        
        const mesh = group.children[i];
        // Ensure mesh and its properties exist before accessing
        if (mesh && mesh.position && mesh.quaternion && mesh.scale) {
          mesh.position.copy(pos);
          if (tangent.lengthSq() > 0.01) {
              mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent);
          }
          
          // Scale effect
          const scale = Math.sin(path.offset * Math.PI); 
          if (!isNaN(scale)) {
            mesh.scale.set(scale, isMobile ? 2.4 : 3, scale);
          }
        }
      });
    } catch (e) {
      // Suppress animation errors to prevent crash
    }
  });

  return (
    <group ref={groupRef}>
        {paths.map((_, i) => (
            <mesh key={i}>
                <cylinderGeometry args={[0.02, 0.02, 0.3, isMobile ? 4 : 6]} />
                <meshBasicMaterial color={CONFIG.particleColor} toneMapped={false} transparent opacity={0.8} />
            </mesh>
        ))}
    </group>
  );
};

// Main Scene Component
const EarthScene: React.FC<{ isMobile: boolean; animate: boolean }> = ({ isMobile, animate }) => {
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!animate) return;
    const group = groupRef.current;
    if (!group) return;

    const tween = gsap.to(group.rotation, {
      y: `+=${Math.PI * 2}`,
      duration: 120,
      ease: 'none',
      repeat: -1,
    });

    return () => {
      tween.kill();
    };
  }, [animate]);

  return (
    <group ref={groupRef} rotation={[0.3, 0, 0]}> {/* Tilt */}
      <Globe isMobile={isMobile} animate={animate} />
      <CityPoints isMobile={isMobile} />
      <Connections isMobile={isMobile} />
      <CountryRoutes isMobile={isMobile} animate={animate && !isMobile} />
      <Rings isMobile={isMobile} animate={animate && !isMobile} />
      <Particles isMobile={isMobile} enabled={false} />
    </group>
  );
};

const StarField: React.FC<{ isMobile: boolean }> = ({ isMobile }) => {
  const { geometry, material } = useMemo(() => {
    const count = isMobile ? 140 : 280;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3 + 0] = (Math.random() - 0.5) * 60;
      positions[i3 + 1] = (Math.random() - 0.5) * 60;
      positions[i3 + 2] = (Math.random() - 0.5) * 40 - 15;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: '#ffffff',
      size: isMobile ? 0.09 : 0.06,
      sizeAttenuation: true,
      transparent: true,
      opacity: isMobile ? 0.22 : 0.35,
      depthWrite: false,
    });
    return { geometry: geo, material: mat };
  }, [isMobile]);

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  return <points geometry={geometry} material={material} />;
};

const GlobalNetworkBackground: React.FC = () => {
  const isMobile = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(max-width: 640px)').matches;
  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-[#050B12] pointer-events-none">
      <Canvas 
        style={{ pointerEvents: 'none' }}
        camera={{ position: [0, 0, 13], fov: 45 }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
          toneMapping: THREE.NoToneMapping,
        }}
        dpr={1} // Force 1x pixel ratio for performance
      >
        <fog attach="fog" args={['#050B12', 10, 25]} />
        <ambientLight intensity={0.6} color="#00D1FF" />
        <pointLight position={[15, 15, 15]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00D1FF" />
        
        <EarthScene isMobile={isMobile} animate={!prefersReducedMotion && !isMobile} />
        
        <StarField isMobile={isMobile} />
      </Canvas>
      
      {/* Overlay gradient for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050B12] via-transparent to-[#050B12]/80 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050B12_100%)] pointer-events-none opacity-40" />
    </div>
  );
};

export default GlobalNetworkBackground;
