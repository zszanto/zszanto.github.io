'use client'

import { useEffect, useState } from 'react'
import type { Project } from '@/utils/data'
import SectionHeading from './SectionHeading'

interface ProjectsProps {
  projects: Project[]
}

const MAX_VISIBLE_TAGS = 4

export default function Projects({ projects }: ProjectsProps) {
  const [activeProject, setActiveProject] = useState<Project | null>(null)

  // Close on Escape and lock body scroll while the modal is open.
  useEffect(() => {
    if (!activeProject) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveProject(null)
    }

    document.addEventListener('keydown', handleKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [activeProject])

  return (
    <section
      id="projects"
      className="py-12 border-t border-gray-200 dark:border-gray-700 scroll-mt-24"
    >
      <SectionHeading title="Projects" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => {
          const visibleTags = project.tags.slice(0, MAX_VISIBLE_TAGS)
          const extraTags = project.tags.length - visibleTags.length
          return (
            <article
              key={project.title}
              onClick={() => setActiveProject(project)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  setActiveProject(project)
                }
              }}
              role="button"
              tabIndex={0}
              aria-haspopup="dialog"
              aria-label={`View details for ${project.title}`}
              className="group cursor-pointer bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg dark:shadow-black/30 transition-all duration-300 hover:-translate-y-1 flex flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
            >
              {project.image && (
                <div className="relative h-48 w-full bg-gray-200 dark:bg-gray-700">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-4 flex flex-col flex-1">
                <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {visibleTags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                  {extraTags > 0 && (
                    <span
                      className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-1 rounded"
                      title={project.tags.slice(MAX_VISIBLE_TAGS).join(', ')}
                    >
                      +{extraTags}
                    </span>
                  )}
                </div>
                <span className="text-blue-600 dark:text-blue-400 group-hover:text-blue-800 dark:group-hover:text-blue-300 transition-colors inline-flex items-center mt-auto font-medium">
                  View details
                  <span
                    aria-hidden="true"
                    className="ml-1 inline-block transition-transform duration-200 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </span>
              </div>
            </article>
          )
        })}
      </div>

      {activeProject && (
        <ProjectModal
          project={activeProject}
          onClose={() => setActiveProject(null)}
        />
      )}
    </section>
  )
}

interface ProjectModalProps {
  project: Project
  onClose: () => void
}

function ProjectModal({ project, onClose }: ProjectModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 dark:bg-gray-900/80 text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-900 shadow transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <span aria-hidden="true" className="text-xl leading-none">
            ×
          </span>
        </button>

        {project.image && (
          <div className="relative h-56 w-full bg-gray-200 dark:bg-gray-700 rounded-t-lg overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.image}
              alt={project.title}
              decoding="async"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-6">
          <h3
            id="project-modal-title"
            className="text-xl font-semibold mb-4 pr-8"
          >
            {project.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6 whitespace-pre-line">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800"
            >
              View Project
              <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
