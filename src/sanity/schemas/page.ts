import { defineField, defineType } from 'sanity';

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'object',
      fields: [
        { name: 'en', title: 'English', type: 'string' },
        { name: 'es', title: 'Spanish', type: 'string' },
        { name: 'de', title: 'German', type: 'string' },
        { name: 'fr', title: 'French', type: 'string' },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title.en' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        {
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'object',
          fields: [
            { name: 'en', type: 'string', title: 'English' },
            { name: 'es', type: 'string', title: 'Spanish' },
            { name: 'de', type: 'string', title: 'German' },
            { name: 'fr', type: 'string', title: 'French' },
          ],
        },
        {
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'object',
          fields: [
            { name: 'en', type: 'text', title: 'English', rows: 2 },
            { name: 'es', type: 'text', title: 'Spanish', rows: 2 },
            { name: 'de', type: 'text', title: 'German', rows: 2 },
            { name: 'fr', type: 'text', title: 'French', rows: 2 },
          ],
        },
        { name: 'ogImage', title: 'OG Image', type: 'image' },
      ],
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'object',
      fields: [
        { name: 'en', title: 'English', type: 'array', of: [{ type: 'block' }, { type: 'image' }] },
        { name: 'es', title: 'Spanish', type: 'array', of: [{ type: 'block' }, { type: 'image' }] },
        { name: 'de', title: 'German', type: 'array', of: [{ type: 'block' }, { type: 'image' }] },
        { name: 'fr', title: 'French', type: 'array', of: [{ type: 'block' }, { type: 'image' }] },
      ],
    }),
  ],
  preview: {
    select: { title: 'title.en', slug: 'slug.current' },
    prepare({ title, slug }) {
      return { title, subtitle: `/${slug}` };
    },
  },
});
