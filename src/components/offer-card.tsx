import Image from 'next/image';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

type Offer = {
  id: string;
  title: string;
  description: string;
  reward: string;
  imageUrl: string;
  imageHint: string;
};

interface OfferCardProps {
  offer: Offer;
}

export function OfferCard({ offer }: OfferCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-primary/20 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={offer.imageUrl}
            alt={offer.title}
            fill
            className="object-cover"
            data-ai-hint={offer.imageHint}
          />
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <Badge variant="secondary" className="mb-2">{offer.reward}</Badge>
        <CardTitle className="mb-2 text-lg font-semibold">{offer.title}</CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-2">{offer.description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full group">
          Start Offer <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </CardFooter>
    </Card>
  );
}
