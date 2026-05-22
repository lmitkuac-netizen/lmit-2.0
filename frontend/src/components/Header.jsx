import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { useLabInfo } from '../context/LabInfoContext';

const Header = () => {
  const { labInfo } = useLabInfo();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const siteName = labInfo?.name || 'Laboratory Website';

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0 flex items-center gap-3">
            {labInfo?.logo_image && (
              <img 
                src={labInfo.logo_image} 
                alt="Lab Logo" 
                className="h-10 sm:h-12 w-auto object-contain rounded"
              />
            )}
            <h1 className="text-lg sm:text-xl font-bold text-slate-800 leading-tight">
              {siteName}
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            <button
              onClick={() => scrollToSection('research')}
              className="px-4 py-2 text-slate-700 hover:text-teal-600 font-medium transition-colors duration-200"
            >
              Research
            </button>
            <button
              onClick={() => scrollToSection('publications')}
              className="px-4 py-2 text-slate-700 hover:text-teal-600 font-medium transition-colors duration-200"
            >
              Publications
            </button>
            <button
              onClick={() => scrollToSection('team')}
              className="px-4 py-2 text-slate-700 hover:text-teal-600 font-medium transition-colors duration-200"
            >
              Team
            </button>
            <button
              onClick={() => scrollToSection('news')}
              className="px-4 py-2 text-slate-700 hover:text-teal-600 font-medium transition-colors duration-200"
            >
              News
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="ml-2"
            >
              <Button className="bg-teal-600 hover:bg-teal-700 text-white transition-colors duration-200">
                Contact
              </Button>
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-slate-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <nav className="px-4 py-4 space-y-2">
            <button
              onClick={() => scrollToSection('research')}
              className="block w-full text-left px-4 py-2 text-slate-700 hover:bg-gray-50 rounded-md transition-colors duration-200"
            >
              Research
            </button>
            <button
              onClick={() => scrollToSection('publications')}
              className="block w-full text-left px-4 py-2 text-slate-700 hover:bg-gray-50 rounded-md transition-colors duration-200"
            >
              Publications
            </button>
            <button
              onClick={() => scrollToSection('team')}
              className="block w-full text-left px-4 py-2 text-slate-700 hover:bg-gray-50 rounded-md transition-colors duration-200"
            >
              Team
            </button>
            <button
              onClick={() => scrollToSection('news')}
              className="block w-full text-left px-4 py-2 text-slate-700 hover:bg-gray-50 rounded-md transition-colors duration-200"
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