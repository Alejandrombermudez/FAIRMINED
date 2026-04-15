import Image from 'next/image';
import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { client } from '@/sanity/client';
import { urlFor } from '@/sanity/image';
import { allPostsQuery, localize, type PostCard, type Locale } from '@/sanity/queries';

export const revalidate = 60;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ lang: locale }));
}

const CATEGORY_LABELS: Record<string, Record<Locale, string>> = {
  'news': { en: 'News', es: 'Noticias', de: 'Nachrichten', fr: 'Actualités' },
  'success-story': { en: 'Success Story', es: 'Historia de Éxito', de: 'Erfolgsgeschichte', fr: 'Histoire de succès' },
  'impact': { en: 'Impact', es: 'Impacto', de: 'Wirkung', fr: 'Impact' },
  'certification': { en: 'Certification', es: 'Certificación', de: 'Zertifizierung', fr: 'Certification' },
};

export default async function NewsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  setRequestLocale(lang);
  const locale = lang as Locale;

  const posts = await client.fetch<PostCard[]>(allPostsQuery);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-amber-950 text-white py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {locale === 'es' ? 'Noticias y artículos' : locale === 'de' ? 'Nachrichten' : locale === 'fr' ? 'Actualités' : 'News & Articles'}
          </h1>
          <p className="text-amber-200 text-lg">
            {locale === 'es'
              ? 'Historias, logros e impacto de la minería responsable'
              : 'Stories, achievements and impact from responsible mining'}
          </p>
        </div>
      </div>

      {/* Posts */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => {
              const title = localize(post.title, locale) || localize(post.title, 'en') || '';
              const excerpt = localize(post.excerpt, locale) || localize(post.excerpt, 'en') || '';
              const hasImage = post.featuredImage?.asset;
              const categoryLabel = CATEGORY_LABELS[post.category]?.[locale] ?? post.category;
              const date = new Date(post.publishedAt).toLocaleDateString(
                locale === 'es' ? 'es-CO' : locale === 'de' ? 'de-DE' : locale === 'fr' ? 'fr-FR' : 'en-US',
                { year: 'numeric', month: 'long', day: 'numeric' }
              );

              return (
                <Link key={post._id} href={`/${locale}/news/${post.slug.current}`} className="group block">
                  <article className="rounded-2xl overflow-hidden border border-stone-100 hover:shadow-lg transition-all hover:-translate-y-1 bg-white h-full flex flex-col">
                    <div className="h-52 bg-stone-100 overflow-hidden relative flex-shrink-0">
                      {hasImage ? (
                        <Image
                          src={urlFor(post.featuredImage).width(600).height(400).url()}
                          alt={post.featuredImage.alt ?? title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-amber-50 flex items-center justify-center text-5xl">📰</div>
                      )}
                      {post.category && (
                        <span className="absolute top-3 left-3 bg-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                          {categoryLabel}
                        </span>
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <time className="text-xs text-gray-400 font-medium">{date}</time>
                      <h2 className="font-bold text-gray-900 text-lg leading-snug mt-2 mb-3 group-hover:text-amber-700 transition-colors line-clamp-2">
                        {title}
                      </h2>
                      {excerpt && (
                        <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 flex-1">{excerpt}</p>
                      )}
                      <span className="inline-flex items-center gap-1 text-amber-600 text-sm font-semibold mt-4">
                        {locale === 'es' ? 'Leer más' : locale === 'de' ? 'Mehr lesen' : locale === 'fr' ? 'Lire la suite' : 'Read more'}
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24 text-gray-400">
            <div className="text-6xl mb-4">📰</div>
            <p className="text-lg">
              {locale === 'es'
                ? 'Aún no hay artículos. Agrégalos desde Studio → Noticias y artículos.'
                : 'No articles yet. Add them from Studio → News & Articles.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
