import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGallery } from '../hooks/usePortfolioData';
import type { GalleryShape } from '../types';
import { X, ChevronLeft, ChevronRight, Tag, Images } from 'lucide-react';

const SHAPE_SPAN_CLASSES: Record<GalleryShape, { col: string; row: string }> = {
  small_square: { col: 'col-span-12 sm:col-span-6 md:col-span-3', row: 'row-span-2' },
  medium_square: { col: 'col-span-12 sm:col-span-6 md:col-span-4', row: 'row-span-3' },
  large_square: { col: 'col-span-12 sm:col-span-6 md:col-span-6', row: 'row-span-4' },
  portrait: { col: 'col-span-12 sm:col-span-6 md:col-span-3', row: 'row-span-4' },
  tall_portrait: { col: 'col-span-12 sm:col-span-6 md:col-span-4', row: 'row-span-5' },
  landscape: { col: 'col-span-12 sm:col-span-6 md:col-span-6', row: 'row-span-3' },
  wide_landscape: { col: 'col-span-12 sm:col-span-12 md:col-span-8', row: 'row-span-3' },
  large_feature: { col: 'col-span-12 sm:col-span-12 md:col-span-8', row: 'row-span-5' },
  custom: { col: 'col-span-12 sm:col-span-6 md:col-span-4', row: 'row-span-3' },
};

