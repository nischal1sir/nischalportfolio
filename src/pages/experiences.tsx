import { memo } from 'react';

const Experiences = () => {
  const education = [
    {
      id: 'edu-1',
      institution: 'Itahari International College',
      degree: 'BIT (Hons) — Bachelor of Information Technology',
      period: '2023 — Present',
      status: 'Current Student',
      location: 'Itahari, Nepal',
      highlights: [
        'Focused on Full-Stack Development, Database Systems, and Software Engineering',
        'Relevant coursework: Data Structures & Algorithms, Web Technologies, Database Management, Object-Oriented Programming',
        'Active in coding clubs and hackathons',
      ],
    },
  ];

  const internships = [
    {
      id: 'int-1',
      company: 'Youth IT',
      role: 'Frontend Developer Intern',
      period: 'Jun 2024 — Sep 2024',
      location: 'Remote / Nepal',
      type: 'Internship',
      highlights: [
        'Built responsive UI components using React, TypeScript, and Tailwind CSS',
        'Collaborated with backend team to integrate REST APIs',
        'Implemented state management and form handling for client projects',
        'Participated in code reviews and agile development workflow',
      ],
      technologies: ['React', 'TypeScript', 'Tailwind CSS', 'REST APIs', 'Git'],
    },
  ];

  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12">
      <h2 className="text-[10px] sm:text-[11px] tracking-[0.12em] uppercase font-medium mb-8 sm:mb-10 text-[#171717]">
        Experiences
      </h2>

      {/* Education Section */}
      <section className="mb-12 sm:mb-16">
        <h3 className="text-[13px] sm:text-[14px] font-medium text-[#4d4d4d] mb-6 tracking-[0.05em] uppercase">
          Education
        </h3>
        <div className="space-y-6">
          {education.map((edu) => (
            <article
              key={edu.id}
              className="bg-white border border-[#ebebeb] rounded-lg p-5 sm:p-6 transition-all duration-200 hover:border-[#a1a1a1]"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                <div>
                  <h4 className="text-[16px] sm:text-[18px] font-semibold text-[#171717] mb-1">
                    {edu.institution}
                  </h4>
                  <p className="text-[14px] text-[#4d4d4d] font-medium">{edu.degree}</p>
                </div>
                <div className="flex flex-col items-end sm:items-end text-right">
                  <span className="text-[12px] sm:text-[13px] text-[#888888] font-mono whitespace-nowrap">
                    {edu.period}
                  </span>
                  <span
                    className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium ${
                      edu.status === 'Current Student'
                        ? 'bg-[#d3e5ff] text-[#0070f3]'
                        : 'bg-[#ebebeb] text-[#4d4d4d]'
                    }`}
                  >
                    {edu.status}
                  </span>
                </div>
              </div>

              <p className="text-[13px] text-[#888888] mb-3">
                <span className="font-medium text-[#4d4d4d]">Location:</span> {edu.location}
              </p>

              <ul className="space-y-2 ml-4 list-disc">
                {edu.highlights.map((highlight, idx) => (
                  <li key={idx} className="text-[13px] text-[#4d4d4d] leading-relaxed">
                    {highlight}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* Internship Section */}
      <section>
        <h3 className="text-[13px] sm:text-[14px] font-medium text-[#4d4d4d] mb-6 tracking-[0.05em] uppercase">
          Internships
        </h3>
        <div className="space-y-6">
          {internships.map((int) => (
            <article
              key={int.id}
              className="bg-white border border-[#ebebeb] rounded-lg p-5 sm:p-6 transition-all duration-200 hover:border-[#a1a1a1]"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#f5f5f5] text-[#4d4d4d]">
                      {int.type}
                    </span>
                  </div>
                  <h4 className="text-[16px] sm:text-[18px] font-semibold text-[#171717] mb-1">
                    {int.role}
                  </h4>
                  <p className="text-[14px] text-[#4d4d4d] font-medium">{int.company}</p>
                </div>
                <div className="flex flex-col items-end sm:items-end text-right">
                  <span className="text-[12px] sm:text-[13px] text-[#888888] font-mono whitespace-nowrap">
                    {int.period}
                  </span>
                  <span className="mt-1 text-[12px] text-[#888888]">
                    {int.location}
                  </span>
                </div>
              </div>

              <ul className="space-y-2 ml-4 list-disc mb-4">
                {int.highlights.map((highlight, idx) => (
                  <li key={idx} className="text-[13px] text-[#4d4d4d] leading-relaxed">
                    {highlight}
                  </li>
                ))}
              </ul>

              {int.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-3 border-t border-[#ebebeb]">
                  {int.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-[11px] px-2.5 py-1 bg-[#fafafa] text-[#4d4d4d] rounded-full border border-[#ebebeb] font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default memo(Experiences);