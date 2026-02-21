"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { getModelUrl } from "@/lib/modelUrl";

["scrolliocore1", "scrolliocore2", "scrolliokids1", "scrolliokids2"].forEach((name) =>
  useGLTF.preload(getModelUrl(`/models/${name}.glb`))
);

const ROTATE_SPEED = 0.12; // radians per second — slow 360° spin

function Model({
  url,
  position = [0, 0, 0],
  scale = 1,
  rotation = [0, 0, 0],
  floatSpeed = 1,
  floatAmplitude = 0.06,
}: {
  url: string;
  position?: [number, number, number];
  scale?: number;
  rotation?: [number, number, number];
  floatSpeed?: number;
  floatAmplitude?: number;
}) {
  const { scene } = useGLTF(url);
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.rotation.y = clock.elapsedTime * ROTATE_SPEED;
  });

  return (
    <group ref={group} position={position} rotation={rotation} scale={scale}>
      <primitive object={scene.clone()} />
    </group>
  );
}

export interface ModelConfig {
  url: string;
  position?: [number, number, number];
  scale?: number;
  rotation?: [number, number, number];
  floatSpeed?: number;
  floatAmplitude?: number;
}

export default function ModelViewer({
  models,
  cameraPosition = [0, 0.3, 4.2],
  fov = 52,
}: {
  models: ModelConfig[];
  cameraPosition?: [number, number, number];
  fov?: number;
}) {
  return (
    <Canvas
      camera={{ position: cameraPosition, fov }}
      style={{ width: "100%", height: "100%" }}
      gl={{ antialias: true, alpha: true }}
    >
      {/* Balanced for light pastel backgrounds */}
      <ambientLight intensity={0.65} />
      <directionalLight position={[3, 7, 4]} intensity={1.0} castShadow />
      <directionalLight position={[-4, 3, -2]} intensity={0.35} color="#e0e7ff" />
      <pointLight position={[0, -1, 3]} intensity={0.15} color="#fff" />

      {/* Models — Suspense fallback is null so nothing shows during load */}
      <Suspense fallback={null}>
        {models.map((m, i) => (
          <Model key={i} {...m} />
        ))}
        <Environment preset="studio" />
      </Suspense>

      {/* Floor shadow — visible on both Core and Kids pastel orange background */}
      <ContactShadows
        position={[0, -1.0, 0]}
        opacity={0.28}
        scale={10}
        blur={2.5}
        far={2}
      />
    </Canvas>
  );
}