export default function GalleryPage() {
  const { images, loading, error } = useGallery();
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  // Filter visible images
  const filteredImages = images.filter(img => img.is_visible !== false);

  const activeImage = activeImageIndex !== null ? filteredImages[activeImageIndex] : null;

  const handlePrev = () => {
    if (activeImageIndex === null) return;
    setActiveImageIndex(activeImageIndex === 0 ? filteredImages.length - 1 : activeImageIndex - 1);
  };

  const handleNext = () => {
    if (activeImageIndex === null) return;
    setActiveImageIndex(activeImageIndex === filteredImages.length - 1 ? 0 : activeImageIndex + 1);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] pt-8 pb-20 px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#ebebeb]">
          <div>
            <div className="flex items-center gap-2 text-[#0070f3] text-[12px] font-semibold tracking-wider uppercase mb-1">
              <Images size={15} />
              <span>Visual Showcase</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              Gallery & Archive
            </h1>
            <p className="text-sm text-[#666666] mt-1 max-w-xl">
              An editorial visual collection of projects, developer setups, design inspiration, and workflow snapshots.
            </p>
          </div>
        </header>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-16">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="h-64 rounded-2xl bg-[#eaeaea] animate-pulse" />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="p-4 rounded-xl bg-red-50 text-red-600 border border-red-100 text-sm">
            Failed to load gallery: {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredImages.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-[#dddddd] px-4">
            <p className="text-[#888888] text-sm">No gallery items found in this category.</p>
          </div>
        )}

        {/* Dynamic Editorial Grid */}
        {!loading && filteredImages.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-6 md:grid-cols-12 auto-rows-[110px] gap-4">
            {filteredImages.map((item, idx) => {
              const shapeKey = item.shape || 'medium_square';
              const spanClasses = SHAPE_SPAN_CLASSES[shapeKey] || SHAPE_SPAN_CLASSES.medium_square;
              
              // Custom span overrides if available
              const customColSpan = item.width ? `md:col-span-${Math.min(12, Math.max(1, item.width))}` : '';
              const customRowSpan = item.height ? `row-span-${Math.min(6, Math.max(1, item.height))}` : '';

              const itemColClass = customColSpan || spanClasses.col;
              const itemRowClass = customRowSpan || spanClasses.row;
              const formattedNum = String(idx + 1).padStart(3, '0');

              return (
                <motion.div
                  key={item.id}
                  layoutId={`gallery-card-${item.id}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.04 }}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`group relative rounded-2xl overflow-hidden bg-white border border-[#ebebeb] cursor-pointer shadow-sm hover:shadow-md transition-all duration-300 ${itemColClass} ${itemRowClass}`}
                  style={{ zIndex: item.z_index || 1 }}
                >
                  {/* Image Container */}
                  <div className="w-full h-full relative overflow-hidden bg-[#f4f4f5]">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full transition-transform duration-500 group-hover:scale-105"
                      style={{
                        objectFit: item.object_fit || 'cover',
                        objectPosition: item.object_position || 'center',
                      }}
                      loading="lazy"
                    />

                    {/* Gradient Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white" />

                    {/* Top Index Badge */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/80 backdrop-blur-md text-[#171717] text-[10px] font-mono font-semibold tracking-wider border border-white/40 shadow-xs group-hover:bg-white transition-colors">
                      {formattedNum}
                    </div>

                    {/* Category Tag */}
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-medium tracking-wide">
                      {item.category}
                    </div>

                    {/* Hover Info Overlay Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 text-white">
                      <h3 className="text-sm font-semibold tracking-tight leading-snug drop-shadow-sm">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-xs text-white/80 line-clamp-1 mt-0.5 font-light">
                          {item.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/20 text-[11px] text-white/90">
                        <span>Details ↗</span>
                        {item.tags && item.tags.length > 0 && (
                          <span className="font-mono text-[10px] text-white/70">#{item.tags[0]}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Lightbox Modal */}
        <AnimatePresence>
          {activeImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6"
              onClick={() => setActiveImageIndex(null)}
            >
              <div
                className="relative max-w-5xl w-full bg-[#171717] rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col md:flex-row"
                onClick={e => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={() => setActiveImageIndex(null)}
                  className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 text-white hover:bg-white hover:text-black flex items-center justify-center transition-colors"
                  aria-label="Close lightbox"
                >
                  <X size={18} />
                </button>

                {/* Left/Right Navigation */}
                {filteredImages.length > 1 && (
                  <>
                    <button
                      onClick={handlePrev}
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/50 text-white hover:bg-white hover:text-black flex items-center justify-center transition-colors"
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={handleNext}
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/50 text-white hover:bg-white hover:text-black flex items-center justify-center transition-colors md:hidden"
                      aria-label="Next image"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}

                {/* Main Lightbox Image Container */}
                <div className="w-full md:w-2/3 h-[50vh] md:h-[75vh] relative bg-black flex items-center justify-center p-4">
                  <img
                    src={activeImage.image_url}
                    alt={activeImage.title}
                    className="max-w-full max-h-full object-contain rounded-xl"
                  />
                </div>

                {/* Image Details Sidebar */}
                <div className="w-full md:w-1/3 p-6 md:p-8 flex flex-col justify-between bg-[#1f1f1f] text-white border-t md:border-t-0 md:border-l border-white/10">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs text-white/50 font-mono">
                      <span>{String((activeImageIndex ?? 0) + 1).padStart(3, '0')} / {String(filteredImages.length).padStart(3, '0')}</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white/80 font-sans text-[11px]">
                        {activeImage.category}
                      </span>
                    </div>

                    <div>
                      <h2 className="text-xl font-bold tracking-tight text-white">
                        {activeImage.title}
                      </h2>
                      {activeImage.description && (
                        <p className="text-sm text-white/70 mt-2 leading-relaxed font-light">
                          {activeImage.description}
                        </p>
                      )}
                    </div>

                    {/* Tags */}
                    {activeImage.tags && activeImage.tags.length > 0 && (
                      <div className="pt-2">
                        <div className="flex items-center gap-1.5 text-xs text-white/50 mb-2">
                          <Tag size={12} />
                          <span>Tags</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {activeImage.tags.map(tag => (
                            <span key={tag} className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-white/80">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Desktop Prev / Next Controls */}
                  <div className="hidden md:flex items-center justify-between pt-6 border-t border-white/10">
                    <button
                      onClick={handlePrev}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-xs font-medium transition-colors"
                    >
                      <ChevronLeft size={16} />
                      <span>Previous</span>
                    </button>
                    <button
                      onClick={handleNext}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-xs font-medium transition-colors"
                    >
                      <span>Next</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
