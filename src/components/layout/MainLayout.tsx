"use client";

import CinematicBackground from "./CinematicBackground";
import Header from "./Header";
import Footer from "./Footer";
import { ReactNode, useEffect } from "react";
import CustomCursor from "../ui/CustomCursor";
import ScrollRail from "../ui/ScrollRail";

export default function MainLayout({ children }: { children: ReactNode }) {
    // Force scroll to top on refresh
    useEffect(() => {
        if (typeof window !== "undefined") {
            window.history.scrollRestoration = "manual";
            window.scrollTo(0, 0);
        }
    }, []);

    return (
        <div className="relative min-h-screen">
            <CustomCursor />
            <ScrollRail />
            <CinematicBackground />
            <Header />
            <main className="relative z-10 flex flex-col items-center w-full pt-20">
                {children}
            </main>
            <Footer />
        </div>
    );
}
