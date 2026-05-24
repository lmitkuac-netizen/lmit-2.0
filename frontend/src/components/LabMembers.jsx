import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Mail, Linkedin, GraduationCap, Loader2, FileText, Briefcase } from 'lucide-react';
import { labApi } from '../services/api';
import ScrollReveal from './ui/ScrollReveal';
import Skeleton from './ui/Skeleton';

const LabMembers = () => {
  const [labMembers, setLabMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);
  const [visibleAlumniCount, setVisibleAlumniCount] = useState(12);

  useEffect(() => {
    labApi.getLabMembers()
      .then(data => setLabMembers(data))
      .catch(err => console.error('Failed to fetch lab members:', err))
      .finally(() => setLoading(false));
  }, []);

  const currentMembers = labMembers.filter(m => !m.is_alumni);
  const alumni = labMembers.filter(m => m.is_alumni);

  return (
    <section id="team" className="py-28 bg-white" data-testid="team-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gradient-section mb-4 tracking-[-0.02em]" data-testid="team-heading">
              Lab Members
            </h2>
            <div className="heading-accent-bar"></div>
            <p className="text-lg text-slate-500 max-w-3xl mx-auto font-light tracking-wide">
              Meet our dedicated team of researchers, scientists, and graduate students
              driving innovation in multiscale materials science.
            </p>
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-96 w-full rounded-2xl" />
            ))}
          </div>
        ) : (
          <>
            {/* Current Members Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {currentMembers.slice(0, visibleCount).map((member, index) => (
                <ScrollReveal key={member.id} delay={(index % 3) * 150}>
                  <Card 
                    data-testid={`member-card-${member.id}`}
                    className="group overflow-hidden border-gray-200 hover-card-glow h-full flex flex-col"
                  >
                    <div className="relative h-80 overflow-hidden bg-gray-100">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    <CardContent className="p-6 flex-grow flex flex-col">
                      <h3 className="text-xl font-bold text-slate-800 mb-1">
                        {member.name}
                      </h3>
                      <p className="text-sm font-medium text-teal-600 mb-4">
                        {member.title}
                      </p>
                      <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                        {member.bio}
                      </p>
                      
                      <div className="mb-4 mt-auto">
                        <p className="text-xs font-semibold text-slate-700 mb-2">Research Interests:</p>
                        <div className="flex flex-wrap gap-1">
                          {member.research.map((topic, index) => (
                            <span 
                              key={index} 
                              className="text-xs bg-gray-100 text-slate-700 px-2 py-1 rounded"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                        {member.cv_url && (
                          <a
                            href={member.cv_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-700 hover:text-teal-800 transition-colors"
                            data-testid={`member-cv-${member.id}`}
                          >
                            <FileText size={18} />
                            View CV
                          </a>
                        )}
                        <a
                          href={`mailto:${member.email}`}
                          className="text-sm text-slate-600 hover:text-teal-600 transition-colors duration-200 truncate"
                          data-testid={`member-email-${member.id}`}
                        >
                          {member.email}
                        </a>
                        <a
                          href={member.linkedin}
                          className="text-slate-600 hover:text-teal-600 transition-colors duration-200"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="LinkedIn"
                        >
                          <Linkedin size={18} />
                        </a>
                        <a
                          href={member.scholar}
                          className="text-slate-600 hover:text-teal-600 transition-colors duration-200"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Google Scholar"
                        >
                          <GraduationCap size={18} />
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
            
            {visibleCount < currentMembers.length && (
              <div className="flex justify-center mb-16">
                <button 
                  onClick={() => setVisibleCount(prev => prev + 6)}
                  className="px-8 py-3 bg-white border-2 border-teal-600 text-teal-600 font-semibold rounded-full hover:bg-teal-50 transition-colors duration-300"
                >
                  Load More Members
                </button>
              </div>
            )}

            {/* Alumni Section */}
            {alumni.length > 0 && (
              <div className="mt-20 pt-12 border-t border-gray-200">
                <ScrollReveal>
                  <div className="text-center mb-12">
                    <h3 className="text-3xl font-bold text-slate-800 mb-4">Our Alumni</h3>
                    <div className="w-16 h-1 bg-slate-300 mx-auto"></div>
                  </div>
                </ScrollReveal>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {alumni.slice(0, visibleAlumniCount).map((member, index) => (
                    <ScrollReveal key={member.id} delay={(index % 4) * 100}>
                      <div 
                        className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg p-4 flex flex-col transition-colors duration-200 h-full"
                      >
                        <h4 className="font-semibold text-slate-800 flex items-center mb-1">
                          <GraduationCap className="w-4 h-4 mr-2 text-teal-600" />
                          {member.name}
                        </h4>
                        {member.current_workplace && (
                          <p className="text-sm text-slate-600 flex items-center mt-auto pt-2">
                            <Briefcase className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                            {member.current_workplace}
                          </p>
                        )}
                      </div>
                    </ScrollReveal>
                  ))}
                </div>

                {visibleAlumniCount < alumni.length && (
                  <div className="flex justify-center mt-8">
                    <button 
                      onClick={() => setVisibleAlumniCount(prev => prev + 12)}
                      className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors duration-200"
                    >
                      Show More Alumni ⬇
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default LabMembers;
