'use client';

import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';

interface Expense {
  id: number;
  amount: number | string;
  category: string;
  merchant: string;
  date: string;
  description?: string;
  payment_method?: string;
}

interface ExpenseTableProps {
  expenses: Expense[];
  onDelete?: (id: number) => void;
}

const categoryColors: Record<string, string> = {
  Food:          'bg-orange-500/20 text-orange-300',
  Transport:     'bg-blue-500/20 text-blue-300',
  Entertainment: 'bg-purple-500/20 text-purple-300',
  Shopping:      'bg-pink-500/20 text-pink-300',
  Health:        'bg-green-500/20 text-green-300',
  Utilities:     'bg-yellow-500/20 text-yellow-300',
  Other:         'bg-gray-500/20 text-gray-300',
};

export default function ExpenseTable({ expenses, onDelete }: ExpenseTableProps) {
  if (!expenses.length) {
    return (
      <div className="rounded-2xl border border-white/5 bg-gray-900 p-8 text-center text-gray-500">
        No expenses yet. Start tracking with the AI Copilot!
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/5 bg-gray-900">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/5 text-left text-xs uppercase tracking-wider text-gray-500">
            <th className="px-6 py-4">Date</th>
            <th className="px-6 py-4">Merchant</th>
            <th className="px-6 py-4">Category</th>
            <th className="px-6 py-4">Method</th>
            <th className="px-6 py-4 text-right">Amount</th>
            {onDelete && <th className="px-6 py-4" />}
          </tr>
        </thead>
        <tbody>
          {expenses.map((exp, i) => (
            <motion.tr
              key={exp.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors"
            >
              <td className="px-6 py-4 text-gray-400">
                {new Date(exp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </td>
              <td className="px-6 py-4 font-medium text-white">{exp.merchant}</td>
              <td className="px-6 py-4">
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${categoryColors[exp.category] || categoryColors.Other}`}>
                  {exp.category}
                </span>
              </td>
              <td className="px-6 py-4 capitalize text-gray-400">{exp.payment_method || 'card'}</td>
              <td className="px-6 py-4 text-right font-semibold text-white">
                ${parseFloat(String(exp.amount)).toFixed(2)}
              </td>
              {onDelete && (
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => onDelete(exp.id)}
                    className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              )}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
