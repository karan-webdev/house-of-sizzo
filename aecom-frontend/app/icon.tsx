import { getSiteSettings } from "./lib/getSiteSettings";

export const dynamic = "force-dynamic";

export default async function Icon() {
  const settings = await getSiteSettings();
  const faviconUrl = settings?.favicon;

  if (!faviconUrl) return null;

  const res = await fetch(faviconUrl);
  const buffer = Buffer.from(await res.arrayBuffer());

  return new Response(buffer, {
    headers: {
      "Content-Type": "image/x-icon",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
