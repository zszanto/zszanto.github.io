import type { Metadata } from 'next'
import bio from '@/data/bio.json'
import { siteUrl } from '@/utils/site'
import type { Bio } from '@/utils/data'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import BackToTop from '@/components/BackToTop'
import './globals.css'

const typedBio = bio as Bio

const title = `${typedBio.name} — ${typedBio.title}`
const description = typedBio.bio
// NOTE: Current OG image is a 270x270 circular avatar; ideally swap for a
// dedicated 1200x630 social card with name + title for better unfurling.
const ogImage = typedBio.photo

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: `%s — ${typedBio.name}`,
  },
  description,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: siteUrl,
    title,
    description,
    images: [{ url: ogImage }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [ogImage],
  },
}

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: typedBio.name,
  url: siteUrl,
  image: ogImage,
  jobTitle: typedBio.title,
  worksFor: {
    '@type': 'Organization',
    name: typedBio.institution,
    url: typedBio.institutionUrl,
  },
  description: typedBio.bio,
}

// Inline pre-paint script: runs before React hydrates so the correct
// theme class is on <html> on first paint and there is no flash.
//
// Smart default:
//  - If the user has explicitly chosen a theme, respect it.
//  - On mobile / touch devices (coarse pointer or narrow viewport),
//    default to 'auto' so the OS preference is honored.
//  - On desktop, default to 'dark' (project's intentional default).
const themeScript = `
(function () {
  try {
    var stored = localStorage.getItem('theme');
    var defaultTheme = 'dark';
    var isMobile =
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) defaultTheme = 'auto';
    var t = stored || defaultTheme;
    var isDark = t === 'dark' || (t === 'auto' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);
    var root = document.documentElement;
    if (isDark) root.classList.add('dark');
    root.dataset.theme = t;
  } catch (e) {}
})();
`

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <Navbar bio={typedBio} />
        <main
          id="main-content"
          className="max-w-4xl mx-auto px-4 py-8 pt-24"
        >
          {children}
        </main>
        <Footer bio={typedBio} />
        <BackToTop />
      </body>
    </html>
  )
}
