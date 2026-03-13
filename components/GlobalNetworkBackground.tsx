import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Point {
  lat: number;
  lng: number;
  size: number;
}

interface CountryLabel {
  name: string;
  lat: number;
  lng: number;
}

interface GlobalNetworkBackgroundProps {
  paused?: boolean;
}

const CONFIG = {
  globeColor: '#040A12',
  globeEmissive: '#0a1a2f',
  wireColor: '#00C9FF',
  atmosphereColor: '#00D1FF',
  pointColor: '#00F0FF',
  connectionColor: '#00D1FF',
};

const CITIES: Point[] = [
  { lat: 40.7128, lng: -74.006, size: 1.2 },   // New York
  { lat: 34.0522, lng: -118.2437, size: 1.1 }, // Los Angeles
  { lat: 37.7749, lng: -122.4194, size: 1.0 }, // San Francisco
  { lat: 41.8781, lng: -87.6298, size: 1.0 },  // Chicago
  { lat: 25.7617, lng: -80.1918, size: 1.0 },  // Miami
  { lat: 43.6532, lng: -79.3832, size: 1.0 },  // Toronto
  { lat: 19.4326, lng: -99.1332, size: 1.0 },  // Mexico City
  { lat: -23.5505, lng: -46.6333, size: 1.1 }, // Sao Paulo
  { lat: -34.6037, lng: -58.3816, size: 1.0 }, // Buenos Aires
  { lat: 51.5074, lng: -0.1278, size: 1.2 },   // London
  { lat: 48.8566, lng: 2.3522, size: 1.1 },    // Paris
  { lat: 52.52, lng: 13.405, size: 1.0 },      // Berlin
  { lat: 41.9028, lng: 12.4964, size: 1.0 },   // Rome
  { lat: 40.4168, lng: -3.7038, size: 1.0 },   // Madrid
  { lat: 59.3293, lng: 18.0686, size: 0.95 },  // Stockholm
  { lat: 30.0444, lng: 31.2357, size: 1.0 },   // Cairo
  { lat: 6.5244, lng: 3.3792, size: 0.95 },    // Lagos
  { lat: -26.2041, lng: 28.0473, size: 1.0 },  // Johannesburg
  { lat: 25.2048, lng: 55.2708, size: 1.1 },   // Dubai
  { lat: 24.7136, lng: 46.6753, size: 0.95 },  // Riyadh
  { lat: 19.076, lng: 72.8777, size: 1.05 },   // Mumbai
  { lat: 28.6139, lng: 77.209, size: 1.0 },    // New Delhi
  { lat: 1.3521, lng: 103.8198, size: 1.1 },   // Singapore
  { lat: 13.7563, lng: 100.5018, size: 0.95 }, // Bangkok
  { lat: 22.3193, lng: 114.1694, size: 1.1 },  // Hong Kong
  { lat: 31.2304, lng: 121.4737, size: 1.05 }, // Shanghai
  { lat: 39.9042, lng: 116.4074, size: 1.1 },  // Beijing
  { lat: 35.6762, lng: 139.6503, size: 1.2 },  // Tokyo
  { lat: 37.5665, lng: 126.978, size: 1.0 },   // Seoul
  { lat: -6.2088, lng: 106.8456, size: 0.95 }, // Jakarta
  { lat: -33.8688, lng: 151.2093, size: 1.1 }, // Sydney
  { lat: -37.8136, lng: 144.9631, size: 1.0 }, // Melbourne
];

const ROUTES = [
  [40.7128, -74.006, 51.5074, -0.1278],   // NY -> London
  [51.5074, -0.1278, 25.2048, 55.2708],   // London -> Dubai
  [25.2048, 55.2708, 19.076, 72.8777],    // Dubai -> Mumbai
  [19.076, 72.8777, 1.3521, 103.8198],    // Mumbai -> Singapore
  [1.3521, 103.8198, 35.6762, 139.6503],  // Singapore -> Tokyo
  [35.6762, 139.6503, -33.8688, 151.2093] // Tokyo -> Sydney
];

