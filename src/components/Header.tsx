import { BookOpen, Eye, Edit3, Download, UserCheck, Layers, FileCheck } from 'lucide-react';
import { ProposalConfig } from '../types.ts';

export type AppView = 'setup' | 'pages' | 'viewer';

interface HeaderProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  pageCount: number;
  onExport: () => void;
  config: ProposalConfig;
}

export function Header({
  currentView,
  onViewChange,
  pageCount,
  onExport,
  config,
}: HeaderProps) {
  const brandName = config.designer?.companyOrStudio || config.designer?.name || 'Flipbook Propostas';
  const projectTitle = config.project?.title || config.title || 'Proposta Comercial';

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        
        {/* Left: Brand / Title */}
        <div className="flex items-center gap-3 min-w-0">
          {config.designer?.photoOrLogoUrl ? (
            <img
              src={config.designer.photoOrLogoUrl}
              alt="Logo"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-contain bg-slate-950/60 border border-slate-700 p-1 flex-shrink-0"
            />
          ) : (
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/20 flex-shrink-0">
              <BookOpen className="w-5 h-5 text-slate-950" />
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-100 truncate">
                {brandName}
              </span>
              {config.contract && (
                <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full flex-shrink-0">
                  <FileCheck className="w-3 h-3" /> Contrato OK
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 truncate">
              {projectTitle}
            </p>
          </div>
        </div>

        {/* Center: 3 Navigation Tabs */}
        <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs sm:text-sm font-medium">
          {/* Tab 1: Dados & Identidade */}
          <button
            onClick={() => onViewChange('setup')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              currentView === 'setup'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
            title="Cadastrar dados do designer, cliente e contrato"
          >
            <UserCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">1. Dados &amp; Perfil</span>
            <span className="sm:hidden">Dados</span>
          </button>

          {/* Tab 2: Lâminas */}
          <button
            onClick={() => onViewChange('pages')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              currentView === 'pages'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
            title="Carregar e ordenar as páginas da proposta"
          >
            <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">2. Lâminas</span>
            <span className="sm:hidden">Lâminas</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-900/60 text-current font-bold">
              {pageCount}
            </span>
          </button>

          {/* Tab 3: Flipbook 3D */}
          <button
            onClick={() => onViewChange('viewer')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              currentView === 'viewer'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
            title="Visualizar o flipbook 3D interativo"
          >
            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">3. Flipbook 3D</span>
            <span className="sm:hidden">3D</span>
          </button>
        </div>

        {/* Right: Export button */}
        <div className="flex items-center gap-2">
          <button
            onClick={onExport}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-amber-500/20 active:scale-95 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Exportar Proposta</span>
            <span className="sm:hidden">Exportar</span>
          </button>
        </div>

      </div>
    </header>
  );
}
