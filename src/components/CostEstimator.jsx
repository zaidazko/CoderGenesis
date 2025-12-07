import React from "react";
import {
  DollarSign,
  Zap,
  Rocket,
  TrendingUp,
  Server,
  Database,
  Cloud,
  Shield,
  CreditCard,
  Info,
} from "lucide-react";

// Map service names to icons
const getServiceIcon = (serviceName) => {
  const name = serviceName.toLowerCase();
  if (name.includes("vercel") || name.includes("hosting") || name.includes("railway") || name.includes("render"))
    return Server;
  if (name.includes("supabase") || name.includes("database") || name.includes("postgres") || name.includes("firebase"))
    return Database;
  if (name.includes("storage") || name.includes("s3") || name.includes("cdn") || name.includes("cloudflare"))
    return Cloud;
  if (name.includes("auth") || name.includes("security"))
    return Shield;
  if (name.includes("stripe") || name.includes("payment"))
    return CreditCard;
  if (name.includes("openai") || name.includes("api") || name.includes("ai"))
    return Zap;
  return Server;
};

// Get card styling based on scale tier
const getCardStyle = (index, isDarkMode) => {
  const styles = [
    // MVP - Slate/Gray (Low intensity)
    {
      border: isDarkMode ? "border-slate-600" : "border-slate-300",
      gradient: isDarkMode
        ? "from-slate-900/50 to-slate-800/30"
        : "from-slate-50 to-slate-100",
      headerBg: isDarkMode ? "bg-slate-800/50" : "bg-slate-100",
      headerText: isDarkMode ? "text-slate-300" : "text-slate-700",
      totalColor: isDarkMode ? "text-slate-200" : "text-slate-800",
      badge: isDarkMode
        ? "bg-slate-700 text-slate-300"
        : "bg-slate-200 text-slate-600",
      icon: Zap,
      iconColor: isDarkMode ? "text-slate-400" : "text-slate-500",
    },
    // Growth - Blue/Cyan (Medium intensity)
    {
      border: isDarkMode ? "border-cyan-500/60" : "border-cyan-400",
      gradient: isDarkMode
        ? "from-cyan-950/50 to-blue-950/30"
        : "from-cyan-50 to-blue-50",
      headerBg: isDarkMode ? "bg-cyan-900/40" : "bg-cyan-100",
      headerText: isDarkMode ? "text-cyan-300" : "text-cyan-700",
      totalColor: isDarkMode ? "text-cyan-200" : "text-cyan-700",
      badge: isDarkMode
        ? "bg-cyan-800/60 text-cyan-300"
        : "bg-cyan-200 text-cyan-700",
      icon: Rocket,
      iconColor: isDarkMode ? "text-cyan-400" : "text-cyan-500",
    },
    // Scale - Orange/Amber (High intensity)
    {
      border: isDarkMode ? "border-orange-500/60" : "border-orange-400",
      gradient: isDarkMode
        ? "from-orange-950/50 to-amber-950/30"
        : "from-orange-50 to-amber-50",
      headerBg: isDarkMode ? "bg-orange-900/40" : "bg-orange-100",
      headerText: isDarkMode ? "text-orange-300" : "text-orange-700",
      totalColor: isDarkMode ? "text-orange-200" : "text-orange-700",
      badge: isDarkMode
        ? "bg-orange-800/60 text-orange-300"
        : "bg-orange-200 text-orange-700",
      icon: TrendingUp,
      iconColor: isDarkMode ? "text-orange-400" : "text-orange-500",
    },
  ];
  return styles[index] || styles[0];
};

