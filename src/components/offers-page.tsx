'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ChevronRight, Gift } from 'lucide-react';
import { TapjoyIcon } from './tapjoy-icon';
import { PubscaleIcon } from './pubscale-icon';
import { TaskwallIcon } from './taskwall-icon';
import { FlexwallIcon } from './flexwall-icon';

const offerWalls = [
  {
    id: 'tapjoy',
    name: 'Tapjoy',
    description: 'Complete offers to earn rewards',
    icon: <TapjoyIcon />,
    bgColor: 'bg-orange-500',
    href: '/coming-soon',
  },
  {
    id: 'pubscale',
    name: 'PubScale',
    description: 'Earn rewards from PubScale Offerwall',
    icon: <PubscaleIcon />,
    bgColor: 'bg-purple-600',
    href: '/coming-soon',
  },
  {
    id: 'taskwall',
    name: 'TaskWall',
    description: 'Earn rewards by playing games',
    icon: <TaskwallIcon />,
    bgColor: 'bg-green-500',
    href: '/coming-soon',
  },
  {
    id: 'flexwall',
    name: 'FlexWall',
    description: 'Complete FlexWall offers to earn points',
    icon: <FlexwallIcon />,
    bgColor: 'bg-blue-500',
    href: '/coming-soon',
  },
];

export function OffersPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-900 text-white">
      <header className="flex items-center justify-between p-4">
        <Link href="/" className="p-2">
          <ArrowLeft />
        </Link>
        <div className="flex items-center gap-2">
          <Gift className="h-6 w-6 text-yellow-400" />
          <h1 className="text-xl font-bold">Earn Rewards</h1>
        </div>
        <div className="w-8"></div>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        <div className="mb-6 rounded-2xl bg-purple-600 p-6 text-left">
          <h2 className="text-2xl font-bold">Complete Offers & Earn</h2>
          <p className="text-purple-200">
            Pick an offer wall and start earning points
          </p>
        </div>

        <h3 className="mb-4 text-lg font-semibold text-gray-300">
          Available Offer Walls
        </h3>
        <div className="space-y-3">
          {offerWalls.map((wall) => (
            <Link href={wall.href} key={wall.id}>
              <div
                className={`flex items-center justify-between rounded-2xl p-4 ${wall.bgColor}`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white">
                    {wall.icon}
                  </div>
                  <div>
                    <p className="font-bold text-white">{wall.name}</p>
                    <p className="text-sm text-gray-200">{wall.description}</p>
                  </div>
                </div>
                <ChevronRight className="h-6 w-6 text-white" />
              </div>
            </Link>
          ))}
        </div>

        <h3 className="mt-8 mb-4 text-lg font-semibold text-gray-300">
          Recent Activity
        </h3>
        <div className="flex h-24 items-center justify-center rounded-2xl bg-gray-800">
            <p className="text-gray-500">No recent activity</p>
        </div>
      </main>
    </div>
  );
}
