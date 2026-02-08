"use client";

import React, { useState, useEffect } from 'react';
import { ChevronRight, GripVertical, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { toast } from 'sonner';
import { useStore } from '../store/useStore';
import { SortableItem } from './SortableItem';
import { QuestionRow } from './QuestionRow';
import { cn } from '../lib/utils';
import { EMPTY_ARRAY } from '../lib/constants';

import { SortableHandleProps, SortableChildrenProps } from '../types/dnd';

interface SubTopicItemProps {
    id: string;
    dragHandleProps?: SortableHandleProps;
    searchQuery?: string;
    filters?: { status: string[], difficulty: string[] };
}

export function SubTopicItem({ id, dragHandleProps, searchQuery = '', filters = { status: [], difficulty: [] } }: SubTopicItemProps) {
    const subTopic = useStore((state) => state.subTopics.byId[id]);
    const questionIds = useStore((state) => state.questions.orderByParentId[id] || EMPTY_ARRAY);
    const addQuestion = useStore((state) => state.addQuestion);
    const editSubTopic = useStore((state) => state.editSubTopic);
    const deleteSubTopic = useStore((state) => state.deleteSubTopic);
    const renamingId = useStore((state) => state.renamingId);
    const setRenamingId = useStore((state) => state.setRenamingId);

    const [isExpanded, setIsExpanded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(subTopic?.title || '');

    // Filter Logic
    const allQuestionsMap = useStore((state) => state.questions.byId);

    useEffect(() => {
        if (renamingId === id) {
            // Delay to avoid sync render cycle warning
            const timer = setTimeout(() => {
                setIsEditing(true);
                setRenamingId(null);
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [renamingId, id, setRenamingId]);

    if (!subTopic) return null;

    const handleSave = () => {
        if (title.trim() && title !== subTopic.title) {
            editSubTopic(id, title);
            toast.success("Section Updated", { description: "Title changed successfully." });
        }
        setIsEditing(false);
    };

    const handleAddQuestion = (e: React.MouseEvent) => {
        e.stopPropagation();
        addQuestion(id, 'subTopic', 'New Question');
        setIsExpanded(true);
        toast.success("Question Added", { description: "New question added to section." });
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        toast("Delete Section?", {
            description: `This will remove "${subTopic.title}" and its questions.`,
            action: {
                label: "Delete",
                onClick: () => {
                    deleteSubTopic(id);
                    toast.error("Section Removed");
                }
            }
        });
    };

    const doneCount = questionIds.filter(qId => useStore.getState().questions.byId[qId]?.status === 'done').length;

    const matchesFilter = (qId: string) => {
        const q = allQuestionsMap[qId];
        if (!q) return false;

        const matchesSearch = !searchQuery || q.title.toLowerCase().includes(searchQuery.toLowerCase());
        // Fix: Ensure q.status has a value before checking. If not, assume 'todo'
        const qStatus = q.status || 'todo';
        const matchesStatus = filters.status.length === 0 || filters.status.includes(qStatus);

        // Fix: Ensure medium matches if difficulty is missing
        const qDiff = q.difficulty;
        const matchesDifficulty = filters.difficulty.length === 0 ||
            (qDiff && filters.difficulty.includes(qDiff)) ||
            (filters.difficulty.includes('medium') && !qDiff);

        return matchesSearch && matchesStatus && matchesDifficulty;
    };

    const cleanQuestionIds = questionIds.filter(matchesFilter);

    // If filtering is active and no content matches, hide this sub-topic
    if ((searchQuery || filters.status.length > 0 || filters.difficulty.length > 0) && cleanQuestionIds.length === 0) {
        return null;
    }

    const isfiltering = searchQuery.length > 0 || filters.status.length > 0 || filters.difficulty.length > 0;
    const expandedState = isfiltering ? true : isExpanded;

    return (
        <div className="flex flex-col w-full bg-[#09090b]">
            <div
                className="flex items-center justify-between py-1.5 pr-6 pl-12 group/sub cursor-pointer hover:bg-[#111112] transition-all duration-200 ease-linear select-none border-b border-[#27272a]/20"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-4">
                    <ChevronRight
                        size={12}
                        strokeWidth={2}
                        className={cn("text-zinc-700 transition-transform duration-200 ease-linear", expandedState && "rotate-90 text-zinc-500")}
                    />

                    <div className="flex items-center gap-4">
                        {isEditing ? (
                            <input
                                autoFocus
                                className="bg-transparent border-none focus:ring-0 text-[16px] font-semibold text-zinc-200 p-0"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                onBlur={handleSave}
                                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                                onClick={(e) => e.stopPropagation()}
                            />
                        ) : (
                            <span
                                onDoubleClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
                                className={cn(
                                    "text-[16px] font-semibold tracking-tight transition-colors",
                                    expandedState ? "text-zinc-200" : "text-zinc-500 group-hover/sub:text-zinc-400"
                                )}
                            >
                                {subTopic.title}
                            </span>
                        )}
                        <div className="flex items-center gap-1.5 px-1.5 py-px bg-zinc-900/30 rounded border border-zinc-800/40">
                            <span className="text-[9px] font-semibold text-zinc-600 tabular-nums tracking-wide">{doneCount}</span>
                            <span className="text-[9px] font-medium text-zinc-700 uppercase tracking-wide">/ {questionIds.length}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 opacity-0 group-hover/sub:opacity-100 transition-opacity">
                    <div
                        {...dragHandleProps}
                        className="text-zinc-900 hover:text-zinc-700 cursor-grab active:cursor-grabbing mr-2"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <GripVertical size={14} strokeWidth={2} />
                    </div>
                    <button
                        onClick={handleAddQuestion}
                        className="p-1 text-zinc-800 hover:text-emerald-500 hover:bg-zinc-900/50 rounded transition-all"
                        title="Add Question"
                    >
                        <Plus size={14} strokeWidth={3} />
                    </button>
                    <button
                        onClick={handleDelete}
                        className="p-1 text-zinc-800 hover:text-rose-500 hover:bg-zinc-900/50 rounded transition-all"
                        title="Delete Section"
                    >
                        <Trash2 size={14} strokeWidth={2} />
                    </button>
                </div>
            </div>
            
            <AnimatePresence>
                {expandedState && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="pl-4 py-1">
                            <SortableContext items={cleanQuestionIds} strategy={verticalListSortingStrategy}>
                                {cleanQuestionIds.map(qId => (
                                    <SortableItem key={qId} id={qId}>
                                        {({ attributes, listeners }: SortableChildrenProps) => (
                                            <QuestionRow id={qId} dragHandleProps={{ attributes, listeners }} searchQuery={searchQuery} />
                                        )}
                                    </SortableItem>
                                ))}
                            </SortableContext>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
