"use client";

import { useAuth } from '@/hooks/use-auth';
import { LoginPage } from '@/components/login-page';
import Dashboard from '@/components/dashboard';

export function MainPage() {
  const { user } = useAuth();

  return user ? <Dashboard /> : <LoginPage />;
}
