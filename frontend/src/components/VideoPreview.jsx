import React, { useState, useEffect } from 'react';
import { Loader2, Play } from 'lucide-react';
import { labApi } from '../services/api';
import { extractYoutubeVideoId, getYoutubeEmbedUrl } from '../lib/youtube';
import ScrollReveal from './ui/ScrollReveal';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from './ui/carousel';
import { Dialog, DialogContent } from './ui/dialog';

const VideoPreview = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    labApi
      .getYoutubeVideos()
      .then(setVideos)
      .catch((err) => console.error('Failed to fetch videos:', err))
      .finally(() => setLoading(false));
  }, []);

  const playable = videos
    .map((v) => ({ ...v, embedUrl: getYoutubeEmbedUrl(v.youtube_url) }))
    .filter((v) => v.embedUrl);

  if (!loading && playable.length === 0) {
    return null;
  }

  return (
    <section id="videos" className="py-28 bg-slate-50" data-testid="videos-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gradient-section mb-4 tracking-[-0.02em]" data-testid="videos-heading">
              Research Videos
            </h2>
            <div className="heading-accent-bar" />
            <p className="text-lg text-slate-500 max-w-3xl mx-auto font-light tracking-wide">
              Watch highlights from our lab, conferences, and outreach activities.
            </p>
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-12 h-12 text-teal-600 animate-spin" />
          </div>
        ) : (
          <ScrollReveal delay={150}>
            <div className="relative px-4 sm:px-8">
              <Carousel className="w-full max-w-5xl mx-auto relative">
                <CarouselContent className="-ml-6">
                  {playable.map((video) => {
                    const videoId = extractYoutubeVideoId(video.youtube_url);
                    const thumbnailUrl = videoId 
                      ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` 
                      : '';

                    return (
                      <CarouselItem key={video.id} className="md:basis-1/2 pl-6">
                        <article
                          onClick={() => setSelectedVideo(video)}
                          data-testid={`video-card-${video.id}`}
                          className="group relative bg-white rounded-2xl overflow-hidden border border-slate-200/60 hover-card-glow cursor-pointer flex flex-col h-full shadow-sm"
                        >
                          {/* Thumbnail with overlay & play icon */}
                          <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                            {thumbnailUrl && (
                              <img
                                src={thumbnailUrl}
                                alt={video.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            )}
                            <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 transition-colors duration-300 flex items-center justify-center">
                              <div className="w-14 h-14 rounded-full bg-teal-600/90 text-white flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:bg-teal-500 shadow-teal-600/20 group-hover:shadow-[0_0_25px_rgba(20,184,166,0.6)]">
                                <Play size={24} fill="white" className="ml-1" />
                              </div>
                            </div>
                          </div>
                          
                          {/* Title & Description */}
                          <div className="p-6 flex flex-col flex-grow bg-white">
                            <h3 className="text-lg font-bold text-slate-800 group-hover:text-teal-600 transition-colors duration-200 mb-2 line-clamp-2">
                              {video.title}
                            </h3>
                            {video.description && (
                              <p className="text-sm text-slate-600 leading-relaxed line-clamp-2 mt-auto">
                                {video.description}
                              </p>
                            )}
                          </div>
                        </article>
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
                <div className="hidden md:flex justify-end gap-2 mt-6 pr-6">
                  <CarouselPrevious className="static translate-y-0 h-10 w-10 border-teal-200 text-teal-600 hover:bg-teal-50 hover:text-teal-700" />
                  <CarouselNext className="static translate-y-0 h-10 w-10 border-teal-200 text-teal-600 hover:bg-teal-50 hover:text-teal-700" />
                </div>
              </Carousel>
            </div>
          </ScrollReveal>
        )}

        <Dialog open={!!selectedVideo} onOpenChange={(open) => !open && setSelectedVideo(null)}>
          <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black border-0 shadow-2xl rounded-2xl">
            {selectedVideo && (
              <div className="relative w-full aspect-video bg-black">
                <iframe
                  src={`${getYoutubeEmbedUrl(selectedVideo.youtube_url)}?autoplay=1`}
                  title={selectedVideo.title}
                  className="absolute inset-0 w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default VideoPreview;
