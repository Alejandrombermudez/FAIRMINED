import { groq } from 'next-sanity';

// ─── Types ───────────────────────────────────────────────────────────────────

export type Locale = 'en' | 'es' | 'de' | 'fr';

export type LocalizedString = { en?: string; es?: string; de?: string; fr?: string };

export type SanityImage = {
  _type: 'image';
  asset: { _ref: string; _type: 'reference' };
  hotspot?: { x: number; y: number };
  alt?: string;
};

export type ImpactNumber = {
  _key: string;
  number: string;
  label: LocalizedString;
  icon?: string;
};

export type HomepageData = {
  heroTitle: LocalizedString;
  heroSubtitle: LocalizedString;
  heroImage: SanityImage;
  heroCtaText: LocalizedString;
  impactNumbers: ImpactNumber[];
  aboutTitle: LocalizedString;
  aboutText: LocalizedString;
  aboutImage: SanityImage;
  suppliersTitle: LocalizedString;
  suppliersSubtitle: LocalizedString;
  featuredSuppliers: SupplierCard[];
  newsTitle: LocalizedString;
  newsSubtitle: LocalizedString;
};

export type SupplierCard = {
  _id: string;
  name: string;
  slug: { current: string };
  logo: SanityImage;
  country: string;
  region: string;
  website?: string;
  certifiedMetals: string[];
  description: LocalizedString;
  featured: boolean;
};

export type PostCard = {
  _id: string;
  postType: 'internal' | 'external';
  title: LocalizedString;
  slug?: { current: string };
  externalUrl?: string;
  publishedAt: string;
  featuredImage: SanityImage;
  category: string;
  excerpt: LocalizedString;
};

export type PostFull = PostCard & {
  body: {
    en?: unknown[];
    es?: unknown[];
    de?: unknown[];
    fr?: unknown[];
  };
};

// ─── Queries ─────────────────────────────────────────────────────────────────

export const homepageQuery = groq`
  *[_type == "homepage" && _id == "homepage"][0] {
    heroTitle,
    heroSubtitle,
    heroImage { ..., asset-> },
    heroCtaText,
    impactNumbers[] {
      _key,
      number,
      label,
      icon
    },
    aboutTitle,
    aboutText,
    aboutImage { ..., asset-> },
    suppliersTitle,
    suppliersSubtitle,
    featuredSuppliers[]-> {
      _id,
      name,
      slug,
      logo { ..., asset-> },
      country,
      region,
      website,
      certifiedMetals,
      description,
      featured
    },
    newsTitle,
    newsSubtitle
  }
`;

export const latestPostsQuery = groq`
  *[_type == "post"] | order(publishedAt desc) [0...3] {
    _id,
    postType,
    title,
    slug,
    externalUrl,
    publishedAt,
    featuredImage { ..., asset-> },
    category,
    excerpt
  }
`;

export const allPostsQuery = groq`
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    postType,
    title,
    slug,
    externalUrl,
    publishedAt,
    featuredImage { ..., asset-> },
    category,
    excerpt
  }
`;

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    postType,
    title,
    slug,
    externalUrl,
    publishedAt,
    featuredImage { ..., asset-> },
    category,
    excerpt,
    body
  }
`;

export const allSuppliersQuery = groq`
  *[_type == "supplier"] | order(name asc) {
    _id,
    name,
    slug,
    logo { ..., asset-> },
    country,
    region,
    website,
    certifiedMetals,
    description,
    featured
  }
`;

// Helper to extract localized value.
// Fallback order: idioma pedido → español → inglés → cualquier otro que exista
export function localize(value: LocalizedString | undefined, locale: Locale): string {
  if (!value) return '';
  return value[locale] || value.es || value.en || value.fr || value.de || '';
}
