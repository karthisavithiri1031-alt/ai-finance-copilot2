'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, MessageSquare, BarChart2, CreditCard,
  Target, FileText, Settings, LogOut, Zap
} from 'lucide-react';
import { signOut } from 'next-auth/react';

const links = [
  { href: '/dashboard',             icon: LayoutDashboard, label: 'Dashboard'     },
  { href: '/chat',                  icon: MessageSquare,   label: 'AI Copilot'    },
  { href: '/transactions',          icon: CreditCard,      label: 'Transactions'  },
  { href: '/budgets',               icon: Target,          label: 'Budgets'       },
  { href: '/analytics',             icon: BarChart2,       label: 'Analytics'     },
  { href: '/reports',               icon: FileText,        label: 'Reports'       },
  { href: '/settings',              icon: Settings,        label: 'Settings'      },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-white/5 bg-gray-900 backdrop-blur-xl">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg">
          <Zap size={18} className="text-white" />
        </div>
        <span className="text-lg font-bold tracking-tight text-white">
          FinanceCopilot
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {links.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link key={href} href={href}>
              <motion.div
                whileHover={{ x: 4 }}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-blue-600/20 text-blue-400 shadow-sm'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={18} />
                {label}
                {active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-400" />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="px-3 pb-6">
        <motion.button
          whileHover={{ x: 4 }}
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut size={18} />
          Sign Out
        </motion.button>
      </div>
    </aside>
  );
}
