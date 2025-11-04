import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ComingSoonPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
      <div className="container mx-auto flex flex-col items-center justify-center px-4 py-12 text-center">
        <h1 className="mb-4 text-6xl font-bold text-primary">Coming Soon</h1>
        <p className="mb-8 max-w-2xl text-lg text-muted-foreground">
          We are working hard to bring you this feature. Stay tuned!
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
