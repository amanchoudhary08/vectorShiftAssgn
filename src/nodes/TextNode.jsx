import { useEffect, useMemo, useRef, useState } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';
import { useUpdateNodeInternals } from 'reactflow';

export const TextNode = ({ id, data }) => {
    const updateNodeField = useStore((s) => s.updateNodeField);
    const [text, setText] = useState(data?.text || '');
    const textareaRef = useRef(null);
    const updateNodeInternals = useUpdateNodeInternals();

    const variables = useMemo(() => {
        const vars = new Set();
        const regex = /{{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*}}/g;
        for (const match of text.matchAll(regex)) {
            vars.add(match[1]);
        }
        return Array.from(vars);
    }, [text]);


    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [text]);

    const handleTextChange = (e) => {
        const newText = e.target.value;
        setText(newText);
        updateNodeField(id, 'text', newText);
    };

    useEffect(() => {
        updateNodeField(id, 'variables', variables);
        updateNodeInternals(id);
    }, [variables, id, updateNodeField, updateNodeInternals]);


    const inputs = useMemo(
        () => variables.map((v, index) => ({ id: v, key: `input-${index}` })),
        [variables]
    );
    const outputs = useMemo(
        () => [{ id: `${id}-output` }],
        [id]
    );

    return (
        <BaseNode
            title="Text"
            inputs={inputs}
            outputs={outputs}
            width="w-64"

        >
            <textarea
                ref={textareaRef}
                className="nodrag w-full resize-none rounded border px-2 py-1 text-sm bg-black/30 text-white placeholder-gray-500"
                style={{
                    borderColor: 'var(--vs-border)',
                    overflow: 'hidden'
                }}
                placeholder="Type text with {{variables}}"
                value={text}
                onChange={handleTextChange}
            />
        </BaseNode>
    );
};
