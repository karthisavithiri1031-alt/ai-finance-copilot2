'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { SpendingBarChart, SpendingPieChart } from '@/components/Charts';

export default function ReportsPage() {
  const { data: session } = useSession();
  const token = (session as any)?.accessToken;
  const [expenses, setExpenses] = useState<any[]>([]);
  const [insight, setInsight] = useState('Loading insights...');
  const [prediction, setPrediction] = useState('');

  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (!token) return;
    const h = { Authorization: `Bearer ${token}` };
    fetch(`${API}/api/expenses`, { headers: h }).then(r => r.json()).then(d => setExpenses(Array.isArray(d) ? d : [])).catch(() => {});
    fetch(`${API}/api/insights/insights`, { headers: h }).then(r => r.json()).then(d => setInsight(d.insight)).catch(() => {});
    fetch(`${API}/api/insights/prediction`, { headers: h }).then(r => r.json()).then(d => setPrediction(d.prediction)).catch(() => {});
  }, [token]);

  const categoryData = Object.entries(
    expenses.reduce((acc: any, e: any) => ({ ...acc, [e.category]: (acc[e.category] || 0) + parseFloat(e.amount) }), {})
  ).map(([name, value]) => ({ name, value: value as number }));

  const exportCSV = () => {
    const header = 'Date,Merchant,Category,Amount,Description,Payment Method';
    const rows = expenses.map(e => `${e.date},${e.merchant},${e.category},${e.amount},"${e.description || ''}",${e.payment_method || 'card'}`);
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'expenses.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen bg-gray-950">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Reports</h1>
              <p className="mt-1 text-gray-400">Financial analytics and insights</p>
            </div>
            <button onClick={exportCSV} className="flex items-center gap-2 rounded-xl border border-white/10 bg-gray-800 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-700 transition-colors">
              <Download size={16} /> Export CSV
            </button>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/5 bg-gray-900 p-6">
              <h2 className="mb-4 text-base font-semibold text-gray-200">Spending by Category</h2>
              {categoryData.length ? <SpendingPieChart data={categoryData} /> : <p className="py-16 text-center text-gray-500">No data</p>}
            </div>
            <div className="rounded-2xl border border-white/5 bg-gray-900 p-6">
              <h2 className="mb-4 text-base font-semibold text-gray-200">Category Comparison</h2>
              {categoryData.length ? <SpendingBarChart data={categoryData} /> : <p className="py-16 text-center text-gray-500">No data</p>}
            </div>
          </div>

          {/* Insights */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {[{ title: '💡 AI Insights', text: insight }, { title: '🔮 Spending Prediction', text: prediction }].map(({ title, text }) => (
              <div key={title} className="rounded-2xl border border-white/5 bg-gray-900 p-6">
                <h2 className="mb-4 text-base font-semibold text-gray-200">{title}</h2>
                <div className="prose prose-invert prose-sm max-w-none text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {text || 'Loading...'}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
