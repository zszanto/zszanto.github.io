import type { ReactNode } from 'react'
import type { TimelineImage } from '@/utils/data'

interface TimelineItemProps {
  /** Date / year label shown in the left column (e.g. "2013 – 2016") */
  date: string
  /** Main heading (degree+field, or job title). Optional for photo-milestones. */
  heading?: string

  /** Sub-heading rendered as a link (institution / company) */
  subheadingHref?: string
  subheading?: string
  /** Secondary line (location / place) */
  meta?: string
  /** When set, the location line becomes a 📍 link to this map URL. */
  mapHref?: string
  /** Optional photos shown as a thumbnail grid (photo-milestones). */
  images?: TimelineImage[]
  /** Called when a thumbnail is clicked, to open it in a lightbox. */
  onImageClick?: (index: number) => void
  /** Optional body content (description, thesis, etc.) */
  children?: ReactNode
  /** Whether this is the last item (hides the bottom part of the line) */
  isLast?: boolean
}

/**
 * A single entry in a vertical timeline.
 * Compose inside a `<ol>` or `<ul>` wrapper.
 *
 * Layout is a three-column row on `sm`+ screens:
 *   [ date ] [ dot + connector ] [ content ]
 *
 * On mobile the date column collapses and the date is shown as a small
 * line above the heading.
 */
export default function TimelineItem({
  date,
  heading,
  subheadingHref,
  subheading,
  meta,
  mapHref,
  images,
  onImageClick,
  children,
  isLast = false,
}: TimelineItemProps) {

  const hasImages = Array.isArray(images) && images.length > 0

  return (
    <li className="relative flex gap-4 sm:gap-6">
      {/* Date column — left aligned, hidden on mobile (shown inline instead) */}
      <p className="hidden sm:block w-20 flex-shrink-0 pt-1 text-right text-sm font-medium text-gray-500 dark:text-gray-400">
        {date}
      </p>

      {/* Vertical line + marker */}
      <div className="flex flex-col items-center">
        {/* Marker — single neutral dot, same for every entry */}
        <span
          className="mt-2 flex-shrink-0 inline-block w-3 h-3 rounded-full bg-gray-400 dark:bg-gray-500 ring-2 ring-white dark:ring-gray-900 z-10"
          aria-hidden="true"
        />
        {/* Line below marker — hidden for last item */}
        {!isLast && (
          <span className="flex-1 w-px mt-1 bg-gray-200 dark:bg-gray-700" />
        )}
      </div>

      {/* Content */}
      <div className="pb-8 min-w-0">
        {/* Date shown inline on mobile only */}
        <p className="sm:hidden text-sm text-gray-500 dark:text-gray-400 mb-1 font-medium">
          {date}
        </p>
        {heading && (
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
            {heading}
          </h3>
        )}

        {subheading && (
          <p className="mb-1">
            {subheadingHref ? (
              <a
                href={subheadingHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
              >
                {subheading}
              </a>
            ) : (
              <span className="text-gray-700 dark:text-gray-200">{subheading}</span>
            )}
          </p>
        )}
        {meta && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            {mapHref ? (
              <a
                href={mapHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
              >
                <span aria-hidden="true">📍</span>
                {meta}
              </a>
            ) : (
              meta
            )}
          </p>
        )}
        {children && (
          <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
            {children}
          </div>
        )}

        {hasImages && (
          <div
            className={`mt-3 grid grid-cols-1 gap-3 ${
              images!.length >= 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'
            }`}
          >

            {images!.map((image, i) => (
              <figure key={`${image.src}-${i}`} className="m-0">
                <button
                  type="button"
                  onClick={() => onImageClick?.(i)}
                  aria-label={`View larger image${
                    image.caption ? `: ${image.caption}` : ''
                  }`}
                  className="group relative block aspect-[4/3] w-full overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.src}
                    alt={image.alt ?? image.caption ?? heading ?? 'Timeline image'}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </button>
                {image.caption && (
                  <figcaption className="mt-1.5 text-sm text-gray-600 dark:text-gray-300">
                    {image.caption}
                  </figcaption>
                )}
              </figure>
            ))}

          </div>
        )}
      </div>
    </li>
  )
}
