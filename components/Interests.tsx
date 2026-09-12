import SectionHeading from './SectionHeading'
import type { Interests as InterestsData } from '@/utils/data'

type InterestsProps = InterestsData

export default function Interests({ intro, focus, ongoing }: InterestsProps) {
  return (
    <section
      id="interests"
      className="py-12 border-t border-gray-200 dark:border-gray-700 scroll-mt-24"
    >
      <SectionHeading title="Research Interests" />

      {intro && (
        <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl">
          {intro}
        </p>
      )}

      {focus.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400 mb-3">
            Current focus
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {focus.map((interest) => (
              <li
                key={interest}
                className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-gray-900 dark:text-gray-100 font-medium p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                {interest}
              </li>
            ))}
          </ul>
        </div>
      )}

      {ongoing.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3">
            Also interested in
          </h3>
          <ul className="flex flex-wrap gap-2">
            {ongoing.map((interest) => (
              <li
                key={interest}
                className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm px-3 py-1.5 rounded-full"
              >
                {interest}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
