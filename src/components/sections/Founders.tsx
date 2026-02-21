"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Facebook, Instagram, MessageCircle } from "lucide-react";
import { useRef } from "react";

const founders = [
    {
        name: "Walid Al Islam",
        role: "Co-Founder & Lead Strategist",
        skills: ["Branding", "Content Strategy", "Marketing"],

        socials: [
            { icon: Instagram, href: "https://www.instagram.com/walidislamm/" },
            { icon: Facebook, href: "https://www.facebook.com/walid.al.islamm" },
            { icon: MessageCircle, href: "https://wa.me/8801977849511" },
        ],
        image: "/founder_walid.jpg",
    },
    {
        name: "Ishraq Rafi",
        role: "Co-Founder & Creative Director",
        skills: ["Motion Graphics", "3D Design", "Video Editing"],
        socials: [
            { icon: Instagram, href: "https://www.instagram.com/ishraqrafi/" },
            { icon: Facebook, href: "https://www.facebook.com/ishraq.rafi.2024/" },
            { icon: MessageCircle, href: "https://wa.me/8801906068821" },
        ],
        image: "/founder_ishraq.jpg",
    },
];

function FounderCard({ founder, index }: { founder: typeof founders[0], index: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Spotlight effect
    const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 100 });
    const spotlight = useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(255,255,255,0.1), transparent 80%)`;

    // Parallax logic
    const moveX = useTransform(mouseX, [0, 500], [5, -5]);
    const moveY = useTransform(mouseY, [0, 500], [5, -5]);

    function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        x.set(e.clientX - rect.left);
        y.set(e.clientY - rect.top);
    }

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            onMouseMove={handleMouseMove}
            className="group relative flex flex-col items-center text-center p-6 md:p-8 rounded-3xl border border-white/5 bg-white/5 overflow-hidden transform-gpu max-w-sm md:max-w-md mx-auto w-full"
        >
            {/* Interactive Spotlight Background */}
            <motion.div
                className="absolute inset-0 z-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: spotlight }}
            />

            {/* Avatar with Sonar Effect */}
            <div className="relative w-32 h-32 md:w-56 md:h-56 mb-6 md:mb-8 z-10 transition-transform duration-500 group-hover:scale-105">

                {/* Sonar Ripple Effect - Universal (Always Active) */}
                <div className="absolute inset-0 rounded-full border border-white/20 scale-100 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite] opacity-30" />
                <div className="absolute inset-0 rounded-full border border-white/10 scale-100 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite] opacity-20 delay-1000" />
                <div className="absolute inset-0 rounded-full border border-white/5 scale-100 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite] opacity-10 delay-[2000ms]" />

                {/* Rotating Border Rings */}
                <div className="absolute inset-0 rounded-full border border-white/10 group-hover:border-white/30 transition-colors duration-500" />
                <div className="absolute -inset-2 rounded-full border border-dashed border-white/5 animate-[spin_10s_linear_infinite] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative w-full h-full rounded-full overflow-hidden bg-black/50">
                    {founder.image ? (
                        <>
                            <img
                                src={founder.image}
                                alt={founder.name}
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 contrast-125"
                            />
                            {/* Digital Noise Overlay */}
                            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay pointer-events-none" />
                        </>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-white/5 text-4xl text-white/20 font-bold">
                            {founder.name[0]}
                        </div>
                    )}
                </div>
            </div>

            {/* Text Content with Parallax */}
            <motion.div style={{ x: moveX, y: moveY }} className="relative z-10">
                <h3 className="text-xl md:text-3xl font-bold text-white mb-1 md:mb-2">{founder.name}</h3>
                <p className="text-white/50 mb-4 md:mb-6 uppercase tracking-widest text-[10px] md:text-sm font-medium">{founder.role}</p>

                {/* Skills - "Data Decryption" feel */}
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                    {founder.skills.map((skill) => (
                        <span
                            key={skill}
                            className="px-3 py-1 bg-black/40 backdrop-blur-sm rounded-full text-xs text-white/60 border border-white/5 group-hover:border-white/20 group-hover:text-white transition-colors duration-300"
                        >
                            {skill}
                        </span>
                    ))}
                </div>

                {/* Socials */}
                <div className="flex gap-6 justify-center">
                    {founder.socials.map((social, i) => (
                        <a
                            key={i}
                            href={social.href}
                            className="p-3 rounded-full bg-white/5 hover:bg-white hover:text-black text-white/50 transition-all duration-300 hover:scale-110 active:scale-95"
                        >
                            <social.icon className="w-5 h-5" />
                        </a>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
}

export default function Founders() {
    return (
        <section id="founders" className="w-full py-24 px-4 md:px-12 relative overflow-hidden">
            {/* Background Atmosphere */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-full h-full bg-gradient-to-b from-blue-500/5 via-transparent to-transparent blur-[120px] opacity-30" />
            </div>

            <div className="max-w-7xl mx-auto">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-3xl md:text-5xl font-bold text-white mb-20 tracking-tighter text-center"
                >
                    Meet the Minds
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 justify-items-center"> {/* Added justify-items-center */}
                    {founders.map((founder, index) => (
                        <FounderCard key={founder.name} founder={founder} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}
