import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Mail, Phone, MapPin, Loader2 } from 'lucide-react';
import { labApi } from '../services/api';
import ScrollReveal from './ui/ScrollReveal';

const getMapQuery = (address) => {
  if (!address) return '';
  
  // Split by comma first (common for English addresses)
  const commaParts = address.split(',');
  if (commaParts.length > 1) {
    const kuIndex = commaParts.findIndex(p => 
      p.toLowerCase().includes('kasetsart') || 
      p.includes('เกษตรศาสตร์')
    );
    if (kuIndex !== -1) {
      return commaParts.slice(0, kuIndex + 1).join(',').trim();
    }
  }

  // Split by space (common for Thai addresses)
  const spaceParts = address.split(/\s+/);
  const kuSpaceIndex = spaceParts.findIndex(p => 
    p.toLowerCase().includes('kasetsart') || 
    p.includes('เกษตรศาสตร์')
  );
  if (kuSpaceIndex !== -1) {
    return spaceParts.slice(0, kuSpaceIndex + 1).join(' ').trim();
  }

  return address;
};

const Contact = () => {
  const [labInfo, setLabInfo] = useState(null);

  useEffect(() => {
    labApi.getLabInfo()
      .then(data => setLabInfo(data))
      .catch(err => console.error('Failed to fetch lab info:', err));
  }, []);

  return (
    <section id="contact" className="py-28 bg-white" data-testid="contact-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gradient-section mb-4 tracking-[-0.02em]" data-testid="contact-heading">
              Contact Us
            </h2>
            <div className="heading-accent-bar"></div>
            <p className="text-lg text-slate-500 max-w-3xl mx-auto font-light tracking-wide">
              Interested in collaboration, visiting our lab, or learning more about our research?
              We'd love to hear from you.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <ScrollReveal className="lg:col-span-1" delay={100}>
            <Card className="border-gray-200 hover-card-glow h-full">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0">
                    <Mail className="text-teal-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">Email</h3>
                    <a 
                      href={`mailto:${labInfo?.email || 'contact@multiscalelab.edu'}`}
                      className="text-slate-600 hover:text-teal-600 transition-colors duration-200"
                      data-testid="contact-email"
                    >
                      {labInfo?.email || 'contact@multiscalelab.edu'}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0">
                    <Phone className="text-teal-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">Phone</h3>
                    <a 
                      href={`tel:${labInfo?.phone || ''}`}
                      className="text-slate-600 hover:text-teal-600 transition-colors duration-200"
                      data-testid="contact-phone"
                    >
                      {labInfo?.phone || ''}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-teal-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">Address</h3>
                    <p className="text-slate-600" data-testid="contact-address">{labInfo?.address || ''}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>

          <ScrollReveal className="lg:col-span-2" delay={250}>
            <Card className="border-gray-200 h-full overflow-hidden hover-card-glow">
              <div className="w-full h-full min-h-[400px]">
                {labInfo?.address ? (
                  <iframe
                    title="Lab Location Map"
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: '400px' }}
                    loading="lazy"
                    allowFullScreen
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(getMapQuery(labInfo.address))}&t=&z=18&ie=UTF8&iwloc=A&output=embed`}
                  ></iframe>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-slate-500 min-h-[400px]">
                    <MapPin className="w-12 h-12 mb-2 opacity-50" />
                    <p>Map location will appear here once address is set.</p>
                  </div>
                )}
              </div>
            </Card>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default Contact;
