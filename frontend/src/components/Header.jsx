import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { useLabInfo } from '../context/LabInfoContext';

const Header = () => {
  const { labInfo } = useLabInfo();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const siteName = labInfo?.name || 'Laboratory Website';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const navItemClass = `nav-link-underline px-4 py-2 font-medium transition-all duration-300 ${
    isScrolled 
      ? 'text-slate-700 hover:text-teal-600' 
      : 'text-white/90 hover:text-teal-300'
  }`;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 flex items-center ${
      isScrolled 
        ? 'bg-white/80 backdrop-blur-xl border-b border-gray-200/30 shadow-sm h-16' 
        : 'bg-transparent border-transparent h-20'
    }`}>
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center w-full">
          {/* Logo/Brand */}
          <div className="flex-shrink-0 flex items-center gap-3">
            {labInfo?.logo_image && (
              <img 
                src={labInfo.logo_image} 
                alt="Lab Logo" 
                className="h-10 sm:h-12 w-auto object-contain rounded transition-all duration-300"
              />
            )}
            <h1 className={`text-lg sm:text-xl font-bold leading-tight transition-all duration-500 ${
              isScrolled ? 'text-slate-800' : 'text-white'
            }`}>
              {siteName}
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => scrollToSection('research')}
              className={navItemClass}
            >
              Research
            </button>
            <button
              onClick={() => scrollToSection('publications')}
              className={navItemClass}
            >
              Publications
            </button>
            <button
              onClick={() => scrollToSection('team')}
              className={navItemClass}
            >
              Team
            </button>
            <button
              onClick={() => scrollToSection('news')}
              className={navItemClass}
            >
              News
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="ml-2"
            >
              <Button className={`transition-all duration-500 rounded-full px-6 ${
                isScrolled
                  ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-md hover:shadow-lg'
                  : 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 hover:border-white/40'
              }`}>
                Contact
              </Button>
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden p-2 transition-colors duration-300 ${
              isScrolled ? 'text-slate-700' : 'text-white'
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-200/30 shadow-xl md:hidden">
          <nav className="px-4 py-4 space-y-2">
            <button
              onClick={() => scrollToSection('research')}
              className="block w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 rounded-md transition-colors duration-200"
            >
              Research
            </button>
            <button
              onClick={() => scrollToSection('publications')}
              className="block w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 rounded-md transition-colors duration-200"
            >
              Publications
            </button>
            <button
              onClick={() => scrollToSection('team')}
              className="block w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 rounded-md transition-colors duration-200"
            >
              Team
            </button>
            <button
              onClick={() => scrollToSection('news')}
              className="block w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 rounded-md transition-colors duration-200"
            >
              News
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="block w-full mt-2"
            >
              <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white transition-colors duration-200">
                Contact
              </Button>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;