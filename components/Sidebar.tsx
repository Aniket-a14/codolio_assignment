"use client";

import React from 'react';
import {
    Home,
    Compass,
    FileText,
    Calendar,
    Award,
    Settings,
    LayoutGrid
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { X } from 'lucide-react';

const navItems = [
    { icon: Home, label: 'Dashboard' },
    { icon: Compass, label: 'Explore' },
    { icon: LayoutGrid, label: 'Sheets' },
    { icon: FileText, label: 'Resources' },
    { icon: Calendar, label: 'Events' },
    { icon: Award, label: 'Badges' },
];

export function Sidebar() {
    const { isMobileNavOpen, setMobileNavOpen } = useStore();

    const sidebarContent = (
        <aside className={cn(
            "w-[72px] h-screen bg-[#0c0c0e] flex flex-col items-center py-6 sticky top-0 shrink-0 z-50 border-r border-white/5 shadow-2xl transition-transform duration-500",
            !isMobileNavOpen && "max-md:-translate-x-full"
        )}>
            <div className="mb-10 flex flex-col items-center gap-6">
                <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                    <span className="font-black text-amber-500 text-lg tracking-tighter">Q</span>
                </div>
                <button
                    onClick={() => setMobileNavOpen(false)}
                    className="md:hidden p-2 text-zinc-500 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            <nav className="flex-1 flex flex-col gap-4 w-full px-3">
                {navItems.map((item, index) => (
                    <button
                        key={index}
                        className={cn(
                            "w-full aspect-square flex items-center justify-center rounded-xl transition-all duration-300 group relative",
                            index === 2
                                ? "bg-zinc-900/80 text-white shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-zinc-800"
                                : "text-zinc-600 hover:text-zinc-300 hover:bg-zinc-900/30"
                        )}
                        title={item.label}
                    >
                        {index === 2 && (
                            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 to-transparent rounded-xl opacity-50" />
                        )}
                        <item.icon size={20} strokeWidth={index === 2 ? 2 : 1.5} className="relative z-10" />
                    </button>
                ))}
            </nav>

            <div className="mt-auto flex flex-col gap-4 w-full px-3 pb-4">
                <button className="w-full aspect-square flex items-center justify-center rounded-xl text-zinc-600 hover:text-zinc-300 hover:bg-zinc-900/30 transition-all">
                    <Settings size={20} strokeWidth={1.5} />
                </button>
                <div className="w-full aspect-square rounded-xl bg-zinc-900/40 flex items-center justify-center overflow-hidden border border-zinc-800/50">
                    <span className="text-[10px] font-bold text-zinc-500">VP</span>
                </div>
            </div>
        </aside>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden md:flex">
                {sidebarContent}
            </div>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isMobileNavOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileNavOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] md:hidden"
                        />
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-[72px] bg-[#0c0c0e] z-[60] md:hidden shadow-[20px_0_50px_rgba(0,0,0,0.5)]"
                        >
                            {sidebarContent}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
