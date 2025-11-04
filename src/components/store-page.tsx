'use client';
import Link from 'next/link';
import Image from 'next/image';
import {
  BarChart2,
  ChevronRight,
  HelpCircle,
  Home,
  Store,
  Users,
} from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Header } from './header';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, Timestamp } from 'firebase/firestore';

const storeItems = [
  {
    id: 'pubg',
    name: '60 pubg UC',
    points: '75,000 points',
    image: '/images/pubg.png',
    bgColor: 'bg-blue-900/50',
    borderColor: 'border-blue-400'
  },
  {
    id: 'freefire',
    name: '231 free fire diamonds',
    points: '172,000 points',
    image: '/images/freefire.png',
    bgColor: 'bg-yellow-900/50',
    borderColor: 'border-yellow-400'
  },
  {
    id: 'vodafone',
    name: '50 pounds vodafone cash',
    points: '80,000 points',
    image: '/images/vodafone.png',
    bgColor: 'bg-red-900/50',
    borderColor: 'border-red-400'
  },
];

export function StorePage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<{
    points: number;
    lastLoginReward?: Timestamp;
  }>(userDocRef);

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-900 text-white">
      <Header />
      <main className="flex-1 overflow-y-auto p-4">
        <Card className="mb-6 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 p-6">
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-lg text-gray-200">Your Points</p>
              {isProfileLoading ? (
                <p className="text-4xl font-bold">...</p>
              ) : (
                <p className="text-4xl font-bold">
                  {userProfile?.points?.toLocaleString() || '0'}
                </p>
              )}
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white bg-opacity-20">
              <p className="text-2xl font-bold text-white">$</p>
            </div>
          </CardContent>
        </Card>

        <div className="rounded-lg bg-purple-600 py-2 text-center text-lg font-bold mb-4">
          Store
        </div>

        <div className="space-y-3">
          {storeItems.map((item) => (
            <Link href="/coming-soon" key={item.id}>
                <Card className={`rounded-2xl border ${item.borderColor} ${item.bgColor} p-4`}>
                    <CardContent className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                        <Image src={item.image} alt={item.name} width={48} height={48} className="rounded-lg" />
                        <div>
                            <p className="font-semibold text-white">{item.name}</p>
                            <p className="text-purple-400">{item.points}</p>
                        </div>
                        </div>
                        <ChevronRight className="h-6 w-6 text-gray-400" />
                    </CardContent>
                </Card>
            </Link>
          ))}
        </div>

      </main>
      <Footer />
    </div>
  );
}

function Footer() {
    return (
      <footer className="mt-auto border-t border-gray-700 bg-gray-900 p-2">
        <div className="flex justify-around">
          <Link href="/" className="flex flex-col items-center text-gray-400">
            <Home className="h-6 w-6" />
            <span className="mt-2 text-xs">Home</span>
          </Link>
          <Link href="/store" className="flex flex-col items-center text-blue-400">
             <div className="flex h-12 w-16 items-center justify-center rounded-lg bg-blue-500 bg-opacity-30">
                <Store className="h-6 w-6" />
            </div>
            <span className="text-xs">Store</span>
          </Link>
          <Link href="/coming-soon" className="flex flex-col items-center text-gray-400">
            <BarChart2 className="h-6 w-6" />
            <span className="mt-2 text-xs">Orders</span>
          </Link>
          <a
            href="https://chat.whatsapp.com/C6EJmNOt18lGaIoqMk2wv0?mode=wwt"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center text-gray-400"
          >
            <HelpCircle className="h-6 w-6" />
            <span className="mt-2 text-xs">Support</span>
          </a>
          <Link href="/invite" className="flex flex-col items-center text-gray-400">
            <Users className="h-6 w-6" />
            <span className="mt-2 text-xs">Invite</span>
          </Link>
        </div>
        <p className="mt-2 text-center text-xs text-gray-500">
          Support response time is typically within 24 hours.
        </p>
      </footer>
    );
  }
