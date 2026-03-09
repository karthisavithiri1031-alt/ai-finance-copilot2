'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import ExpenseTable from '@/components/ExpenseTable';

const CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Health', 'Utilities', 'Travel', 'Other'];

export default function TransactionsPage() {
  const { data: session } = useSession();
  const token = (session as any)?.accessToken;
  const [expenses, setExpenses] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ amount: '', category: 'Food', merchant: '', date: new Date().toISOString().split('T')[0], description: '', payment_method: 'card' });

  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  const load = async () => {
    if (!token) return;
    const data = await fetch(`${API}/api/expenses`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).catch(() => []);
    setExpenses(Array.isArray(data) ? data : []);
  };
  useEffect(() => { load(); }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`${API}/api/expenses`, { method: 'POST', headers, body: JSON.stringify({...form, amount: parseFloat(form.amount)}) });
    setShowForm(false);
    setForm({ amount: '', category: 'Food', merchant: '', date: new Date().toISOString().split('T')[0], description: '', payment_method: 'card' });
    load();
  };

  const handleDelete = async (id: number) => {
    await fetch(`${API}/api/expenses/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    load();
  };

  return (
    <div className="flex h-screen bg-gray-950">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Transactions</h1>
              <p className="mt-1 text-gray-400">{expenses.length} expenses recorded</p>
            </div>
            <button onClick={() => setShowForm(true)} className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
              <Plus size={16} /> Add Expense
            </button>
          </div>

          {showForm && (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl border border-white/5 bg-gray-900 p-6 relative">
              <button onClick={() => setShowForm(false)} className="absolute right-4 top-4 text-gray-400 hover:text-white"><X size={18} /></button>
              <h2 className="mb-4 text-lg font-semibold">New Expense</h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Amount ($)', key: 'amount', type: 'number', step: '0.01' },
                  { label: 'Merchant', key: 'merchant', type: 'text' },
                  { label: 'Date', key: 'date', type: 'date' },
                  { label: 'Description', key: 'description', type: 'text' },
                ].map(({ label, key, type, step }) => (
                  <div key={key}>
                    <label className="mb-1.5 block text-xs text-gray-400">{label}</label>
                    <input type={type} step={step} required={key === 'amount'}
                      value={(form as any)[key]} onChange={e => setForm(f => ({...f, [key]: e.target.value}))}
                      className="w-full rounded-xl border border-white/5 bg-gray-800 px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none" />
                  </div>
                ))}
                <div>
                  <label className="mb-1.5 block text-xs text-gray-400">Category</label>
                  <select value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))}
                    className="w-full rounded-xl border border-white/5 bg-gray-800 px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none">
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs text-gray-400">Payment</label>
                  <select value={form.payment_method} onChange={e => setForm(f => ({...f, payment_method: e.target.value}))}
                    className="w-full rounded-xl border border-white/5 bg-gray-800 px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none">
                    {['card', 'cash', 'bank_transfer', 'crypto'].map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div className="col-span-2 flex justify-end gap-2">
                  <button type="button" onClick={() => setShowForm(false)} className="rounded-xl px-5 py-2.5 text-sm text-gray-400 hover:text-white">Cancel</button>
                  <button type="submit" className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">Add Expense</button>
                </div>
              </form>
            </motion.div>
          )}

          <ExpenseTable expenses={expenses} onDelete={handleDelete} />
        </motion.div>
      </main>
    </div>
  );
}
