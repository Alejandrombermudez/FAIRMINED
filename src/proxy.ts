import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const handleI18nRouting = createMiddleware(routing);

// Next.js 16: file must be proxy.ts and export a function named `proxy`
export const proxy = handleI18nRouting;

export const config = {
  // Match all pathnames except for:
  // - /api routes
  // - /_next (Next.js internals)
  // - /studio (Sanity Studio — no i18n needed)
  // - /monitoring (health checks)
  // - static files (images, fonts, etc.)
  matcher: [
    '/((?!api|_next/static|_next/image|studio|monitoring|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|eot)$).*)',
  ],
};
