import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLabInfo } from '../../context/LabInfoContext';

const Preloader = () => {
  const { labInfo, loading } = useLabInfo();
  const [show, setShow] = useState(true);
  const [isSlowLoad, setIsSlowLoad] = useState(false);

  useEffect(() => {
    // If loading takes more than 3 seconds, it means the Render server is waking up
    let slowLoadTimer;
    if (loading) {
      slowLoadTimer = setTimeout(() => {
        setIsSlowLoad(true);
      }, 3000);
    }

    // If labInfo has finished loading (either success or fail)
    if (!loading) {
      // Keep it on screen for at least 1.2s to show the cool logo animation
      // and ensure other heavy assets have a moment to start loading
      const timer = setTimeout(() => {
        setShow(false);
      }, 1200);
      return () => clearTimeout(timer);
    }

    return () => clearTimeout(slowLoadTimer);
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
              
              <div className="w-full flex flex-col items-center mt-8">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.5, ease: "circOut" }}
                  className="h-0.5 bg-gradient-to-r from-transparent via-teal-400 to-transparent w-full"
                />
                
                <AnimatePresence>
                  {isSlowLoad && loading && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-12 relative flex justify-center items-center"
                    >
                      {/* Cool futuristic concentric spinner */}
                      <div className="absolute w-16 h-16 rounded-full border-t-2 border-l-2 border-teal-400/80 animate-spin" style={{ animationDuration: '3s' }}></div>
                      <div className="absolute w-12 h-12 rounded-full border-b-2 border-r-2 border-teal-500/80 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '2s' }}></div>
                      <div className="absolute w-6 h-6 rounded-full border-t-2 border-r-2 border-teal-300 animate-spin" style={{ animationDuration: '1s' }}></div>
                      <div className="absolute w-2 h-2 rounded-full bg-teal-400 animate-pulse"></div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
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
