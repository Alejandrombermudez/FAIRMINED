import { defineField, defineType } from 'sanity';

export const certifiedMine = defineType({
  name: 'certifiedMine',
  title: 'Certified Mine',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Mine Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name' },
    }),
    defineField({
      name: 'country',
      title: 'Country',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'region',
      title: 'Region / State',
      type: 'string',
    }),
    defineField({
      name: 'certificationLevel',
      title: 'Certification Level',
      type: 'string',
      options: {
        list: [
          { title: 'Fairmined Standard', value: 'standard' },
          { title: 'Fairmined ECO', value: 'eco' },
        ],
      },
    }),
    defineField({
      name: 'metals',
      title: 'Metals Produced',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Gold', value: 'gold' },
          { title: 'Silver', value: 'silver' },
          { title: 'Platinum', value: 'platinum' },
        ],
      },
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', title: 'Alt Text', type: 'string' }],
    }),
    defineField({
      name: 'coordinates',
      title: 'Map Coordinates',
      type: 'object',
      fields: [
        { name: 'lat', title: 'Latitude', type: 'number' },
        { name: 'lng', title: 'Longitude', type: 'number' },
      ],
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'object',
      fields: [
        { name: 'en', title: 'English', type: 'text', rows: 4 },
        { name: 'es', title: 'Spanish', type: 'text', rows: 4 },
        { name: 'de', title: 'German', type: 'text', rows: 4 },
        { name: 'fr', title: 'French', type: 'text', rows: 4 },
      ],
    }),
    defineField({
      name: 'certifiedSince',
      title: 'Certified Since',
      type: 'date',
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'country', media: 'featuredImage' },
  },
});
