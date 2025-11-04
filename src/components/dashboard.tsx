import Image from 'next/image';
import { DollarSign, Zap } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Header } from './header';
import { OfferCard } from './offer-card';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type Offer = {
  id: string;
  title: string;
  description: string;
  reward: string;
  imageUrl: string;
  imageHint: string;
};

const offers: Offer[] = PlaceHolderImages.filter(img => img.id.startsWith('offer-')).map((img, index) => ({
  id: `offer-${index + 1}`,
  title: `Complete Survey #${index + 1}`,
  description: `Share your opinion on the latest tech trends and earn rewards. Your feedback helps shape future products.`,
  reward: `$${(Math.random() * 5 + 1).toFixed(2)}`,
  imageUrl: img.imageUrl,
  imageHint: img.imageHint,
}));

export default function Dashboard() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Rewards</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231.89</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Offers Completed</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+23</div>
              <p className="text-xs text-muted-foreground">+5 since last week</p>
            </CardContent>
          </Card>
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-4">Available Offers</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {offers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
