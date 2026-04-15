import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { PortableText } from '@portabletext/react';
import { routing } from '@/i18n/routing';
import { client } from '@/sanity/client';
import { urlFor } from '@/sanity/image';
import { postBySlugQuery, allPostsQuery, localize, type PostFull, type PostCard, type Locale } from '@/sanity/queries';

export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await client.fetch<PostCard[]>(allPostsQuery);
  return routing.locales.flatMap((lang) =>
    posts
      .filter((post) => {
        const slug = post.slug?.current ?? '';
        // Excluir: externas, sin slug, o slugs que sean URLs (datos corruptos de prueba)
        return (
          post.postType !== 'external' &&
          slug.length > 0 &&
          !slug.startsWith('http')
        );
      })
      .map((post) => ({ lang, slug: post.slug!.current }))
  );
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  setRequestLocale(lang);
  const locale = lang as Locale;

  const post = await client.fetch<PostFull>(postBySlugQuery, { slug });
  if (!post) notFound();

  const title = localize(post.title, locale) || localize(post.title, 'en') || '';
  const excerpt = localize(post.excerpt, locale) || localize(post.excerpt, 'en') || '';
  const body = (post.body?.[locale] || post.body?.en) as unknown[];
  const hasImage = post.featuredImage?.asset;

  const date = new Date(post.publishedAt).toLocaleDateString(
    locale === 'es' ? 'es-CO' : locale === 'de' ? 'de-DE' : locale === 'fr' ? 'fr-FR' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );

  const CATEGORY_LABELS: Record<string, Record<Locale, string>> = {
    'news': { en: 'News', es: 'Noticias', de: 'Nachrichten', fr: 'Actualités' },
    'success-story': { en: 'Success Story', es: 'Historia de Éxito', de: 'Erfolgsgeschichte', fr: 'Histoire de succès' },
    'impact': { en: 'Impact', es: 'Impacto', de: 'Wirkung', fr: 'Impact' },
    'certification': { en: 'Certification', es: 'Certificación', de: 'Zertifizierung', fr: 'Certification' },
  };

  return (
    <article className="min-h-screen bg-white">
      {/* Hero image */}
      {hasImage && (
        <div className="relative h-[50vh] w-full overflow-hidden bg-stone-900">
          <Image
            src={urlFor(post.featuredImage).width(1600).height(900).url()}
            alt={post.featuredImage.alt ?? title}
            fill
            priority
            className="object-cover opacity-80"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Back link */}
        <Link
          href={`/${locale}/news`}
          className="inline-flex items-center gap-2 text-amber-600 font-medium mb-8 hover:text-amber-700"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {locale === 'es' ? 'Volver a noticias' : locale === 'de' ? 'Zurück' : locale === 'fr' ? 'Retour' : 'Back to news'}
        </Link>

        {/* Meta */}
        <div className="flex items-center gap-3 mb-4">
          {post.category && (
            <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
              {CATEGORY_LABELS[post.category]?.[locale] ?? post.category}
            </span>
          )}
          <time className="text-gray-400 text-sm">{date}</time>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-6">{title}</h1>

        {/* Excerpt */}
        {excerpt && (
          <p className="text-xl text-gray-500 leading-relaxed mb-10 pb-10 border-b border-stone-200">
            {excerpt}
          </p>
        )}

        {/* Body */}
        {body ? (
          <div className="prose prose-lg prose-amber max-w-none">
            <PortableText value={body as Parameters<typeof PortableText>[0]['value']} />
          </div>
        ) : (
          <p className="text-gray-400 italic">
            {locale === 'es'
              ? 'Contenido en este idioma aún no disponible. Agrégalo desde Sanity Studio.'
              : 'Content in this language not yet available. Add it from Sanity Studio.'}
          </p>
        )}
      </div>
    </article>
  );
}
