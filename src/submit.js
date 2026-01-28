import { useState } from 'react';
import { useStore } from './store';
import { validatePipeline } from './utils/pipelineValidation';

export const SubmitButton = () => {
    const nodes = useStore((s) => s.nodes);
    const edges = useStore((s) => s.edges);
    const [loading, setLoading] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handleSubmit = async () => {
        const validation = validatePipeline(nodes, edges);
        if (!validation.hasInputs || !validation.hasOutputs) {
            alert('⚠️ Pipeline must have at least one Input and one Output node');
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            // Retrieve CSRF token from cookie or meta tag as per your backend implementation
            const getCSRFToken = () => {
                const match = document.cookie.match(new RegExp('(^| )csrftoken=([^;]+)'));
                if (match) return match[2];
                return '';
            };

            const response = await fetch('http://127.0.0.1:8000/pipelines/parse', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCSRFToken(),
                },
                credentials: 'include',
                body: JSON.stringify({
                    nodes: nodes.map((n) => ({ id: n.id })),
                    edges: edges.map((e) => ({
                        source: e.source,
                        target: e.target,
                    })),
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            alert(
                `✨ Pipeline Analysis Results ✨\n\n` +
                `📊 Total Nodes: ${data.num_nodes}\n` +
                `🔗 Total Edges: ${data.num_edges}\n` +
                `${data.is_dag ? '✅ Valid DAG: Yes' : '❌ Valid DAG: No (Contains Cycles)'}`
            );
        } catch (err) {
            alert(
                `❌ Failed to Submit Pipeline\n\n` +
                `Error: ${err.message}\n\n` +
                `Please ensure the backend is running on http://127.0.0.1:8000`
            );
            console.error('Submission error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-slate-900/70 backdrop-blur-md border border-slate-800 p-6 flex justify-center sticky z-10 w-full top-0">
            <button
                onClick={handleSubmit}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                disabled={loading}
                className="rounded-full px-8 py-3 font-semibold text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all duration-300"
                style={{
                    background: loading
                        ? '#4B5563'
                        : isHovered
                            ? 'linear-gradient(135deg, #4C1D95 0%, #4338CA 50%, #1E40AF 100%)'
                            : 'linear-gradient(135deg, #5B21B6, #4F46E5, #2563EB)',
                }}
            >
                {loading ? (
                    <>
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analyzing Pipeline...
                    </>
                ) : (
                    'Submit Pipeline'
                )}
            </button>
        </div>
    );
};
