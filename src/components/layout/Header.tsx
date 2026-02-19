"use client";

import Link from "next/link";
import { Search, Menu } from "lucide-react";
import { useLenis } from "lenis/react";
import Magnetic from "../ui/Magnetic";

const navItems = [
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "#contact" },
    { name: "Skills", href: "#founders" },
    { name: "Us", href: "#founders" },
];

export default function Header() {
    const lenis = useLenis();

    const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        if (lenis) {
            lenis.scrollTo(href, { duration: 1.5 });
        } else {
            const element = document.querySelector(href);
            element?.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-[100] px-6 py-6 md:px-12 flex items-center justify-between backdrop-blur-sm bg-black/10 border-b border-white/5 pointer-events-auto">
            {/* Logo */}
            <div className="flex items-center">
                <Link href="/" className="text-xl font-bold tracking-tighter text-white z-50 mix-blend-difference cursor-pointer">
                    WARA gfx
                </Link>
            </div>

            {/* Middle: Search Bar (Visual) */}
            <div className="hidden md:flex items-center bg-white/5 rounded-full px-4 py-2 border border-white/10 w-96">
                <Search className="w-4 h-4 text-white/40 mr-3" />
                <input
                    type="text"
                    placeholder="Search..."
                    className="bg-transparent border-none outline-none text-sm text-white/80 w-full placeholder:text-white/20"
                />
            </div>

            {/* Right: Navigation */}
            <nav className="hidden md:flex items-center gap-8">
                {navItems.map((item) => (
                    <Magnetic key={item.name}>
                        <a
                            href={item.href}
                            onClick={(e) => handleScroll(e, item.href)}
                            className="text-sm font-medium text-white/70 hover:text-white transition-colors duration-300 cursor-pointer relative z-50 px-2 py-1"
                        >
                            {item.name}
                        </a>
                    </Magnetic>
                ))}
            </nav>

            {/* Mobile Menu Toggle */}
            <button className="md:hidden text-white/70 hover:text-white">
                <Menu className="w-6 h-6" />
            </button>
        </header>
    );
}
