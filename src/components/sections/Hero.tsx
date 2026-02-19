"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Mail, Play } from "lucide-react";
import Magnetic from "../ui/Magnetic";

const CinematicText = ({ text, className, delay = 0 }: { text: string, className?: string, delay?: number }) => {
    return (
        <motion.span
            className={`inline-block whitespace-pre-wrap ${className}`}
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 1 },
                visible: {
                    opacity: 1,
                    transition: {
                        staggerChildren: 0.03,
                        delayChildren: delay,
                    },
                },
            }}
        >
            {text.split("").map((char, index) => (
                <motion.span
                    key={index}
                    variants={{
                        hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
                        visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: "easeOut" } },
                    }}
                    className="inline-block"
                >
                    {char}
                </motion.span>
            ))}
        </motion.span>
    );
};

export default function Hero() {
    const [contacted, setContacted] = useState(false);

    return (
        <section id="hero" className="relative flex flex-col items-center justify-start pt-12 md:pt-16 min-h-screen w-full px-4 text-center overflow-hidden">
            {/* Animated Logo */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="relative w-full max-w-xl aspect-video mb-0 flex items-center justify-center pointer-events-none select-none"
            >
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-contain"
                >
                    <source src="/animated_logo.webm" type="video/webm" />
                    <source src="/animated_logo.mov" type="video/quicktime" />
                    <div className="w-full h-full flex items-center justify-center bg-white/5 rounded-2xl">
                        <Play className="w-12 h-12 text-white/20" />
                    </div>
                </video>
            </motion.div>

            {/* Welcome Text — Cinematic Reveal */}
            <div className="mb-2 mt-[60px] relative z-10">
                <CinematicText
                    text="Welcome to WARA gfx"
                    className="text-4xl md:text-6xl font-bold tracking-tighter text-white"
                    delay={0.5}
                />
            </div>

            <div className="max-w-2xl mb-8 relative z-10">
                <CinematicText
                    text="We turn your vision into cinematic reality."
                    className="text-white/60 text-lg md:text-xl"
                    delay={1.2}
                />
            </div>

            {/* CTA Button — Magnetic & Sonar */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2, duration: 1 }}
                className="flex flex-col items-center gap-4 relative z-20"
            >
                <Magnetic>
                    {/* Wrapper keeps sonar rings from affecting layout */}
                    <div className="relative flex items-center justify-center">

                        {/* Sonar Ring 1 — Horizontal only */}
                        <motion.span
                            aria-hidden
                            animate={{ scaleX: [1, 1.25], scaleY: 1, opacity: [0.3, 0] }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeOut",
                                repeatDelay: 2,
                            }}
                            style={{
                                position: "absolute",
                                inset: 0,
                                borderRadius: "9999px",
                                backgroundColor: "white",
                                willChange: "transform, opacity",
                                pointerEvents: "none",
                            }}
                        />

                        {/* Sonar Ring 2 — Horizontal only */}
                        <motion.span
                            aria-hidden
                            animate={{ scaleX: [1, 1.35], scaleY: 1, opacity: [0.15, 0] }}
                            transition={{
                                duration: 3.5,
                                repeat: Infinity,
                                ease: "easeOut",
                                delay: 0.8,
                                repeatDelay: 1.5,
                            }}
                            style={{
                                position: "absolute",
                                inset: 0,
                                borderRadius: "9999px",
                                backgroundColor: "white",
                                willChange: "transform, opacity",
                                pointerEvents: "none",
                            }}
                        />

                        {/* Button */}
                        <motion.button
                            onClick={() => {
                                const contactSection = document.getElementById('contact');
                                if (contactSection) {
                                    contactSection.scrollIntoView({ behavior: 'smooth' });
                                    setTimeout(() => {
                                        const nameInput = document.getElementById('contact-name-input');
                                        if (nameInput) nameInput.focus();
                                    }, 800); // Wait for scroll
                                }
                            }}
                            onMouseEnter={() => setContacted(true)}
                            onMouseLeave={() => setContacted(false)}
                            whileTap={{ scale: 0.97 }}
                            className="relative px-8 py-4 bg-white text-black font-bold rounded-full flex items-center gap-2 overflow-hidden cursor-pointer"
                            style={{ width: "240px", justifyContent: "center" }}
                        >
                            {/* Shimmer sweep on hover */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700 rounded-full pointer-events-none" />

                            {/* Animated label swap */}
                            <AnimatePresence mode="wait" initial={false}>
                                {!contacted ? (
                                    <motion.span
                                        key="sample"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.25 }}
                                        className="flex items-center gap-2 relative z-10"
                                    >
                                        Try a free sample
                                        <ArrowRight className="w-4 h-4" />
                                    </motion.span>
                                ) : (
                                    <motion.span
                                        key="contact"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.25 }}
                                        className="flex items-center gap-2 relative z-10"
                                    >
                                        Click to contact
                                        <Mail className="w-4 h-4" />
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    </div>
                </Magnetic>

                <p className="text-xs text-white/30 max-w-xs text-center border-t border-white/5 pt-4">
                    Click to get a <span className="text-white/60">free 30 second sample</span> video on your raw files completely for <span className="text-white/60 font-bold">FREE</span>
                </p>
            </motion.div>

            {/* Scroll Indicator Micro-Interaction */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5, duration: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none opacity-50"
            >
                <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent relative overflow-hidden">
                    <motion.div
                        animate={{ top: ["-100%", "100%"] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
                        className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-transparent via-white to-transparent"
                    />
                </div>
            </motion.div>
        </section>
    );
}
