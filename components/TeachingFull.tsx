import Link from 'next/link'
import type {
  Teaching as TeachingType,
  StudentCornerLink,
} from '@/utils/data'
import { ResourceIcon } from './icons'

interface TeachingFullProps {
  teaching: TeachingType
}

/** Stable display order for known categories; unknown ones are appended. */
const CATEGORY_ORDER = [
  'Documents & rules',
  'Resources',
  'Thesis',
  'Conferences',
]

function groupByCategory(links: StudentCornerLink[]) {
  const groups = new Map<string, StudentCornerLink[]>()
  for (const link of links) {
    const key = link.category ?? 'Other'
    const bucket = groups.get(key)
    if (bucket) bucket.push(link)
    else groups.set(key, [link])
  }

  return Array.from(groups.entries()).sort(([a], [b]) => {
    const ia = CATEGORY_ORDER.indexOf(a)
    const ib = CATEGORY_ORDER.indexOf(b)
    if (ia === -1 && ib === -1) return a.localeCompare(b)
    if (ia === -1) return 1
    if (ib === -1) return -1
    return ia - ib
  })
}

/**
 * The full teaching experience: course cards + the complete Student Corner
 * resource hub. Used by the dedicated `/teaching` page. The home page renders
 * a compact teaser instead (see `components/Teaching.tsx`).
 */
export default function TeachingFull({ teaching }: TeachingFullProps) {
  const { courses, studentCorner } = teaching
  const groupedLinks = groupByCategory(studentCorner.links)

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Link
            key={course.slug}
            href={`/teaching/${course.slug}`}
            aria-label={`Open ${course.title}`}
            className="group bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg dark:shadow-black/30 transition-all duration-300 hover:-translate-y-1 flex flex-col p-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
          >
            <div className="mb-2">
              <h3 className="text-lg font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {course.title}
              </h3>
            </div>

            {course.summary && (
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-3">
                {course.summary}
              </p>
            )}

            <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Topics covered
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 text-sm space-y-1 mb-4">
              {course.topics.slice(0, 4).map((topic) => (
                <li key={topic} className="truncate">
                  {topic}
                </li>
              ))}
              {course.topics.length > 4 && (
                <li className="list-none text-xs text-gray-400 dark:text-gray-500">
                  +{course.topics.length - 4} more
                </li>
              )}
            </ul>

            <span className="mt-auto inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400">
              View course
              <span
                aria-hidden="true"
                className="ml-1 inline-block transition-transform duration-200 group-hover:translate-x-1"
              >
                →
              </span>
            </span>
          </Link>
        ))}
      </div>

      {/* Student Corner — the most-visited resource hub for students. */}
      <div
        id="student-corner"
        className="mt-10 bg-gray-50 dark:bg-gray-800 rounded-lg p-6 scroll-mt-24"
      >
        <h2 className="text-xl font-semibold mb-5">{studentCorner.title}</h2>

        <div className="space-y-6">
          {groupedLinks.map(([category, links]) => (
            <div key={category}>
              <p className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3">
                {category}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {links.map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-3 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-3 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      <ResourceIcon type={link.type} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {link.label}
                      </span>
                      {link.description && (
                        <span className="block text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {link.description}
                        </span>
                      )}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
