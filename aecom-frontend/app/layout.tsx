import "./globals.css"; // ✅ Tailwind import
import Header from "./components/Header";
import Footer from "./components/Footer";
import { CartProvider } from "./context/CartContext";
import { getSiteSettings } from "./lib/getSiteSettings";

export const dynamic = "force-dynamic"; // ensure dynamic fetch

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch site settings (logo/fav)
  const settings = await getSiteSettings();

  const faviconUrl = settings?.favicon || "/favicon.ico"; // fallback if not set
  const siteTitle = "House of Sizzo";
  const siteDescription =
    "Shop curated homeware, kitchen essentials, and modern décor at House of Sizzo. Discover stylish, functional, and affordable pieces designed to elevate your home and enhance everyday living.";

  return (
    <html lang="en">
      <head>
        <title>{siteTitle}</title>
        <meta name="description" content={siteDescription} />
        <meta property="og:title" content={siteTitle} />
        <meta property="og:description" content={siteDescription} />
        {faviconUrl && <link rel="icon" href={faviconUrl} />}
        {faviconUrl && <meta property="og:image" content={faviconUrl} />}
      </head>
      <body className="antialiased bg-gray-50 text-gray-900">
        <CartProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
