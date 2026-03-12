import React, { useEffect, useState } from 'react';
import JoinNowButton from './JoinNowButton';
import { GitHubStarsButton } from './animate-ui/components/buttons/github-stars';

export default function Navbar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'Dashboard', href: '#demo' },
  ];

  return (
    <nav
      className={`fixed top-8 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 rounded-full shadow-xl px-8 py-2 bg-gray-900/75 flex items-center justify-between ${visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      style={{ minWidth: 1100, maxWidth: 1200 }}
    >
      {/* Left: Name */}
      <span className="text-white text-[1.5rem] font-bold">2nd Brain</span>
      {/* Center: Nav Links */}
      <div className="flex-1 flex justify-center">
        <ul className="flex gap-8 text-white text-lg font-medium">
          {navLinks.map(link => (
            <li key={link.name}>
              <a href={link.href} className="hover:text-purple-300 transition-colors duration-150">
                {link.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
      {/* Right: Buttons */}
      <div className="flex items-center gap-4">
        <GitHubStarsButton
           username='dhruvxbug'
           repo='-secondbrain'
           onClick={() => window.open('https://github.com/dhruvxbug/-SecondBrain', '_blank')}
        />
        <JoinNowButton className="ml-2" />
      </div>
    </nav>
  );
}
