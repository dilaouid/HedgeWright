import React, { useState, useEffect, useRef } from 'react';

interface SplitPaneProps {
  left: React.ReactNode;
  right: React.ReactNode;
  initialSplit?: number; // Percentage for initial split (0-100)
  minLeft?: number; // Minimum width for left pane in pixels
  minRight?: number; // Minimum width for right pane in pixels
  vertical?: boolean; // If true, split is vertical (top/bottom) instead of horizontal
}

/**
 * Split pane component
 * Creates resizable split panels for editor layouts
 */
export function SplitPane({
  left,
  right,
  initialSplit = 50,
  minLeft = 200,
  minRight = 200,
  vertical = false,
}: SplitPaneProps) {
  const [split, setSplit] = useState(initialSplit);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingRef.current = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDraggingRef.current || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    let newSplit;

    if (vertical) {
      const offsetY = e.clientY - rect.top;
      newSplit = (offsetY / rect.height) * 100;
    } else {
      const offsetX = e.clientX - rect.left;
      newSplit = (offsetX / rect.width) * 100;
    }

    // Apply constraints
    const totalSize = vertical ? rect.height : rect.width;
    const leftSize = (newSplit / 100) * totalSize;
    const rightSize = totalSize - leftSize;

    if (leftSize < minLeft) {
      newSplit = (minLeft / totalSize) * 100;
    } else if (rightSize < minRight) {
      newSplit = 100 - (minRight / totalSize) * 100;
    }

    setSplit(newSplit);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`flex ${vertical ? 'flex-col' : 'flex-row'} h-full overflow-hidden`}
    >
      <div
        className="overflow-auto"
        style={{
          [vertical ? 'height' : 'width']: `${split}%`,
        }}
      >
        {left}
      </div>

      <div
        className={`flex-shrink-0 bg-border ${
          vertical ? 'h-1 cursor-row-resize' : 'w-1 cursor-col-resize'
        }`}
        onMouseDown={handleMouseDown}
      />

      <div
        className="overflow-auto"
        style={{
          [vertical ? 'height' : 'width']: `${100 - split}%`,
        }}
      >
        {right}
      </div>
    </div>
  );
}