const COUNTRY_LABELS: CountryLabel[] = [
  { name: 'USA', lat: 38.5, lng: -98.0 },
  { name: 'Canada', lat: 57.0, lng: -106.0 },
  { name: 'Brazil', lat: -14.0, lng: -52.0 },
  { name: 'UK', lat: 54.0, lng: -2.5 },
  { name: 'France', lat: 46.2, lng: 2.2 },
  { name: 'Germany', lat: 51.1, lng: 10.4 },
  { name: 'Egypt', lat: 26.8, lng: 30.8 },
  { name: 'UAE', lat: 23.4, lng: 53.8 },
  { name: 'India', lat: 21.0, lng: 78.0 },
  { name: 'China', lat: 35.8, lng: 103.8 },
  { name: 'Japan', lat: 36.2, lng: 138.2 },
  { name: 'Australia', lat: -25.0, lng: 133.0 },
];

const latLngToVector3 = (lat: number, lng: number, radius: number) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
};

const Globe: React.FC<{ isMobile: boolean; paused: boolean }> = ({ isMobile, paused }) => {
  const specular = useMemo(() => new THREE.Color('#1f2f45'), []);
  const wireRef = useRef<THREE.MeshBasicMaterial>(null);
  const atmosphereRef = useRef<THREE.MeshBasicMaterial>(null);
  const rimRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(({ clock }) => {
    if (paused) return;
    const t = clock.getElapsedTime();
    if (wireRef.current) {
      wireRef.current.opacity = 0.035 + Math.sin(t * 1.4) * 0.012;
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.opacity = 0.08 + Math.sin(t * 1.2) * 0.016;
    }
    if (rimRef.current) {
      rimRef.current.opacity = 0.06 + Math.sin(t * 1.6) * 0.02;
    }
  });

  return (
    <group>
      <mesh>
        <sphereGeometry args={[5, isMobile ? 32 : 52, isMobile ? 32 : 52]} />
        <meshPhongMaterial
          color={CONFIG.globeColor}
          emissive={CONFIG.globeEmissive}
          emissiveIntensity={0.62}
          shininess={48}
          specular={specular}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[5.01, isMobile ? 18 : 30, isMobile ? 18 : 30]} />
        <meshBasicMaterial
          ref={wireRef}
          color={CONFIG.wireColor}
          wireframe
          transparent
          opacity={0.04}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[5.2, isMobile ? 20 : 34, isMobile ? 20 : 34]} />
        <meshBasicMaterial
          ref={atmosphereRef}
          color={CONFIG.atmosphereColor}
          transparent
          opacity={0.09}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[5.28, isMobile ? 16 : 28, isMobile ? 16 : 28]} />
        <meshBasicMaterial
          ref={rimRef}
          color="#FFA347"
          transparent
          opacity={0.06}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};

const CityPoints: React.FC<{ isMobile: boolean; paused: boolean }> = ({ isMobile, paused }) => {
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const points = useMemo(
    () =>
      CITIES.map((city) => ({
        pos: latLngToVector3(city.lat, city.lng, 5.05),
        size: city.size,
      })),
    []
  );

  useFrame(({ clock }) => {
    if (paused || !materialRef.current) return;
    const t = clock.getElapsedTime();
    materialRef.current.opacity = 0.78 + Math.sin(t * 2.1) * 0.16;
  });

  return (
    <group>
      {points.map((point, index) => (
        <mesh key={index} position={point.pos}>
          <sphereGeometry args={[0.038 * point.size, isMobile ? 7 : 9, isMobile ? 7 : 9]} />
          <meshBasicMaterial
            ref={index === 0 ? materialRef : undefined}
            color={CONFIG.pointColor}
            toneMapped={false}
            transparent
            opacity={0.85}
          />
        </mesh>
      ))}
    </group>
  );
};

