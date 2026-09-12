import Link from 'next/link'
import SectionHeading from './SectionHeading'

/**
 * Compact home-page teaser for "The Road" — mirrors the Teaching teaser.
 * The full chronological journey (career + education + photo milestones)
 * lives on the dedicated `/road` page; the home page only shows a short
 * pointer so the scroll stays friendly. Keeps `id="timeline"` so old
 * `#timeline` bookmarks still land somewhere sensible.
 */
export default function RoadTeaser() {
  return (
    <section
      id="timeline"
      className="py-12 border-t border-gray-200 dark:border-gray-700 scroll-mt-24"
    >
      <SectionHeading title="The Road" />

      <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-6 md:p-8">
        <p className="text-gray-700 dark:text-gray-200 max-w-prose">
          Career, education and the milestones in between — the full journey,
          with photos and places, lives on its own page.
        </p>

        <Link
          href="/road"
          className="group mt-6 inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
        >
          Walk The Road
          <span
            aria-hidden="true"
            className="inline-block transition-transform duration-200 group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
      </div>
    </section>
  )
}
