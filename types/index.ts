export type EntityType = 'topic' | 'subTopic' | 'question';

export interface Topic {
  id: string;
  title: string;
}

export interface SubTopic {
  id: string;
  title: string;
  topicId: string;
}

export interface Question {
  id: string;
  title: string;
  parentId: string; // Topic or SubTopic ID
  parentType: 'topic' | 'subTopic';
  status: 'todo' | 'done';
  difficulty?: 'easy' | 'medium' | 'hard';
  videoUrl?: string;
  link?: string;
  tags?: string[];
  notes?: string;
  bookmarked?: boolean;
  platform?: string;
  slug?: string;
  description?: string;
  companyTags?: string[];
  similarQuestions?: string[];
  verified?: boolean;
  platformId?: string;
  session?: string;
  isPublic?: boolean;
  hotness?: number;
  rank?: number;
  popularSheets?: string[];
  customTags?: string[];
  customSheets?: string[];
}

export interface SheetMetadata {
  title: string;
  description?: string;
  banner?: string;
  author?: string;
  followers?: number;
}

export interface SheetState {
  metadata?: SheetMetadata;
  topics: {
    byId: Record<string, Topic>;
    order: string[];
  };
  subTopics: {
    byId: Record<string, SubTopic>;
    orderByTopicId: Record<string, string[]>;
  };
  questions: {
    byId: Record<string, Question>;
    orderByParentId: Record<string, string[]>;
  };
}
