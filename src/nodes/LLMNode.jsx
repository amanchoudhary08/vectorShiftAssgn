import { BaseNode } from './BaseNode';

export const LLMNode = ({ id }) => {
    return (
        <BaseNode
            title="LLM"
            inputs={[
                { id: `${id}-system` },
                { id: `${id}-prompt` },
            ]}
            outputs={[{ id: `${id}-response` }]}
        >
            <div className="rounded p-2 bg-[#4C1D95]">
                <p className="text-white">Large Language Model</p>
            </div>
        </BaseNode>
    );
};
