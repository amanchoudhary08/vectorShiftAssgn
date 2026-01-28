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
const proOptions = { hideAttribution: true };

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

  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);
  const getNodeID = useStore((state) => state.getNodeID);
  const addNode = useStore((state) => state.addNode);
  const onNodesChange = useStore((state) => state.onNodesChange);
  const onEdgesChange = useStore((state) => state.onEdgesChange);
  const onConnect = useStore((state) => state.onConnect);

  const getInitNodeData = useCallback((nodeID, type) => {
    return { id: nodeID, nodeType: type };
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      if (!reactFlowInstance) return;

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      if (!reactFlowBounds) return;

      const appData = event.dataTransfer.getData('application/reactflow');

      if (appData) {
        try {
          const { nodeType } = JSON.parse(appData);

          if (!nodeType) return;

          const position = reactFlowInstance.project({
            x: event.clientX - reactFlowBounds.left,
            y: event.clientY - reactFlowBounds.top,
          });

          const nodeID = getNodeID(nodeType);
          const newNode = {
            id: nodeID,
            type: nodeType,
            position,
            data: getInitNodeData(nodeID, nodeType),
          };

          addNode(newNode);
        } catch (error) {
          console.error('Failed to parse drag data:', error);
        }
      }
    },
    [reactFlowInstance, getNodeID, addNode, getInitNodeData]
  );


  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const isValidConnection = useCallback((connection) => {
    return true; // Allow all connections
  }, []);


  return (
    <div
      ref={reactFlowWrapper}
      className="dot-grid"
      style={{
        width: '100vw',
        height: '70vh',
        backgroundColor: 'transparent',
        position: 'relative',
        zIndex: 1
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        snapGrid={[gridSize, gridSize]}
        connectionLineType='smoothstep'
        isValidConnection={isValidConnection}
        connectionMode="strict"

        nodeDragHandle=".drag-handle"   // ✅ only header can move node
        connectOnClick={false}
      >
        <Background color="transparent" gap={gridSize} />
        <Controls />
        <MiniMap
          nodeColor={() => '#6D28D9'}
          maskColor="rgba(15, 23, 42, 0.8)"
          style={{ backgroundColor: 'var(--vs-card-bg)' }}
        />
      </ReactFlow>
    </div>
  );
};
