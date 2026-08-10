"use client";

import React from "react";

interface ModuleCardProps {
  name: string;
  description: string;
  color: string;
  icon: string;
  active: boolean;
  href?: string;
  onActivate?: () => void;
}

export function ModuleCard({ name, description, color, icon, active, href, onActivate }: ModuleCardProps) {
  const content = (
    <div
      className={`relative border rounded-xl p-5 transition-all ${
        active
          ? "border-transparent shadow-md cursor-pointer hover:shadow-lg hover:-translate-y-0.5"
          : "border-gray-200 dark:border-gray-700 opacity-70"
      }`}
      style={active ? { borderColor: color, background: `${color}08` } : {}}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
          style={{ backgroundColor: active ? color : "#9ca3af" }}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900 dark:text-white">{name}</h3>
            {active ? (
              <span className="text-xs px-1.5 py-0.5 rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                نشط
              </span>
            ) : (
              <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 dark:bg-gray-800">
                غير نشط
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{description}</p>
        </div>
      </div>
      {!active && onActivate && (
        <button
          onClick={onActivate}
          className="mt-3 w-full text-xs py-1.5 rounded-lg border border-dashed border-gray-300 text-gray-500 hover:border-purple-400 hover:text-purple-600 transition-colors"
        >
          تفعيل الوحدة
        </button>
      )}
    </div>
  );

  if (active && href) {
    return <a href={href}>{content}</a>;
  }
  return content;
}
