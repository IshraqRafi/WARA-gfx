"use client";

interface PlatformIconProps {
    platform: "TikTok Growth" | "Instagram Growth" | "Facebook Growth" | "YouTube Growth";
    className?: string; // used for sizing (w-8 h-8 etc)
    isActive?: boolean; // used for color override in Stats.tsx
}

export default function PlatformIcon({ platform, className = "", isActive = false }: PlatformIconProps) {
    // Brand Colors for reference (logic handled by parent usually, but we keep mapping if needed)
    const colors = {
        "TikTok Growth": "#00f2ea",
        "Instagram Growth": "#E1306C",
        "Facebook Growth": "#1877F2",
        "YouTube Growth": "#FF0000",
    };

    const color = colors[platform];

    // SOLID (Filled) Paths matching "Fabicon" / App Icon style
    const paths = {
        "TikTok Growth": (
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
        ),
        "Instagram Growth": (
            <path d="M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.8,5.8 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.8,5.8 0 0,1 7.8,2M7.6,4A3.6,3.6 0 0,0 4,7.6V16.4C4,18.39 5.61,20 7.6,20H16.4A3.6,3.6 0 0,0 20,16.4V7.6C20,5.61 18.39,4 16.4,4H7.6M17.25,5.5A1.25,1.25 0 0,1 18.5,6.75A1.25,1.25 0 0,1 17.25,8A1.25,1.25 0 0,1 16,6.75A1.25,1.25 0 0,1 17.25,5.5M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z" />
        ),
        "Facebook Growth": (
            <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z" />
        ),
        "YouTube Growth": (
            <path d="M21.58,7.17C21.33,6.22 20.58,5.48 19.63,5.22C17.91,4.76 12,4.76 12,4.76C12,4.76 6.09,4.76 4.37,5.22C3.42,5.48 2.67,6.22 2.42,7.17C1.96,8.89 1.96,12.48 1.96,12.48C1.96,12.48 1.96,16.07 2.42,17.79C2.67,18.74 3.42,19.49 4.37,19.74C6.09,20.2 12,20.2 12,20.2C12,20.2 17.91,20.2 19.63,19.74C20.58,19.48 21.33,18.74 21.58,17.79C22.04,16.07 22.04,12.48 22.04,12.48C22.04,12.48 22.04,8.89 21.58,7.17M9.76,15.67V8.5L16.04,12.08L9.76,15.67Z" />
        ),
    };

    return (
        <div
            className={`relative flex items-center justify-center ${className}`}
            style={{ color: isActive ? color : "currentColor" }}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor" // Changed to currentColor fill for solid icons
                className="relative z-10 w-full h-full"
            >
                {paths[platform]}
            </svg>
        </div>
    );
}
