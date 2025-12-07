import React from "react";
import { Key, Table2 } from "lucide-react";

const SchemaDefinitions = ({ nodes = [], isDarkMode = true }) => {
  // Filter to only database schema nodes
  const tableNodes = nodes.filter((node) => node.type === "databaseSchema");

  if (tableNodes.length === 0) {
    return (
      <div
        className={`h-full flex items-center justify-center p-6 ${
          isDarkMode ? "text-gray-500" : "text-gray-400"
        }`}
      >
        <div className="text-center">
          <Table2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm font-mono">No tables defined</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`h-full overflow-y-auto font-mono text-sm ${
        isDarkMode ? "bg-gray-950/50" : "bg-gray-50"
      }`}
    >
      {/* Header */}
      <div
        className={`sticky top-0 z-10 px-4 py-3 border-b ${
          isDarkMode
            ? "bg-gray-950 border-gray-800 text-gray-400"
            : "bg-white border-gray-200 text-gray-600"
        }`}
      >
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider">
          <Table2 className="w-3.5 h-3.5" />
          Schema Definitions
          <span
            className={`ml-auto px-2 py-0.5 rounded text-[10px] ${
              isDarkMode
                ? "bg-gray-800 text-gray-500"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            {tableNodes.length} {tableNodes.length === 1 ? "table" : "tables"}
          </span>
        </div>
      </div>

      {/* Table Definitions */}
      <div className="divide-y divide-gray-800/50">
        {tableNodes.map((node) => (
          <TableDefinition
            key={node.id}
            table={node.data}
            isDarkMode={isDarkMode}
          />
        ))}
      </div>
    </div>
  );
};

const TableDefinition = ({ table, isDarkMode }) => {
  const { label, columns = [] } = table;

  return (
    <div className={`p-4 ${isDarkMode ? "bg-gray-900/30" : "bg-white"}`}>
      {/* Table Name */}
      <div className="flex items-center gap-2 mb-3">
        <span
          className={`font-bold ${
            isDarkMode ? "text-orange-500" : "text-orange-600"
          }`}
        >
          {label}
        </span>
        <span
          className={`text-[10px] px-1.5 py-0.5 rounded ${
            isDarkMode
              ? "bg-orange-500/10 text-orange-400/70"
              : "bg-orange-100 text-orange-600"
          }`}
        >
          TABLE
        </span>
      </div>

      {/* Columns */}
      <div
        className={`rounded-lg overflow-hidden border ${
          isDarkMode
            ? "border-gray-800 bg-gray-950/50"
            : "border-gray-400 bg-gray-50"
        }`}
      >
        {columns.length > 0 ? (
          columns.map((col, index) => (
            <div
              key={index}
              className={`flex items-center justify-between px-3 py-2 ${
                index !== columns.length - 1
                  ? isDarkMode
                    ? "border-b border-gray-800/50"
                    : "border-b border-gray-300"
                  : ""
              }`}
            >
              {/* Column Name */}
              <div className="flex items-center gap-2">
                {col.isPrimary && (
                  <Key
                    className={`w-3 h-3 ${
                      isDarkMode ? "text-amber-500" : "text-amber-600"
                    }`}
                  />
                )}
                <span
                  className={`${
                    isDarkMode ? "text-gray-200" : "text-gray-800"
                  } ${col.isPrimary ? "font-semibold" : ""}`}
                >
                  {col.name}
                </span>
              </div>

              {/* Column Type */}
              <div className="flex items-center gap-2">
                <span
                  className={`${
                    isDarkMode ? "text-blue-400/70" : "text-blue-600/80"
                  }`}
                >
                  {col.type}
                </span>
                {col.isPrimary && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                      isDarkMode
                        ? "bg-amber-500/10 text-amber-400"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    PK
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div
            className={`px-3 py-2 text-center ${
              isDarkMode ? "text-gray-600" : "text-gray-400"
            }`}
          >
            No columns defined
          </div>
        )}
      </div>
    </div>
  );
};

export default SchemaDefinitions;
