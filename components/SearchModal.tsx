'use client'

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { searchEntries, type SearchEntry } from '@/utils/searchIndex'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [query, setQuery] = useState('')

  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const results = useMemo(() => searchEntries(query), [query])

  // Reset state whenever the modal is opened, and focus the input.
  useEffect(() => {
    if (!isOpen) return
    setQuery('')
    setActiveIndex(0)
    // Focus after paint so the element exists.
    const id = window.setTimeout(() => inputRef.current?.focus(), 0)
    return () => window.clearTimeout(id)
  }, [isOpen])

  // Keep the active item in range as results change.
  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  // Lock body scroll while open.
  useEffect(() => {
    if (!isOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [isOpen])

  // Close when clicking anywhere outside the modal panel.
  useEffect(() => {
    if (!isOpen) return
    const onPointerDown = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [isOpen, onClose])

  const goToResult = useCallback(
    (entry: SearchEntry) => {
      onClose()

      // External link → open in a new tab.
      if (entry.external) {
        window.open(entry.href, '_blank', 'noopener,noreferrer')
        return
      }

      // In-page anchor (#section).
      if (entry.href.startsWith('#')) {
        const id = entry.href.slice(1)
        const onHome = pathname === '/'

        if (onHome) {
          // Already on the homepage → jump instantly to the section. Force
          // instant scrolling (the page default is smooth) so it lands
          // directly without the slow crawl, then restore the default.
          window.setTimeout(() => {
            const target = document.getElementById(id)
            const root = document.documentElement
            const previous = root.style.scrollBehavior
            root.style.scrollBehavior = 'auto'
            if (target) {
              target.scrollIntoView({ block: 'start' })
            } else {
              window.location.hash = entry.href
            }
            window.requestAnimationFrame(() => {
              root.style.scrollBehavior = previous
            })
          }, 0)
        } else {
          // On another page (e.g. a course page) → do a real navigation to the
          // homepage anchor. On a fresh load the browser lands directly on the
          // section (no App-Router scroll-to-top, no slow smooth crawl).
          // eslint-disable-next-line @next/next/no-location-assign-relative-destination
          window.location.href = `/${entry.href}`
        }
        return
      }

      // Internal route (e.g. /teaching/se/) → client-side navigation.
      router.push(entry.href)
    },
    [onClose, router, pathname],
  )

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (results.length === 0) return

      if (event.key === 'ArrowDown') {
        event.preventDefault()
        setActiveIndex((i) => (i + 1) % results.length)
      } else if (event.key === 'ArrowUp') {
        event.preventDefault()
        setActiveIndex((i) => (i - 1 + results.length) % results.length)
      } else if (event.key === 'Enter') {
        event.preventDefault()
        const entry = results[activeIndex]
        if (entry) goToResult(entry)
      }
    },
    [results, activeIndex, goToResult, onClose],
  )

  // Scroll the active item into view within the list.
  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const active = list.querySelector<HTMLElement>('[data-active="true"]')
    active?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center p-4 pt-[12vh] bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      <div
        ref={panelRef}
        className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden"
        onKeyDown={handleKeyDown}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 border-b border-gray-200 dark:border-gray-700">
          <svg
            className="w-5 h-5 text-gray-400 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses, resources, projects, papers…"
            aria-label="Search the site"
            className="flex-1 bg-transparent py-4 text-base outline-none placeholder:text-gray-400 text-gray-900 dark:text-gray-100"
          />
        </div>

        {/* Results */}
        <div className="max-h-[55vh] overflow-y-auto">
          {query.trim() === '' ? (
            <p className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
              Type to search across the whole site — try{' '}
              <span className="font-medium">&ldquo;attendance&rdquo;</span>,{' '}
              <span className="font-medium">&ldquo;thesis&rdquo;</span> or{' '}
              <span className="font-medium">&ldquo;robotics&rdquo;</span>.
            </p>
          ) : results.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
              No results for &ldquo;{query}&rdquo;.
            </p>
          ) : (
            <ul ref={listRef} className="py-2">
              {results.map((entry, index) => {
                const isActive = index === activeIndex
                return (
                  <li key={`${entry.type}-${entry.title}-${index}`}>
                    <button
                      type="button"
                      data-active={isActive}
                      onClick={() => goToResult(entry)}
                      onMouseMove={() => setActiveIndex(index)}
                      className={`w-full text-left px-4 py-2.5 flex items-start gap-3 transition-colors ${
                        isActive
                          ? 'bg-blue-50 dark:bg-gray-700'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                            {entry.title}
                          </span>
                          {entry.external && (
                            <span
                              aria-hidden="true"
                              className="text-xs text-gray-400"
                            >
                              ↗
                            </span>
                          )}
                        </span>
                        {entry.description && (
                          <span className="block truncate text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {entry.description}
                          </span>
                        )}
                      </span>
                      <span className="shrink-0 text-[10px] uppercase tracking-wide font-semibold text-gray-400 dark:text-gray-500 mt-1">
                        {entry.group}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

