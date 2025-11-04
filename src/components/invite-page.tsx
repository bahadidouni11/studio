'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  BarChart2,
  CheckCircle,
  Clipboard,
  Gift,
  HelpCircle,
  Home,
  Link as LinkIcon,
  Share2,
  Sparkles,
  Store,
  Users,
} from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Header } from './header';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, Timestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Button } from './ui/button';

export function InvitePage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<{
    points: number;
    lastLoginReward?: Timestamp;
  }>(userDocRef);

  const referralLink =
    typeof window !== 'undefined'
      ? `${window.location.origin}/?ref=${user?.uid}`
      : '';

  const handleCopy = () => {
    navigator.clipboard
      .writeText(referralLink)
      .then(() => {
        setCopied(true);
        toast({
          title: 'Link Copied!',
          description: 'Your referral link has been copied to the clipboard.',
        });
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error('Failed to copy referral link: ', err);
        toast({
          title: 'Failed to Copy',
          description: 'Could not copy the referral link.',
          variant: 'destructive',
        });
      });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join me on Loot Reward!',
          text: `Use my link to join and get a bonus!`,
          url: referralLink,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      handleCopy();
    }
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
        
        <Button variant="default" size="lg" className="w-full mb-6">Invite Friends</Button>

        <Card className="rounded-2xl bg-gray-800 p-6 text-center">
            <CardContent>
                <div className="space-y-4 text-left">
                    <div className="flex items-center gap-3">
                        <Gift className="h-6 w-6 text-yellow-400" />
                        <p className="font-semibold">Your Invite Link</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <LinkIcon className="h-6 w-6 text-blue-400" />
                        <p>Share with friends & earn</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Sparkles className="h-6 w-6 text-purple-400" />
                        <p>Each invite = 1500 points</p>
                    </div>
                </div>

                <div className="my-6 flex items-center justify-between rounded-lg bg-gray-700 p-3">
                    <p className="truncate text-sm text-gray-300">{referralLink}</p>
                    <button onClick={handleCopy} className="ml-4 shrink-0">
                        {copied ? <CheckCircle className="h-6 w-6 text-green-500" /> : <Clipboard className="h-6 w-6 text-gray-400" />}
                    </button>
                </div>

                <Button onClick={handleShare} className="w-full group bg-gradient-to-r from-purple-600 to-blue-600">
                    <Share2 className="mr-2 h-5 w-5" />
                    Share Link
                </Button>
            </CardContent>
        </Card>
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
          <Link href="/invite" className="flex flex-col items-center text-blue-400">
            <div className="flex h-12 w-16 items-center justify-center rounded-lg bg-blue-500 bg-opacity-30">
              <Users className="h-6 w-6" />
            </div>
            <span className="text-xs">Invite</span>
          </Link>
        </div>
        <p className="mt-2 text-center text-xs text-gray-500">
          Support response time is typically within 24 hours.
        </p>
      </footer>
    );
  }
