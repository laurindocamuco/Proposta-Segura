import { ProposalPage } from '../types.ts';

function createSvgDataUrl(svgString: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
}

export function getDefaultPages(): ProposalPage[] {
  const page1 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1600" width="1200" height="1600">
    <defs>
      <linearGradient id="bg1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0F172A" />
        <stop offset="50%" stop-color="#1E293B" />
        <stop offset="100%" stop-color="#020617" />
      </linearGradient>
      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#F59E0B" />
        <stop offset="100%" stop-color="#FBBF24" />
      </linearGradient>
    </defs>
    <rect width="1200" height="1600" fill="url(#bg1)" />
    <circle cx="1050" cy="200" r="300" fill="#3B82F6" opacity="0.08" />
    <circle cx="150" cy="1400" r="400" fill="#F59E0B" opacity="0.05" />

    <!-- Top Badge -->
    <rect x="120" y="140" width="220" height="40" rx="20" fill="white" fill-opacity="0.1" />
    <text x="230" y="166" fill="#93C5FD" font-family="system-ui, sans-serif" font-size="16" font-weight="600" text-anchor="middle" letter-spacing="3">PROPOSTA COMERCIAL</text>

    <!-- Main Title -->
    <text x="120" y="380" fill="white" font-family="system-ui, sans-serif" font-size="74" font-weight="800" letter-spacing="-1">DESIGN &amp;</text>
    <text x="120" y="460" fill="url(#goldGrad)" font-family="system-ui, sans-serif" font-size="74" font-weight="800" letter-spacing="-1">SOLUÇÕES</text>
    <text x="120" y="540" fill="white" font-family="system-ui, sans-serif" font-size="74" font-weight="800" letter-spacing="-1">ESTRATÉGICAS</text>

    <text x="120" y="630" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="28" font-weight="400">Transformando visão em experiências digitais de alto impacto</text>

    <!-- Project Box -->
    <rect x="120" y="760" width="960" height="420" rx="24" fill="white" fill-opacity="0.04" stroke="white" stroke-opacity="0.1" stroke-width="2" />
    
    <text x="170" y="830" fill="#E2E8F0" font-family="system-ui, sans-serif" font-size="22" font-weight="700">DADOS DO PROJETO</text>
    
    <text x="170" y="900" fill="#64748B" font-family="system-ui, sans-serif" font-size="16" font-weight="600">CLIENTE / EMPRESA</text>
    <text x="170" y="935" fill="white" font-family="system-ui, sans-serif" font-size="24" font-weight="600">Parceiro Corporativo</text>

    <text x="600" y="900" fill="#64748B" font-family="system-ui, sans-serif" font-size="16" font-weight="600">DATA DE EMISSÃO</text>
    <text x="600" y="935" fill="white" font-family="system-ui, sans-serif" font-size="24" font-weight="600">Setembro de 2026</text>

    <line x1="170" y1="990" x2="1030" y2="990" stroke="white" stroke-opacity="0.08" stroke-width="1" />

    <text x="170" y="1050" fill="#64748B" font-family="system-ui, sans-serif" font-size="16" font-weight="600">ESCOPO PRINCIPAL</text>
    <text x="170" y="1085" fill="white" font-family="system-ui, sans-serif" font-size="22" font-weight="500">Identidade Visual, UI/UX Design &amp; Apresentação Interativa</text>

    <!-- Footer Author -->
    <rect x="120" y="1280" width="960" height="180" rx="16" fill="white" fill-opacity="0.06" />
    <text x="170" y="1345" fill="white" font-family="system-ui, sans-serif" font-size="26" font-weight="700">Laurindo Camuco</text>
    <text x="170" y="1385" fill="#38BDF8" font-family="system-ui, sans-serif" font-size="18" font-weight="500">Designer de Soluções &amp; Especialista em Apresentações</text>
    <text x="170" y="1425" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="16">WhatsApp: (+244) 923 478 399 | laurindo.camuco@gmail.com</text>
  </svg>`;

  const page2 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1600" width="1200" height="1600">
    <rect width="1200" height="1600" fill="#FFFFFF" />
    <rect x="0" y="0" width="1200" height="16" fill="#0F172A" />

    <text x="120" y="130" fill="#64748B" font-family="system-ui, sans-serif" font-size="16" font-weight="700" letter-spacing="3">SEÇÃO 01</text>
    <text x="120" y="190" fill="#0F172A" font-family="system-ui, sans-serif" font-size="44" font-weight="800">Diagnóstico &amp; Objetivos</text>
    <text x="120" y="235" fill="#64748B" font-family="system-ui, sans-serif" font-size="20">Entendimento das metas e geração de valor mensurável</text>

    <!-- Pillar 1 -->
    <rect x="120" y="320" width="960" height="260" rx="16" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="2" />
    <circle cx="180" cy="380" r="32" fill="#3B82F6" fill-opacity="0.1" />
    <text x="180" y="388" fill="#2563EB" font-family="system-ui, sans-serif" font-size="24" font-weight="800" text-anchor="middle">01</text>
    <text x="240" y="388" fill="#0F172A" font-family="system-ui, sans-serif" font-size="26" font-weight="700">Elevação da Percepção de Marca</text>
    <text x="180" y="450" fill="#475569" font-family="system-ui, sans-serif" font-size="20" font-weight="400">Desenvolver materiais e touchpoints visuais que transmitam autoridade máxima no mercado, gerando credibilidade instantânea em reuniões de negócios.</text>

    <!-- Pillar 2 -->
    <rect x="120" y="620" width="960" height="260" rx="16" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="2" />
    <circle cx="180" cy="680" r="32" fill="#10B981" fill-opacity="0.1" />
    <text x="180" y="688" fill="#059669" font-family="system-ui, sans-serif" font-size="24" font-weight="800" text-anchor="middle">02</text>
    <text x="240" y="688" fill="#0F172A" font-family="system-ui, sans-serif" font-size="26" font-weight="700">Experiência Imersiva do Cliente</text>
    <text x="180" y="750" fill="#475569" font-family="system-ui, sans-serif" font-size="20" font-weight="400">Apresentações em formato Flipbook interativo permitindo que tomadores de decisão folheiem propostas como se fossem catálogos impressos de luxo.</text>

    <!-- Pillar 3 -->
    <rect x="120" y="920" width="960" height="260" rx="16" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="2" />
    <circle cx="180" cy="980" r="32" fill="#F59E0B" fill-opacity="0.1" />
    <text x="180" y="988" fill="#D97706" font-family="system-ui, sans-serif" font-size="24" font-weight="800" text-anchor="middle">03</text>
    <text x="240" y="988" fill="#0F172A" font-family="system-ui, sans-serif" font-size="26" font-weight="700">Proteção de Conteúdo &amp; Segurança</text>
    <text x="180" y="1050" fill="#475569" font-family="system-ui, sans-serif" font-size="20" font-weight="400">Proteção contra cópia não autorizada, bloqueio ao perder foco da janela e desativação de cliques direitos para resguardar a propriedade intelectual.</text>

    <!-- Bottom page num -->
    <text x="120" y="1520" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="16" font-weight="600">Proposta Comercial | Laurindo Camuco</text>
    <text x="1080" y="1520" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="16" font-weight="600" text-anchor="end">Página 02</text>
  </svg>`;

  const page3 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1600" width="1200" height="1600">
    <rect width="1200" height="1600" fill="#FFFFFF" />
    <rect x="0" y="0" width="1200" height="16" fill="#0F172A" />

    <text x="120" y="130" fill="#64748B" font-family="system-ui, sans-serif" font-size="16" font-weight="700" letter-spacing="3">SEÇÃO 02</text>
    <text x="120" y="190" fill="#0F172A" font-family="system-ui, sans-serif" font-size="44" font-weight="800">Entregáveis &amp; Cronograma</text>
    <text x="120" y="235" fill="#64748B" font-family="system-ui, sans-serif" font-size="20">Fases bem definidas para pontualidade e transparência</text>

    <!-- Table Header -->
    <rect x="120" y="320" width="960" height="60" rx="8" fill="#0F172A" />
    <text x="160" y="358" fill="white" font-family="system-ui, sans-serif" font-size="18" font-weight="700">FASE / ATIVIDADE</text>
    <text x="680" y="358" fill="white" font-family="system-ui, sans-serif" font-size="18" font-weight="700">PRAZO</text>
    <text x="880" y="358" fill="white" font-family="system-ui, sans-serif" font-size="18" font-weight="700">ENTREGÁVEL</text>

    <!-- Row 1 -->
    <rect x="120" y="395" width="960" height="130" rx="8" fill="#F8FAFC" />
    <text x="160" y="445" fill="#0F172A" font-family="system-ui, sans-serif" font-size="22" font-weight="700">1. Alinhamento &amp; Moodboard</text>
    <text x="160" y="485" fill="#64748B" font-family="system-ui, sans-serif" font-size="17">Entrevistas de briefing, análise de concorrentes e referências visuais.</text>
    <text x="680" y="465" fill="#2563EB" font-family="system-ui, sans-serif" font-size="19" font-weight="700">Semana 1</text>
    <text x="880" y="465" fill="#059669" font-family="system-ui, sans-serif" font-size="18" font-weight="600">Guia de Estilo</text>

    <!-- Row 2 -->
    <rect x="120" y="540" width="960" height="130" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1" />
    <text x="160" y="590" fill="#0F172A" font-family="system-ui, sans-serif" font-size="22" font-weight="700">2. Criação Visual &amp; Diagramação</text>
    <text x="160" y="630" fill="#64748B" font-family="system-ui, sans-serif" font-size="17">Composição das lâminas da proposta com tipografia e paleta premium.</text>
    <text x="680" y="610" fill="#2563EB" font-family="system-ui, sans-serif" font-size="19" font-weight="700">Semana 2</text>
    <text x="880" y="610" fill="#059669" font-family="system-ui, sans-serif" font-size="18" font-weight="600">Layouts HD</text>

    <!-- Row 3 -->
    <rect x="120" y="685" width="960" height="130" rx="8" fill="#F8FAFC" />
    <text x="160" y="735" fill="#0F172A" font-family="system-ui, sans-serif" font-size="22" font-weight="700">3. Montagem do Flipbook Interativo</text>
    <text x="160" y="775" fill="#64748B" font-family="system-ui, sans-serif" font-size="17">Exportação para pacote HTML independente com animações 3D e proteções.</text>
    <text x="680" y="755" fill="#2563EB" font-family="system-ui, sans-serif" font-size="19" font-weight="700">Semana 3</text>
    <text x="880" y="755" fill="#059669" font-family="system-ui, sans-serif" font-size="18" font-weight="600">Arquivo HTML</text>

    <!-- Highlight Box -->
    <rect x="120" y="870" width="960" height="230" rx="16" fill="#EFF6FF" stroke="#BFDBFE" stroke-width="2" />
    <text x="170" y="930" fill="#1E40AF" font-family="system-ui, sans-serif" font-size="24" font-weight="700">Garantia de Revisão &amp; Suporte</text>
    <text x="170" y="980" fill="#334155" font-family="system-ui, sans-serif" font-size="19">Inclui até duas rodadas de ajustes finos e assistência para publicação ou hospedagem sem qualquer custo adicional.</text>
    <text x="170" y="1030" fill="#1E40AF" font-family="system-ui, sans-serif" font-size="17" font-weight="600">✔ Total compatibilidade com celular, tablet e computador.</text>

    <!-- Bottom page num -->
    <text x="120" y="1520" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="16" font-weight="600">Proposta Comercial | Laurindo Camuco</text>
    <text x="1080" y="1520" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="16" font-weight="600" text-anchor="end">Página 03</text>
  </svg>`;

  const page4 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1600" width="1200" height="1600">
    <rect width="1200" height="1600" fill="#0F172A" />

    <text x="120" y="130" fill="#F59E0B" font-family="system-ui, sans-serif" font-size="16" font-weight="700" letter-spacing="3">SEÇÃO 03</text>
    <text x="120" y="190" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="44" font-weight="800">Investimento &amp; Próximos Passos</text>
    <text x="120" y="235" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="20">Condições especiais e formalização do projeto</text>

    <!-- Investment Card -->
    <rect x="120" y="320" width="960" height="340" rx="20" fill="#1E293B" stroke="white" stroke-opacity="0.12" stroke-width="2" />
    <text x="180" y="390" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="20" font-weight="600">PACOTE COMPLETO DE DESIGN &amp; APRESENTAÇÃO</text>
    <text x="180" y="470" fill="#38BDF8" font-family="system-ui, sans-serif" font-size="56" font-weight="800">Valor Sob Consulta</text>
    <text x="180" y="520" fill="#CBD5E1" font-family="system-ui, sans-serif" font-size="20">Formas de pagamento: 50% na entrada + 50% na aprovação final dos arquivos.</text>
    <text x="180" y="570" fill="#FBBF24" font-family="system-ui, sans-serif" font-size="18" font-weight="600">★ Validade desta proposta: 15 dias a contar da data de emissão.</text>

    <!-- Sign-off card -->
    <rect x="120" y="710" width="960" height="420" rx="20" fill="white" fill-opacity="0.05" stroke="white" stroke-opacity="0.08" stroke-width="1" />
    <text x="180" y="780" fill="white" font-family="system-ui, sans-serif" font-size="26" font-weight="700">Vamos começar?</text>
    <text x="180" y="830" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="20">Para aprovação formal, confirme por mensagem direta ou assine abaixo:</text>

    <line x1="180" y1="970" x2="520" y2="970" stroke="white" stroke-opacity="0.3" stroke-width="2" />
    <text x="180" y="1010" fill="#E2E8F0" font-family="system-ui, sans-serif" font-size="18" font-weight="600">Assinatura do Cliente</text>

    <line x1="620" y1="970" x2="980" y2="970" stroke="white" stroke-opacity="0.3" stroke-width="2" />
    <text x="620" y="1010" fill="#E2E8F0" font-family="system-ui, sans-serif" font-size="18" font-weight="600">Laurindo Camuco - Designer</text>

    <!-- Direct contacts -->
    <rect x="120" y="1200" width="960" height="200" rx="16" fill="#10B981" fill-opacity="0.1" stroke="#10B981" stroke-opacity="0.3" />
    <text x="180" y="1265" fill="#34D399" font-family="system-ui, sans-serif" font-size="22" font-weight="700">Atendimento Imediato via WhatsApp</text>
    <text x="180" y="1310" fill="white" font-family="system-ui, sans-serif" font-size="28" font-weight="800">(+244) 923 478 399</text>
    <text x="180" y="1355" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="17">laurindo.camuco@gmail.com | Luanda, Angola</text>

    <!-- Bottom page num -->
    <text x="120" y="1520" fill="#64748B" font-family="system-ui, sans-serif" font-size="16" font-weight="600">Proposta Comercial | Laurindo Camuco</text>
    <text x="1080" y="1520" fill="#64748B" font-family="system-ui, sans-serif" font-size="16" font-weight="600" text-anchor="end">Página 04</text>
  </svg>`;

  return [
    {
      id: 'demo-1',
      name: '01_Capa_Proposta.svg',
      dataUrl: createSvgDataUrl(page1),
      width: 1200,
      height: 1600,
    },
    {
      id: 'demo-2',
      name: '02_Objetivos_Estrategicos.svg',
      dataUrl: createSvgDataUrl(page2),
      width: 1200,
      height: 1600,
    },
    {
      id: 'demo-3',
      name: '03_Entregaveis_Cronograma.svg',
      dataUrl: createSvgDataUrl(page3),
      width: 1200,
      height: 1600,
    },
    {
      id: 'demo-4',
      name: '04_Investimento_Contatos.svg',
      dataUrl: createSvgDataUrl(page4),
      width: 1200,
      height: 1600,
    },
  ];
}
