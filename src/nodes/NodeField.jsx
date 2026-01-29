// nodes/NodeField.jsx
export const NodeField = ({ label, children }) => (
    <div className="rounded p-2 bg-purple-800">
        <label className="block text-xs text-white mb-1">{label}</label>
        {children}
    </div>
);
