"use client";
import { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import Link from 'next/link';
import { Gift, Chrome } from 'lucide-react';

import { useAuth } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export function LoginPage() {
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const auth = useAuth();
  const googleProvider = new GoogleAuthProvider();

  const handleSignIn = async () => {
    if (!agreed) {
      toast({
        title: "Agreement Required",
        description: "You must agree to the Terms of Service and Privacy Policy.",
        variant: "destructive",
      });
      return;
    }
    if (!auth) {
      toast({
        title: "Authentication Error",
        description: "Firebase Auth is not available. Please try again later.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      if (error.code !== 'auth/popup-closed-by-user') {
        console.error("Authentication error:", error);
        toast({
          title: "Sign-in Failed",
          description: "Could not sign you in with Google. Please try again.",
          variant: "destructive",
        });
      }
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
          <CardDescription>Sign in to start earning</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button
            onClick={handleSignIn}
            disabled={isLoading || !agreed}
            className="w-full transition-all duration-300"
            size="lg"
          >
            <Chrome className="mr-2 h-5 w-5" />
            {isLoading ? "Signing in..." : "Sign In with Google"}
          </Button>
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" checked={agreed} onCheckedChange={(checked) => setAgreed(!!checked)} />
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
        <CardFooter>
          <p className="w-full text-center text-xs text-muted-foreground">Your gateway to exclusive rewards.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
