import type { Metadata } from 'next'
import teaching from '@/data/teaching.json'
import type { Teaching as TeachingType } from '@/utils/data'
import TeachingFull from '@/components/TeachingFull'
import SectionHeading from '@/components/SectionHeading'
import BackButton from '@/components/BackButton'


export const metadata: Metadata = {
  title: 'Teaching',
  description:
    'Courses, lecture topics, lab info, thesis guidance and student resources.',
  alternates: { canonical: '/teaching' },
}

export default function TeachingPage() {
  return (
    <div className="py-4">
      <div className="mb-6">
        <BackButton href="/" label="Back to home" />
      </div>

      <header className="mb-8">
        <SectionHeading title="Teaching" />

        <p className="mt-2 text-gray-600 dark:text-gray-300 max-w-prose">
          Course pages, slides and notes, plus the Student Corner with rules,
          resources, thesis guidance and conferences.
        </p>
      </header>

      <TeachingFull teaching={teaching as TeachingType} />
    </div>
  )
}
