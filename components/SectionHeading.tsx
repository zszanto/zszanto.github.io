import type { ReactNode } from 'react'

interface SectionHeadingProps {
  /** The heading text. */
  title: string
  /** Optional id to attach to the heading (useful for aria-labelledby). */
  id?: string
  /** Optional content rendered next to the heading (e.g. action buttons). */
  children?: ReactNode
}

/**
 * Section heading with a small blue accent bar on the left.
 * Used across all top-level page sections to keep visual hierarchy consistent.
 */
export default function SectionHeading({
  title,
  id,
  children,
}: SectionHeadingProps) {
  return (
    <div className="flex items-center justify-between gap-4 mb-6">
      <h2
        id={id}
        className="text-2xl font-bold flex items-center gap-3 text-gray-900 dark:text-gray-100"
      >
        <span
          aria-hidden="true"
          className="inline-block w-1 h-7 bg-blue-600 dark:bg-blue-400 rounded-full"
        />
        {title}
      </h2>
      {children}
    </div>
  )
}
