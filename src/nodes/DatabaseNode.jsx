import { useState } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const DatabaseNode = ({ id, data }) => {
    const updateNodeField = useStore((s) => s.updateNodeField);
    const [operation, setOperation] = useState(data?.operation || 'SELECT');
    const [table, setTable] = useState(data?.table || '');

    return (
        <BaseNode
            title="Database"
            inputs={[
                { id: `${id}-query` },
                { id: `${id}-params` }
            ]}
            outputs={[{ id: `${id}-result` }]}
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
                    <option>SELECT</option>
                    <option>INSERT</option>
                    <option>UPDATE</option>
                    <option>DELETE</option>
                </select>
            </div>
            <div className="rounded p-2" style={{ backgroundColor: '#4C1D95' }}>
                <label className="block text-xs text-white mb-1">Table</label>
                <input
                    className="w-full rounded border px-2 py-1 bg-transparent text-white placeholder-gray-300 focus:outline-none"
                    placeholder="table_name"
                    value={table}
                    onChange={(e) => {
                        setTable(e.target.value);
                        updateNodeField(id, 'table', e.target.value);
                    }}
                />
            </div>
        </BaseNode>
    );
};
