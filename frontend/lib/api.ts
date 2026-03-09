// lib/api.ts — Typed fetch wrapper for backend API calls
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface FetchOptions extends RequestInit {
  token?: string;
}

export async function apiFetch(path: string, options: FetchOptions = {}) {
  const { token, ...rest } = options;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${API_URL}${path}`, { ...rest, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'API error');
  }
  return res.json();
}

export const getExpenses   = (token: string) => apiFetch('/api/expenses', { token });
export const getBudgets    = (token: string) => apiFetch('/api/budgets', { token });
export const getInsights   = (token: string) => apiFetch('/api/insights/insights', { token });
export const getPrediction = (token: string) => apiFetch('/api/insights/prediction', { token });
export const getAnomalies  = (token: string) => apiFetch('/api/insights/anomalies', { token });
export const getSubscriptions = (token: string) => apiFetch('/api/insights/subscriptions', { token });

export const createExpense = (token: string, data: object) =>
  apiFetch('/api/expenses', { method: 'POST', body: JSON.stringify(data), token });

export const deleteExpense = (token: string, id: number) =>
  apiFetch(`/api/expenses/${id}`, { method: 'DELETE', token });

export const createBudget = (token: string, data: object) =>
  apiFetch('/api/budgets', { method: 'POST', body: JSON.stringify(data), token });

export const sendChat = (token: string, prompt: string, history: object[]) =>
  apiFetch('/api/chat', { method: 'POST', body: JSON.stringify({ prompt, history }), token });
