import { defineField, defineType } from 'sanity';

export const supplier = defineType({
  name: 'supplier',
  title: '🏭 Proveedor',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre de la empresa',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: { source: 'name' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo o imagen principal',
      type: 'image',
      description: 'Imagen que aparece en la tarjeta del proveedor',
      options: { hotspot: true },
      fields: [{ name: 'alt', title: 'Texto alternativo', type: 'string' }],
    }),
    defineField({
      name: 'country',
      title: 'País',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'region',
      title: 'Región',
      type: 'string',
      options: {
        list: [
          { title: 'Europa', value: 'europe' },
          { title: 'Norteamérica', value: 'north-america' },
          { title: 'Latinoamérica', value: 'latin-america' },
          { title: 'Asia', value: 'asia' },
          { title: 'África', value: 'africa' },
          { title: 'Oceanía', value: 'oceania' },
        ],
      },
    }),
    defineField({
      name: 'website',
      title: 'Sitio web',
      type: 'url',
    }),
    defineField({
      name: 'certifiedMetals',
      title: 'Metales certificados',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Fairmined Gold', value: 'fairmined-gold' },
          { title: 'Fairmined ECO Gold', value: 'fairmined-eco-gold' },
          { title: 'Fairmined Silver', value: 'fairmined-silver' },
          { title: 'Fairmined Platinum Group Metals', value: 'fairmined-pgm' },
        ],
      },
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'object',
      description: 'Breve descripción del proveedor (aparece en su tarjeta)',
      fields: [
        { name: 'en', title: '🇬🇧 English', type: 'text', rows: 3 },
        { name: 'es', title: '🇪🇸 Español', type: 'text', rows: 3 },
        { name: 'de', title: '🇩🇪 Deutsch', type: 'text', rows: 3 },
        { name: 'fr', title: '🇫🇷 Français', type: 'text', rows: 3 },
      ],
    }),
    defineField({
      name: 'products',
      title: 'Productos',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Aleaciones', value: 'alloys' },
          { title: 'Lingotes', value: 'bullion' },
          { title: 'Cadenas', value: 'chains' },
          { title: 'Hallazgos / Findings', value: 'findings' },
          { title: 'Alambre', value: 'wire' },
          { title: 'Lámina', value: 'sheet' },
          { title: 'Joyería terminada', value: 'jewelry' },
        ],
      },
    }),
    defineField({
      name: 'featured',
      title: '⭐ Destacado en homepage',
      type: 'boolean',
      description: 'Activa esto para que aparezca en la sección de proveedores de la portada',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'country',
      media: 'logo',
    },
  },
});
