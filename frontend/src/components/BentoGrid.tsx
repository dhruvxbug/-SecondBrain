import React from 'react';

const items = [
  {
    title: 'AI Bookmarking',
    description: 'Save and organize bookmarks with AI suggestions.',
    className: 'col-span-2 row-span-1 bg-primary text-primary-foreground',
  },
  {
    title: 'Thoughts Manager',
    description: 'Capture, search, and revisit your thoughts easily.',
    className: 'col-span-1 row-span-2 bg-accent text-accent-foreground',
  },
  {
    title: 'Smart Search',
    description: 'Find anything instantly with semantic search.',
    className: 'col-span-1 row-span-1 bg-muted text-foreground',
  },
  {
    title: 'Privacy First',
    description: 'Your data is encrypted and secure.',
    className: 'col-span-2 row-span-1 bg-secondary text-secondary-foreground',
  },
];

export default function BentoGrid() {
  return (
    <section className="w-full max-w-4xl mx-auto my-12">
      <h2 className="text-4xl font-bold mb-6 text-white text-center">Features</h2>
      <div className="grid grid-cols-3 grid-rows-2 gap-6">
        {items.map((item, idx) => (
          <div key={idx} className={`rounded-xl p-6 shadow-lg ${item.className}`}>
            <div className="text-xl font-semibold mb-2">{item.title}</div>
            <div className="text-base">{item.description}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
