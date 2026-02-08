"use client";

import React from 'react';
import { useStore } from '../store/useStore';
import { TrendingUp, Award, Target, Zap, Trophy, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

export function StatsPanel() {
    const questions = useStore((state) => state.questions.byId);
    const allQuestions = Object.values(questions);

    // Overall stats
    const total = allQuestions.length;
    const solved = allQuestions.filter(q => q.status === 'done').length;
    const progress = total > 0 ? Math.round((solved / total) * 100) : 0;

    // By difficulty
    const easy = allQuestions.filter(q => q.difficulty === 'easy');
    const medium = allQuestions.filter(q => q.difficulty === 'medium');
    const hard = allQuestions.filter(q => q.difficulty === 'hard');

    const easyDone = easy.filter(q => q.status === 'done').length;
    const mediumDone = medium.filter(q => q.status === 'done').length;
    const hardDone = hard.filter(q => q.status === 'done').length;

    const easyProgress = easy.length > 0 ? (easyDone / easy.length) * 100 : 0;
    const mediumProgress = medium.length > 0 ? (mediumDone / medium.length) * 100 : 0;
    const hardProgress = hard.length > 0 ? (hardDone / hard.length) * 100 : 0;

    // By platform
    const platformStats = allQuestions.reduce((acc, q) => {
        const platform = q.platform || 'Other';
        if (!acc[platform]) acc[platform] = { total: 0, done: 0 };
        acc[platform].total++;
        if (q.status === 'done') acc[platform].done++;
        return acc;
    }, {} as Record<string, { total: number; done: number }>);

    const topPlatforms = Object.entries(platformStats)
        .sort((a, b) => b[1].total - a[1].total)
        .slice(0, 5);

    return (
        <div className="max-w-6xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden bg-gradient-to-br from-amber-500/10 via-zinc-900/90 to-zinc-950/90 border border-amber-500/20 rounded-3xl p-4 md:p-8 mb-6 backdrop-blur-sm"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-emerald-500/5 animate-pulse" />

                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl shadow-lg shadow-amber-500/20">
                                <Trophy size={28} className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-white">Your Progress</h2>
                                <p className="text-sm text-zinc-400 font-medium">Keep up the great work!</p>
                            </div>
                        </div>
                        {progress >= 50 && (
                            <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full">
                                <Flame size={16} className="text-amber-500" />
                                <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">On Fire!</span>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 mb-8">
                        <div className="relative">
                            <svg className="w-56 h-56 transform -rotate-90">
                                <circle
                                    cx="112"
                                    cy="112"
                                    r="100"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    fill="transparent"
                                    className="text-zinc-800/50"
                                />
                                <motion.circle
                                    cx="112"
                                    cy="112"
                                    r="100"
                                    stroke="url(#gradient)"
                                    strokeWidth="12"
                                    fill="transparent"
                                    strokeLinecap="round"
                                    initial={{ strokeDashoffset: 628 }}
                                    animate={{ strokeDashoffset: 628 - (628 * progress) / 100 }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    style={{
                                        strokeDasharray: 628,
                                    }}
                                />
                                <defs>
                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#f59e0b" />
                                        <stop offset="100%" stopColor="#10b981" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-6xl font-black text-white tabular-nums">{progress}%</span>
                                <span className="text-sm font-bold text-zinc-500 uppercase tracking-widest mt-1">Complete</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 w-full lg:w-auto">
                            <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-emerald-500/20 rounded-lg">
                                        <Target size={20} className="text-emerald-400" />
                                    </div>
                                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Solved</span>
                                </div>
                                <span className="text-4xl font-black text-emerald-400 tabular-nums">{solved}</span>
                            </div>
                            <div className="bg-gradient-to-br from-zinc-500/10 to-zinc-500/5 border border-zinc-700/30 rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-zinc-700/30 rounded-lg">
                                        <Zap size={20} className="text-zinc-400" />
                                    </div>
                                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Remaining</span>
                                </div>
                                <span className="text-4xl font-black text-zinc-400 tabular-nums">{total - solved}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-zinc-900/90 to-zinc-950/90 border border-zinc-800/50 rounded-2xl p-6 backdrop-blur-sm"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <Award size={20} className="text-blue-400" />
                        </div>
                        <h3 className="text-lg font-bold text-white">By Difficulty</h3>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-bold text-emerald-400">Easy</span>
                                <span className="text-sm font-medium text-zinc-500">{easyDone}/{easy.length}</span>
                            </div>
                            <div className="h-3 bg-zinc-800/50 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${easyProgress}%` }}
                                    transition={{ duration: 1, delay: 0.3 }}
                                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full shadow-lg shadow-emerald-500/20"
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-bold text-amber-500">Medium</span>
                                <span className="text-sm font-medium text-zinc-500">{mediumDone}/{medium.length}</span>
                            </div>
                            <div className="h-3 bg-zinc-800/50 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${mediumProgress}%` }}
                                    transition={{ duration: 1, delay: 0.4 }}
                                    className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full shadow-lg shadow-amber-500/20"
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-bold text-rose-500">Hard</span>
                                <span className="text-sm font-medium text-zinc-500">{hardDone}/{hard.length}</span>
                            </div>
                            <div className="h-3 bg-zinc-800/50 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${hardProgress}%` }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                    className="h-full bg-gradient-to-r from-rose-500 to-rose-400 rounded-full shadow-lg shadow-rose-500/20"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-zinc-900/90 to-zinc-950/90 border border-zinc-800/50 rounded-2xl p-6 backdrop-blur-sm"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-purple-500/10 rounded-lg">
                            <TrendingUp size={20} className="text-purple-400" />
                        </div>
                        <h3 className="text-lg font-bold text-white">Top Platforms</h3>
                    </div>

                    <div className="space-y-4">
                        {topPlatforms.map(([platform, stats], index) => {
                            const platformProgress = (stats.done / stats.total) * 100;
                            return (
                                <motion.div
                                    key={platform}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 + index * 0.1 }}
                                    className="flex items-center justify-between p-3 bg-zinc-800/30 rounded-xl hover:bg-zinc-800/50 transition-colors"
                                >
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-xs font-black">
                                            {platform.charAt(0)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-sm font-semibold text-zinc-300">{platform}</span>
                                                <span className="text-xs font-medium text-zinc-500">{stats.done}/{stats.total}</span>
                                            </div>
                                            <div className="h-1.5 bg-zinc-700/50 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${platformProgress}%` }}
                                                    transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                                                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
