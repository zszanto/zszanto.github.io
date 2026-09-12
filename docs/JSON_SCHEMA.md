# JSON Schema Reference

The site is rendered from the JSON files in `data/`. Each file maps to a TypeScript interface in [`utils/data.ts`](../utils/data.ts) — this document is the human-readable companion to those types.

If you change a schema, update **all three**:

1. The JSON file in `data/`.
2. The matching interface in `utils/data.ts`.
3. The corresponding section here.

---

## `bio.json`

```ts
interface Bio {
  name: string
  title: string
  institution: string
  institutionUrl: string
  bio: string
  researchGroup?: string
  researchGroupUrl?: string
  department?: string
  departmentUrl?: string
  lab?: string
  labUrl?: string
  photo: string         // absolute URL or path under /public
}
```

```json
{
  "name": "Dr. Jane Smith",
  "title": "Research Scientist",
  "institution": "MIT",
  "institutionUrl": "https://mit.edu",
  "bio": "I research...",
  "researchGroup": "AI Research Lab",
  "researchGroupUrl": "https://ailab.mit.edu",
  "photo": "/images/profile.jpg"
}
```

---

## `social.json`

```ts
interface SocialFile {
  socialLinks: Array<{
    platform: string
    url: string
    icon: string        // key into the icon table in components/icons.tsx
  }>
}
```

Supported `icon` keys:

`email`, `github`, `gitlab`, `bitbucket`, `linkedin`, `orcid`,
`googlescholar`, `researchgate`, `dblp`, `youtube`, `twitter`.

Unknown icons render as nothing — extend `components/icons.tsx` to add more.

```json
{
  "socialLinks": [
    { "platform": "Email", "url": "mailto:me@example.com", "icon": "email" },
    { "platform": "GitHub", "url": "https://github.com/me", "icon": "github" }
  ]
}
```

---

## `interests.json`

```ts
interface InterestsFile {
  intro?: string        // short lead sentence about current direction
  focus: string[]       // emphasized, current focus areas
  ongoing: string[]     // longstanding interests, shown as secondary tags
}
```

```json
{
  "intro": "Recently moving toward cloud and AI, with a strong focus on backend development.",
  "focus": ["Cloud & AI", "Backend development"],
  "ongoing": ["Networked Robotics", "Cyber-security", "Industrial IoT"]
}
```

---

## `education.json`

```ts
interface EducationFile {
  education: Array<{
    degree: string
    field: string
    institution: string
    institutionUrl: string
    year: number             // used for sorting (most recent first)
    startYear?: number
    endYear?: number
    location: string
    thesis?: string
  }>
}
```

---

## `experience.json`

```ts
interface ExperienceFile {
  experience: Array<{
    title: string
    company: string
    companyUrl: string
    startDate: string        // "YYYY-MM" or "YYYY-MM-DD"
    endDate: string          // same, or the literal "Present"
    location: string
    description: string
  }>
}
```

---

## `timeline.json`

"The Road" — a single chronological stream of career, education, and personal
photo-milestones. Entries are sorted by `startDate` (most recent first).

```ts
interface TimelineFile {
  entries: Array<{
    title: string
    organization?: string      // optional — photo-milestones have none
    organizationUrl?: string
    startDate: string          // "YYYY", "YYYY-MM", or "Present"
    endDate?: string           // omit for a single-moment milestone (one date shown)
    location?: string          // place label, e.g. "Targu Mures, Romania" / "Narvik, Norway"
    lat?: number               // optional coords — turn the 📍 location into a Google Maps link
    lng?: number
    description?: string
    images?: Array<{           // optional photos for this point (1, 2, 3+)
      src: string              // URL or /images/... path
      caption?: string         // per-image 1–2 words or a small sentence
      alt?: string             // accessibility text (falls back to caption, then title)
    }>
  }>
}
```

A normal career/education entry uses `organization` + `startDate`/`endDate`.
A photo-milestone can be as little as `title` + `startDate` + `images`.
Geolocation is **per entry** (one place per point), not per image:

```json
{
  "title": "Narvik",
  "startDate": "2024",
  "location": "Narvik, Norway",
  "lat": 68.4385,
  "lng": 17.4272,
  "description": "A trip to the Norwegian Arctic.",
  "images": [
    { "src": "/images/road/narvik1.jpg", "caption": "Above the fjord" },
    { "src": "/images/road/narvik2.jpg", "caption": "Arctic light" }
  ]
}
```

When an entry has `images`, they render as a responsive thumbnail grid
(single column on mobile, two-up on `sm`+ screens) beneath the entry, each
with its own caption. The entry's `location` shows on its own line; provide
`lat`/`lng` to turn it into a 📍 Google Maps link. Keep images compressed
(~1200px wide) and store them under `public/images/road/`.


---

## `projects.json`


```ts
interface ProjectsFile {
  projects: Array<{
    title: string
    description: string
    image: string            // URL or /images/... path
    url: string
    tags: string[]
  }>
}
```

---

## `publications.json`

```ts
interface PublicationsFile {
  publications: Array<{
    title: string
    authors: string[]
    venue: string
    year: number             // sorted descending
    doi?: string             // bare DOI like "10.1109/CVPR.2024.12345"
    pdfUrl?: string
    bibtex?: string          // raw BibTeX; rendered as a copyable block
  }>
}
```

---

## `videos.json`

```ts
interface VideosFile {
  videos: Array<{
    title: string
    description: string
    youtubeId: string        // 11-char YouTube ID (the v=... part of the URL)
    date?: string            // optional, "YYYY-MM-DD"
    tags?: string[]
  }>
}
```

The videos section is only rendered when this array is non-empty. To hide the section entirely, leave it as `{ "videos": [] }`.

---

## Editing tips

- Validate JSON with `jq . data/whatever.json > /dev/null`.
- Beware trailing commas — JSON doesn't allow them.
- Strings with quotes or special characters should escape with `\"`.
- After editing, run `npm run build` to catch type errors early.
