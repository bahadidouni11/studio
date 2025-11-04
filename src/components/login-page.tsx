"use client";
import { useState } from 'react';
import Link from 'next/link';
import { Gift, Phone } from 'lucide-react';
import { signInAnonymously } from 'firebase/auth';
import { doc, getDoc, increment, writeBatch } from 'firebase/firestore';

import { useAuth, useFirestore } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';

export function LoginPage() {
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();

  const handleAnonymousSignIn = async () => {
    if (!agreed) {
      toast({
        title: "Agreement Required",
        description: "You must agree to the Terms of Service and Privacy Policy.",
        variant: "destructive",
      });
      return;
    }
    if (!auth || !firestore) {
      toast({
        title: "Authentication Error",
        description: "Firebase is not available. Please try again later.",
        variant: "destructive",
      });
      return;
    }
    if (!phoneNumber) {
        toast({
            title: "Phone Number Required",
            description: "Please enter your phone number.",
            variant: "destructive",
        });
        return;
    }

    setIsLoading(true);
    try {
      const userCredential = await signInAnonymously(auth);
      const user = userCredential.user;
      
      const userRef = doc(firestore, 'users', user.uid);

      const referralCode = localStorage.getItem('referralCode');
      
      const batch = writeBatch(firestore);

      batch.set(userRef, {
        id: user.uid,
        phoneNumber: phoneNumber,
        termsAgreed: true,
        points: 0,
        lastLoginReward: null,
      }, { merge: true });

      if (referralCode && referralCode !== user.uid) {
        const referrerRef = doc(firestore, 'users', referralCode);
        const referrerDoc = await getDoc(referrerRef);
        if (referrerDoc.exists()) {
           batch.update(referrerRef, { points: increment(3000) });
           localStorage.removeItem('referralCode'); // Clear after use
        }
      }

      await batch.commit();

    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        // Do nothing if user closes the popup
        setIsLoading(false);
        return;
      }
      console.error("Anonymous sign-in error:", error);
      toast({
        title: "Sign-in Failed",
        description: error.message || "Could not sign you in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Gift className="h-8 w-8" />
          </div>
          <CardTitle className="text-3xl font-bold">CartagPay Rewards</CardTitle>
          <CardDescription>Enter your phone number to start earning</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input type="tel" placeholder="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="pl-10" />
            </div>
          </div>
          
          <Button
            onClick={handleAnonymousSignIn}
            disabled={isLoading || !agreed || !phoneNumber}
            className="w-full transition-all duration-300"
            size="lg"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>

          <div className="flex items-start space-x-3">
            <Checkbox id="terms" checked={agreed} onCheckedChange={(checked) => setAgreed(!!checked)} className="mt-1" />
            <Label htmlFor="terms" className="text-sm font-normal text-muted-foreground">
              I agree to the{" "}
              <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
                Privacy Policy
              </Link>
              .
            </Label>
          </div>
        </CardContent>
        <CardFooter className="flex-col space-y-4">
          <p className="w-full text-center text-xs text-muted-foreground">Your gateway to exclusive rewards.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