const CostEstimator = ({ data, isDarkMode }) => {
  if (!data || data.length === 0) {
    return (
      <div
        className={`h-full flex items-center justify-center ${
          isDarkMode ? "text-gray-500" : "text-gray-400"
        }`}
      >
        <div className="text-center">
          <DollarSign className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm font-mono">No cost analysis available</p>
          <p className="text-xs mt-1 opacity-60">
            Generate a blueprint to see cost estimates
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`h-full overflow-auto p-6 ${
        isDarkMode ? "bg-[#0B1120]" : "bg-gray-50"
      }`}
    >
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div
            className={`p-2 rounded-lg ${
              isDarkMode ? "bg-orange-500/20" : "bg-orange-100"
            }`}
          >
            <DollarSign
              className={`w-5 h-5 ${
                isDarkMode ? "text-orange-400" : "text-orange-600"
              }`}
            />
          </div>
          <h2
            className={`text-lg font-semibold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Monthly Cost Estimation
          </h2>
        </div>
        <p
          className={`text-sm ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Estimated infrastructure costs at different user scales
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {data.map((tier, index) => {
          const style = getCardStyle(index, isDarkMode);
          const IconComponent = style.icon;

          return (
            <div
              key={tier.scale}
              className={`relative rounded-xl border-2 ${style.border} bg-gradient-to-br ${style.gradient} overflow-hidden transition-all duration-200 hover:scale-[1.02] hover:shadow-lg`}
            >
              {/* Card Header */}
              <div className={`px-4 py-4 ${style.headerBg}`}>
                <div className="flex items-center gap-2 mb-2">
                  <IconComponent className={`w-4 h-4 ${style.iconColor}`} />
                  <span
                    className={`text-xs font-mono uppercase tracking-wider ${style.headerText}`}
                  >
                    {tier.scale.split("(")[0].trim()}
                  </span>
                </div>

                {/* Scale Badge */}
                <div
                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono ${style.badge}`}
                >
                  {tier.scale.match(/\(([^)]+)\)/)?.[1] || ""}
                </div>

                {/* Total Cost */}
                <div className="mt-3">
                  <span
                    className={`text-3xl font-bold font-mono ${style.totalColor}`}
                  >
                    {tier.total}
                  </span>
                  <span
                    className={`text-sm ml-1 ${
                      isDarkMode ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    /month
                  </span>
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="px-4 py-4">
                <div className="space-y-3">
                  {tier.breakdown?.map((item, idx) => {
                    const ServiceIcon = getServiceIcon(item.service);
                    return (
                      <div key={idx} className="group">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <ServiceIcon
                              className={`w-3.5 h-3.5 ${
                                isDarkMode ? "text-gray-500" : "text-gray-400"
                              }`}
                            />
                            <span
                              className={`text-sm font-medium ${
                                isDarkMode ? "text-gray-300" : "text-gray-700"
                              }`}
                            >
                              {item.service}
                            </span>
                          </div>
                          <span
                            className={`text-sm font-mono font-semibold ${
                              item.cost === "$0"
                                ? isDarkMode
                                  ? "text-green-400"
                                  : "text-green-600"
                                : isDarkMode
                                ? "text-gray-200"
                                : "text-gray-800"
                            }`}
                          >
                            {item.cost}
                          </span>
                        </div>
                        {/* Note tooltip */}
                        {item.note && (
                          <div
                            className={`mt-1 ml-5 text-xs ${
                              isDarkMode ? "text-gray-500" : "text-gray-400"
                            } flex items-start gap-1`}
                          >
                            <Info className="w-3 h-3 mt-0.5 shrink-0 opacity-60" />
                            <span>{item.note}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Visual indicator bar at bottom */}
              <div
                className={`h-1 ${
                  index === 0
                    ? isDarkMode
                      ? "bg-slate-600"
                      : "bg-slate-300"
                    : index === 1
                    ? isDarkMode
                      ? "bg-cyan-500"
                      : "bg-cyan-400"
                    : isDarkMode
                    ? "bg-orange-500"
                    : "bg-orange-400"
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* Footer Note */}
      <div
        className={`mt-6 p-4 rounded-lg border ${
          isDarkMode
            ? "bg-gray-900/50 border-gray-800 text-gray-400"
            : "bg-gray-100 border-gray-200 text-gray-500"
        }`}
      >
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 mt-0.5 shrink-0" />
          <div className="text-xs">
            <p className="font-medium mb-1">Estimates are approximate</p>
            <p>
              Actual costs vary based on usage patterns, region, and provider
              pricing changes. Always verify with official pricing pages before
              making decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostEstimator;

