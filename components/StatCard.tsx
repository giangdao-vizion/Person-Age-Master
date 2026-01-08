
import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon?: React.ReactNode;
  colorClass?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, subValue, icon, colorClass = "bg-slate-800" }) => {
  return (
    <div className={`${colorClass} p-6 rounded-2xl border border-slate-700/50 shadow-xl hover:scale-[1.02] transition-transform duration-300`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-slate-400 text-sm font-medium uppercase tracking-wider">{label}</span>
        {icon && <div className="text-indigo-400 opacity-80">{icon}</div>}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-bold text-white tracking-tight">{value}</span>
        {subValue && <span className="text-indigo-300 text-lg font-semibold">{subValue}</span>}
      </div>
    </div>
  );
};
