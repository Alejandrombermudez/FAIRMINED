import { homepage } from './homepage';
import { certifiedMine } from './certifiedMine';
import { page } from './page';
import { post } from './post';
import { report } from './report';
import { siteSettings } from './siteSettings';
import { supplier } from './supplier';

export const schemaTypes = [
  // Singletons
  siteSettings,
  homepage,
  // Colecciones
  post,
  supplier,
  certifiedMine,
  page,
  report,
];
