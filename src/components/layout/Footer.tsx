"use client";

import { useEffect, useState } from "react";

export default function Footer() {
    const [time, setTime] = useState("");
    const [ping, setPing] = useState(12);

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const timeString = new Intl.DateTimeFormat("en-US", {
                timeZone: "Asia/Dhaka",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true
            }).format(now);
            setTime(timeString + " DHAKA");
        };
        const interval = setInterval(updateTime, 1000);
        updateTime();

        // Simulate small ping fluctuation
        const pingInterval = setInterval(() => {
            setPing(10 + Math.floor(Math.random() * 5));
        }, 2000);

        return () => {
            clearInterval(interval);
            clearInterval(pingInterval);
        };
    }, []);

    return (
        <footer className="w-full py-4 border-t border-white/10 bg-black/90 backdrop-blur-md px-4 md:px-12 fixed bottom-0 z-50 text-[9px] md:text-xs font-mono text-white/40 tracking-widest uppercase">
            <div className="max-w-7xl mx-auto flex flex-row flex-wrap items-center justify-between gap-4">

                {/* Left: System Status */}
                <div className="flex items-center gap-2 md:gap-4 order-1">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500 animate-pulse" />
                        <span>SYSTEM ONLINE</span>
                    </div>
                </div>

                {/* Right: Version & Copy - Horizontal on mobile now */}
                <div className="flex flex-row items-center gap-2 md:gap-4 order-3 md:order-2 w-full md:w-auto justify-center">
                    <span className="text-white/40 font-bold">v2.0.5</span>
                    <span>&copy; 2024 WARA GFX</span>
                </div>

                {/* Right: Live Clock & Latency - Right aligned */}
                <div className="flex items-center gap-2 md:gap-8 order-2 md:order-3">
                    <span suppressHydrationWarning>{time}</span>
                    <span className="hidden md:inline">LATENCY: {ping}MS</span>
                </div>
            </div>
        </footer>
    );
}
