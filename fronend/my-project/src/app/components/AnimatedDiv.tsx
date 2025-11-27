import React, { useEffect, useState } from 'react';

interface AnimatedDivProps {
  isVisible: boolean; // Controls visibility
  children: React.ReactNode; // Content to render inside the animated div
}

const AnimatedDiv: React.FC<AnimatedDivProps> = ({ isVisible, children }) => {
  const [shouldRender, setShouldRender] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true); // Render the content when visible
    } else {
      // Delay unmounting to allow animation to complete
      const timeout = setTimeout(() => setShouldRender(false), 1000); // Match the animation duration
      return () => clearTimeout(timeout);
    }
  }, [isVisible]);

  return (
    <div
      className={`transition-all duration-1000 ease-in-out ${
        isVisible ? 'opacity-100 max-h-[500px]' : 'opacity-0 max-h-0'
      } overflow-hidden`}
    >
      {shouldRender && children}
    </div>
  );
};

export default AnimatedDiv;