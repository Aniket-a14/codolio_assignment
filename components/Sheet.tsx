"use client";

import React, { useEffect, useCallback } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import { toast } from "sonner"
import { SortableChildrenProps } from '../types/dnd';

import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
    ChevronRight,
    Search,
    Plus,
    Clock,
    Share2,
    Download,
    FileJson,
    FileSpreadsheet,
    Menu
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { TopicItem } from './TopicItem';
import { SortableItem } from './SortableItem';
import { EntityType } from '../types';
import { cn } from '../lib/utils';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { QuestionDetailPanel } from './QuestionDetailPanel';
import { FilterPopover } from './FilterPopover';
import { exportToJSON, exportToCSV } from '../lib/exportUtils';
import { StatsPanel } from './StatsPanel';

const SENSOR_OPTIONS = {
    mouse: {
        activationConstraint: {
            distance: 5,
        },
    },
    touch: {
        activationConstraint: {
            delay: 250,
            tolerance: 5,
        },
    },
};

export default function Sheet() {
    const questions = useStore((state) => state.questions);
    const {
        topics,
        addTopic,
        reorderEntity,
        subTopics,
        seedStore,
        clearData
    } = useStore();

    const metadata = useStore((state) => state.metadata);

    const allQuestionsList = Object.values(questions.byId);
    const totalCount = allQuestionsList.length;
    const doneCount = allQuestionsList.filter(q => q.status === 'done').length;
    const progressPercent = totalCount > 0 ? (doneCount / totalCount) * 100 : 0;

    // Default Metadata if none loaded (or fallback)
    const sheetTitle = metadata?.title || "Striver SDE Sheet";
    const sheetDesc = metadata?.description || "The definitive roadmap for SDE roles. Curated problems, detailed patterns, and a disciplined focus environment.";

    const mouseSensor = useSensor(MouseSensor, SENSOR_OPTIONS.mouse);
    const touchSensor = useSensor(TouchSensor, SENSOR_OPTIONS.touch);
    const keyboardSensor = useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
    });
    const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

    const [isFollowing, setIsFollowing] = React.useState(false);
    const [activeTab, setActiveTab] = React.useState('Problem List');
    const initialized = React.useRef(false);

    const [searchQuery, setSearchQuery] = React.useState('');
    const [filters, setFilters] = React.useState<{ status: ("todo" | "done")[], difficulty: ("easy" | "medium" | "hard")[], platform: string[] }>({
        status: [],
        difficulty: [],
        platform: []
    });
    const [showExportMenu, setShowExportMenu] = React.useState(false);
    const searchInputRef = React.useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true;
            // Only seed if there's no persisted data in localStorage
            const hasPersistedData = localStorage.getItem('question-sheet-storage');
            if (!hasPersistedData && topics.order.length === 0) {
                seedStore();
            }
        }
    }, [topics.order.length, seedStore]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ctrl+N: New Topic
            if (e.ctrlKey && e.key === 'n') {
                e.preventDefault();
                addTopic('New Topic');
                toast.success('Topic Created', { description: 'New topic added.' });
            }
            // Ctrl+K: Focus Search
            if (e.ctrlKey && e.key === 'k') {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
            // Ctrl+E: Toggle Export Menu
            if (e.ctrlKey && e.key === 'e') {
                e.preventDefault();
                setShowExportMenu(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [addTopic]);

    const handleExportJSON = () => {
        const state = useStore.getState();
        exportToJSON({ topics: state.topics, subTopics: state.subTopics, questions: state.questions, metadata: state.metadata });
        toast.success('Exported to JSON', { description: 'Sheet exported successfully.' });
        setShowExportMenu(false);
    };

    const handleExportCSV = () => {
        const state = useStore.getState();
        exportToCSV({ topics: state.topics, subTopics: state.subTopics, questions: state.questions, metadata: state.metadata });
        toast.success('Exported to CSV', { description: 'Sheet exported successfully.' });
        setShowExportMenu(false);
    };

    const isFiltering = searchQuery.length > 0 || filters.status.length > 0 || filters.difficulty.length > 0 || filters.platform.length > 0;

    const filteredTopics = React.useMemo(() => {
        if (!isFiltering) return topics;

        // Note: For true filtering, we need to pass down the search/filter state to TopicItem
        // and let it filter its children, OR recreate the entire tree structure here.
        // Given the component structure (TopicItem -> SubTopicItem -> QuestionRow),
        // it's cleaner to pass the filter state down and let components hide themselves if empty.
        // However, dnd-kit might get confused if items disappear. 
        // For now, let's pass the logic down.
        // BUT, filtering usually implies we want to see ONLY matching items.
        // A simple approach is to return ALL topics, but pass the filter props.

        return topics;
    }, [topics, isFiltering]);

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;

        if (active.id !== over.id) {
            const activeId = active.id as string;
            const overId = over.id as string;

            // Resolve types and parents
            const getEntityInfo = (id: string) => {
                if (topics.order.includes(id)) return { type: 'topic' as EntityType, parentId: null };
                if (subTopics.byId[id]) return { type: 'subTopic' as EntityType, parentId: subTopics.byId[id].topicId };
                if (questions.byId[id]) return { type: 'question' as EntityType, parentId: questions.byId[id].parentId };
                return null;
            };

            const activeInfo = getEntityInfo(activeId);
            const overInfo = getEntityInfo(overId);

            if (!activeInfo || !overInfo) return;

            // Case 1: Reordering within the same container
            if (activeInfo.parentId === overInfo.parentId && activeInfo.type === overInfo.type) {
                const getOrder = () => {
                    if (activeInfo.type === 'topic') return topics.order;
                    if (activeInfo.type === 'subTopic' && activeInfo.parentId) return subTopics.orderByTopicId[activeInfo.parentId] || [];
                    if (activeInfo.type === 'question' && activeInfo.parentId) return questions.orderByParentId[activeInfo.parentId] || [];
                    return [];
                };

                const order = getOrder();
                const oldIndex = order.indexOf(activeId);
                const newIndex = order.indexOf(overId);

                if (oldIndex !== -1 && newIndex !== -1) {
                    reorderEntity(activeInfo.type, activeInfo.parentId, oldIndex, newIndex);
                }
            }
            // Case 2: Moving Question to a different container
            else if (activeInfo.type === 'question' && activeInfo.parentId !== overInfo.parentId) {
                const fromParentId = activeInfo.parentId!;
                const toParentId = overInfo.parentId || overId;

                let toParentType: 'topic' | 'subTopic' = 'topic';
                if (subTopics.byId[toParentId]) toParentType = 'subTopic';
                else if (topics.byId[toParentId]) toParentType = 'topic';
                else if (questions.byId[toParentId]) {
                    toParentType = questions.byId[toParentId].parentType;
                }

                const toOrder = questions.orderByParentId[toParentId] || [];
                const newIndex = toOrder.indexOf(overId);
                const finalIndex = newIndex === -1 ? toOrder.length : newIndex;

                useStore.getState().moveQuestion(activeId, fromParentId, toParentId, finalIndex, toParentType);
                const destTitle = subTopics.byId[toParentId]?.title || topics.byId[toParentId]?.title || "new location";
                toast.success("Question Moved", { description: `Relocated to ${destTitle}.` });
            }
            // Case 3: Moving SubTopic to a different Topic
            else if (activeInfo.type === 'subTopic' && activeInfo.parentId !== overInfo.parentId && overInfo.type !== 'question') {
                const fromTopicId = activeInfo.parentId!;
                const toTopicId = overInfo.parentId || overId;

                if (topics.byId[toTopicId]) {
                    const toOrder = subTopics.orderByTopicId[toTopicId] || [];
                    const newIndex = toOrder.indexOf(overId);
                    const finalIndex = newIndex === -1 ? toOrder.length : newIndex;

                    useStore.getState().moveSubTopic(activeId, fromTopicId, toTopicId, finalIndex);
                    toast.success("Section Moved", { description: `Relocated to ${topics.byId[toTopicId].title}.` });
                }
            }
        }
    }, [topics, subTopics, questions, reorderEntity]);

    const handleCreateTopic = () => {
        addTopic("New Topic");
        toast.success("Topic Created", {
            description: "New topic added to your sheet.",
            action: {
                label: "Edit",
                onClick: () => {
                    // Double click logic is handled in TopicItem, but we could trigger it here if needed
                }
            }
        });
    };

    return (
        <div className="bg-[#09090b] min-h-screen relative selection:bg-amber-500/20 overflow-x-hidden">
            <div className="absolute top-0 left-0 w-full h-[500px] bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,60,20,0.1),transparent)] pointer-events-none" />
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-zinc-800/50 to-transparent opacity-50" />

            <div className="max-w-[1500px] mx-auto px-4 md:px-8 py-6 md:py-12 relative z-10">
                <nav className="flex items-center justify-between md:justify-start gap-2.5 mb-8 text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-600">
                    <div className="md:hidden">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => useStore.getState().setMobileNavOpen(true)}
                            className="w-10 h-10 -ml-2 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-xl"
                        >
                            <Menu size={20} />
                        </Button>
                    </div>
                    <div className="hidden md:flex items-center gap-2.5">
                        <span className="hover:text-zinc-300 cursor-pointer transition-colors duration-300">Home</span>
                        <ChevronRight size={10} className="text-zinc-800" strokeWidth={3} />
                        <span className="hover:text-zinc-300 cursor-pointer transition-colors duration-300">Explore</span>
                        <ChevronRight size={10} className="text-zinc-800" strokeWidth={3} />
                    </div>
                    <span className="text-amber-600/80 truncate">{sheetTitle}</span>
                </nav>

                <header className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12 lg:gap-20 mb-12 md:mb-20 items-stretch">
                    <div className="flex flex-col justify-center">
                        <div className="flex flex-col gap-4 md:gap-6 mb-6 md:mb-8">
                            <h1 className="text-4xl md:text-[56px] font-extrabold tracking-tight text-white leading-[1.1] md:leading-[0.95] text-balance">
                                {sheetTitle}
                            </h1>
                            <div className="flex items-center gap-3">
                                <Badge variant="secondary" className="rounded-full px-3 py-1 bg-zinc-900/80 text-zinc-400 text-[10px] uppercase font-bold tracking-[0.15em] border border-zinc-800 shadow-sm backdrop-blur-sm">
                                    Curated Path
                                </Badge>
                                <span className="text-zinc-700 text-[10px] uppercase tracking-widest font-bold px-1">•</span>
                                <span className="text-zinc-500 text-[12px] font-semibold tracking-wide">{totalCount} Premium Questions</span>
                            </div>
                        </div>

                        <p className="text-zinc-400 text-[16px] leading-[1.7] max-w-xl font-medium mb-10 text-balance line-clamp-3">
                            {sheetDesc}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 md:gap-5">
                            <Button
                                onClick={() => {
                                    const newState = !isFollowing;
                                    setIsFollowing(newState);
                                    toast(newState ? "Following" : "Unfollowed", {
                                        description: newState ? "You are now tracking this sheet." : "You have unfollowed this sheet.",
                                    });
                                }}
                                className={cn(
                                    "h-12 font-extrabold text-[12px] uppercase tracking-[0.2em] px-10 rounded-xl transition-all active:scale-[0.98] min-w-[160px]",
                                    isFollowing
                                        ? "bg-zinc-900/50 text-zinc-400 border border-zinc-800 hover:bg-zinc-900 hover:text-zinc-200"
                                        : "bg-white text-black hover:bg-zinc-200 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                                )}
                            >
                                {isFollowing ? "Following" : "Follow"}
                                {metadata?.followers && (
                                    <span className="ml-2 opacity-60 text-[10px] font-normal">
                                        ({(metadata.followers + (isFollowing ? 1 : 0)).toLocaleString()})
                                    </span>
                                )}
                            </Button>
                            <Button variant="outline" className="h-12 border-zinc-800 bg-transparent text-zinc-500 hover:bg-zinc-900 hover:text-white font-bold text-[12px] uppercase tracking-[0.2em] px-8 rounded-xl transition-all" onClick={() => {
                                const url = window.location.href;
                                navigator.clipboard.writeText(url);
                                toast.success("Link Copied", { description: "Sheet URL copied to clipboard." });
                            }}>
                                <Share2 size={15} className="mr-2" /> Share
                            </Button>
                            <Button
                                onClick={handleCreateTopic}
                                className="h-12 bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-[12px] uppercase tracking-[0.2em] px-8 rounded-xl transition-all shadow-[0_0_20px_rgba(217,119,6,0.2)] active:scale-95 flex-1 md:flex-none"
                            >
                                <Plus size={18} className="mr-2" strokeWidth={3} /> New Topic
                            </Button>
                        </div>
                    </div>

                    <div className="hidden lg:flex glass-panel rounded-3xl p-8 flex-col items-center relative group/stats transition-all duration-500 hover:border-zinc-700/50 shadow-2xl shadow-black/50">
                        <div className="absolute top-5 right-5 flex items-center gap-2">
                            <button className="p-2.5 text-zinc-500 hover:text-zinc-200 transition-colors bg-zinc-800/30 rounded-lg hover:bg-zinc-800 border border-transparent hover:border-zinc-700">
                                <Clock size={16} strokeWidth={2} />
                            </button>
                            <div className="relative">
                                <button
                                    onClick={() => setShowExportMenu(!showExportMenu)}
                                    className="p-2.5 text-zinc-500 hover:text-emerald-400 transition-colors bg-zinc-800/30 rounded-lg hover:bg-emerald-950/30 border border-transparent hover:border-emerald-900/30"
                                    title="Export (Ctrl+E)"
                                >
                                    <Download size={16} strokeWidth={2} />
                                </button>
                                {showExportMenu && (
                                    <div className="absolute top-full right-0 mt-2 bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl overflow-hidden z-50 min-w-[180px]">
                                        <button
                                            onClick={handleExportJSON}
                                            className="w-full px-4 py-2.5 text-left text-sm font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors flex items-center gap-3"
                                        >
                                            <FileJson size={16} className="text-blue-400" />
                                            Export as JSON
                                        </button>
                                        <button
                                            onClick={handleExportCSV}
                                            className="w-full px-4 py-2.5 text-left text-sm font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors flex items-center gap-3 border-t border-zinc-800"
                                        >
                                            <FileSpreadsheet size={16} className="text-emerald-400" />
                                            Export as CSV
                                        </button>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => {
                                    clearData();
                                    seedStore();
                                    toast.success("Progress Reset", {
                                        description: "All questions have been reset to default state.",
                                    });
                                }}
                                className="p-2.5 text-zinc-500 hover:text-rose-400 transition-colors bg-zinc-800/30 rounded-lg hover:bg-rose-950/30 border border-transparent hover:border-rose-900/30"
                            >
                                <span className="text-[10px] font-black uppercase tracking-widest">Reset</span>
                            </button>
                        </div>

                        <div className="relative w-48 h-48 mb-8 mt-4">
                            <svg className="w-full h-full transform -rotate-90 drop-shadow-2xl">
                                <circle
                                    cx="96"
                                    cy="96"
                                    r="84"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    fill="transparent"
                                    className="text-zinc-900/50"
                                />
                                <circle
                                    cx="96"
                                    cy="96"
                                    r="84"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    fill="transparent"
                                    strokeDasharray={527.7}
                                    strokeDashoffset={527.7 * (1 - progressPercent / 100)}
                                    className="text-amber-500 transition-all duration-1000 ease-premium"
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-5xl font-extrabold text-white tabular-nums tracking-tighter drop-shadow-lg">
                                    {Math.round(progressPercent)}%
                                </span>
                                <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-[0.3em] mt-2">Completed</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between w-full px-8 pt-6 border-t border-zinc-800/50">
                            <div className="flex flex-col items-start gap-1">
                                <span className="text-3xl font-bold text-white tabular-nums tracking-tight">{doneCount}</span>
                                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">Solved</span>
                            </div>
                            <div className="h-10 w-px bg-zinc-800/80" />
                            <div className="flex flex-col items-end gap-1">
                                <span className="text-3xl font-bold text-zinc-500 tabular-nums tracking-tight">{totalCount}</span>
                                <span className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.2em]">Total</span>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-12 gap-6">
                    <div className="flex items-center gap-6 md:gap-10 border-b border-zinc-800/40 relative overflow-x-auto scrollbar-hide no-scrollbar">
                        {['Problem List', 'Statistics', 'Discussion', 'Activity'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "relative pb-4 text-[11px] font-bold uppercase tracking-[0.2em] transition-colors hover:text-zinc-300",
                                    activeTab === tab ? "text-white" : "text-zinc-600"
                                )}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute bottom-0 left-0 w-full h-[2px] bg-amber-500"
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-3 pb-2">
                        <div className="relative group/search flex-1 md:flex-none">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within/search:text-zinc-200 transition-colors" size={15} strokeWidth={2.5} />
                            <Input
                                ref={searchInputRef}
                                placeholder="Search questions..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-11 pr-4 py-2 bg-zinc-900/50 border-zinc-800 text-zinc-200 text-xs font-semibold rounded-xl h-11 w-full md:w-[280px] focus:bg-zinc-900 focus:border-zinc-700 transition-all placeholder:text-zinc-600 focus:ring-0 md:focus:w-[320px]"
                            />
                        </div>
                        <FilterPopover filters={filters} onFilterChange={setFilters} />
                    </div>
                </div>

                {activeTab === 'Statistics' ? (
                    <div className="mb-6">
                        <StatsPanel />
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        <DndContext
                            id="main-sheet-dnd"
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext items={filteredTopics.order} strategy={verticalListSortingStrategy}>
                                {filteredTopics.order.map((id) => (
                                    <SortableItem key={id} id={id}>
                                        {({ attributes, listeners }: SortableChildrenProps) => (
                                            <TopicItem
                                                id={id}
                                                dragHandleProps={{ attributes, listeners }}
                                                searchQuery={searchQuery}
                                                filters={filters}
                                            />
                                        )}
                                    </SortableItem>
                                ))}
                            </SortableContext>
                        </DndContext>
                        {filteredTopics.order.length === 0 && (
                            <div className="text-center py-20 text-zinc-500">
                                <p className="text-sm">No questions match your filters.</p>
                                <Button
                                    variant="link"
                                    onClick={() => { setSearchQuery(''); setFilters({ status: [], difficulty: [], platform: [] }); }}
                                    className="text-amber-500"
                                >
                                    Clear all filters
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                <footer className="mt-20 py-16 border-t border-[#1a1a1b] flex flex-col items-center gap-8">
                    <div className="flex items-center gap-10">
                        <a href="#" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 hover:text-zinc-400 transition-colors">FAQ</a>
                        <a href="#" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 hover:text-zinc-400 transition-colors">Contact</a>
                        <a href="#" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 hover:text-zinc-400 transition-colors">Privacy</a>
                        <a href="#" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 hover:text-zinc-400 transition-colors">Terms</a>
                    </div>
                    <div className="flex items-center gap-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-8 h-8 rounded-lg bg-[#1a1a1b] border border-[#2a2a2b] flex items-center justify-center text-zinc-600 hover:text-zinc-400 cursor-pointer">
                                <Share2 size={14} />
                            </div>
                        ))}
                    </div>
                    <p className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">
                        © 2026 Questio. Built for SDE success.
                    </p>
                </footer>
            </div>
            <QuestionDetailPanel />
        </div >
    );
}
