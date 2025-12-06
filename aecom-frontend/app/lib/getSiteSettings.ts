export async function getSiteSettings() {
  const res = await fetch(
    "https://leading-pleasure-696b0f5d25.strapiapp.com/api/site-setting?populate=logo&populate=favicon",
    { cache: "no-store" }
  );

  const json = await res.json();

  if (!json?.data) {
    return {
      siteName: "YourStore",
      logo: null,
      favicon: null,
    };
  }

  const { siteName, logo, favicon } = json.data;

  return {
    siteName: siteName || "YourStore",
    logo: logo?.url ? "https://leading-pleasure-696b0f5d25.strapiapp.com" + logo.url : null,
    favicon: favicon?.url ? "https://leading-pleasure-696b0f5d25.strapiapp.com" + favicon.url : null,
  };
}
