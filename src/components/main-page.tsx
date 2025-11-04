'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useUser } from '@/firebase';
import { LoginPage } from '@/components/login-page';
import Dashboard from '@/components/dashboard';
import { Gift } from 'lucide-react';

function ReferralHandler() {
  const searchParams = useSearchParams();
  const ref = searchParams.get('ref');

  useEffect(() => {
    if (ref) {
      localStorage.setItem('referralCode', ref);
    }
  }, [ref]);

  return null;
}


export function MainPage() {
  const { user, isUserLoading } = useUser();

  return (
    <>
      <ReferralHandler />
      {isUserLoading ? (
        <div className="flex flex-col items-center justify-center h-screen bg-background text-primary">
          <Gift className="h-16 w-16 animate-pulse" />
          <p className="mt-4 text-lg font-semibold">Loading CartagPay Rewards</p>
        </div>
      ) : user ? (
        <Dashboard />
      ) : (
        <LoginPage />
      )}
    </>
  );
}
