// utils/seo.ts
import { Metadata } from "next";

interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
}

export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    image = "/og-image.jpg",
    url = "https://cksi.org.ng",
    type = "website",
    publishedTime,
    modifiedTime,
    authors = ["CKSI Team"],
  } = config;

  const fullTitle = title.includes("CKSI") ? title : `${title} - CKSI`;

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(", "),
    authors: authors.map((name) => ({ name })),
    creator: "CKSI",
    publisher: "CKSI",

    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: "Couples and Kids Social Initiatives",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "en_NG",
      type,
      publishedTime,
      modifiedTime,
      authors,
    },

    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
      creator: "@cksi_ng",
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    alternates: {
      canonical: url,
    },

    category: "Non-profit Organization",
  };
}

export function generateStructuredData(
  type: "Organization" | "Article" | "Event",
  data: any
) {
  const baseData = {
    "@context": "https://schema.org",
  };

  switch (type) {
    case "Organization":
      return {
        ...baseData,
        "@type": "Organization",
        name: "Couples and Kids Social Initiatives",
        alternateName: "CKSI",
        url: "https://cksi.org.ng",
        logo: "https://cksi.org.ng/cksi-logo.png",
        description:
          "Empowering families and children across Nigeria through education, healthcare, and community development programs.",
        foundingDate: "2010",
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+234-123-456-7890",
          contactType: "Customer Service",
          email: "info@cksi.org.ng",
        },
        address: {
          "@type": "PostalAddress",
          addressLocality: "Lagos",
          addressCountry: "Nigeria",
        },
        sameAs: [
          "https://facebook.com/cksi",
          "https://instagram.com/cksi",
          "https://linkedin.com/company/cksi",
        ],
        ...data,
      };

    case "Article":
      return {
        ...baseData,
        "@type": "Article",
        headline: data.title,
        description: data.description,
        author: {
          "@type": "Organization",
          name: "CKSI",
        },
        publisher: {
          "@type": "Organization",
          name: "CKSI",
          logo: {
            "@type": "ImageObject",
            url: "https://cksi.org.ng/cksi-logo.png",
          },
        },
        datePublished: data.publishedAt,
        dateModified: data.updatedAt,
        mainEntityOfPage: data.url,
        image: data.image,
      };

    case "Event":
      return {
        ...baseData,
        "@type": "Event",
        name: data.title,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        location: {
          "@type": "Place",
          name: data.location,
          address: data.address,
        },
        organizer: {
          "@type": "Organization",
          name: "CKSI",
          url: "https://cksi.org.ng",
        },
        image: data.image,
      };

    default:
      return baseData;
  }
}
