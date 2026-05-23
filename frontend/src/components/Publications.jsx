import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { FileText, ExternalLink, Loader2 } from 'lucide-react';
import { labApi } from '../services/api';
import ScrollReveal from './ui/ScrollReveal';

const Publications = () => {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(4);

  useEffect(() => {
    labApi.getPublications()
      .then(data => setPublications(data))
      .catch(err => console.error('Failed to fetch publications:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="publications" className="py-20 bg-gray-50" data-testid="publications-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4" data-testid="publications-heading">
              Publications
            </h2>
            <div className="w-24 h-1 bg-teal-600 mx-auto mb-6"></div>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Our research contributions to advancing knowledge in materials science,
              nanotechnology, and smart agriculture systems.
            </p>
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-12 h-12 text-teal-600 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {publications.slice(0, visibleCount).map((pub, index) => (
              <ScrollReveal key={pub.id} delay={(index % 2) * 150}>
                <Card 
                  data-testid={`publication-card-${pub.id}`}
                  className="hover-card-glow border-gray-200 bg-white"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold text-slate-800 mb-2 leading-tight">
                          {pub.title}
                        </CardTitle>
                        <p className="text-sm text-slate-600 mb-1">{pub.authors}</p>
                        <p className="text-sm text-slate-500">
                          {pub.journal} • {pub.year}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center">
                          <FileText className="text-teal-600" size={24} />
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        data-testid={`publication-doi-${pub.id}`}
                        className="text-teal-600 border-teal-200 hover:bg-teal-50 hover:text-teal-700 transition-colors duration-200"
                        onClick={() => window.open(`https://doi.org/${pub.doi}`, '_blank')}
                      >
                        <ExternalLink size={14} className="mr-1" />
                        DOI: {pub.doi.split('/').pop()}
                      </Button>
                      {pub.pdf !== '#' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-slate-600 border-gray-200 hover:bg-gray-50 transition-colors duration-200"
                          onClick={() => window.open(pub.pdf, '_blank')}
                        >
                          <FileText size={14} className="mr-1" />
                          PDF
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        )}
        
        {!loading && visibleCount < publications.length && (
          <div className="flex justify-center mt-12">
            <button 
              onClick={() => setVisibleCount(prev => prev + 4)}
              className="px-8 py-3 bg-white border-2 border-teal-600 text-teal-600 font-semibold rounded-full hover:bg-teal-50 transition-colors duration-300"
            >
              Load More Publications
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Publications;
