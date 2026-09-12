'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import type {
  TimelineEntry as TimelineEntryData,
  TimelineImage,
} from '@/utils/data'
import SectionHeading from './SectionHeading'
import TimelineItem from './TimelineItem'



interface TimelineProps {
  entries: TimelineEntryData[]
  /** Show every entry up front (dedicated /road page) instead of gating
   *  older ones behind a "Show earlier" toggle. */
  initiallyExpanded?: boolean
  /** Skip the built-in "The Road" heading (the /road page renders its own). */
  hideHeading?: boolean
}

/** A normalized entry that the timeline can sort + render uniformly. */
interface TimelineEntry {
  /** Sort key — epoch ms derived from startDate, with 'Present' coerced large. */
  sortKey: number
  /** Visible date label (e.g. "2011 – 2016", "2022 – Present"). */
  dateLabel: string
  heading?: string
  subheading?: string

  subheadingHref?: string

  meta?: string
  /** When set, the location line links to this map URL. */
  mapHref?: string
  body?: React.ReactNode
  /** Optional photos for this point. */
  images?: TimelineImage[]
  /** Stable React key. */
  reactKey: string
}



/** Number of most-recent entries shown before the user expands the rest. */
const INITIAL_VISIBLE = 5

function formatYear(dateString: string | undefined): string {
  if (!dateString) return ''
  if (dateString === 'Present') return 'Present'

  // Bare "YYYY" — return as-is to avoid timezone drift from Date parsing.
  if (/^\d{4}$/.test(dateString)) return dateString
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return dateString
  return date.toLocaleDateString('en-US', { year: 'numeric' })
}

function dateToSortKey(dateString: string): number {
  if (dateString === 'Present') return Number.MAX_SAFE_INTEGER
  // Bare "YYYY" — anchor to Jan 1 of that year (UTC, so the sort key is
  // timezone-independent and matches how "YYYY-MM" strings parse — otherwise
  // server/client can order adjacent entries differently and hydration breaks).
  if (/^\d{4}$/.test(dateString)) return Date.UTC(Number(dateString), 0, 1)

  const t = new Date(dateString).getTime()
  return isNaN(t) ? 0 : t
}

function toEntry(e: TimelineEntryData): TimelineEntry {
  const startLabel = formatYear(e.startDate)
  const endLabel = formatYear(e.endDate)
  // A missing/empty end label means a single-moment milestone — show one date
  // rather than an empty range like "2024 – ".
  const dateLabel =
    !endLabel || startLabel === endLabel
      ? startLabel
      : `${startLabel} – ${endLabel}`

  // Every real place gets a clickable 📍 map link: precise coordinates when
  // provided, otherwise a Google Maps place-name search. Non-places like
  // "Remote" stay plain text.
  const isPlace = Boolean(e.location) && e.location!.toLowerCase() !== 'remote'
  const mapHref =
    typeof e.lat === 'number' && typeof e.lng === 'number'
      ? `https://www.google.com/maps?q=${e.lat},${e.lng}`
      : isPlace
        ? `https://www.google.com/maps?q=${encodeURIComponent(e.location!)}`
        : undefined

  return {
    sortKey: dateToSortKey(e.startDate),
    dateLabel,
    heading: e.title,
    subheading: e.organization,
    subheadingHref: e.organizationUrl,
    meta: e.location,
    mapHref,
    body: e.description ? <p>{e.description}</p> : null,
    images: e.images,
    reactKey: `entry-${e.organization ?? ''}-${e.startDate}-${e.title}`,
  }
}



/**
 * "The Road" — a unified chronological view of career + education.
 *
 * Entries come from a single `data/timeline.json` list (no education vs.
 * experience distinction) and are ordered most-recent first with a uniform
 * marker style, so the timeline reads as one continuous story.
 *
 * To keep long histories scannable, only the most recent entries are
 * visible by default; the rest are revealed via a "Show earlier" toggle.
 */
