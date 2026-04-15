import './globals.css';

// Root layout — Next.js requires <html> and <body> here.
// The lang attribute is set dynamically in [lang]/layout.tsx via suppressHydrationWarning.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
