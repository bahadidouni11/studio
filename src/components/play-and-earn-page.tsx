'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from '@/components/ui/alert-dialog';
import {
  BarChart2,
  HelpCircle,
  Home,
  Play,
  Store,
  Users,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Header } from './header';
import { useUser, useFirestore, useDoc, useMemoFirebase, updateDocumentNonBlocking } from '@/firebase';
import { doc, Timestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Button } from './ui/button';
import { Progress } from './ui/progress';

export function PlayAndEarnPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [progress, setProgress] = useState(0);

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<{
    points: number;
    lastLoginReward?: Timestamp;
  }>(userDocRef);
  
  const handleWatchAd = () => {
    if (!userDocRef || !userProfile) return;

    setIsWatchingAd(true);
    setProgress(0);

    const interval = setInterval(() => {
        setProgress(prev => {
            if (prev >= 100) {
                clearInterval(interval);
                return 100;
            }
            return prev + 20;
        });
    }, 1000);

    setTimeout(() => {
        clearInterval(interval);
        setIsWatchingAd(false);
        const pointsWon = Math.floor(Math.random() * (50 - 10 + 1)) + 10;
        const newPoints = userProfile.points + pointsWon;
        
        updateDocumentNonBlocking(userDocRef, { points: newPoints });

        toast({
            title: "Ad Watched!",
            description: `You have earned ${pointsWon} points.`,
        });
        setProgress(0);

    }, 5000);
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
        
        <Card className="rounded-2xl bg-gray-800 p-6 text-center">
            <CardContent>
                <h2 className="text-2xl font-bold mb-4">Watch & Earn</h2>
                <p className="text-muted-foreground mb-6">Watch a short video ad and get rewarded with points!</p>
                <Button 
                    onClick={handleWatchAd} 
                    disabled={isWatchingAd}
                    className="w-full group bg-gradient-to-r from-purple-600 to-blue-600"
                    size="lg"
                >
                    <Play className="mr-2 h-5 w-5" />
                    {isWatchingAd ? 'Watching Ad...' : 'Watch Ad and Earn'}
                </Button>
            </CardContent>
        </Card>

        <AlertDialog open={isWatchingAd}>
            <AlertDialogContent className="bg-gray-800 border-purple-600">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-center text-white">Your Ad is Playing</AlertDialogTitle>
                    <AlertDialogDescription className="text-center text-gray-400">
                        Please wait for the ad to finish. You will receive your reward shortly.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="py-4">
                    <img src="https://picsum.photos/seed/ad/400/200" alt="ad" className="rounded-md w-full" data-ai-hint="advertisement" />
                </div>
                <Progress value={progress} className="w-full" />
            </AlertDialogContent>
        </AlertDialog>

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
          <Link href="/store" className="flex flex-col items-center text-gray-400">
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
