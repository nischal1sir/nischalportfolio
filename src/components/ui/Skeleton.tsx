import type { CSSProperties } from 'react';

type SkeletonProps = {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: string;
  style?: CSSProperties;
  ariaLabel?: string;
};

const base =
  'relative overflow-hidden bg-[#f0f0f0] before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.6s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

export function Skeleton({
  className = '',
  width,
  height,
  rounded = 'rounded',
  style,
  ariaLabel,
}: SkeletonProps) {
  return (
    <div
      aria-busy="true"
      aria-label={ariaLabel}
      role="status"
      className={`${base} ${rounded} ${className}`}
      style={{ width, height, ...style }}
    />
  );
}

type TextSkeletonProps = { lines?: number; className?: string };

export function TextLines({ lines = 3, className = '' }: TextSkeletonProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height={12}
          width={i === lines - 1 ? '70%' : '100%'}
        />
      ))}
    </div>
  );
}

type BlockSkeletonProps = { count?: number; className?: string };

export function BlockSkeleton({ count = 1, className = '' }: BlockSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className={className} />
      ))}
    </>
  );
}
