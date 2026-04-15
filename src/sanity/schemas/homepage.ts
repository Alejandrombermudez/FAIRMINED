import { defineField, defineType } from 'sanity';

// Helper to create a localized string field
const localizedString = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: 'object',
    fields: [
      { name: 'en', title: '🇬🇧 English', type: 'string' },
      { name: 'es', title: '🇪🇸 Español', type: 'string' },
      { name: 'de', title: '🇩🇪 Deutsch', type: 'string' },
      { name: 'fr', title: '🇫🇷 Français', type: 'string' },
    ],
  });

const localizedText = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: 'object',
    fields: [
      { name: 'en', title: '🇬🇧 English', type: 'text', rows: 3 },
      { name: 'es', title: '🇪🇸 Español', type: 'text', rows: 3 },
      { name: 'de', title: '🇩🇪 Deutsch', type: 'text', rows: 3 },
      { name: 'fr', title: '🇫🇷 Français', type: 'text', rows: 3 },
    ],
  });

export const homepage = defineType({
  name: 'homepage',
  title: '🏠 Homepage',
  type: 'document',
  groups: [
    { name: 'hero', title: '① Hero (portada)' },
    { name: 'impact', title: '② Números de impacto' },
    { name: 'about', title: '③ Qué es Fairmined' },
    { name: 'suppliers', title: '④ Proveedores destacados' },
    { name: 'news', title: '⑤ Sección de noticias' },
  ],
  fields: [
    // ─── HERO ────────────────────────────────────────────────────────────────
    defineField({
      name: 'heroTitle',
      title: 'Título principal',
      type: 'object',
      group: 'hero',
      description: 'El texto grande que aparece en la portada',
      fields: [
        { name: 'en', title: '🇬🇧 English', type: 'string' },
        { name: 'es', title: '🇪🇸 Español', type: 'string' },
        { name: 'de', title: '🇩🇪 Deutsch', type: 'string' },
        { name: 'fr', title: '🇫🇷 Français', type: 'string' },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Subtítulo',
      type: 'object',
      group: 'hero',
      description: 'Texto debajo del título principal',
      fields: [
        { name: 'en', title: '🇬🇧 English', type: 'text', rows: 2 },
        { name: 'es', title: '🇪🇸 Español', type: 'text', rows: 2 },
        { name: 'de', title: '🇩🇪 Deutsch', type: 'text', rows: 2 },
        { name: 'fr', title: '🇫🇷 Français', type: 'text', rows: 2 },
      ],
    }),
    defineField({
      name: 'heroImage',
      title: 'Imagen de fondo',
      type: 'image',
      group: 'hero',
      description: 'Imagen principal de la portada (recomendado: 1920×1080px)',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          title: 'Texto alternativo (accesibilidad)',
          type: 'string',
        },
      ],
    }),
    defineField({
      name: 'heroCtaText',
      title: 'Texto del botón CTA',
      type: 'object',
      group: 'hero',
      description: 'Texto del botón de llamado a la acción',
      fields: [
        { name: 'en', title: '🇬🇧 English', type: 'string' },
        { name: 'es', title: '🇪🇸 Español', type: 'string' },
        { name: 'de', title: '🇩🇪 Deutsch', type: 'string' },
        { name: 'fr', title: '🇫🇷 Français', type: 'string' },
      ],
    }),

    // ─── IMPACT NUMBERS ──────────────────────────────────────────────────────
    defineField({
      name: 'impactNumbers',
      title: 'Números de impacto',
      type: 'array',
      group: 'impact',
      description: 'Cifras destacadas que aparecen en la sección de impacto (ej: "40+ Mines", "4 Countries")',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'number',
              title: 'Número o cifra',
              type: 'string',
              description: 'Ej: "40+", "USD $4", "4"',
            },
            {
              name: 'label',
              title: 'Etiqueta',
              type: 'object',
              fields: [
                { name: 'en', title: '🇬🇧 English', type: 'string' },
                { name: 'es', title: '🇪🇸 Español', type: 'string' },
                { name: 'de', title: '🇩🇪 Deutsch', type: 'string' },
                { name: 'fr', title: '🇫🇷 Français', type: 'string' },
              ],
            },
            {
              name: 'icon',
              title: 'Emoji / ícono',
              type: 'string',
              description: 'Ej: ⛏️ 🌍 💰 ♻️',
            },
          ],
          preview: {
            select: { title: 'number', subtitle: 'label.en' },
          },
        },
      ],
    }),

    // ─── ABOUT SECTION ───────────────────────────────────────────────────────
    localizedString('aboutTitle', 'Título "Qué es Fairmined"'),
    localizedText('aboutText', 'Texto descriptivo'),
    defineField({
      name: 'aboutImage',
      title: 'Imagen de la sección',
      type: 'image',
      group: 'about',
      options: { hotspot: true },
    }),

    // ─── SUPPLIERS SECTION ───────────────────────────────────────────────────
    defineField({
      name: 'suppliersTitle',
      title: 'Título de la sección proveedores',
      type: 'object',
      group: 'suppliers',
      fields: [
        { name: 'en', title: '🇬🇧 English', type: 'string' },
        { name: 'es', title: '🇪🇸 Español', type: 'string' },
        { name: 'de', title: '🇩🇪 Deutsch', type: 'string' },
        { name: 'fr', title: '🇫🇷 Français', type: 'string' },
      ],
    }),
    defineField({
      name: 'suppliersSubtitle',
      title: 'Subtítulo de la sección proveedores',
      type: 'object',
      group: 'suppliers',
      fields: [
        { name: 'en', title: '🇬🇧 English', type: 'text', rows: 2 },
        { name: 'es', title: '🇪🇸 Español', type: 'text', rows: 2 },
        { name: 'de', title: '🇩🇪 Deutsch', type: 'text', rows: 2 },
        { name: 'fr', title: '🇫🇷 Français', type: 'text', rows: 2 },
      ],
    }),
    defineField({
      name: 'featuredSuppliers',
      title: 'Proveedores destacados (aparecen en homepage)',
      type: 'array',
      group: 'suppliers',
      description: 'Selecciona hasta 6 proveedores para mostrar en la portada',
      of: [{ type: 'reference', to: [{ type: 'supplier' }] }],
      validation: (Rule) => Rule.max(6),
    }),

    // ─── NEWS SECTION ─────────────────────────────────────────────────────────
    defineField({
      name: 'newsTitle',
      title: 'Título de la sección de noticias',
      type: 'object',
      group: 'news',
      fields: [
        { name: 'en', title: '🇬🇧 English', type: 'string' },
        { name: 'es', title: '🇪🇸 Español', type: 'string' },
        { name: 'de', title: '🇩🇪 Deutsch', type: 'string' },
        { name: 'fr', title: '🇫🇷 Français', type: 'string' },
      ],
    }),
    defineField({
      name: 'newsSubtitle',
      title: 'Subtítulo de la sección de noticias',
      type: 'object',
      group: 'news',
      fields: [
        { name: 'en', title: '🇬🇧 English', type: 'text', rows: 2 },
        { name: 'es', title: '🇪🇸 Español', type: 'text', rows: 2 },
        { name: 'de', title: '🇩🇪 Deutsch', type: 'text', rows: 2 },
        { name: 'fr', title: '🇫🇷 Français', type: 'text', rows: 2 },
      ],
    }),
  ],
});
