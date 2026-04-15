import Image from 'next/image';
import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { client } from '@/sanity/client';
import { urlFor } from '@/sanity/image';
import {
  homepageQuery,
  latestPostsQuery,
  localize,
  type HomepageData,
  type PostCard,
  type Locale,
} from '@/sanity/queries';

// Revalidar cada 60 segundos — los cambios en Sanity aparecen en ~1 min
export const revalidate = 60;

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
  const locale = lang as Locale;

  const [homepage, latestPosts] = await Promise.all([
    client.fetch<HomepageData>(homepageQuery),
    client.fetch<PostCard[]>(latestPostsQuery),
  ]);

  return (
    <main>
      <HeroSection homepage={homepage} locale={locale} />
      <ImpactNumbers homepage={homepage} locale={locale} />
      <AboutSection homepage={homepage} locale={locale} />
      <SuppliersSection homepage={homepage} locale={locale} />
      <NewsSection homepage={homepage} posts={latestPosts} locale={locale} />
    </main>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroSection({ homepage, locale }: { homepage: HomepageData; locale: Locale }) {
  const title = localize(homepage?.heroTitle, locale) || 'Fairmined is the highest level of responsible mining';
  const subtitle = localize(homepage?.heroSubtitle, locale) || 'Traceable gold, extracted with best mining practices and social development.';
  const cta = localize(homepage?.heroCtaText, locale) || 'Learn More';
  const hasImage = homepage?.heroImage?.asset;

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-amber-950">
      {/* Background image */}
      {hasImage && (
        <Image
          src={urlFor(homepage.heroImage).width(1920).height(1080).url()}
          alt={homepage.heroImage.alt ?? 'Fairmined hero'}
          fill
          priority
          className="object-cover opacity-40"
          sizes="100vw"
        />
      )}
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <span className="inline-block bg-amber-500/90 text-white text-sm font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6">
          Fairmined Certified
        </span>
        <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6 drop-shadow-lg">
          {title}
        </h1>
        <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10 leading-relaxed">
          {subtitle}
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href={`/${locale}/news`}
            className="bg-amber-500 hover:bg-amber-400 text-white font-semibold px-8 py-4 rounded-full transition-all hover:scale-105 shadow-lg"
          >
            {cta}
          </Link>
          <Link
            href={`/${locale}/suppliers`}
            className="bg-white/10 hover:bg-white/20 text-white border border-white/30 font-semibold px-8 py-4 rounded-full transition-all hover:scale-105 backdrop-blur-sm"
          >
            {locale === 'es' ? 'Ver Proveedores' : locale === 'de' ? 'Lieferanten' : locale === 'fr' ? 'Fournisseurs' : 'Find Suppliers'}
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}

// ─── Impact Numbers ───────────────────────────────────────────────────────────

function ImpactNumbers({ homepage, locale }: { homepage: HomepageData; locale: Locale }) {
  // Fallback data if nothing in Sanity yet
  const numbers = homepage?.impactNumbers?.length
    ? homepage.impactNumbers
    : [
        { _key: '1', number: '40+', icon: '⛏️', label: { en: 'Certified Mines', es: 'Minas Certificadas', de: 'Zertifizierte Minen', fr: 'Mines Certifiées' } },
        { _key: '2', number: 'USD $4', icon: '💰', label: { en: 'Premium per gram', es: 'Prima por gramo', de: 'Prämie pro Gramm', fr: 'Prime par gramme' } },
        { _key: '3', number: '4', icon: '🌍', label: { en: 'Countries', es: 'Países', de: 'Länder', fr: 'Pays' } },
        { _key: '4', number: '100%', icon: '♻️', label: { en: 'Traceable Gold', es: 'Oro trazable', de: 'Rückverfolgbares Gold', fr: 'Or traçable' } },
      ];

  return (
    <section className="bg-amber-950 text-white py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {numbers.map((item) => (
            <div key={item._key} className="group">
              <div className="text-4xl mb-2">{item.icon}</div>
              <div className="text-4xl md:text-5xl font-bold text-amber-400 mb-2">
                {item.number}
              </div>
              <div className="text-sm text-amber-200/80 font-medium uppercase tracking-wide">
                {localize(item.label, locale)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── About Section ────────────────────────────────────────────────────────────

function AboutSection({ homepage, locale }: { homepage: HomepageData; locale: Locale }) {
  const title = localize(homepage?.aboutTitle, locale) || 'What is Fairmined?';
  const text = localize(homepage?.aboutText, locale) ||
    'Fairmined is an assurance label that certifies gold from artisanal and small-scale mining operations. It ensures the responsible origin of metal and the development of mining communities.';
  const hasImage = homepage?.aboutImage?.asset;

  return (
    <section id="what-is-fairmined" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-amber-600 font-semibold text-sm uppercase tracking-widest">
              About Fairmined
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-6 leading-tight">
              {title}
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              {text}
            </p>
            <Link
              href={`/${locale}/news`}
              className="inline-flex items-center gap-2 text-amber-600 font-semibold hover:text-amber-700 transition-colors"
            >
              {locale === 'es' ? 'Ver noticias' : locale === 'de' ? 'Nachrichten' : locale === 'fr' ? 'Actualités' : 'Read the news'}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="relative">
            {hasImage ? (
              <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src={urlFor(homepage.aboutImage).width(800).height(600).url()}
                  alt="What is Fairmined"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            ) : (
              <div className="h-96 bg-amber-100 rounded-2xl flex items-center justify-center">
                <span className="text-8xl">⛏️</span>
              </div>
            )}
            {/* Decorative badge */}
            <div className="absolute -bottom-6 -left-6 bg-amber-500 text-white rounded-2xl p-6 shadow-lg">
              <div className="text-2xl font-bold">2009</div>
              <div className="text-sm text-amber-100">Founded</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Suppliers Section ────────────────────────────────────────────────────────

const METAL_LABELS: Record<string, string> = {
  'fairmined-gold': 'Gold',
  'fairmined-eco-gold': 'ECO Gold',
  'fairmined-silver': 'Silver',
  'fairmined-pgm': 'PGM',
};

function SuppliersSection({ homepage, locale }: { homepage: HomepageData; locale: Locale }) {
  const title = localize(homepage?.suppliersTitle, locale) ||
    (locale === 'es' ? 'Proveedores Autorizados' : locale === 'de' ? 'Autorisierte Lieferanten' : locale === 'fr' ? 'Fournisseurs Autorisés' : 'Authorized Suppliers');
  const subtitle = localize(homepage?.suppliersSubtitle, locale) ||
    (locale === 'es' ? 'Empresas certificadas que ofrecen metales Fairmined a nivel mundial'
    : 'Certified companies offering Fairmined metals worldwide');
  const suppliers = homepage?.featuredSuppliers ?? [];

  return (
    <section className="py-24 bg-stone-50">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-amber-600 font-semibold text-sm uppercase tracking-widest">
            {locale === 'es' ? 'Red Global' : 'Global Network'}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-4">{title}</h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">{subtitle}</p>
        </div>

        {suppliers.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {suppliers.map((supplier) => (
                <SupplierCard key={supplier._id} supplier={supplier} locale={locale} />
              ))}
            </div>
            <div className="text-center mt-12">
              <Link
                href={`/${locale}/suppliers`}
                className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold px-8 py-4 rounded-full transition-all hover:scale-105 shadow"
              >
                {locale === 'es' ? 'Ver todos los proveedores' : locale === 'de' ? 'Alle Lieferanten' : locale === 'fr' ? 'Voir tous les fournisseurs' : 'View all suppliers'}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-16 text-gray-400">
            <div className="text-6xl mb-4">🏭</div>
            <p className="text-lg">
              {locale === 'es'
                ? 'Aún no hay proveedores destacados. Agrégalos desde el Studio → Proveedores.'
                : 'No featured suppliers yet. Add them from Studio → Suppliers.'}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function SupplierCard({ supplier, locale }: { supplier: NonNullable<HomepageData['featuredSuppliers']>[number]; locale: Locale }) {
  const description = localize(supplier.description, locale);
  const hasLogo = supplier.logo?.asset;

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-stone-100 group">
      {/* Logo/Image */}
      <div className="h-48 bg-stone-100 flex items-center justify-center p-6 overflow-hidden">
        {hasLogo ? (
          <div className="relative w-full h-full">
            <Image
              src={urlFor(supplier.logo).width(400).height(300).url()}
              alt={supplier.logo.alt ?? supplier.name}
              fill
              className="object-contain p-4 group-hover:scale-105 transition-transform"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        ) : (
          <div className="text-6xl">🏭</div>
        )}
      </div>

      {/* Info */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-bold text-gray-900 text-lg leading-tight">{supplier.name}</h3>
          <span className="text-xs text-gray-400 bg-stone-100 px-2 py-1 rounded-full ml-2 whitespace-nowrap">
            {supplier.country}
          </span>
        </div>

        {/* Certified metals badges */}
        {supplier.certifiedMetals?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {supplier.certifiedMetals.map((metal) => (
              <span
                key={metal}
                className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium"
              >
                {METAL_LABELS[metal] ?? metal}
              </span>
            ))}
          </div>
        )}

        {description && (
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">{description}</p>
        )}

        {supplier.website && (
          <a
            href={supplier.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-amber-600 text-sm font-medium mt-4 hover:text-amber-700"
          >
            {locale === 'es' ? 'Visitar sitio web' : 'Visit website'}
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}

// ─── News Section ─────────────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<string, Record<Locale, string>> = {
  'news': { en: 'News', es: 'Noticias', de: 'Nachrichten', fr: 'Actualités' },
  'success-story': { en: 'Success Story', es: 'Historia de Éxito', de: 'Erfolgsgeschichte', fr: 'Histoire de succès' },
  'impact': { en: 'Impact', es: 'Impacto', de: 'Wirkung', fr: 'Impact' },
  'certification': { en: 'Certification', es: 'Certificación', de: 'Zertifizierung', fr: 'Certification' },
};

function NewsSection({
  homepage,
  posts,
  locale,
}: {
  homepage: HomepageData;
  posts: PostCard[];
  locale: Locale;
}) {
  const title = localize(homepage?.newsTitle, locale) ||
    (locale === 'es' ? 'Últimas noticias' : locale === 'de' ? 'Neueste Nachrichten' : locale === 'fr' ? 'Dernières actualités' : 'Latest News');
  const subtitle = localize(homepage?.newsSubtitle, locale) ||
    (locale === 'es' ? 'Historias e impacto de la minería responsable'
    : 'Stories and impact from responsible mining');

  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <span className="text-amber-600 font-semibold text-sm uppercase tracking-widest">
              {locale === 'es' ? 'Noticias' : 'News'}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-2">{title}</h2>
            <p className="text-gray-500 text-lg">{subtitle}</p>
          </div>
          <Link
            href={`/${locale}/news`}
            className="text-amber-600 font-semibold hover:text-amber-700 flex items-center gap-1 whitespace-nowrap"
          >
            {locale === 'es' ? 'Ver todas' : locale === 'de' ? 'Alle anzeigen' : locale === 'fr' ? 'Voir tout' : 'View all'}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <NewsCard key={post._id} post={post} locale={locale} featured={index === 0} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400">
            <div className="text-6xl mb-4">📰</div>
            <p className="text-lg">
              {locale === 'es'
                ? 'Aún no hay noticias. Agrégalas desde el Studio → Noticias y artículos.'
                : 'No news yet. Add them from Studio → News & Articles.'}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function NewsCard({ post, locale, featured }: { post: PostCard; locale: Locale; featured: boolean }) {
  const title = localize(post.title, locale) ?? localize(post.title, 'en') ?? '';
  const excerpt = localize(post.excerpt, locale) ?? localize(post.excerpt, 'en') ?? '';
  const categoryLabel = CATEGORY_LABELS[post.category]?.[locale] ?? post.category;
  const hasImage = post.featuredImage?.asset;
  const date = new Date(post.publishedAt).toLocaleDateString(
    locale === 'es' ? 'es-CO' : locale === 'de' ? 'de-DE' : locale === 'fr' ? 'fr-FR' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );

  return (
    <Link href={`/${locale}/news/${post.slug.current}`} className="group block">
      <article className={`rounded-2xl overflow-hidden border border-stone-100 hover:shadow-lg transition-all hover:-translate-y-1 bg-white ${featured ? 'ring-2 ring-amber-200' : ''}`}>
        {/* Image */}
        <div className="h-52 bg-stone-100 overflow-hidden relative">
          {hasImage ? (
            <Image
              src={urlFor(post.featuredImage).width(600).height(400).url()}
              alt={post.featuredImage.alt ?? title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-amber-50 flex items-center justify-center text-5xl">
              📰
            </div>
          )}
          {/* Category badge */}
          <span className="absolute top-3 left-3 bg-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full">
            {categoryLabel}
          </span>
        </div>

        {/* Content */}
        <div className="p-6">
          <time className="text-xs text-gray-400 font-medium">{date}</time>
          <h3 className="font-bold text-gray-900 text-lg leading-snug mt-2 mb-3 group-hover:text-amber-700 transition-colors line-clamp-2">
            {title}
          </h3>
          {excerpt && (
            <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">{excerpt}</p>
          )}
        </div>
      </article>
    </Link>
  );
}
