import React from "react";
import Head from "next/head";

export interface SeoProps {
  title: string;
  description?: string;
}

const Seo: React.FC<SeoProps> = ({ title, description }) => {
  return (
    <Head>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
  );
};

export default Seo;
