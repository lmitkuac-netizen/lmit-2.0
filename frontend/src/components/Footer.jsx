import React from 'react';
import { Mail, Linkedin, Twitter, ArrowUp } from 'lucide-react';
import { useLabInfo } from '../context/LabInfoContext';

const Footer = () => {
  const { labInfo } = useLabInfo();
  const currentYear = new Date().getFullYear();
  const siteName = labInfo?.name || 'Laboratory Website';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-white relative">
      {/* Back to Top */}
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-10">
        <button
          onClick={scrollToTop}
          className="animate-subtle-bounce w-12 h-12 rounded-full bg-teal-600 hover:bg-teal-500 text-white flex items-center justify-center shadow-lg shadow-teal-600/20 transition-colors duration-300"
          aria-label="Back to top"
        >
          <ArrowUp size={20} />
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              {labInfo?.logo_image && (
                <img 
                  src={labInfo.logo_image} 
                  alt="Lab Logo" 
                  className="h-12 w-12 object-contain rounded bg-white/10 p-1"
                />
              )}
              <h3 className="text-xl font-bold">{siteName}</h3>
            </div>
            <p className="text-slate-400 leading-relaxed font-light">
              {labInfo?.tagline ||
                'Advancing materials science, nanotechnology, and smart agriculture through innovative research and collaboration.'}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#research" className="text-slate-400 hover:text-teal-400 transition-colors duration-300 font-light">
                  Research Focus
                </a>
              </li>
              <li>
                <a href="#publications" className="text-slate-400 hover:text-teal-400 transition-colors duration-300 font-light">
                  Publications
                </a>
              </li>
              <li>
                <a href="#team" className="text-slate-400 hover:text-teal-400 transition-colors duration-300 font-light">
                  Lab Members
                </a>
              </li>
              <li>
                <a href="#news" className="text-slate-400 hover:text-teal-400 transition-colors duration-300 font-light">
                  News
                </a>
              </li>
              <li>
                <a href="#contact" className="text-slate-400 hover:text-teal-400 transition-colors duration-300 font-light">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Social & Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4">Connect With Us</h3>
            <div className="flex gap-4 mb-4">
              <a
                href="mailto:contact@multiscalelab.edu"
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-teal-600 border border-white/10 hover:border-teal-500 flex items-center justify-center transition-all duration-300"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-teal-600 border border-white/10 hover:border-teal-500 flex items-center justify-center transition-all duration-300"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-teal-600 border border-white/10 hover:border-teal-500 flex items-center justify-center transition-all duration-300"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed font-light">
              Special Research Unit of Sensors and Intelligent Systems for Agriculture, Food, and Environment
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-gradient-border mt-12"></div>
        <div className="pt-8 text-center">
          <p className="text-slate-500 text-sm font-light">
            © {currentYear} {siteName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;