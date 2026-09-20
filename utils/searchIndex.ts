/**
 * Global search index.
 *
 * Builds a flat, searchable list of entries from the static JSON content at
 * module load. Everything is computed once and shared, so the SearchModal can
 * filter purely on the client with zero backend (fits the GitHub Pages static
 * export). Each entry can either deep-link into the page (`#anchor`) or point
 * to an external resource.
 */

import interests from '@/data/interests.json'
import timeline from '@/data/timeline.json'
import projects from '@/data/projects.json'
import publications from '@/data/publications.json'
import videos from '@/data/videos.json'
import teaching from '@/data/teaching.json'
import type {
  Project,
  Publication,
  TimelineEntry,
  Video,
  Teaching,
} from '@/utils/data'

export type SearchEntryType =
  | 'section'
  | 'interest'
  | 'timeline'
  | 'project'
  | 'publication'
  | 'video'
  | 'course'
  | 'resource'

export interface SearchEntry {
  /** Human-readable label of the result. */
  title: string
  /** Optional one-line context shown under the title. */
  description?: string
  /** Section/category label shown as a small tag (e.g. "Teaching"). */
  group: string
  /** What kind of entry this is (drives icon / behavior). */
  type: SearchEntryType
  /** Where activating the result navigates to (in-page `#id` or external URL). */
  href: string
  /** True when `href` points off-site and should open in a new tab. */
  external: boolean
  /** Lower-cased haystack used for matching. */
  haystack: string
}

const typedTeaching = teaching as Teaching

function makeEntry(
  entry: Omit<SearchEntry, 'haystack'> & { keywords?: string[] },
): SearchEntry {
  const { keywords = [], ...rest } = entry
  const haystack = [
    rest.title,
    rest.description ?? '',
    rest.group,
    ...keywords,
  ]
    .join(' ')
    .toLowerCase()
  return { ...rest, haystack }
}

/** Top-level sections so users can jump around the page. */
const SECTION_ENTRIES: SearchEntry[] = [
  {
    title: 'About',
    description: 'Biography and background',
    href: '#biography',
    keywords: ['bio', 'about', 'who'],
  },
  {
    title: 'Research interests',
    description: 'Topics and focus areas',
    href: '#interests',
    keywords: ['research', 'topics'],
  },
  {
    title: 'The Road',
    description: 'Career and education timeline',
    href: '/road',
    keywords: ['career', 'experience', 'education', 'cv'],
  },
  {
    title: 'Projects',
    description: 'Research and engineering projects',
    href: '#projects',
    keywords: ['projects', 'work'],
  },
  {
    title: 'Publications',
    description: 'Papers and articles',
    href: '#publications',
    keywords: ['papers', 'articles', 'research'],
  },
  {
    title: 'Teaching',
    description: 'Courses and student resources',
    href: '/teaching',
    keywords: ['courses', 'lectures', 'classes'],
  },
  {
    title: 'Student corner',
    description: 'Resources, rules, thesis and conferences for students',
    href: '/teaching#student-corner',
    keywords: ['student', 'resources', 'attendance', 'thesis', 'rules'],
  },

  {
    title: 'Contact',
    description: 'Get in touch',
    href: '#contact',
    keywords: ['email', 'reach', 'message'],
  },
].map((s) =>
  makeEntry({
    ...s,
    group: 'Sections',
    type: 'section',
    external: false,
  }),
)

const INTEREST_ENTRIES: SearchEntry[] = [
  ...interests.focus,
  ...interests.ongoing,
].map((interest) =>
  makeEntry({
    title: interest,
    group: 'Interests',
    type: 'interest',
    href: '#interests',
    external: false,
  }),
)

