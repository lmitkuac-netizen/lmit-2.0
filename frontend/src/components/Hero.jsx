import React from 'react';
import { ChevronDown, Loader2 } from 'lucide-react';
import { useLabInfo } from '../context/LabInfoContext';

const Hero = () => {
  const { labInfo, loading } = useLabInfo();

  const scrollToResearch = () => {
    const element = document.getElementById('research');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-10000 ease-out scale-105"
        style={{
          backgroundImage: labInfo?.hero_background_image
            ? `url(${labInfo.hero_background_image})`
            : undefined,
        }}
      >
        <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-[2px]"></div>
      </div>

      {/* Glowing Orbs for Premium Aesthetic */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-[30rem] h-[30rem] bg-teal-500/15 rounded-full blur-[100px] animate-float-orb"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[35rem] h-[35rem] bg-indigo-500/10 rounded-full blur-[120px] animate-float-orb" style={{ animationDelay: '-5s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {loading ? (
          <Loader2 className="w-12 h-12 text-white animate-spin mx-auto" />
        ) : labInfo ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
            <h1 className="!font-extrabold text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight tracking-tight max-w-4xl mx-auto" data-testid="hero-title">
              {labInfo.name}
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl text-teal-300 font-light max-w-3xl mx-auto" data-testid="hero-tagline">
              {labInfo.tagline}
            </p>
            <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal" data-testid="hero-description">
              {labInfo.description}
            </p>
            
            <div className="pt-4">
              <button
                onClick={scrollToResearch}
                data-testid="hero-cta-button"
                className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-[0_10px_30px_-10px_rgba(13,148,136,0.5)] hover:shadow-[0_15px_35px_-5px_rgba(13,148,136,0.6)]"
              >
                Explore Our Research
                <ChevronDown className="animate-bounce" size={20} />
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <button
          onClick={scrollToResearch}
          className="text-white/50 hover:text-teal-400 hover:scale-110 transition-all duration-300"
          aria-label="Scroll down"
        >
          <ChevronDown size={32} className="animate-bounce" />
        </button>
      </div>
    </section>
  );
};

export default Hero;
