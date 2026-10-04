export type NewsStory = {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  image: string;
  paragraphs: string[];
  sections?: {
    heading: string;
    items: string[];
  }[];
};

export const newsStories: NewsStory[] = [
  {
    slug: 'rwanda-youth-nuclear-summit-2025',
    title: 'Rwanda Youth Nuclear Summit 2025',
    date: '16 November 2025',
    category: 'Summit',
    excerpt:
      'RYGN brought young leaders together under the theme “Empowering Youth to Lead Rwanda’s Nuclear Future,” highlighting youth leadership in sustainable energy and peaceful nuclear applications.',
    image: '/images/gallery/Picture1.png',
    paragraphs: [
      'RYGN successfully organized the Rwanda Youth Nuclear Summit 2025, in collaboration with NiCE Club, University of Rwanda and Rwanda Atomic Energy Board, under the theme “Empowering Youth to Lead Rwanda’s Nuclear Future.” The summit emphasized the critical role of youth in achieving Rwanda’s long-term energy goals, including expanding electricity generation sustainably.',

      'Key discussions highlighted Rwanda’s progress in the peaceful applications of nuclear science—such as healthcare, agriculture, and environmental management—and the planned establishment of a Centre for Nuclear Science and Technology.',

      'The International Atomic Energy Agency (IAEA) reaffirmed its support for youth capacity building through training, fellowships, and technical cooperation, recognizing the importance of the Young Generation in Nuclear (YGN) in developing future expertise.',
],
  },
  {
    slug: 'atoms-connect-engagement',
    title: 'Atoms Connect Engagement',
    date: 'Ongoing',
    category: 'Community',
    excerpt:
      'RYGN members meet monthly through Atoms Connect to share knowledge, strengthen collaboration, and build a vibrant community of young nuclear professionals.',
    image: '/images/gallery/connect.jpeg',
    paragraphs: [
      'RYGN continues to actively participate in Atoms Connect, a monthly gathering that strengthens member engagement, knowledge sharing, and community building among young nuclear professionals and enthusiasts.',
      'These sessions create space for members to exchange ideas, learn from one another, and stay connected with developments across Rwanda’s nuclear ecosystem—from education and research to policy and industry.',
      'Through consistent participation, RYGN reinforces its mission to empower youth and sustain momentum for Rwanda’s peaceful nuclear future.',
    ],
  },
  {
    slug: 'women-and-girls-in-nuclear-rwanda-2026',
    title: 'Women and Girls in Nuclear Rwanda Campaign',
    date: '11–28 February 2026',
    category: 'Campaign',
    excerpt:
      'A nationwide campaign celebrating women and girls in nuclear science, featuring advocacy videos, digital outreach, and a flagship event at the University of Rwanda.',
    image: '/images/Application.jpeg',
    paragraphs: [
      'RYGN conducted a nationwide campaign to celebrate and promote the role of women and girls in nuclear science, aligning with global efforts to expand inclusion and representation in STEM.',
      'The campaign reached university and high school students, academic staff, STEM professionals, policymakers, and the wider public—encouraging more young women to see nuclear science as a meaningful and achievable career path.',
    ],
    sections: [
      {
        heading: 'Target audience',
        items: [
          'Primary: University and high school students, especially female students',
          'Secondary: Academic staff, STEM professionals, policymakers, and the public',
        ],
      },
      {
        heading: 'Key activities',
        items: [
          'Released advocacy videos featuring women and girls in nuclear, launched on the International Day of Women and Girls in Science and shared across digital platforms.',
          'Hosted a main event on 25 February 2026 at the University of Rwanda, including panel discussions and student engagement, in collaboration with key national stakeholders.',
        ],
      },
    ],
  },
  {
    slug: 'high-level-engagement-march-2026',
    title: 'High-Level Engagement with Rwanda Women in Nuclear',
    date: '3 March 2026',
    category: 'Partnership',
    excerpt:
      'RYGN joined a Rwanda Women in Nuclear meeting with Aline Des Cloizeaux, advancing collaboration and international engagement for youth inclusion in nuclear development.',
    image: '/images/gallery/Picture7.png',
    paragraphs: [
      'On 3 March 2026, RYGN participated in a Rwanda Women in Nuclear meeting with Aline Des Cloizeaux, strengthening collaboration and international engagement in advancing nuclear development and youth inclusion.',
      'The engagement underscored the importance of connecting Rwandan youth with regional and global networks, ensuring that young professionals have a voice in conversations shaping the future of nuclear science and technology on the continent.',
      'RYGN remains committed to building partnerships that open doors for mentorship, learning, and leadership opportunities for the next generation.',
    ],
  },
];

export function getStoryBySlug(slug: string): NewsStory | undefined {
  return newsStories.find((story) => story.slug === slug);
}

export function getAllStorySlugs(): string[] {
  return newsStories.map((story) => story.slug);
}
