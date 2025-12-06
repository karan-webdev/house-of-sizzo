"use client";

import React, { useEffect, useState } from "react";
import { getHomeBanner } from "../lib/getHomeBanner";
import { FiArrowRight } from "react-icons/fi";

export default function HeroBanner() {
  const [banner, setBanner] = useState<null | any>(null);

  useEffect(() => {
    async function loadBanner() {
      const data = await getHomeBanner();
      console.log("Banner data:", data); // Debug
      if (data && data.isActive && data.homepageBannerUrl) {
        setBanner(data);
      }
    }
    loadBanner();
  }, []);

  if (!banner) return null;

  return (
    <div className="relative w-full h-[100vh]">
      <img
        src={banner.homepageBannerUrl}
        alt={banner.bannerText || "Homepage Banner"}
        className="w-full h-full object-cover"
      />

      {/* Darkened Overlay */}
      <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center text-white p-4">
        <h1 className="text-4xl font-bold mb-2 text-center">{banner.bannerText}</h1>

        {banner.bannerDescription && (
          <p className="mb-4 text-center max-w-2xl">{banner.bannerDescription}</p>
        )}

        <a
            href={banner.link}
            className="px-6 py-3 bg-[#8499b8] rounded hover:bg-[#6f86a4] flex items-center gap-2"
            >
            Shop Now <FiArrowRight size={20} />
        </a>

      </div>
    </div>
  );
}
