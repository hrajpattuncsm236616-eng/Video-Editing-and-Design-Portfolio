import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-950 py-8 border-t border-neutral-900">
      <div className="container mx-auto px-6 text-center">
        <p className="text-neutral-600 text-sm">
          &copy; {new Date().getFullYear()} Harinayan. All rights reserved.
        </p>
        <div className="mt-4 flex justify-center gap-6">
          <a href="#" className="text-neutral-600 hover:text-white text-xs uppercase tracking-wider transition-colors">Privacy</a>
          <a href="#" className="text-neutral-600 hover:text-white text-xs uppercase tracking-wider transition-colors">Terms</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;