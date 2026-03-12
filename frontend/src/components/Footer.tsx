import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-t from-[#e60a64] to-gray-950 py-6 text-foreground flex flex-col items-center  mt-12">
      <section className="w-full text-white ">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 px-8 justify-between">
        <div className="flex-1 flex flex-col justify-start items-start">
            <div className="humane-regular text-[8rem] text-white">SECOND BRAIN.</div>
          <div className="flex items-center gap-3 mb-2">
            <img src="https://vjnlprqde9.ufs.sh/f/0qIuAAQ9vnLf9yUDMjw2VqGLEZWdrwTiCQYes2xl7yaboU4p" alt="Creator" className="w-10 h-10 rounded-full border border-gray-700" />
            <span className="text-sm text-gray-300">Cooked by dhruvxbug</span>
          </div>
        </div>
        {/* Right: Platform, Legal, Socials */}
        <div className="flex-1 flex flex-col mb-16 justify-end items-end text-sm">
          <div className="flex gap-12">
            {/* Platform links */}
            <div>
              <h2 className="text-base font-semibold mb-2">Platform</h2>
              <ul className="space-y-1">
                <li><a href="#features" className="hover:underline">Features</a></li>
                <li><a href="#dashboard" className="hover:underline">Dashboard</a></li>
                <li><a href="#faq" className="hover:underline">FAQ</a></li>
                <li><a href="#team" className="hover:underline">Team</a></li>
              </ul>
            </div>
            {/* Legal links */}
            <div>
              <h2 className="text-base font-semibold mb-2">Legal</h2>
              <ul className="space-y-1 mb-4">
                <li><a href="#contact" className="hover:underline">Contact</a></li>
                <li><a href="#privacy" className="hover:underline">Privacy Policy</a></li>
                <li><a href="#terms" className="hover:underline">Terms & Conditions</a></li>
              </ul>
            </div>
            {/* Socials */}
            <div>
              <h2 className="text-base font-semibold mb-2">Socials</h2>
              <ul className="space-y-1 mb-4">
                <li><a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><span>Twitter</span></a></li>
                <li><a href="https://github.com/dhruvxbug/-SecondBrain" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><span>Github</span></a></li>
                <li><a href="https://discord.com/" target="_blank" rel="noopener noreferrer" aria-label="Discord"><span>Discord</span></a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-12 text-center text-black text-sm">
        <p>&copy; 2026 Second Brain. All rights reserved.</p>
        <p className="italic mt-2">Building 21st century context-aware infrastructure</p>
      </div>
    </section>
    </footer>
  );
}
