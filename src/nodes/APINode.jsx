import { useState } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const APINode = ({ id, data }) => {
    const updateNodeField = useStore((s) => s.updateNodeField);
    const safeMethod = (data && typeof data.method === 'string') ? data.method : 'GET';
    const safeEndpoint = (data && typeof data.endpoint === 'string') ? data.endpoint : '';
    const [method, setMethod] = useState(safeMethod);
    const [endpoint, setEndpoint] = useState(safeEndpoint);

    return (
        <BaseNode
            title="API"
            inputs={[
                { id: `${id}-input` }
            ]}
            outputs={[
                { id: `${id}-output` }
            ]}
            width="w-64"
        >
            <div className="rounded p-2" style={{ backgroundColor: '#4C1D95' }}>
                <label className="block text-xs text-white mb-1">Method</label>
                <select
                    className="w-full rounded border px-2 py-1 bg-transparent text-white focus:outline-none"
                    value={method}
                    onChange={(e) => {
                        setMethod(e.target.value);
                        updateNodeField(id, 'method', e.target.value);
                    }}
                >
                    <option value="" disabled>
                        Select method
                    </option>
                    <option>GET</option>
                    <option>POST</option>
                    <option>PUT</option>
                    <option>DELETE</option>
                    {!['GET', 'POST', 'PUT', 'DELETE'].includes(method) && (
                        <option value={method}>{method}</option>
                    )}
                </select>
            </div>
            <div className="rounded p-2" style={{ backgroundColor: '#4C1D95' }}>
                <label className="block text-xs text-white mb-1">Endpoint</label>
                <input
                    className="w-full rounded border px-2 py-1 text-xs bg-transparent text-white placeholder-gray-300 focus:outline-none"
                    placeholder="/api/endpoint"
                    value={endpoint}
                    onChange={(e) => {
                        setEndpoint(e.target.value);
                        updateNodeField(id, 'endpoint', e.target.value);
                    }}
                />
            </div>
        </BaseNode>
    );
};
