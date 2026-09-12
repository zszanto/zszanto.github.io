import bio from '@/data/bio.json'
import social from '@/data/social.json'
import interests from '@/data/interests.json'
import projects from '@/data/projects.json'
import publications from '@/data/publications.json'
import videos from '@/data/videos.json'
import teaching from '@/data/teaching.json'


import Hero from '@/components/Hero'
import Biography from '@/components/Biography'
import Interests from '@/components/Interests'
import RoadTeaser from '@/components/RoadTeaser'
import Projects from '@/components/Projects'
import Publications from '@/components/Publications'
import Videos from '@/components/Videos'
import Teaching from '@/components/Teaching'
import Contact from '@/components/Contact'

import type {
  Bio,
  Project,
  Publication,
  SocialLink,
  Video,
  Teaching as TeachingType,
} from '@/utils/data'


export default function Home() {
  return (
    <>
      <Hero bio={bio as Bio} social={social.socialLinks as SocialLink[]} />
      <Biography bio={bio as Bio} />
      <Interests
        intro={interests.intro}
        focus={interests.focus}
        ongoing={interests.ongoing}
      />
      <Projects projects={projects.projects as Project[]} />
      <Publications publications={publications.publications as Publication[]} />
      <Teaching teaching={teaching as TeachingType} />
      {videos.videos.length > 0 && (
        <Videos videos={videos.videos as Video[]} />
      )}
      <RoadTeaser />
      <Contact social={social.socialLinks as SocialLink[]} />
    </>
  )
}
