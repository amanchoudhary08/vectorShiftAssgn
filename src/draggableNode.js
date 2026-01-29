// draggableNode.js

const nodeIcons = {
  customInput: '📥',
  llm: '🤖',
  customOutput: '📤',
  text: '📝',
  transform: '🔄',
  filter: '🔍',
  api: '🌐',
  database: '💾',
  conditional: '🔀',
};

export const DraggableNode = ({ type, label }) => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData(
      'application/reactflow',
      JSON.stringify({ nodeType })
    );
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      onDragStart={(e) => onDragStart(e, type)}
      draggable
      className="flex items-center gap-2 px-4 py-2.5 min-w-[120px] cursor-grab active:cursor-grabbing rounded-lg text-white text-sm font-semibold shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-200 border bg-[var(--vs-card-bg)] border-[var(--vs-border)]"
    >
      <span className="text-xl">{nodeIcons[type] || '⚙️'}</span>
      <span>{label}</span>
    </div>
  );
};
