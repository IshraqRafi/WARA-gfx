"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProjectCard from "../ui/ProjectCard";
import { client } from "@/sanity/lib/client";
import { urlForImage } from "@/sanity/lib/image";

// TABS configuration
const tabs = [
    { id: "all", label: "ALL WORK" },
    { id: "YouTube", label: "YOUTUBE" },
    { id: "Instagram", label: "INSTAGRAM" },
    { id: "TikTok", label: "TIKTOK" },
    { id: "Reels", label: "REELS" }
];

export default function Projects() {
    const [activeTab, setActiveTab] = useState("YouTube");
    const [projects, setProjects] = useState<any[]>([]);
    const [hoveredProject, setHoveredProject] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                // Fetch projects sorted by 'order' desc, then '_createdAt' desc
                const data = await client.fetch(`*[_type == "project"] | order(order desc, _createdAt desc)`);
                setProjects(data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch projects:", error);
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    // Filter Logic
    const filteredProjects = activeTab === "all"
        ? projects
        : projects.filter(p => p.category === activeTab);

    // Get active color
    const activeColor = hoveredProject
        ? projects.find(p => p._id === hoveredProject)?.color || "#000000"
        : "#000000"; // default dark

    if (loading) return null; // Or a loading skeleton

    return (
        <section id="projects" className="w-full py-20 px-4 md:px-12 relative overflow-hidden group/section">

            {/* Dynamic Cinematic Backdrop */}
            <div className="absolute inset-0 pointer-events-none z-0">
                {/* Color Shift Gradient */}
                <motion.div
                    className="absolute inset-0 opacity-20 transition-colors duration-700"
                    animate={{
                        background: hoveredProject
                            ? `radial-gradient(800px circle at 50% 50%, ${activeColor}55, transparent 60%)`
                            : `radial-gradient(600px circle at 50% 50%, rgba(255,255,255,0.05), transparent 60%)`
                    }}
                    transition={{ duration: 0.7 }}
                />

                {/* Floating Particles / Noise */}
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-12 tracking-tighter mix-blend-difference text-center md:text-left">Our Projects</h2>

                {/* Filters with Creative Mix-Blend Animation */}
                <div className="flex flex-wrap justify-center md:justify-start gap-2 md:gap-4 mb-12 relative z-20">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className="relative px-4 py-2 md:px-6 md:py-2 rounded-full text-xs md:text-sm font-bold transition-colors duration-300 isolate"
                            style={{
                                color: activeTab === tab.id ? "black" : "rgba(255,255,255,0.6)"
                            }}
                        >
                            {/* The Mix-Blend Active Background */}
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="activeCategory"
                                    className="absolute inset-0 bg-white rounded-full -z-10 mix-blend-normal"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}

                            {/* Hover Glow (Optional) */}
                            <span className="relative z-10">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Projects Grid/Masonry-ish */}
                <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min">
                    <AnimatePresence mode="popLayout">
                        {filteredProjects.map((project) => (
                            <motion.div
                                key={project._id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                onMouseEnter={() => setHoveredProject(project._id)}
                                onMouseLeave={() => setHoveredProject(null)}
                                className="group/card"
                            >
                                <ProjectCard
                                    project={{
                                        id: project._id,
                                        title: project.title,
                                        category: project.category,
                                        link: project.videoUrl,
                                        imageUrl: urlForImage(project.thumbnail).url(),
                                        // Map Sanity fields to ProjectCard Props
                                        color: project.category === 'YouTube' ? 'bg-red-500/20' : 'bg-pink-500/20', // Fallback colors
                                        aspectRatio: project.category === 'YouTube' ? 'aspect-video' : 'aspect-[9/16]',
                                        hex: project.category === 'YouTube' ? '#ef4444' : '#ec4899'
                                    }}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>
        </section>
    );
}
