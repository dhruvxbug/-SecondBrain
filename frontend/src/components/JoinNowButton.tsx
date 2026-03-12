import React from 'react';

interface JoinNowButtonProps {
  onClick?: () => void;
  className?: string;
}

export default function JoinNowButton({ onClick, className }: JoinNowButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 px-4 py-2 rounded-md bg-[#5636ed] text-white text-lg font-semibold shadow-[0_4px_16px_rgba(86,54,237,0.3)] hover:bg-[#3a22b8] transition-colors duration-200 ${className || ''}`}
      style={{ boxShadow: '0 4px 16px rgba(86,54,237,0.3)' }}
    >
      <span className="text-[1rem]">&#62;_</span>
      Get Started
    </button>
  );
}
