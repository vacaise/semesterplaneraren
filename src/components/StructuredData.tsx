
import React from 'react';

interface ArticleStructuredDataProps {
  title: string;
  description: string;
  imageUrl: string;
  datePublished: string;
  authorName?: string;
  url: string;
}

export const ArticleStructuredData: React.FC<ArticleStructuredDataProps> = ({
  title,
  description,
  imageUrl,
  datePublished,
  authorName = "vacai",
  url
}) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "image": imageUrl,
    "datePublished": datePublished,
    "author": {
      "@type": "Organization",
      "name": authorName
    },
    "publisher": {
      "@type": "Organization",
      "name": "vacai",
      "logo": {
        "@type": "ImageObject",
        "url": "https://vacai.se/lovable-uploads/ba846d2b-4df7-4b0e-af89-5d0748a13e5d.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};

export default ArticleStructuredData;
