'use client';
import Link from 'next/link';
import {
  BarChart2,
  CheckCircle,
  HelpCircle,
  Home,
  MessageSquare,
  Store,
  Users,
} from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Header } from './header';
import { DiceIcon } from './dice-icon';
import { PlayAndEarnIcon } from './play-and-earn-icon';
import { SurveyIcon } from './survey-icon';

const offers = [
  {
    title: 'Login Reward',
    status: 'Reward Collected',
    icon: <CheckCircle className="h-10 w-10 text-gray-400" />,
    disabled: true,
    href: '#',
  },
  {
    title: 'Play & Earn',
    icon: <PlayAndEarnIcon />,
    href: '/coming-soon',
  },
  {
    title: 'Offers',
    icon: <Store className="h-10 w-10 text-white" />,
    href: '/coming-soon',
  },
  {
    title: 'Surveys',
    icon: <SurveyIcon />,
    href: '/coming-soon',
  },
  {
    title: 'Wheel Of',
    icon: <DiceIcon />,
    href: '/coming-soon',
  },
  {
    title: 'Stats',
    icon: <BarChart2 className="h-10 w-10 text-white" />,
    href: '/coming-soon',
  },
];

export default function Dashboard() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-900 text-white">
      <Header />
      <main className="flex-1 overflow-y-auto p-4">
        <Card className="mb-6 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 p-6">
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-lg text-gray-200">Your Points</p>
              <p className="text-4xl font-bold">3,774</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white bg-opacity-20">
              <p className="text-2xl font-bold text-white">$</p>
            </div>
          </CardContent>
        </Card>

        <h2 className="mb-4 text-xl font-semibold">Offers</h2>
        <div className="grid grid-cols-2 gap-4">
          {offers.map((offer, index) => (
            <Link key={index} href={offer.disabled ? '#' : offer.href} className={offer.disabled ? 'pointer-events-none' : ''}>
              <Card
                className={`flex h-32 flex-col items-center justify-center rounded-2xl ${
                  offer.disabled
                    ? 'bg-gray-700'
                    : 'bg-gradient-to-br from-purple-700 to-blue-700'
                }`}
              >
                <CardContent className="flex flex-col items-center justify-center text-center">
                  {offer.icon}
                  <p className="mt-2 text-sm font-semibold">{offer.title}</p>
                  {offer.status && (
                    <p className="text-xs text-gray-400">{offer.status}</p>
                  )}
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
