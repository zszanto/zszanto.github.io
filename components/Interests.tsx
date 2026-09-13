import SectionHeading from './SectionHeading'
import type { Interests as InterestsData } from '@/utils/data'

type InterestsProps = InterestsData

export default function Interests({ focus, ongoing }: InterestsProps) {
  const interests = [
    ...focus.map((interest) => ({ interest, isFocus: true })),
    ...ongoing.map((interest) => ({ interest, isFocus: false })),
  ]

  return (
    <section
      id="interests"
      className="py-12 border-t border-gray-200 dark:border-gray-700 scroll-mt-24"
    >
      <SectionHeading title="Research Interests" />

      {interests.length > 0 && (
        <ul className="flex flex-wrap items-center gap-2">
          {interests.map(({ interest, isFocus }) => (
            <li
              key={interest}
              className={
                isFocus
                  ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-gray-900 dark:text-gray-100 text-sm font-medium px-3 py-1.5 rounded-full'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm px-3 py-1.5 rounded-full'
              }
            >
              {interest}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
