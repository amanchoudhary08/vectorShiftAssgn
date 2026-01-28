import { useState } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const FilterNode = ({ id, data }) => {
    const updateNodeField = useStore((s) => s.updateNodeField);
    const safeData = data || {};
    const [condition, setCondition] = useState(safeData.condition || 'contains');
    const [value, setValue] = useState(safeData.value || '');

    return (
        <BaseNode
            title="Filter"
            inputs={[{ id: `${id}-input` }]}
            outputs={[
                { id: `${id}-pass` },
                { id: `${id}-fail` }
            ]}
        >
            <div className="rounded p-2" style={{ backgroundColor: '#4C1D95' }}>
                <label className="block text-xs text-white mb-1">Condition</label>
                <select
                    className="w-full rounded border px-2 py-1 bg-transparent text-white focus:outline-none"
                    value={condition}
                    onChange={(e) => {
                        setCondition(e.target.value);
                        updateNodeField(id, 'condition', e.target.value);
                    }}
                >
                    <option>contains</option>
                    <option>equals</option>
                    <option>startsWith</option>
                    <option>endsWith</option>
                </select>
            </div>
            <div className="rounded p-2" style={{ backgroundColor: '#4C1D95' }}>
                <label className="block text-xs text-white mb-1">Value</label>
                <input
                    className="w-full rounded border px-2 py-1 bg-transparent text-white focus:outline-none"
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value);
                        updateNodeField(id, 'value', e.target.value);
                    }}
                />
            </div>
        </BaseNode>
    );
};
