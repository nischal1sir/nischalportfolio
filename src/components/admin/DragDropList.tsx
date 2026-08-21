import React, { useState } from 'react';
import { GripVertical, ArrowUp, ArrowDown } from 'lucide-react';

interface HasOrderIndex {
  id: string;
  order_index: number;
}

interface DragDropListProps<T extends HasOrderIndex> {
  items: T[];
  onReorder: (newItems: T[]) => void | Promise<void>;
  renderItem: (item: T, index: number, isDragging: boolean) => React.ReactNode;
  keyExtractor?: (item: T) => string;
  className?: string;
  disabled?: boolean;
}

function arrayMove<T extends HasOrderIndex>(arr: T[], fromIndex: number, toIndex: number): T[] {
  if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || fromIndex >= arr.length || toIndex >= arr.length) {
    return arr;
  }
  const next = [...arr];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next.map((item, idx) => ({ ...item, order_index: idx }));
}

export function DragDropList<T extends HasOrderIndex>({
  items,
  onReorder,
  renderItem,
  keyExtractor = (item) => item.id,
  className = 'space-y-4',
  disabled = false,
}: DragDropListProps<T>) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    if (disabled) return;
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    // Transparent / ghost image fallback if needed
    if (e.currentTarget) {
      e.currentTarget.style.opacity = '0.4';
    }
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.style.opacity = '1';
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    if (disabled || draggedIndex === null) return;
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
    e.preventDefault();
    if (disabled || draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const reordered = arrayMove(items, draggedIndex, targetIndex);
    setDraggedIndex(null);
    setDragOverIndex(null);
    await onReorder(reordered);
  };

  const handleMoveUp = async (index: number) => {
    if (disabled || index === 0) return;
    const reordered = arrayMove(items, index, index - 1);
    await onReorder(reordered);
  };

  const handleMoveDown = async (index: number) => {
    if (disabled || index === items.length - 1) return;
    const reordered = arrayMove(items, index, index + 1);
    await onReorder(reordered);
  };

  return (
    <div className={className}>
      {items.map((item, index) => {
        const key = keyExtractor(item);
        const isDragging = draggedIndex === index;
        const isTarget = dragOverIndex === index && draggedIndex !== index;

        return (
          <div
            key={key}
            draggable={!disabled}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            className={`transition-all duration-150 rounded-xl relative flex items-stretch gap-2 ${
              isDragging ? 'opacity-40 scale-[0.99]' : ''
            } ${
              isTarget ? 'border-2 border-dashed border-blue-500 bg-blue-50/50' : ''
            }`}
          >
            {/* Left handle strip with drag grip and up/down controls */}
            <div className="flex flex-col justify-center items-center px-2 py-3 bg-gray-100/80 border border-gray-200 border-r-0 rounded-l-xl select-none group text-gray-400 hover:text-gray-700">
              <div className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-gray-200" title="Drag to reorder">
                <GripVertical className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
              <div className="flex flex-col gap-0.5 mt-1">
                <button
                  type="button"
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0 || disabled}
                  title="Move Up"
                  className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-20 disabled:hover:text-gray-400 transition-colors"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleMoveDown(index)}
                  disabled={index === items.length - 1 || disabled}
                  title="Move Down"
                  className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-20 disabled:hover:text-gray-400 transition-colors"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Main content wrapper */}
            <div className="flex-1 min-w-0">
              {renderItem(item, index, isDragging)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
