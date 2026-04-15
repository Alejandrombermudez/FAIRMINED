import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: '%s | Fairmined',
    default: 'Fairmined — Responsible Mining Certification',
  },
  description:
    'Fairmined certifies gold from artisanal and small-scale mining operations, ensuring responsible practices and fair prices for mining communities.',
  metadataBase: new URL('https://fairmined.org'),
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ lang: locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!hasLocale(routing.locales, lang)) {
    notFound();
  }

  setRequestLocale(lang);

  const messages = await getMessages();

  return (
    // We don't render <html>/<body> here — they're in the root layout (app/layout.tsx).
    // We use a script tag to set the lang attribute dynamically on the <html> element.
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.lang = '${lang}'; document.documentElement.className = '${inter.variable} h-full antialiased';`,
        }}
      />
      <NextIntlClientProvider locale={lang} messages={messages}>
        {children}
      </NextIntlClientProvider>
    </>
  );
}
