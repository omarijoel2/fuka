import { Helmet } from "react-helmet-async";

const SITE_URL = "https://kafu.ac.ke";
const DEFAULT_IMAGE = "https://kafu.ac.ke/wp-content/uploads/2025/10/logo-updated-750x126.png";
const SITE_NAME = "Kaimosi Friends University";
const DEFAULT_DESCRIPTION =
  "Kaimosi Friends University (KAFU) — Spring of Knowledge. A Quaker-founded public university in Kaimosi, Western Kenya offering undergraduate, postgraduate, and doctoral programmes.";

type JsonLdObject = Record<string, unknown>;

interface BreadcrumbItem {
  name: string;
  path?: string;
}

interface SeoHeadProps {
  title: string;
  description?: string;
  image?: string;
  path?: string;
  type?: "website" | "article" | "profile";
  noindex?: boolean;
  jsonLd?: JsonLdObject | JsonLdObject[];
  breadcrumbs?: BreadcrumbItem[];
}

export function SeoHead({
  title,
  description,
  image,
  path,
  type = "website",
  noindex = false,
  jsonLd,
  breadcrumbs,
}: SeoHeadProps) {
  const fullTitle = title.includes("KAFU") || title.includes("Kaimosi")
    ? title
    : `${title} | ${SITE_NAME}`;
  const desc = description ?? DEFAULT_DESCRIPTION;
  const img = image ?? DEFAULT_IMAGE;
  const canonical = path ? `${SITE_URL}${path}` : undefined;

  const breadcrumbJsonLd: JsonLdObject | null =
    breadcrumbs && breadcrumbs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
            ...breadcrumbs
              .filter((b) => b.path)
              .map((b, i) => ({
                "@type": "ListItem",
                position: i + 2,
                name: b.name,
                item: `${SITE_URL}${b.path}`,
              })),
          ],
        }
      : null;

  const jsonLdItems: JsonLdObject[] = [
    ...(Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : []),
    ...(breadcrumbJsonLd ? [breadcrumbJsonLd] : []),
  ];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      {canonical && <link rel="canonical" href={canonical} />}

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={img} />
      <meta property="og:type" content={type} />
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_KE" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={img} />
      <meta name="twitter:site" content="@KAFU_Kenya" />

      {jsonLdItems.map((item, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(item)}
        </script>
      ))}
    </Helmet>
  );
}

export const ORG_JSONLD: JsonLdObject = {
  "@context": "https://schema.org",
  "@type": ["CollegeOrUniversity", "Organization"],
  "@id": `${SITE_URL}/#organization`,
  name: "Kaimosi Friends University",
  alternateName: ["KAFU", "Kaimosi Friends University College"],
  url: SITE_URL,
  logo: DEFAULT_IMAGE,
  description: DEFAULT_DESCRIPTION,
  address: {
    "@type": "PostalAddress",
    streetAddress: "P.O BOX 385 – 50309",
    addressLocality: "Kaimosi",
    addressRegion: "Western Kenya",
    addressCountry: "KE",
  },
  telephone: "+254 777 373 633",
  email: "info@kafu.ac.ke",
  sameAs: ["https://kafu.ac.ke"],
  foundingDate: "2013",
  numberOfStudents: { "@type": "QuantitativeValue", value: 8000 },
};
