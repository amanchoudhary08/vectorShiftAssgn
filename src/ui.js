// ui.js
// Displays the drag-and-drop UI
// --------------------------------------------------

import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { useStore } from './store';

import { InputNode } from './nodes/InputNode';
import { LLMNode } from './nodes/LLMNode';
import { OutputNode } from './nodes/OutputNode';
import { TextNode } from './nodes/TextNode';
import { TransformNode } from './nodes/TransformNode';
import { FilterNode } from './nodes/FilterNode';
import { APINode } from './nodes/APINode';
import { DatabaseNode } from './nodes/DatabaseNode';
import { ConditionalNode } from './nodes/ConditionalNode';

import 'reactflow/dist/style.css';

const gridSize = 20;

const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  transform: TransformNode,
  filter: FilterNode,
  api: APINode,
  database: DatabaseNode,
  conditional: ConditionalNode,
};

export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const nodes = useStore((s) => s.nodes);
  const edges = useStore((s) => s.edges);
  const getNodeID = useStore((s) => s.getNodeID);
  const addNode = useStore((s) => s.addNode);
  const onNodesChange = useStore((s) => s.onNodesChange);
  const onEdgesChange = useStore((s) => s.onEdgesChange);
  const onConnect = useStore((s) => s.onConnect);

  const getInitNodeData = useCallback((nodeID, type) => {
    return { id: nodeID, nodeType: type };
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      if (!reactFlowInstance) return;

      const bounds = reactFlowWrapper.current?.getBoundingClientRect();
      if (!bounds) return;

      const appData = event.dataTransfer.getData('application/reactflow');
      if (!appData) return;

      try {
        const { nodeType } = JSON.parse(appData);
        if (!nodeType) return;

        const position = reactFlowInstance.project({
          x: event.clientX - bounds.left,
          y: event.clientY - bounds.top,
        });

        const nodeID = getNodeID(nodeType);

        addNode({
          id: nodeID,
          type: nodeType,
          position,
          data: getInitNodeData(nodeID, nodeType),
        });
      } catch (err) {
        console.error('Invalid drag payload', err);
      }
    },
    [reactFlowInstance, getNodeID, addNode, getInitNodeData]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // 🔒 Ensure React Flow always resolves a real target handle
  const isValidConnection = useCallback(
    (connection) => Boolean(connection.source && connection.target),
    []
  );

  return (
    <div
      ref={reactFlowWrapper}
      className="dot-grid"
      style={{ width: '100vw', height: '70vh', position: 'relative' }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setReactFlowInstance}
        snapGrid={[gridSize, gridSize]}
        connectionLineType="smoothstep"
        connectionMode="strict"
        isValidConnection={isValidConnection}
        nodeDragHandle=".drag-handle"
        connectOnClick={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={gridSize} />
        <Controls />
        <MiniMap nodeColor={() => '#6D28D9'}
          maskColor="rgba(15, 23, 42, 0.8)"
          style={{ backgroundColor: 'var(--vs-card-bg)' }}
        />
      </ReactFlow>
    </div>
  );
};
