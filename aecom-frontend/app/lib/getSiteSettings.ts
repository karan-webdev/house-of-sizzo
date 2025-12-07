const STRAPI_BASE = "https://leading-pleasure-696b0f5d25.strapiapp.com";

export async function getSiteSettings() {
  try {
    const res = await fetch(
      `${STRAPI_BASE}/api/site-setting?populate=logo&populate=favicon`,
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
      logo: logo?.url?.startsWith('http') ? logo.url : logo?.url ? `${STRAPI_BASE}${logo.url}` : null,
      favicon: favicon?.url?.startsWith('http') ? favicon.url : favicon?.url ? `${STRAPI_BASE}${favicon.url}` : null,
    };
  } catch (err) {
    console.error("Failed to fetch site settings:", err);
    return {
      siteName: "YourStore",
      logo: null,
      favicon: null,
    };
  }
}
