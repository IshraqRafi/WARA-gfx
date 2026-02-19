"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.cjs";
import { useState, useRef, Suspense, useEffect } from "react";
import * as THREE from "three";

function Particles(props: any) {
    const ref = useRef<THREE.Points>(null!);
    const [sphere] = useState(() =>
        random.inSphere(new Float32Array(6000), { radius: 1.5 })
    );

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 10;
            ref.current.rotation.y -= delta / 15;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points
                ref={ref}
                positions={sphere as Float32Array}
                stride={3}
                frustumCulled={false}
                {...props}
            >
                <PointMaterial
                    transparent
                    color="#ffffff"
                    size={0.002}
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={0.3}
                />
            </Points>
        </group>
    );
}

function SoftFog() {
    const groupRef = useRef<THREE.Group>(null!);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.z = state.clock.getElapsedTime() * 0.05;
            groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.1;
        }
    });

    return (
        <group ref={groupRef}>
            <mesh position={[-2, -1, 0]} rotation={[0, 0, 0]}>
                <planeGeometry args={[10, 10]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.02} blending={THREE.AdditiveBlending} depthWrite={false} />
            </mesh>
            <mesh position={[2, 1, -1]} rotation={[0, 0, 1]}>
                <circleGeometry args={[5, 64]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.01} blending={THREE.AdditiveBlending} depthWrite={false} />
            </mesh>
        </group>
    );
}

export default function CinematicBackground() {
    const containerRef = useRef<HTMLDivElement>(null);

    // Track mouse movement for spotlight effect
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;
            const x = e.clientX;
            const y = e.clientY;
            containerRef.current.style.setProperty("--mouse-x", `${x}px`);
            containerRef.current.style.setProperty("--mouse-y", `${y}px`);
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <div ref={containerRef} className="fixed inset-0 -z-10 bg-[#050505]">
            {/* Film Grain Overlay */}
            <div className="absolute inset-0 z-20 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

            {/* Spotlight / Mouse-reactive Glow */}
            <div
                className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-300"
                style={{
                    background: "radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.06), transparent 40%)"
                }}
            />

            <Canvas camera={{ position: [0, 0, 1] }} gl={{ antialias: true }}>
                <Suspense fallback={null}>
                    <fog attach="fog" args={['#050505', 0, 5]} />
                    <Particles />
                    <SoftFog />
                </Suspense>
            </Canvas>
        </div>
    );
}
