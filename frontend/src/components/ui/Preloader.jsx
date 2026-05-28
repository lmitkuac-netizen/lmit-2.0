import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLabInfo } from '../../context/LabInfoContext';

const Preloader = () => {
  const { labInfo, loading } = useLabInfo();
  const [show, setShow] = useState(true);

  useEffect(() => {
    // If labInfo has finished loading (either success or fail)
    if (!loading) {
      // Keep it on screen for at least 1.2s to show the cool logo animation
      // and ensure other heavy assets have a moment to start loading
      const timer = setTimeout(() => {
        setShow(false);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] bg-slate-950 flex flex-col items-center justify-center"
        >
          {labInfo?.logo_image ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="relative flex flex-col items-center"
            >
              <div className="relative">
                {/* Glowing aura behind the logo */}
                <div className="absolute inset-0 bg-teal-500 rounded-full blur-[50px] opacity-20 animate-pulse"></div>
                <img 
                  src={labInfo.logo_image} 
                  alt="Loading Logo" 
                  className="h-20 sm:h-24 md:h-32 object-contain relative z-10 animate-pulse"
                  style={{ animationDuration: '2s' }}
                />
              </div>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5, ease: "circOut" }}
                className="h-0.5 bg-gradient-to-r from-transparent via-teal-400 to-transparent mt-8"
              />
            </motion.div>
          ) : (
            // Fallback while waiting for API to return the logo URL
            <div className="flex flex-col items-center justify-center">
              <div className="w-16 h-16 border-4 border-slate-800 border-t-teal-500 rounded-full animate-spin mb-4"></div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
