import { useState, useMemo } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const OutputNode = ({ id, data }) => {
    const updateNodeField = useStore((s) => s.updateNodeField);

    const [name, setName] = useState(data?.outputName || 'output');
    const [type, setType] = useState(data?.outputType || 'Text');

    // Memoize the inputs array to avoid unnecessary re-renders
    const inputs = useMemo(() => [{ id: `${id}-value` }], [id]);

    return (
        <BaseNode
            title="Output"
            inputs={inputs}
        >
            <div className="rounded p-2" style={{ backgroundColor: '#4C1D95' }}>
                <label className="block text-xs text-white mb-1">Name</label>
                <input
                    className="w-full rounded border px-2 py-1 bg-transparent text-white focus:outline-none"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                        updateNodeField(id, 'outputName', e.target.value);
                    }}
                />
            </div>

            <div className="rounded p-2" style={{ backgroundColor: '#4C1D95' }}>
                <label className="block text-xs text-white mb-1">Type</label>
                <select
                    className="w-full rounded border px-2 py-1 bg-transparent text-white focus:outline-none"
                    value={type}
                    onChange={(e) => {
                        setType(e.target.value);
                        updateNodeField(id, 'outputType', e.target.value);
                    }}
                >
                    <option>Text</option>
                    <option>Image</option>
                </select>
            </div>
        </BaseNode>
    );
};
