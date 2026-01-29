// TextNode.jsx
// --------------------------------------------------

import { useEffect, useMemo, useRef } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';
import { useUpdateNodeInternals } from 'reactflow';

export const TextNode = ({ id, data }) => {
    const updateNodeField = useStore((s) => s.updateNodeField);
    const updateNodeInternals = useUpdateNodeInternals();

    const baseRef = useRef(null);
    const textareaRef = useRef(null);
    const prevVarsRef = useRef([]);

    // Zustand is the source of truth
    const text = data?.text ?? '';

    // Parse variables (stable + sorted)
    const variables = useMemo(() => {
        const vars = new Set();
        const regex = /{{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*}}/g;

        for (const match of text.matchAll(regex)) {
            vars.add(match[1]);
        }

        return Array.from(vars).sort();
    }, [text]);

    // Auto-resize textarea
    useEffect(() => {
        if (!textareaRef.current) return;
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }, [text]);

    // Update handles only when variables change
    useEffect(() => {
        const prev = prevVarsRef.current.join(',');
        const next = variables.join(',');

        if (prev !== next) {
            updateNodeField(id, 'variables', variables);
            updateNodeInternals(id);
            prevVarsRef.current = variables;
        }
    }, [variables, id, updateNodeField, updateNodeInternals]);

    // Observe BaseNode size changes
    useEffect(() => {
        if (!baseRef.current) return;

        const observer = new ResizeObserver(() => {
            updateNodeInternals(id);
        });

        observer.observe(baseRef.current);
        return () => observer.disconnect();
    }, [id, updateNodeInternals]);

    // Stable handle IDs
    const inputs = useMemo(
        () => variables.map((v) => ({ id: `${id}-${v}` })),
        [variables, id]
    );

    return (
        <BaseNode
            ref={baseRef}
            title="Text"
            inputs={inputs}
            outputs={[{ id: `${id}-output` }]}
            width="w-64"
        >
            <textarea
                ref={textareaRef}
                className="nodrag w-full resize-none rounded border border-[var(--vs-border)] px-2 py-1 text-sm bg-black/30 text-white placeholder-gray-500 overflow-hidden"
                placeholder="Type text with {{variables}}"
                value={text}
                onChange={(e) =>
                    updateNodeField(id, 'text', e.target.value)
                }
            />
        </BaseNode>
    );
};
