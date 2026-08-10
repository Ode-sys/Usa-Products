"use client";

import React from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  badge?: { label: string; color: string };
}

export function PageHeader({ title, description, action, badge }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
          {badge && (
            <span
              className="px-2 py-0.5 text-xs font-semibold rounded-full text-white"
              style={{ backgroundColor: badge.color }}
            >
              {badge.label}
            </span>
          )}
        </div>
        {description && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
