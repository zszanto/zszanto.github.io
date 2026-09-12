import { Fragment, type ReactNode } from 'react'
import type { Bio } from '@/utils/data'
import SectionHeading from './SectionHeading'

interface BiographyProps {
  bio: Bio
}

interface LinkMapping {
  phrase: string
  url?: string
}

/**
 * Renders a block of text with specific phrases turned into hyperlinks.
 * The bio text in `data/bio.json` stays the single source of truth; only
 * the phrases that have a matching URL become links, everything else is
 * rendered as plain text.
 */
function renderWithLinks(text: string, mappings: LinkMapping[]): ReactNode[] {
  // Only keep mappings that actually have a URL and whose phrase is present.
  const active = mappings.filter((m) => m.url && text.includes(m.phrase))

  // Build a single regex that matches any of the phrases (longest first so
  // overlapping phrases prefer the most specific match).
  if (active.length === 0) return [text]

  const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const pattern = active
    .map((m) => m.phrase)
    .sort((a, b) => b.length - a.length)
    .map(escape)
    .join('|')
  const regex = new RegExp(`(${pattern})`, 'g')

  const urlFor = new Map(active.map((m) => [m.phrase, m.url as string]))

  return text.split(regex).map((part, index) => {
    const url = urlFor.get(part)
    if (url) {
      return (
        <a
          key={index}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
        >
          {part}
        </a>
      )
    }
    return <Fragment key={index}>{part}</Fragment>
  })
}

export default function Biography({ bio }: BiographyProps) {
  const mappings: LinkMapping[] = [
    { phrase: bio.institution, url: bio.institutionUrl },
    { phrase: bio.department ?? '', url: bio.departmentUrl },
    { phrase: 'NARC research group', url: bio.researchGroupUrl },
    { phrase: 'SapiLineTracer robot competition', url: bio.sapiLineTracerUrl },
  ]

  return (
    <section
      id="biography"
      className="py-12 border-t border-gray-200 dark:border-gray-700 scroll-mt-24"
    >
      <SectionHeading title="About" />
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {renderWithLinks(bio.bio, mappings)}
        </p>
      </div>
    </section>
  )
}
