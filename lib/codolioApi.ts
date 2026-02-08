import { v4 as uuidv4 } from 'uuid';
import { SheetState, EntityType } from '../types';

const API_BASE_URL = 'https://node.codolio.com/api/question-tracker/v1/sheet/public/get-sheet-by-slug';

export const transformRawData = (data: any): SheetState => {
    const { sheet, questions: rawQuestions } = data;
    const topicOrderFromConfig = sheet.config.topicOrder || [];

    // Initialize State
    const state: SheetState = {
        metadata: {
            title: sheet.name,
            description: sheet.description,
            banner: sheet.banner,
            author: sheet.author,
            followers: sheet.followers
        },
        topics: { byId: {}, order: [] },
        subTopics: { byId: {}, orderByTopicId: {} },
        questions: { byId: {}, orderByParentId: {} },
    };

    // Helper to get or create Topic ID
    const topicMap = new Map<string, string>(); // Name -> UUID

    // 1. Create Topics from Config Order to preserve order
    topicOrderFromConfig.forEach((topicName: string) => {
        if (!topicMap.has(topicName)) {
            const tId = uuidv4();
            topicMap.set(topicName, tId);
            state.topics.byId[tId] = { id: tId, title: topicName };
            state.topics.order.push(tId);
            state.subTopics.orderByTopicId[tId] = [];
            state.questions.orderByParentId[tId] = [];
        }
    });

    // Helper to get or create SubTopic ID
    const subTopicMap = new Map<string, string>(); // "TopicName:SubTopicName" -> UUID

    // 2. Process Questions
    rawQuestions.forEach((q: any) => {
        const topicName = q.topic;
        const subTopicName = q.subTopic;

        // Ensure Topic Exists (if not in config for some reason)
        if (!topicMap.has(topicName)) {
            const tId = uuidv4();
            topicMap.set(topicName, tId);
            state.topics.byId[tId] = { id: tId, title: topicName };
            state.topics.order.push(tId);
            state.subTopics.orderByTopicId[tId] = [];
            state.questions.orderByParentId[tId] = [];
        }
        const topicId = topicMap.get(topicName)!;

        let parentId = topicId;
        let parentType: EntityType = 'topic';

        // Handle SubTopic
        if (subTopicName) {
            const key = `${topicName}:${subTopicName}`;
            if (!subTopicMap.has(key)) {
                const stId = uuidv4();
                subTopicMap.set(key, stId);
                state.subTopics.byId[stId] = { id: stId, title: subTopicName, topicId };
                state.subTopics.orderByTopicId[topicId].push(stId);
                state.questions.orderByParentId[stId] = [];
            }
            parentId = subTopicMap.get(key)!;
            parentType = 'subTopic';
        }

        // Create Question
        const qId = q._id || uuidv4();
        const difficulty = q.questionId?.difficulty?.toLowerCase();

        state.questions.byId[qId] = {
            id: qId,
            title: q.title,
            parentId,
            parentType: parentType as 'topic' | 'subTopic',
            status: q.isSolved ? 'done' : 'todo',
            difficulty: ['easy', 'medium', 'hard'].includes(difficulty) ? difficulty : undefined,
            videoUrl: q.resource,
            link: q.questionId?.problemUrl,
            tags: q.questionId?.topics || [],
            notes: '',
            bookmarked: false,
            platform: q.questionId?.platform,
            platformId: q.questionId?.id,
            verified: q.questionId?.verified,
            slug: q.questionId?.slug,
            description: q.questionId?.description,
            companyTags: q.questionId?.companyTags || [],
            similarQuestions: q.questionId?.similarQuestions || [],
            session: q.session,
            isPublic: q.isPublic,
            hotness: q.hotness,
            rank: q.rank,
            popularSheets: q.popularSheets || []
        };

        state.questions.orderByParentId[parentId].push(qId);
    });

    return state;
};

export const fetchAndTransformSheet = async (slug: string): Promise<SheetState> => {
    const response = await fetch(`${API_BASE_URL}/${slug}`);
    const json = await response.json();

    if (!json.success || !json.data) {
        throw new Error('Failed to fetch sheet data');
    }

    return transformRawData(json.data);
};
