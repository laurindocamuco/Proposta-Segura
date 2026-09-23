import React, { useState } from 'react';
import {
  Download,
  Copy,
  Check,
  X,
  FileCode,
  FileText,
  ShieldCheck,
  Smartphone,
  Sparkles,
  FileCheck,
  Loader2,
  ExternalLink,
  Printer
} from 'lucide-react';
import { ProposalConfig, ProposalPage } from '../types.ts';
import { generateStandaloneHTML } from '../utils/htmlExporter.ts';
import { exportProposalAsPDF } from '../utils/pdfExporter.ts';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  pages: ProposalPage[];
  config: ProposalConfig;
}

export function ExportModal({
  isOpen,
  onClose,
  pages,
  config,
}: ExportModalProps) {
  const [copied, setCopied] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfProgressText, setPdfProgressText] = useState('');
  const [activeTab, setActiveTab] = useState<'options' | 'code'>('options');

  if (!isOpen) return null;

  const htmlContent = generateStandaloneHTML(pages, config);
  const fileSizeKb = Math.round(new Blob([htmlContent]).size / 1024);

  // 1. Download Standalone HTML Flipbook
  const handleDownloadHTML = () => {
    const filename = (config.project.title || config.title || 'proposta-flipbook')
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '_')
      .replace(/_+/g, '_') + '.html';

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 2. Download Official PDF Proposal
  const handleDownloadPDF = async () => {
    if (pages.length === 0) {
      alert('Adicione pelo menos 1 lâmina antes de exportar em PDF.');
      return;
    }

    try {
      setIsGeneratingPdf(true);
      setPdfProgressText('Iniciando renderização da proposta em PDF...');
      await exportProposalAsPDF(pages, config, (_percent, text) => {
        setPdfProgressText(text);
      });
    } catch (err) {
      console.error('Erro ao gerar PDF:', err);
      alert('Ocorreu um erro ao gerar o PDF. Verifique se as imagens estão disponíveis.');
    } finally {
      setIsGeneratingPdf(false);
      setPdfProgressText('');
    }
  };

  // 3. Download Attached Contract directly
  const handleDownloadContract = () => {
    if (!config.contract?.dataUrl) return;
    const link = document.createElement('a');
    link.href = config.contract.dataUrl;
    link.download = config.contract.fileName || 'Contrato_Prestacao_Servicos.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(htmlContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div
        className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 sm:p-8 text-white shadow-2xl relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center hover:bg-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Exportar Proposta Comercial
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Escolha o formato ideal para apresentar e fechar com o seu cliente.
            </p>
          </div>
        </div>

        {/* Summary Pill Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6 text-center">
          <div className="bg-slate-950/70 border border-slate-800 p-2.5 rounded-xl">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-bold">Lâminas</span>
            <span className="text-sm sm:text-base font-bold text-amber-400 mt-0.5 block">{pages.length} páginas</span>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 p-2.5 rounded-xl">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-bold">Cliente</span>
            <span className="text-sm font-bold text-slate-200 mt-0.5 block truncate px-1">
              {config.client.companyName || config.client.clientName || 'Geral'}
            </span>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 p-2.5 rounded-xl">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-bold">Contrato</span>
            <span className={`text-xs sm:text-sm font-bold mt-0.5 block ${config.contract ? 'text-emerald-400' : 'text-slate-500'}`}>
              {config.contract ? 'Anexo Incluído' : 'Sem anexo'}
            </span>
          </div>
        </div>

        {/* 2 MAIN DOWNLOAD OPTIONS */}
        <div className="space-y-4 mb-6">
          
          {/* OPTION 1: FLIPBOOK HTML INTERATIVO */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-950/80 to-slate-900 border-2 border-amber-500/40 hover:border-amber-400 transition-all shadow-lg">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FileCode className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-white">Opção 1: Flipbook HTML Interativo 3D</h3>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-md">
                      Mais Popular
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Arquivo único <code className="text-amber-300 font-mono">.html</code> independente. Abre no WhatsApp, iPhone, Android e Computadores sem internet ou instaladores. Com som realista de virar página, dados cadastrados e botão integrado para o cliente baixar o contrato para assinatura.
                  </p>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <ShieldCheck className="w-3.5 h-3.5" /> Proteção anticópia
                    </span>
                    <span className="flex items-center gap-1 text-amber-400">
                      <Smartphone className="w-3.5 h-3.5" /> Otimizado para iPhone
                    </span>
                    <span>Tamanho: ~{fileSizeKb} KB</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={handleDownloadHTML}
                className="w-full sm:flex-1 py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-sm transition-all shadow-lg shadow-amber-500/20 active:scale-98 cursor-pointer flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Baixar Apresentação em HTML (.html)</span>
              </button>

              <button
                onClick={handleCopy}
                className="w-full sm:w-auto py-3 px-4 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-semibold rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                title="Copiar código-fonte completo"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-400" />
                    <span>Copiar Código</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* OPTION 2: PROPOSTA COMERCIAL EM PDF */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-950/80 to-slate-900 border border-slate-800 hover:border-slate-700 transition-all shadow-lg">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-white">Opção 2: Proposta Comercial em PDF (.pdf)</h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-md">
                      Impressão &amp; Formal
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Documento PDF comercial de alto padrão com <strong>Folha de Rosto Oficial</strong> contendo seu logotipo/foto, dados do cliente, data, validade, investimento e todas as lâminas de design em alta resolução para impressão ou arquivo físico.
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 text-sky-400">
                      <Printer className="w-3.5 h-3.5" /> Perfeito para imprimir
                    </span>
                    <span>Formato A4 Paisagem</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800/80">
              <button
                onClick={handleDownloadPDF}
                disabled={isGeneratingPdf || pages.length === 0}
                className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-750 text-white font-bold rounded-xl text-sm border border-slate-700 hover:border-sky-500/50 transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isGeneratingPdf ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
                    <span className="text-sky-300">{pdfProgressText || 'Gerando PDF comercial...'}</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 text-sky-400" />
                    <span>Baixar Proposta Comercial Completa em PDF (.pdf)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ATTACHED CONTRACT DOWNLOAD (IF UPLOADED) */}
          {config.contract && (
            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">
                    Contrato Anexado: {config.contract.fileName}
                  </span>
                  <span className="text-[11px] text-emerald-400/80 block">
                    Este contrato já está embutido no arquivo HTML e pode ser baixado separadamente.
                  </span>
                </div>
              </div>

              <button
                onClick={handleDownloadContract}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 flex-shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Baixar Contrato (.PDF)</span>
              </button>
            </div>
          )}

        </div>

        {/* Footer Note */}
        <p className="text-[11px] text-slate-400 text-center">
          💡 <strong>Dica comercial:</strong> Envie o arquivo HTML diretamente pelo WhatsApp do cliente. Ele poderá visualizar imediatamente a apresentação interativa e baixar a minuta do contrato para assinar.
        </p>
      </div>
    </div>
  );
}
