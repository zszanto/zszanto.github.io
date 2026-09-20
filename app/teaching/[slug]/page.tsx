import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import teaching from '@/data/teaching.json'
import type { Teaching as TeachingType, TeachingCourse } from '@/utils/data'
import { ResourceIcon } from '@/components/icons'
import BackButton from '@/components/BackButton'

const { courses } = teaching as TeachingType

function getCourse(slug: string): TeachingCourse | undefined {
  return courses.find((course) => course.slug === slug)
}

// Pre-render one static HTML page per course (required for `output: 'export'`).
export function generateStaticParams() {
  return courses.map((course) => ({ slug: course.slug }))
}

// Next 15: `params` is async in pages and generateMetadata.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const course = getCourse(slug)
  if (!course) return { title: 'Course not found' }
  return {
    title: course.title,
    description: course.summary ?? `${course.title} course materials.`,
  }
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const course = getCourse(slug)
  if (!course) notFound()

  return (
    <article className="py-4">
      <div className="mb-6">
        <BackButton href="/teaching" label="Back to teaching" />
      </div>

      <header className="mb-8">
        <h1 className="text-3xl font-bold">{course.title}</h1>

        {course.summary && (
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
            {course.summary}
          </p>
        )}
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {course.attendance}
        </p>
      </header>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Topics covered</h2>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1.5">
          {course.topics.map((topic) => (
            <li key={topic}>{topic}</li>
          ))}
        </ul>
      </section>

      {course.laboratory && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Laboratory</h2>
          {typeof course.laboratory === 'string' ? (
            <p className="text-gray-700 dark:text-gray-300">
              {course.laboratory}
            </p>
          ) : (
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1.5">
              {course.laboratory.map((item) => (
                <li key={item.text}>
                  {item.text}
                  {item.link && (
                    <>
                      {' '}
                      <a
                        href={item.link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 underline hover:text-blue-700 dark:hover:text-blue-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                      >
                        {item.link.label}
                      </a>
                      .
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {course.project && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Project</h2>
          <p className="text-gray-700 dark:text-gray-300">
            {course.project.text}{' '}
            <a
              href={course.project.guide.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 underline hover:text-blue-700 dark:hover:text-blue-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              {course.project.guide.label}
            </a>
            .
          </p>
        </section>
      )}

      {course.grading && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Grading</h2>
          <p className="text-gray-700 dark:text-gray-300">{course.grading}</p>
        </section>
      )}

      {course.materials && course.materials.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Materials</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {course.materials.map((material) => (
              <a
                key={material.url}
                href={material.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  <ResourceIcon type={material.type} />
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {material.label}
                </span>
              </a>
            ))}
          </div>
        </section>
      )}
    </article>
  )
}
