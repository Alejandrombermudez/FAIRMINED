import { defineField, defineType } from 'sanity';

export const report = defineType({
  name: 'report',
  title: 'Report',
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
      name: 'year',
      title: 'Year',
      type: 'number',
      validation: (Rule) => Rule.required().min(2000).max(2100),
    }),
    defineField({
      name: 'type',
      title: 'Report Type',
      type: 'string',
      options: {
        list: [
          { title: 'Annual Report', value: 'annual' },
          { title: 'Impact Report', value: 'impact' },
          { title: 'Standard Document', value: 'standard' },
          { title: 'Other', value: 'other' },
        ],
      },
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'file',
      title: 'PDF File',
      type: 'file',
      options: { accept: 'application/pdf' },
    }),
    defineField({
      name: 'externalUrl',
      title: 'External URL (if hosted externally)',
      type: 'url',
    }),
    defineField({
      name: 'description',
      title: 'Short Description',
      type: 'object',
      fields: [
        { name: 'en', title: 'English', type: 'text', rows: 3 },
        { name: 'es', title: 'Spanish', type: 'text', rows: 3 },
        { name: 'de', title: 'German', type: 'text', rows: 3 },
        { name: 'fr', title: 'French', type: 'text', rows: 3 },
      ],
    }),
  ],
  preview: {
    select: { title: 'title.en', year: 'year', media: 'coverImage' },
    prepare({ title, year, media }) {
      return { title, subtitle: String(year), media };
    },
  },
});
