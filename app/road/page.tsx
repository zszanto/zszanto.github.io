import type { Metadata } from 'next'
import timeline from '@/data/timeline.json'
import type { TimelineEntry } from '@/utils/data'
import Timeline from '@/components/Timeline'
import SectionHeading from '@/components/SectionHeading'
import BackButton from '@/components/BackButton'

export const metadata: Metadata = {
  title: 'The Road',
  description:
    'Career, education and milestones — a chronological journey with photos.',
  alternates: { canonical: '/road' },
}

export default function RoadPage() {
  return (
    <div className="py-4">
      <div className="mb-6">
        <BackButton href="/" label="Back to home" />
      </div>

      <header className="mb-8">
        <SectionHeading title="The Road" />

        <p className="mt-2 text-gray-600 dark:text-gray-300 max-w-prose">
          Career, education and the milestones in between — most recent first,
          with photos and places along the way.
        </p>
      </header>

      {/* The dedicated page shows the whole journey up front — no
          "Show earlier" gate like the home-page section had. */}
      <Timeline
        entries={timeline.entries as TimelineEntry[]}
        initiallyExpanded
        hideHeading
      />
    </div>
  )
}
