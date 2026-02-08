"use client";

import React, { useState } from 'react';
import {
    Circle,
    CheckCircle2,
    GripVertical,
    Trash2,
    ExternalLink,
    Star,
    RotateCw
} from 'lucide-react';
import { toast } from 'sonner';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';
import { HighlightText } from './HighlightText';

interface QuestionRowProps {
    id: string;
    dragHandleProps?: any;
    searchQuery?: string;
}

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

export function QuestionRow({ id, dragHandleProps, searchQuery = '' }: QuestionRowProps) {
    const question = useStore((state) => state.questions.byId[id]);
    const deleteQuestion = useStore((state) => state.deleteQuestion);
    const editQuestion = useStore((state) => state.editQuestion);
    const setActiveQuestion = useStore((state) => state.setActiveQuestion);

    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(question?.title || '');

    if (!question) return null;

    const toggleStatus = () => {
        editQuestion(id, { status: question.status === 'done' ? 'todo' : 'done' });
    };

    const handleSave = () => {
        editQuestion(id, { title });
        setIsEditing(false);
    };

    return (
        <div className="group flex items-center py-3.5 px-4 hover:bg-[#111112] border-b border-[#27272a]/20 border-l-2 border-l-transparent hover:border-l-amber-600/60 transition-all duration-150 ease-out select-none relative bg-[#09090b]">
            {/* 1. Status Indicator */}
            <button
                onClick={toggleStatus}
                className={cn(
                    "mr-4 transition-all shrink-0 z-10",
                    question.status === 'done' ? "text-emerald-500/80 hover:text-emerald-400" : "text-zinc-800 hover:text-zinc-600"
                )}
            >
                {question.status === 'done' ? <CheckCircle2 size={18} strokeWidth={2.5} /> : <Circle size={18} strokeWidth={2} />}
            </button>

            <div
                {...dragHandleProps}
                className="mr-3 text-zinc-800 hover:text-zinc-600 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity shrink-0 z-10"
            >
                <GripVertical size={13} strokeWidth={2} />
            </div>

            {/* 2. Question Title & Verified Badge */}
            <div className="flex-1 min-w-0 mr-6 z-10 flex items-center gap-2">
                {isEditing ? (
                    <input
                        autoFocus
                        className="bg-transparent border-none focus:ring-0 text-[15px] font-semibold text-zinc-100 p-0 w-full"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onBlur={handleSave}
                        onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                        onClick={(e) => e.stopPropagation()}
                    />
                ) : (
                    <div className="flex items-center gap-2 min-w-0">
                        <span
                            onClick={() => setActiveQuestion(id)}
                            onDoubleClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
                            className={cn(
                                "text-[15px] font-semibold tracking-tight cursor-pointer block truncate transition-colors",
                                question.status === 'done' ? "text-zinc-600/80 line-through decoration-zinc-800" : "text-zinc-200 group-hover:text-white"
                            )}
                        >
                            <HighlightText text={question.title} highlight={searchQuery} />
                        </span>
                        {question.verified && (
                            <div className="flex-shrink-0" title="Verified Accuracy">
                                <CheckCircle2 size={12} className="text-amber-500/80" fill="currentColor" strokeWidth={0} />
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Metadata Alignment Grid */}
            <div className="flex items-center gap-6 shrink-0 z-10">

                {/* 3. Platform Logo */}
                <div className="flex items-center justify-end opacity-40 group-hover:opacity-100 transition-opacity min-w-[24px]">
                    <PlatformLogo platform={question.platform} className="w-4 h-4" />
                </div>

                {/* 4. Difficulty Badge - Refined styling */}
                <div className="w-20 flex justify-center">
                    <span className={cn(
                        "text-[9px] font-black uppercase tracking-[0.1em] px-2.5 py-1 rounded-md",
                        question.difficulty === 'easy' ? "text-emerald-400 bg-emerald-400/10 border border-emerald-400/20" :
                            question.difficulty === 'medium' ? "text-amber-400 bg-amber-400/10 border border-amber-400/20" :
                                "text-rose-400 bg-rose-400/10 border border-rose-400/20"
                    )}>
                        {question.difficulty || 'medium'}
                    </span>
                </div>

                {/* 5. YouTube Icon - Refined with branding colors */}
                <div className="flex justify-center shrink-0 min-w-[32px]">
                    {question.videoUrl ? (
                        <a
                            href={question.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 px-2.5 rounded-lg bg-rose-600/10 hover:bg-rose-600 transition-all group/yt cursor-pointer border border-rose-600/20 flex items-center gap-1.5 shadow-[0_4px_12px_rgba(225,29,72,0.1)] active:scale-95"
                            onClick={(e) => e.stopPropagation()}
                            title="Watch Solution"
                        >
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                className="block shrink-0 fill-rose-600 group-hover/yt:fill-white transition-all transform group-hover/yt:scale-110"
                            >
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" />
                                <path fill="white" d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                            </svg>
                        </a>
                    ) : (
                        <div className="w-1 h-1 bg-zinc-800 rounded-full opacity-20" />
                    )}
                </div>

                {/* 6. Tag Pills - Polished */}
                <div className="hidden lg:flex items-center gap-1.5 w-[100px] justify-start overflow-hidden">
                    {(question.tags || []).slice(0, 1).map((tag, idx) => (
                        <span key={idx} className="px-2 py-0.5 border border-zinc-800/80 text-zinc-500 text-[9px] font-bold rounded text-zinc-400/60 uppercase tracking-tighter whitespace-nowrap bg-zinc-900/50">
                            {tag}
                        </span>
                    ))}
                </div>

                {/* 7. Actions - Sleeker placement */}
                <div className="flex items-center gap-0.5 w-[70px] justify-end">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            editQuestion(id, { bookmarked: !question.bookmarked });
                        }}
                        className={cn(
                            "p-2 transition-all hover:scale-110",
                            question.bookmarked ? "text-amber-400 hover:text-amber-300" : "text-zinc-700 hover:text-zinc-400"
                        )}
                    >
                        <Star size={15} strokeWidth={question.bookmarked ? 2.5 : 2} fill={question.bookmarked ? "currentColor" : "none"} />
                    </button>
                    {question.link ? (
                        <a
                            href={question.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-zinc-700 hover:text-zinc-300 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <ExternalLink size={15} strokeWidth={2} />
                        </a>
                    ) : (
                        <button className="p-2 text-zinc-800 cursor-not-allowed">
                            <ExternalLink size={15} strokeWidth={2} />
                        </button>
                    )}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            toast("Delete Question?", {
                                description: `Are you sure you want to delete "${question.title}"?`,
                                action: {
                                    label: "Delete",
                                    onClick: () => {
                                        deleteQuestion(id);
                                        toast.error("Question Deleted", { description: `"${question.title}" has been removed.` });
                                    }
                                }
                            });
                        }}
                        className="p-2 text-zinc-700 hover:text-rose-500 transition-colors"
                    >
                        <Trash2 size={15} strokeWidth={2} />
                    </button>
                </div>
            </div>
        </div>
    );
}

