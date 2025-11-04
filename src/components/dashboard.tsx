'use client';
import Link from 'next/link';
import {
  BarChart2,
  CheckCircle,
  HelpCircle,
  Home,
  Store,
  Users,
} from 'lucide-react';
import { serverTimestamp, doc, updateDoc, Timestamp, getDoc } from 'firebase/firestore';

import { Card, CardContent } from '@/components/ui/card';
import { Header } from './header';
import { DiceIcon } from './dice-icon';
import { PlayAndEarnIcon } from './play-and-earn-icon';
import { SurveyIcon } from './survey-icon';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';

const offers = [
  {
    id: 'login-reward',
    title: 'Login Reward',
    icon: <CheckCircle className="h-10 w-10 text-gray-400" />,
    href: '#',
  },
  {
    id: 'play-earn',
    title: 'Play & Earn',
    icon: <PlayAndEarnIcon />,
    href: '/coming-soon',
  },
  {
    id: 'offers',
    title: 'Offers',
    icon: <Store className="h-10 w-10 text-white" />,
    href: '/coming-soon',
  },
  {
    id: 'surveys',
    title: 'Surveys',
    icon: <SurveyIcon />,
    href: '/coming-soon',
  },
  {
    id: 'wheel-of',
    title: 'Wheel Of',
    icon: <DiceIcon />,
    href: '/coming-soon',
  },
  {
    id: 'stats',
    title: 'Stats',
    icon: <BarChart2 className="h-10 w-10 text-white" />,
    href: '/coming-soon',
  },
];

export default function Dashboard() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isLoginRewardClaimed, setIsLoginRewardClaimed] = useState(true);

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<{
    points: number;
    lastLoginReward?: Timestamp;
  }>(userDocRef);

  useEffect(() => {
    if (userProfile?.lastLoginReward) {
      const lastClaimed = userProfile.lastLoginReward.toMillis();
      const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
      setIsLoginRewardClaimed(lastClaimed > twentyFourHoursAgo);
    } else {
      setIsLoginRewardClaimed(false);
    }
  }, [userProfile]);

  const handleLoginReward = async () => {
    if (!userDocRef || !firestore || !userProfile) return;

    if (isLoginRewardClaimed) {
      toast({
        title: 'Reward Already Claimed',
        description: 'You can claim the daily login reward once every 24 hours.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const newPoints = (userProfile.points || 0) + 100;
      await updateDoc(userDocRef, {
        points: newPoints,
        lastLoginReward: serverTimestamp(),
      });
      toast({
        title: 'Reward Claimed!',
        description: 'You have received 100 points.',
      });
      setIsLoginRewardClaimed(true);
    } catch (error) {
      console.error('Error claiming login reward:', error);
      toast({
        title: 'Error',
        description: 'Could not claim the reward. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  const getOfferStatus = (offerId: string) => {
    if (offerId === 'login-reward') {
      return isLoginRewardClaimed ? 'Reward Collected' : 'Collect Reward';
    }
    return undefined;
  };

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

        <h2 className="mb-4 text-xl font-semibold">Offers</h2>
        <div className="grid grid-cols-2 gap-4">
          {offers.map((offer) => {
            const isDisabled = offer.id === 'login-reward' && isLoginRewardClaimed;
            const status = getOfferStatus(offer.id);

            return (
              <Link 
                key={offer.id} 
                href={isDisabled ? '#' : offer.href} 
                onClick={offer.id === 'login-reward' ? handleLoginReward : undefined}
                className={isDisabled ? 'pointer-events-none' : ''}
              >
                <Card
                  className={`flex h-32 flex-col items-center justify-center rounded-2xl ${
                    isDisabled
                      ? 'bg-gray-700'
                      : 'bg-gradient-to-br from-purple-700 to-blue-700'
                  }`}
                >
                  <CardContent className="flex flex-col items-center justify-center text-center">
                    {offer.icon}
                    <p className="mt-2 text-sm font-semibold">{offer.title}</p>
                    {status && (
                      <p className="text-xs text-gray-400">{status}</p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
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
        <Link href="/" className="flex flex-col items-center text-blue-400">
          <div className="flex h-12 w-16 items-center justify-center rounded-lg bg-blue-500 bg-opacity-30">
            <Home className="h-6 w-6" />
          </div>
          <span className="text-xs">Home</span>
        </Link>
        <Link href="/coming-soon" className="flex flex-col items-center text-gray-400">
          <Store className="h-6 w-6" />
          <span className="mt-2 text-xs">Store</span>
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
        <Link href="/coming-soon" className="flex flex-col items-center text-gray-400">
          <Users className="h-6 w-6" />
          <span className="mt-2 text-xs">Invite</span>
        </Link>
      </div>
       <p className="text-center text-xs text-gray-500 mt-2">
          Support response time is typically within 24 hours.
        </p>
    </footer>
  );
}
