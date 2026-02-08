import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '../lib/utils';

import { SortableChildrenProps } from '../types/dnd';

interface SortableItemProps {
    id: string;
    children: (props: SortableChildrenProps) => React.ReactNode;
}

export function SortableItem({ id, children }: SortableItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 1,
        touchAction: 'none',
    };

    return (
        <div ref={setNodeRef} style={style} className={cn(isDragging && "premium-glow rounded-lg relative z-50")}>
            {children({ attributes, listeners, isDragging })}
        </div>
    );
}
