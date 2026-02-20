"use client";

import { useState } from "react";
import { Mail, Send, CheckCircle, Smartphone, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Contact() {
    const [formState, setFormState] = useState<'idle' | 'sending' | 'sent'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormState('sending');

        const formData = new FormData(e.target as HTMLFormElement);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            assetsLink: formData.get('assetsLink'),
            message: formData.get('message'),
        };

        try {
            // Artificial delay for cinematic effect (2 seconds minimum)
            const [response] = await Promise.all([
                fetch('/api/send', {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: { 'Content-Type': 'application/json' },
                }),
                new Promise(resolve => setTimeout(resolve, 2000))
            ]);

            if (response.ok) {
                setFormState('sent');
            } else {
                const err = await response.json();
                console.error("Transmission failed:", err);
                setFormState('idle');
                alert("Transmission failed. Please try again.");
            }
        } catch (error) {
            console.error(error);
            setFormState('idle');
            alert("Connection error.");
        }
    };

    const handleInputChange = () => {
        if (formState === 'sent') {
            setFormState('idle');
        }
    };

    return (
        <section id="contact" className="w-full py-32 px-4 md:px-12 bg-black text-white relative z-10 overflow-hidden">
            {/* Background Wireframe/Grid */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
            </div>

            <div className="max-w-7xl mx-auto relative z-20 grid grid-cols-1 lg:grid-cols-2 gap-16">

                {/* Left Column: Transmission Status */}
                <div className="space-y-8 md:space-y-12">
                    <div className="text-center md:text-left">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-7xl font-bold tracking-tighter mb-4 md:mb-6"
                        >
                            INITIATE<br /><span className="text-white/40">UPLINK</span>
                        </motion.h2>
                        <p className="text-sm md:text-xl text-white/50 max-w-md mx-auto md:mx-0 leading-relaxed">
                            Ready to transmit your vision? Establish a secure connection with our team.
                        </p>
                    </div>

                    <div className="space-y-6">
                        {[
                            { icon: Mail, label: "EMAIL ENCRYPTION", value: "waragfx@gmail.com", href: "https://mail.google.com/mail/?view=cm&fs=0&to=waragfx@gmail.com&su=Project%20Inquiry%20-%20[Your%20Name]&body=Name:%0A%0AAssets%20Link:%0A%0AMessage:%0A" },
                            { icon: Smartphone, label: "SECURE LINE", value: "(+880) 1977 849 511", href: "https://wa.me/8801977849511" },
                            { icon: MapPin, label: "BASE OF OPERATIONS", value: "Dhaka, Bangladesh", href: null }
                        ].map((item, i) => {
                            const Component = item.href ? motion.a : motion.div;
                            return (
                                <Component
                                    key={item.label}
                                    href={item.href || undefined}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className={`group flex items-center gap-3 md:gap-6 p-3 md:p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm transition-all duration-300 ${item.href ? 'hover:border-white/30 hover:bg-white/10 cursor-pointer' : 'cursor-default'}`}
                                >
                                    <div className={`w-8 h-8 md:w-12 md:h-12 rounded-full bg-white/10 flex items-center justify-center transition-colors duration-300 ${item.href ? 'group-hover:bg-white text-black' : 'text-white'}`}>
                                        <item.icon className={`w-3 h-3 md:w-5 md:h-5 transition-colors ${item.href ? 'text-white group-hover:text-black' : 'text-white'}`} />
                                    </div>
                                    <div>
                                        <p className="text-[8px] md:text-xs tracking-widest text-white/40 mb-1">{item.label}</p>
                                        <p className="text-xs md:text-lg font-medium truncate">{item.value}</p>
                                    </div>
                                </Component>
                            );
                        })}
                    </div>
                </div>

                {/* Right Column: Holographic Terminal form */}
                <div className="relative">
                    {/* Decorative Corner Brackets */}
                    <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-white/30" />
                    <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-white/30" />

                    <form onSubmit={handleSubmit} className="relative p-8 md:p-12 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden h-full flex flex-col justify-between">

                        {/* Scanline Texture */}
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay" />

                        <div className="space-y-8 relative z-10 flex-grow">

                            {/* Name field */}
                            <div className="relative group">
                                <input
                                    name="name"
                                    id="contact-name-input"
                                    type="text"
                                    required
                                    onChange={handleInputChange}
                                    className="w-full bg-transparent border-b border-white/20 py-1.5 md:py-4 text-xs md:text-xl outline-none focus:border-white transition-colors peer"
                                    placeholder=" "
                                />
                                <label className="absolute left-0 top-1 md:top-4 text-white/50 text-[10px] md:text-lg transition-all peer-focus:-top-3 md:peer-focus:-top-6 peer-focus:text-[9px] md:peer-focus:text-xs peer-focus:text-white/70 peer-not-placeholder-shown:-top-3 md:peer-not-placeholder-shown:-top-6 peer-not-placeholder-shown:text-[9px] md:peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-white/70 pointer-events-none">
                                    NAME
                                </label>
                                <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-white group-focus-within:w-full transition-all duration-500 ease-out shadow-[0_0_10px_white]" />
                            </div>

                            {/* Email field */}
                            <div className="relative group">
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    onChange={handleInputChange}
                                    className="w-full bg-transparent border-b border-white/20 py-1.5 md:py-4 text-xs md:text-xl outline-none focus:border-white transition-colors peer"
                                    placeholder=" "
                                />
                                <label className="absolute left-0 top-1 md:top-4 text-white/50 text-[10px] md:text-lg transition-all peer-focus:-top-3 md:peer-focus:-top-6 peer-focus:text-[9px] md:peer-focus:text-xs peer-focus:text-white/70 peer-not-placeholder-shown:-top-3 md:peer-not-placeholder-shown:-top-6 peer-not-placeholder-shown:text-[9px] md:peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-white/70 pointer-events-none">
                                    EMAIL
                                </label>
                                <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-white group-focus-within:w-full transition-all duration-500 ease-out shadow-[0_0_10px_white]" />
                            </div>

                            {/* Assets Link field */}
                            <div className="relative group">
                                <input
                                    name="assetsLink"
                                    type="text"
                                    onChange={handleInputChange}
                                    className="w-full bg-transparent border-b border-white/20 py-1.5 md:py-4 text-xs md:text-xl outline-none focus:border-white transition-colors peer"
                                    placeholder=" "
                                />
                                <label className="absolute left-0 top-1 md:top-4 text-white/50 text-[10px] md:text-lg transition-all peer-focus:-top-3 md:peer-focus:-top-6 peer-focus:text-[9px] md:peer-focus:text-xs peer-focus:text-white/70 peer-not-placeholder-shown:-top-3 md:peer-not-placeholder-shown:-top-6 peer-not-placeholder-shown:text-[9px] md:peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-white/70 pointer-events-none">
                                    ASSETS LINK (DRIVE/DROPBOX)
                                </label>
                                <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-white group-focus-within:w-full transition-all duration-500 ease-out shadow-[0_0_10px_white]" />
                            </div>

                            {/* Message field */}
                            <div className="relative group">
                                <textarea
                                    name="message"
                                    rows={3}
                                    required
                                    onChange={handleInputChange}
                                    className="w-full bg-transparent border-b border-white/20 py-1.5 md:py-4 text-xs md:text-xl outline-none focus:border-white transition-colors peer resize-none"
                                    placeholder=" "
                                />
                                <label className="absolute left-0 top-1 md:top-4 text-white/50 text-[10px] md:text-lg transition-all peer-focus:-top-3 md:peer-focus:-top-6 peer-focus:text-[9px] md:peer-focus:text-xs peer-focus:text-white/70 peer-not-placeholder-shown:-top-3 md:peer-not-placeholder-shown:-top-6 peer-not-placeholder-shown:text-[9px] md:peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-white/70 pointer-events-none">
                                    MESSAGE PARAMETERS
                                </label>
                                <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-white group-focus-within:w-full transition-all duration-500 ease-out shadow-[0_0_10px_white]" />
                            </div>
                        </div>

                        <div className="mt-12">
                            <AnimatePresence mode="wait">
                                {formState === 'idle' && (
                                    <motion.button
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        type="submit"
                                        className="w-full py-2 md:py-4 bg-white text-black font-bold text-[10px] md:text-lg tracking-widest hover:bg-white/90 transition-colors flex items-center justify-center gap-2 group"
                                    >
                                        INITIALIZE UPLINK
                                        <Send className="w-2.5 h-2.5 md:w-4 md:h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </motion.button>
                                )}

                                {formState === 'sending' && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                                        className="w-full py-4 bg-white/10 text-white font-mono text-center tracking-widest border border-white/20"
                                    >
                                        TRANSMITTING DATA...
                                        <div className="h-1 w-full bg-white/10 mt-2 overflow-hidden">
                                            <div className="h-full bg-white w-full animate-progress origin-left" />
                                        </div>
                                    </motion.div>
                                )}

                                {formState === 'sent' && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="w-full py-4 bg-green-500/20 border border-green-500/50 text-green-400 font-bold tracking-widest text-center flex items-center justify-center gap-3"
                                    >
                                        <CheckCircle className="w-5 h-5" />
                                        TRANSMISSION COMPLETE
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}
