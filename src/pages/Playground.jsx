import React, { useState, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  Loader2,
  Sparkles,
  Terminal,
  GitBranch,
  Database,
  Folder,
  FileJson,
  Layers,
  ChevronRight,
  ChevronLeft,
  Sun,
  Moon,
  Code,
  PanelRightClose,
  PanelRightOpen,
  PanelLeftClose,
  PanelLeftOpen,
  GripVertical,
} from "lucide-react";
import ArchitectureDiagram from "../components/ArchitectureDiagram";
import SchemaDefinitions from "../components/SchemaDefinitions";
import FileTree, { getFileIcon } from "../components/FileTree";
import { useResizable, useResizablePercent } from "../hooks/useResizable";
import { Link } from "react-router-dom";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const Playground = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState("flow");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showDefinitions, setShowDefinitions] = useState(true);

  // Store user-modified diagram positions per tab (persists across tab switches)
  const [savedFlowDiagram, setSavedFlowDiagram] = useState(null);
  const [savedSchemaDiagram, setSavedSchemaDiagram] = useState(null);

  // Selected file in the file tree (for showing description)
  const [selectedFile, setSelectedFile] = useState(null);

  // Resizable panels using high-performance hooks
  const {
    width: sidebarWidth,
    startResizing: startSidebarResize,
    isResizing: isSidebarResizing,
  } = useResizable(320, 200, 500, "right");

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Ref for the canvas container (needed for percentage-based resizing)
  const canvasContainerRef = useRef(null);

  const {
    percent: definitionsWidth,
    startResizing: startDefinitionsResize,
    isResizing: isDefinitionsResizing,
  } = useResizablePercent(35, 20, 50, canvasContainerRef, "left");

  // Combined resizing state for overlay
  const isAnyResizing = isSidebarResizing || isDefinitionsResizing;

  const generateBlueprint = async () => {
    if (!prompt) return;
    setLoading(true);
    setResult(null);
    // Clear saved positions when generating new blueprint
    setSavedFlowDiagram(null);
    setSavedSchemaDiagram(null);
    setSelectedFile(null);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const systemPrompt = `You are a Senior Cloud Architect creating interconnected System Architecture diagrams. Generate a SINGLE, UNIFIED node graph representing the entire application as ONE connected organism.

CRITICAL RULES:
1. Output ONLY raw JSON. Do NOT use Markdown code blocks (no \`\`\`json).

2. FOR "logicFlow" (MASTER SYSTEM ARCHITECTURE GRAPH):
   DO NOT generate isolated feature flows. Create ONE MASSIVE INTERCONNECTED GRAPH where all features share resources.
   
   THE 3 CORE HUB NODES (ALWAYS CREATE THESE FIRST):
   - { "id": "client_app", "type": "frontend", "data": { "label": "Web/Mobile Client" } }
   - { "id": "api_gateway", "type": "backend", "data": { "label": "API Gateway" } }
   - { "id": "main_db", "type": "database", "data": { "label": "Primary Database" } }
    
   STRICT NODE RE-USE RULES:
   1. FAN-OUT: ALL features must branch from client_app -> api_gateway
   2. FAN-IN: ALL features must eventually connect back to shared nodes (main_db, auth_service, etc.)
   3. NO DUPLICATES: Do NOT create multiple database nodes. Create ONE "main_db" and connect all features to it.
   4. SHARED SERVICES: Create shared service nodes (e.g., "auth_service", "storage_service") that multiple features connect to.
   
   NODE TYPES (CRITICAL - USE ALL 5 TYPES, NOT JUST ONE):
   - "frontend": UI components ONLY (Blue) - client_app, screens, modals
   - "backend": API endpoints ONLY (Green) - POST /api/..., GET /api/...
   - "logic": Processing steps ONLY (Gray) - validation, transformations, business rules
   - "service": External APIs ONLY (Purple) - Stripe, OpenAI, S3, Redis, Auth providers
   - "database": Storage nodes ONLY (Orange) - main_db, cache stores
   
   IMPORTANT: Each node MUST have the correct type based on its function. Do NOT use "database" for API endpoints!
   
   GRAPH STRUCTURE (Hourglass/Web Shape):
   TOP: client_app (single entry point)
   ↓
   api_gateway (central router)
   ↓ ↓ ↓ (fan-out to 4-6 feature branches)
   Feature endpoints + logic nodes (10-12 nodes)
   ↓ ↓ ↓ (fan-in, converging)
   BOTTOM: main_db + shared services (multiple connections)
   
   COMPLEXITY: Generate 15-25 nodes total with 20-35 edges (high connectivity)
   
   Each node: { "id": string, "type": string, "data": { "label": string } }
   Each edge: { "id": string, "source": string, "target": string, "label": string }

3. FOR "databaseSchema" (Entity Relationship Diagram):
   - Every node MUST have type: "databaseSchema".
   - Every node's data MUST include a "columns" array.
   - Columns format: { "name": string, "type": string, "isPrimary": boolean }

4. FOR "fileStructure" (Project Folder Layout):
   - Generate a "fileStructure" array representing the recommended project folder layout.
   - Structure: Array of objects: { "name": string, "type": "folder" | "file", "description": string, "children"?: [] }
   - EVERY file and folder MUST have a "description" field explaining its purpose in THIS SPECIFIC app.
   - CONTENT RULES (CRITICAL):
     - Do NOT list every single file. Only list CRITICAL files.
     - Include: Key directories based on the chosen stack (e.g., src/components for React, app/routes for Django).
     - Include: Core config files relevant to the stack.
     - Include: Main pages and component names SPECIFIC to this app idea.
     - Do NOT include: node_modules, .git, lock files, generic boilerplate.
   - Keep it concise: 15-25 items maximum.

5. BACKEND SELECTION LOGIC (Choose the BEST tool for the job):
   Analyze the app requirements and select the most appropriate backend:
   
   - **AI/ML Heavy Apps** (image generation, NLP, data science): 
     → Prefer **Python (FastAPI or Django)** with PostgreSQL
   - **High Concurrency/Realtime** (chat, live updates, gaming):
     → Prefer **Node.js (Express/Fastify)** or **Go** with PostgreSQL/Redis
   - **Enterprise/Strict Typing** (healthcare, finance, compliance):
     → Prefer **Java (Spring Boot)** or **C# (.NET)** with SQL Server/PostgreSQL
   - **Rapid MVP/CRUD** (blogs, dashboards, simple SaaS):
     → Prefer **Supabase** or **Firebase** with Next.js/React
   - **E-commerce/Payments**:
     → Prefer **Node.js** or **Ruby on Rails** with PostgreSQL
   
   CONSTRAINT: You MUST explain WHY you chose this stack in the "summary" field.

6. INFRASTRUCTURE CONSTRAINTS (MVP-Focused, Anti-Complexity):
   - **NO ORCHESTRATION:** Do NOT suggest Kubernetes (K8s) or Docker Swarm for MVPs. 
     → Suggest simple PaaS hosting: Vercel, Railway, Render, Heroku, or Fly.io.
   - **NO PREMATURE OPTIMIZATION:** Avoid Redis, Kafka, or RabbitMQ UNLESS the app explicitly requires:
     → High-throughput queuing that a database cannot handle
     → Sub-millisecond caching for millions of requests
   - **DATABASE CHOICE:** Match the DB to the use case:
     → PostgreSQL: General purpose, relational data, complex queries
     → MongoDB: Unstructured data, document-heavy, flexible schemas
     → SQLite: Tiny apps, local-first, embedded
     → Supabase/Firebase: Rapid prototyping with built-in auth
   - **KEEP IT SIMPLE:** A 3-tier architecture (Client → API → DB) is sufficient for 90% of MVPs.

EXAMPLE OUTPUT (Interconnected Master Graph):
{
  "title": "App Name",
  "summary": "A [type] application using [Backend] for [reason]. Deployed on [PaaS] for simplicity.",
  "stack": ["React/Next.js", "Node.js/FastAPI/Spring Boot", "PostgreSQL/MongoDB", "Vercel/Railway"],
  "logicFlow": {
    "nodes": [
      { "id": "client_app", "type": "frontend", "data": { "label": "Web/Mobile Client" } },
      { "id": "api_gateway", "type": "backend", "data": { "label": "API Gateway" } },
      { "id": "main_db", "type": "database", "data": { "label": "Primary Database" } },
      
      { "id": "auth_service", "type": "service", "data": { "label": "Auth Service" } },
      { "id": "storage_service", "type": "service", "data": { "label": "Cloud Storage" } },
      
      { "id": "login_endpoint", "type": "backend", "data": { "label": "POST /auth/login" } },
      { "id": "validate_creds", "type": "logic", "data": { "label": "Validate Credentials" } },
      
      { "id": "upload_endpoint", "type": "backend", "data": { "label": "POST /files/upload" } },
      { "id": "validate_file", "type": "logic", "data": { "label": "Validate File" } },
      
      { "id": "posts_endpoint", "type": "backend", "data": { "label": "GET /posts" } },
      { "id": "cache_layer", "type": "logic", "data": { "label": "Redis Cache" } },
      
      { "id": "payment_endpoint", "type": "backend", "data": { "label": "POST /payments" } },
      { "id": "stripe_service", "type": "service", "data": { "label": "Stripe API" } }
    ],
    "edges": [
      { "id": "e1", "source": "client_app", "target": "api_gateway", "label": "requests" },
      
      { "id": "e2", "source": "api_gateway", "target": "login_endpoint", "label": "/auth" },
      { "id": "e3", "source": "api_gateway", "target": "upload_endpoint", "label": "/files" },
      { "id": "e4", "source": "api_gateway", "target": "posts_endpoint", "label": "/posts" },
      { "id": "e5", "source": "api_gateway", "target": "payment_endpoint", "label": "/payments" },
      
      { "id": "e6", "source": "login_endpoint", "target": "validate_creds" },
      { "id": "e7", "source": "validate_creds", "target": "auth_service", "label": "verify" },
      { "id": "e8", "source": "auth_service", "target": "main_db", "label": "query users" },
      
      { "id": "e9", "source": "upload_endpoint", "target": "validate_file" },
      { "id": "e10", "source": "validate_file", "target": "storage_service", "label": "store" },
      { "id": "e11", "source": "storage_service", "target": "main_db", "label": "save metadata" },
      
      { "id": "e12", "source": "posts_endpoint", "target": "cache_layer" },
      { "id": "e13", "source": "cache_layer", "target": "main_db", "label": "fetch" },
      
      { "id": "e14", "source": "payment_endpoint", "target": "stripe_service", "label": "charge" },
      { "id": "e15", "source": "stripe_service", "target": "main_db", "label": "record" }
    ]
  },
  "databaseSchema": {
    "nodes": [
      {
        "id": "users",
        "type": "databaseSchema",
        "data": {
          "label": "Users",
          "columns": [
            { "name": "id", "type": "uuid", "isPrimary": true },
            { "name": "email", "type": "varchar" },
            { "name": "name", "type": "text" },
            { "name": "created_at", "type": "timestamp" }
          ]
        }
      }
    ],
    "edges": []
  },
  "fileStructure": [
    { "name": "src", "type": "folder", "description": "Main source code directory containing all application code", "children": [
      { "name": "components", "type": "folder", "description": "Reusable UI components shared across pages", "children": [
        { "name": "Navbar.jsx", "type": "file", "description": "Top navigation bar with auth status and navigation links" },
        { "name": "AuthModal.jsx", "type": "file", "description": "Modal component handling user login and registration forms" }
      ]},
      { "name": "pages", "type": "folder", "description": "Top-level page components for each route", "children": [
        { "name": "Dashboard.jsx", "type": "file", "description": "Main dashboard showing user activity and key metrics" },
        { "name": "Profile.jsx", "type": "file", "description": "User profile page with settings and preferences" }
      ]},
      { "name": "lib", "type": "folder", "description": "Utility functions and service configurations", "children": [
        { "name": "api.js", "type": "file", "description": "API client configuration and helper functions for backend communication" }
      ]},
      { "name": "App.jsx", "type": "file", "description": "Root component with routing configuration and global providers" },
      { "name": "main.jsx", "type": "file", "description": "Application entry point that renders App into the DOM" }
    ]},
    { "name": "public", "type": "folder", "description": "Static assets served directly without processing", "children": [] },
    { "name": "package.json", "type": "file", "description": "Project dependencies and npm scripts configuration" },
    { "name": "vite.config.js", "type": "file", "description": "Vite bundler configuration for development and build" },
    { "name": "tailwind.config.js", "type": "file", "description": "Tailwind CSS theme customization and plugin setup" }
  ]
}

User Idea: ${prompt}`;

      const result = await model.generateContent(systemPrompt);
      const response = await result.response;
      const text = response.text();

      const cleanJson = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      const data = JSON.parse(cleanJson);

      setResult(data);
    } catch (error) {
      console.error("Gemini Error:", error);
      alert("Failed to generate. Try again!");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "flow", label: "System Architecture", icon: Layers },
    { id: "schema", label: "Database Schema", icon: Database },
  ];

  // Get current diagram data based on active tab
  // Returns saved positions if user has moved nodes, otherwise returns original data
  const getCurrentDiagram = () => {
    if (!result) return { nodes: [], edges: [] };

    if (activeTab === "flow") {
      // Return saved positions if they exist, otherwise original
      return savedFlowDiagram || result.logicFlow;
    } else {
      return savedSchemaDiagram || result.databaseSchema;
    }
  };

  // Callback to save diagram positions when user drags nodes
  const handleDiagramChange = (nodes, edges) => {
    if (activeTab === "flow") {
      setSavedFlowDiagram({ nodes, edges });
    } else {
      setSavedSchemaDiagram({ nodes, edges });
    }
  };

  // Check if we have saved positions for current tab (skip initial layout)
  const hasSavedPositions =
    activeTab === "flow" ? !!savedFlowDiagram : !!savedSchemaDiagram;

  // Theme-based classes
  const theme = {
    bg: isDarkMode ? "bg-black" : "bg-gray-50",
    text: isDarkMode ? "text-white" : "text-gray-900",
    textMuted: isDarkMode ? "text-gray-400" : "text-gray-600",
    textDimmed: isDarkMode ? "text-gray-500" : "text-gray-500",
    textSubtle: isDarkMode ? "text-gray-600" : "text-gray-500",
    textFaint: isDarkMode ? "text-gray-700" : "text-gray-400",
    iconMuted: isDarkMode ? "text-gray-600" : "text-gray-400",
    border: isDarkMode ? "border-gray-800" : "border-gray-400",
    headerBg: isDarkMode ? "bg-gray-950" : "bg-white",
    sidebarBg: isDarkMode ? "bg-gray-950" : "bg-white",
    inputBg: isDarkMode ? "bg-gray-900" : "bg-gray-100",
    inputBorder: isDarkMode ? "border-gray-800" : "border-gray-300",
    cardBg: isDarkMode ? "bg-gray-900" : "bg-gray-100",
    canvasBg: isDarkMode ? "bg-gray-900/30" : "bg-gray-100/50",
    tabActive: isDarkMode ? "bg-gray-900" : "bg-white",
    dotColor: isDarkMode ? "#333" : "#ccc",
  };

  const currentDiagram = getCurrentDiagram();
  const isSchemaTab = activeTab === "schema";
  const hasSchemaData = result?.databaseSchema?.nodes?.length > 0;

  return (
    <div
      className={`h-screen ${theme.bg} ${theme.text} flex flex-col overflow-hidden selection:bg-orange-500/30`}
    >
      {/* Top Header Bar */}
      <header
        className={`h-14 border-b ${theme.border} flex items-center px-4 gap-4 shrink-0 ${theme.headerBg}`}
      >
        {/* Logo */}
        <Link
          to="/"
          className={`flex items-center gap-2 ${theme.text} hover:text-orange-400 transition-colors`}
        >
          <Terminal className="w-5 h-5 text-orange-500" />
          <span className="font-space font-bold text-sm">CoderGenesis</span>
        </Link>

        <div
          className={`w-px h-6 ${isDarkMode ? "bg-gray-800" : "bg-gray-300"}`}
        />

        {/* Search-style Input */}
        <div className="flex-1 max-w-2xl flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your app idea... (e.g., Tinder for Dog Walkers)"
              className={`w-full ${theme.inputBg} border ${
                theme.inputBorder
              } rounded-lg px-4 py-2 text-sm ${
                theme.text
              } focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none font-inter ${
                isDarkMode
                  ? "placeholder:text-gray-600"
                  : "placeholder:text-gray-400"
              }`}
              onKeyDown={(e) => e.key === "Enter" && generateBlueprint()}
            />
          </div>
          <button
            onClick={generateBlueprint}
            disabled={loading || !prompt}
            className={`bg-orange-600 hover:bg-orange-500 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-all font-space text-sm shrink-0 ${
              loading || !prompt ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <Loader2 className="animate-spin w-4 h-4" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>

        <div className="flex-1" />

        {/* Theme Toggle */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`p-2 rounded-lg border transition-colors ${
            isDarkMode
              ? "bg-gray-900 border-gray-800 text-gray-400 hover:text-orange-400 hover:border-orange-500/50"
              : "bg-gray-100 border-gray-300 text-gray-600 hover:text-orange-500 hover:border-orange-400"
          }`}
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>

        {/* Status indicator */}
        <div
          className={`flex items-center gap-2 text-xs ${theme.textDimmed} font-mono`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              result
                ? "bg-green-500"
                : isDarkMode
                ? "bg-gray-600"
                : "bg-gray-400"
            }`}
          />
          {result ? "Blueprint Ready" : "Awaiting Input"}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Resize Overlay Shield - covers heavy components during drag */}
        {isAnyResizing && <div className="resize-overlay" />}

        {/* Left Sidebar - Project Manifest */}
        <aside
          className={`resizable-panel relative border-r ${theme.border} ${
            theme.sidebarBg
          } flex flex-col shrink-0 overflow-hidden ${
            isSidebarResizing ? "no-transition" : ""
          }`}
          style={{ width: sidebarCollapsed ? 0 : sidebarWidth }}
        >
          {/* Sidebar Header */}
          <div
            className={`h-10 border-b ${theme.border} flex items-center px-3 gap-2 text-xs font-mono ${theme.textDimmed} uppercase tracking-wider shrink-0`}
          >
            <Folder className="w-3.5 h-3.5" />
            <span className="flex-1">Project Manifest</span>
            <button
              onClick={() => setSidebarCollapsed(true)}
              className={`p-1 rounded transition-colors ${
                isDarkMode
                  ? "hover:bg-gray-800 text-gray-500 hover:text-gray-300"
                  : "hover:bg-gray-200 text-gray-400 hover:text-gray-600"
              }`}
              title="Hide sidebar"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </div>

          {/* Resize Handle - High Performance */}
          <div
            onMouseDown={startSidebarResize}
            className={`absolute right-0 top-0 bottom-0 w-2 cursor-col-resize z-20 group ${
              isSidebarResizing
                ? isDarkMode
                  ? "bg-orange-500"
                  : "bg-orange-400"
                : isDarkMode
                ? "hover:bg-orange-500/50"
                : "hover:bg-orange-400/50"
            } transition-colors`}
          >
            <div
              className={`absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity ${
                isDarkMode ? "text-gray-500" : "text-gray-400"
              }`}
            >
              <GripVertical className="w-3 h-3" />
            </div>
          </div>

          {/* Sidebar Content */}
          <div
            className={`flex-1 overflow-y-auto p-4 space-y-6 ${
              isDarkMode ? "custom-scrollbar" : "custom-scrollbar-light"
            }`}
          >
            {result ? (
              <>
                {/* Project Title */}
                <div className="space-y-2">
                  <div
                    className={`flex items-center gap-2 text-[10px] font-mono ${theme.textSubtle} uppercase tracking-wider`}
                  >
                    <FileJson className="w-3 h-3" />
                    Project Name
                  </div>
                  <h2 className={`text-xl font-bold ${theme.text} font-space`}>
                    {result.title}
                  </h2>
                </div>

                {/* Summary */}
                <div className="space-y-2">
                  <div
                    className={`flex items-center gap-2 text-[10px] font-mono ${theme.textSubtle} uppercase tracking-wider`}
                  >
                    <ChevronRight className="w-3 h-3" />
                    Description
                  </div>
                  <p
                    className={`text-sm ${theme.textMuted} font-inter leading-relaxed`}
                  >
                    {result.summary}
                  </p>
                </div>

                {/* Tech Stack */}
                <div className="space-y-3">
                  <div
                    className={`flex items-center gap-2 text-[10px] font-mono ${theme.textSubtle} uppercase tracking-wider`}
                  >
                    <Layers className="w-3 h-3" />
                    Tech Stack
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.stack.map((tech, i) => (
                      <span
                        key={i}
                        className={`px-2.5 py-1 ${theme.cardBg} text-orange-500 text-xs rounded border ${theme.border} font-mono hover:border-orange-500/50 transition-colors`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* File Structure */}
                <div className="space-y-2">
                  <div
                    className={`flex items-center gap-2 text-[10px] font-mono ${theme.textSubtle} uppercase tracking-wider`}
                  >
                    <Folder className="w-3 h-3" />
                    Recommended Structure
                  </div>
                  <div
                    className={`rounded-lg border ${theme.border} ${theme.cardBg} overflow-hidden`}
                  >
                    {result.fileStructure && result.fileStructure.length > 0 ? (
                      <FileTree
                        data={result.fileStructure}
                        isDarkMode={isDarkMode}
                        selectedFile={selectedFile}
                        onFileSelect={setSelectedFile}
                      />
                    ) : (
                      <div
                        className={`text-xs font-mono ${theme.textDimmed} italic px-3 py-4 text-center`}
                      >
                        Generating structure...
                      </div>
                    )}
                  </div>

                  {/* File Info Panel */}
                  {selectedFile && selectedFile.description && (
                    <div
                      className={`rounded-lg border ${theme.border} ${
                        isDarkMode ? "bg-gray-800/80" : "bg-gray-100"
                      } p-3 space-y-2`}
                    >
                      <div className="flex items-center gap-2">
                        {(() => {
                          const iconData = getFileIcon(
                            selectedFile.name,
                            selectedFile.type === "folder"
                          );
                          const IconComponent = iconData?.Icon;
                          return IconComponent ? (
                            <IconComponent
                              className="w-4 h-4 shrink-0"
                              style={{ color: iconData.color }}
                            />
                          ) : null;
                        })()}
                        <span
                          className={`text-sm font-mono font-semibold ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {selectedFile.name}
                        </span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded ${
                            isDarkMode
                              ? "bg-gray-700 text-gray-400"
                              : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          {selectedFile.type}
                        </span>
                      </div>
                      <p
                        className={`text-xs leading-relaxed ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {selectedFile.description}
                      </p>
                    </div>
                  )}
                </div>

                {/* Diagram Stats */}
                <div className={`pt-4 border-t ${theme.border} space-y-2`}>
                  <div
                    className={`text-[10px] font-mono ${theme.textSubtle} uppercase tracking-wider`}
                  >
                    Generated Artifacts
                  </div>
                  <div className={`space-y-1 text-xs ${theme.textDimmed}`}>
                    <div className="flex items-center gap-2">
                      <Layers className="w-3 h-3 text-orange-500" />
                      <span>
                        System Architecture (
                        {result.logicFlow?.nodes?.length || 0} components)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Database className="w-3 h-3 text-amber-500" />
                      <span>
                        DB Schema ({result.databaseSchema?.nodes?.length || 0}{" "}
                        tables)
                      </span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div
                  className={`w-16 h-16 rounded-2xl ${theme.cardBg} border ${theme.border} flex items-center justify-center mb-4`}
                >
                  <Terminal className={`w-8 h-8 ${theme.iconMuted}`} />
                </div>
                <p className={`${theme.textMuted} text-sm font-inter`}>
                  Enter an idea above to
                  <br />
                  generate your blueprint
                </p>
              </div>
            )}
          </div>
        </aside>

        {/* Sidebar Toggle Button (when collapsed) */}
        {sidebarCollapsed && (
          <button
            onClick={() => setSidebarCollapsed(false)}
            className={`shrink-0 flex items-center justify-center w-8 border-r transition-colors ${
              theme.border
            } ${
              isDarkMode
                ? "bg-gray-950 hover:bg-gray-900 text-gray-500 hover:text-orange-400"
                : "bg-white hover:bg-gray-100 text-gray-400 hover:text-orange-500"
            }`}
            title="Show sidebar"
          >
            <PanelLeftOpen className="w-4 h-4" />
          </button>
        )}

        {/* Right Panel - Canvas */}
        <main
          className={`flex-1 flex flex-col overflow-hidden ${theme.canvasBg}`}
        >
          {/* Canvas Tabs */}
          <div
            className={`h-10 border-b ${theme.border} flex items-center px-2 gap-1 shrink-0 ${theme.headerBg}`}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-mono rounded-t transition-colors ${
                  activeTab === tab.id
                    ? `${theme.tabActive} text-orange-500 border-t border-x ${theme.border} -mb-px`
                    : `${theme.textDimmed} hover:${theme.textMuted}`
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}

            {/* Spacer */}
            <div className="flex-1" />

            {/* Toggle Definitions Button (only show on schema tab with data) */}
            {isSchemaTab && hasSchemaData && (
              <button
                onClick={() => setShowDefinitions(!showDefinitions)}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-mono rounded transition-colors ${
                  showDefinitions
                    ? isDarkMode
                      ? "bg-orange-500/10 text-orange-400 border border-orange-500/30"
                      : "bg-orange-100 text-orange-600 border border-orange-300"
                    : isDarkMode
                    ? "text-gray-500 hover:text-gray-300 border border-transparent hover:border-gray-700"
                    : "text-gray-500 hover:text-gray-700 border border-transparent hover:border-gray-300"
                }`}
                title={
                  showDefinitions ? "Hide Definitions" : "Show Definitions"
                }
              >
                <Code className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Definitions</span>
                {showDefinitions ? (
                  <PanelRightClose className="w-3.5 h-3.5" />
                ) : (
                  <PanelRightOpen className="w-3.5 h-3.5" />
                )}
              </button>
            )}
          </div>

          {/* Canvas Content */}
          <div
            ref={canvasContainerRef}
            className="flex-1 relative overflow-hidden flex"
          >
            {result && currentDiagram.nodes?.length > 0 ? (
              <>
                {/* Diagram Panel */}
                <div
                  className={`resizable-panel h-full ${
                    isDefinitionsResizing ? "no-transition" : ""
                  }`}
                  style={{
                    width:
                      isSchemaTab && showDefinitions
                        ? `${100 - definitionsWidth}%`
                        : "100%",
                  }}
                >
                  <ArchitectureDiagram
                    key={activeTab}
                    initialNodes={currentDiagram.nodes}
                    initialEdges={currentDiagram.edges}
                    isDarkMode={isDarkMode}
                    diagramType={activeTab === "schema" ? "schema" : "flow"}
                    onDiagramChange={handleDiagramChange}
                    skipInitialLayout={hasSavedPositions}
                  />
                </div>

                {/* Schema Definitions Panel (only visible on schema tab) */}
                {isSchemaTab && showDefinitions && (
                  <div
                    className={`resizable-panel relative h-full border-l ${
                      theme.border
                    } ${isDefinitionsResizing ? "no-transition" : ""}`}
                    style={{ width: `${definitionsWidth}%` }}
                  >
                    {/* Resize Handle - High Performance */}
                    <div
                      onMouseDown={startDefinitionsResize}
                      className={`absolute left-0 top-0 bottom-0 w-2 cursor-col-resize z-20 group ${
                        isDefinitionsResizing
                          ? isDarkMode
                            ? "bg-orange-500"
                            : "bg-orange-400"
                          : isDarkMode
                          ? "hover:bg-orange-500/50"
                          : "hover:bg-orange-400/50"
                      } transition-colors`}
                    >
                      <div
                        className={`absolute left-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity ${
                          isDarkMode ? "text-gray-500" : "text-gray-400"
                        }`}
                      >
                        <GripVertical className="w-3 h-3" />
                      </div>
                    </div>
                    <SchemaDefinitions
                      nodes={result.databaseSchema?.nodes || []}
                      isDarkMode={isDarkMode}
                    />
                  </div>
                )}

                {/* Logic Flow Info Panel (when definitions hidden or on flow tab) */}
                {!isSchemaTab && (
                  <div className="hidden">
                    {/* Placeholder for future logic flow details panel */}
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: `radial-gradient(${theme.dotColor} 1px, transparent 1px)`,
                    backgroundSize: "20px 20px",
                  }}
                />
                <div className="relative text-center space-y-4">
                  <div
                    className={`w-24 h-24 rounded-2xl ${
                      isDarkMode ? "bg-gray-900/50" : "bg-white/80"
                    } border ${
                      theme.border
                    } flex items-center justify-center mx-auto`}
                  >
                    <Sparkles className={`w-10 h-10 ${theme.iconMuted}`} />
                  </div>
                  <div>
                    <p className={`${theme.textDimmed} font-space text-lg`}>
                      The Canvas
                    </p>
                    <p className={`${theme.textMuted} text-sm font-inter`}>
                      Your diagrams will appear here
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Playground;
