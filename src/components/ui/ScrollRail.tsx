"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const sections = [
    { id: "hero", label: "WELCOME" },
    { id: "projects", label: "WORK" },
    { id: "reviews", label: "REVIEWS" },
    { id: "founders", label: "CREATORS" },
    { id: "stats", label: "STATS" },
    { id: "contact", label: "UPLINK" }
];

export default function ScrollRail() {
    const [activeSection, setActiveSection] = useState("hero");

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + window.innerHeight / 2;

            for (const section of sections) {
                const element = document.getElementById(section.id);
                if (element) {
                    const { offsetTop, offsetHeight } = element;
                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        setActiveSection(section.id);
                        break;
                    }
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollTo = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-6 items-end">
            {sections.map((section) => (
                <button
                    key={section.id}
                    onClick={() => scrollTo(section.id)}
                    className="group flex items-center gap-3"
                >
                    <span
                        className={`text-[10px] font-mono tracking-widest uppercase transition-all duration-300 ${activeSection === section.id ? "opacity-100 text-white translate-x-0" : "opacity-0 translate-x-4 group-hover:opacity-50 group-hover:translate-x-0"
                            }`}
                    >
                        {section.label}
                    </span>
                    <motion.div
                        animate={{
                            height: activeSection === section.id ? 32 : 8, // Slightly taller active state
                            backgroundColor: activeSection === section.id ? "#ffffff" : "#333333",
                            scale: activeSection === section.id ? 1 : 1
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="w-[2px] rounded-full"
                    />
                </button>
            ))}

            {/* Connecting Line */}
            <div className="absolute right-[1px] top-0 bottom-0 w-[1px] bg-white/10 -z-10" />
        </div>
    );
}
