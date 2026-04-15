import { defineField, defineType } from 'sanity';

export const post = defineType({
  name: 'post',
  title: 'News & Blog',
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
      options: { source: 'title.en', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        { name: 'alt', title: 'Alt Text', type: 'string' },
      ],
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'object',
      fields: [
        { name: 'en', title: 'English', type: 'text', rows: 3 },
        { name: 'es', title: 'Spanish', type: 'text', rows: 3 },
        { name: 'de', title: 'German', type: 'text', rows: 3 },
        { name: 'fr', title: 'French', type: 'text', rows: 3 },
      ],
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'News', value: 'news' },
          { title: 'Success Story', value: 'success-story' },
          { title: 'Impact', value: 'impact' },
          { title: 'Certification', value: 'certification' },
        ],
      },
    }),
    defineField({
      name: 'body',
      title: 'Body',
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
    select: {
      title: 'title.en',
      date: 'publishedAt',
      media: 'featuredImage',
    },
    prepare({ title, date, media }) {
      return {
        title,
        subtitle: date ? new Date(date).toLocaleDateString() : 'No date',
        media,
      };
    },
  },
});
