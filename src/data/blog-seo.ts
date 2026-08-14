import type { CollectionEntry } from "astro:content";

const site = "https://josemariasantos.com";

export const author = {
  "@type": "Person",
  name: "José María Santos",
  jobTitle: "Frontend Tech Lead",
  url: `${site}/about/`,
  sameAs: [
    "https://www.linkedin.com/in/josema-santos/",
    "https://github.com/josemasf",
  ],
};

export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: new URL(item.path, site).toString(),
    })),
  };
}

export function articleSchema(
  post: CollectionEntry<"posts">,
  socialImage?: string,
) {
  const path = `/blog/${post.id}/`;
  const image =
    socialImage ?? post.data.image?.src ?? "/images/social/blog-default.png";
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.data.title,
    description: post.data.description,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": new URL(path, site).toString(),
    },
    url: new URL(path, site).toString(),
    image: [new URL(image, site).toString()],
    datePublished: post.data.date.toISOString(),
    ...(post.data.updatedDate
      ? { dateModified: post.data.updatedDate.toISOString() }
      : {}),
    author,
    publisher: {
      "@type": "Person",
      name: "José María Santos",
      url: `${site}/about/`,
    },
    articleSection: post.data.category,
    keywords: post.data.tags.join(", "),
    inLanguage: "es-ES",
  };
}
