import React from 'react';
import { Mail, Linkedin, Twitter } from 'lucide-react';
import { useLabInfo } from '../context/LabInfoContext';

const Footer = () => {
  const { labInfo } = useLabInfo();
  const currentYear = new Date().getFullYear();
  const siteName = labInfo?.name || 'Laboratory Website';

  return (
    <footer className="bg-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
            <p className="text-gray-300 leading-relaxed">
              {labInfo?.tagline ||
                'Advancing materials science, nanotechnology, and smart agriculture through innovative research and collaboration.'}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#research" className="text-gray-300 hover:text-teal-400 transition-colors duration-200">
                  Research Focus
                </a>
              </li>
              <li>
                <a href="#publications" className="text-gray-300 hover:text-teal-400 transition-colors duration-200">
                  Publications
                </a>
              </li>
              <li>
                <a href="#team" className="text-gray-300 hover:text-teal-400 transition-colors duration-200">
                  Lab Members
                </a>
              </li>
              <li>
                <a href="#news" className="text-gray-300 hover:text-teal-400 transition-colors duration-200">
                  News
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-300 hover:text-teal-400 transition-colors duration-200">
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
                className="w-10 h-10 rounded-full bg-slate-700 hover:bg-teal-600 flex items-center justify-center transition-colors duration-200"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-700 hover:bg-teal-600 flex items-center justify-center transition-colors duration-200"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-700 hover:bg-teal-600 flex items-center justify-center transition-colors duration-200"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Special Research Unit of Sensors and Intelligent Systems for Agriculture, Food, and Environment
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} {siteName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;