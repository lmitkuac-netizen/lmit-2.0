import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Loader2, ArrowRight } from 'lucide-react';
import { labApi } from '../services/api';
import ScrollReveal from './ui/ScrollReveal';
import Skeleton from './ui/Skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';

const ResearchFocus = () => {
  const [researchFocus, setResearchFocus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);
  const [selectedFocus, setSelectedFocus] = useState(null);

  useEffect(() => {
    labApi.getResearchFocus()
      .then(data => setResearchFocus(data))
      .catch(err => console.error('Failed to fetch research focus:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="research" className="py-28 bg-white" data-testid="research-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gradient-section mb-4 tracking-[-0.02em]" data-testid="research-heading">
              Research Focus
            </h2>
            <div className="heading-accent-bar"></div>
            <p className="text-lg text-slate-500 max-w-3xl mx-auto font-light tracking-wide">
              Our laboratory pursues cutting-edge research across multiple disciplines,
              bridging fundamental science with practical applications.
            </p>
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-[400px] w-full rounded-2xl" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {researchFocus.slice(0, visibleCount).map((focus, index) => (
                <ScrollReveal key={focus.id} delay={(index % 2) * 150}>
                  <Card 
                    data-testid={`research-card-${focus.id}`}
                    className="group overflow-hidden border-gray-200/60 hover-card-glow cursor-pointer flex flex-col h-full glass-card rounded-2xl"
                    onClick={() => setSelectedFocus(focus)}
                  >
                    <div className="relative h-64 shrink-0 overflow-hidden">
                      <img
                        src={focus.image}
                        alt={focus.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                      <h3 className="absolute bottom-4 left-4 text-2xl font-bold text-white pr-4">
                        {focus.title}
                      </h3>
                    </div>

                    <CardContent className="p-6 flex flex-col flex-grow">
                      <p className="text-slate-600 mb-4 leading-relaxed line-clamp-3">
                        {focus.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4 mt-auto">
                        {focus.keywords.map((keyword, index) => (
                          <Badge 
                            key={index} 
                            variant="secondary" 
                            className="bg-teal-50 text-teal-700 hover:bg-teal-100 transition-colors duration-200"
                          >
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                      <div className="text-teal-600 font-medium flex items-center group-hover:text-teal-700 transition-colors">
                        Read more <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                      </div>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              ))}
            </div>

            {visibleCount < researchFocus.length && (
              <div className="flex justify-center mt-12">
                <button 
                  onClick={() => setVisibleCount(prev => prev + 6)}
                  className="px-8 py-3 bg-white border-2 border-teal-600 text-teal-600 font-semibold rounded-full hover:bg-teal-50 transition-colors duration-300"
                >
                  Load More Research
                </button>
              </div>
            )}

            <Dialog open={!!selectedFocus} onOpenChange={(open) => !open && setSelectedFocus(null)}>
              <DialogContent className="max-w-3xl p-0 overflow-hidden bg-white border-0 shadow-2xl rounded-2xl">
                {selectedFocus && (
                  <>
                    <div className="relative h-64 sm:h-80 w-full shrink-0">
                      <img 
                        src={selectedFocus.image} 
                        alt={selectedFocus.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
                    </div>
                    <div className="p-6 sm:p-8 overflow-y-auto max-h-[60vh]">
                      <DialogHeader>
                        <DialogTitle className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">
                          {selectedFocus.title}
                        </DialogTitle>
                        <div className="flex flex-wrap gap-2 mb-6">
                          {selectedFocus.keywords.map((keyword, index) => (
                            <Badge 
                              key={index} 
                              variant="secondary" 
                              className="bg-teal-50 text-teal-700"
                            >
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </DialogHeader>
                      <DialogDescription className="text-base text-slate-600 leading-relaxed whitespace-pre-wrap mt-2">
                        {selectedFocus.description}
                      </DialogDescription>
                    </div>
                  </>
                )}
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </section>
  );
};

export default ResearchFocus;
