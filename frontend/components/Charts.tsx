'use client';

import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend,
  LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar,
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

interface CategoryData { name: string; value: number; }
interface TimeData     { date: string; amount: number; }

const tooltipStyle = {
  contentStyle: { backgroundColor: '#111827', borderColor: '#1f2937', color: '#fff', borderRadius: 8 },
  itemStyle: { color: '#e5e7eb' },
};

export function SpendingPieChart({ data }: { data: CategoryData[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
  data={data}
  dataKey="value"
  nameKey="name"
  cx="50%"
  cy="50%"
  outerRadius={100}
  label={({ name, percent }) =>
    `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
  }
/>
          {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Pie>
        <Tooltip {...tooltipStyle} formatter={(v: number) => [`$${v.toFixed(2)}`, '']} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function SpendingLineChart({ data }: { data: TimeData[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
        <XAxis dataKey="date" stroke="#6b7280" tick={{ fontSize: 11 }} />
        <YAxis stroke="#6b7280" tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
        <Tooltip {...tooltipStyle} formatter={(v: number) => [`$${v.toFixed(2)}`, 'Spent']} />
        <Line type="monotone" dataKey="amount" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, fill: '#8b5cf6' }} activeDot={{ r: 7 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function SpendingBarChart({ data }: { data: CategoryData[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" horizontal={false} />
        <XAxis type="number" stroke="#6b7280" tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
        <YAxis type="category" dataKey="name" stroke="#6b7280" tick={{ fontSize: 11 }} width={80} />
        <Tooltip {...tooltipStyle} formatter={(v: number) => [`$${v.toFixed(2)}`, 'Spent']} />
        <Bar dataKey="value" radius={[0, 6, 6, 0]}>
          {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
