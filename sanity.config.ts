import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './src/sanity/schemas';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;

export default defineConfig({
  name: 'fairmined',
  title: 'Fairmined CMS',

  projectId,
  dataset,

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('📋 Contenido del sitio')
          .items([
            // ─── Singletons ──────────────────────────────────────────────────
            S.listItem()
              .title('🏠 Homepage (portada)')
              .child(
                S.document()
                  .schemaType('homepage')
                  .documentId('homepage')
                  .title('Editar la portada'),
              ),
            S.listItem()
              .title('⚙️ Configuración general')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
                  .title('Configuración general del sitio'),
              ),

            S.divider(),

            // ─── Colecciones ─────────────────────────────────────────────────
            S.documentTypeListItem('post').title('📰 Noticias y artículos'),
            S.documentTypeListItem('supplier').title('🏭 Proveedores autorizados'),
            S.documentTypeListItem('certifiedMine').title('⛏️ Minas certificadas'),
            S.documentTypeListItem('report').title('📄 Reportes e informes'),
            S.documentTypeListItem('page').title('📝 Páginas adicionales'),
          ]),
    }),
    visionTool({ defaultApiVersion: '2024-01-01' }),
  ],

  schema: {
    types: schemaTypes,
  },
});
