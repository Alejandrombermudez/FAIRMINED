import Image from 'next/image';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { client } from '@/sanity/client';
import { urlFor } from '@/sanity/image';
import { allSuppliersQuery, localize, type SupplierCard, type Locale } from '@/sanity/queries';

export const revalidate = 60;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ lang: locale }));
}

export default async function SuppliersPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  setRequestLocale(lang);
  const locale = lang as Locale;

  const suppliers = await client.fetch<SupplierCard[]>(allSuppliersQuery);

  const labels = {
    title: { en: 'Authorized Suppliers', es: 'Proveedores Autorizados', de: 'Autorisierte Lieferanten', fr: 'Fournisseurs Autorisés' },
    subtitle: {
      en: 'Find Fairmined certified metal suppliers worldwide',
      es: 'Encuentra proveedores de metales certificados Fairmined en todo el mundo',
      de: 'Finden Sie Fairmined-zertifizierte Metalllieferanten weltweit',
      fr: 'Trouvez des fournisseurs de métaux certifiés Fairmined dans le monde entier',
    },
    noResults: {
      en: 'No suppliers found. Add them from Studio → Authorized Suppliers.',
      es: 'Sin proveedores. Agrégalos desde Studio → Proveedores autorizados.',
      de: 'Keine Lieferanten. Fügen Sie sie über Studio → Autorisierte Lieferanten hinzu.',
      fr: "Aucun fournisseur. Ajoutez-les depuis Studio → Fournisseurs autorisés.",
    },
    visitWebsite: { en: 'Visit website', es: 'Sitio web', de: 'Website', fr: 'Site web' },
    allRegions: { en: 'All regions', es: 'Todas las regiones', de: 'Alle Regionen', fr: 'Toutes les régions' },
  };

  const METAL_LABELS: Record<string, string> = {
    'fairmined-gold': 'Gold',
    'fairmined-eco-gold': 'ECO Gold',
    'fairmined-silver': 'Silver',
    'fairmined-pgm': 'PGM',
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-amber-950 text-white py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {labels.title[locale]}
          </h1>
          <p className="text-amber-200 text-lg max-w-2xl mx-auto">
            {labels.subtitle[locale]}
          </p>
          <div className="mt-6 text-amber-400 font-semibold text-2xl">
            {suppliers.length} {locale === 'es' ? 'proveedores' : locale === 'de' ? 'Lieferanten' : locale === 'fr' ? 'fournisseurs' : 'suppliers'}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        {suppliers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {suppliers.map((supplier) => {
              const description = localize(supplier.description, locale);
              const hasLogo = supplier.logo?.asset;

              return (
                <article
                  key={supplier._id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-stone-100 group"
                >
                  {/* Logo */}
                  <div className="h-44 bg-stone-50 flex items-center justify-center p-6 overflow-hidden">
                    {hasLogo ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={urlFor(supplier.logo).width(400).height(250).url()}
                          alt={supplier.logo.alt ?? supplier.name}
                          fill
                          className="object-contain group-hover:scale-105 transition-transform"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                    ) : (
                      <span className="text-5xl">🏭</span>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="font-bold text-gray-900 text-lg">{supplier.name}</h2>
                      <span className="text-xs text-gray-400 bg-stone-100 px-2 py-1 rounded-full">
                        {supplier.country}
                      </span>
                    </div>

                    {/* Metals */}
                    {supplier.certifiedMetals?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {supplier.certifiedMetals.map((metal) => (
                          <span key={metal} className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium">
                            {METAL_LABELS[metal] ?? metal}
                          </span>
                        ))}
                      </div>
                    )}

                    {description && (
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-4">
                        {description}
                      </p>
                    )}

                    {supplier.website && (
                      <a
                        href={supplier.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-amber-600 text-sm font-semibold hover:text-amber-700"
                      >
                        {labels.visitWebsite[locale]}
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24 text-gray-400">
            <div className="text-6xl mb-4">🏭</div>
            <p className="text-lg">{labels.noResults[locale]}</p>
          </div>
        )}
      </div>
    </div>
  );
}
