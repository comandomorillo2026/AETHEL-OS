'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Scale, Globe, LogOut, Lock } from 'lucide-react';
import { createPortalSession } from './actions';

function ClientPortalContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [accessCode, setAccessCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<'en' | 'es'>('en');

  const t = {
    en: {
      title: 'Client Portal',
      subtitle: 'Access your case information securely',
      accessCode: 'Access Code',
      placeholder: 'Enter your access code',
      submit: 'Access Portal',
      loading: 'Verifying...',
      error: 'Invalid access code',
    },
    es: {
      title: 'Portal del Cliente',
      subtitle: 'Acceda a su información de caso de forma segura',
      accessCode: 'Código de Acceso',
      placeholder: 'Ingrese su código de acceso',
      submit: 'Acceder al Portal',
      loading: 'Verificando...',
      error: 'Código de acceso inválido',
    },
  }[language];

  useEffect(() => {
    const lang = searchParams.get('lang');
    if (lang === 'es' || lang === 'en') {
      setLanguage(lang);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await createPortalSession(accessCode);
      if (result.success && result.caseId) {
        sessionStorage.setItem('portalCaseId', result.caseId);
        sessionStorage.setItem('portalLanguage', language);
        router.push(`/client-portal/case/${result.caseId}`);
      } else {
        setError(result.error || t.error);
      }
    } catch {
      setError(t.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#1E3A5F] to-[#2C4A6F] flex items-center justify-center mx-auto mb-4">
            <Scale className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">{t.title}</CardTitle>
          <p className="text-gray-500">{t.subtitle}</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>{t.accessCode}</Label>
              <Input
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                placeholder={t.placeholder}
                className="text-center text-lg tracking-widest"
                maxLength={8}
                required
              />
            </div>
            
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <Button
              type="submit"
              disabled={loading || !accessCode}
              className="w-full bg-[#1E3A5F] hover:bg-[#2C4A6F]"
            >
              {loading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  {t.loading}
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  {t.submit}
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
            >
              <Globe className="w-4 h-4 mr-2" />
              {language === 'en' ? 'ES' : 'EN'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ClientPortalPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1E3A5F]" />
      </div>
    }>
      <ClientPortalContent />
    </Suspense>
  );
}
