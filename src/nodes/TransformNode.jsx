import { useState } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const TransformNode = ({ id, data }) => {
    const updateNodeField = useStore((s) => s.updateNodeField);
    const [operation, setOperation] = useState(data?.operation || 'uppercase');

    return (
        <BaseNode
            title="Transform"
            inputs={[{ id: `${id}-input` }]}
            outputs={[{ id: `${id}-output` }]}
        >
            <div className="rounded p-2" style={{ backgroundColor: '#4C1D95' }}>
                <label className="block text-xs text-white mb-1">Operation</label>
                <select
                    className="w-full rounded border px-2 py-1 bg-transparent text-white focus:outline-none"
                    value={operation}
                    onChange={(e) => {
                        setOperation(e.target.value);
                        updateNodeField(id, 'operation', e.target.value);
                    }}
                >
                    <option>uppercase</option>
                    <option>lowercase</option>
                    <option>trim</option>
                    <option>reverse</option>
                </select>
            </div>
        </BaseNode>
    );
};
