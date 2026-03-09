# AI Finance Copilot 🚀

> A production-grade AI-powered personal finance platform — manage money through natural conversation, analytics dashboards, and automated insights.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **AI Copilot** | Chat with Google Gemini to track expenses in natural language |
| 📊 **Analytics Dashboard** | Pie charts, line charts, category breakdowns |
| 💰 **Budget Management** | Set limits per category, visual progress bars |
| 🔮 **Spending Prediction** | AI forecasts your monthly spend |
| 🚨 **Anomaly Detection** | Flag unusual transactions automatically |
| 🔁 **Subscription Detection** | Identify recurring payments |
| 📥 **CSV Export** | Download expense reports |
| 🎙️ **Voice Input** | Speak your expenses directly |
| 🔐 **Secure Auth** | NextAuth.js JWT authentication, isolated data per user |

---

## 🏗️ Architecture

```
┌──────────────────────────┐
│  Next.js Frontend (3000) │
│  Dashboard + AI Chat UI  │
└────────────┬─────────────┘
             │ REST API + JWT
             ▼
┌────────────────────────────┐
│  Node.js/Express (5000)    │
│  Auth, Expenses, Budgets   │
│  Chat, Insights routes     │
└──────┬─────────────┬───────┘
       │             │
       ▼             ▼
┌──────────┐  ┌──────────────────┐
│ Gemini AI│  │  PostgreSQL DB   │
│ Function │  │  (Supabase)      │
│ Calling  │  │                  │
└──────────┘  └──────────────────┘
```

### AI Tool System

Gemini uses **function calling** to detect user intent and invoke the right tool:

| Tool | When it's called |
|---|---|
| `createExpense` | "I spent $20 on lunch" |
| `readExpenses` | "How much did I spend this week?" |
| `updateExpense` | "Actually make that $7" |
| `deleteExpense` | "Remove my last expense" |
| `generateInsights` | "How can I save money?" |
| `predictSpending` | "What will I spend this month?" |
| `detectAnomaly` | "Any unusual transactions?" |

---

## 📁 Project Structure

```
ai-finance-copilot/
├── frontend/                   # Next.js App Router
│   ├── app/
│   │   ├── layout.tsx          # Root layout + AuthProvider
│   │   ├── page.tsx            # Root → redirect to /login
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── chat/page.tsx
│   │   ├── transactions/page.tsx
│   │   ├── budgets/page.tsx
│   │   ├── reports/page.tsx
│   │   └── api/auth/[...nextauth]/route.ts
│   ├── components/
│   │   ├── Sidebar.tsx
│   │   ├── ChatPanel.tsx       # AI chat with voice input
│   │   ├── DashboardCard.tsx
│   │   ├── ExpenseTable.tsx
│   │   ├── Charts.tsx          # Pie, Line, Bar charts
│   │   └── AuthProvider.tsx
│   └── lib/
│       ├── api.ts              # Typed fetch helpers
│       └── auth.ts
│
├── backend/                    # Node.js + Express
│   ├── server.js               # Entry point
│   ├── routes/                 # auth, chat, expenses, budgets, insights
│   ├── controllers/            # chatController, expenseController, etc.
│   ├── services/
│   │   ├── geminiService.js    # Gemini + tool definitions
│   │   ├── predictionService.js
│   │   └── anomalyService.js
│   ├── ai-agents/
│   │   ├── expenseAgent.js
│   │   ├── budgetAgent.js
│   │   ├── insightAgent.js
│   │   └── predictionAgent.js
│   ├── database/
│   │   ├── index.js            # PostgreSQL pool
│   │   ├── schema.sql          # DB schema
│   │   └── setup.js            # One-time DB runner
│   └── middleware/
│       └── authMiddleware.js   # JWT guard
│
├── .env.example
├── docker-compose.yml
└── README.md
```

---

## ⚙️ Setup

### 1. Database

Run schema on Supabase (or local PostgreSQL):

```bash
psql $DATABASE_URL -f backend/database/schema.sql
# OR
node backend/database/setup.js
```

### 2. Backend

```bash
cd backend
cp ../.env.example .env   # Fill in values
npm install
npm run dev               # Starts on http://localhost:5000
```

### 3. Frontend

```bash
cd frontend
# Create .env.local:
# NEXT_PUBLIC_API_URL=http://localhost:5000
# NEXTAUTH_SECRET=your_secret
# NEXTAUTH_URL=http://localhost:3000
npm install
npm run dev               # Starts on http://localhost:3000
```

---

## 🔑 Environment Variables

| Variable | Where | Description |
|---|---|---|
| `DATABASE_URL` | backend | PostgreSQL connection string |
| `GEMINI_API_KEY` | backend | Google AI Studio API key |
| `JWT_SECRET` | backend | Secret for signing JWTs |
| `NEXTAUTH_SECRET` | frontend | NextAuth secret |
| `NEXT_PUBLIC_API_URL` | frontend | Backend URL |

---

## 🐳 Docker

```bash
# Copy env vars first
cp .env.example .env
# Start all services
docker-compose up -d
```

---

## 🚀 Deployment

| Service | Platform |
|---|---|
| Frontend | [Vercel](https://vercel.com) |
| Backend | [Railway](https://railway.app) |
| Database | [Supabase](https://supabase.com) |

---

## 🔮 Future Improvements

- Receipt scanning via Google Vision API
- PDF report export  
- Multi-currency support
- Smart savings goals
- Mobile app (React Native)
