import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Calendar, Loader2, ArrowRight } from 'lucide-react';
import { labApi } from '../services/api';
import ScrollReveal from './ui/ScrollReveal';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState(null);

  useEffect(() => {
    labApi.getNews()
      .then(data => setNews(data))
      .catch(err => console.error('Failed to fetch news:', err))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <section id="news" className="py-28 bg-gray-50" data-testid="news-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gradient-section mb-4 tracking-[-0.02em]" data-testid="news-heading">
              News & Announcements
            </h2>
            <div className="heading-accent-bar"></div>
            <p className="text-lg text-slate-500 max-w-3xl mx-auto font-light tracking-wide">
              Stay updated with the latest developments, publications, and achievements
              from our laboratory.
            </p>
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-12 h-12 text-teal-600 animate-spin" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {news.map((item, index) => (
                <ScrollReveal key={item.id} delay={(index % 3) * 150}>
                  <Card 
                    data-testid={`news-card-${item.id}`}
                    className="group overflow-hidden border-gray-200/60 hover-card-glow bg-white cursor-pointer flex flex-col h-full glass-card rounded-2xl"
                    onClick={() => setSelectedNews(item)}
                  >
                    <div className="relative h-48 shrink-0 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
                      {index === 0 && (
                        <div className="absolute top-4 right-4 bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse tracking-wider">
                          NEW
                        </div>
                      )}
                    </div>

                    <CardContent className="p-6 flex flex-col flex-grow">
                      <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                        <Calendar size={14} />
                        <span>{formatDate(item.date)}</span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-teal-600 transition-colors duration-200 line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-slate-600 leading-relaxed line-clamp-3 mb-4">
                        {item.excerpt}
                      </p>
                      <div className="text-teal-600 font-medium flex items-center mt-auto group-hover:text-teal-700 transition-colors">
                        Read full story <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                      </div>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              ))}
            </div>

            <Dialog open={!!selectedNews} onOpenChange={(open) => !open && setSelectedNews(null)}>
              <DialogContent className="max-w-3xl p-0 overflow-hidden bg-white border-0 shadow-2xl rounded-2xl">
                {selectedNews && (
                  <>
                    <div className="relative h-64 sm:h-80 w-full shrink-0">
                      <img 
                        src={selectedNews.image} 
                        alt={selectedNews.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 flex items-center gap-2 text-sm text-white/90">
                        <Calendar size={16} />
                        <span>{formatDate(selectedNews.date)}</span>
                      </div>
                    </div>
                    <div className="p-6 sm:p-8 overflow-y-auto max-h-[60vh]">
                      <DialogHeader>
                        <DialogTitle className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4">
                          {selectedNews.title}
                        </DialogTitle>
                      </DialogHeader>
                      <DialogDescription className="text-base text-slate-600 leading-relaxed whitespace-pre-wrap">
                        {selectedNews.excerpt}
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

export default News;
