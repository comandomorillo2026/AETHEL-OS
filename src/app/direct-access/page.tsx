'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function DirectAccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = searchParams.get('token');
    const industry = searchParams.get('industry');
    
    if (token && industry) {
      // Process direct access
      setTimeout(() => {
        setLoading(false);
        router.push(`/${industry}`);
      }, 1000);
    } else {
      setLoading(false);
    }
  }, [searchParams, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6C3FCE]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-6 text-center">
          <h1 className="text-xl font-bold mb-4">Direct Access</h1>
          <p className="text-muted-foreground mb-4">Invalid or expired access link</p>
          <Button onClick={() => router.push('/login')}>
            Go to Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function DirectAccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6C3FCE]" />
      </div>
    }>
      <DirectAccessContent />
    </Suspense>
  );
}
