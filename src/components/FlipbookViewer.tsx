import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Maximize,
  Minimize,
  Volume2,
  VolumeX,
  ZoomIn,
  ZoomOut,
  Play,
  Pause,
  LayoutGrid,
  Edit3,
  Download,
  Lock,
  RotateCcw,
  Sparkles,
  FileCheck,
  Building2
} from 'lucide-react';
import { ProposalConfig, ProposalPage } from '../types.ts';
import { soundManager } from '../utils/sound.ts';

interface FlipbookViewerProps {
  pages: ProposalPage[];
  config: ProposalConfig;
  onBackToEditor: () => void;
  onExport: () => void;
}

export function FlipbookViewer({
  pages,
  config,
  onBackToEditor,
  onExport,
}: FlipbookViewerProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [soundActive, setSoundActive] = useState(config.soundEnabled);
  const [showThumbs, setShowThumbs] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [simulatedSecurityLock, setSimulatedSecurityLock] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const totalPages = pages.length;

  // Extract designer data
  const designerName = config.designer?.companyOrStudio || config.designer?.name || config.author?.name || 'Designer / Studio';
  const designerPhone = config.designer?.phone || config.author?.phone || '';
  const designerEmail = config.designer?.email || config.author?.email || '';
  const rawWhatsapp = config.designer?.whatsapp || config.author?.whatsapp || '';
  const whatsappNum = rawWhatsapp.replace(/\D/g, '') || '';
  const designerWebsite = config.designer?.website || '';
  const designerLogo = config.designer?.photoOrLogoUrl || '';

  // Project & client
  const clientName = config.client?.companyName || config.client?.clientName || '';
  const projectTitle = config.project?.title || config.title || 'Proposta Comercial';
  const projectSubtitle = config.project?.subtitle || config.subtitle || (clientName ? `Para: ${clientName}` : '');

  // Footer text
  const defaultFooterText = `© ${new Date().getFullYear()} ${designerName}. Todos os direitos reservados. Proposta confidencial${clientName ? ` para ${clientName}` : ''}.`;
  const footerText = config.footer?.customText || defaultFooterText;

  const goToPage = useCallback((index: number) => {
    if (index < 0 || index >= totalPages) return;
    setCurrentPage(index);
    if (soundActive) {
      try {
        soundManager.playPageTurn();
      } catch {
        // Audio error should never prevent page navigation
      }
    }
  }, [totalPages, soundActive]);

  const nextPage = useCallback(() => {
    if (currentPage < totalPages - 1) {
      goToPage(currentPage + 1);
    } else if (isPlaying) {
      setIsPlaying(false);
    }
  }, [currentPage, totalPages, goToPage, isPlaying]);

  const prevPage = useCallback(() => {
    if (currentPage > 0) {
      goToPage(currentPage - 1);
    }
  }, [currentPage, goToPage]);

  // Autoplay slideshow timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        if (currentPage < totalPages - 1) {
          goToPage(currentPage + 1);
        } else {
          setIsPlaying(false);
        }
      }, 4000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, currentPage, totalPages, goToPage]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        nextPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        prevPage();
      } else if (e.key === 'Escape') {
        if (showThumbs) setShowThumbs(false);
        if (simulatedSecurityLock) setSimulatedSecurityLock(false);
      } else if (e.key.toLowerCase() === 't') {
        setShowThumbs(prev => !prev);
      } else if (e.key.toLowerCase() === 'f') {
        toggleFullscreen();
      } else if (e.key.toLowerCase() === 's') {
        setSoundActive(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextPage, prevPage, showThumbs, simulatedSecurityLock]);

  // Touch swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const diffX = touch.clientX - touchStartRef.current.x;
    const diffY = touch.clientY - touchStartRef.current.y;

    if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX < 0) {
        nextPage();
      } else {
        prevPage();
      }
    }
    touchStartRef.current = null;
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleDownloadContract = () => {
    if (!config.contract?.dataUrl) return;
    const link = document.createElement('a');
    link.href = config.contract.dataUrl;
    link.download = config.contract.fileName || 'Contrato.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      ref={containerRef}
      style={{ backgroundColor: config.backgroundColor || '#111111' }}
      className="relative min-h-screen w-full flex flex-col justify-between select-none overflow-hidden text-white"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Floating Control Bar */}
      <div className="relative z-30 px-3 sm:px-6 py-2.5 flex items-center justify-between border-b border-white/10 bg-slate-950/70 backdrop-blur-md gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onBackToEditor}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs sm:text-sm font-bold transition-all cursor-pointer text-slate-200 flex-shrink-0"
            title="Voltar ao modo de edição"
          >
            <Edit3 className="w-4 h-4 text-amber-400" />
            <span>Editar</span>
          </button>

          {designerLogo && (
            <img
              src={designerLogo}
              alt="Logo"
              className="w-7 h-7 rounded-lg object-contain bg-slate-900 border border-slate-700 hidden sm:block flex-shrink-0"
            />
          )}

          <div className="min-w-0">
            <h2 className="text-xs sm:text-sm font-bold text-white truncate max-w-xs md:max-w-md">
              {projectTitle}
            </h2>
            {projectSubtitle && (
              <p className="text-[11px] text-slate-400 truncate max-w-xs">{projectSubtitle}</p>
            )}
          </div>
        </div>

        {/* Counter & Actions */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {config.contract && (
            <button
              onClick={handleDownloadContract}
              className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-all shadow-md active:scale-95 cursor-pointer"
              title="Baixar Contrato em PDF para Assinatura"
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Baixar Contrato (PDF)</span>
              <span className="sm:hidden">Contrato</span>
            </button>
          )}

          <button
            onClick={() => setSimulatedSecurityLock(true)}
            className="hidden lg:inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-all cursor-pointer"
            title="Demonstrar o bloqueio de segurança que o cliente vê se sair da janela"
          >
            <Lock className="w-3 h-3" />
            <span>Testar Proteção</span>
          </button>

          <div className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs sm:text-sm font-bold tracking-wider text-amber-400">
            {currentPage + 1} / {totalPages}
          </div>

          <button
            onClick={onExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm transition-all shadow-md cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Exportar</span>
          </button>
        </div>
      </div>

      {/* Main Flipbook Canvas Stage */}
      <div className="relative flex-1 flex items-center justify-center p-2 sm:p-4 overflow-hidden">
        
        {/* Left Side Edge Click Area */}
        <div
          onClick={prevPage}
          className={`absolute left-0 top-0 bottom-0 w-12 sm:w-28 z-20 cursor-pointer flex items-center justify-start pl-2 sm:pl-4 transition-opacity group ${
            currentPage === 0 ? 'pointer-events-none opacity-0' : 'opacity-80 md:opacity-0 hover:opacity-100'
          }`}
          title="Página Anterior"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900/80 md:bg-white/90 text-white md:text-slate-950 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
            <ChevronLeft className="w-6 h-6" />
          </div>
        </div>

        {/* 3D Book Container */}
        <div
          style={{
            transform: `scale(${zoomLevel})`,
            transition: 'transform 0.25s ease',
            perspective: '2500px',
          }}
          className="relative max-w-5xl w-full flex items-center justify-center"
        >
          {totalPages === 0 ? (
            <div className="text-center p-8 bg-slate-900/60 rounded-2xl border border-slate-800">
              <p className="text-slate-400 mb-3">Nenhuma lâmina adicionada à proposta.</p>
              <button
                onClick={onBackToEditor}
                className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-sm"
              >
                Adicionar Lâminas
              </button>
            </div>
          ) : (
            <div
              className="relative w-[92vw] sm:w-[860px] h-[60vh] sm:h-[620px] max-h-[640px] cursor-pointer"
              style={{
                transformStyle: 'preserve-3d',
              }}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                if (clickX > rect.width * 0.52) {
                  nextPage();
                } else if (clickX < rect.width * 0.48) {
                  prevPage();
                }
              }}
            >
              {pages.map((page, index) => {
                const isFlipped = index < currentPage;
                const isCurrent = index === currentPage;
                const isNext = index === currentPage + 1;

                const zIndex = isFlipped
                  ? index
                  : isCurrent
                  ? totalPages + 10
                  : totalPages - index;

                return (
                  <div
                    key={page.id}
                    style={{
                      transform: isFlipped ? 'rotateY(-180deg)' : 'rotateY(0deg)',
                      transformOrigin: 'left center',
                      zIndex,
                      opacity: isFlipped ? 0 : isCurrent ? 1 : isNext ? 1 : 0.2,
                      pointerEvents: isCurrent ? 'auto' : 'none',
                      boxShadow: isCurrent
                        ? '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 1px 1px rgba(255,255,255,0.05)'
                        : 'none',
                    }}
                    className="absolute inset-0 bg-slate-900 rounded-xl overflow-hidden transition-all duration-500 ease-out will-change-transform select-none"
                  >
                    <div className="relative w-full h-full flex items-center justify-center bg-slate-950">
                      <img
                        src={page.dataUrl}
                        alt={page.name}
                        className="w-full h-full object-contain pointer-events-none"
                        draggable={false}
                      />

                      {/* Watermark */}
                      {config.security?.watermarkText && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-20">
                          <span className="text-white/20 font-black text-2xl sm:text-4xl tracking-widest -rotate-45 uppercase border-2 border-white/10 px-6 py-2 rounded-xl">
                            {config.security.watermarkText}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Side Edge Click Area */}
        <div
          onClick={nextPage}
          className={`absolute right-0 top-0 bottom-0 w-12 sm:w-28 z-20 cursor-pointer flex items-center justify-end pr-2 sm:pr-4 transition-opacity group ${
            currentPage === totalPages - 1 ? 'pointer-events-none opacity-0' : 'opacity-80 md:opacity-0 hover:opacity-100'
          }`}
          title="Próxima Página"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900/80 md:bg-white/90 text-white md:text-slate-950 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
            <ChevronRight className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Floating Bottom Drawer for Thumbnails */}
      {showThumbs && (
        <div className="relative z-40 bg-slate-950/90 backdrop-blur-xl border-t border-white/10 p-3 sm:p-4 animate-slide-up">
          <div className="max-w-4xl mx-auto flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
            {pages.map((page, idx) => (
              <button
                key={page.id}
                onClick={() => goToPage(idx)}
                className={`relative flex-shrink-0 w-16 sm:w-20 h-20 sm:h-24 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                  idx === currentPage
                    ? 'border-amber-400 scale-105 shadow-lg shadow-amber-400/20'
                    : 'border-white/15 opacity-60 hover:opacity-100 hover:border-white/40'
                }`}
              >
                <img
                  src={page.dataUrl}
                  alt={page.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1 right-1 text-[10px] font-bold bg-slate-950/80 text-white px-1.5 py-0.5 rounded">
                  {idx + 1}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Controls Bar & Editable Footer */}
      <div className="relative z-30 pb-3 pt-1 px-4 flex flex-col items-center gap-2">
        {/* Dock Controls */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-full bg-slate-900/90 backdrop-blur-xl border border-white/15 shadow-2xl">
          {/* Previous page */}
          <button
            onClick={prevPage}
            disabled={currentPage === 0}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white text-slate-950 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center hover:bg-amber-400 active:scale-95 transition-all shadow-sm font-bold cursor-pointer touch-manipulation select-none"
            title="Página Anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="h-5 w-px bg-white/20 mx-1" />

          {/* Thumbnails toggle */}
          <button
            onClick={() => setShowThumbs(prev => !prev)}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              showThumbs ? 'bg-amber-500 text-slate-950' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
            title="Miniaturas de páginas (T)"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>

          {/* Sound toggle */}
          <button
            onClick={() => setSoundActive(prev => !prev)}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              soundActive ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-rose-500/20 text-rose-300'
            }`}
            title={soundActive ? 'Desativar som de virar página (S)' : 'Ativar som de virar página (S)'}
          >
            {soundActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Zoom Out */}
          <button
            onClick={() => setZoomLevel(prev => Math.max(prev - 0.15, 0.7))}
            className="w-9 h-9 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-all cursor-pointer"
            title="Diminuir Zoom"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          {/* Zoom In */}
          <button
            onClick={() => setZoomLevel(prev => Math.min(prev + 0.15, 1.8))}
            className="w-9 h-9 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-all cursor-pointer"
            title="Aumentar Zoom"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          {/* Autoplay Slideshow */}
          <button
            onClick={() => setIsPlaying(prev => !prev)}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              isPlaying ? 'bg-emerald-500 text-slate-950' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
            title={isPlaying ? 'Pausar apresentação automática' : 'Apresentação automática'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="w-9 h-9 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-all cursor-pointer"
            title="Alternar Tela Cheia (F)"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>

          <div className="h-5 w-px bg-white/20 mx-1" />

          {/* Next page */}
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages - 1}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white text-slate-950 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center hover:bg-amber-400 active:scale-95 transition-all shadow-sm font-bold cursor-pointer touch-manipulation select-none"
            title="Próxima Página"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* EDITABLE FOOTER */}
        <div className="text-center text-xs text-slate-300 px-4 max-w-2xl flex flex-col items-center gap-1">
          <p className="text-slate-300 font-medium">
            {footerText}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-400">
            {whatsappNum && (
              <a
                href={`https://wa.me/${whatsappNum}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:underline font-semibold"
              >
                WhatsApp: {designerPhone || whatsappNum}
              </a>
            )}
            {designerEmail && (
              <>
                <span>•</span>
                <a href={`mailto:${designerEmail}`} className="text-amber-400 hover:underline">
                  {designerEmail}
                </a>
              </>
            )}
            {designerWebsite && (
              <>
                <span>•</span>
                <a href={designerWebsite} target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline">
                  Website
                </a>
              </>
            )}
            {config.contract && (
              <>
                <span>•</span>
                <button
                  onClick={handleDownloadContract}
                  className="text-amber-300 hover:text-amber-200 underline font-bold cursor-pointer"
                >
                  📄 Baixar Contrato
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Simulated Security Lock Screen Modal */}
      {simulatedSecurityLock && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center p-6 animate-fade-in"
          onClick={() => setSimulatedSecurityLock(false)}
        >
          <div
            className="max-w-md w-full bg-slate-900 border border-slate-700 rounded-3xl p-8 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20 mx-auto flex items-center justify-center mb-5">
              <Lock className="w-8 h-8" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
              Visualização Protegida
            </span>
            <h3 className="text-xl font-bold text-white mt-3 mb-2">
              Apresentação Ocultada
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Esta apresentação contém dados estratégicos confidenciais. Quando seu cliente mudar de aba ou minimizar a janela, esta tela é ativada automaticamente para impedir capturas indevidas.
            </p>
            <button
              onClick={() => setSimulatedSecurityLock(false)}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-all cursor-pointer"
            >
              Voltar à Apresentação
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
