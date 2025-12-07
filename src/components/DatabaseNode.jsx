import React from "react";
import { Handle, Position } from "@xyflow/react";
import { Key } from "lucide-react";

const DatabaseNode = ({ data, isConnectable }) => {
  const { label, columns = [], isDarkMode = true } = data;

  // Solid background colors (no transparency) - ensures edges go behind nodes
  const bgColor = isDarkMode ? "#0B1120" : "#ffffff";
  const borderColor = isDarkMode ? "border-orange-500/70" : "border-orange-400";

  // Invisible handle style - handles are there but not visible
  const handleStyle = {
    width: 8,
    height: 8,
    background: "transparent",
    border: "none",
    opacity: 0,
  };

  return (
    <div
      className={`min-w-[220px] rounded-lg overflow-hidden shadow-xl border-2 ${borderColor} relative`}
      style={{
        backgroundColor: bgColor,
        zIndex: 10, // Ensure nodes are above edges
      }}
    >
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

      {/* Table Header */}
      <div className="bg-linear-to-r from-orange-600 to-amber-500 px-4 py-2.5">
        <h3 className="text-white font-bold text-sm font-space tracking-wide">
          {label}
        </h3>
      </div>

      {/* Columns */}
      <div
        className={`divide-y ${
          isDarkMode ? "divide-gray-800" : "divide-gray-200"
        }`}
        style={{ backgroundColor: bgColor }}
      >
        {columns.length > 0 ? (
          columns.map((col, index) => (
            <div
              key={index}
              className={`flex items-center justify-between px-3 py-2 text-xs ${
                isDarkMode ? "hover:bg-slate-800" : "hover:bg-gray-50"
              }`}
              style={{ backgroundColor: isDarkMode ? "#0B1120" : "#ffffff" }}
            >
              <div className="flex items-center gap-2">
                {col.isPrimary && <Key className="w-3 h-3 text-amber-500" />}
                <span
                  className={`font-mono ${
                    isDarkMode ? "text-gray-200" : "text-gray-800"
                  } ${col.isPrimary ? "font-semibold" : ""}`}
                >
                  {col.name}
                </span>
              </div>
              <span
                className={`font-mono px-2 py-0.5 rounded text-[10px] ${
                  isDarkMode
                    ? "bg-slate-800 text-orange-400"
                    : "bg-orange-100 text-orange-700"
                }`}
              >
                {col.type}
              </span>
            </div>
          ))
        ) : (
          <div
            className={`px-3 py-2 text-xs ${
              isDarkMode ? "text-gray-500" : "text-gray-400"
            }`}
          >
            No columns defined
          </div>
        )}
      </div>
    </div>
  );
};

export default DatabaseNode;
