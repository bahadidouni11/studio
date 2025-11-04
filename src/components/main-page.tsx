"use client";

import { useUser } from '@/firebase';
import { LoginPage } from '@/components/login-page';
import Dashboard from '@/components/dashboard';
import { Gift } from 'lucide-react';

export function MainPage() {
  const { user, isUserLoading } = useUser();

  if (isUserLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background text-primary">
        <Gift className="h-16 w-16 animate-pulse" />
        <p className="mt-4 text-lg font-semibold">Loading CartagPay Rewards</p>
      </div>
    );
  }

  return user ? <Dashboard /> : <LoginPage />;
}
