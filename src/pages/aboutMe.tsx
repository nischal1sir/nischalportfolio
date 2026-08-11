import { useState, useEffect } from 'react';

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target]);

  return <span>{count}{suffix}</span>;
}

export default function About() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const stats = [
    { number: 15, suffix: '+', label: 'Projects Built' },
    { number: 5, suffix: '+', label: 'Technologies' },
    { number: 20, suffix: '+', label: 'Happy Clients' },
    { number: 0, suffix: '', label: 'Sleep Hours' },
  ];

  return (
    <section
      className={`relative z-10 px-5 sm:px-8 md:px-12 lg:px-16 py-8 sm:py-12 max-w-3xl mx-auto transition-all duration-700 ease-out ${
        loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <h1 className="font-bodoni-main text-[clamp(2.5rem,8vw,4rem)] leading-[0.9] tracking-[-0.02em] text-[#0a0a0a] mb-8">
        About Me
      </h1>

      {/* Stats Section */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="text-center border-t-2 border-[#0a0a0a] pt-4">
            <span className="block text-[28px] sm:text-[32px] font-semibold text-[#0a0a0a]">
              {loaded ? <AnimatedCounter target={stat.number} suffix={stat.suffix} /> : `0${stat.suffix}`}
            </span>
            <span className="text-[10px] sm:text-[11px] tracking-[0.1em] uppercase text-[#888]">
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* Rest of your about content */}
      <div className="space-y-6 text-[15px] sm:text-[16px] leading-[1.7] text-[#222]">
        <p>
          I'm <strong>Nischal Rai</strong>, a FullStack developer specializing in the 
          <strong> MERN stack</strong>. I build end-to-end web applications with a focus on 
          clean architecture, responsive interfaces, and performant APIs.
        </p>

        <p>
          My core stack is <strong>React, Node.js, Express, and MongoDB</strong>, with 
          <strong> TypeScript</strong> and <strong>Tailwind CSS</strong> on the frontend. 
          I'm comfortable across the entire development lifecycle.
        </p>

        <p>
          Currently, I'm expanding into <strong>Python</strong> and <strong>Large Language Models (LLMs)</strong> 
          to bridge traditional web development with AI-powered applications.
        </p>

        <p>
          I'm based in <strong>Nepal</strong> and actively seeking <strong>internship or junior developer 
          opportunities</strong> where I can contribute to real products and grow rapidly in a production environment.
        </p>
      </div>

      {/* Quick facts */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="border border-[#ddd] p-4 sm:p-5">
          <h3 className="text-[10px] tracking-[0.12em] uppercase font-medium mb-2 text-[#888]">
            Education
          </h3>
          <p className="text-[14px] text-[#222]">
            Bachelor in Computer Science<br />
            <span className="text-[#666]">Currently Studying — Nepal</span>
          </p>
        </div>
        <div className="border border-[#ddd] p-4 sm:p-5">
          <h3 className="text-[10px] tracking-[0.12em] uppercase font-medium mb-2 text-[#888]">
            Focus Areas
          </h3>
          <p className="text-[14px] text-[#222]">
            FullStack Web Development<br />
            <span className="text-[#666]">Emerging: AI / LLM Integration</span>
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-10 border border-[#4a90d9] p-5 sm:p-6">
        <p className="text-[14px] sm:text-[15px] text-[#222] leading-relaxed">
          I'm currently <strong>available for internships and junior roles</strong>. 
          If you're building something ambitious and need a developer who learns fast 
          and ships faster — let's talk.
        </p>
        <a
          href="#/connect"
          className="inline-block mt-4 text-[11px] tracking-[0.15em] uppercase font-semibold text-[#4a90d9] hover:underline"
        >
          Get in touch →
        </a>
      </div>
    </section>
  );
}