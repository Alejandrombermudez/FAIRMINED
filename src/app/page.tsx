import { redirect } from 'next/navigation';

// Redirect root to default locale — the proxy handles this,
// but this fallback ensures it works in edge cases.
export default function RootPage() {
  redirect('/en');
}