export default function Timeline({
  entries,
  initiallyExpanded = false,
  hideHeading = false,
}: TimelineProps) {
  const [expanded, setExpanded] = useState(initiallyExpanded)
  // Lightbox state: which entry's gallery is open, and the active image index.
  const [lightbox, setLightbox] = useState<{
    images: TimelineImage[]
    index: number
  } | null>(null)

  const sorted = useMemo<TimelineEntry[]>(() => {
    const mapped = entries.map((e, i) => {
      const entry = toEntry(e)
      // Index keeps the key unique even when title/organization are absent.
      entry.reactKey = `entry-${i}-${e.startDate}`
      return entry
    })
    // Sort descending so the most recent items appear first.
    mapped.sort((a, b) => b.sortKey - a.sortKey)
    return mapped
  }, [entries])



  const hasHiddenEntries = sorted.length > INITIAL_VISIBLE
  const visible = useMemo(
    () =>
      expanded || !hasHiddenEntries
        ? sorted
        : sorted.slice(0, INITIAL_VISIBLE),
    [sorted, expanded, hasHiddenEntries],
  )
  const hiddenCount = sorted.length - INITIAL_VISIBLE

  return (
    <section
      id="timeline"
      className={
        hideHeading
          ? 'scroll-mt-24'
          : 'py-12 border-t border-gray-200 dark:border-gray-700 scroll-mt-24'
      }
    >
      {!hideHeading && <SectionHeading title="The Road" />}

      <ol className="list-none">
        {visible.map((entry, index) => (
          <TimelineItem
            key={entry.reactKey}
            date={entry.dateLabel}
            heading={entry.heading}
            subheading={entry.subheading}
            subheadingHref={entry.subheadingHref}
            meta={entry.meta}
            mapHref={entry.mapHref}
            images={entry.images}
            onImageClick={
              entry.images
                ? (i) => setLightbox({ images: entry.images!, index: i })
                : undefined
            }
            isLast={index === visible.length - 1}
          >
            {entry.body}
          </TimelineItem>
        ))}
      </ol>

      {hasHiddenEntries && (
        <div className="mt-2">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded"
          >
            {expanded
              ? 'Show less'
              : `Show earlier (${hiddenCount} more)`}
          </button>
        </div>
      )}

      {lightbox && (
        <TimelineLightbox
          images={lightbox.images}
          index={lightbox.index}
          onIndexChange={(i) =>
            setLightbox((prev) => (prev ? { ...prev, index: i } : prev))
          }
          onClose={() => setLightbox(null)}
        />
      )}
    </section>
  )
}

interface TimelineLightboxProps {
  images: TimelineImage[]
  index: number
  onIndexChange: (index: number) => void
  onClose: () => void
}

/**
 * Full-screen image viewer for timeline photos. Mirrors the ProjectModal
 * pattern (backdrop + blur, Escape/click-to-close, body-scroll lock) and adds
 * prev/next navigation (buttons + ←/→ keys) for multi-photo entries.
 */
function TimelineLightbox({
  images,
  index,
  onIndexChange,
  onClose,
}: TimelineLightboxProps) {
  const hasMultiple = images.length > 1
  const current = images[index]

  const goPrev = useCallback(() => {
    onIndexChange((index - 1 + images.length) % images.length)
  }, [index, images.length, onIndexChange])

  const goNext = useCallback(() => {
    onIndexChange((index + 1) % images.length)
  }, [index, images.length, onIndexChange])

  // Keyboard: Escape closes, ←/→ navigate. Also lock body scroll while open.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      else if (event.key === 'ArrowLeft' && hasMultiple) goPrev()
      else if (event.key === 'ArrowRight' && hasMultiple) goNext()
    }

    document.addEventListener('keydown', handleKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [hasMultiple, goPrev, goNext, onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
    >
      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <span aria-hidden="true" className="text-2xl leading-none">
          ×
        </span>
      </button>

      {/* Prev / next — only when there is more than one image */}
      {hasMultiple && (
        <>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              goPrev()
            }}
            aria-label="Previous image"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <span aria-hidden="true" className="text-2xl leading-none">
              ‹
            </span>
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              goNext()
            }}
            aria-label="Next image"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <span aria-hidden="true" className="text-2xl leading-none">
              ›
            </span>
          </button>
        </>
      )}

      {/* Image + caption — stop propagation so clicks here don't close */}
      <figure
        className="relative m-0 flex flex-col items-center"
        onClick={(event) => event.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={current.src}
          alt={current.alt ?? current.caption ?? 'Timeline image'}
          decoding="async"
          className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
        />
        {(current.caption || hasMultiple) && (
          <figcaption className="mt-3 text-center text-sm text-gray-200">
            {current.caption}
            {hasMultiple && (
              <span className="ml-2 text-gray-400">
                ({index + 1} / {images.length})
              </span>
            )}
          </figcaption>
        )}
      </figure>
    </div>
  )
}

