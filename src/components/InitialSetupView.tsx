import React, { useRef } from 'react';
import {
  Building2,
  User,
  Mail,
  Phone,
  MessageSquare,
  Globe,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  FileText,
  Upload,
  Trash2,
  FileCheck,
  Download,
  Eye,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  HelpCircle
} from 'lucide-react';
import { ProposalConfig } from '../types.ts';

interface InitialSetupViewProps {
  config: ProposalConfig;
  setConfig: React.Dispatch<React.SetStateAction<ProposalConfig>>;
  onGoToPages: () => void;
  onOpenViewer: () => void;
  onExport: () => void;
}

export function InitialSetupView({
  config,
  setConfig,
  onGoToPages,
  onOpenViewer,
  onExport,
}: InitialSetupViewProps) {
  const logoInputRef = useRef<HTMLInputElement>(null);
  const contractInputRef = useRef<HTMLInputElement>(null);

  // Logo / Photo upload handler
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione uma imagem válida (PNG, JPG ou SVG).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setConfig((prev) => ({
          ...prev,
          designer: {
            ...prev.designer,
            photoOrLogoUrl: dataUrl,
          },
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setConfig((prev) => ({
      ...prev,
      designer: {
        ...prev.designer,
        photoOrLogoUrl: '',
      },
    }));
    if (logoInputRef.current) logoInputRef.current.value = '';
  };

  // PDF Contract upload handler
  const handleContractUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      alert('Por favor, selecione um arquivo no formato PDF (.pdf).');
      return;
    }

    // Check size (e.g. max 15MB)
    if (file.size > 15 * 1024 * 1024) {
      alert('O arquivo PDF selecionado é superior a 15MB. Recomendamos comprimir o PDF para envio leve.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setConfig((prev) => ({
          ...prev,
          contract: {
            fileName: file.name,
            fileSize: file.size,
            dataUrl,
            uploadedAt: new Date().toLocaleDateString('pt-BR'),
          },
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveContract = () => {
    setConfig((prev) => ({
      ...prev,
      contract: null,
    }));
    if (contractInputRef.current) contractInputRef.current.value = '';
  };

  const handleDownloadContractTest = () => {
    if (!config.contract?.dataUrl) return;
    const link = document.createElement('a');
    link.href = config.contract.dataUrl;
    link.download = config.contract.fileName || 'Contrato.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Set today's date
  const setTodayDate = () => {
    const today = new Date().toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
    setConfig((prev) => ({
      ...prev,
      project: {
        ...prev.project,
        date: today,
      },
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* Hero Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-900 to-slate-850 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl mb-8">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-400 text-xs font-bold mb-3 border border-amber-500/30">
                <Sparkles className="w-3.5 h-3.5" /> Plataforma para Designers &amp; Agências
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                Cadastro da Proposta &amp; Identidade
              </h1>
              <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
                Cadastre seus dados profissionais ou da sua empresa, informações do cliente e anexe o contrato em PDF. Esses dados serão aplicados automaticamente na apresentação 3D, no rodapé editável e na exportação em PDF e HTML.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={onGoToPages}
                className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm transition-all shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Organizar Lâminas</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onExport}
                className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-750 text-white font-bold text-sm border border-slate-700 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>Exportar</span>
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-8">

          {/* BLOCK 1: DADOS DO DESIGNER / EMPRESA */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center justify-between pb-5 border-b border-slate-800 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-white">1. Identidade do Designer ou Empresa</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Seus dados oficiais que aparecerão no cabeçalho, rodapé e folha de rosto da proposta.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Logo / Avatar Upload */}
              <div className="lg:col-span-4 bg-slate-950/60 border border-slate-800 rounded-2xl p-5 text-center flex flex-col items-center justify-center">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                  Logotipo ou Foto do Designer
                </span>

                <div className="relative w-32 h-32 rounded-2xl border-2 border-dashed border-slate-700 bg-slate-900 flex items-center justify-center overflow-hidden group shadow-inner mb-4">
                  {config.designer.photoOrLogoUrl ? (
                    <img
                      src={config.designer.photoOrLogoUrl}
                      alt="Logo ou foto do designer"
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-slate-500 p-3">
                      <Building2 className="w-10 h-10 mb-1 text-slate-600" />
                      <span className="text-[11px] font-medium">Sem imagem</span>
                    </div>
                  )}

                  {config.designer.photoOrLogoUrl && (
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg hover:bg-rose-500 transition-colors cursor-pointer"
                      title="Remover logotipo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/svg+xml, image/webp"
                  onChange={handleLogoUpload}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Upload className="w-4 h-4 text-amber-400" />
                  <span>{config.designer.photoOrLogoUrl ? 'Trocar Logotipo / Foto' : 'Fazer Upload de Logo / Foto'}</span>
                </button>
                <p className="text-[10px] text-slate-500 mt-2">Recomendado: PNG com fundo transparente ou JPG quadrado/horizontal.</p>
              </div>

              {/* Designer Details Inputs */}
              <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                    Nome do Designer ou Empresa *
                  </label>
                  <input
                    type="text"
                    value={config.designer.companyOrStudio || config.designer.name}
                    onChange={(e) => {
                      const val = e.target.value;
                      setConfig((prev) => ({
                        ...prev,
                        designer: { ...prev.designer, companyOrStudio: val, name: val },
                        author: { ...prev.author, name: val, role: prev.designer.role, email: prev.designer.email, phone: prev.designer.phone, whatsapp: prev.designer.whatsapp },
                      }));
                    }}
                    placeholder="Ex: Studio Alpha Design ou Laurindo Camuco"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                    Especialidade / Cargo
                  </label>
                  <input
                    type="text"
                    value={config.designer.role}
                    onChange={(e) => setConfig((prev) => ({
                      ...prev,
                      designer: { ...prev.designer, role: e.target.value },
                    }))}
                    placeholder="Ex: Designer de Soluções & Branding"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                    E-mail Profissional
                  </label>
                  <input
                    type="email"
                    value={config.designer.email}
                    onChange={(e) => setConfig((prev) => ({
                      ...prev,
                      designer: { ...prev.designer, email: e.target.value },
                    }))}
                    placeholder="contato@seudominio.com"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                    WhatsApp (com DDI do país)
                  </label>
                  <input
                    type="text"
                    value={config.designer.whatsapp}
                    onChange={(e) => setConfig((prev) => ({
                      ...prev,
                      designer: { ...prev.designer, whatsapp: e.target.value },
                    }))}
                    placeholder="Ex: 244923478399 ou 5511999999999"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 font-mono transition-colors"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Gera o link de conversa direta no WhatsApp do cliente.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-sky-400" />
                    Telefone para Chamadas
                  </label>
                  <input
                    type="text"
                    value={config.designer.phone}
                    onChange={(e) => setConfig((prev) => ({
                      ...prev,
                      designer: { ...prev.designer, phone: e.target.value },
                    }))}
                    placeholder="Ex: 923 478 399"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-amber-400" />
                    Website ou Portfólio / Instagram
                  </label>
                  <input
                    type="text"
                    value={config.designer.website}
                    onChange={(e) => setConfig((prev) => ({
                      ...prev,
                      designer: { ...prev.designer, website: e.target.value },
                    }))}
                    placeholder="https://behance.net/seuportfolio"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    Cidade / País ou Localização
                  </label>
                  <input
                    type="text"
                    value={config.designer.location}
                    onChange={(e) => setConfig((prev) => ({
                      ...prev,
                      designer: { ...prev.designer, location: e.target.value },
                    }))}
                    placeholder="Ex: Luanda, Angola ou São Paulo, Brasil"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* BLOCK 2: DADOS DO CLIENTE & PROJETO */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Cliente */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 pb-4 border-b border-slate-800 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">2. Dados do Cliente</h2>
                    <p className="text-xs text-slate-400">Destinatário da proposta comercial.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                      Nome do Cliente ou Empresa Cliente *
                    </label>
                    <input
                      type="text"
                      value={config.client.companyName || config.client.clientName}
                      onChange={(e) => {
                        const val = e.target.value;
                        setConfig((prev) => ({
                          ...prev,
                          client: { ...prev.client, companyName: val, clientName: val },
                        }));
                      }}
                      placeholder="Ex: Banco Solar ou Empresa Confidencial"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                      Responsável / Pessoa de Contato
                    </label>
                    <input
                      type="text"
                      value={config.client.contactPerson}
                      onChange={(e) => setConfig((prev) => ({
                        ...prev,
                        client: { ...prev.client, contactPerson: e.target.value },
                      }))}
                      placeholder="Ex: Dr. Roberto Mendes - Diretor Executivo"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                        E-mail do Cliente
                      </label>
                      <input
                        type="email"
                        value={config.client.email}
                        onChange={(e) => setConfig((prev) => ({
                          ...prev,
                          client: { ...prev.client, email: e.target.value },
                        }))}
                        placeholder="cliente@empresa.com"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                        Telefone / WhatsApp
                      </label>
                      <input
                        type="text"
                        value={config.client.phone}
                        onChange={(e) => setConfig((prev) => ({
                          ...prev,
                          client: { ...prev.client, phone: e.target.value },
                        }))}
                        placeholder="Ex: +244 912 345 678"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Projeto */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 pb-4 border-b border-slate-800 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">3. Detalhes do Projeto</h2>
                    <p className="text-xs text-slate-400">Título, prazos e escopo da proposta.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                      Título do Projeto / Proposta *
                    </label>
                    <input
                      type="text"
                      value={config.project.title || config.title}
                      onChange={(e) => {
                        const val = e.target.value;
                        setConfig((prev) => ({
                          ...prev,
                          title: val,
                          project: { ...prev.project, title: val },
                        }));
                      }}
                      placeholder="Ex: Redesign de Identidade Visual & App Mobile"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                      Subtítulo / Escopo Resumido
                    </label>
                    <input
                      type="text"
                      value={config.project.subtitle || config.subtitle}
                      onChange={(e) => {
                        const val = e.target.value;
                        setConfig((prev) => ({
                          ...prev,
                          subtitle: val,
                          project: { ...prev.project, subtitle: val },
                        }));
                      }}
                      placeholder="Ex: Apresentação Interativa & Proposta Técnica Comercial"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                          Data
                        </label>
                        <button
                          type="button"
                          onClick={setTodayDate}
                          className="text-[10px] text-amber-400 hover:underline cursor-pointer"
                        >
                          Hoje
                        </button>
                      </div>
                      <input
                        type="text"
                        value={config.project.date}
                        onChange={(e) => setConfig((prev) => ({
                          ...prev,
                          project: { ...prev.project, date: e.target.value },
                        }))}
                        placeholder="Ex: 23/09/2026"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                        Validade
                      </label>
                      <input
                        type="text"
                        value={config.project.validity}
                        onChange={(e) => setConfig((prev) => ({
                          ...prev,
                          project: { ...prev.project, validity: e.target.value },
                        }))}
                        placeholder="Ex: 15 dias"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                        Investimento
                      </label>
                      <input
                        type="text"
                        value={config.project.investmentValue}
                        onChange={(e) => setConfig((prev) => ({
                          ...prev,
                          project: { ...prev.project, investmentValue: e.target.value },
                        }))}
                        placeholder="Ex: 450.000 Kz"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-semibold text-amber-400"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BLOCK 3: RODAPÉ 100% EDITÁVEL */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800 mb-5">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-white">4. Personalização do Rodapé da Apresentação</h2>
                <p className="text-xs text-slate-400">Totalmente configurável para qualquer estúdio ou designer.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Texto do Rodapé (Copyright / Declaração)
                </label>
                <textarea
                  rows={2}
                  value={config.footer.customText}
                  onChange={(e) => setConfig((prev) => ({
                    ...prev,
                    footer: { ...prev.footer, customText: e.target.value },
                  }))}
                  placeholder={`Ex: © ${new Date().getFullYear()} ${config.designer.companyOrStudio || 'Studio'}. Todos os direitos reservados. Proposta confidencial para ${config.client.companyName || 'o cliente'}.`}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 transition-colors"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Este texto será exibido no rodapé do visualizador interativo, no arquivo HTML e na folha de rosto do PDF.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <label className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700 transition-colors">
                  <div>
                    <span className="text-sm font-bold text-white block">Botões Rápidos de Contato no Rodapé</span>
                    <span className="text-xs text-slate-400 block mt-0.5">Exibe links clicáveis de WhatsApp, E-mail e Telefone</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.footer.showContactButtons}
                    onChange={(e) => setConfig((prev) => ({
                      ...prev,
                      footer: { ...prev.footer, showContactButtons: e.target.checked },
                    }))}
                    className="w-5 h-5 accent-amber-500 cursor-pointer rounded"
                  />
                </label>

                <label className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700 transition-colors">
                  <div>
                    <span className="text-sm font-bold text-white block">Exibir Logotipo/Foto no Rodapé / Topo</span>
                    <span className="text-xs text-slate-400 block mt-0.5">Mostra a marca do designer ao lado do título</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.footer.showDesignerPhoto}
                    onChange={(e) => setConfig((prev) => ({
                      ...prev,
                      footer: { ...prev.footer, showDesignerPhoto: e.target.checked },
                    }))}
                    className="w-5 h-5 accent-amber-500 cursor-pointer rounded"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* BLOCK 4: ANEXO DE CONTRATO EM PDF */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-white">5. Contrato em PDF para Assinatura (Opcional)</h2>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                      Destaque Comercial
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Envie a proposta junto com a minuta contratual para o cliente baixar, imprimir e assinar.
                  </p>
                </div>
              </div>
            </div>

            <input
              ref={contractInputRef}
              type="file"
              accept="application/pdf"
              onChange={handleContractUpload}
              className="hidden"
            />

            {!config.contract ? (
              <div
                onClick={() => contractInputRef.current?.click()}
                className="border-2 border-dashed border-slate-700 hover:border-amber-400/60 bg-slate-950/50 hover:bg-slate-950/80 rounded-2xl p-8 text-center transition-all cursor-pointer group"
              >
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform mx-auto flex items-center justify-center mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-white mb-1">
                  Clique aqui para fazer upload do Contrato em PDF (.pdf)
                </h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  O contrato será embutido no arquivo HTML e na proposta comercial. O cliente terá um botão direto para baixar e imprimir para assinatura.
                </p>
              </div>
            ) : (
              <div className="bg-slate-950/80 border border-emerald-500/30 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <FileCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-white">{config.contract.fileName}</span>
                      <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">
                        Pronto para Assinatura
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Tamanho: {(config.contract.fileSize / 1024).toFixed(1)} KB • Carregado em: {config.contract.uploadedAt}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleDownloadContractTest}
                    className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    title="Baixar para testar visualização"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                    <span>Testar Download</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => contractInputRef.current?.click()}
                    className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Substituir</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRemoveContract}
                    className="p-2 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white transition-all cursor-pointer"
                    title="Remover contrato"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* NEXT STEP CTA BAR */}
          <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 rounded-3xl p-6 sm:p-8 text-slate-950 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-xs font-black uppercase tracking-wider bg-slate-950/10 px-3 py-1 rounded-full">
                Próximo Passo
              </span>
              <h3 className="text-xl sm:text-2xl font-black mt-2">
                Inserir Lâminas e Imagens do Projeto
              </h3>
              <p className="text-slate-900 font-medium text-xs sm:text-sm mt-1 max-w-xl">
                Suas informações estão salvas. Agora adicione ou ordene as páginas do flipbook para concluir a proposta comercial.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <button
                onClick={onOpenViewer}
                className="flex-1 sm:flex-none px-5 py-3.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-bold text-sm transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4 text-amber-400" />
                <span>Testar Flipbook 3D</span>
              </button>

              <button
                onClick={onGoToPages}
                className="flex-1 sm:flex-none px-6 py-3.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-amber-400 border border-amber-400/40 font-black text-sm transition-all shadow-xl active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Avançar para Lâminas</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
