'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  color?: 'blue' | 'green' | 'purple' | 'red' | 'orange';
  trend?: number;
}

const colorMap = {
  blue:   'from-blue-500/20 to-blue-600/5 border-blue-500/20 text-blue-400',
  green:  'from-emerald-500/20 to-emerald-600/5 border-emerald-500/20 text-emerald-400',
  purple: 'from-violet-500/20 to-violet-600/5 border-violet-500/20 text-violet-400',
  red:    'from-red-500/20 to-red-600/5 border-red-500/20 text-red-400',
  orange: 'from-orange-500/20 to-orange-600/5 border-orange-500/20 text-orange-400',
};

export default function DashboardCard({
  title, value, subtitle, icon: Icon, color = 'blue', trend
}: DashboardCardProps) {
  const colors = colorMap[color];

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6 backdrop-blur-sm ${colors} shadow-xl`}
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full bg-current opacity-5 blur-2xl" />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-gray-400">{title}</p>
          <p className="mt-2 text-3xl font-bold text-white">{value}</p>
          {subtitle && (
            <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
          )}
          {trend !== undefined && (
            <p className={`mt-2 text-xs font-medium ${trend >= 0 ? 'text-red-400' : 'text-emerald-400'}`}>
              {trend >= 0 ? '▲' : '▼'} {Math.abs(trend)}% vs last month
            </p>
          )}
        </div>
        <div className="rounded-xl bg-current/10 p-3">
          <Icon size={22} className="text-current" />
        </div>
      </div>
    </motion.div>
  );
}
