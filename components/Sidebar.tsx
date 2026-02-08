"use client";

import React from 'react';
import {
    Home,
    Compass,
    FileText,
    Calendar,
    Award,
    Clock,
    Settings,
    LayoutGrid
} from 'lucide-react';
import { cn } from '../lib/utils';

const navItems = [
    { icon: Home, label: 'Dashboard' },
    { icon: Compass, label: 'Explore' },
    { icon: LayoutGrid, label: 'Sheets' },
    { icon: FileText, label: 'Resources' },
    { icon: Calendar, label: 'Events' },
    { icon: Award, label: 'Badges' },
];

export function Sidebar() {
    return (
        <aside className="w-[72px] h-screen bg-[#09090b] flex flex-col items-center py-6 sticky top-0 shrink-0 z-50">
            <div className="mb-10">
                <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                    <span className="font-black text-amber-500 text-lg tracking-tighter">Q</span>
                </div>
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
}
