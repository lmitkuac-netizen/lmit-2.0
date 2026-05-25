import React, { useEffect, useRef, useState, Suspense } from 'react';
import { ChevronDown, Loader2 } from 'lucide-react';
import { useLabInfo } from '../context/LabInfoContext';
import { motion, useScroll, useTransform } from 'framer-motion';

const Hero = () => {
  const { labInfo, loading } = useLabInfo();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 300]);

  const scrollToResearch = () => {
    const element = document.getElementById('research');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Background Image with Parallax */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center parallax-bg"
        style={{
          backgroundImage: labInfo?.hero_background_image
            ? `url(${labInfo.hero_background_image})`
            : undefined,
          y,
          scale: 1.1 // Static scale up to prevent edges showing during parallax
        }}
      >
        <div className="absolute inset-0 bg-slate-950/85"></div>
      </motion.div>

      {/* Glowing Orbs for Premium Aesthetic */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-[30rem] h-[30rem] bg-teal-500/15 rounded-full blur-[100px] animate-float-orb"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[35rem] h-[35rem] bg-indigo-500/10 rounded-full blur-[120px] animate-float-orb" style={{ animationDelay: '-5s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-[25rem] h-[25rem] bg-cyan-500/8 rounded-full blur-[80px] animate-float-orb" style={{ animationDelay: '-10s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pointer-events-none">
        {loading ? (
          <Loader2 className="w-12 h-12 text-white animate-spin mx-auto" />
        ) : labInfo ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-6"
          >
            <motion.h1 variants={itemVariants} className="text-gradient-hero !font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.1] tracking-[-0.03em] max-w-4xl mx-auto" data-testid="hero-title">
              {labInfo.name}
            </motion.h1>
            <motion.p variants={itemVariants} className="text-xl sm:text-2xl md:text-3xl text-teal-300/90 font-light max-w-3xl mx-auto tracking-wide" data-testid="hero-tagline">
              {labInfo.tagline}
            </motion.p>
            <motion.p variants={itemVariants} className="text-base sm:text-lg text-slate-300/80 max-w-3xl mx-auto leading-relaxed font-light" data-testid="hero-description">
              {labInfo.description}
            </motion.p>
            
            <motion.div variants={itemVariants} className="pt-6 pointer-events-auto">
              <button
                onClick={scrollToResearch}
                data-testid="hero-cta-button"
                className="group inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-10 py-4 rounded-full text-lg font-semibold transition-all duration-500 hover:scale-105 border border-white/20 hover:border-white/40 shadow-[0_10px_40px_-15px_rgba(13,148,136,0.4)] hover:shadow-[0_20px_50px_-10px_rgba(13,148,136,0.5)] cursor-pointer"
              >
                Explore Our Research
                <ChevronDown className="transition-transform duration-300 group-hover:translate-y-1" size={20} />
              </button>
            </motion.div>
          </motion.div>
        ) : null}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <button
          onClick={scrollToResearch}
          className="text-white/30 hover:text-teal-400 hover:scale-110 transition-all duration-300"
          aria-label="Scroll down"
        >
          <ChevronDown size={32} className="animate-bounce" />
        </button>
      </div>
    </section>
  );
};

export default Hero;
