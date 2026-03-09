'use client';

import { useSession } from 'next-auth/react';
import Sidebar from '@/components/Sidebar';
import ChatPanel from '@/components/ChatPanel';

export default function ChatPage() {
  const { data: session } = useSession();
  const token = (session as any)?.accessToken;

  return (
    <div className="flex h-screen bg-gray-950">
      <Sidebar />
      <main className="flex flex-1 flex-col p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">AI Copilot</h1>
          <p className="mt-1 text-gray-400">Your intelligent financial advisor — powered by Google Gemini</p>
        </div>
        <div className="flex-1 min-h-0">
          <ChatPanel token={token} />
        </div>
      </main>
    </div>
  );
}
