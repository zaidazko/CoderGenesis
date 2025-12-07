import React, { useState } from "react";
import {
  Folder,
  FolderOpen,
  FileCode,
  FileJson,
  FileText,
  File,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

// Determine the icon and color based on file name/type
export const getFileIcon = (name, isFolder) => {
  if (isFolder) {
    return { Icon: Folder, color: "#60a5fa" }; // Blue folder
  }

  const ext = name.split(".").pop()?.toLowerCase();

  // Config/JSON files
  if (
    ext === "json" ||
    name.includes("config") ||
    name === ".env" ||
    name === ".gitignore"
  ) {
    return { Icon: FileJson, color: "#fbbf24" }; // Yellow
  }

  // JavaScript/JSX files
  if (ext === "js" || ext === "jsx" || ext === "ts" || ext === "tsx") {
    return { Icon: FileCode, color: "#f97316" }; // Orange
  }

  // CSS/Style files
  if (ext === "css" || ext === "scss" || ext === "sass") {
    return { Icon: FileCode, color: "#38bdf8" }; // Blue
  }

  // Markdown/Text files
  if (ext === "md" || ext === "txt") {
    return { Icon: FileText, color: "#94a3b8" }; // Slate
  }

  // Default file
  return { Icon: File, color: "#64748b" }; // Gray
};

// Single tree item (recursive)
const TreeItem = ({
  item,
  depth = 0,
  isDarkMode,
  selectedFile,
  onFileSelect,
}) => {
  const [isOpen, setIsOpen] = useState(depth < 2); // Auto-expand first 2 levels
  const isFolder = item.type === "folder";
  const hasChildren = isFolder && item.children && item.children.length > 0;

  const fileIconData = getFileIcon(item.name, isFolder);
  const isSelected = selectedFile?.name === item.name && selectedFile?.type === item.type;

  const handleClick = (e) => {
    e.stopPropagation();
    
    if (isFolder) {
      setIsOpen(!isOpen);
      // Also select folder to show its description
      if (onFileSelect && item.description) {
        onFileSelect(item);
      }
    } else {
      // Select file
      if (onFileSelect) {
        onFileSelect(item);
      }
    }
  };

  // Folder colors
  const folderColor = isDarkMode ? "#60a5fa" : "#3b82f6"; // Blue

  return (
    <div>
      {/* Item Row */}
      <div
        onClick={handleClick}
        className={`flex items-center gap-1.5 py-1.5 px-2 rounded cursor-pointer transition-all duration-150 ${
          isSelected
            ? isDarkMode
              ? "bg-orange-500/20 text-orange-400"
              : "bg-orange-100 text-orange-600"
            : isDarkMode
            ? "hover:bg-gray-800/60"
            : "hover:bg-gray-200/60"
        }`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        {/* Chevron for folders */}
        {isFolder ? (
          <span className="w-4 h-4 flex items-center justify-center shrink-0">
            {hasChildren ? (
              isOpen ? (
                <ChevronDown
                  className="w-3 h-3"
                  style={{
                    color: isSelected
                      ? isDarkMode
                        ? "#fb923c"
                        : "#ea580c"
                      : isDarkMode
                      ? "#6b7280"
                      : "#9ca3af",
                  }}
                />
              ) : (
                <ChevronRight
                  className="w-3 h-3"
                  style={{
                    color: isSelected
                      ? isDarkMode
                        ? "#fb923c"
                        : "#ea580c"
                      : isDarkMode
                      ? "#6b7280"
                      : "#9ca3af",
                  }}
                />
              )
            ) : null}
          </span>
        ) : (
          <span className="w-4 h-4 shrink-0" /> // Spacer for alignment
        )}

        {/* Icon */}
        {isFolder ? (
          isOpen ? (
            <FolderOpen
              className="w-4 h-4 shrink-0"
              style={{ color: isSelected ? (isDarkMode ? "#fb923c" : "#ea580c") : folderColor }}
            />
          ) : (
            <Folder
              className="w-4 h-4 shrink-0"
              style={{ color: isSelected ? (isDarkMode ? "#fb923c" : "#ea580c") : folderColor }}
            />
          )
        ) : (
          fileIconData && (
            <fileIconData.Icon
              className="w-4 h-4 shrink-0"
              style={{
                color: isSelected
                  ? isDarkMode
                    ? "#fb923c"
                    : "#ea580c"
                  : fileIconData.color,
              }}
            />
          )
        )}

        {/* Name */}
        <span
          className={`text-xs font-mono truncate ${
            isSelected
              ? ""
              : isDarkMode
              ? "text-gray-300"
              : "text-gray-700"
          } ${isFolder ? "font-medium" : ""}`}
        >
          {item.name}
        </span>
      </div>

      {/* Children (if folder is open) */}
      {isFolder && isOpen && hasChildren && (
        <div>
          {item.children.map((child, index) => (
            <TreeItem
              key={`${child.name}-${index}`}
              item={child}
              depth={depth + 1}
              isDarkMode={isDarkMode}
              selectedFile={selectedFile}
              onFileSelect={onFileSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Main FileTree component
const FileTree = ({
  data = [],
  isDarkMode = true,
  onFileSelect,
  selectedFile,
}) => {
  if (!data || data.length === 0) {
    return (
      <div
        className={`text-xs font-mono ${
          isDarkMode ? "text-gray-600" : "text-gray-400"
        } italic px-2 py-3`}
      >
        No file structure available
      </div>
    );
  }

  return (
    <div className="py-1">
      {data.map((item, index) => (
        <TreeItem
          key={`${item.name}-${index}`}
          item={item}
          depth={0}
          isDarkMode={isDarkMode}
          selectedFile={selectedFile}
          onFileSelect={onFileSelect}
        />
      ))}
    </div>
  );
};

export default FileTree;
