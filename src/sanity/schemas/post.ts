import { defineField, defineType } from 'sanity';

export const post = defineType({
  name: 'post',
  title: '📰 Noticia / Artículo',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'object',
      description: 'Título del artículo en cada idioma',
      fields: [
        { name: 'en', title: '🇬🇧 English', type: 'string' },
        { name: 'es', title: '🇪🇸 Español', type: 'string' },
        { name: 'de', title: '🇩🇪 Deutsch', type: 'string' },
        { name: 'fr', title: '🇫🇷 Français', type: 'string' },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL del artículo)',
      type: 'slug',
      options: { source: 'title.en', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Fecha de publicación',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'featuredImage',
      title: 'Imagen principal',
      type: 'image',
      description: 'Imagen que aparece en la tarjeta y al inicio del artículo',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          title: 'Texto alternativo',
          type: 'string',
        },
      ],
    }),
    defineField({
      name: 'category',
      title: 'Categoría',
      type: 'string',
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
    defineField({
      name: 'excerpt',
      title: 'Resumen (aparece en la tarjeta de la noticia)',
      type: 'object',
      fields: [
        { name: 'en', title: '🇬🇧 English', type: 'text', rows: 3 },
        { name: 'es', title: '🇪🇸 Español', type: 'text', rows: 3 },
        { name: 'de', title: '🇩🇪 Deutsch', type: 'text', rows: 3 },
        { name: 'fr', title: '🇫🇷 Français', type: 'text', rows: 3 },
      ],
    }),
    defineField({
      name: 'body',
      title: 'Contenido del artículo',
      type: 'object',
      description: 'Contenido completo — usa los botones de formato para negritas, listas, links, etc.',
      fields: [
        {
          name: 'en',
          title: '🇬🇧 English',
          type: 'array',
          of: [
            {
              type: 'block',
              styles: [
                { title: 'Normal', value: 'normal' },
                { title: 'H2', value: 'h2' },
                { title: 'H3', value: 'h3' },
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
                    title: 'Link',
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
          name: 'es',
          title: '🇪🇸 Español',
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
      title: 'title.en',
      date: 'publishedAt',
      media: 'featuredImage',
      category: 'category',
    },
    prepare({ title, date, media, category }) {
      const categoryEmoji: Record<string, string> = {
        'news': '📢',
        'success-story': '🌟',
        'impact': '📊',
        'certification': '📜',
      };
      return {
        title: title ?? 'Sin título',
        subtitle: `${categoryEmoji[category] ?? ''} ${date ? new Date(date).toLocaleDateString('es-CO') : 'Sin fecha'}`,
        media,
      };
    },
  },
});
