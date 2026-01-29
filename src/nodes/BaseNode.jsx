// BaseNode.jsx
// --------------------------------------------------

import { forwardRef } from 'react';
import { Handle, Position } from 'reactflow';

export const BaseNode = forwardRef(
    ({ title, children, inputs = [], outputs = [], width = 'w-56' }, ref) => {
        const handleStyle = {
            transform: 'translateY(-50%)',
            background: 'var(--vs-gradient)',
            width: '10px',
            height: '10px',
            border: '2px solid var(--vs-card-bg)',
            cursor: 'crosshair',
            zIndex: 10,
        };

        const renderHandles = (handles = [], type, position) =>
            handles.map((handle, index) => (
                <Handle
                    key={handle.id}
                    id={handle.id}
                    type={type}
                    position={position}
                    isConnectable
                    style={{
                        ...handleStyle,
                        top: `${((index + 1) * 100) / (handles.length + 1)}%`,
                    }}
                />
            ));

        return (
            <div
                ref={ref}
                className={`${width} relative rounded-xl border shadow-lg transition-shadow duration-200 hover:shadow-2xl bg-[#2A0E4F] border-[#4C1D95]`}
            >
                {/* Header */}
                <div className="drag-handle rounded-t-xl px-4 py-2.5 text-sm font-bold text-white bg-[#4C1D95]">
                    {title}
                </div>

                {/* Body */}
                <div className="space-y-3 p-4 text-sm text-white">{children}</div>

                {/* Handles */}
                {renderHandles(inputs, 'target', Position.Left)}
                {renderHandles(outputs, 'source', Position.Right)}
            </div>
        );
    }
);

BaseNode.displayName = 'BaseNode';
