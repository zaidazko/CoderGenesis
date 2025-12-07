import React from "react";
import { Handle, Position } from "@xyflow/react";
import {
  Monitor,
  Server,
  Database,
  Cloud,
  Cog,
  CircleCheck,
  CircleX,
  Globe,
  Layers,
} from "lucide-react";

const LogicNode = ({ id, data, isConnectable }) => {
  const { label, isDarkMode = true, nodeType = "default" } = data;

  // Check if this is a HUB node (visual anchor point)
  const isHubNode =
    id === "client_app" ||
    id === "api_gateway" ||
    id === "main_db" ||
    id?.includes("main_") ||
    id?.includes("gateway") ||
    id?.includes("_service") ||
    id?.includes("client_");

  // Invisible handle style - handles are there but not visible
  const handleStyle = {
    width: 8,
    height: 8,
    background: "transparent",
    border: "none",
    opacity: 0,
  };

  // System Architecture node types with BOLD, DISTINCT visual styles
  const getNodeConfig = () => {
    const dark = isDarkMode;
    switch (nodeType) {
      // FRONTEND: Vibrant Blue - UI Components, Client Apps
      case "frontend":
        return {
          bg: dark
            ? "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)"
            : "linear-gradient(135deg, #bfdbfe 0%, #93c5fd 100%)",
          border: "#3b82f6",
          text: dark ? "#ffffff" : "#1e3a8a",
          icon: id === "client_app" ? Globe : Monitor,
          borderRadius: "10px",
          borderWidth: isHubNode ? "4px" : "3px",
          glowColor: isHubNode
            ? "rgba(59, 130, 246, 0.6)"
            : "rgba(59, 130, 246, 0.2)",
          tagColor: "#3b82f6",
          tagText: "UI",
        };

      // BACKEND/API: Vibrant Green - Edge Functions, API Endpoints
      case "backend":
      case "api":
        return {
          bg: dark
            ? "linear-gradient(135deg, #065f46 0%, #059669 100%)"
            : "linear-gradient(135deg, #a7f3d0 0%, #6ee7b7 100%)",
          border: "#10b981",
          text: dark ? "#ffffff" : "#065f46",
          icon: id?.includes("gateway") ? Layers : Server,
          borderRadius: isHubNode ? "14px" : "10px",
          borderWidth: isHubNode ? "4px" : "3px",
          glowColor: isHubNode
            ? "rgba(16, 185, 129, 0.6)"
            : "rgba(16, 185, 129, 0.2)",
          tagColor: "#10b981",
          tagText: "API",
        };

      // DATABASE: Vibrant Orange/Amber - Tables, Storage
      case "database":
      case "storage":
        return {
          bg: dark
            ? "linear-gradient(135deg, #92400e 0%, #d97706 100%)"
            : "linear-gradient(135deg, #fde68a 0%, #fbbf24 100%)",
          border: "#f59e0b",
          text: dark ? "#ffffff" : "#78350f",
          icon: Database,
          borderRadius: isHubNode ? "14px" : "10px",
          borderWidth: isHubNode ? "4px" : "3px",
          glowColor: isHubNode
            ? "rgba(245, 158, 11, 0.6)"
            : "rgba(245, 158, 11, 0.2)",
          tagColor: "#f59e0b",
          tagText: "DB",
        };

      // SERVICE: Vibrant Purple - External APIs (Stripe, OpenAI, AWS)
      case "service":
      case "external":
        return {
          bg: dark
            ? "linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%)"
            : "linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 100%)",
          border: "#8b5cf6",
          text: dark ? "#ffffff" : "#5b21b6",
          icon: Cloud,
          borderRadius: isHubNode ? "18px" : "14px",
          borderWidth: isHubNode ? "4px" : "3px",
          glowColor: isHubNode
            ? "rgba(139, 92, 246, 0.6)"
            : "rgba(139, 92, 246, 0.2)",
          tagColor: "#8b5cf6",
          tagText: "EXT",
        };

      // LOGIC: Slate/Cyan - Validation, Processing steps
      case "logic":
      case "process":
        return {
          bg: dark
            ? "linear-gradient(135deg, #334155 0%, #475569 100%)"
            : "linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)",
          border: "#64748b",
          text: dark ? "#f1f5f9" : "#334155",
          icon: Cog,
          borderRadius: "10px",
          borderWidth: "3px",
          glowColor: "rgba(100, 116, 139, 0.2)",
          tagColor: "#64748b",
          tagText: "⚙",
        };

      // INPUT: Bright Teal - Entry points
      case "input":
        return {
          bg: dark
            ? "linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)"
            : "linear-gradient(135deg, #99f6e4 0%, #5eead4 100%)",
          border: "#14b8a6",
          text: dark ? "#ffffff" : "#0f766e",
          icon: CircleCheck,
          borderRadius: "10px",
          borderWidth: "3px",
          glowColor: "rgba(20, 184, 166, 0.3)",
          tagColor: "#14b8a6",
          tagText: "IN",
        };

      // OUTPUT: Bright Red - End points
      case "output":
        return {
          bg: dark
            ? "linear-gradient(135deg, #b91c1c 0%, #dc2626 100%)"
            : "linear-gradient(135deg, #fecaca 0%, #fca5a5 100%)",
          border: "#ef4444",
          text: dark ? "#ffffff" : "#991b1b",
          icon: CircleX,
          borderRadius: "10px",
          borderWidth: "3px",
          glowColor: "rgba(239, 68, 68, 0.3)",
          tagColor: "#ef4444",
          tagText: "OUT",
        };

      // DEFAULT: Brand Orange
      default:
        return {
          bg: dark
            ? "linear-gradient(135deg, #7c2d12 0%, #c2410c 100%)"
            : "linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)",
          border: "#f97316",
          text: dark ? "#ffffff" : "#7c2d12",
          icon: Layers,
          borderRadius: "10px",
          borderWidth: "3px",
          glowColor: "rgba(249, 115, 22, 0.2)",
          tagColor: "#f97316",
          tagText: "",
        };
    }
  };

  const config = getNodeConfig();
  const IconComponent = config.icon;

  // Hub nodes get special sizing and styling
  const nodeWidth = isHubNode ? "220px" : "160px";
  const nodeMaxWidth = isHubNode ? "280px" : "220px";
  const nodePadding = isHubNode ? "14px 24px" : "10px 16px";
  const fontSize = isHubNode ? "14px" : "12px";
  const fontWeight = isHubNode ? 700 : 600;
  const iconSize = isHubNode ? "w-5 h-5" : "w-4 h-4";

  return (
    <div
      style={{
        background: config.bg,
        border: `${config.borderWidth} solid ${config.border}`,
        color: config.text,
        padding: nodePadding,
        borderRadius: config.borderRadius,
        fontSize: fontSize,
        fontFamily: "Inter, sans-serif",
        fontWeight: fontWeight,
        minWidth: nodeWidth,
        maxWidth: nodeMaxWidth,
        textAlign: "center",
        boxShadow: `0 0 0 1px ${config.border}22, 0 4px 16px ${
          config.glowColor
        }, 0 2px 8px rgba(0,0,0,${isDarkMode ? "0.4" : "0.15"})`,
        zIndex: isHubNode ? 20 : 10,
        transition: "all 0.2s ease",
        position: "relative",
      }}
    >
      {/* Type indicator tag */}
      {config.tagText && (
        <div
          style={{
            position: "absolute",
            top: "-8px",
            right: "-8px",
            background: config.tagColor,
            color: "#ffffff",
            fontSize: "9px",
            fontWeight: 700,
            padding: "2px 6px",
            borderRadius: "4px",
            letterSpacing: "0.5px",
            boxShadow: `0 2px 4px rgba(0,0,0,0.2)`,
            zIndex: 30,
          }}
        >
          {config.tagText}
        </div>
      )}
      {/* 4 HANDLES - All invisible for dynamic edge routing */}

      {/* Top Handle */}
      <Handle
        type="source"
        position={Position.Top}
        id="top"
        isConnectable={isConnectable}
        style={{ ...handleStyle, top: -4 }}
      />
      <Handle
        type="target"
        position={Position.Top}
        id="top-target"
        isConnectable={isConnectable}
        style={{ ...handleStyle, top: -4 }}
      />

      {/* Right Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        isConnectable={isConnectable}
        style={{ ...handleStyle, right: -4 }}
      />
      <Handle
        type="target"
        position={Position.Right}
        id="right-target"
        isConnectable={isConnectable}
        style={{ ...handleStyle, right: -4 }}
      />

      {/* Bottom Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        isConnectable={isConnectable}
        style={{ ...handleStyle, bottom: -4 }}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom-target"
        isConnectable={isConnectable}
        style={{ ...handleStyle, bottom: -4 }}
      />

      {/* Left Handle */}
      <Handle
        type="source"
        position={Position.Left}
        id="left"
        isConnectable={isConnectable}
        style={{ ...handleStyle, left: -4 }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left-target"
        isConnectable={isConnectable}
        style={{ ...handleStyle, left: -4 }}
      />

      {/* Node Content with Icon */}
      <div className="flex items-center justify-center gap-2">
        {IconComponent && (
          <IconComponent
            className={`${iconSize} shrink-0`}
            style={{ color: config.text }}
          />
        )}
        <span className="leading-tight">{label}</span>
      </div>
    </div>
  );
};

export default LogicNode;
