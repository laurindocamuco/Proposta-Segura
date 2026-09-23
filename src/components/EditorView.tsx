import React, { useRef, useState } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Shield,
  Palette,
  Volume2,
  FileText,
  Eye,
  CheckCircle2,
  Maximize2,
  X,
  Plus,
  UserCheck,
  FileCheck,
  Download
} from 'lucide-react';
import { ProposalConfig, ProposalPage } from '../types.ts';

interface EditorViewProps {
  pages: ProposalPage[];
  setPages: React.Dispatch<React.SetStateAction<ProposalPage[]>>;
  config: ProposalConfig;
  setConfig: React.Dispatch<React.SetStateAction<ProposalConfig>>;
  onGoToSetup: () => void;
  onOpenViewer: () => void;
  onExport: () => void;
  onResetDefaults: () => void;
}

const BG_PRESETS = [
  { name: 'Studio Black', color: '#111111' },
  { name: 'Midnight Blue', color: '#090D16' },
  { name: 'Charcoal Warm', color: '#18181B' },
  { name: 'Deep Slate', color: '#0F172A' },
  { name: 'Dark Emerald', color: '#022C22' },
];

export function EditorView({
  pages,
  setPages,
  config,
  setConfig,
  onGoToSetup,
  onOpenViewer,
  onExport,
  onResetDefaults,
}: EditorViewProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [previewModalImage, setPreviewModalImage] = useState<string | null>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (fileArray.length === 0) return;

    fileArray.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        if (dataUrl) {
          const newPage: ProposalPage = {
            id: 'page_' + Math.random().toString(36).substring(2, 9),
            name: file.name.replace(/\.[^/.]+$/, ''),
            dataUrl,
          };
          setPages((prev) => [...prev, newPage]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removePage = (index: number) => {
    setPages((prev) => prev.filter((_, i) => i !== index));
  };

  const movePage = (from: number, to: number) => {
    if (to < 0 || to >= pages.length) return;
    setPages((prev) => {
      const copy = [...prev];
      const [item] = copy.splice(from, 1);
      copy.splice(to, 0, item);
      return copy;
    });
  };

  const duplicatePage = (index: number) => {
    const target = pages[index];
    if (!target) return;
    const duplicated: ProposalPage = {
      ...target,
      id: 'page_' + Math.random().toString(36).substring(2, 9),
      name: `${target.name} (cópia)`,
    };
    setPages((prev) => {
      const copy = [...prev];
      copy.splice(index + 1, 0, duplicated);
      return copy;
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* Header Hero Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-900 to-slate-850 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl mb-8">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-400 text-xs font-bold mb-3 border border-amber-500/30">
                <Sparkles className="w-3.5 h-3.5" /> Passo 2: Lâminas da Apresentação
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                Upload &amp; Ordenação das Páginas
              </h1>
              <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
                Adicione suas lâminas em alta definição (PNG, JPG ou SVG). Ordene a sequência da apresentação e ajuste a aparência visual da proposta.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={onGoToSetup}
                className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-bold text-xs sm:text-sm transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                title="Editar dados da proposta, logotipo e contrato"
              >
                <UserCheck className="w-4 h-4 text-amber-400" />
                <span>Dados &amp; Contrato</span>
              </button>
              <button
                onClick={onOpenViewer}
                disabled={pages.length === 0}
                className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm transition-all shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Eye className="w-4 h-4" />
                <span>Ver Flipbook 3D</span>
              </button>
            </div>
          </div>
        </div>

        {/* Upload Drop Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFiles(e.dataTransfer.files);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all cursor-pointer relative overflow-hidden group ${
            dragOver
              ? 'border-amber-400 bg-amber-500/10 scale-[1.01]'
              : 'border-slate-800 hover:border-slate-700 bg-slate-900/60 hover:bg-slate-900/90'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/png, image/jpeg, image/webp, image/svg+xml"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20 group-hover:scale-110 transition-transform">
              <Upload className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                Arraste suas imagens ou clique para fazer upload
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md mx-auto">
                Suporta PNG, JPG, WebP e SVG em alta definição. Você pode enviar múltiplas lâminas de uma só vez.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400/90 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Otimizado para mobile (iPhone e Android) &amp; Desktop</span>
            </div>
          </div>
        </div>

        {/* Pages Gallery / Sequence */}
        <div className="mt-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <span>Sequência da Apresentação</span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-amber-400 border border-slate-700">
                  {pages.length} {pages.length === 1 ? 'página' : 'páginas'}
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Use as setas para reorganizar a ordem de virada das folhas no flipbook.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4 text-amber-400" />
                <span>Adicionar Lâmina</span>
              </button>

              <button
                onClick={onResetDefaults}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 text-xs font-semibold transition-all cursor-pointer"
                title="Restaurar apresentação de demonstração"
              >
                Restaurar Demo
              </button>
            </div>
          </div>

          {pages.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-dashed border-slate-800">
              <ImageIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">Nenhuma lâmina adicionada ainda.</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-4 px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-400 transition-colors cursor-pointer"
              >
                Carregar Primeira Imagem
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {pages.map((page, index) => (
                <div
                  key={page.id}
                  className="group bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl overflow-hidden shadow-lg transition-all flex flex-col justify-between"
                >
                  {/* Image Preview */}
                  <div className="relative aspect-[3/4] bg-slate-950 overflow-hidden flex items-center justify-center p-2">
                    <img
                      src={page.dataUrl}
                      alt={page.name}
                      className="max-h-full max-w-full object-contain pointer-events-none rounded"
                    />

                    {/* Page Number Badge */}
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md text-[11px] font-bold text-amber-400 border border-white/10">
                      #{index + 1}
                    </div>

                    {/* Zoom icon on hover */}
                    <button
                      onClick={() => setPreviewModalImage(page.dataUrl)}
                      className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-slate-950/80 backdrop-blur-md text-slate-300 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                      title="Ampliar visualização"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Name and Actions */}
                  <div className="p-3 bg-slate-900 border-t border-slate-800">
                    <input
                      type="text"
                      value={page.name}
                      onChange={(e) => {
                        const val = e.target.value;
                        setPages((prev) =>
                          prev.map((p, i) => (i === index ? { ...p, name: val } : p))
                        );
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-200 truncate focus:outline-none focus:border-amber-400 mb-2 font-medium"
                      title="Clique para editar o título da lâmina"
                    />

                    <div className="flex items-center justify-between text-slate-400">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => movePage(index, index - 1)}
                          disabled={index === 0}
                          className="w-6 h-6 rounded-md bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center cursor-pointer"
                          title="Mover para trás"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => movePage(index, index + 1)}
                          disabled={index === pages.length - 1}
                          className="w-6 h-6 rounded-md bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center cursor-pointer"
                          title="Mover para frente"
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => duplicatePage(index)}
                          className="w-6 h-6 rounded-md bg-slate-800 hover:bg-slate-700 hover:text-amber-400 flex items-center justify-center cursor-pointer"
                          title="Duplicar lâmina"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => removePage(index)}
                          className="w-6 h-6 rounded-md bg-slate-800 hover:bg-rose-600 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                          title="Excluir lâmina"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Settings Grid: Appearance, Protection, Sound */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Visual Settings */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Cenário &amp; Efeitos</h3>
                <p className="text-xs text-slate-400">Personalize o fundo e o som da apresentação.</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Cor de Fundo do Visualizador
                </label>
                <div className="grid grid-cols-5 gap-2 mb-3">
                  {BG_PRESETS.map((preset) => (
                    <button
                      key={preset.color}
                      onClick={() => setConfig({ ...config, backgroundColor: preset.color })}
                      style={{ backgroundColor: preset.color }}
                      className={`h-11 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-center ${
                        config.backgroundColor === preset.color
                          ? 'border-amber-400 scale-105 shadow-md shadow-amber-400/20'
                          : 'border-slate-700 hover:border-slate-500'
                      }`}
                      title={preset.name}
                    >
                      {config.backgroundColor === preset.color && (
                        <CheckCircle2 className="w-4 h-4 text-amber-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                      <Volume2 className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-white block">Efeito Sonoro de Papel Real</span>
                      <span className="text-xs text-slate-400 block mt-0.5">
                        Áudio acústico suave sintetizado ao virar de cada página
                      </span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.soundEnabled}
                    onChange={(e) => setConfig({ ...config, soundEnabled: e.target.checked })}
                    className="w-5 h-5 accent-amber-500 cursor-pointer rounded"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Security & Watermark */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800 mb-6">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Proteção &amp; Marca d'Água</h3>
                <p className="text-xs text-slate-400">Blindagem contra cópia e captura indevida.</p>
              </div>
            </div>

            <div className="space-y-4">
              <label className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700 transition-colors">
                <div>
                  <span className="text-xs font-bold text-white block">Ocultar Apresentação ao Perder Foco</span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Ativa tela de privacidade se o cliente trocar de aba ou minimizar a tela
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={config.security.blurOnFocusLost}
                  onChange={(e) => setConfig({
                    ...config,
                    security: { ...config.security, blurOnFocusLost: e.target.checked }
                  })}
                  className="w-4 h-4 accent-amber-500 cursor-pointer rounded"
                />
              </label>

              <label className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700 transition-colors">
                <div>
                  <span className="text-xs font-bold text-white block">Bloquear Botão Direito &amp; Arraste</span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Impede que o cliente salve as lâminas isoladas por clique direito
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={config.security.blockRightClick}
                  onChange={(e) => setConfig({
                    ...config,
                    security: {
                      ...config.security,
                      blockRightClick: e.target.checked,
                      preventDrag: e.target.checked,
                    }
                  })}
                  className="w-4 h-4 accent-amber-500 cursor-pointer rounded"
                />
              </label>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <label className="text-xs font-bold text-white block mb-1">
                  Marca d'Água Transparente (Opcional)
                </label>
                <input
                  type="text"
                  value={config.security.watermarkText}
                  onChange={(e) => setConfig({
                    ...config,
                    security: { ...config.security, watermarkText: e.target.value }
                  })}
                  placeholder="Ex: CONFIDENCIAL ou nome do cliente"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white uppercase focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Big Export Bottom Banner */}
        <div className="mt-12 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 rounded-3xl p-6 sm:p-8 text-slate-950 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs font-black uppercase tracking-wider bg-slate-950/10 px-3 py-1 rounded-full">
              Pronto para Apresentação
            </span>
            <h3 className="text-xl sm:text-2xl font-black mt-2">
              Exportar Proposta (HTML Interativo ou PDF)
            </h3>
            <p className="text-slate-900 font-medium text-xs sm:text-sm mt-1 max-w-xl">
              Escolha entre o Flipbook HTML autônomo com som e contrato para assinatura ou a Proposta Comercial em PDF com folha de rosto oficial.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onGoToSetup}
              className="flex-1 sm:flex-none px-4 py-3.5 rounded-xl bg-slate-950/20 hover:bg-slate-950/30 text-slate-950 border border-slate-950/30 font-bold text-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <UserCheck className="w-4 h-4" />
              <span>Dados &amp; Contrato</span>
            </button>

            <button
              onClick={onOpenViewer}
              disabled={pages.length === 0}
              className="flex-1 sm:flex-none px-5 py-3.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-bold text-sm transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4 text-amber-400" />
              <span>Testar Flipbook</span>
            </button>

            <button
              onClick={onExport}
              disabled={pages.length === 0}
              className="flex-1 sm:flex-none px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-400/40 font-extrabold text-sm transition-all shadow-xl active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Baixar Proposta</span>
            </button>
          </div>
        </div>

      </div>

      {/* Image Zoom Modal */}
      {previewModalImage && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setPreviewModalImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-slate-900 p-2 rounded-2xl border border-slate-700 shadow-2xl">
            <button
              onClick={() => setPreviewModalImage(null)}
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-800 text-white hover:bg-rose-600 flex items-center justify-center border border-slate-700 shadow-lg cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <img
              src={previewModalImage}
              alt="Ampliação da página"
              className="max-h-[85vh] max-w-full object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
