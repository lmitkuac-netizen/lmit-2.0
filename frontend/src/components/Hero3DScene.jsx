import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, ContactShadows, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

const AbstractShape = () => {
  const meshRef = useRef(null);
  const [hovered, setHover] = useState(false);

  // Subtle rotation animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      
      // Gently move the mesh based on mouse position
      const targetX = (state.mouse.x * 2) / 2;
      const targetY = (state.mouse.y * 2) / 2;
      meshRef.current.position.x += (targetX - meshRef.current.position.x) * 0.05;
      meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.05;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
        scale={hovered ? 1.1 : 1}
      >
        <icosahedronGeometry args={[2, 1]} />
        <meshPhysicalMaterial 
          color={hovered ? "#06b6d4" : "#6366f1"} // Cyan on hover, Indigo normally
          wireframe={true}
          roughness={0.1}
          metalness={0.8}
          transparent={true}
          opacity={0.6}
        />
      </mesh>
      
      {/* Inner glowing core */}
      <Sphere args={[1.2, 32, 32]}>
        <MeshDistortMaterial 
          color="#38bdf8" 
          attach="material" 
          distort={0.4} 
          speed={2} 
          roughness={0} 
          transparent={true} 
          opacity={0.8} 
        />
      </Sphere>
    </Float>
  );
};

const Hero3DScene = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-auto">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <pointLight position={[-10, -10, -5]} intensity={1} color="#06b6d4" />
        
        <AbstractShape />
        
        <Environment preset="city" />
        <ContactShadows position={[0, -3.5, 0]} opacity={0.4} scale={20} blur={2} far={4} />
      </Canvas>
    </div>
  );
};

export default Hero3DScene;
