'use client'

import { useMemo, useState } from 'react'
import type { Publication } from '@/utils/data'
import SectionHeading from './SectionHeading'

interface PublicationsProps {
  publications: Publication[]
}

const INITIAL_COUNT = 5

export default function Publications({ publications }: PublicationsProps) {
  const [activeCitation, setActiveCitation] = useState<string | null>(null)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [showAll, setShowAll] = useState(false)

  const sorted = useMemo(
    () => [...publications].sort((a, b) => b.year - a.year),
    [publications],
  )

  const trimmedQuery = query.trim().toLowerCase()
  const isSearching = trimmedQuery.length > 0

  const filtered = useMemo(() => {
    if (!isSearching) return sorted
    return sorted.filter((pub) => {
      const haystack = [
        pub.title,
        pub.authors.join(' '),
        pub.venue,
        String(pub.year),
      ]
        .join(' ')
        .toLowerCase()
      return haystack.includes(trimmedQuery)
    })
  }, [sorted, isSearching, trimmedQuery])

  // When searching, show all matches. Otherwise respect the view-more limit.
  const visible =
    isSearching || showAll ? filtered : filtered.slice(0, INITIAL_COUNT)
  const hasMore = !isSearching && filtered.length > INITIAL_COUNT

  const handleCopy = async (key: string, bibtex: string) => {
    try {
      await navigator.clipboard.writeText(bibtex)
      setCopiedKey(key)
      setTimeout(
        () => setCopiedKey((current) => (current === key ? null : current)),
        2000,
      )
    } catch {
      // Clipboard API can fail on insecure contexts; silently ignore.
    }
  }

  return (
    <section
      id="publications"
      className="py-12 border-t border-gray-200 dark:border-gray-700 scroll-mt-24"
    >
      <SectionHeading title="Publications" />

      <div className="mb-6">
        <div className="relative max-w-md">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400 dark:text-gray-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search publications…"
            aria-label="Search publications"
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 pl-10 pr-10 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
        {isSearching && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            {filtered.length}{' '}
            {filtered.length === 1 ? 'result' : 'results'}
          </p>
        )}
      </div>

      <div className="space-y-6">
        {visible.map((pub) => {
          const key = `${pub.year}-${pub.title}`
          const isOpen = activeCitation === key
          const venueText = pub.venue.includes(String(pub.year))
            ? pub.venue
            : `${pub.venue}${pub.venue ? ', ' : ''}${pub.year}`
          return (
            <article
              key={key}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-md dark:shadow-black/30 transition-shadow"
            >
              <h3 className="text-lg font-medium mb-2">{pub.title}</h3>
              <p className="text-gray-800 dark:text-gray-200 mb-2">
                {pub.authors.join(', ')}
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {venueText}
              </p>
              <div className="flex flex-wrap gap-3 text-sm">
                {pub.doi && (
                  <a
                    href={`https://doi.org/${pub.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                  >
                    DOI
                  </a>
                )}
                {pub.pdfUrl && (
                  <a
                    href={pub.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                  >
                    PDF
                  </a>
                )}
                {pub.bibtex && (
                  <button
                    type="button"
                    onClick={() => setActiveCitation(isOpen ? null : key)}
                    aria-expanded={isOpen}
                    aria-controls={`${key}-bibtex`}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                  >
                    {isOpen ? 'Hide citation' : 'Cite'}
                  </button>
                )}
              </div>
              {isOpen && pub.bibtex && (
                <div
                  id={`${key}-bibtex`}
                  className="mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-md"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">BibTeX</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(key, pub.bibtex!)}
                      className="text-xs text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    >
                      {copiedKey === key ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <pre className="text-xs overflow-x-auto p-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded whitespace-pre-wrap">
                    {pub.bibtex}
                  </pre>
                </div>
              )}
            </article>
          )
        })}

        {isSearching && filtered.length === 0 && (
          <p className="text-gray-600 dark:text-gray-300">
            No publications match your search.
          </p>
        )}
      </div>

      {hasMore && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setShowAll((prev) => !prev)}
            aria-expanded={showAll}
            className="rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {showAll
              ? 'Show less'
              : `View all ${filtered.length} publications`}
          </button>
        </div>
      )}
    </section>
  )
}
