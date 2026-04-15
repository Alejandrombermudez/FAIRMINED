import { defineField, defineType } from 'sanity';

export const post = defineType({
  name: 'post',
  title: '📰 Noticia / Artículo',
  type: 'document',
  groups: [
    { name: 'general', title: '① General', default: true },
    { name: 'content', title: '② Contenido' },
  ],
  fields: [
    // ── Tipo de noticia ──────────────────────────────────────────────────────
    defineField({
      name: 'postType',
      title: 'Tipo de noticia',
      type: 'string',
      group: 'general',
      options: {
        list: [
          {
            title: '✍️ Noticia propia — tiene contenido aquí',
            value: 'internal',
          },
          {
            title: '🔗 Noticia externa — abre un enlace externo',
            value: 'external',
          },
        ],
        layout: 'radio',
      },
      initialValue: 'internal',
      validation: (Rule) => Rule.required(),
    }),

    // ── Título ───────────────────────────────────────────────────────────────
    defineField({
      name: 'title',
      title: 'Título',
      type: 'object',
      group: 'general',
      fields: [
        { name: 'es', title: '🇪🇸 Español', type: 'string' },
        { name: 'en', title: '🇬🇧 English', type: 'string' },
        { name: 'de', title: '🇩🇪 Deutsch', type: 'string' },
        { name: 'fr', title: '🇫🇷 Français', type: 'string' },
      ],
      validation: (Rule) => Rule.required(),
    }),

    // ── Slug (solo para noticias propias) ────────────────────────────────────
    defineField({
      name: 'slug',
      title: 'URL de la noticia',
      type: 'slug',
      group: 'general',
      description: 'Generada automáticamente desde el título en español. Dale clic a "Generate".',
      options: {
        // Usa español primero, luego inglés como fallback
        source: (doc: Record<string, unknown>) => {
          const title = doc.title as Record<string, string> | undefined;
          return title?.es || title?.en || '';
        },
        maxLength: 96,
        slugify: (input: string) =>
          input
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // quita tildes
            .replace(/[^a-z0-9\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-'),
      },
      hidden: ({ document }) => document?.postType === 'external',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (context.document?.postType === 'internal' && !value?.current) {
            return 'La URL es obligatoria para noticias propias. Dale clic a "Generate".';
          }
          return true;
        }),
    }),

    // ── URL externa (solo para noticias externas) ────────────────────────────
    defineField({
      name: 'externalUrl',
      title: 'Enlace externo',
      type: 'url',
      group: 'general',
      description: 'Al hacer clic en la noticia se abrirá este enlace en una nueva pestaña.',
      hidden: ({ document }) => document?.postType !== 'external',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (context.document?.postType === 'external' && !value) {
            return 'El enlace es obligatorio para noticias externas.';
          }
          return true;
        }),
    }),

    // ── Fecha ────────────────────────────────────────────────────────────────
    defineField({
      name: 'publishedAt',
      title: 'Fecha de publicación',
      type: 'datetime',
      group: 'general',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),

    // ── Categoría ────────────────────────────────────────────────────────────
    defineField({
      name: 'category',
      title: 'Categoría',
      type: 'string',
      group: 'general',
      options: {
        list: [
          { title: '📢 Noticias', value: 'news' },
          { title: '🌟 Historia de éxito', value: 'success-story' },
          { title: '📊 Impacto', value: 'impact' },
          { title: '📜 Certificación', value: 'certification' },
        ],
        layout: 'radio',
      },
    }),

    // ── Imagen principal ─────────────────────────────────────────────────────
    defineField({
      name: 'featuredImage',
      title: 'Imagen principal',
      type: 'image',
      group: 'general',
      description: 'Imagen que aparece en la tarjeta de la noticia',
      options: { hotspot: true },
      fields: [{ name: 'alt', title: 'Descripción de la imagen', type: 'string' }],
    }),

    // ── Resumen ───────────────────────────────────────────────────────────────
    defineField({
      name: 'excerpt',
      title: 'Resumen (aparece en la tarjeta)',
      type: 'object',
      group: 'general',
      fields: [
        { name: 'es', title: '🇪🇸 Español', type: 'text', rows: 3 },
        { name: 'en', title: '🇬🇧 English', type: 'text', rows: 3 },
        { name: 'de', title: '🇩🇪 Deutsch', type: 'text', rows: 3 },
        { name: 'fr', title: '🇫🇷 Français', type: 'text', rows: 3 },
      ],
    }),

    // ── Contenido (solo noticias propias) ────────────────────────────────────
    defineField({
      name: 'body',
      title: 'Contenido del artículo',
      type: 'object',
      group: 'content',
      description: 'Contenido completo — solo para noticias propias.',
      hidden: ({ document }) => document?.postType === 'external',
      fields: [
        {
          name: 'es',
          title: '🇪🇸 Español',
          type: 'array',
          of: [
            {
              type: 'block',
              styles: [
                { title: 'Normal', value: 'normal' },
                { title: 'Título H2', value: 'h2' },
                { title: 'Título H3', value: 'h3' },
                { title: 'Cita', value: 'blockquote' },
              ],
              marks: {
                decorators: [
                  { title: 'Negrita', value: 'strong' },
                  { title: 'Cursiva', value: 'em' },
                ],
                annotations: [
                  {
                    name: 'link',
                    type: 'object',
                    title: 'Enlace',
                    fields: [{ name: 'href', type: 'url', title: 'URL' }],
                  },
                ],
              },
            },
            {
              type: 'image',
              options: { hotspot: true },
              fields: [{ name: 'alt', type: 'string', title: 'Descripción de la imagen' }],
            },
          ],
        },
        {
          name: 'en',
          title: '🇬🇧 English',
          type: 'array',
          of: [{ type: 'block' }, { type: 'image' }],
        },
        {
          name: 'de',
          title: '🇩🇪 Deutsch',
          type: 'array',
          of: [{ type: 'block' }, { type: 'image' }],
        },
        {
          name: 'fr',
          title: '🇫🇷 Français',
          type: 'array',
          of: [{ type: 'block' }, { type: 'image' }],
        },
      ],
    }),
  ],

  preview: {
    select: {
      title: 'title.es',
      titleEn: 'title.en',
      date: 'publishedAt',
      media: 'featuredImage',
      postType: 'postType',
    },
    prepare({ title, titleEn, date, media, postType }) {
      const typeIcon = postType === 'external' ? '🔗' : '✍️';
      return {
        title: `${typeIcon} ${title || titleEn || 'Sin título'}`,
        subtitle: date ? new Date(date).toLocaleDateString('es-CO') : 'Sin fecha',
        media,
      };
    },
  },
});
