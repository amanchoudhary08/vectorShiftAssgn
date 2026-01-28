import { useState } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const InputNode = ({ id, data }) => {
    const updateNodeField = useStore((s) => s.updateNodeField);

    const [name, setName] = useState(data?.inputName || 'input');
    const [type, setType] = useState(data?.inputType || 'Text');

    return (
        <BaseNode
            title="Input"
            outputs={[{ id: `${id}-value` }]}
        >
            <div className="rounded p-2" style={{ backgroundColor: '#4C1D95' }}>
                <label className="block text-xs text-white mb-1">Name</label>
                <input
                    className="w-full rounded border px-2 py-1 bg-transparent text-white focus:outline-none"
                    value={name}
                    onChange={(e) => {
                        const newValue = e.target.value;
                        setName(() => newValue);
                        updateNodeField(id, 'inputName', newValue);
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
                        updateNodeField(id, 'inputType', e.target.value);
                    }}
                >
                    <option value="Text">Text</option>
                    <option value="File">File</option>
                </select>
            </div>
        </BaseNode>
    );
};
