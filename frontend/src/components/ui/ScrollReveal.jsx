import React from 'react';
import { motion } from 'framer-motion';

export const ScrollReveal = ({ children, className = '', delay = 0, yOffset = 50, direction = 'up' }) => {
  // Determine starting position based on direction
  const yStart = direction === 'up' ? yOffset : direction === 'down' ? -yOffset : 0;
  const xStart = direction === 'left' ? yOffset : direction === 'right' ? -yOffset : 0;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: yStart, x: xStart }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.8, 
        delay: delay / 1000, // framer-motion delay is in seconds
        type: "spring",
        bounce: 0.3,
        stiffness: 50
      }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
