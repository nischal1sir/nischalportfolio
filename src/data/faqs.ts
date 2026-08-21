export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const faqs: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'What can I deliver for you?',
    answer:
      'Modern, fully responsive websites — including business websites, portfolio sites, frontend work and full-stack projects. I build flexible solutions according to your requirements and budget, covering design, responsiveness, animations and modern redesigns.',
  },
  {
    id: 'faq-2',
    question: 'What technologies do you use?',
    answer:
      'My primary stack is React, TypeScript, Tailwind CSS, Node.js and Express. I also work with MongoDB, MySQL and Supabase for databases, and tools like Git/GitHub, Figma and Linux/CLI for my workflow.',
  },
  {
    id: 'faq-3',
    question: 'How do you make sure websites work on all devices?',
    answer:
      'I build mobile-first using responsive grids, flexible typography and Tailwind breakpoints. Every site I deliver is tested across small phones, tablets, laptops and desktop screens to avoid horizontal scrolling.',
  },
  {
    id: 'faq-4',
    question: 'Are you open to internships?',
    answer:
      "Yes. I'm currently open to internship opportunities where I can learn from experienced developers, contribute to real projects and grow as a software developer. Reach out through the Let's Talk page.",
  },
  {
    id: 'faq-6',
    question: 'How can we contact you for a project?',
    answer:
      "Use the Let's Talk page to send me a message with your project idea, timeline or budget. The form posts to my backend and stores your message. I usually reply within a couple of days through your preferred channel.",
  },
];