const Connections: React.FC<{ isMobile: boolean; paused: boolean }> = ({ isMobile, paused }) => {
  const materialRef = useRef<THREE.LineBasicMaterial>(null);
  const geometry = useMemo(() => {
    const vertices: number[] = [];
    const cityPositions = CITIES.map((city) => latLngToVector3(city.lat, city.lng, 5));
    const edges = new Set<string>();
    const neighborCount = isMobile ? 1 : 2;

    for (let i = 0; i < cityPositions.length; i += 1) {
      const distances = cityPositions
        .map((pos, index) => ({ index, dist: index === i ? Number.POSITIVE_INFINITY : cityPositions[i].distanceTo(pos) }))
        .sort((a, b) => a.dist - b.dist)
        .slice(0, neighborCount);

      distances.forEach(({ index: j }) => {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (edges.has(key)) return;
        edges.add(key);

        const start = cityPositions[i];
        const end = cityPositions[j];
        const distance = start.distanceTo(end);
        const arcHeight = 5 + distance * (isMobile ? 0.28 : 0.4);
        const mid = start.clone().add(end).multiplyScalar(0.5).normalize().multiplyScalar(arcHeight);
        const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
        const curvePoints = curve.getPoints(isMobile ? 8 : 14);

        for (let k = 0; k < curvePoints.length - 1; k += 1) {
          vertices.push(curvePoints[k].x, curvePoints[k].y, curvePoints[k].z);
          vertices.push(curvePoints[k + 1].x, curvePoints[k + 1].y, curvePoints[k + 1].z);
        }
      });
    }

    const builtGeometry = new THREE.BufferGeometry();
    builtGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    return builtGeometry;
  }, [isMobile]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame(({ clock }) => {
    if (paused || !materialRef.current) return;
    const t = clock.getElapsedTime();
    materialRef.current.opacity = (isMobile ? 0.08 : 0.13) + Math.sin(t * 1.35) * 0.02;
  });

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial
        ref={materialRef}
        color={CONFIG.connectionColor}
        transparent
        opacity={isMobile ? 0.08 : 0.13}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
};

const RouteBeams: React.FC<{ isMobile: boolean; paused: boolean }> = ({ isMobile, paused }) => {
  const routes = useMemo(
    () =>
      ROUTES.map(([sLat, sLng, eLat, eLng], index) => {
        const start = latLngToVector3(sLat, sLng, 5);
        const end = latLngToVector3(eLat, eLng, 5);
        const distance = start.distanceTo(end);
        const mid = start
          .clone()
          .add(end)
          .multiplyScalar(0.5)
          .normalize()
          .multiplyScalar(5 + distance * (isMobile ? 0.4 : 0.56));
        const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
        const points = curve.getPoints(isMobile ? 30 : 52);
        const geo = new THREE.BufferGeometry().setFromPoints(points);
        const mat = new THREE.LineDashedMaterial({
          color: index % 2 === 0 ? CONFIG.connectionColor : '#FFA347',
          transparent: true,
          opacity: isMobile ? 0.2 : 0.34,
          dashSize: 0.26,
          gapSize: 0.16,
        });
        const line = new THREE.Line(geo, mat);
        line.computeLineDistances();
        return line;
      }),
    [isMobile]
  );

  useEffect(
    () => () => {
      routes.forEach((line) => {
        line.geometry.dispose();
        (line.material as THREE.Material).dispose();
      });
    },
    [routes]
  );

  useFrame((_, delta) => {
    if (paused) return;
    routes.forEach((line) => {
      const mat = line.material as THREE.LineDashedMaterial & { dashOffset?: number };
      if (typeof mat.dashOffset === 'number') {
        mat.dashOffset -= delta * 0.7;
      }
    });
  });

  return (
    <group>
      {routes.map((line, idx) => (
        <primitive key={`beam-${idx}`} object={line} />
      ))}
    </group>
  );
};

const CountryLabels: React.FC<{ isMobile: boolean }> = ({ isMobile }) => {
  const labels = useMemo(
    () =>
      (isMobile ? COUNTRY_LABELS.slice(0, 7) : COUNTRY_LABELS).map((country) => ({
        ...country,
        pos: latLngToVector3(country.lat, country.lng, 5.42),
      })),
    [isMobile]
  );

  const labelTextures = useMemo(
    () =>
      labels.map((country) => {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 96;
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(0, 19, 32, 0.78)';
        ctx.strokeStyle = 'rgba(0, 209, 255, 0.5)';
        ctx.lineWidth = 2;
        const x = 8;
        const y = 10;
        const w = 240;
        const h = 72;
        const r = 18;
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#B8F4FF';
        ctx.font = "700 34px 'DM Sans', 'Inter', sans-serif";
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(country.name, 128, 48);

        const texture = new THREE.CanvasTexture(canvas);
        texture.anisotropy = 2;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.needsUpdate = true;
        return texture;
      }),
    [labels]
  );

  useEffect(
    () => () => {
      labelTextures.forEach((texture) => texture?.dispose());
    },
    [labelTextures]
  );

  return (
    <group>
      {labels.map((country, index) => (
        <group key={country.name} position={country.pos.toArray()}>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.026, 8, 8]} />
            <meshBasicMaterial color="#00F0FF" transparent opacity={0.85} />
          </mesh>
          {labelTextures[index] && (
            <sprite position={[0.18, 0, 0]} scale={isMobile ? [0.52, 0.2, 1] : [0.62, 0.24, 1]}>
              <spriteMaterial
                map={labelTextures[index] as THREE.Texture}
                transparent
                depthWrite={false}
                opacity={0.95}
              />
            </sprite>
          )}
        </group>
      ))}
    </group>
  );
};

