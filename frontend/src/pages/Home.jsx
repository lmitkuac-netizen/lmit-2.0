import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import ResearchFocus from '../components/ResearchFocus';
import Publications from '../components/Publications';
import LabMembers from '../components/LabMembers';
import VideoPreview from '../components/VideoPreview';
import News from '../components/News';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

/* Smooth SVG wave dividers between sections */
const WaveDivider = ({ fromColor, toColor, flip = false }) => (
  <div className={`wave-divider relative ${flip ? 'rotate-180' : ''}`} style={{ marginTop: '-1px', marginBottom: '-1px' }}>
    <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fill={toColor}
        d="M0,32 C360,80 720,0 1080,48 C1260,64 1380,24 1440,32 L1440,80 L0,80 Z"
      />
    </svg>
  </div>
);

const Home = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        {/* Hero (dark) → Research (white) */}
        <WaveDivider fromColor="#020617" toColor="#ffffff" />
        <ResearchFocus />
        {/* Research (white) → Publications (gray-50) */}
        <WaveDivider fromColor="#ffffff" toColor="#f9fafb" />
        <Publications />
        {/* Publications (gray-50) → Team (white) */}
        <WaveDivider fromColor="#f9fafb" toColor="#ffffff" />
        <LabMembers />
        {/* Team (white) → Videos (slate-50) */}
        <WaveDivider fromColor="#ffffff" toColor="#f8fafc" />
        <VideoPreview />
        {/* Videos (slate-50) → News (gray-50) */}
        <WaveDivider fromColor="#f8fafc" toColor="#f9fafb" />
        <News />
        {/* News (gray-50) → Contact (white) */}
        <WaveDivider fromColor="#f9fafb" toColor="#ffffff" />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Home;