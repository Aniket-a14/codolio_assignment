"use client";

import React, { useState, useEffect } from 'react';
import { ChevronRight, GripVertical, Trash2, FilePlus, FolderPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { toast } from 'sonner';
import { useStore } from '../store/useStore';
import { SortableItem } from './SortableItem';
import { QuestionRow } from './QuestionRow';
import { SubTopicItem } from './SubTopicItem';
import { cn } from '../lib/utils';
import { EMPTY_ARRAY } from '../lib/constants';

import { SortableHandleProps, SortableChildrenProps } from '../types/dnd';

interface TopicItemProps {
    id: string;
    dragHandleProps?: SortableHandleProps;
    searchQuery?: string;
    filters?: { status: string[], difficulty: string[] };
}

export function TopicItem({ id, dragHandleProps, searchQuery = '', filters = { status: [], difficulty: [] } }: TopicItemProps) {
    const topic = useStore((state) => state.topics.byId[id]);
    const subTopicIds = useStore((state) => state.subTopics.orderByTopicId[id] || EMPTY_ARRAY);
    const directQuestionIds = useStore((state) => state.questions.orderByParentId[id] || EMPTY_ARRAY);
    const allQuestions = useStore((state) => state.questions.byId);
    const orderByParent = useStore((state) => state.questions.orderByParentId);

    const addSubTopic = useStore((state) => state.addSubTopic);
    const addQuestion = useStore((state) => state.addQuestion);
    const editTopic = useStore((state) => state.editTopic);
    const deleteTopic = useStore((state) => state.deleteTopic);
    const renamingId = useStore((state) => state.renamingId);
    const setRenamingId = useStore((state) => state.setRenamingId);

    // UI State
    const [isExpanded, setIsExpanded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(topic?.title || '');

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

    if (!topic) return null;

    const handleSave = () => {
        if (title.trim() && title !== topic.title) {
            editTopic(id, title);
            toast.success("Topic Updated", { description: "Title changed successfully." });
        }
        setIsEditing(false);
    };

    const handleAddSubTopic = (e: React.MouseEvent) => {
        e.stopPropagation();
        addSubTopic(id, 'New Section');
        setIsExpanded(true);
        toast.success("Section Added", { description: "New sub-topic created." });
    };

    const handleAddQuestion = (e: React.MouseEvent) => {
        e.stopPropagation();
        addQuestion(id, 'topic', 'New Question');
        setIsExpanded(true);
        toast.success("Question Added", { description: "New question created in topic." });
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        toast("Delete Topic?", {
            description: `This will remove "${topic.title}" and all its contents.`,
            action: {
                label: "Delete",
                onClick: () => {
                    deleteTopic(id);
                    toast.error("Topic Deleted");
                }
            }
        });
    };

    const qList = [
        ...directQuestionIds.map(qId => allQuestions[qId]),
        ...subTopicIds.flatMap(stId => (orderByParent[stId] || []).map(qId => allQuestions[qId]))
    ];
    const doneCount = qList.filter(q => q?.status === 'done').length;
    const totalCount = qList.length;

    // Filter Logic
    const matchesFilter = (qId: string) => {
        const q = allQuestions[qId];
        if (!q) return false;

        const matchesSearch = !searchQuery || q.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filters.status.length === 0 || filters.status.includes(q.status);
        const matchesDifficulty = filters.difficulty.length === 0 || (q.difficulty && filters.difficulty.includes(q.difficulty)) || (filters.difficulty.includes('medium') && !q.difficulty); // Default to medium

        return matchesSearch && matchesStatus && matchesDifficulty;
    };

    const isFilteringActive = searchQuery.length > 0 || filters.status.length > 0 || filters.difficulty.length > 0;
    const cleanDirectQuestionIds = directQuestionIds.filter(matchesFilter);
    const cleanSubTopicIds = subTopicIds.filter(stId => {
        if (!isFilteringActive) return true; // Show all sections if not filtering
        const questions = orderByParent[stId] || [];
        return questions.some(matchesFilter);
    });

    const hasContent = cleanDirectQuestionIds.length > 0 || cleanSubTopicIds.length > 0;

    // If filtering is active and no content matches, hide this topic
    if ((searchQuery || filters.status.length > 0 || filters.difficulty.length > 0) && !hasContent) {
        return null;
    }

    // Auto-expand if filtering
    const expandedState = isFilteringActive ? true : isExpanded;

    return (
        <div className="group flex flex-col w-full">
            <div
                className={cn(
                    "flex items-center justify-between py-2.5 pr-4 pl-3 md:pr-6 md:pl-4 cursor-pointer transition-all duration-200 ease-linear border-b border-t border-b-[#27272a]/40 border-t-[#27272a]/20 select-none group/row",
                    expandedState ? "bg-[#111112]" : "hover:bg-[#111112]"
                )}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-4">
                    <div
                        {...dragHandleProps?.attributes}
                        {...dragHandleProps?.listeners}
                        className="hidden md:flex text-zinc-700 hover:text-zinc-500 cursor-grab active:cursor-grabbing md:opacity-0 group-hover/row:opacity-100 transition-opacity"
                        style={{ touchAction: 'none' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <GripVertical size={14} strokeWidth={2} />
                    </div>

                    <div className="flex items-center gap-4">
                        {isEditing ? (
                            <input
                                autoFocus
                                className="bg-transparent border-none focus:ring-0 text-[18px] font-bold text-white p-0"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                onBlur={handleSave}
                                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                                onClick={(e) => e.stopPropagation()}
                            />
                        ) : (
                            <h2
                                onDoubleClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
                                className="text-base md:text-[18px] font-bold text-zinc-100 tracking-tight group-hover/row:text-white transition-colors truncate max-w-[140px] xs:max-w-none"
                            >
                                {topic.title}
                            </h2>
                        )}
                        <div className="flex items-center gap-1.5 px-2 py-px bg-zinc-900/20 rounded border border-zinc-800/30">
                            <span className="text-[10px] font-bold text-zinc-500 tabular-nums tracking-wide">{doneCount}</span>
                            <span className="text-[9px] font-medium text-zinc-700 uppercase tracking-wide">/ {totalCount}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 md:gap-4">
                    <div className="flex items-center gap-0.5 md:gap-1 opacity-60 md:opacity-0 group-hover/row:opacity-100 transition-opacity">
                        <button
                            onClick={handleAddQuestion}
                            className="p-1.5 text-zinc-700 hover:text-emerald-500 hover:bg-zinc-800/40 rounded-lg transition-all"
                            title="Add Question"
                        >
                            <FilePlus size={14} strokeWidth={2.5} />
                        </button>
                        <button
                            onClick={handleAddSubTopic}
                            className="p-1.5 text-zinc-700 hover:text-amber-500 hover:bg-zinc-800/40 rounded-lg transition-all"
                            title="Add Section"
                        >
                            <FolderPlus size={14} strokeWidth={2.5} />
                        </button>
                        <button
                            onClick={handleDelete}
                            className="p-1.5 text-zinc-700 hover:text-rose-500 hover:bg-zinc-800/40 rounded-lg transition-all"
                            title="Delete Topic"
                        >
                            <Trash2 size={14} strokeWidth={2} />
                        </button>
                    </div>
                    <ChevronRight
                        size={18}
                        strokeWidth={2.5}
                        className={cn(
                            "transition-transform duration-300 ease-premium",
                            expandedState ? "rotate-90 text-amber-500" : "text-zinc-800 group-hover/row:text-zinc-600"
                        )}
                    />
                </div>
            </div>

            <AnimatePresence>
                {expandedState && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                        className="bg-[#09090b]"
                    >
                        <div className="py-2 flex flex-col gap-2">
                            {cleanDirectQuestionIds.length > 0 && (
                                <div className="border-b border-[#1a1a1b]/30">
                                    <SortableContext items={cleanDirectQuestionIds} strategy={verticalListSortingStrategy}>
                                        {cleanDirectQuestionIds.map(qId => (
                                            <SortableItem key={qId} id={qId}>
                                                {({ attributes, listeners }: SortableChildrenProps) => (
                                                    <QuestionRow id={qId} dragHandleProps={{ attributes, listeners }} searchQuery={searchQuery} />
                                                )}
                                            </SortableItem>
                                        ))}
                                    </SortableContext>
                                </div>
                            )}

                            <SortableContext items={cleanSubTopicIds} strategy={verticalListSortingStrategy}>
                                {cleanSubTopicIds.map(stId => (
                                    <SortableItem key={stId} id={stId}>
                                        {({ attributes, listeners }: SortableChildrenProps) => (
                                            <SubTopicItem
                                                id={stId}
                                                dragHandleProps={{ attributes, listeners }}
                                                searchQuery={searchQuery}
                                                filters={filters}
                                            />
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
