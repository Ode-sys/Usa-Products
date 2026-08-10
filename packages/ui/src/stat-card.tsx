"use client";

import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: { value: number; label: string };
  color?: string;
}

export function StatCard({ title, value, subtitle, icon, trend, color = "#8b5cf6" }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
        {icon && (
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg flex-shrink-0"
            style={{ backgroundColor: color }}
          >
            {icon}
          </div>
        )}
      </div>
      {trend && (
        <div className={`text-xs font-medium ${trend.value >= 0 ? "text-green-600" : "text-red-500"}`}>
          {trend.value >= 0 ? "↑" : "↓"} {Math.abs(trend.value)}% {trend.label}
        </div>
      )}
    </div>
  );
}
