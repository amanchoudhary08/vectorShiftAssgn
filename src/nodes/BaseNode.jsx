import { Handle, Position } from 'reactflow';

export const BaseNode = ({
    title,
    children,
    inputs = [],
    outputs = [],
    width = 'w-56',
}) => {
    return (
        <div
            className={`${width} relative rounded-xl border shadow-lg transition-shadow duration-200 hover:shadow-2xl`}
            style={{
                backgroundColor: '#2A0E4F',
                borderColor: '#4C1D95',
            }}
        >
            {/* ================= HEADER ================= */}
            <div
                className="drag-handle rounded-t-xl px-4 py-2.5 text-sm font-bold text-white"
                style={{ backgroundColor: '#4C1D95' }}
            >
                {title}
            </div>

            {/* ================= BODY ================= */}
            <div className="space-y-3 p-4 text-sm text-white">
                {children}
            </div>

            {/* ================= INPUT HANDLES ================= */}
            {inputs.map((input, index) => (
                <Handle
                    key={input.id}
                    id={input.id}
                    type="target"
                    position={Position.Left}
                    isConnectable={true}
                    style={{
                        top: `${((index + 1) * 100) / (inputs.length + 1)}%`,
                        transform: 'translateY(-50%)',
                        background: 'var(--vs-gradient)',
                        width: '10px',
                        height: '10px',
                        border: '2px solid var(--vs-card-bg)',
                        cursor: 'crosshair',
                        zIndex: 10,
                    }}
                />
            ))}

            {/* ================= OUTPUT HANDLES ================= */}
            {outputs.map((output, index) => (
                <Handle
                    key={output.id}
                    id={output.id}
                    type="source"
                    position={Position.Right}
                    isConnectable={true}
                    style={{
                        top: `${((index + 1) * 100) / (outputs.length + 1)}%`,
                        transform: 'translateY(-50%)',
                        background: 'var(--vs-gradient)',
                        width: '10px',
                        height: '10px',
                        border: '2px solid var(--vs-card-bg)',
                        cursor: 'crosshair',
                        zIndex: 10,
                    }}
                />
            ))}

        </div>
    );
};
