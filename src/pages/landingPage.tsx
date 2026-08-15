import { useState, useEffect } from 'react';
import CardArc7 from '../components/CardArc7';
import ShinyText from '../components/ShinyText';
import { galleryApi } from '../services/api';
import type { GalleryImage } from '../types';

import photo from '../assets/profile.jpg';
import photo1 from '../assets/image1.png';
import photo2 from '../assets/image2.png';
import photo3 from '../assets/image3.png';
import photo4 from '../assets/image4.png';
import photo5 from '../assets/image5.png';
import photo6 from '../assets/image6.png';

const photos = [photo, photo1, photo2, photo3, photo4, photo5, photo6];

const faqs = [
  {
    id: 1,
    question: 'What technologies do you specialize in?',
    answer: 'I specialize in React, Node.js, TypeScript, PostgreSQL, and cloud platforms like AWS and Vercel. I also work with React Native for mobile development.',
  },
  {
    id: 2,
    question: 'How long does a typical project take?',
    answer: 'Project timelines vary based on scope. A simple portfolio site takes 2-3 weeks, while a full SaaS application can take 2-4 months. I provide detailed timelines during our initial consultation.',
  },
  {
    id: 3,
    question: 'Do you offer maintenance and support?',
    answer: 'Yes, I offer ongoing maintenance packages including security updates, performance monitoring, feature additions, and technical support. Plans start at $200/month.',
  },
  {
    id: 4,
    question: 'What is your development process?',
    answer: 'My process: Discovery → Planning → Design → Development → Testing → Launch → Maintenance. I keep you updated at every stage with regular demos and feedback sessions.',
  },
  {
    id: 5,
    question: 'Can you work with my existing team?',
    answer: 'Absolutely. I regularly collaborate with in-house teams, designers, and product managers. I adapt to your workflow, tools, and communication preferences.',
  },
  {
    id: 6,
    question: 'How do we get started?',
    answer: 'Click the "Contact us" button below, fill out the brief form, and I\'ll get back to you within 24 hours to schedule a free 30-minute discovery call.',
  },
];

