'use client';

import React from 'react';

const Trailer: React.FC = () => {
  return (
    <footer className="w-full bg-gray-800 text-white py-4 text-center">
      <p className="text-sm mb-2">
        © 2025 Smart Curtain Control. | Built with Next.js
      </p>
      <div className="space-x-4">
        {/* Example link to Google */}
        <a
          href="https://www.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline"
        >
          Go to source code GitHub
        </a>
        {/* Add more links here */}
      </div>
    </footer>
  );
};

export default Trailer;