export async function getHomeBanner() {
  try {
    const res = await fetch(
      "http://localhost:1337/api/homepage-banner?populate=homepageBanner",
      { cache: "no-store" }
    );

    const json = await res.json();
    const attrs = json?.data;
    if (!attrs) return null;

    const imageData = attrs.homepageBanner;
    if (!imageData) return null;

    // Determine best quality: original > large > medium
    const base = "http://localhost:1337";

    const homepageBannerUrl =
      imageData.url
        ? base + imageData.url // ORIGINAL (best)
        : imageData.formats?.large?.url
        ? base + imageData.formats.large.url
        : imageData.formats?.medium?.url
        ? base + imageData.formats.medium.url
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
