import type { Metadata } from "next";
import { Bricolage_Grotesque, Manrope } from "next/font/google";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { PublicChrome } from "@/components/layout/PublicChrome";
import { StructuredData } from "@/components/publication/StructuredData";
import { contentRepository } from "@/content";
import { getAbsoluteUrl, getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});
const description =
  "Associação civil filantrópica, sem fins lucrativos, que presta serviços à comunidade na área da Assistência Social em Floresta, Paraná.";
const socialImage = getAbsoluteUrl("/og.png");

export const metadata: Metadata = {
  metadataBase: getSiteUrl() ?? undefined,
  title: {
    default: "Obra de Assistência Social Papa João XXIII",
    template: "%s | Obra Papa João XXIII",
  },
  description,
  applicationName: "Obra Papa João XXIII",
  alternates: getAbsoluteUrl("/") ? { canonical: getAbsoluteUrl("/") } : undefined,
  icons: { icon: "/icon.png", apple: "/apple-icon.png" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Obra de Assistência Social Papa João XXIII",
    title: "Obra de Assistência Social Papa João XXIII",
    description,
    url: getAbsoluteUrl("/"),
    images: socialImage
      ? [
          {
            url: socialImage,
            width: 1200,
            height: 630,
            alt: "Obra Papa João XXIII",
          },
        ]
      : undefined,
  },
  twitter: {
    card: "summary_large_image",
    title: "Obra Papa João XXIII",
    description,
    images: socialImage ? [socialImage] : undefined,
  },
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const settings = await contentRepository.getSiteSettings();
  const address = settings.contacts.find((contact) => contact.type === "address");
  const phone = settings.contacts.find((contact) => contact.type === "phone");
  const email = settings.contacts.find((contact) => contact.type === "email");
  return (
    <html
      lang="pt-BR"
      className={`${manrope.variable} ${bricolage.variable}`}
      data-scroll-behavior="smooth"
    >
      <body>
        <PublicChrome
          header={<SiteHeader />}
          footer={<SiteFooter />}
          structuredData={
            <StructuredData
              data={{
                "@context": "https://schema.org",
                "@type": "Organization",
                name: settings.name,
                description: settings.description,
                url: getAbsoluteUrl("/"),
                logo: getAbsoluteUrl("/images/optimized/logo-obra-320.webp"),
                telephone: phone?.value,
                email: email?.value,
                address: address
                  ? {
                      "@type": "PostalAddress",
                      streetAddress: address.value,
                      addressLocality: "Floresta",
                      addressRegion: "Paraná",
                      postalCode: "87120-023",
                      addressCountry: "BR",
                    }
                  : undefined,
                sameAs: settings.socialLinks.map((social) => social.href),
              }}
            />
          }
        >
          {children}
        </PublicChrome>
      </body>
    </html>
  );
}
