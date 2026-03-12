import React, { useState } from 'react';

const faqs = [
  {
    question: 'What is Second Brain?',
    answer: 'Second Brain is an AI-powered app to manage your bookmarks and thoughts.'
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes, your data is encrypted and never shared without your consent.'
  },
  {
    question: 'Can I use it for free?',
    answer: 'There is a free tier with basic features. Premium unlocks advanced tools.'
  },
  {
    question: 'How does Second Brain use AI?',
    answer: 'Second Brain leverages AI to organize, search, and contextualize your bookmarks and notes for smarter recall.'
  },
  {
    question: 'What is a vector database?',
    answer: 'A vector database stores data as mathematical vectors, enabling advanced search and context-aware retrieval using embeddings.'
  },
  {
    question: 'How are embeddings used?',
    answer: 'Embeddings capture the meaning and context of your bookmarks and notes, allowing Second Brain to find related content and improve search.'
  },
  {
    question: 'Is there a mobile version?',
    answer: 'A mobile version is planned for future releases.'
  }
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="w-full max-w-2xl mx-auto my-12 py-12 ">
      <h2 className="text-2xl text-white font-bold mb-6 text-center">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="border rounded-lg p-4 bg-muted">
            <button
              className="w-full text-left font-semibold text-lg focus:outline-none"
              onClick={() => setOpen(open === idx ? null : idx)}
            >
              {faq.question}
            </button>
            {open === idx && (
              <div className="mt-2 text-foreground text-base">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