const StarField: React.FC<{ isMobile: boolean }> = ({ isMobile }) => {
  const { geometry, material } = useMemo(() => {
    const count = isMobile ? 90 : 170;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i += 1) {
      const i3 = i * 3;
      positions[i3 + 0] = (Math.random() - 0.5) * 64;
      positions[i3 + 1] = (Math.random() - 0.5) * 64;
      positions[i3 + 2] = (Math.random() - 0.5) * 42 - 16;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: '#ffffff',
      size: isMobile ? 0.08 : 0.065,
      sizeAttenuation: true,
      transparent: true,
      opacity: isMobile ? 0.16 : 0.3,
      depthWrite: false,
    });

    return { geometry: geo, material: mat };
  }, [isMobile]);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material]
  );

  return <points geometry={geometry} material={material} />;
};

const EarthScene: React.FC<{ isMobile: boolean; animate: boolean; paused: boolean; showRouteBeams: boolean }> = ({
  isMobile,
  animate,
  paused,
  showRouteBeams,
}) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!animate || paused || !groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.055;
  });

  return (
    <group ref={groupRef} rotation={[0.29, 0, 0]}>
      <Globe isMobile={isMobile} paused={paused} />
      <CityPoints isMobile={isMobile} paused={paused} />
      <Connections isMobile={isMobile} paused={paused} />
      <CountryLabels isMobile={isMobile} />
      {showRouteBeams && <RouteBeams isMobile={isMobile} paused={paused} />}
    </group>
  );
};

const GlobalNetworkBackground: React.FC<GlobalNetworkBackgroundProps> = ({ paused = false }) => {
  const isMobile =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(max-width: 900px)').matches;
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTablet =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(max-width: 1200px)').matches;
  const [isTabVisible, setIsTabVisible] = useState(
    typeof document === 'undefined' ? true : document.visibilityState === 'visible'
  );

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const onVisibilityChange = () => {
      setIsTabVisible(document.visibilityState === 'visible');
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, []);

  const animate = !prefersReducedMotion && !paused && isTabVisible;

  return (
    <div className="fixed inset-0 z-[1] overflow-hidden pointer-events-none">
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
        dpr={isMobile ? 0.75 : 0.9}
        frameloop={animate ? 'always' : 'demand'}
      >
        <fog attach="fog" args={['#050B12', 10, 25]} />
        <ambientLight intensity={0.58} color="#00D1FF" />
        <pointLight position={[14, 12, 14]} intensity={1.3} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.42} color="#00D1FF" />
        <pointLight position={[8, 0, 10]} intensity={0.34} color="#FFA347" />

        <EarthScene isMobile={isMobile} animate={animate} paused={paused} showRouteBeams={!isTablet} />
        <StarField isMobile={isMobile} />
      </Canvas>

      <div className="absolute inset-0 bg-gradient-to-t from-[#050B12] via-transparent to-[#050B12]/80 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050B12_100%)] pointer-events-none opacity-40" />
    </div>
  );
};

export default GlobalNetworkBackground;
