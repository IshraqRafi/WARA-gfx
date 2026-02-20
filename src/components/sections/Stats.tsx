"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, useSpring, useMotionValue, AnimatePresence, useVelocity, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import PlatformIcon from "../ui/PlatformIcons";

type TimeRange = "Last Year" | "Last Month" | "Last Week" | "All Time";
type Platform = "TikTok Growth" | "Instagram Growth" | "Facebook Growth" | "YouTube Growth";

type Milestone = {
    index: number;
    label: string;
    flip?: boolean; // true = pointer goes upward (text above dot)
    yOffset?: number; // vertical shift in pixels
};

// Data for the Counters (controlled by Time Range)
const statsData: Record<TimeRange, { stats: { label: string; value: number; suffix: string }[] }> = {
    "Last Week": {
        stats: [
            { label: "Projects Completed", value: 3, suffix: "" },
            { label: "Leads Generated", value: 120, suffix: "+" },
            { label: "Client Satisfaction", value: 100, suffix: "%" },
        ]
    },
    "Last Month": {
        stats: [
            { label: "Projects Completed", value: 12, suffix: "" },
            { label: "Leads Generated", value: 450, suffix: "+" },
            { label: "Client Satisfaction", value: 98, suffix: "%" },
        ]
    },
    "Last Year": {
        stats: [
            { label: "Projects Completed", value: 85, suffix: "+" },
            { label: "Leads Generated", value: 3500, suffix: "+" },
            { label: "Client Satisfaction", value: 99, suffix: "%" },
        ]
    },
    "All Time": {
        stats: [
            { label: "Projects Completed", value: 150, suffix: "+" },
            { label: "Leads Generated", value: 5000, suffix: "+" },
            { label: "Client Satisfaction", value: 99, suffix: "%" },
        ]
    },
};

// Data for the Graph (controlled by Platform)
const platformData: Record<Platform, { graph: number[], milestones: Milestone[] }> = {
    "TikTok Growth": {
        graph: [20, 50, 40, 70, 60, 90, 85, 110, 100, 130, 150, 180],
        milestones: [
            { index: 1, label: "First Post", flip: true, yOffset: -55 },
            { index: 3, label: "Viral Trend" },
            { index: 6, label: "1M Views" },
            { index: 9, label: "Brand Deal" }
        ]
    },
    "Instagram Growth": {
        graph: [30, 40, 35, 50, 45, 60, 70, 65, 80, 95, 90, 110],
        milestones: [
            { index: 1, label: "Launch", flip: true, yOffset: -50 },
            { index: 4, label: "Reels Bonus", flip: true, yOffset: -60 },
            { index: 7, label: "Giveaway" },
            { index: 10, label: "Verified" }
        ]
    },
    "Facebook Growth": {
        graph: [40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95],
        milestones: [
            { index: 1, label: "Page Created", flip: true, yOffset: -65 },
            { index: 4, label: "Community Launch" },
            { index: 8, label: "Ad Scale" },
            { index: 11, label: "Monetization" }
        ]
    },
    "YouTube Growth": {
        graph: [10, 20, 15, 30, 50, 80, 70, 100, 140, 180, 200, 250],
        milestones: [
            { index: 1, label: "First Upload", flip: true, yOffset: -50 },
            { index: 4, label: "10k Subs", flip: true, yOffset: -60 },
            { index: 7, label: "Monetized" },
            { index: 9, label: "Algorithm Pick" },
            { index: 11, label: "Silver Play Button" }
        ]
    }
};

function Counter({ value, suffix }: { value: number; suffix: string }) {
    const ref = useRef<HTMLSpanElement>(null);
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, { damping: 30, stiffness: 100 }); // Looser spring for more "spin"
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    // "Time Travel" Blur Effect
    const velocity = useVelocity(springValue);
    const blurFilter = useTransform(velocity, (v: number) => {
        const blurAmount = Math.min(Math.abs(v) * 0.02, 8); // Max 8px blur
        return `blur(${blurAmount}px)`;
    });

    // Vertical shift based on velocity (spin direction)
    const yOffset = useTransform(velocity, (v: number) => {
        return Math.max(Math.min(v * 0.1, 10), -10); // Limit shift
    });

    useEffect(() => {
        if (isInView) {
            motionValue.set(value);
        }
    }, [isInView, value, motionValue]);

    useEffect(() => {
        springValue.on("change", (latest) => {
            if (ref.current) {
                ref.current.textContent = Math.floor(latest).toLocaleString();
            }
        });
    }, [springValue]);

    return (
        <span className="flex items-center">
            <span
                className="relative flex flex-col justify-center h-[3em] overflow-hidden"
                style={{
                    maskImage: "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)",
                    WebkitMaskImage: "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)"
                }}
            >
                <motion.span
                    ref={ref}
                    style={{ filter: blurFilter, y: yOffset }}
                    className="inline-block will-change-transform py-8 px-1 md:px-4"
                >
                    0
                </motion.span>
            </span>
            <span>{suffix}</span>
        </span>
    );
}