export default function LandingPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    setIsLoaded(true);

    galleryApi
      .getAll()
      .then(setGallery)
      .catch((err) => console.error('Gallery fetch failed:', err))
      .finally(() => setGalleryLoading(false));
  }, []);

  const toggleFaq = (id: number) => {
    setOpenFaq((prev) => (prev === id ? null : id));
  };

  return (
    <div className="bg-[#f4f4f4] text-[#111] font-sans selection:bg-black selection:text-white flex flex-col relative overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;0,6..96,600;0,6..96,700;1,6..96,400&display=swap');
        .font-bodoni-main {
          font-family: 'Bodoni Moda', 'Bodoni MT', 'Didot', 'Times New Roman', serif;
        }
      `}</style>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center px-4 sm:px-6 md:px-8 lg:px-12">
        <div
          className={`flex flex-col items-center pt-6 sm:pt-8 transition-all duration-700 ease-out ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <h1 className="text-center leading-[0.82] sm:leading-[0.85] tracking-[-0.02em]">
            <span className="block text-[clamp(3.2rem,14vw,9rem)] sm:text-[clamp(3.5rem,12vw,9rem)]">
              <ShinyText
                text="Nischal"
                speed={2}
                delay={0}
                color="#0a0a0a"
                shineColor="#C7C3C3"
                spread={120}
                direction="left"
                yoyo={false}
                pauseOnHover={true}
                className="font-bodoni-main"
              />
            </span>
            <span className="block text-[clamp(3.2rem,14vw,9rem)] sm:text-[clamp(3.5rem,12vw,9rem)]">
              <ShinyText
                text="FuckingSucks"
                speed={2}
                delay={0.3}
                color="#0a0a0a"
                shineColor="#C7C3C3"
                spread={120}
                direction="right"
                yoyo={false}
                pauseOnHover={true}
                className="font-bodoni-main"
              />
            </span>
          </h1>

          <p className="mt-4 bg-red-300 text-[9px] sm:text-[10px] tracking-[0.25em] uppercase font-bold text-[#555] text-center">
            FullStack developer
          </p>
        </div>

        <div
          className={`relative mt-8 sm:mt-10 mb-10 sm:mb-12 transition-all duration-700 delay-200 ease-out ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <CardArc7
            images={photos}
            angle={45}
            gap={110}
            yOffset={30}
            hoverIntensity={1}
            cardClassName="bg-neutral-800"
          />

          <div className="absolute -right-2 top-8 md:hidden z-20 rotate-12 pointer-events-none">
            <div className="flex items-center gap-1.5 bg-black text-white text-[10px] font-bold tracking-[0.15em] uppercase px-3.5 py-2 rounded-full shadow-xl animate-bounce">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
                <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
                <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
                <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
              </svg>
              Tap
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section
        className={`relative z-10 px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-10 max-w-3xl mx-auto lg:mx-0 lg:max-w-2xl transition-all duration-700 delay-300 ease-out ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <h2 className="text-[10px] sm:text-[11px] tracking-[0.12em] uppercase font-medium mb-4 sm:mb-5 text-[#111]">
          Brief Desc ' Mr.Rai
        </h2>
        <div className="border border-[black] p-4 sm:p-5 max-w-lg">
          <p className="text-[14px] sm:text-[15px] leading-relaxed text-[#222] font-normal">
            Nischal FuckingSucks at coding but somehow ships MERN apps anyway. React on the face, Node in the back, MongoDB somewhere in the closet.
          </p>
        </div>
      </section>

      {/* Gallery */}
      <section className="relative z-10 px-4 sm:px-6 md:px-8 lg:px-12 py-10 sm:py-16">
        <h2 className="text-[10px] sm:text-[11px] tracking-[0.12em] uppercase font-medium mb-6 sm:mb-8 text-[#111]">
          Gallery
        </h2>

        {galleryLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-[#e8e8e8] animate-pulse rounded-lg"
              />
            ))}
          </div>
        ) : gallery.length === 0 ? (
          <p className="text-[13px] sm:text-[14px] text-[#888]">No gallery images yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {gallery.map((img) => (
              <figure
                key={img.id}
                className="group relative aspect-square overflow-hidden rounded-lg border border-[#e0e0e0]"
              >
                <img
                  src={img.image_url}
                  alt={img.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <figcaption className="absolute inset-0 flex flex-col items-start justify-end p-3 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-[12px] sm:text-[13px] font-semibold">
                    {img.title}
                  </span>
                  {img.description && (
                    <span className="text-white/80 text-[10px] sm:text-[11px] line-clamp-2 mt-0.5">
                      {img.description}
                    </span>
                  )}
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </section>

      {/* FAQ Section */}
      <section className="relative z-10 px-4 sm:px-6 md:px-8 lg:px-12 py-10 sm:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
            {/* Left Content */}
            <div className="lg:w-1/2 lg:pr-8 flex flex-col justify-center">
              <h2 className="text-[10px] sm:text-[11px] tracking-[0.12em] uppercase font-medium mb-4 sm:mb-5 text-[#111]">
                FAQs
              </h2>
              <h3 className="text-[clamp(2rem,6vw,3.5rem)] leading-[1.1] font-bodoni-main text-[#111] mb-6">
                Got questions?<br />We've got answers.
              </h3>
              <p className="text-[14px] sm:text-[15px] leading-relaxed text-[#444] mb-8 max-w-md">
                Still have questions?<br />Contact us directly and we'll get back to you within 24 hours.
              </p>
              <a
                href="/connect"
                className="inline-flex items-center justify-center px-6 py-3 bg-[#111] text-white text-[11px] sm:text-[12px] font-medium uppercase tracking-[0.1em] hover:opacity-80 transition-opacity w-fit"
              >
                Contact us
              </a>
            </div>

            {/* Right FAQ Accordion */}
            <div className="lg:w-1/2 w-full">
              <div className="bg-white border border-[#e0e0e0] rounded-xl overflow-hidden">
                {faqs.map((faq) => {
                  const isOpen = openFaq === faq.id;
                  return (
                    <div
                      key={faq.id}
                      className="group border-t border-[#e0e0e0] first:border-t-0"
                    >
                      <button
                        type="button"
                        onClick={() => toggleFaq(faq.id)}
                        className="flex w-full items-center justify-between px-6 py-5 text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111] focus-visible:ring-offset-2"
                        aria-expanded={isOpen}
                      >
                        <span className="flex items-center gap-3 text-[14px] sm:text-[15px] font-medium text-[#111]">
                          <span className="text-[12px] sm:text-[13px] font-mono text-[#888] w-8 text-right">
                            {String(faq.id).padStart(2, '0')}
                          </span>
                          {faq.question}
                        </span>
                        <svg
                          className={`w-5 h-5 text-[#555] flex-shrink-0 transition-transform duration-200 ${
                            isOpen ? 'rotate-180' : 'rotate-0'
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-6 pt-2 animate-fade-in">
                          <p className="text-[13px] sm:text-[14px] leading-relaxed text-[#555]">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}