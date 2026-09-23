import { useState, useEffect } from 'react';
import { Header, AppView } from './components/Header.tsx';
import { InitialSetupView } from './components/InitialSetupView.tsx';
import { EditorView } from './components/EditorView.tsx';
import { FlipbookViewer } from './components/FlipbookViewer.tsx';
import { ExportModal } from './components/ExportModal.tsx';
import { OfflineIndicator } from './components/OfflineIndicator.tsx';
import { ProposalConfig, ProposalPage } from './types.ts';
import { getDefaultPages } from './utils/samplePages.ts';

const DEFAULT_CONFIG: ProposalConfig = {
  title: 'Proposta Comercial de Design & Soluções',
  subtitle: 'Apresentação Estratégica Interativa',
  backgroundColor: '#111111',
  bookRatio: 'contain',
  designer: {
    name: 'Laurindo Camuco',
    role: 'Designer de Soluções & Especialista em Apresentações',
    companyOrStudio: 'Laurindo Camuco Studio',
    photoOrLogoUrl: '',
    email: 'laurindo.camuco@gmail.com',
    phone: '(+244) 923 478 399',
    whatsapp: '244923478399',
    website: 'https://behance.net',
    location: 'Luanda, Angola',
  },
  client: {
    companyName: 'Parceiro Corporativo',
    clientName: 'Diretoria de Marketing',
    contactPerson: 'Diretoria Executiva',
    email: 'contato@cliente.com',
    phone: '+244 912 345 678',
  },
  project: {
    title: 'Proposta Comercial de Design & Soluções',
    subtitle: 'Identidade Visual, UI/UX Design & Apresentação Interativa',
    date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }),
    validity: '15 dias corridos',
    investmentValue: 'Sob Consulta',
  },
  footer: {
    customText: '© 2026 Laurindo Camuco Studio. Todos os direitos reservados. Proposta confidencial para o cliente.',
    showContactButtons: true,
    showDesignerPhoto: true,
    disclaimer: 'As informações e conceitos visuais desta proposta são propriedade intelectual e confidenciais.',
  },
  contract: null,
  security: {
    blurOnFocusLost: true,
    blockRightClick: true,
    blockCopyAndSave: true,
    blockPrintScreen: true,
    preventDrag: true,
    watermarkText: '',
  },
  soundEnabled: true,
};

const STORAGE_KEY_PAGES = 'flipbook_pages_v2';
const STORAGE_KEY_CONFIG = 'flipbook_config_v2';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('setup');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Initialize pages with stored pages or default demo pages
  const [pages, setPages] = useState<ProposalPage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PAGES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Ignore
    }
    return getDefaultPages();
  });

  // Initialize config with stored config or default
  const [config, setConfig] = useState<ProposalConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_CONFIG,
          ...parsed,
          designer: { ...DEFAULT_CONFIG.designer, ...(parsed.designer || {}) },
          client: { ...DEFAULT_CONFIG.client, ...(parsed.client || {}) },
          project: { ...DEFAULT_CONFIG.project, ...(parsed.project || {}) },
          footer: { ...DEFAULT_CONFIG.footer, ...(parsed.footer || {}) },
          security: { ...DEFAULT_CONFIG.security, ...(parsed.security || {}) },
        };
      }
    } catch {
      // Ignore
    }
    return DEFAULT_CONFIG;
  });

  // Save pages to localStorage safely
  useEffect(() => {
    try {
      const serialized = JSON.stringify(pages);
      if (serialized.length < 4_000_000) {
        localStorage.setItem(STORAGE_KEY_PAGES, serialized);
      }
    } catch {
      // Storage quota safety
    }
  }, [pages]);

  // Save config to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
    } catch {
      // Ignore
    }
  }, [config]);

  // Keyboard shortcut (Ctrl+S / Ctrl+E to export)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 's' || e.key.toLowerCase() === 'e')) {
        e.preventDefault();
        setIsExportModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleResetDefaults = () => {
    if (confirm('Deseja recarregar o modelo demonstrativo de proposta? Suas lâminas e dados atuais serão restaurados para a demonstração.')) {
      setPages(getDefaultPages());
      setConfig(DEFAULT_CONFIG);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 flex flex-col">
      {/* Top Header Navigation */}
      {currentView !== 'viewer' && (
        <Header
          currentView={currentView}
          onViewChange={setCurrentView}
          pageCount={pages.length}
          onExport={() => setIsExportModalOpen(true)}
          config={config}
        />
      )}

      {/* Main View Area */}
      <main className="flex-1">
        {currentView === 'setup' && (
          <InitialSetupView
            config={config}
            setConfig={setConfig}
            onGoToPages={() => setCurrentView('pages')}
            onOpenViewer={() => setCurrentView('viewer')}
            onExport={() => setIsExportModalOpen(true)}
          />
        )}

        {currentView === 'pages' && (
          <EditorView
            pages={pages}
            setPages={setPages}
            config={config}
            setConfig={setConfig}
            onGoToSetup={() => setCurrentView('setup')}
            onOpenViewer={() => setCurrentView('viewer')}
            onExport={() => setIsExportModalOpen(true)}
            onResetDefaults={handleResetDefaults}
          />
        )}

        {currentView === 'viewer' && (
          <FlipbookViewer
            pages={pages}
            config={config}
            onBackToEditor={() => setCurrentView('pages')}
            onExport={() => setIsExportModalOpen(true)}
          />
        )}
      </main>

      {/* Export Modal with 2 download options (HTML + PDF) & Contract */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        pages={pages}
        config={config}
      />

      {/* Offline Status Indicator */}
      <OfflineIndicator />
    </div>
  );
}
