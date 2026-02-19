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
        <footer className="w-full py-4 border-t border-white/10 bg-black/90 backdrop-blur-md px-6 md:px-12 fixed bottom-0 z-50 text-[10px] md:text-xs font-mono text-white/40 tracking-widest uppercase">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">

                {/* Left: System Status */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span>SYSTEM ONLINE</span>
                    </div>
                </div>

                {/* Center: Live Clock & Latency */}
                <div className="flex items-center gap-8">
                    <span suppressHydrationWarning>{time}</span>
                    <span className="hidden md:inline">LATENCY: {ping}MS</span>
                </div>

                {/* Right: Version & Copy */}
                <div className="flex flex-col items-end">
                    <span className="text-white/40 font-bold">v2.0.5 [STABLE]</span>
                    <span>&copy; 2026 WARA GFX</span>
                </div>
            </div>
        </footer>
    );
}
