import ELK from "elkjs/lib/elk.bundled.js";

const elk = new ELK();

// Default node dimensions
const DEFAULT_WIDTH = 180;
const DEFAULT_HEIGHT = 50;
const DB_NODE_WIDTH = 240;
const DB_NODE_HEIGHT = 200;

// Hub node dimensions (larger for visual anchors)
const HUB_NODE_WIDTH = 250;
const HUB_NODE_HEIGHT = 70;

/**
 * Check if a node is a "hub" node (visual anchor point)
 */
function isHubNode(nodeId) {
  if (!nodeId) return false;
  return (
    nodeId === "client_app" ||
    nodeId === "api_gateway" ||
    nodeId === "main_db" ||
    nodeId.includes("main_") ||
    nodeId.includes("gateway") ||
    nodeId.includes("_service") ||
    nodeId.includes("client_")
  );
}

/**
 * Calculates the best handles for an edge based on node positions
 * This creates "Smart Edges" that connect to the closest side
 */
function getSmartHandles(sourceNode, targetNode, getNodeDimensions) {
  const sourceDim = getNodeDimensions(sourceNode.id);
  const targetDim = getNodeDimensions(targetNode.id);

  // Calculate center points of each node
  const sourceCenter = {
    x: sourceNode.position.x + sourceDim.width / 2,
    y: sourceNode.position.y + sourceDim.height / 2,
  };
  const targetCenter = {
    x: targetNode.position.x + targetDim.width / 2,
    y: targetNode.position.y + targetDim.height / 2,
  };

  // Calculate the difference
  const diffX = targetCenter.x - sourceCenter.x;
  const diffY = targetCenter.y - sourceCenter.y;

  // Determine if the relationship is more horizontal or vertical
  const isHorizontal = Math.abs(diffX) > Math.abs(diffY);

  if (isHorizontal) {
    // Target is to the RIGHT of source
    if (diffX > 0) {
      return { sourceHandle: "right", targetHandle: "left-target" };
    }
    // Target is to the LEFT of source
    return { sourceHandle: "left", targetHandle: "right-target" };
  } else {
    // Target is BELOW source
    if (diffY > 0) {
      return { sourceHandle: "bottom", targetHandle: "top-target" };
    }
    // Target is ABOVE source
    return { sourceHandle: "top", targetHandle: "bottom-target" };
  }
}

/**
 * Converts React Flow nodes/edges to ELK format and performs layout
 */
export async function getLayoutedElements(nodes, edges, options = {}) {
  const { direction = "TB", isDatabase = false } = options;

  // Function to get node dimensions (hub nodes are larger)
  const getNodeDimensions = (nodeId) => {
    if (isDatabase) {
      return { width: DB_NODE_WIDTH, height: DB_NODE_HEIGHT };
    }
    if (isHubNode(nodeId)) {
      return { width: HUB_NODE_WIDTH, height: HUB_NODE_HEIGHT };
    }
    return { width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT };
  };

  // ELK layout configuration - ULTRA-SPACIOUS for complex diagrams (3x spacing)
  const layoutOptions = {
    "elk.algorithm": "layered",
    "elk.direction": direction === "LR" ? "RIGHT" : "DOWN",

    // MASSIVE NODE SPACING (3x previous values):
    // - Wide horizontal spacing prevents connection clutter
    // - Large vertical spacing gives room for edge routing
    "elk.spacing.nodeNode": isDatabase ? "600" : "450",
    "elk.layered.spacing.nodeNodeBetweenLayers": isDatabase ? "1350" : "300",

    // ORTHOGONAL ROUTING - Forces clean right-angle edges
    "elk.edgeRouting": "ORTHOGONAL",

    // Better visual balance for hub-and-spoke layout
    "elk.layered.nodePlacement.strategy": "BRANDES_KOEPF",

    // CRITICAL: Minimize edge crossings for interconnected graphs
    "elk.layered.crossingMinimization.strategy": "LAYER_SWEEP",
    "elk.layered.crossingMinimization.greedySwitch.type": "TWO_SIDED",

    // SPACIOUS EDGE GAPS (3x previous values):
    "elk.spacing.edgeNode": isDatabase ? "300" : "120",
    "elk.spacing.edgeEdge": isDatabase ? "240" : "75",
    "elk.layered.spacing.edgeNodeBetweenLayers": isDatabase ? "300" : "120",
    "elk.layered.spacing.edgeEdgeBetweenLayers": isDatabase ? "180" : "60",

    // Preserve node ordering for consistent hub placement
    "elk.layered.considerModelOrder.strategy": "NODES_AND_EDGES",

    // Generous margins around the entire graph (3x)
    "elk.padding": "[top=180,left=180,bottom=180,right=180]",
  };

  // Convert React Flow nodes to ELK format with dynamic sizing
  const elkNodes = nodes.map((node) => {
    const dim = getNodeDimensions(node.id);
    return {
      id: node.id,
      width: dim.width,
      height: dim.height,
      _originalNode: node,
    };
  });

  // Convert React Flow edges to ELK format
  const elkEdges = edges.map((edge) => ({
    id: edge.id,
    sources: [edge.source],
    targets: [edge.target],
    _originalEdge: edge,
  }));

  // Build the ELK graph
  const graph = {
    id: "root",
    layoutOptions,
    children: elkNodes,
    edges: elkEdges,
  };

  try {
    // Run ELK layout (async operation)
    const layoutedGraph = await elk.layout(graph);

    // Map ELK results back to React Flow format with positions
    const layoutedNodes = layoutedGraph.children.map((elkNode) => {
      const originalNode = elkNode._originalNode;
      return {
        ...originalNode,
        position: {
          x: elkNode.x,
          y: elkNode.y,
        },
      };
    });

    // Create a lookup map for quick node access
    const nodeMap = new Map();
    layoutedNodes.forEach((node) => {
      nodeMap.set(node.id, node);
    });

    // SMART HANDLE LOGIC: Calculate best handles for each edge based on positions
    const smartEdges = layoutedGraph.edges.map((elkEdge) => {
      const originalEdge = elkEdge._originalEdge;
      const sourceNode = nodeMap.get(originalEdge.source);
      const targetNode = nodeMap.get(originalEdge.target);

      // Calculate the best handles based on relative positions
      let sourceHandle = "bottom";
      let targetHandle = "top-target";

      if (sourceNode && targetNode) {
        const handles = getSmartHandles(
          sourceNode,
          targetNode,
          getNodeDimensions
        );
        sourceHandle = handles.sourceHandle;
        targetHandle = handles.targetHandle;
      }

      return {
        ...originalEdge,
        sourceHandle,
        targetHandle,
      };
    });

    return { nodes: layoutedNodes, edges: smartEdges };
  } catch (error) {
    console.error("ELK layout error:", error);
    // Fallback: return original nodes/edges with basic positioning
    return {
      nodes: nodes.map((node, index) => ({
        ...node,
        position: node.position || { x: index * 200, y: index * 100 },
      })),
      edges,
    };
  }
}

export default getLayoutedElements;
