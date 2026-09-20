/**
 * Shared types for the content stored under `data/*.json` — the single
 * source of truth for the content schema. Field comments here double as
 * the editing documentation.
 */

export interface Bio {
  name: string
  title: string
  institution: string
  institutionUrl: string
  bio: string
  researchGroupUrl?: string
  department?: string
  departmentUrl?: string
  sapiLineTracerUrl?: string
  photo: string
}

export interface Interests {
  /** Emphasized, current focus areas — shown as accented tags. */
  focus: string[]
  /** Longstanding interests, shown as secondary tags. */
  ongoing: string[]
}

export interface SocialLink {
  platform: string
  url: string
  /** Key into the ICONS table in `components/icons.tsx`; unknown keys render nothing. */
  icon: string
}

/**
 * A photo attached to a timeline point. Used for "photo-milestone" entries
 * on The Road (e.g. trips, events) where the entry is mostly image + caption.
 */
export interface TimelineImage {
  /**
   * Image path or URL, e.g. "/images/road/narvik1.jpg". Store new photos
   * under `public/images/road/` and run `npm run optimize-images` before
   * committing (resizes to fit 1600px, strips EXIF/GPS metadata).
   */
  src: string
  /** Short caption (1–2 words or a small sentence). */
  caption?: string
  /** Accessibility text. Falls back to caption, then the entry title. */
  alt?: string
}

export interface TimelineEntry {
  /** Optional — a photo-milestone may be just images + date. */
  title?: string
  /** Optional — photo-milestones have no organization. */
  organization?: string

  organizationUrl?: string
  /** "YYYY", "YYYY-MM", or "Present". */
  startDate: string
  /** Optional — omit for a single-moment milestone (shows one date). */
  endDate?: string
  /** Human-readable place, e.g. "Targu Mures, Romania" or "Narvik, Norway". */
  location?: string
  /** Optional coordinates — when present, the 📍 location links to a map. */
  lat?: number
  lng?: number
  description?: string
  /** Optional photos for this point (1, 2, 3+). */
  images?: TimelineImage[]
}

export interface Project {
  title: string
  description: string
  image?: string
  url?: string
  tags: string[]
}

export interface Publication {
  title: string
  authors: string[]
  venue: string
  year: number
  doi?: string
  pdfUrl?: string
  bibtex?: string
}

export interface Video {
  title: string
  /** 11-char YouTube ID (the v=... part of the URL). */
  youtubeId: string
  description?: string
  date?: string
  tags?: string[]
}

/** A downloadable / external resource attached to a course. */
export interface CourseMaterial {
  label: string
  url: string
  type?: StudentCornerLinkType
}

export interface TeachingCourse {
  /**
   * URL-safe identifier used for the dedicated page at /teaching/<slug>.
   * When adding a course, also add its URL to the hand-maintained
   * `public/sitemap.xml`.
   */
  slug: string
  title: string
  /** Short badge label, e.g. "BSc", "MSc". */
  level?: string
  /** One- or two-sentence overview shown on the card and page. */
  summary?: string
  attendance: string
  topics: string[]
  /** Plain paragraph, or bullet items with optional trailing links and periods. */
  laboratory?: string | {
    text: string
    link?: CourseMaterial
  }[]
  /** Project instructions followed by a linked guide on the course page. */
  project?: {
    text: string
    guide: CourseMaterial
  }
  /** How the course is graded. */
  grading?: string
  /** Optional slides / notes / repos shown on the course page. */
  materials?: CourseMaterial[]
  lastUpdated?: string
}

/** Categorizes a Student Corner link for grouping and icon selection. */
export type StudentCornerLinkType =
  | 'doc'
  | 'drive'
  | 'github'
  | 'conference'
  | 'external'

export interface StudentCornerLink {
  label: string
  url: string
  /** Short, human-friendly explanation shown under the label. */
  description?: string
  /** Grouping bucket, e.g. "Documents & rules", "Resources", "Thesis". */
  category?: string
  /** Drives the icon shown next to the link. Defaults to "external". */
  type?: StudentCornerLinkType
  /** Extra search terms so e.g. "attendance list" finds the right link. */
  keywords?: string[]
}

export interface StudentCorner {
  title: string
  lastUpdated?: string
  links: StudentCornerLink[]
}

export interface Teaching {
  courses: TeachingCourse[]
  studentCorner: StudentCorner
}

