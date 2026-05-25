import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  
  // Use MotionValues instead of React state for high performance
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Apply values directly without spring physics for 1:1 instant movement
  // to prevent it from feeling "laggy" or sluggish.
  // const smoothX = useSpring(cursorX, springConfig);
  // const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const updateMousePosition = (e) => {
      // Direct DOM update, NO React re-render!
      cursorX.set(e.clientX - (isHovering ? 24 : 8));
      cursorY.set(e.clientY - (isHovering ? 24 : 8));
    };

    const handleMouseOver = (e) => {
      const isClickable = 
        e.target.tagName.toLowerCase() === 'a' ||
        e.target.tagName.toLowerCase() === 'button' ||
        e.target.closest('a') ||
        e.target.closest('button') ||
        e.target.classList.contains('cursor-pointer') ||
        e.target.closest('.cursor-pointer');
        
      setIsHovering(isClickable);
      
      // Immediately adjust offset when hover state changes
      if (isClickable) {
        cursorX.set(e.clientX - 24);
        cursorY.set(e.clientY - 24);
      } else {
        cursorX.set(e.clientX - 8);
        cursorY.set(e.clientY - 8);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    // Hide default cursor globally
    document.body.classList.add('hide-default-cursor');

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
      document.body.classList.remove('hide-default-cursor');
    };
  }, [cursorX, cursorY, isHovering]);

  const variants = {
    default: {
      height: 16,
      width: 16,
      backgroundColor: 'rgba(13, 148, 136, 0.5)',
      border: '0px solid transparent'
    },
    hover: {
      height: 48,
      width: 48,
      backgroundColor: 'transparent',
      border: '2px solid rgba(13, 148, 136, 0.8)'
    }
  };

  return (
    <motion.div
      className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] hidden md:block"
      style={{ x: cursorX, y: cursorY }}
      variants={variants}
      animate={isHovering ? "hover" : "default"}
      transition={{ duration: 0.15 }}
    />
  );
};

export default CustomCursor;
