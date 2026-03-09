// lib/auth.ts — NextAuth utility helpers
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function getSessionToken() {
  const session = await getServerSession(authOptions);
  return (session as any)?.accessToken as string | undefined;
}

export { authOptions };
