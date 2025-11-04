"use client";
import { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import Link from 'next/link';
import { Gift, Chrome, Mail, Lock } from 'lucide-react';

import { useAuth } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

export function LoginPage() {
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();
  const auth = useAuth();
  const googleProvider = new GoogleAuthProvider();

  const handleGoogleSignIn = async () => {
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
          description: error.message || "Could not sign you in with Google. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async () => {
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
      if (isSigningUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error: any) {
      console.error("Email authentication error:", error);
      toast({
        title: isSigningUp ? "Sign-up Failed" : "Sign-in Failed",
        description: error.message || `Could not ${isSigningUp ? 'sign you up' : 'sign you in'}. Please try again.`,
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
          <CardDescription>{isSigningUp ? 'Create an account to start earning' : 'Sign in to your account'}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10" />
            </div>
          </div>
          
          <Button
            onClick={handleEmailAuth}
            disabled={isLoading || !agreed || !email || !password}
            className="w-full transition-all duration-300"
            size="lg"
          >
            {isLoading ? "Loading..." : (isSigningUp ? "Sign Up" : "Sign In")}
          </Button>

          <div className="relative flex items-center justify-center">
            <Separator className="w-full" />
            <span className="absolute bg-background px-2 text-sm text-muted-foreground">OR</span>
          </div>

          <Button
            onClick={handleGoogleSignIn}
            disabled={isLoading || !agreed}
            className="w-full transition-all duration-300"
            size="lg"
            variant="outline"
          >
            <Chrome className="mr-2 h-5 w-5" />
            {isLoading ? "Signing in..." : "Sign In with Google"}
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
           <Button variant="link" onClick={() => setIsSigningUp(!isSigningUp)}>
            {isSigningUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </Button>
          <p className="w-full text-center text-xs text-muted-foreground">Your gateway to exclusive rewards.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
