import React, { useRef, useCallback } from "react";
import {
  Lightbulb,
  CheckCircle2,
  Users,
  DollarSign,
  TrendingUp,
  Quote,
  Rocket,
  User,
  FileText,
  Shield,
  Zap,
  Target,
  AlertCircle,
  ChevronRight,
  BarChart3,
} from "lucide-react";

const ProjectManifest = ({ data, isDarkMode }) => {
  const containerRef = useRef(null);

  // Smooth scroll to section
  const scrollToSection = useCallback((sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  // Navigation items
  const navItems = [
    { id: "section-summary", label: "Summary" },
    { id: "section-personas", label: "Personas" },
    { id: "section-requirements", label: "Requirements" },
    { id: "section-nfr", label: "NFRs" },
    { id: "section-pricing", label: "Pricing" },
    { id: "section-market", label: "Market" },
  ];

  // Priority badge colors
  const getPriorityColor = (priority) => {
    const p = priority?.toLowerCase();
    if (p === "high")
      return isDarkMode
        ? "bg-red-500/20 text-red-400 border-red-500/30"
        : "bg-red-100 text-red-600 border-red-200";
    if (p === "medium")
      return isDarkMode
        ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
        : "bg-yellow-100 text-yellow-600 border-yellow-200";
    return isDarkMode
      ? "bg-green-500/20 text-green-400 border-green-500/30"
      : "bg-green-100 text-green-600 border-green-200";
  };

  if (!data) {
    return (
      <div
        className={`h-full flex items-center justify-center ${
          isDarkMode ? "text-gray-500" : "text-gray-400"
        }`}
      >
        <div className="text-center">
          <Rocket className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p
            className="text-sm"
            style={{ fontFamily: "Inter, system-ui, sans-serif" }}
          >
            No project breakdown available
          </p>
          <p className="text-xs mt-1 opacity-60">
            Generate a blueprint to see the PRD
          </p>
        </div>
      </div>
    );
  }

  // Parse executive summary paragraphs
  const summaryParagraphs = data.executiveSummary
    ?.split(/\\n\\n|\n\n/)
    .filter(Boolean) || [data.executiveSummary];

  return (
    <div
      ref={containerRef}
      className={`h-full overflow-auto ${
        isDarkMode ? "bg-[#0B1120]" : "bg-gray-50"
      }`}
    >
      {/* Sticky Table of Contents */}
      <div
        className={`sticky top-0 z-10 backdrop-blur-md ${
          isDarkMode
            ? "bg-[#0B1120]/90 border-b border-gray-800"
            : "bg-gray-50/90 border-b border-gray-200"
        }`}
      >
        <div className="max-w-4xl mx-auto px-6 py-3">
          <nav className="flex items-center gap-1 overflow-x-auto">
            <FileText
              className={`w-4 h-4 mr-2 shrink-0 ${
                isDarkMode ? "text-gray-600" : "text-gray-400"
              }`}
            />
            {navItems.map((item, idx) => (
              <React.Fragment key={item.id}>
                <button
                  onClick={() => scrollToSection(item.id)}
                  className={`text-xs font-mono uppercase tracking-wider px-2 py-1 rounded transition-colors whitespace-nowrap ${
                    isDarkMode
                      ? "text-gray-500 hover:text-orange-400 hover:bg-gray-800/50"
                      : "text-gray-400 hover:text-orange-500 hover:bg-gray-200/50"
                  }`}
                >
                  {item.label}
                </button>
                {idx < navItems.length - 1 && (
                  <span
                    className={`text-xs ${
                      isDarkMode ? "text-gray-700" : "text-gray-300"
                    }`}
                  >
                    /
                  </span>
                )}
              </React.Fragment>
            ))}
          </nav>
        </div>
      </div>

      {/* Document Content */}
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-12">
        {/* A. Executive Summary */}
        <section id="section-summary">
          <div
            className={`relative rounded-lg overflow-hidden ${
              isDarkMode
                ? "bg-gray-800/50 border-l-4 border-orange-500"
                : "bg-orange-50 border-l-4 border-orange-400"
            }`}
          >
            <div className="p-6">
              <div className="flex items-start gap-4">
                <Lightbulb
                  className={`w-5 h-5 shrink-0 mt-1 ${
                    isDarkMode ? "text-orange-500" : "text-orange-500"
                  }`}
                />
                <div className="space-y-4">
                  {summaryParagraphs.map((para, idx) => (
                    <p
                      key={idx}
                      className={`text-sm leading-relaxed ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                      style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                    >
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* B. User Personas */}
        {data.userPersonas && data.userPersonas.length > 0 && (
          <section id="section-personas">
            <h2
              className={`text-sm font-semibold uppercase tracking-wider mb-6 flex items-center gap-2 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
              style={{ fontFamily: "Inter, system-ui, sans-serif" }}
            >
              <Users
                className={`w-4 h-4 ${
                  isDarkMode ? "text-gray-500" : "text-gray-400"
                }`}
              />
              User Personas
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.userPersonas.map((persona, idx) => (
                <div
                  key={idx}
                  className={`p-5 rounded-lg border ${
                    isDarkMode
                      ? "bg-gray-900/50 border-gray-800"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`p-2 rounded-lg ${
                        isDarkMode ? "bg-cyan-500/20" : "bg-cyan-100"
                      }`}
                    >
                      <User
                        className={`w-4 h-4 ${
                          isDarkMode ? "text-cyan-400" : "text-cyan-600"
                        }`}
                      />
                    </div>
                    <h3
                      className={`font-semibold text-sm ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                      style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                    >
                      {persona.role}
                    </h3>
                  </div>

                  {/* Pain Points */}
                  <div className="mb-4">
                    <p
                      className={`text-xs font-mono uppercase tracking-wider mb-2 ${
                        isDarkMode ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      Pain Points
                    </p>
                    <ul className="space-y-1.5">
                      {persona.painPoints?.map((pain, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-2">
                          <AlertCircle
                            className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                              isDarkMode ? "text-red-400/60" : "text-red-400"
                            }`}
                          />
                          <span
                            className={`text-xs ${
                              isDarkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                            style={{
                              fontFamily: "Inter, system-ui, sans-serif",
                            }}
                          >
                            {pain}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Motivation */}
                  {persona.motivation && (
                    <div
                      className={`pt-3 border-t ${
                        isDarkMode ? "border-gray-800" : "border-gray-100"
                      }`}
                    >
                      <p
                        className={`text-xs font-mono uppercase tracking-wider mb-1 ${
                          isDarkMode ? "text-gray-500" : "text-gray-400"
                        }`}
                      >
                        Motivation
                      </p>
                      <p
                        className={`text-xs ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                        style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                      >
                        {persona.motivation}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* C. Functional Requirements */}
        {data.functionalRequirements &&
          data.functionalRequirements.length > 0 && (
            <section id="section-requirements">
              <h2
                className={`text-sm font-semibold uppercase tracking-wider mb-6 flex items-center gap-2 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                <Zap
                  className={`w-4 h-4 ${
                    isDarkMode ? "text-gray-500" : "text-gray-400"
                  }`}
                />
                Functional Requirements
              </h2>

              <div className="space-y-4">
                {data.functionalRequirements.map((req, idx) => (
                  <div
                    key={idx}
                    className={`p-5 rounded-lg border ${
                      isDarkMode
                        ? "bg-gray-900/30 border-gray-800"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-xs font-mono px-2 py-0.5 rounded ${
                            isDarkMode
                              ? "bg-gray-800 text-gray-400"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {req.id}
                        </span>
                        <h3
                          className={`font-semibold text-sm ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                          style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                        >
                          {req.feature}
                        </h3>
                      </div>
                      <span
                        className={`text-xs font-mono px-2 py-0.5 rounded border ${getPriorityColor(
                          req.priority
                        )}`}
                      >
                        {req.priority}
                      </span>
                    </div>

                    {/* User Story */}
                    {req.userStory && (
                      <div
                        className={`mb-4 p-3 rounded border-l-2 ${
                          isDarkMode
                            ? "bg-gray-800/50 border-purple-500/50"
                            : "bg-purple-50 border-purple-400"
                        }`}
                      >
                        <p
                          className={`text-xs italic ${
                            isDarkMode ? "text-gray-300" : "text-gray-600"
                          }`}
                          style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                        >
                          {req.userStory}
                        </p>
                      </div>
                    )}

                    {/* Acceptance Criteria */}
                    {req.acceptanceCriteria &&
                      req.acceptanceCriteria.length > 0 && (
                        <div>
                          <p
                            className={`text-xs font-mono uppercase tracking-wider mb-2 ${
                              isDarkMode ? "text-gray-500" : "text-gray-400"
                            }`}
                          >
                            Acceptance Criteria
                          </p>
                          <ul className="space-y-1.5">
                            {req.acceptanceCriteria.map((criteria, cIdx) => (
                              <li
                                key={cIdx}
                                className="flex items-start gap-2"
                              >
                                <CheckCircle2
                                  className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                                    isDarkMode
                                      ? "text-green-500/60"
                                      : "text-green-500"
                                  }`}
                                />
                                <span
                                  className={`text-xs ${
                                    isDarkMode ? "text-gray-400" : "text-gray-600"
                                  }`}
                                  style={{
                                    fontFamily: "Inter, system-ui, sans-serif",
                                  }}
                                >
                                  {criteria}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </div>
                ))}
              </div>
            </section>
          )}

        {/* D. Non-Functional Requirements */}
        {data.nonFunctionalRequirements &&
          data.nonFunctionalRequirements.length > 0 && (
            <section id="section-nfr">
              <h2
                className={`text-sm font-semibold uppercase tracking-wider mb-6 flex items-center gap-2 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                <Shield
                  className={`w-4 h-4 ${
                    isDarkMode ? "text-gray-500" : "text-gray-400"
                  }`}
                />
                Non-Functional Requirements
              </h2>

              <div
                className={`rounded-lg border overflow-hidden ${
                  isDarkMode ? "border-gray-800" : "border-gray-200"
                }`}
              >
                {data.nonFunctionalRequirements.map((nfr, idx) => (
                  <div
                    key={idx}
                    className={`px-4 py-3 flex items-start gap-3 ${
                      idx !== data.nonFunctionalRequirements.length - 1
                        ? isDarkMode
                          ? "border-b border-gray-800"
                          : "border-b border-gray-100"
                        : ""
                    } ${isDarkMode ? "bg-gray-900/30" : "bg-white"}`}
                  >
                    <ChevronRight
                      className={`w-4 h-4 shrink-0 mt-0.5 ${
                        isDarkMode ? "text-gray-600" : "text-gray-400"
                      }`}
                    />
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                      style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                    >
                      {nfr}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

        {/* E. Monetization Strategy */}
        {data.monetizationStrategy && (
          <section id="section-pricing">
            <h2
              className={`text-sm font-semibold uppercase tracking-wider mb-6 flex items-center gap-2 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
              style={{ fontFamily: "Inter, system-ui, sans-serif" }}
            >
              <DollarSign
                className={`w-4 h-4 ${
                  isDarkMode ? "text-gray-500" : "text-gray-400"
                }`}
              />
              Monetization Strategy
            </h2>

            {/* Business Model */}
            {data.monetizationStrategy.model && (
              <div
                className={`mb-6 p-4 rounded-lg ${
                  isDarkMode ? "bg-gray-800/50" : "bg-gray-100"
                }`}
              >
                <p
                  className={`text-xs font-mono uppercase tracking-wider mb-1 ${
                    isDarkMode ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  Business Model
                </p>
                <p
                  className={`text-sm font-medium ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                  style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                >
                  {data.monetizationStrategy.model}
                </p>
              </div>
            )}

            {/* Pricing Tiers */}
            {data.monetizationStrategy.pricingTiers &&
              data.monetizationStrategy.pricingTiers.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {data.monetizationStrategy.pricingTiers.map((tier, idx) => (
                    <div
                      key={idx}
                      className={`p-5 rounded-lg border ${
                        idx === 1
                          ? isDarkMode
                            ? "bg-orange-500/10 border-orange-500/30"
                            : "bg-orange-50 border-orange-200"
                          : isDarkMode
                          ? "bg-gray-900/50 border-gray-800"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <h3
                        className={`font-semibold text-sm mb-1 ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                        style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                      >
                        {tier.name}
                      </h3>
                      <p
                        className={`text-2xl font-bold mb-3 ${
                          isDarkMode ? "text-orange-400" : "text-orange-500"
                        }`}
                        style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                      >
                        {tier.price}
                      </p>
                      {tier.limits && (
                        <p
                          className={`text-xs mb-3 ${
                            isDarkMode ? "text-gray-500" : "text-gray-400"
                          }`}
                          style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                        >
                          {tier.limits}
                        </p>
                      )}
                      <ul className="space-y-1.5">
                        {tier.features?.map((feature, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-2">
                            <CheckCircle2
                              className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                                isDarkMode
                                  ? "text-green-500/60"
                                  : "text-green-500"
                              }`}
                            />
                            <span
                              className={`text-xs ${
                                isDarkMode ? "text-gray-400" : "text-gray-600"
                              }`}
                              style={{
                                fontFamily: "Inter, system-ui, sans-serif",
                              }}
                            >
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

            {/* Revenue Projection */}
            {data.monetizationStrategy.revenueProjection && (
              <div
                className={`p-4 rounded-lg border-l-2 ${
                  isDarkMode
                    ? "bg-green-500/10 border-green-500/50"
                    : "bg-green-50 border-green-400"
                }`}
              >
                <p
                  className={`text-xs font-mono uppercase tracking-wider mb-1 ${
                    isDarkMode ? "text-green-400/60" : "text-green-600"
                  }`}
                >
                  Revenue Projection
                </p>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                  style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                >
                  {data.monetizationStrategy.revenueProjection}
                </p>
              </div>
            )}
          </section>
        )}

        {/* F. Market Analysis */}
        {data.marketAnalysis && (
          <section id="section-market">
            <h2
              className={`text-sm font-semibold uppercase tracking-wider mb-6 flex items-center gap-2 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
              style={{ fontFamily: "Inter, system-ui, sans-serif" }}
            >
              <BarChart3
                className={`w-4 h-4 ${
                  isDarkMode ? "text-gray-500" : "text-gray-400"
                }`}
              />
              Market Analysis
            </h2>

            {/* Competitors */}
            {data.marketAnalysis.competitors &&
              data.marketAnalysis.competitors.length > 0 && (
                <div className="mb-6">
                  <p
                    className={`text-xs font-mono uppercase tracking-wider mb-3 ${
                      isDarkMode ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    Competitive Landscape
                  </p>
                  <div className="space-y-3">
                    {data.marketAnalysis.competitors.map((comp, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-lg border ${
                          isDarkMode
                            ? "bg-gray-900/30 border-gray-800"
                            : "bg-white border-gray-200"
                        }`}
                      >
                        <h4
                          className={`font-semibold text-sm mb-2 ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                          style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                        >
                          {typeof comp === "string" ? comp : comp.name}
                        </h4>
                        {typeof comp === "object" && (
                          <div className="grid grid-cols-2 gap-4">
                            {comp.strengths && (
                              <div>
                                <p
                                  className={`text-xs font-mono uppercase tracking-wider mb-1 ${
                                    isDarkMode
                                      ? "text-green-400/60"
                                      : "text-green-600"
                                  }`}
                                >
                                  Strengths
                                </p>
                                <p
                                  className={`text-xs ${
                                    isDarkMode
                                      ? "text-gray-400"
                                      : "text-gray-600"
                                  }`}
                                  style={{
                                    fontFamily: "Inter, system-ui, sans-serif",
                                  }}
                                >
                                  {comp.strengths}
                                </p>
                              </div>
                            )}
                            {comp.weaknesses && (
                              <div>
                                <p
                                  className={`text-xs font-mono uppercase tracking-wider mb-1 ${
                                    isDarkMode
                                      ? "text-red-400/60"
                                      : "text-red-600"
                                  }`}
                                >
                                  Weaknesses
                                </p>
                                <p
                                  className={`text-xs ${
                                    isDarkMode
                                      ? "text-gray-400"
                                      : "text-gray-600"
                                  }`}
                                  style={{
                                    fontFamily: "Inter, system-ui, sans-serif",
                                  }}
                                >
                                  {comp.weaknesses}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Differentiation */}
            {data.marketAnalysis.differentiation && (
              <div
                className={`relative pl-6 ${
                  isDarkMode
                    ? "border-l-2 border-orange-500/50"
                    : "border-l-2 border-orange-400"
                }`}
              >
                <Target
                  className={`absolute -left-3 top-0 w-5 h-5 ${
                    isDarkMode
                      ? "text-orange-500 bg-[#0B1120]"
                      : "text-orange-500 bg-gray-50"
                  }`}
                />
                <p
                  className={`text-xs font-mono uppercase tracking-wider mb-2 ${
                    isDarkMode ? "text-orange-400/60" : "text-orange-600"
                  }`}
                >
                  Our Differentiation
                </p>
                <p
                  className={`text-sm leading-relaxed ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                  style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                >
                  {data.marketAnalysis.differentiation}
                </p>
              </div>
            )}
          </section>
        )}

        {/* Legacy support for old format */}
        {!data.userPersonas && data.targetAudience && (
          <section id="section-personas">
            <h2
              className={`text-sm font-semibold uppercase tracking-wider mb-6 flex items-center gap-2 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
              style={{ fontFamily: "Inter, system-ui, sans-serif" }}
            >
              <Users
                className={`w-4 h-4 ${
                  isDarkMode ? "text-gray-500" : "text-gray-400"
                }`}
              />
              Target Audience
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.targetAudience.map((audience, idx) => (
                <span
                  key={idx}
                  className={`inline-flex items-center px-3 py-1.5 rounded text-sm ${
                    isDarkMode
                      ? "bg-gray-900 border border-gray-700 text-gray-300"
                      : "bg-white border border-gray-200 text-gray-600"
                  }`}
                  style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                >
                  {audience}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Legacy: Old monetization format */}
        {!data.monetizationStrategy && data.monetization && (
          <section id="section-pricing">
            <h2
              className={`text-sm font-semibold uppercase tracking-wider mb-6 flex items-center gap-2 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
              style={{ fontFamily: "Inter, system-ui, sans-serif" }}
            >
              <DollarSign
                className={`w-4 h-4 ${
                  isDarkMode ? "text-gray-500" : "text-gray-400"
                }`}
              />
              Monetization
            </h2>
            <ul className="space-y-3">
              {data.monetization.map((strategy, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span
                    className={`text-xs font-mono mt-0.5 ${
                      isDarkMode ? "text-gray-600" : "text-gray-400"
                    }`}
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <p
                    className={`leading-relaxed text-sm ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                    style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                  >
                    {strategy}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Legacy: Market Gap */}
        {!data.marketAnalysis && data.marketGap && (
          <section id="section-market">
            <h2
              className={`text-sm font-semibold uppercase tracking-wider mb-6 flex items-center gap-2 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
              style={{ fontFamily: "Inter, system-ui, sans-serif" }}
            >
              <TrendingUp
                className={`w-4 h-4 ${
                  isDarkMode ? "text-gray-500" : "text-gray-400"
                }`}
              />
              Competitive Advantage
            </h2>
            <div
              className={`relative pl-6 ${
                isDarkMode
                  ? "border-l-2 border-gray-700"
                  : "border-l-2 border-gray-300"
              }`}
            >
              <Quote
                className={`absolute -left-3 top-0 w-5 h-5 ${
                  isDarkMode
                    ? "text-gray-700 bg-[#0B1120]"
                    : "text-gray-300 bg-gray-50"
                }`}
              />
              <p
                className={`text-sm leading-relaxed ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                {data.marketGap}
              </p>
            </div>
          </section>
        )}

        {/* Footer Divider */}
        <div
          className={`pt-8 border-t ${
            isDarkMode ? "border-gray-800" : "border-gray-200"
          }`}
        >
          <p
            className={`text-xs font-mono text-center uppercase tracking-widest ${
              isDarkMode ? "text-gray-700" : "text-gray-400"
            }`}
          >
            Product Requirements Document
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectManifest;
