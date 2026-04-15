import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ lang: locale }));
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  setRequestLocale(lang);

  return <HomeContent />;
}

function HomeContent() {
  const t = useTranslations('home');

  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative flex items-center justify-center min-h-[80vh] bg-amber-900 text-white">
        <div className="text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            {t('hero.tagline')}
          </h1>
          <a
            href="#what-is-fairmined"
            className="inline-block bg-amber-500 hover:bg-amber-400 text-white font-semibold px-8 py-4 rounded-full transition-colors"
          >
            {t('hero.cta')}
          </a>
        </div>
      </section>

      {/* Content Sections Placeholder */}
      <section id="what-is-fairmined" className="py-24 px-4 max-w-7xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-center text-amber-900 mb-12">
          {t('sections.whatIsFairmined')}
        </h2>
        <p className="text-center text-gray-500 text-lg">
          Content coming from Sanity CMS
        </p>
      </section>
    </main>
  );
}
