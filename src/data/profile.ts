export interface ProfileData {
  name: string;
  role: string;
  taglines: string[];
  headline: string;
  intro: string;
  about: string;
  resumeUrl: string;
  location: string;
  email: string;
}

export const profile: ProfileData = {
  name: 'Nischal Rai',
  role: 'Developer',
  taglines: [
    'Passionate Developer',
    'Curious Learner',
    'Problem Solver',
  ],
  headline: 'I build modern, responsive & user-focused websites.',
  intro:
    "I'm a passionate developer who enjoys turning ideas into clean, responsive and meaningful digital experiences. I love learning new technologies, adapting to new challenges and building projects that solve real problems.",
  about:
    "I'm a hardworking and passionate developer who enjoys learning, experimenting and adapting to new technologies. I believe every project is an opportunity to learn something new and improve the way I build software.",
  resumeUrl: '/resume.pdf',
  location: 'Nepal',
  email: 'nischalrai@example.com',
};

export const philosophy = [
  {
    title: 'Always Learning',
    description:
      'Technology changes constantly, so I enjoy continuously learning new tools and approaches.',
    icon: 'book-open',
  },
  {
    title: 'Adaptability',
    description:
      "I'm comfortable entering an unfamiliar project and learning the existing structure, technologies and workflow.",
    icon: 'shuffle',
  },
  {
    title: 'Building Through Practice',
    description:
      'Instead of only learning theory, I believe in learning by building real projects.',
    icon: 'hammer',
  },
  {
    title: 'Problem Solving',
    description:
      "When something doesn't work, I enjoy understanding why and finding a practical solution.",
    icon: 'wrench',
  },
];

export const progression: string[] = ['Learn', 'Experiment', 'Build', 'Improve', 'Adapt'];
