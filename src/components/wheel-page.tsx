'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { PieChart, Pie, Cell, ResponsiveContainer, Text } from 'recharts';
import { doc, serverTimestamp, Timestamp } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import { useFirestore, useUser, useDoc, useMemoFirebase, updateDocumentNonBlocking } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { Header } from './header';

const segments = [
  { name: '0 Points', value: 0, color: '#f44336' }, // Red
  { name: '5 Points', value: 5, color: '#9c27b0' }, // Purple
  { name: '50 Points', value: 50, color: '#2196f3' }, // Blue
  { name: '75 Points', value: 75, color: '#4caf50' }, // Green
  { name: '100 Points', value: 100, color: '#ffeb3b' }, // Yellow
  { name: '200 Points', value: 200, color: '#ff9800' }, // Orange
];

// Add a dummy value for each segment for the pie chart
const data = segments.map(segment => ({ ...segment, chartValue: 1 }));

const CustomLabel = ({ cx, cy, midAngle, outerRadius, payload }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius * 0.65;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
    return (
      <Text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        angle={-midAngle > 90 && -midAngle < 270 ? midAngle : midAngle + 180}
        className="font-bold text-lg"
      >
        {payload.name}
      </Text>
    );
  };

export function WheelPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [hasSpun, setHasSpun] = useState(true);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile } = useDoc<{
    points: number;
    lastWheelSpin?: Timestamp;
  }>(userDocRef);

  useEffect(() => {
    if (userProfile?.lastWheelSpin) {
      const lastSpinTime = userProfile.lastWheelSpin.toMillis();
      const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
      setHasSpun(lastSpinTime > twentyFourHoursAgo);
    } else {
      setHasSpun(false);
    }
  }, [userProfile]);

  const handleSpin = () => {
    if (!userDocRef || !userProfile || hasSpun || isSpinning) return;

    setIsSpinning(true);

    const segmentCount = segments.length;
    // Spin animation logic
    const randomSpins = Math.floor(Math.random() * 5) + 5; // 5 to 10 full spins
    const winningSegmentIndex = Math.floor(Math.random() * segmentCount);
    const segmentAngle = 360 / segmentCount;
    const finalAngle = (randomSpins * 360) + (winningSegmentIndex * segmentAngle) + (segmentAngle / 2);
    
    setRotation(finalAngle);

    const prize = segments[winningSegmentIndex];
    
    // Wait for animation to finish
    setTimeout(() => {
      const newPoints = (userProfile.points || 0) + prize.value;

      updateDocumentNonBlocking(userDocRef, {
        points: newPoints,
        lastWheelSpin: serverTimestamp(),
      });

      toast({
        title: 'Congratulations!',
        description: `You won ${prize.name}!`,
      });

      setHasSpun(true);
      setIsSpinning(false);
    }, 4000); // Corresponds to the transition duration
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-900 text-white">
      <header className="flex items-center p-4">
        <Link href="/" className="p-2">
            <ArrowLeft />
        </Link>
        <h1 className="flex-1 text-center text-xl font-bold">Daily Lucky Wheel</h1>
        <div className="w-8"></div>
      </header>
      
      <main className="flex flex-1 flex-col items-center justify-center p-4">
        <div className="relative w-full max-w-sm">
            <div 
              className="absolute left-1/2 -top-2 z-10 -translate-x-1/2"
              style={{
                width: 0,
                height: 0,
                borderLeft: '15px solid transparent',
                borderRight: '15px solid transparent',
                borderTop: '20px solid white',
              }}
            />

            <div 
              className="rounded-2xl p-4"
              style={{ background: 'hsl(var(--primary))' }}
            >
                <div 
                  className="transition-transform duration-[4000ms] ease-out"
                  style={{ transform: `rotate(${rotation}deg)` }}
                >
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={CustomLabel}
                            outerRadius={'100%'}
                            fill="#8884d8"
                            dataKey="chartValue"
                            stroke="white"
                            strokeWidth={2}
                        >
                            {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
            
            {hasSpun && (
                <div className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-green-900/50 p-3 text-green-400">
                    <CheckCircle className="h-5 w-5" />
                    <p>You already spun today</p>
                </div>
            )}
            
            <Button
                onClick={handleSpin}
                disabled={hasSpun || isSpinning}
                className="mt-6 w-full text-lg font-bold"
                size="lg"
            >
                {isSpinning ? 'Spinning...' : 'SPIN'}
            </Button>
        </div>
      </main>
    </div>
  );
}
