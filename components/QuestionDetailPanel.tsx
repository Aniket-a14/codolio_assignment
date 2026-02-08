"use client";

import React, { useState, useEffect } from 'react';
import {
    X,
    Star,
    ExternalLink,
    FileText,
    CheckCircle2,
    Circle,
    Copy,
    Plus,
    Move,
    Trash2,
    Monitor,
    List,
    Layers,
    ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';
import { RotateCw } from 'lucide-react';

// Helper to render platform logos with premium SVGs
const PlatformLogo = ({ platform, className }: { platform?: string; className?: string }) => {
    const p = platform?.toLowerCase().trim();

    if (p === 'leetcode') {
        return (
            <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
                <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226c-1.283 1.283-1.283 3.363 0 4.646l4.218 4.217c1.283 1.283 3.363 1.283 4.646 0L21.314 9.75a1.373 1.373 0 0 0 0-1.943 1.373 1.373 0 0 0-1.943 0l-5.333 5.333c-.64.64-1.681.64-2.322 0l-4.219-4.218c-.64-.64-.64-1.68 0-2.322l5.405-5.405L13.483 0z" fill="#FFA116" />
                <path d="M16.118 3.567l-2.635 2.636c-.64.64-.183 1.737.721 1.737h5.27c.64 0 1.159-.519 1.159-1.159v-5.27c0-.905-1.097-1.362-1.737-.722l-2.779 2.778z" fill="#A5A5A5" />
            </svg>
        );
    }

    if (p === 'geeksforgeeks' || p === 'gfg') {
        return (
            <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
                <path d="M1.327 19.556c.829 1.18 1.915 2.14 3.258 2.88 1.343.74 2.813 1.11 4.414 1.11 1.763 0 3.313-.395 4.654-.92l-.44-3.56c-1.114.47-2.315.705-3.605.705-2.022 0-3.64-.61-4.852-1.83-1.213-1.22-1.82-2.766-1.82-4.636 0-1.886.602-3.41 1.802-4.576C6.11 7.563 7.7 6.98 9.553 6.98c1.327 0 2.536.264 3.633.79l.235-3.475C12.185 3.79 10.74 3.54 9.082 3.54 6.784 3.54 4.79 4.3 3.098 5.82c-1.708 1.52-2.563 3.633-2.563 6.34 0 3.033.892 5.5.792 7.396zm21.346-7.31c0-1.886-.607-3.414-1.82-4.582-1.216-1.168-2.825-1.752-4.83-1.752-1.36 0-2.584.25-3.673.754l-.322-3.59c1.265-.47 2.686-.705 4.264-.705 3.078 0 5.488.8 7.23 2.4s2.614 3.864 2.614 6.79c0 3.125-.873 5.62-2.613 7.48-1.74 1.86-4.04 2.788-6.9 2.788-1.6 0-3.085-.295-4.453-.884a10.875 10.875 0 0 1-3.32-2.584l.674-7.222 6.645-.06.117 3.32h-3.4l-.176 1.88c1.173.47 2.374.704 3.61.704 1.86 0 3.33-.513 4.41-1.54 1.077-1.026 1.614-2.476 1.614-4.347z" fill="#2F8D46" />
            </svg>
        );
    }

    if (p === 'interviewbit') {
        return (
            <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0h24v24H0z" fill="#008CBA" />
                <path d="M7 6h2v12H7zm5 0h2v12h-2zm5 0h2v12h-2z" fill="#fff" />
            </svg>
        );
    }

    if (p === 'codestudio' || p === 'codingninjas' || p === 'naukri' || p === 'coding ninjas') {
        return (
            <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
                <path d="M12 24C5.373 24 0 18.627 0 12S5.373 0 12 0s12 5.373 12 12-5.373 12-12 12z" fill="#F05423" />
                <path d="M8 8l8 4-8 4v-8z" fill="#fff" />
            </svg>
        );
    }

    if (p === 'tuf' || p === 'takeuforward' || p === 'tuf_plus' || p === 'tuf plus') {
        return (
            <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0L1.5 6v12L12 24l10.5-6V6L12 0z" fill="#EAB308" />
                <path d="M9 7h6v2h-2v8h-2V9H9V7z" fill="#fff" />
            </svg>
        );
    }

    if (p === 'spoj' || p === 'sphere online judge') {
        return (
            <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="#005FA9" />
                <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" fill="#fff" />
            </svg>
        );
    }

    return <RotateCw size={14} className={className} strokeWidth={1.5} />;
};

export function QuestionDetailPanel() {
    const activeQuestionId = useStore((state) => state.activeQuestionId);
    const setActiveQuestion = useStore((state) => state.setActiveQuestion);
    const question = useStore((state) => activeQuestionId ? state.questions.byId[activeQuestionId] : null);
    const allQuestions = useStore((state) => state.questions.byId);
    const topics = useStore((state) => state.topics);
    const subTopics = useStore((state) => state.subTopics);
    const editQuestion = useStore((state) => state.editQuestion);
    const moveQuestion = useStore((state) => state.moveQuestion);
    const deleteQuestion = useStore((state) => state.deleteQuestion);

    const [activeTab, setActiveTab] = useState<'overview' | 'notes'>('overview');
    const [tagInput, setTagInput] = useState('');
    const [isAddingTag, setIsAddingTag] = useState(false);
    const [sheetInput, setSheetInput] = useState('');
    const [isAddingSheet, setIsAddingSheet] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Escape key to close panel
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && activeQuestionId) {
                setActiveQuestion(null);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeQuestionId, setActiveQuestion]);

    const toggleStatus = () => {
        if (question) {
            editQuestion(question.id, { status: question.status === 'done' ? 'todo' : 'done' });
        }
    };

    const handleDelete = () => {
        if (!question) return;

        const title = question.title;
        const qId = question.id;

        toast("Delete Question?", {
            description: `Are you sure you want to delete "${title}"?`,
            action: {
                label: "Delete",
                onClick: () => {
                    deleteQuestion(qId);
                    setActiveQuestion(null);
                    toast.error("Question Deleted", { description: `"${title}" has been removed.` });
                }
            }
        });
    };

    const handleMove = (newParentId: string) => {
        if (!question) return;

        let toParentType: 'topic' | 'subTopic' = 'topic';
        if (subTopics.byId[newParentId]) toParentType = 'subTopic';

        moveQuestion(question.id, question.parentId, newParentId, 0, toParentType);
        toast.success("Question Moved", { description: `Relocated to ${subTopics.byId[newParentId]?.title || topics.byId[newParentId]?.title}.` });
    };

    const handleAddTag = () => {
        if (!question || !tagInput.trim()) return;
        const tag = tagInput.trim();
        const currentTags = question.customTags || [];
        if (!currentTags.includes(tag)) {
            editQuestion(question.id, { customTags: [...currentTags, tag] });
            toast.success("Tag Added", { description: `"${tag}" added to custom tags.` });
        }
        setTagInput('');
        setIsAddingTag(false);
    };

    const handleRemoveTag = (tagToRemove: string) => {
        if (!question) return;
        const currentTags = question.customTags || [];
        editQuestion(question.id, { customTags: currentTags.filter(t => t !== tagToRemove) });
        toast.error("Tag Removed");
    };

    const handleAddSheet = () => {
        if (!question || !sheetInput.trim()) return;
        const sheet = sheetInput.trim();
        const currentSheets = question.customSheets || [];
        if (!currentSheets.includes(sheet)) {
            editQuestion(question.id, { customSheets: [...currentSheets, sheet] });
            toast.success("Sheet Added", { description: `Added to "${sheet}".` });
        }
        setSheetInput('');
        setIsAddingSheet(false);
    };

    const handleRemoveSheet = (sheetToRemove: string) => {
        if (!question) return;
        const currentSheets = question.customSheets || [];
        editQuestion(question.id, { customSheets: currentSheets.filter(s => s !== sheetToRemove) });
        toast.error("Sheet Removed");
    };

    // Lock Body Scroll
    React.useEffect(() => {
        if (activeQuestionId) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [activeQuestionId]);

    if (!activeQuestionId || !question) return null;

    return (
        <AnimatePresence>
            {activeQuestionId && question && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setActiveQuestion(null)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    />

                    <motion.div
                        initial={isMobile ? { y: "100%", x: 0 } : { x: "100%", y: 0 }}
                        animate={{ x: 0, y: 0 }}
                        exit={isMobile ? { y: "100%", x: 0 } : { x: "100%", y: 0 }}
                        transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
                        className="fixed inset-y-0 right-0 w-full md:w-[550px] bg-[#0c0c0e] border-l border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)] z-50 flex flex-col rounded-t-[32px] md:rounded-t-none overflow-hidden"
                    >
                        <div className="flex flex-col h-full overflow-hidden">
                            <div className="shrink-0 px-6 py-4 border-b border-[#27272a]/50 bg-[#0c0c0e]">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setActiveQuestion(null)}
                                            className="p-1 hover:bg-zinc-800 rounded-md transition-colors text-zinc-400"
                                        >
                                            <X size={20} />
                                        </button>
                                        <span className="text-lg font-bold text-zinc-100">
                                            {question.id.startsWith('temp') ? 'Add Question' : 'Question Detail'}
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <button
                                            onClick={handleDelete}
                                            className="p-1 hover:bg-rose-950/30 rounded-md transition-colors text-zinc-500 hover:text-rose-500 mr-2"
                                            title="Delete Question"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => setActiveQuestion(null)}
                                            className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold rounded-md transition-colors shadow-lg active:scale-95"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="shrink-0 px-8 pt-6 pb-2 bg-[#0c0c0e]">
                                <div className="flex items-center justify-between mb-6 group">
                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                        <button
                                            onClick={toggleStatus}
                                            className={cn(
                                                "shrink-0 transition-colors",
                                                question.status === 'done' ? "text-emerald-500" : "text-zinc-600 hover:text-zinc-400"
                                            )}
                                        >
                                            {question.status === 'done' ? <CheckCircle2 size={28} strokeWidth={2.5} /> : <Circle size={28} strokeWidth={2} />}
                                        </button>
                                        <input
                                            type="text"
                                            value={question.title}
                                            onChange={(e) => editQuestion(question.id, { title: e.target.value })}
                                            className="text-2xl font-bold text-zinc-100 bg-transparent border-b-2 border-transparent hover:border-zinc-700 focus:border-amber-500 outline-none transition-colors flex-1 min-w-0"
                                            placeholder="Question Title"
                                        />
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0">
                                        <button
                                            onClick={() => editQuestion(question.id, { bookmarked: !question.bookmarked })}
                                            className={cn(
                                                "p-2 rounded-full transition-all hover:bg-zinc-800/50",
                                                question.bookmarked ? "text-amber-400" : "text-zinc-600 hover:text-zinc-400"
                                            )}
                                        >
                                            <Star size={24} fill={question.bookmarked ? "currentColor" : "none"} strokeWidth={1.5} />
                                        </button>
                                        <button className="p-2 text-white hover:bg-zinc-800/50 rounded-full transition-colors">
                                            <ArrowLeft size={24} strokeWidth={2} />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 border-b border-[#27272a]">
                                    <button
                                        onClick={() => setActiveTab('overview')}
                                        className={cn(
                                            "pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2",
                                            activeTab === 'overview'
                                                ? "border-amber-500 text-amber-500"
                                                : "border-transparent text-zinc-500 hover:text-zinc-300"
                                        )}
                                    >
                                        <FileText size={16} />
                                        <span>Overview</span>
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('notes')}
                                        className={cn(
                                            "pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2",
                                            activeTab === 'notes'
                                                ? "border-amber-500 text-amber-500"
                                                : "border-transparent text-zinc-500 hover:text-zinc-300"
                                        )}
                                    >
                                        <Copy size={16} />
                                        <span>Notes</span>
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar px-8 py-6">

                                {activeTab === 'overview' ? (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="space-y-8"
                                    >
                                        <section className="space-y-4">
                                            <h2 className="text-xl font-black tracking-tight text-white mb-4">Question Details</h2>
                                            <div className="space-y-4 text-sm">
                                                <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] items-start gap-2 sm:gap-4">
                                                    <span className="text-zinc-400 flex items-center gap-3 font-semibold pt-2">
                                                        <Move size={18} className="text-zinc-600" /> Location:
                                                    </span>
                                                    <select
                                                        value={question.parentId}
                                                        onChange={(e) => handleMove(e.target.value)}
                                                        className="bg-[#1a1a1b] border border-[#27272a] rounded-md text-xs font-bold text-zinc-300 px-4 py-2.5 focus:ring-1 focus:ring-amber-500/50 outline-none max-w-[325px]"
                                                    >
                                                        <optgroup label="Topics">
                                                            {topics.order.map(tId => (
                                                                <option key={tId} value={tId}>{topics.byId[tId]?.title}</option>
                                                            ))}
                                                        </optgroup>
                                                        <optgroup label="Sections">
                                                            {Object.values(subTopics.byId).map(st => (
                                                                <option key={st.id} value={st.id}>
                                                                    {topics.byId[st.topicId]?.title} &rarr; {st.title}
                                                                </option>
                                                            ))}
                                                        </optgroup>
                                                    </select>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] items-start gap-2 sm:gap-4">
                                                    <span className="text-zinc-400 flex items-center gap-3 font-semibold pt-2">
                                                        <Monitor size={18} className="text-zinc-600" /> Difficulty:
                                                    </span>
                                                    <select
                                                        value={question.difficulty || 'medium'}
                                                        onChange={(e) => editQuestion(question.id, { difficulty: e.target.value as 'easy' | 'medium' | 'hard' })}
                                                        className={cn(
                                                            "bg-[#1a1a1b] border border-[#27272a] rounded-md text-sm font-bold px-4 py-2.5 focus:ring-1 focus:ring-amber-500/50 outline-none max-w-md",
                                                            question.difficulty === 'easy' ? "text-emerald-400" :
                                                                question.difficulty === 'medium' ? "text-amber-500" : "text-rose-500"
                                                        )}
                                                    >
                                                        <option value="easy" className="text-emerald-400">Easy</option>
                                                        <option value="medium" className="text-amber-500">Medium</option>
                                                        <option value="hard" className="text-rose-500">Hard</option>
                                                    </select>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] items-start gap-2 sm:gap-4">
                                                    <span className="text-zinc-400 flex items-center gap-3 font-semibold pt-2">
                                                        <Monitor size={18} className="text-zinc-600" /> Platform:
                                                    </span>
                                                    <input
                                                        type="text"
                                                        value={question.platform || ''}
                                                        onChange={(e) => editQuestion(question.id, { platform: e.target.value })}
                                                        placeholder="LeetCode, GeeksforGeeks, etc."
                                                        className="bg-[#1a1a1b] border border-[#27272a] rounded-md text-xs font-medium text-zinc-300 px-4 py-2.5 focus:ring-1 focus:ring-amber-500/50 outline-none placeholder:text-zinc-700 max-w-md"
                                                    />
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] items-start gap-2 sm:gap-4">
                                                    <span className="text-zinc-400 flex items-center gap-3 font-semibold pt-2">
                                                        <ExternalLink size={18} className="text-zinc-600" /> Question Link:
                                                    </span>
                                                    <div className="flex items-center gap-2 max-w-md">
                                                        <input
                                                            type="url"
                                                            value={question.link || ''}
                                                            onChange={(e) => editQuestion(question.id, { link: e.target.value })}
                                                            placeholder="https://leetcode.com/problems/..."
                                                            className="bg-[#1a1a1b] border border-[#27272a] rounded-md text-xs font-medium text-zinc-300 px-4 py-2.5 focus:ring-1 focus:ring-amber-500/50 outline-none placeholder:text-zinc-700 flex-1"
                                                        />
                                                        {question.link && (
                                                            <a
                                                                href={question.link}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-950/30 rounded-md transition-colors border border-transparent hover:border-blue-900/30"
                                                                title="Open question link"
                                                            >
                                                                <ExternalLink size={16} />
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] items-start gap-2 sm:gap-4">
                                                    <span className="text-zinc-400 flex items-center gap-3 font-semibold pt-2">
                                                        <svg width="18" height="18" viewBox="0 0 24 24" className="fill-rose-600">
                                                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" />
                                                        </svg> Video URL:
                                                    </span>
                                                    <div className="flex items-center gap-2 max-w-md">
                                                        <input
                                                            type="url"
                                                            value={question.videoUrl || ''}
                                                            onChange={(e) => editQuestion(question.id, { videoUrl: e.target.value })}
                                                            placeholder="https://youtube.com/watch?v=..."
                                                            className="bg-[#1a1a1b] border border-[#27272a] rounded-md text-xs font-medium text-zinc-300 px-4 py-2.5 focus:ring-1 focus:ring-amber-500/50 outline-none placeholder:text-zinc-700 flex-1"
                                                        />
                                                        {question.videoUrl && (
                                                            <a
                                                                href={question.videoUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-md transition-colors border border-transparent hover:border-rose-900/30"
                                                                title="Watch video"
                                                            >
                                                                <ExternalLink size={16} />
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] items-start gap-2 sm:gap-4">
                                                    <span className="text-zinc-400 flex items-center gap-3 font-semibold pt-1">
                                                        <List size={18} className="text-zinc-600" /> Topics:
                                                    </span>
                                                    <div className="flex flex-wrap gap-2">
                                                        {(question.tags && question.tags.length > 0 ? question.tags : ['Arrays', 'Hashing']).map(tag => (
                                                            <span key={tag} className="px-3 py-1.5 bg-[#1a1a1b] border border-[#27272a] rounded-md text-xs font-bold text-zinc-400 hover:border-zinc-700 transition-colors">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] items-start gap-2 sm:gap-4">
                                                    <span className="text-zinc-400 flex items-center gap-3 font-semibold pt-1">
                                                        <Layers size={18} className="text-zinc-600" /> Popular Sheets:
                                                    </span>
                                                    <div className="flex flex-wrap gap-2">
                                                        {(question.popularSheets && question.popularSheets.length > 0 ? question.popularSheets : ["Striver's SDE Sheet", "Neetcode 150", "Blind 75"]).map(sheet => (
                                                            <span key={sheet} className="px-3 py-1.5 bg-[#1a1a1b] border border-[#27272a] rounded-md text-xs font-bold text-zinc-400 hover:border-zinc-700 transition-colors">
                                                                {sheet}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </section>

                                        <section className="space-y-4">
                                            <h2 className="text-xl font-black tracking-tight text-white border-t border-[#27272a]/40 pt-8 mb-4 flex items-center gap-3">
                                                Custom Details
                                            </h2>
                                            <div className="space-y-5 text-sm">
                                                <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] items-start gap-2 sm:gap-4">
                                                    <span className="text-zinc-400 font-bold pt-1">Additional Tags :</span>
                                                    <div className="flex flex-wrap gap-2">
                                                        {question.customTags?.map(tag => (
                                                            <span key={tag} className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-md text-xs font-bold text-amber-400 group/tag">
                                                                {tag}
                                                                <button
                                                                    onClick={() => handleRemoveTag(tag)}
                                                                    className="hover:text-rose-500 transition-colors opacity-0 group-hover/tag:opacity-100"
                                                                >
                                                                    <X size={12} />
                                                                </button>
                                                            </span>
                                                        ))}
                                                        {isAddingTag ? (
                                                            <div className="flex items-center gap-2">
                                                                <input
                                                                    autoFocus
                                                                    className="bg-[#1a1a1b] border border-amber-500/50 rounded-md text-[11px] font-bold text-zinc-100 px-2 py-1 focus:ring-1 focus:ring-amber-500 outline-none w-24"
                                                                    value={tagInput}
                                                                    onChange={(e) => setTagInput(e.target.value)}
                                                                    onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                                                                    onBlur={() => !tagInput && setIsAddingTag(false)}
                                                                />
                                                                <button onClick={handleAddTag} className="text-emerald-500 hover:text-emerald-400">
                                                                    <CheckCircle2 size={16} />
                                                                </button>
                                                                <button onClick={() => setIsAddingTag(false)} className="text-zinc-600 hover:text-zinc-400">
                                                                    <X size={16} />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={() => setIsAddingTag(true)}
                                                                className="flex items-center gap-1.5 px-3 py-1 bg-[#1a1a1b] border border-[#27272a] rounded-md text-xs font-bold text-zinc-500 hover:text-zinc-300 hover:border-zinc-700 transition-all border-dashed"
                                                            >
                                                                <Plus size={12} /> Add Tag
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-[140px_1fr] items-start">
                                                    <span className="text-zinc-400 font-bold pt-1">Custom Sheets :</span>
                                                    <div className="flex flex-wrap gap-2">
                                                        {question.customSheets?.map(sheet => (
                                                            <span key={sheet} className="flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-md text-xs font-bold text-indigo-400 group/sheet">
                                                                {sheet}
                                                                <button
                                                                    onClick={() => handleRemoveSheet(sheet)}
                                                                    className="hover:text-rose-500 transition-colors opacity-0 group-hover/sheet:opacity-100"
                                                                >
                                                                    <X size={12} />
                                                                </button>
                                                            </span>
                                                        ))}
                                                        {isAddingSheet ? (
                                                            <div className="flex items-center gap-2">
                                                                <input
                                                                    autoFocus
                                                                    className="bg-[#1a1a1b] border border-indigo-500/50 rounded-md text-[11px] font-bold text-zinc-100 px-2 py-1 focus:ring-1 focus:ring-indigo-500 outline-none w-32"
                                                                    value={sheetInput}
                                                                    onChange={(e) => setSheetInput(e.target.value)}
                                                                    onKeyDown={(e) => e.key === 'Enter' && handleAddSheet()}
                                                                    onBlur={() => !sheetInput && setIsAddingSheet(false)}
                                                                />
                                                                <button onClick={handleAddSheet} className="text-emerald-500 hover:text-emerald-400">
                                                                    <CheckCircle2 size={16} />
                                                                </button>
                                                                <button onClick={() => setIsAddingSheet(false)} className="text-zinc-600 hover:text-zinc-400">
                                                                    <X size={16} />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={() => setIsAddingSheet(true)}
                                                                className="flex items-center gap-1.5 px-3 py-1 bg-[#1a1a1b] border border-[#27272a] rounded-md text-xs font-bold text-zinc-500 hover:text-zinc-300 hover:border-zinc-700 transition-all border-dashed"
                                                            >
                                                                <Plus size={12} /> Add to Sheet
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </section>

                                        <section className="space-y-6 pt-10 border-t border-[#27272a]/40">
                                            <h2 className="text-xl font-black tracking-tight text-white mb-6">Alternate Questions</h2>
                                            <div className="space-y-3">
                                                {question.similarQuestions && question.similarQuestions.length > 0 ? (
                                                    question.similarQuestions.map((qId) => {
                                                        const similarQ = allQuestions[qId];
                                                        if (!similarQ) return null;

                                                        return (
                                                            <div
                                                                key={qId}
                                                                onClick={() => setActiveQuestion(qId)}
                                                                className="flex items-center justify-between p-4 rounded-xl border border-[#27272a] bg-[#0c0c0e] hover:bg-[#111112] hover:border-zinc-700/50 transition-all cursor-pointer group shadow-sm active:scale-[0.98]"
                                                            >
                                                                <div className="flex items-center gap-4">
                                                                    <Circle
                                                                        size={20}
                                                                        className={cn(
                                                                            "shrink-0",
                                                                            similarQ.status === 'done' ? "text-emerald-500" : "text-zinc-700 group-hover:text-zinc-500"
                                                                        )}
                                                                        strokeWidth={similarQ.status === 'done' ? 3 : 2}
                                                                    />
                                                                    <div className="flex items-center gap-3">
                                                                        <PlatformLogo platform={similarQ.platform} className="w-5 h-5 opacity-80" />
                                                                        <span className="text-[15px] font-bold text-zinc-300 group-hover:text-white transition-colors">
                                                                            {similarQ.title}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                {similarQ.difficulty && (
                                                                    <span className={cn(
                                                                        "text-[11px] font-black px-3 py-1 rounded-md uppercase tracking-wider",
                                                                        similarQ.difficulty === 'easy' ? "text-emerald-500" :
                                                                            similarQ.difficulty === 'medium' ? "text-amber-500" : "text-rose-500"
                                                                    )}>
                                                                        {similarQ.difficulty}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        );
                                                    })
                                                ) : (
                                                    <div className="py-10 text-center border-2 border-dashed border-zinc-900 rounded-2xl bg-zinc-900/10">
                                                        <p className="text-zinc-600 font-bold text-sm">No similar questions found.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </section>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex flex-col space-y-4 h-full min-h-[400px]"
                                    >
                                        <textarea
                                            placeholder="Write your notes here..."
                                            className="w-full flex-1 p-6 bg-[#111112] border border-[#27272a] rounded-xl text-zinc-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-600/30 resize-none transition-all placeholder:text-zinc-700"
                                            value={question.notes || ''}
                                            onChange={(e) => editQuestion(question.id, { notes: e.target.value })}
                                        />
                                        <div className="flex justify-end gap-2 text-[10px] font-bold text-zinc-700 uppercase tracking-widest">
                                            <CheckCircle2 size={12} className="text-zinc-800" />
                                            <span>Autosaved locally</span>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
