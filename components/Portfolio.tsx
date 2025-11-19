import React, { useState, useRef } from 'react';
import { PROJECTS } from '../constants';
import { ProjectCategory, Project } from '../types';
import ProjectModal from './ProjectModal';
import { ArrowUpRight, Volume2, VolumeX } from 'lucide-react';

// Sub-component to handle individual video state and interactions
const VideoPreview = ({ project }: { project: Project }) => {
  const [isMuted, setIsMuted] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const toggleMute = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (iframeRef.current && iframeRef.current.contentWindow) {
      const action = isMuted ? 'unMute' : 'mute';
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: action, args: [] }), 
        '*'
      );
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="relative w-full h-full bg-neutral-900 group">
      <iframe
        ref={iframeRef}
        width="100%"
        height="100%"
        // enablejsapi=1: Required for postMessage control
        // autoplay=1: Starts automatically
        // mute=1: Required for browser autoplay policies
        // loop=1: Loops the video (requires playlist param)
        // controls=1: Keeps controls accessible
        src={`https://www.youtube.com/embed/${project.youtubeId}?enablejsapi=1&autoplay=1&mute=1&controls=1&loop=1&playlist=${project.youtubeId}&playsinline=1&rel=0&showinfo=0&modestbranding=1`}
        title={project.title || 'Video Preview'}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="absolute inset-0 w-full h-full object-cover"
      ></iframe>
      
      <button
        onClick={toggleMute}
        className="absolute bottom-3 right-3 z-20 p-2.5 bg-neutral-950/80 hover:bg-neutral-900 text-white rounded-full backdrop-blur-md border border-neutral-700 transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 translate-y-2 group-hover:translate-y-0"
        aria-label={isMuted ? "Unmute video" : "Mute video"}
      >
        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>
    </div>
  );
};

const Portfolio: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Updated filter logic to handle optional category
  const videoProjects = PROJECTS.filter(p => 
    p.category === ProjectCategory.VIDEO || (!p.category && p.youtubeId)
  );
  const graphicProjects = PROJECTS.filter(p => 
    p.category === ProjectCategory.GRAPHIC
  );

  const renderProjectCard = (project: Project) => {
    const isVertical = project.format === 'vertical';
    const isVideo = !!project.youtubeId;
    const isGraphic = project.category === ProjectCategory.GRAPHIC;

    return (
      <div 
        className="group flex flex-col h-full"
      >
        {/* Card Media Container */}
        <div 
          className={`relative w-full bg-neutral-800 rounded-xl overflow-hidden border border-neutral-800 shadow-lg ${
            isVertical ? 'aspect-[9/16]' : 'aspect-video'
          }`}
        >
          {isVideo ? (
            <VideoPreview 
              project={project} 
            />
          ) : (
            <>
              <img 
                src={project.thumbnail} 
                alt={project.title || 'Project Thumbnail'} 
                className="w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100 cursor-pointer"
                onClick={() => setSelectedProject(project)}
              />
              
              {/* Overlay - Only render if not a graphic project (user requested only image for graphics) */}
              {!isGraphic && (
                <div 
                  className="absolute inset-0 bg-neutral-950/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-center backdrop-blur-sm cursor-pointer"
                  onClick={() => setSelectedProject(project)}
                >
                   <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300 ease-out">
                      {project.description && (
                        <p className="text-gray-200 font-medium mb-4 leading-relaxed line-clamp-3">{project.description}</p>
                      )}
                      <div className="inline-flex items-center gap-2 text-white font-bold border-b border-blue-500 pb-0.5 hover:text-blue-400 transition-colors">
                         View Case Study <ArrowUpRight size={16} />
                      </div>
                   </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Card Content Below - Only render if title or subcategory exists AND not graphic */}
        {!isGraphic && (project.title || project.subcategory) && (
          <div className="mt-3 px-1">
            <div className="flex justify-between items-start gap-2">
              {project.title && (
                <h3 
                  className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors cursor-pointer leading-tight"
                  onClick={() => setSelectedProject(project)}
                >
                  {project.title}
                </h3>
              )}
              {project.subcategory && (
                <span className={`shrink-0 text-[10px] font-medium text-gray-400 border border-neutral-700 px-2 py-0.5 rounded-full uppercase tracking-wide ${!project.title ? 'ml-auto' : ''}`}>
                  {project.subcategory}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <section id="portfolio" className="py-24 bg-neutral-900 border-y border-neutral-800">
      <div className="container mx-auto px-6 max-w-7xl">
        
        <div className="mb-16">
            <h2 className="text-4xl font-display font-bold text-white mb-4">Selected Works</h2>
            <p className="text-gray-400 max-w-xl">Explore my diverse range of projects, from high-retention video editing to impactful brand identities.</p>
        </div>

        {/* Video Edits Section */}
        <div className="mb-24">
            <div className="flex items-center gap-4 mb-8">
                <h3 className="text-2xl font-display font-bold text-white">Video Edits</h3>
                <div className="h-px flex-1 bg-neutral-800"></div>
            </div>
            {/* Optimized Grid for Vertical Videos (4 columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
                {videoProjects.map(project => (
                  <div key={project.id}>
                    {renderProjectCard(project)}
                  </div>
                ))}
            </div>
        </div>

        {/* Graphic Design Section */}
        <div>
            <div className="flex items-center gap-4 mb-8">
                <h3 className="text-2xl font-display font-bold text-white">Graphic Designs</h3>
                <div className="h-px flex-1 bg-neutral-800"></div>
            </div>
            {/* 4-Column Grid for Vertical Graphic Designs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {graphicProjects.map(project => (
                  <div key={project.id}>
                    {renderProjectCard(project)}
                  </div>
                ))}
            </div>
        </div>

      </div>

      {/* Modal */}
      {selectedProject && (
        <ProjectModal 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      )}
    </section>
  );
};

export default Portfolio;