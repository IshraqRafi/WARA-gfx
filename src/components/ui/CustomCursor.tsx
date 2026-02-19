"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
    const [cursorVariant, setCursorVariant] = useState("default");

    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);

    // Instant response (No Spring)
    // const springConfig = { damping: 35, stiffness: 2000 };
    // const cursorX = useSpring(mouseX, springConfig);
    // const cursorY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName.toLowerCase() === "a" || target.tagName.toLowerCase() === "button" || target.closest("a") || target.closest("button")) {
                setCursorVariant("link");
            } else if (target.tagName.toLowerCase() === "input" || target.tagName.toLowerCase() === "textarea") {
                setCursorVariant("text");
            } else {
                setCursorVariant("default");
            }
        };

        window.addEventListener("mousemove", moveCursor);
        window.addEventListener("mouseover", handleMouseOver);

        return () => {
            window.removeEventListener("mousemove", moveCursor);
            window.removeEventListener("mouseover", handleMouseOver);
        };
    }, [mouseX, mouseY]);

    const variants = {
        default: {
            width: 12,
            height: 12,
            backgroundColor: "white",
            border: "0px solid white",
            mixBlendMode: "difference" as const,
        },
        link: {
            width: 48,
            height: 48,
            backgroundColor: "transparent",
            border: "2px solid white",
            mixBlendMode: "difference" as const, // Changed to difference for better visibility
        },
        text: {
            width: 4,
            height: 24,
            backgroundColor: "white",
            border: "0px solid white",
            mixBlendMode: "difference" as const,
        }
    };

    return (
        <>
            {/* Main Cursor Dot/Ring */}
            <motion.div
                className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] flex items-center justify-center backdrop-blur-none"
                style={{
                    x: mouseX,
                    y: mouseY,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
                variants={variants}
                animate={cursorVariant}
                transition={{ type: "spring", stiffness: 500, damping: 28 }}
            />

            {/* Global CSS to hide default cursor */}
            <style jsx global>{`
                body, a, button, input, textarea {
                    cursor: none !important;
                }
            `}</style>
        </>
    );
}