const TIMELINE_ENTRIES: SearchEntry[] = (timeline.entries as TimelineEntry[])
  // Title-less photo-milestones have nothing meaningful to search by — skip them.
  .filter((entry): entry is TimelineEntry & { title: string } =>
    Boolean(entry.title),
  )
  .map((entry) => {
    // Photo-milestones may omit organization/endDate; build a tidy description
    // from whatever date info exists rather than emitting "undefined".
    const dateRange = entry.endDate
      ? `${entry.startDate}–${entry.endDate}`
      : entry.startDate
    const description = [entry.organization, dateRange]
      .filter(Boolean)
      .join(' · ')

    return makeEntry({
      title: entry.title,
      description,
      group: 'The Road',
      type: 'timeline',
      href: '/road/',
      external: false,
      keywords: [
        entry.organization ?? '',
        entry.location ?? '',
        entry.description ?? '',
      ],
    })
  })

const PROJECT_ENTRIES: SearchEntry[] = (projects.projects as Project[]).map(
  (project) =>
    makeEntry({
      title: project.title,
      description: project.description,
      group: 'Projects',
      type: 'project',
      href: '#projects',
      external: false,
      keywords: project.tags,
    }),
)

const PUBLICATION_ENTRIES: SearchEntry[] = (
  publications.publications as Publication[]
).map((pub) =>
  makeEntry({
    title: pub.title,
    description: `${pub.authors.join(', ')} · ${pub.venue || pub.year}`,
    group: 'Publications',
    type: 'publication',
    href: pub.pdfUrl || pub.doi || '#publications',
    external: Boolean(pub.pdfUrl || pub.doi),
    keywords: [...pub.authors, String(pub.year), pub.venue],
  }),
)

const VIDEO_ENTRIES: SearchEntry[] = (videos.videos as Video[]).map((video) =>
  makeEntry({
    title: video.title,
    description: video.description,
    group: 'Videos',
    type: 'video',
    href: `https://www.youtube.com/watch?v=${video.youtubeId}`,
    external: true,
    keywords: video.tags ?? [],
  }),
)

const COURSE_ENTRIES: SearchEntry[] = typedTeaching.courses.map((course) =>
  makeEntry({
    title: course.title,
    description: course.summary ?? course.topics.slice(0, 3).join(' · '),
    group: 'Teaching',
    type: 'course',
    href: `/teaching/${course.slug}/`,
    external: false,
    keywords: [
      course.level ?? '',
      ...course.topics,
      course.attendance,
      ...(typeof course.laboratory === 'string'
        ? [course.laboratory]
        : (course.laboratory ?? []).flatMap((item) => [
            item.text,
            item.link?.label ?? '',
          ])),
    ],
  }),
)

const RESOURCE_ENTRIES: SearchEntry[] = typedTeaching.studentCorner.links.map(
  (link) =>
    makeEntry({
      title: link.label,
      description: link.description,
      group: link.category
        ? `Student corner · ${link.category}`
        : 'Student corner',
      type: 'resource',
      href: link.url,
      external: true,
      keywords: link.keywords ?? [],
    }),
)

/** The complete, prebuilt search index. */
export const SEARCH_INDEX: SearchEntry[] = [
  ...SECTION_ENTRIES,
  ...COURSE_ENTRIES,
  ...RESOURCE_ENTRIES,
  ...INTEREST_ENTRIES,
  ...PROJECT_ENTRIES,
  ...PUBLICATION_ENTRIES,
  ...VIDEO_ENTRIES,
  ...TIMELINE_ENTRIES,
]

/**
 * Score an entry against a lower-cased query. Higher is better; 0 = no match.
 * Simple, dependency-free substring/word scoring that's plenty for this dataset.
 */
function scoreEntry(entry: SearchEntry, query: string): number {
  const title = entry.title.toLowerCase()
  if (!entry.haystack.includes(query)) {
    // Allow multi-word queries to match across the haystack in any order.
    const words = query.split(/\s+/).filter(Boolean)
    if (words.length <= 1) return 0
    if (!words.every((w) => entry.haystack.includes(w))) return 0
    return 1
  }

  if (title === query) return 100
  if (title.startsWith(query)) return 60
  if (title.includes(query)) return 40
  // Match was in description/keywords only.
  return 20
}

/** Returns the best-matching entries for a query, ranked by relevance. */
export function searchEntries(query: string, limit = 20): SearchEntry[] {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return []

  return SEARCH_INDEX.map((entry) => ({
    entry,
    score: scoreEntry(entry, normalized),
  }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.entry)
}
