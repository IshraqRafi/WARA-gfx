"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { ExternalLink, PlayCircle } from "lucide-react";

interface ProjectProps {
    project: {
        id: number;
        category: string;
        title: string;
        link: string;
        color: string;
        aspectRatio: string;
        hex?: string; // Added optional hex
        imageUrl?: string;
    };
}

export default function ProjectCard({ project }: ProjectProps) {
    // ... (Hooks)
    const ref = useRef<HTMLAnchorElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    // ... (Framer Motion Logic from previous step remains the same)
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
    const mouseY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["7deg", "-7deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-7deg", "7deg"]);
    const scale = useSpring(1, { stiffness: 150, damping: 15 });

    // Glare Effect
    const glareX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);
    const glareY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]);
    const glare = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.4), transparent 50%)`;

    const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        // Calculate mouse position relative to center (-0.5 to 0.5)
        const mouseXRel = (e.clientX - rect.left) / width - 0.5;
        const mouseYRel = (e.clientY - rect.top) / height - 0.5;

        x.set(mouseXRel);
        y.set(mouseYRel);
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
        scale.set(1.05);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        x.set(0);
        y.set(0);
        scale.set(1);
    };

    // Glitch Animation Variants
    const glitchVariants = {
        hidden: { opacity: 0, x: 0 },
        visible: {
            opacity: [0, 1, 1, 0],
            x: [0, -5, 5, -5, 5, 0],
            filter: ["none", "hue-rotate(90deg)", "hue-rotate(0deg)"],
            transition: { duration: 0.3, times: [0, 0.2, 0.8, 1] }
        }
    };

    return (
        <motion.a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            ref={ref}
            style={{
                rotateX,
                rotateY,
                scale,
                transformStyle: "preserve-3d",
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`relative ${project.aspectRatio} w-full block group`}
        >
            <div
                className={`absolute inset-0 rounded-2xl overflow-hidden border border-white/10 bg-black/50 backdrop-blur-sm transition-all duration-300 ${project.color}`}
                style={{ transform: "translateZ(20px)" }} // Added depth
            >
                {/* Background Image (If provided) */}
                {project.imageUrl && (
                    <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="absolute inset-0 w-full h-full object-cover transition-all duration-500 scale-100 group-hover:scale-105 group-hover:brightness-50"
                    />
                )}

                {/* Cinematic Glare Overlay */}
                <motion.div
                    className="absolute inset-0 z-20 pointer-events-none mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: glare }}
                />

                {/* Glitch Overlay (appears on hover start) */}
                <AnimatePresence>
                    {isHovered && (
                        <motion.div
                            variants={glitchVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            className="absolute inset-0 z-30 bg-white/10 mix-blend-overlay pointer-events-none"
                        />
                    )}
                </AnimatePresence>

                {/* Interactive Content Container - Hidden by default, appears on hover */}
                <div
                    className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ transform: "translateZ(30px)" }}
                >
                    <motion.div
                        initial={{ y: 20 }}
                        animate={{ y: isHovered ? 0 : 20 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col items-center"
                    >
                        <PlayCircle className="w-12 h-12 text-white/50 mb-3" />
                        <h3 className="text-xl font-bold text-white/95 leading-tight">{project.title}</h3>
                        <span className="text-xs text-white/60 uppercase tracking-widest mt-1 mb-4">{project.category}</span>

                        <div className="flex items-center gap-2 text-white bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 hover:bg-white/20 transition-colors">
                            <span className="text-sm font-semibold tracking-wide">
                                {project.category.toLowerCase().includes('youtube') ? 'View Video' : 'View Reel'}
                            </span>
                            <ExternalLink className="w-4 h-4" />
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.a>
    );
}
