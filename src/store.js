import { create } from 'zustand';
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
} from 'reactflow';

export const useStore = create((set, get) => ({
  nodes: [],
  edges: [],
  nodeIDs: {},

  getNodeID: (type) => {
    const nodeIDs = get().nodeIDs;
    const currentID = nodeIDs[type] ?? 0;
    const newID = currentID + 1;

    set({
      nodeIDs: { ...nodeIDs, [type]: newID },
    });

    return `${type}-${newID}`;
  },

  addNode: (node) => {
    set({
      nodes: [...get().nodes, node],
    });
  },

  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection) => {
    const {
      source,
      sourceHandle,
      target,
      targetHandle,
    } = connection;

    if (!source || !target || !targetHandle) {
      console.warn('Invalid connection dropped:', connection);
      return;
    }

    set({
      edges: addEdge(
        {
          id: `${source}-${sourceHandle}-${target}-${targetHandle}`,
          source,
          sourceHandle,
          target,
          targetHandle,
          type: 'smoothstep',
          animated: true,
          markerEnd: {
            type: MarkerType.Arrow,
            width: 20,
            height: 20,
          },
        },
        get().edges
      ),
    });
  },

  updateNodeField: (nodeId, fieldName, fieldValue) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === nodeId
          ? {
            ...node,
            data: {
              ...node.data,
              [fieldName]: fieldValue,
            },
          }
          : node
      ),
    });
  },

  clearNodes: () => {
    set({
      nodes: [],
      edges: [],
      nodeIDs: {},
    });
  },
}));
