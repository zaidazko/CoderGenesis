import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Panel,
  useNodesState,
  useEdgesState,
  MarkerType,
  ConnectionLineType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  LayoutGrid,
  Monitor,
  Server,
  Database,
  Cloud,
  Cog,
} from "lucide-react";
import DatabaseNode from "./DatabaseNode";
import LogicNode from "./LogicNode";
import { getLayoutedElements } from "../lib/getElkLayout";

// Custom node types - both have 4 invisible handles for smart routing
const nodeTypes = {
  databaseSchema: DatabaseNode,
  logicNode: LogicNode,
};

const ArchitectureDiagram = ({
  initialNodes = [],
  initialEdges = [],
  isDarkMode = true,
  diagramType = "flow",
  onDiagramChange = null,
  skipInitialLayout = false,
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isLayouting, setIsLayouting] = useState(false);

  const isDatabase = diagramType === "schema";

  // Prepare styled nodes from initial data
  const getStyledNodes = useCallback(
    (inputNodes) => {
      return inputNodes.map((node) => {
        // For database schema nodes, pass isDarkMode in data
        if (node.type === "databaseSchema") {
          return {
            ...node,
            zIndex: 1001,
            data: {
              ...node.data,
              isDarkMode,
            },
          };
        }

        // For flow nodes, use the LogicNode component with 4 handles
        // PRIORITY ORDER for determining the semantic type:
        // 1. node.data._originalType (immutable, set once)
        // 2. node.data.nodeType (from previous processing)
        // 3. node.type (fresh from Gemini, before we change it to "logicNode")
        // 4. "default" fallback
        const semanticType =
          node.data?._originalType ||
          node.data?.nodeType ||
          (node.type !== "logicNode" ? node.type : null) ||
          "default";

        return {
          ...node,
          type: "logicNode", // React Flow component type (for rendering)
          zIndex: 1001,
          data: {
            ...node.data,
            label: node.data?.label || node.label,
            isDarkMode,
            nodeType: semanticType, // Semantic type for styling (frontend, backend, etc.)
            _originalType: node.data?._originalType || semanticType, // Immutable backup
          },
        };
      });
    },
    [isDarkMode]
  );

  // Color map for edge colors based on source node type
  const getEdgeColorByType = useCallback(
    (nodeType) => {
      const dark = isDarkMode;
      switch (nodeType) {
        case "frontend":
          return { stroke: "#3b82f6", label: dark ? "#93c5fd" : "#1e40af" }; // Blue
        case "backend":
        case "api":
          return { stroke: "#10b981", label: dark ? "#6ee7b7" : "#065f46" }; // Green
        case "database":
        case "storage":
          return { stroke: "#f59e0b", label: dark ? "#fcd34d" : "#92400e" }; // Orange
        case "service":
        case "external":
          return { stroke: "#8b5cf6", label: dark ? "#c4b5fd" : "#5b21b6" }; // Purple
        case "logic":
        case "process":
          return { stroke: "#64748b", label: dark ? "#cbd5e1" : "#475569" }; // Slate
        case "input":
          return { stroke: "#14b8a6", label: dark ? "#5eead4" : "#0f766e" }; // Teal
        case "output":
          return { stroke: "#ef4444", label: dark ? "#fca5a5" : "#991b1b" }; // Red
        default:
          return { stroke: "#f97316", label: dark ? "#fdba74" : "#9a3412" }; // Brand Orange
      }
    },
    [isDarkMode]
  );

  // Prepare styled edges from initial data
  const getStyledEdges = useCallback(
    (inputEdges, styledNodes) => {
      const defaultEdgeColor = isDarkMode ? "#64748b" : "#94a3b8";
      const labelBgColor = isDarkMode ? "#1e293b" : "#f1f5f9";
      const edgeBorderRadius = isDatabase ? 15 : 25;

      // Create a map of node IDs to their types for quick lookup
      const nodeTypeMap = new Map();
      styledNodes.forEach((node) => {
        const nodeType =
          node.data?.nodeType || node.data?._originalType || "default";
        nodeTypeMap.set(node.id, nodeType);
      });

      return inputEdges.map((edge) => {
        // Get the source node's type and corresponding color
        const sourceType = nodeTypeMap.get(edge.source) || "default";
        const edgeColors = isDatabase
          ? {
              stroke: defaultEdgeColor,
              label: isDarkMode ? "#e2e8f0" : "#334155",
            }
          : getEdgeColorByType(sourceType);

        return {
          ...edge,
          type: "smoothstep",
          pathOptions: { borderRadius: edgeBorderRadius },
          style: {
            stroke: edgeColors.stroke,
            strokeWidth: 2,
          },
          zIndex: -1,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: edgeColors.stroke,
            width: 18,
            height: 18,
          },
          labelStyle: {
            fill: edgeColors.label,
            fontSize: 11,
            fontWeight: 600,
            fontFamily: "Inter, sans-serif",
          },
          labelBgStyle: {
            fill: labelBgColor,
            fillOpacity: 0.95,
          },
          labelBgPadding: [8, 6],
          labelBgBorderRadius: 6,
        };
      });
    },
    [isDarkMode, isDatabase, getEdgeColorByType]
  );

  // Run ELK layout function (reusable for initial load and auto-format)
  const runLayout = useCallback(
    async (inputNodes, inputEdges, shouldSaveToParent = true) => {
      if (inputNodes.length === 0) return;

      setIsLayouting(true);

      try {
        const styledNodes = getStyledNodes(inputNodes);
        const styledEdges = getStyledEdges(inputEdges, styledNodes);

        // Run ELK layout (async) with smart handle calculation
        const direction = isDatabase ? "LR" : "TB";
        const { nodes: layoutedNodes, edges: layoutedEdges } =
          await getLayoutedElements(styledNodes, styledEdges, {
            direction,
            isDatabase,
          });

        // Update state with layouted elements
        setNodes([...layoutedNodes]);
        setEdges([...layoutedEdges]);

        // Save layout positions to parent (deferred to avoid setState during render)
        if (shouldSaveToParent && onDiagramChange) {
          setTimeout(() => {
            onDiagramChange(layoutedNodes, layoutedEdges);
          }, 0);
        }
      } catch (error) {
        console.error("Layout error:", error);
      } finally {
        setIsLayouting(false);
      }
    },
    [
      getStyledNodes,
      getStyledEdges,
      isDatabase,
      setNodes,
      setEdges,
      onDiagramChange,
    ]
  );

  // Apply ELK layout OR restore saved positions
  useEffect(() => {
    if (skipInitialLayout && initialNodes.length > 0) {
      // Skip layout - use saved positions from initialNodes directly
      const styledNodes = getStyledNodes(initialNodes);
      const styledEdges = getStyledEdges(initialEdges, styledNodes);
      setNodes(styledNodes);
      setEdges(styledEdges);
    } else {
      // Run ELK layout for new data
      runLayout(initialNodes, initialEdges);
    }
  }, [
    initialNodes,
    initialEdges,
    runLayout,
    skipInitialLayout,
    getStyledNodes,
    getStyledEdges,
    setNodes,
    setEdges,
  ]);

  // AUTO-FORMAT: Re-run layout on current nodes (snaps messy nodes back to grid)
  const handleAutoFormat = useCallback(async () => {
    if (nodes.length === 0) return;

    setIsLayouting(true);

    try {
      // Use current node positions but re-run layout
      const direction = isDatabase ? "LR" : "TB";
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        await getLayoutedElements(nodes, edges, {
          direction,
          isDatabase,
        });

      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);

      // Save the new auto-formatted positions to parent (deferred)
      if (onDiagramChange) {
        setTimeout(() => {
          onDiagramChange(layoutedNodes, layoutedEdges);
        }, 0);
      }
    } catch (error) {
      console.error("Auto-format error:", error);
    } finally {
      setIsLayouting(false);
    }
  }, [nodes, edges, isDatabase, setNodes, setEdges, onDiagramChange]);

  // Custom node change handler - saves positions to parent
  const handleNodesChange = useCallback(
    (changes) => {
      onNodesChange(changes);

      // Report position changes back to parent after drag ends
      const hasDragEnd = changes.some(
        (change) => change.type === "position" && change.dragging === false
      );

      if (hasDragEnd && onDiagramChange) {
        // Use setTimeout to ensure state has updated
        setTimeout(() => {
          // Get current nodes/edges from the setter callbacks
          setNodes((currentNodes) => {
            setEdges((currentEdges) => {
              onDiagramChange(currentNodes, currentEdges);
              return currentEdges;
            });
            return currentNodes;
          });
        }, 0);
      }
    },
    [onNodesChange, onDiagramChange, setNodes, setEdges]
  );

  // React Flow options
  const proOptions = useMemo(() => ({ hideAttribution: true }), []);

  // Background color based on theme
  const bgColor = isDarkMode ? "#0a0a0a" : "#fafafa";
  const gridColor = isDarkMode ? "#1e293b" : "#e2e8f0";

  return (
    <div className="w-full h-full relative">
      {/* Loading overlay */}
      {isLayouting && (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/20">
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-900 rounded-lg border border-gray-700">
            <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-gray-300">Calculating layout...</span>
          </div>
        </div>
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.2}
        maxZoom={2}
        style={{ background: bgColor }}
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={true}
        connectionLineType={ConnectionLineType.SmoothStep}
        defaultEdgeOptions={{
          type: "smoothstep",
          style: { strokeWidth: 2 },
        }}
      >
        <Background color={gridColor} gap={24} size={1} />
        <Controls className={isDarkMode ? "react-flow-controls-dark" : ""} />

        {/* Auto-Format Button - Top Right */}
        <Panel position="top-right">
          <button
            onClick={handleAutoFormat}
            disabled={isLayouting || nodes.length === 0}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              isDarkMode
                ? "bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700"
                : "bg-white hover:bg-gray-100 text-gray-700 border border-gray-300"
            } ${
              isLayouting
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer hover:border-orange-500"
            }`}
            title="Re-arrange nodes into a clean grid layout"
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Auto-Format</span>
          </button>
        </Panel>

        {/* Color Legend - Bottom Left (only for flow diagrams) */}
        {!isDatabase && nodes.length > 0 && (
          <Panel position="bottom-left">
            <div
              className={`flex flex-wrap gap-3 px-3 py-2 rounded-lg text-xs font-medium ${
                isDarkMode
                  ? "bg-gray-900/90 text-gray-300 border border-gray-700"
                  : "bg-white/90 text-gray-600 border border-gray-300"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <div
                  className="w-3 h-3 rounded"
                  style={{ background: "#3b82f6" }}
                />
                <Monitor className="w-3 h-3" style={{ color: "#3b82f6" }} />
                <span>Frontend</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div
                  className="w-3 h-3 rounded"
                  style={{ background: "#10b981" }}
                />
                <Server className="w-3 h-3" style={{ color: "#10b981" }} />
                <span>Backend</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div
                  className="w-3 h-3 rounded"
                  style={{ background: "#f59e0b" }}
                />
                <Database className="w-3 h-3" style={{ color: "#f59e0b" }} />
                <span>Database</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div
                  className="w-3 h-3 rounded"
                  style={{ background: "#8b5cf6" }}
                />
                <Cloud className="w-3 h-3" style={{ color: "#8b5cf6" }} />
                <span>Service</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div
                  className="w-3 h-3 rounded"
                  style={{ background: "#64748b" }}
                />
                <Cog className="w-3 h-3" style={{ color: "#64748b" }} />
                <span>Logic</span>
              </div>
            </div>
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
};

export default ArchitectureDiagram;
