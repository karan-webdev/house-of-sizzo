const STRAPI_BASE = "https://leading-pleasure-696b0f5d25.strapiapp.com";

export async function getHomeBanner() {
  try {
    const res = await fetch(
      `${STRAPI_BASE}/api/homepage-banner?populate=homepageBanner`,
      { cache: "no-store" }
    );

    const json = await res.json();
    const attrs = json?.data;
    if (!attrs) return null;

    const imageData = attrs.homepageBanner;
    if (!imageData) return null;

    const homepageBannerUrl = imageData.url?.startsWith('http')
      ? imageData.url
      : imageData.url
      ? `${STRAPI_BASE}${imageData.url}`
      : imageData.formats?.large?.url
      ? `${STRAPI_BASE}${imageData.formats.large.url}`
      : imageData.formats?.medium?.url
      ? `${STRAPI_BASE}${imageData.formats.medium.url}`
      : null;

    return {
      bannerText: attrs.bannerText || null,
      bannerDescription: attrs.bannerDescription || null,
      homepageBannerUrl,
      link: attrs.link || null,
      isActive: attrs.isActive || false,
    };
  } catch (err) {
    console.error("Failed to fetch homepage banner:", err);
    return null;
  }
}
