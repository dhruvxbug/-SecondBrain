import React from 'react';
import JoinNowButton from './JoinNowButton';

interface ImageCardProps {
  title?: string;
  children?: React.ReactNode;
}

export default function ImageCard({ title }: ImageCardProps) {
  return (
    <section className="relative w-full min-h-100 max-w-6xl mx-auto my-12">
      <img
        src='/src/assets/unnamed.jpg'
        alt={title || 'Background'}
        className="absolute inset-0 w-full h-full object-cover rounded-3xl z-0"
      />
      <div className="relative z-10 p-20 flex flex-col items-center">
        <h2 className="text-4xl text-white mb-6 text-center font-bold">Tired of managing bookmarks on every platform? <br/>Join 2nd Brain and take control of your life </h2>
        <JoinNowButton className="mt-8" />
      </div>
    </section>
  );
}
