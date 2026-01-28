import { useState } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const ConditionalNode = ({ id, data }) => {
    const updateNodeField = useStore((s) => s.updateNodeField);
    const [operator, setOperator] = useState(data?.operator || '==');

    return (
        <BaseNode
            title="Conditional"
            inputs={[
                { id: `${id}-valueA` },
                { id: `${id}-valueB` }
            ]}
            outputs={[
                { id: `${id}-true` },
                { id: `${id}-false` }
            ]}
        >
            <div className="rounded p-2" style={{ backgroundColor: '#4C1D95' }}>
                <label className="block text-xs text-white mb-1">Operator</label>
                <select
                    className="w-full rounded border px-2 py-1 bg-transparent text-white focus:outline-none"
                    value={operator}
                    onChange={(e) => {
                        setOperator(e.target.value);
                        updateNodeField(id, 'operator', e.target.value);
                    }}
                >
                    <option value="==">==</option>
                    <option value="!=">!=</option>
                    <option value=">">{'>'}</option>
                    <option value="<">{'<'}</option>
                    <option value=">=">{'>='}</option>
                    <option value="<=">{'<='}</option>
                </select>
                <p className="text-xs text-gray-300 mt-1">Compare A vs B</p>
            </div>
        </BaseNode>
    );
};
