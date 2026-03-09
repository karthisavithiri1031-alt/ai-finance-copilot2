'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Plus, Target } from 'lucide-react';
import Sidebar from '@/components/Sidebar';

const CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Health', 'Utilities', 'Travel', 'Other'];

export default function BudgetsPage() {
  const { data: session } = useSession();
  const token = (session as any)?.accessToken;
  const [budgets, setBudgets] = useState<any[]>([]);
  const [category, setCategory] = useState('Food');
  const [limit, setLimit] = useState('');

  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const authHeaders = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  const load = async () => {
    if (!token) return;
    const data = await fetch(`${API}/api/budgets`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).catch(() => []);
    setBudgets(Array.isArray(data) ? data : []);
  };
  useEffect(() => { load(); }, [token]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`${API}/api/budgets`, { method: 'POST', headers: authHeaders, body: JSON.stringify({ category, limit_amount: parseFloat(limit) }) });
    setLimit('');
    load();
  };

  return (
    <div className="flex h-screen bg-gray-950">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Budgets</h1>
            <p className="mt-1 text-gray-400">Set spending limits and track your progress</p>
          </div>

          {/* Add budget form */}
          <div className="rounded-2xl border border-white/5 bg-gray-900 p-6">
            <h2 className="mb-4 text-base font-semibold text-white">Set a Budget</h2>
            <form onSubmit={handleAdd} className="flex flex-wrap gap-3">
              <select value={category} onChange={e => setCategory(e.target.value)}
                className="rounded-xl border border-white/5 bg-gray-800 px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
              <input type="number" step="0.01" min="1" required placeholder="Monthly limit e.g. 300"
                value={limit} onChange={e => setLimit(e.target.value)}
                className="flex-1 min-w-40 rounded-xl border border-white/5 bg-gray-800 px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none" />
              <button type="submit" className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
                <Plus size={16} /> Add Budget
              </button>
            </form>
          </div>

          {/* Budget cards */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {budgets.map((b) => {
              const pct = Math.min(100, Math.round((b.spent / b.limit) * 100));
              const exceeded = b.exceeded;
              return (
                <motion.div key={b.id} whileHover={{ scale: 1.02 }} className="rounded-2xl border border-white/5 bg-gray-900 p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-blue-500/10 p-2.5 text-blue-400"><Target size={16} /></div>
                      <span className="font-semibold text-white">{b.category}</span>
                    </div>
                    <span className={`text-sm font-medium ${exceeded ? 'text-red-400' : 'text-gray-400'}`}>
                      {pct}%
                    </span>
                  </div>
                  <div className="mb-3 overflow-hidden rounded-full bg-gray-800" style={{ height: 8 }}>
                    <motion.div
                      initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }}
                      className={`h-full rounded-full ${exceeded ? 'bg-red-500' : pct > 75 ? 'bg-yellow-500' : 'bg-blue-500'}`}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Spent: <strong className="text-white">${(b.spent || 0).toFixed(2)}</strong></span>
                    <span>Limit: <strong className="text-white">${parseFloat(b.limit).toFixed(2)}</strong></span>
                  </div>
                  {exceeded && (
                    <p className="mt-3 text-xs font-medium text-red-400">
                      ⚠️ Exceeded by ${(b.spent - b.limit).toFixed(2)}
                    </p>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
