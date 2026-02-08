import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { SheetState, Question, EntityType } from '../types';

interface SheetActions {
    // Topic Actions
    addTopic: (title: string) => string;
    editTopic: (id: string, title: string) => void;
    reorderTopics: (startIndex: number, endIndex: number) => void;

    // SubTopic Actions
    addSubTopic: (topicId: string, title: string) => string;
    editSubTopic: (id: string, title: string) => void;
    moveSubTopic: (id: string, fromTopicId: string, toTopicId: string, index: number) => void;

    // Question Actions
    addQuestion: (locationId: string, locationType: 'topic' | 'subTopic', title: string) => string;
    editQuestion: (id: string, updates: Partial<Question>) => void;
    moveQuestion: (id: string, fromParentId: string, toParentId: string, index: number, toParentType: 'topic' | 'subTopic') => void;

    // Deletion
    deleteTopic: (id: string) => void;
    deleteSubTopic: (id: string) => void;
    deleteQuestion: (id: string) => void;

    // Generic Reorder
    reorderEntity: (type: EntityType, parentId: string | null, startIndex: number, endIndex: number) => void;

    // Data Actions
    clearData: () => void;
    seedStore: () => void;
    initializeFromLocal: () => void;

    // UI State
    activeQuestionId: string | null;
    setActiveQuestion: (id: string | null) => void;
    renamingId: string | null;
    setRenamingId: (id: string | null) => void;
    isMobileNavOpen: boolean;
    setMobileNavOpen: (open: boolean) => void;

    // Import
    importData: (data: SheetState) => void;
}

