'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Wallet, AlertTriangle } from 'lucide-react';
import DashboardCard from '@/components/DashboardCard';
import { SpendingPieChart, SpendingLineChart } from '@/components/Charts';
import ExpenseTable from '@/components/ExpenseTable';
import Sidebar from '@/components/Sidebar';

export default function DashboardPage() {
  const { data: session } = useSession();
  const token = (session as any)?.accessToken;
  const [expenses, setExpenses] = useState<any[]>([]);
  const [budgets, setBudgets] = useState<any[]>([]);

  const load = async () => {
    if (!token) return;
    const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const headers = { Authorization: `Bearer ${token}` };
    const [e, b] = await Promise.all([
      fetch(`${API}/api/expenses`, { headers }).then(r => r.json()).catch(() => []),
      fetch(`${API}/api/budgets`, { headers }).then(r => r.json()).catch(() => []),
    ]);
    setExpenses(Array.isArray(e) ? e : []);
    setBudgets(Array.isArray(b) ? b : []);
  };

  useEffect(() => { load(); }, [token]);

  const totalSpent = expenses.reduce((s, e) => s + parseFloat(e.amount), 0);
  const totalBudget = budgets.reduce((s, b) => s + parseFloat(b.limit), 0);

  const categoryData = Object.entries(
    expenses.reduce((acc: any, e: any) => ({...acc, [e.category]: (acc[e.category] || 0) + parseFloat(e.amount)}), {})
  ).map(([name, value]) => ({ name, value: value as number }));

  const dateData = Object.entries(
    expenses.reduce((acc: any, e: any) => {
      const d = new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      return { ...acc, [d]: (acc[d] || 0) + parseFloat(e.amount) };
    }, {})
  ).map(([date, amount]) => ({ date, amount: amount as number }));

  return (
    <div className="flex h-screen bg-gray-950">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="mt-1 text-gray-400">Your financial overview at a glance</p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            <DashboardCard title="Total Spent" value={`$${totalSpent.toFixed(2)}`} icon={DollarSign} color="blue" subtitle="All time" />
            <DashboardCard title="Monthly Budget" value={`$${totalBudget.toFixed(2)}`} icon={Wallet} color="green" subtitle="Combined limit" />
            <DashboardCard title="Remaining" value={`$${Math.max(0, totalBudget - totalSpent).toFixed(2)}`} icon={TrendingUp} color="purple" />
            <DashboardCard title="Transactions" value={String(expenses.length)} icon={AlertTriangle} color="orange" subtitle="Logged expenses" />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/5 bg-gray-900 p-6">
              <h2 className="mb-4 text-base font-semibold text-gray-200">Spending by Category</h2>
              {categoryData.length ? <SpendingPieChart data={categoryData} /> : <p className="py-16 text-center text-gray-500">No data yet</p>}
            </div>
            <div className="rounded-2xl border border-white/5 bg-gray-900 p-6">
              <h2 className="mb-4 text-base font-semibold text-gray-200">Spending Trend</h2>
              {dateData.length ? <SpendingLineChart data={dateData} /> : <p className="py-16 text-center text-gray-500">No data yet</p>}
            </div>
          </div>

          {/* Recent transactions */}
          <div>
            <h2 className="mb-4 text-base font-semibold text-gray-200">Recent Transactions</h2>
            <ExpenseTable expenses={expenses.slice(0, 8)} />
          </div>
        </motion.div>
      </main>
    </div>
  );
}
