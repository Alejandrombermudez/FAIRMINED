import { defineField, defineType } from 'sanity';

export const supplier = defineType({
  name: 'supplier',
  title: 'Authorized Supplier',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Company Name',
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
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'country',
      title: 'Country',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'region',
      title: 'Region',
      type: 'string',
      options: {
        list: [
          { title: 'Europe', value: 'europe' },
          { title: 'North America', value: 'north-america' },
          { title: 'Latin America', value: 'latin-america' },
          { title: 'Asia', value: 'asia' },
          { title: 'Africa', value: 'africa' },
          { title: 'Oceania', value: 'oceania' },
        ],
      },
    }),
    defineField({
      name: 'website',
      title: 'Website',
      type: 'url',
    }),
    defineField({
      name: 'email',
      title: 'Contact Email',
      type: 'email',
    }),
    defineField({
      name: 'certifiedMetals',
      title: 'Certified Metals Offered',
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
      name: 'products',
      title: 'Products',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Alloys', value: 'alloys' },
          { title: 'Bullion', value: 'bullion' },
          { title: 'Chains', value: 'chains' },
          { title: 'Findings', value: 'findings' },
          { title: 'Wire', value: 'wire' },
          { title: 'Sheet', value: 'sheet' },
          { title: 'Jewelry', value: 'jewelry' },
        ],
      },
    }),
    defineField({
      name: 'services',
      title: 'Services',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Casting', value: 'casting' },
          { title: 'Refining', value: 'refining' },
          { title: 'Jewelry Manufacturing', value: 'jewelry-manufacturing' },
          { title: 'Plating', value: 'plating' },
          { title: 'CAD Design', value: 'cad-design' },
        ],
      },
    }),
    defineField({
      name: 'shipsTo',
      title: 'Ships To',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List of countries/regions this supplier ships to',
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
      name: 'active',
      title: 'Active Supplier',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'country', media: 'logo' },
  },
});
