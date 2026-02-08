import { DraggableAttributes } from '@dnd-kit/core';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';

export interface SortableHandleProps {
    attributes: DraggableAttributes;
    listeners: SyntheticListenerMap | undefined;
}

export interface SortableChildrenProps extends SortableHandleProps {
    isDragging: boolean;
}
