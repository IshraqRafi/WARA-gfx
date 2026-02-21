"use client";

import { useState, useEffect, useRef } from "react";
import { Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { client } from "@/sanity/lib/client";
import { urlForImage } from "@/sanity/lib/image";
import { useAudio } from "@/hooks/useAudio";

interface Review {
    _id: string;
    clientName: string;
    role: string;
    avatar?: any;
    rating: number;
    content: string;
    platform?: string;
    date?: string;
}

function ReviewCard({ review, skewX, scale }: { review: Review; skewX: any; scale: any }) {
    const [isHovered, setIsHovered] = useState(false);
    const { playStarScatter, playStarReturn } = useAudio();
    const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

    const handleMouseEnter = () => {
        setIsHovered(true);
        playStarScatter();

        // Clear any existing timeouts to prevent overlapping sounds
        timeoutsRef.current.forEach(clearTimeout);
        timeoutsRef.current = [];

        // Schedule individual star return impact sounds
        const numStars = review.rating || 5;
        for (let i = 0; i < numStars; i++) {
            const returnStart = 0.5 + (i * 0.2); // Matches return animation timing
            const tid = setTimeout(() => {
                playStarReturn();
            }, returnStart * 1000);
            timeoutsRef.current.push(tid);
        }
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        timeoutsRef.current.forEach(clearTimeout);
        timeoutsRef.current = [];
    };

    // Galaxy Scatter Animation
    const starVariant = {
        rest: {
            x: 0,
            y: 0,
            scale: 1,
            rotate: 0,
            textShadow: "0px 0px 0px rgba(234,179,8,0)"
        },
        hover: (i: number) => {
            const isEven = i % 2 === 0;
            const scatterX = (i - 2) * 50 + (isEven ? 30 : -30);
            const scatterY = -60 - (Math.abs(i - 2) * 15);
            const rotate = (i - 2) * 45;

            const scatterPeak = 0.2;
            const returnStart = 0.5 + (i * 0.2);
            const totalDuration = returnStart + 0.5;

            const pScatter = scatterPeak / totalDuration;
            const pReturn = returnStart / totalDuration;

            return {
                x: [0, scatterX, scatterX * 0.9, 0, 0],
                y: [0, scatterY, scatterY * 0.9, 0, 0],
                scale: [1, 1.8, 1.8, 1, 1],
                rotate: [0, rotate, rotate, 0, 0],
                textShadow: [
                    "0px 0px 0px rgba(234,179,8,0)",
                    "0px 0px 30px rgba(234,179,8,1)",
                    "0px 0px 30px rgba(234,179,8,1)",
                    "0px 0px 0px rgba(234,179,8,0)"
                ],
                transition: {
                    duration: totalDuration,
                    times: [0, pScatter, pReturn - 0.1, pReturn, 1],
                    ease: "easeInOut" as any
                }
            };
        }
    };

    return (
        <motion.div
            style={{ skewX, scale }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            initial="rest"
            animate={isHovered ? "hover" : "rest"}
            className="w-[280px] md:w-[350px] p-6 md:p-8 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-white/20 hover:z-50 transition-colors select-none group relative overflow-visible flex-shrink-0"
        >
            <div className="flex gap-1 mb-4 relative z-20 perspective-500">
                {/* Total Stars Background (Dimmed) */}
                <div className="absolute inset-0 flex gap-1 z-0 opacity-20">
                    {[...Array(5)].map((_, i) => (
                        <Star key={`bg-${i}`} className="w-3 h-3 md:w-4 md:h-4 text-white" />
                    ))}
                </div>

                {/* Active Stars with Galaxy Scatter Animation */}
                {/* Active Stars with Galaxy Scatter Animation */}
                {[...Array(review.rating || 5)].map((_, i) => (
                    <div key={i} className="relative">
                        <motion.div
                            custom={i}
                            variants={starVariant}
                            className="relative z-10"
                        >
                            <Star
                                className={`w-3 h-3 md:w-4 md:h-4 fill-yellow-500 text-yellow-500 ${isHovered ? 'drop-shadow-[0_0_15px_rgba(234,179,8,0.8)]' : ''}`}
                            />
                        </motion.div>

                        {/* Socket Spark */}
                        <AnimatePresence>
                            {isHovered && (
                                <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{
                                        scale: [0, 2, 0],
                                        opacity: [0, 1, 0],
                                        rotate: Math.random() * 180
                                    }}
                                    transition={{
                                        duration: 0.4,
                                        delay: 0.5 + (i * 0.2),
                                        ease: "easeOut"
                                    }}
                                    className="absolute inset-0 -z-10 bg-yellow-400 blur-sm scale-150"
                                    style={{ clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)" }}
                                />
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>

            <p className="text-white/70 mb-6 leading-relaxed text-xs md:text-sm relative z-10 transition-colors duration-300 group-hover:text-white">"{review.content}"</p>

            <div className="relative z-10 flex items-center gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border border-white/20 bg-white/5">
                    {review.avatar ? (
                        <img src={urlForImage(review.avatar).url()} alt={review.clientName} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-white/50">{review.clientName?.charAt(0)}</div>
                    )}
                </div>
                <div>
                    <h4 className="text-white font-bold text-sm md:text-base group-hover:text-yellow-500 transition-colors duration-300">{review.clientName}</h4>
                    <span className="text-white/30 text-[10px] md:text-xs uppercase tracking-widest">{review.role} • {review.platform || 'Direct'}</span>
                </div>
            </div>
        </motion.div>
    );
}

export default function Reviews() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const data = await client.fetch(`*[_type == "review"]`);
                setReviews(data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch reviews:", error);
                setLoading(false);
            }
        };
        fetchReviews();
    }, []);

    if (loading) return null;
    if (reviews.length === 0) return null;

    // Duplicate reviews for seamless loop
    // Ensure at least enough items for marquee
    const marqueeReviews = [...reviews, ...reviews, ...reviews, ...reviews].slice(0, 12);

    return (
        <section id="reviews" className="w-full py-20 bg-black overflow-hidden border-y border-white/5 relative z-10">
            <div className="max-w-7xl mx-auto px-4 md:px-12 mb-12">
                <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tighter text-center">Client Words</h2>
                <div className="flex justify-center items-center gap-2 mt-4 text-white/40">
                    <span className="w-12 h-[1px] bg-white/20"></span>
                    <p className="text-xs md:text-sm uppercase tracking-widest">Trusted by Global Brands</p>
                    <span className="w-12 h-[1px] bg-white/20"></span>
                </div>
            </div>

            <div className="relative w-full overflow-hidden">
                {/* Fade Gradients for smooth edges */}
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent z-20 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent z-20 pointer-events-none" />

                <motion.div
                    className="flex gap-8 w-max px-4 py-16"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                        duration: 60,
                        ease: "linear",
                        repeat: Infinity,
                    }}
                >
                    {marqueeReviews.map((review, index) => (
                        <ReviewCard key={`${review._id}-${index}`} review={review} skewX={0} scale={1} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
