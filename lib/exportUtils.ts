import { SheetState } from '../types';

export const exportToJSON = (state: SheetState, filename: string = 'question-sheet-export.json') => {
    const dataStr = JSON.stringify(state, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
};

export const exportToCSV = (state: SheetState, filename: string = 'question-sheet-export.csv') => {
    const { topics, subTopics, questions } = state;

    // CSV Headers
    const headers = [
        'Title',
        'Status',
        'Difficulty',
        'Platform',
        'Topic',
        'SubTopic',
        'Question Link',
        'Video URL',
        'Tags',
        'Custom Tags',
        'Custom Sheets'
    ];

    // Build rows
    const rows: string[][] = [headers];

    Object.values(questions.byId).forEach(q => {
        const parentTopic = q.parentType === 'topic'
            ? topics.byId[q.parentId]?.title || ''
            : topics.byId[subTopics.byId[q.parentId]?.topicId]?.title || '';

        const parentSubTopic = q.parentType === 'subTopic'
            ? subTopics.byId[q.parentId]?.title || ''
            : '';

        rows.push([
            q.title || '',
            q.status || 'todo',
            q.difficulty || '',
            q.platform || '',
            parentTopic,
            parentSubTopic,
            q.link || '',
            q.videoUrl || '',
            (q.tags || []).join('; '),
            (q.customTags || []).join('; '),
            (q.customSheets || []).join('; ')
        ]);
    });

    // Convert to CSV string
    const csvContent = rows.map(row =>
        row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')
    ).join('\n');

    // Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
};
