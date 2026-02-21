"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { getModelUrl } from "@/lib/modelUrl";

const LEARNER_MODELS = ["model_teen", "model_teacher", "model_kid", "model_family"] as const;
LEARNER_MODELS.forEach((name) => useGLTF.preload(getModelUrl(`/models/${name}.glb`)));

// Diamond positions: front, right, back, left
const SLOT_POSITIONS: [number, number, number][] = [
  [0,    0,  1.6],  // 0: front (active)
  [2.2,  0, -0.8],  // 1: right
  [0,    0, -2.4],  // 2: back
  [-2.2, 0, -0.8],  // 3: left
];
const SLOT_SCALES  = [1.55, 0.95, 0.6, 0.95];  // front, right, back, left — biraz daha küçük
const SLOT_OPACITY = [1.0,  0.7,  0.25, 0.7 ];

function CharacterModel({
  url,
  slotIndex,
  userRotationY,
}: {
  url: string;
  slotIndex: number;
  userRotationY: number;
}) {
  const { scene } = useGLTF(url);
  const groupRef = useRef<THREE.Group>(null);
  const posRef = useRef<THREE.Vector3 | null>(null);
  const scaleRef = useRef<number | null>(null);
  const isFront = slotIndex === 0;

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const tp = SLOT_POSITIONS[slotIndex];
    const ts = SLOT_SCALES[slotIndex];
    const lerpSpeed = Math.min(1, delta * 5.5);

    if (!posRef.current) {
      posRef.current = new THREE.Vector3(...tp);
      scaleRef.current = ts;
    }

    posRef.current.lerp(new THREE.Vector3(...tp), lerpSpeed);
    groupRef.current.position.copy(posRef.current);

    scaleRef.current = scaleRef.current! + (ts - scaleRef.current!) * lerpSpeed;
    groupRef.current.scale.setScalar(scaleRef.current!);

    // GLB orijinal hali gibi tam karşıdan; sadece öndeki model mouse ile döner
    groupRef.current.rotation.y = isFront ? userRotationY : 0;
  });

  return (
    <group
      ref={groupRef}
      position={SLOT_POSITIONS[slotIndex]}
      scale={SLOT_SCALES[slotIndex]}
    >
      <primitive object={scene.clone()} />
    </group>
  );
}

export interface LearnerCarousel3DProps {
  activeIndex: number;
  userRotationY?: number;
}

export default function LearnerCarousel3D({ activeIndex, userRotationY = 0 }: LearnerCarousel3DProps) {
  const URLS = LEARNER_MODELS.map((name) => getModelUrl(`/models/${name}.glb`));

  return (
    <Canvas
      camera={{ position: [0, 0.5, 6.8], fov: 46 }}
      style={{ width: "100%", height: "100%" }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 8, 5]}  intensity={1.1} castShadow />
      <directionalLight position={[-4, 3, -2]} intensity={0.4} color="#e0e7ff" />

      <Suspense fallback={null}>
        {URLS.map((url, i) => {
          const slotIndex = (i - activeIndex + 4) % 4;
          return (
            <CharacterModel
              key={url}
              url={url}
              slotIndex={slotIndex}
              userRotationY={userRotationY}
            />
          );
        })}
        <Environment preset="studio" />
      </Suspense>

      <ContactShadows
        position={[0, -1.1, 0]}
        opacity={0.22}
        scale={14}
        blur={3}
        far={2.5}
      />
    </Canvas>
  );
}
