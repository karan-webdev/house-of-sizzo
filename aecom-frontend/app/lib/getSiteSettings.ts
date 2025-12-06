export async function getSiteSettings() {
  const res = await fetch(
    "http://localhost:1337/api/site-setting?populate=logo&populate=favicon",
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
    logo: logo?.url ? "http://localhost:1337" + logo.url : null,
    favicon: favicon?.url ? "http://localhost:1337" + favicon.url : null,
  };
}