export const useStore = create<SheetState & SheetActions>()(
    persist(
        (set, get) => ({
            topics: { byId: {}, order: [] },
            subTopics: { byId: {}, orderByTopicId: {} },
            questions: { byId: {}, orderByParentId: {} },
            activeQuestionId: null,
            renamingId: null,
            isMobileNavOpen: false,

            addTopic: (title) => {
                const id = uuidv4();
                set((state) => ({
                    topics: {
                        byId: { ...state.topics.byId, [id]: { id, title } },
                        order: [...state.topics.order, id],
                    },
                    renamingId: id
                }));
                return id;
            },

            editTopic: (id, title) => set((state) => ({
                topics: {
                    ...state.topics,
                    byId: { ...state.topics.byId, [id]: { ...state.topics.byId[id], title } }
                }
            })),

            deleteTopic: (id) => set((state) => {
                const remainingTopicsById = { ...state.topics.byId };
                delete remainingTopicsById[id];

                // Cascade delete Sub-topics
                const subTopicIdsToRemove = state.subTopics.orderByTopicId[id] || [];
                const remainingSubTopicsById = { ...state.subTopics.byId };
                const remainingSubTopicsOrder = { ...state.subTopics.orderByTopicId };
                delete remainingSubTopicsOrder[id];

                subTopicIdsToRemove.forEach(stId => {
                    delete remainingSubTopicsById[stId];
                });

                // Cascade delete Questions (both direct and sub-topic ones)
                const remainingQuestionsById = { ...state.questions.byId };
                const remainingQuestionsOrder = { ...state.questions.orderByParentId };

                // Remove direct questions
                const directQIds = state.questions.orderByParentId[id] || [];
                delete remainingQuestionsOrder[id];
                directQIds.forEach(qId => delete remainingQuestionsById[qId]);

                // Remove sub-topic questions
                subTopicIdsToRemove.forEach(stId => {
                    const stQIds = state.questions.orderByParentId[stId] || [];
                    delete remainingQuestionsOrder[stId];
                    stQIds.forEach(qId => delete remainingQuestionsById[qId]);
                });

                return {
                    topics: {
                        byId: remainingTopicsById,
                        order: state.topics.order.filter(tId => tId !== id)
                    },
                    subTopics: {
                        byId: remainingSubTopicsById,
                        orderByTopicId: remainingSubTopicsOrder
                    },
                    questions: {
                        byId: remainingQuestionsById,
                        orderByParentId: remainingQuestionsOrder
                    }
                };
            }),

            reorderTopics: (startIndex, endIndex) => set((state) => {
                const newOrder = Array.from(state.topics.order);
                const [removed] = newOrder.splice(startIndex, 1);
                newOrder.splice(endIndex, 0, removed);
                return { topics: { ...state.topics, order: newOrder } };
            }),

            addSubTopic: (topicId, title) => {
                const id = uuidv4();
                set((state) => {
                    const currentOrder = state.subTopics.orderByTopicId[topicId] || [];
                    return {
                        subTopics: {
                            byId: { ...state.subTopics.byId, [id]: { id, title, topicId } },
                            orderByTopicId: {
                                ...state.subTopics.orderByTopicId,
                                [topicId]: [...currentOrder, id]
                            }
                        },
                        renamingId: id
                    };
                });
                return id;
            },

            editSubTopic: (id, title) => set((state) => ({
                subTopics: {
                    ...state.subTopics,
                    byId: { ...state.subTopics.byId, [id]: { ...state.subTopics.byId[id], title } }
                }
            })),

            deleteSubTopic: (id) => set((state) => {
                const subTopic = state.subTopics.byId[id];
                if (!subTopic) return state;

                const remainingSubTopicsById = { ...state.subTopics.byId };
                delete remainingSubTopicsById[id];
                const topicId = subTopic.topicId;

                // Remove from topic's order
                const newTopicOrder = (state.subTopics.orderByTopicId[topicId] || []).filter(stId => stId !== id);

                // Cascade delete questions
                const questionIdsToRemove = state.questions.orderByParentId[id] || [];
                const remainingQuestionsById = { ...state.questions.byId };
                const remainingQuestionsOrder = { ...state.questions.orderByParentId };
                delete remainingQuestionsOrder[id];
                questionIdsToRemove.forEach(qId => delete remainingQuestionsById[qId]);

                return {
                    subTopics: {
                        byId: remainingSubTopicsById,
                        orderByTopicId: {
                            ...state.subTopics.orderByTopicId,
                            [topicId]: newTopicOrder
                        }
                    },
                    questions: {
                        byId: remainingQuestionsById,
                        orderByParentId: remainingQuestionsOrder
                    }
                };
            }),

            moveSubTopic: (id, fromTopicId, toTopicId, index) => set((state) => {
                const fromOrder = (state.subTopics.orderByTopicId[fromTopicId] || []).filter(stId => stId !== id);
                const toOrder = Array.from(state.subTopics.orderByTopicId[toTopicId] || []);
                toOrder.splice(index, 0, id);

                return {
                    subTopics: {
                        byId: {
                            ...state.subTopics.byId,
                            [id]: { ...state.subTopics.byId[id], topicId: toTopicId }
                        },
                        orderByTopicId: {
                            ...state.subTopics.orderByTopicId,
                            [fromTopicId]: fromOrder,
                            [toTopicId]: toOrder
                        }
                    }
                };
            }),

            addQuestion: (parentId, parentType, title) => {
                const id = uuidv4();
                set((state) => {
                    const currentOrder = state.questions.orderByParentId[parentId] || [];
                    return {
                        questions: {
                            byId: { ...state.questions.byId, [id]: { id, title, parentId, parentType, status: 'todo' } },
                            orderByParentId: {
                                ...state.questions.orderByParentId,
                                [parentId]: [...currentOrder, id]
                            }
                        },
                        activeQuestionId: id
                    };
                });
                return id;
            },

            editQuestion: (id, updates) => set((state) => ({
                questions: {
                    ...state.questions,
                    byId: { ...state.questions.byId, [id]: { ...state.questions.byId[id], ...updates } }
                }
            })),


            deleteQuestion: (id) => set((state) => {
                const question = state.questions.byId[id];
                if (!question) return state;

                const remainingQBId = { ...state.questions.byId };
                delete remainingQBId[id];
                const parentId = question.parentId;

                return {
                    questions: {
                        byId: remainingQBId,
                        orderByParentId: {
                            ...state.questions.orderByParentId,
                            [parentId]: (state.questions.orderByParentId[parentId] || []).filter(qId => qId !== id)
                        }
                    }
                };
            }),

            reorderEntity: (type: EntityType, parentId: string | null, startIndex: number, endIndex: number) => set((state) => {
                if (type === 'topic') {
                    const newOrder = Array.from(state.topics.order);
                    const [removed] = newOrder.splice(startIndex, 1);
                    newOrder.splice(endIndex, 0, removed);
                    return { topics: { ...state.topics, order: newOrder } };
                }

                if (type === 'subTopic' && parentId) {
                    const newOrder = Array.from(state.subTopics.orderByTopicId[parentId] || []);
                    const [removed] = newOrder.splice(startIndex, 1);
                    newOrder.splice(endIndex, 0, removed);
                    return {
                        subTopics: {
                            ...state.subTopics,
                            orderByTopicId: { ...state.subTopics.orderByTopicId, [parentId]: newOrder }
                        }
                    };
                }

                if (type === 'question' && parentId) {
                    const newOrder = Array.from(state.questions.orderByParentId[parentId] || []);
                    const [removed] = newOrder.splice(startIndex, 1);
                    newOrder.splice(endIndex, 0, removed);
                    return {
                        questions: {
                            ...state.questions,
                            orderByParentId: { ...state.questions.orderByParentId, [parentId]: newOrder }
                        }
                    };
                }

                return state;
            }),

            moveQuestion: (id, fromParentId, toParentId, index, toParentType) => set((state) => {
                const fromOrder = Array.from(state.questions.orderByParentId[fromParentId] || []);
                const toOrder = Array.from(state.questions.orderByParentId[toParentId] || []);

                const question = state.questions.byId[id];
                if (!question) return state;

                const newFromOrder = fromOrder.filter(qId => qId !== id);
                const newToOrder = [...toOrder.filter(qId => qId !== id)]; // Remove if already in toOrder (safety)
                newToOrder.splice(index, 0, id);

                return {
                    questions: {
                        byId: {
                            ...state.questions.byId,
                            [id]: { ...question, parentId: toParentId, parentType: toParentType }
                        },
                        orderByParentId: {
                            ...state.questions.orderByParentId,
                            [fromParentId]: newFromOrder,
                            [toParentId]: newToOrder
                        }
                    }
                };
            }),

            // Seed Data Action
            clearData: () => set(() => ({
                topics: { byId: {}, order: [] },
                subTopics: { byId: {}, orderByTopicId: {} },
                questions: { byId: {}, orderByParentId: {} },
                activeQuestionId: null,
            })),

            setActiveQuestion: (id) => set(() => ({ activeQuestionId: id })),

            setRenamingId: (id) => set(() => ({ renamingId: id })),
            setMobileNavOpen: (open) => set(() => ({ isMobileNavOpen: open })),

            seedStore: () => {
                get().initializeFromLocal();
            },

            initializeFromLocal: async () => {
                const { transformRawData } = await import('../lib/codolioApi');
                const rawData = await import('../codolio_data.json');

                if (rawData && rawData.data) {
                    const transformed = transformRawData(rawData.data);
                    set(() => ({
                        metadata: transformed.metadata,
                        topics: transformed.topics,
                        subTopics: transformed.subTopics,
                        questions: transformed.questions,
                        activeQuestionId: null
                    }));
                }
            },

            importData: (data) => set(() => ({
                metadata: data.metadata,
                topics: data.topics,
                subTopics: data.subTopics,
                questions: data.questions,
                activeQuestionId: null
            })),
        }),
        {
            name: 'question-sheet-storage',
        }
    )
);