function GrowthGraph({ platform, setPlatform }: { platform: Platform, setPlatform: (p: Platform) => void }) {
    const data = platformData[platform].graph;
    const milestones = platformData[platform].milestones;
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // 3D HOLOGRAPHIC TILT LOGIC
    const cardRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-300, 300], [5, -5]); // Vertical tilt
    const rotateY = useTransform(x, [-300, 300], [-5, 5]); // Horizontal tilt

    // Smooth the values
    const springRotateX = useSpring(rotateX, { damping: 20, stiffness: 150 });
    const springRotateY = useSpring(rotateY, { damping: 20, stiffness: 150 });

    function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const mouseX = e.clientX - rect.left - centerX;
        const mouseY = e.clientY - rect.top - centerY;
        x.set(mouseX);
        y.set(mouseY);
    }

    function handleMouseLeave() {
        x.set(0);
        y.set(0);
    }

    // Normalize data for SVG path
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const width = 100;
    const height = 40;
    const paddingY = 1; // small padding so stroke at top/bottom isn't clipped
    const viewBoxWidth = 100;
    const viewBoxHeight = height + paddingY * 2;

    // Create smooth bezier curve path — spans full 0..100 to match viewBox
    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = paddingY + (height - ((d - min) / range) * height);
        return [x, y];
    });

    const pathD = points.reduce((acc, point, i, a) => {
        if (i === 0) return `M ${point[0]},${point[1]}`;
        const prev = a[i - 1];
        const cp1x = prev[0] + (point[0] - prev[0]) * 0.5;
        const cp1y = prev[1];
        const cp2x = prev[0] + (point[0] - prev[0]) * 0.5;
        const cp2y = point[1];
        return `${acc} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${point[0]},${point[1]}`;
    }, "");

    // Close dropdown on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div style={{ perspective: 1200 }} className="w-full"> {/* Perspective Container */}
            <motion.div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ rotateX: springRotateX, rotateY: springRotateY, transformStyle: "preserve-3d" }}
                className="w-full mt-12 bg-white/5 border border-white/5 rounded-2xl relative group shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] backdrop-blur-md"
            >
                {/* Background & Effects Wrapper (Clipped) */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                    {/* 3D Scanline Beam */}
                    <motion.div
                        className="absolute inset-y-0 w-[50px] bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 z-0"
                        animate={{ left: ["-20%", "120%"] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 2 }}
                    />
                </div>

                <div className="flex justify-between items-center mb-4 md:mb-8 p-3 md:p-6 pb-0 z-20 relative transform-style-3d translate-z-10"> {/* Lifted content */}
                    <div className="flex items-center gap-2 md:gap-4">

                        {/* Platform Dropdown */}
                        <div className="relative w-32 md:w-52" ref={dropdownRef}>
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="flex items-center justify-between w-full px-2 py-1.5 md:px-4 md:py-3 bg-white/5 border border-white/10 rounded-lg text-[10px] md:text-lg font-bold text-white hover:bg-white/10 hover:border-white/20 transition-all shadow-lg"
                            >
                                <span className="truncate">{platform}</span>
                                <ChevronDown className={`w-3 h-3 md:w-4 md:h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                            </button>

                            <AnimatePresence>
                                {isOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute top-full left-0 mt-2 w-full bg-[#0a0a0a] border border-white/20 rounded-xl overflow-hidden shadow-2xl shadow-black/80 z-30"
                                    >
                                        {Object.keys(platformData).map((p) => (
                                            <button
                                                key={p}
                                                onClick={() => {
                                                    setPlatform(p as Platform);
                                                    setIsOpen(false);
                                                }}
                                                className="w-full text-left px-3 py-2 md:px-6 md:py-4 text-white/70 hover:text-white hover:bg-white/5 transition-colors text-[10px] md:text-sm border-b border-white/5 last:border-0 truncate"
                                            >
                                                {p}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Animated Icon Indicator (Right Side, White) */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={platform}
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    transition: { duration: 0.3 }
                                }}
                                exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                            >
                                <motion.div
                                    animate={{
                                        scale: [1, 1.1, 1],
                                        filter: ["drop-shadow(0 0 2px currentColor)", "drop-shadow(0 0 10px currentColor)", "drop-shadow(0 0 2px currentColor)"]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                    className="relative w-5 h-5 md:w-8 md:h-8 flex items-center justify-center text-white"
                                >
                                    <PlatformIcon platform={platform} isActive={false} className="w-full h-full" />
                                </motion.div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Graph Container */}
                <div className="relative w-full aspect-[5/1] md:aspect-[6/1]">
                    <AnimatePresence mode="wait">
                        <motion.svg
                            key={platform}
                            viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
                            className="w-full h-full"
                            preserveAspectRatio="none"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            style={{ filter: "drop-shadow(0 0 10px rgba(255,255,255,0.1))" }}
                        >
                            <defs>
                                <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                                    <stop offset="0%" stopColor="white" stopOpacity="0.2" />
                                    <stop offset="100%" stopColor="white" stopOpacity="0" />
                                </linearGradient>
                            </defs>

                            <motion.path
                                d={`${pathD} L ${width},${viewBoxHeight} L 0,${viewBoxHeight} Z`}
                                fill="url(#gradient)"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 1 }}
                            />

                            <motion.path
                                d={pathD}
                                fill="none"
                                stroke="white"
                                strokeWidth="0.5"
                                strokeOpacity="1"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 1.5, ease: "easeInOut" }}
                            />
                        </motion.svg>
                    </AnimatePresence>

                    {/* Milestones / Pointers with Float Animation */}
                    <AnimatePresence>
                        {milestones.map((m) => {
                            const point = points[m.index];
                            if (!point) return null;
                            const xPct = point[0];
                            const yPct = point[1];
                            const yPercent = (yPct / viewBoxHeight) * 100;

                            // Smart horizontal anchoring
                            const isFirst = m.index <= 1;
                            const isLast = m.index >= data.length - 2;

                            // Use explicit flip override if set, otherwise auto-detect from position
                            const pointsUp = m.flip !== undefined ? m.flip : yPercent > 72;
                            const pointsDown = !pointsUp;

                            return (
                                <motion.div
                                    key={`${m.label}-${m.index}-${platform}`}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0 }}
                                    transition={{
                                        delay: (m.index / (data.length - 1)) * 1.5,
                                        duration: 0.5,
                                        ease: "easeOut"
                                    }}
                                    className="absolute z-10 pointer-events-none transform-style-3d translate-z-20" // lift pointers
                                    style={{
                                        left: `${xPct}%`,
                                        top: `calc(${yPercent}% + ${m.yOffset || 0}px)`,
                                        transform: 'translate(-50%, -50%) translateZ(20px)'
                                    }}
                                >
                                    <motion.div
                                        animate={{ y: [0, -6, 0] }}
                                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: m.index * 0.15 }}
                                        className={`flex ${pointsUp ? 'flex-col-reverse' : 'flex-col'} items-center`}
                                    >
                                        {/* Dot — always closest to graph line */}
                                        <div className="relative">
                                            <div className="w-2 h-2 md:w-3 md:h-3 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,1)] z-10 relative" />
                                            <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-50" />
                                        </div>

                                        {/* Connecting line */}
                                        <div className={`w-[1px] h-4 md:h-6 pointer-events-none ${pointsUp
                                            ? 'bg-gradient-to-t from-white/40 to-transparent'
                                            : 'bg-gradient-to-b from-white/40 to-transparent'
                                            }`} />

                                        {/* Text label — no bg, just clean text */}
                                        <span className={`text-[8px] md:text-[10px] text-white/70 whitespace-nowrap font-medium tracking-wide ${pointsUp ? 'mb-0.5' : 'mt-0.5'}`}>
                                            {m.label}
                                        </span>
                                    </motion.div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    )
}

export default function Stats() {
    const [timeRange, setTimeRange] = useState<TimeRange>("All Time");
    const [platform, setPlatform] = useState<Platform>("TikTok Growth");
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <section id="stats" className="w-full py-24 px-4 bg-gradient-to-b from-transparent to-white/5">
            <div className="max-w-7xl mx-auto flex flex-col items-center">

                {/* Time Range Dropdown Filter (Controls Counters Only) */}
                <div className="relative mb-16 z-20" ref={dropdownRef}>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white backdrop-blur-md hover:bg-white/10 transition-colors w-64 justify-between"
                    >
                        <span className="text-sm font-medium text-white/60">Range:</span>
                        <span className="font-bold">{timeRange}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </button>

                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute top-full mt-4 bg-[#0a0a0a] border border-white/20 rounded-xl overflow-hidden shadow-2xl shadow-black/80 z-30 min-w-[280px]"
                            >
                                {Object.keys(statsData).map((range) => (
                                    <button
                                        key={range}
                                        onClick={() => {
                                            setTimeRange(range as TimeRange);
                                            setIsOpen(false);
                                        }}
                                        className="w-full text-left px-6 py-4 text-white/70 hover:text-white hover:bg-white/5 transition-colors text-sm border-b border-white/5 last:border-0 flex justify-between items-center group"
                                    >
                                        <span>{range}</span>
                                        {timeRange === range && <div className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_5px_white]" />}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Counters Grid (Controlled by Time Range) */}
                <div className="grid grid-cols-3 gap-2 md:gap-12 text-center w-full mb-8">
                    {statsData[timeRange]?.stats?.map((stat) => (
                        <div key={stat.label} className="p-2 md:p-8 md:border-l border-white/5 first:border-l-0 flex flex-col items-center justify-center">
                            <div className="text-xl md:text-7xl font-bold text-white mb-2 md:mb-4 tracking-tighter flex justify-center">
                                <Counter value={stat.value} suffix={stat.suffix} />
                            </div>
                            <p className="text-white/40 uppercase tracking-widest text-[10px] md:text-sm">{stat.label}</p>
                        </div>
                    )) || null}
                </div>

                {/* Graph Section (Controlled by Platform) */}
                <GrowthGraph
                    platform={platform}
                    setPlatform={setPlatform}
                />

            </div>
        </section>
    );
}
