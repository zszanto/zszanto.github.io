import Link from 'next/link'
import type { Teaching as TeachingType } from '@/utils/data'
import SectionHeading from './SectionHeading'

interface TeachingProps {
  teaching: TeachingType
}

/**
 * Compact home-page teaser; the full hub (course pages + Student Corner)
 * lives at `/teaching`.
 */
export default function Teaching({ teaching }: TeachingProps) {
  const { courses } = teaching

  return (
    <section
      id="teaching"
      className="py-12 border-t border-gray-200 dark:border-gray-700 scroll-mt-24"
    >
      <SectionHeading title="Teaching" />

      <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-6 md:p-8">
        <p className="text-gray-700 dark:text-gray-200 max-w-prose">
          Course materials, lecture topics, lab info, thesis guidance and the
          Student Corner resources live on a dedicated page.
        </p>

        {courses.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {courses.map((course) => (
              <li key={course.slug}>
                <Link
                  href={`/teaching/${course.slug}`}
                  className="inline-flex items-center rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-1 text-sm text-gray-700 dark:text-gray-200 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  {course.title}
                </Link>
              </li>
            ))}
          </ul>
        )}

        <Link
          href="/teaching"
          className="group mt-6 inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
        >
          Open course materials &amp; student resources
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
