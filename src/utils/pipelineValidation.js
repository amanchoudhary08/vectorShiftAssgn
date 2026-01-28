// Check if all nodes are connected in the graph
const checkConnectivity = (nodes, edges) => {
    if (nodes.length <= 1) return true;

    const graph = new Map();
    nodes.forEach(node => graph.set(node.id, []));

    edges.forEach(edge => {
        if (!graph.has(edge.source)) graph.set(edge.source, []);
        if (!graph.has(edge.target)) graph.set(edge.target, []);
        graph.get(edge.source).push(edge.target);
        graph.get(edge.target).push(edge.source);
    });

    const visited = new Set();
    const dfs = (nodeId) => {
        visited.add(nodeId);
        graph.get(nodeId).forEach(neighbor => {
            if (!visited.has(neighbor)) dfs(neighbor);
        });
    };

    dfs(nodes[0].id);
    return visited.size === nodes.length;
};

// Detect cycles using DFS
const detectCycles = (edges) => {
    const graph = new Map();
    const visited = new Set();
    const recStack = new Set();

    edges.forEach(edge => {
        if (!graph.has(edge.source)) graph.set(edge.source, []);
        graph.get(edge.source).push(edge.target);
    });

    const hasCycle = (node) => {
        visited.add(node);
        recStack.add(node);

        const neighbors = graph.get(node) || [];
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor) && hasCycle(neighbor)) return true;
            if (recStack.has(neighbor)) return true;
        }

        recStack.delete(node);
        return false;
    };

    for (const [node] of graph) {
        if (!visited.has(node) && hasCycle(node)) return true;
    }
    return false;
};

export const validatePipeline = (nodes, edges) => {
    return {
        hasInputs: nodes.some(n => n.type === 'customInput'),
        hasOutputs: nodes.some(n => n.type === 'customOutput'),
        isConnected: checkConnectivity(nodes, edges),
        cycles: detectCycles(edges)
    };
};
