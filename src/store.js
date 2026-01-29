// store.js
// --------------------------------------------------

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

  // --------------------------------------------------
  // Node ID generator
  // --------------------------------------------------
  getNodeID: (type) => {
    const nodeIDs = get().nodeIDs;
    const currentID = nodeIDs[type] ?? 0;
    const newID = currentID + 1;

    set({
      nodeIDs: { ...nodeIDs, [type]: newID },
    });

    return `${type}-${newID}`;
  },

  // --------------------------------------------------
  // Nodes
  // --------------------------------------------------
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

  // --------------------------------------------------
  // Edges
  // --------------------------------------------------
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  /**
   * 🔑 CRITICAL FIX
   * Always persist sourceHandle + targetHandle.
   * If targetHandle is missing, React Flow connects
   * the edge to the node center.
   */
  onConnect: (connection) => {
    const {
      source,
      sourceHandle,
      target,
      targetHandle,
    } = connection;

    // Safety guard (should not happen with strict mode,
    // but prevents corrupted edges)
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

  // --------------------------------------------------
  // Node data updates
  // --------------------------------------------------
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

  // --------------------------------------------------
  // Reset
  // --------------------------------------------------
  clearNodes: () => {
    set({
      nodes: [],
      edges: [],
      nodeIDs: {},
    });
  },
}));
