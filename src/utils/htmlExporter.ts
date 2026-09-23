import { ProposalConfig, ProposalPage } from '../types.ts';

export function generateStandaloneHTML(
  pages: ProposalPage[],
  config: ProposalConfig
): string {
  // Extract designer data with fallbacks
  const designerName = config.designer?.companyOrStudio || config.designer?.name || config.author?.name || 'Designer / Studio';
  const designerRole = config.designer?.role || config.author?.role || '';
  const designerPhone = config.designer?.phone || config.author?.phone || '';
  const designerEmail = config.designer?.email || config.author?.email || '';
  const rawWhatsapp = config.designer?.whatsapp || config.author?.whatsapp || '';
  const designerWhatsapp = rawWhatsapp.replace(/\D/g, '') || '';
  const designerWebsite = config.designer?.website || '';
  const designerLogo = config.designer?.photoOrLogoUrl || '';

  // Extract client and project data
  const clientName = config.client?.companyName || config.client?.clientName || '';
  const projectTitle = config.project?.title || config.title || 'Proposta Comercial';
  const projectSubtitle = config.project?.subtitle || config.subtitle || (clientName ? `Elaborada para ${clientName}` : '');

  // Extract footer configuration
  const defaultFooterText = `© ${new Date().getFullYear()} ${designerName}. Todos os direitos reservados. Proposta confidencial${clientName ? ` para ${clientName}` : ''}.`;
  const footerText = config.footer?.customText || defaultFooterText;
  const showContactButtons = config.footer?.showContactButtons !== false;

  const safeTitle = escapeHTML(projectTitle);
  const safeSubtitle = escapeHTML(projectSubtitle);
  const bgColor = config.backgroundColor || '#111111';

  // Build Pages HTML
  const pagesHTML = pages.map((page, index) => {
    return `
      <div class="page" id="page-${index}" data-page="${index}">
        <div class="page-inner">
          <img src="${page.dataUrl}" alt="${escapeHTML(page.name)}" loading="${index < 3 ? 'eager' : 'lazy'}" draggable="false" />
          ${config.security?.watermarkText ? `
            <div class="watermark-overlay">
              <span class="watermark-text">${escapeHTML(config.security.watermarkText)}</span>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }).join('\n');

  // Build Thumbs HTML
  const thumbsHTML = pages.map((page, index) => {
    return `
      <div class="thumb-btn ${index === 0 ? 'active' : ''}" onclick="goToPage(${index})">
        <img src="${page.dataUrl}" alt="Página ${index + 1}" draggable="false" />
        <span>${index + 1}</span>
      </div>
    `;
  }).join('\n');

  // Contract data for embedding
  const hasContract = Boolean(config.contract && config.contract.dataUrl);
  const contractFileName = config.contract?.fileName ? escapeHTML(config.contract.fileName) : 'Contrato.pdf';

  return `<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title>${safeTitle} • ${escapeHTML(designerName)}</title>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-tap-highlight-color: transparent;
    }

    html, body {
      width: 100%;
      height: 100%;
      min-height: 100vh;
      min-height: 100dvh;
      overflow: hidden;
      background-color: ${bgColor};
      background-image: radial-gradient(circle at center, rgba(255,255,255,0.06) 0%, rgba(0,0,0,0.88) 100%);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #ffffff;
      user-select: none;
      -webkit-user-select: none;
      -webkit-touch-callout: none;
    }

    #viewer {
      width: 100%;
      height: 100vh;
      height: 100dvh;
      display: flex;
      flex-direction: column;
      position: relative;
    }

    .wrapper {
      width: min(96vw, 1140px);
      height: 100vh;
      height: 100dvh;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 8px 14px;
      padding-top: max(8px, env(safe-area-inset-top));
      padding-bottom: max(8px, env(safe-area-inset-bottom));
      box-sizing: border-box;
    }

    /* Topbar */
    .topbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 4px 4px 8px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      flex-shrink: 0;
      gap: 12px;
    }

    .brand-group {
      display: flex;
      align-items: center;
      gap: 10px;
      overflow: hidden;
    }

    .brand-logo {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      object-fit: contain;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.15);
      flex-shrink: 0;
      padding: 2px;
    }

    .title-group {
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .title {
      font-size: 17px;
      font-weight: 700;
      letter-spacing: -0.3px;
      color: #f8fafc;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .subtitle {
      font-size: 11.5px;
      color: #94a3b8;
      margin-top: 1px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .top-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
    }

    .btn-contract-header {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: linear-gradient(135deg, #10b981, #059669);
      color: #ffffff;
      border: none;
      border-radius: 9999px;
      padding: 5px 14px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.35);
      transition: transform 0.15s, background 0.15s;
      touch-action: manipulation;
      white-space: nowrap;
    }

    .btn-contract-header:active {
      transform: scale(0.94);
    }

    .counter-pill {
      font-size: 12.5px;
      font-weight: 700;
      padding: 4px 12px;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border-radius: 9999px;
      color: #f59e0b;
      border: 1px solid rgba(255, 255, 255, 0.14);
      white-space: nowrap;
    }

    /* Flipbook 3D Canvas Area */
    .book-area {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      perspective: 2500px;
      -webkit-perspective: 2500px;
      position: relative;
      padding: 4px 0;
      touch-action: pan-y;
    }

    .book-container {
      transform-origin: center center;
      -webkit-transform-origin: center center;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.25s ease;
      transform-style: preserve-3d;
      -webkit-transform-style: preserve-3d;
    }

    .book {
      position: relative;
      width: min(92vw, 860px);
      height: min(62vh, 620px);
      transform-style: preserve-3d;
      -webkit-transform-style: preserve-3d;
      cursor: pointer;
    }

    .page {
      position: absolute;
      inset: 0;
      background: #ffffff;
      border-radius: 8px;
      transform-origin: left center;
      -webkit-transform-origin: left center;
      transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), -webkit-transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.6s ease, opacity 0.35s ease;
      -webkit-transition: -webkit-transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.6s ease, opacity 0.35s ease;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6), 0 1px 3px rgba(0, 0, 0, 0.3);
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      will-change: transform, -webkit-transform, opacity;
      touch-action: manipulation;
    }

    .page-inner {
      position: relative;
      width: 100%;
      height: 100%;
      background: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .page img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      background: #0f172a;
      pointer-events: none;
    }

    /* Watermark */
    .watermark-overlay {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      z-index: 10;
    }

    .watermark-text {
      font-size: min(6vw, 36px);
      font-weight: 900;
      color: rgba(255, 255, 255, 0.18);
      transform: rotate(-35deg);
      text-transform: uppercase;
      letter-spacing: 6px;
      user-select: none;
    }

    /* Edge Click Zones */
    .edge-zone {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 52px;
      z-index: 80;
      cursor: pointer;
      display: flex;
      align-items: center;
      opacity: 0.85;
      transition: opacity 0.2s, transform 0.15s;
      touch-action: manipulation;
      user-select: none;
      -webkit-user-select: none;
    }

    @media (min-width: 769px) {
      .edge-zone {
        width: 16%;
        opacity: 0;
      }
      .edge-zone:hover {
        opacity: 1;
      }
    }

    .edge-left {
      left: 0;
      justify-content: flex-start;
      padding-left: 8px;
    }

    .edge-right {
      right: 0;
      justify-content: flex-end;
      padding-right: 8px;
    }

    .edge-icon {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: rgba(15, 23, 42, 0.85);
      color: #ffffff;
      border: 1px solid rgba(255, 255, 255, 0.25);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      box-shadow: 0 4px 14px rgba(0,0,0,0.4);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    }

    /* Controls dock */
    .controls-dock {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 4px 0;
      flex-shrink: 0;
      position: relative;
      z-index: 100;
      touch-action: manipulation;
    }

    .dock-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 5px 14px;
      background: rgba(15, 23, 42, 0.88);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.16);
      border-radius: 9999px;
      box-shadow: 0 8px 26px rgba(0, 0, 0, 0.45);
    }

    .btn-nav {
      width: 42px;
      height: 42px;
      min-width: 42px;
      min-height: 42px;
      border-radius: 50%;
      border: none;
      background: #ffffff;
      color: #0f172a;
      font-size: 19px;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      transition: transform 0.15s, background 0.15s;
      touch-action: manipulation;
      -webkit-tap-highlight-color: transparent;
    }

    .btn-nav:active {
      transform: scale(0.92);
      background: #f1f5f9;
    }

    .btn-nav:disabled {
      opacity: 0.25;
      cursor: not-allowed;
      pointer-events: none;
      transform: none;
    }

    .btn-tool {
      width: 36px;
      height: 36px;
      min-width: 36px;
      min-height: 36px;
      border-radius: 50%;
      border: none;
      background: rgba(255, 255, 255, 0.12);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      cursor: pointer;
      transition: background 0.15s, transform 0.15s;
      touch-action: manipulation;
      -webkit-tap-highlight-color: transparent;
    }

    .btn-tool:active {
      transform: scale(0.92);
    }

    .btn-tool.active {
      background: #f59e0b;
      color: #0f172a;
    }

    /* Thumbnails Drawer */
    .thumbs-drawer {
      position: absolute;
      bottom: 80px;
      left: 50%;
      transform: translateX(-50%) translateY(20px);
      background: rgba(15, 23, 42, 0.95);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 16px;
      padding: 12px 16px;
      display: none;
      gap: 10px;
      max-width: 90vw;
      overflow-x: auto;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
      z-index: 120;
      -webkit-overflow-scrolling: touch;
    }

    .thumbs-drawer.open {
      display: flex;
      transform: translateX(-50%) translateY(0);
    }

    .thumb-btn {
      flex: 0 0 64px;
      height: 72px;
      display: flex;
      flex-direction: column;
      align-items: center;
      border: 2px solid transparent;
      border-radius: 8px;
      padding: 3px;
      cursor: pointer;
      touch-action: manipulation;
      transition: border-color 0.15s, transform 0.15s;
    }

    .thumb-btn img {
      width: 100%;
      height: 50px;
      object-fit: cover;
      border-radius: 4px;
    }

    .thumb-btn span {
      font-size: 10px;
      color: #94a3b8;
      margin-top: 2px;
    }

    .thumb-btn.active {
      border-color: #f59e0b;
    }

    .thumb-btn.active span {
      color: #f59e0b;
      font-weight: 700;
    }

    /* EDITABLE FOOTER */
    .footer {
      text-align: center;
      color: rgba(255, 255, 255, 0.7);
      font-size: 11px;
      line-height: 1.4;
      padding-top: 4px;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 3px;
    }

    .footer-custom-text {
      color: rgba(255, 255, 255, 0.85);
      font-weight: 500;
    }

    .footer-contacts {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-size: 11px;
    }

    .footer-chip {
      color: #38bdf8;
      text-decoration: none;
      font-weight: 600;
      transition: color 0.15s;
      display: inline-flex;
      align-items: center;
      gap: 3px;
    }

    .footer-chip:hover {
      color: #7dd3fc;
      text-decoration: underline;
    }

    .footer-chip-wa {
      color: #34d399;
    }

    .footer-chip-wa:hover {
      color: #6ee7b7;
    }

    .contract-badge-link {
      color: #fbbf24;
      font-weight: 700;
      text-decoration: underline;
      cursor: pointer;
    }

    /* Security Overlay */
    #securityOverlay {
      display: none;
      position: fixed;
      inset: 0;
      z-index: 999999;
      background: rgba(10, 15, 25, 0.96);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      color: #ffffff;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 24px;
    }

    #securityOverlay.active {
      display: flex;
    }

    .security-card {
      max-width: 440px;
      background: #1e293b;
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 20px;
      padding: 32px 24px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
    }

    .security-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: rgba(239, 68, 68, 0.15);
      color: #ef4444;
      font-size: 30px;
      margin-bottom: 16px;
      border: 1px solid rgba(239, 68, 68, 0.3);
    }

    .security-card h2 {
      font-size: 22px;
      font-weight: 700;
      color: #f8fafc;
      margin-bottom: 10px;
    }

    .security-card p {
      color: #94a3b8;
      font-size: 14px;
      line-height: 1.5;
    }

    .security-resume-btn {
      margin-top: 20px;
      padding: 12px 28px;
      background: #f59e0b;
      color: #0f172a;
      border: none;
      border-radius: 12px;
      font-weight: 700;
      font-size: 14px;
      cursor: pointer;
      touch-action: manipulation;
      -webkit-tap-highlight-color: transparent;
      transition: background 0.15s, transform 0.15s;
    }

    @media (max-width: 768px) {
      .wrapper {
        padding: 6px 8px;
      }
      .title {
        font-size: 15px;
      }
      .subtitle {
        display: none;
      }
      .book {
        width: 92vw;
        height: 58vh;
        max-height: 520px;
      }
      .footer {
        font-size: 10px;
      }
      .btn-contract-header {
        font-size: 11px;
        padding: 4px 10px;
      }
    }
  </style>
</head>
<body>

  <div id="viewer">
    <div class="wrapper">
      
      <!-- Top Bar -->
      <div class="topbar">
        <div class="brand-group">
          ${designerLogo ? `<img src="${designerLogo}" alt="Logo" class="brand-logo" />` : ''}
          <div class="title-group">
            <div class="title">${safeTitle}</div>
            ${safeSubtitle ? `<div class="subtitle">${safeSubtitle}</div>` : ''}
          </div>
        </div>

        <div class="top-actions">
          ${hasContract ? `
            <button class="btn-contract-header" id="btnContractHeader" title="Baixar Contrato em PDF para Assinatura">
              📄 Baixar Contrato (PDF)
            </button>
          ` : ''}
          <div class="counter-pill" id="counter">1 / ${pages.length}</div>
        </div>
      </div>

      <!-- Book Canvas -->
      <div class="book-area" id="bookArea">
        <div class="edge-zone edge-left" id="edgeLeft" title="Página Anterior">
          <div class="edge-icon">←</div>
        </div>
        
        <div class="book-container" id="bookContainer">
          <div class="book" id="book" title="Toque para virar a página">
            ${pagesHTML}
          </div>
        </div>

        <div class="edge-zone edge-right" id="edgeRight" title="Próxima Página">
          <div class="edge-icon">→</div>
        </div>
      </div>

      <!-- Thumbnails Drawer -->
      <div class="thumbs-drawer" id="thumbsDrawer">
        ${thumbsHTML}
      </div>

      <!-- Controls Dock -->
      <div class="controls-dock">
        <div class="dock-pill">
          <button class="btn-nav" id="btnPrev" aria-label="Página anterior">←</button>
          
          <button class="btn-tool" id="btnThumbs" title="Miniaturas (T)">⊞</button>
          <button class="btn-tool" id="btnZoomIn" title="Aumentar Zoom (+)">+</button>
          <button class="btn-tool" id="btnZoomOut" title="Diminuir Zoom (-)">−</button>
          <button class="btn-tool" id="btnSound" title="Efeito Sonoro (S)">🔊</button>
          <button class="btn-tool" id="btnFullscreen" title="Tela Cheia (F)">⛶</button>
          
          <button class="btn-nav" id="btnNext" aria-label="Próxima página">→</button>
        </div>
      </div>

      <!-- EDITABLE FOOTER -->
      <div class="footer">
        <div class="footer-custom-text">
          ${escapeHTML(footerText)}
        </div>
        ${showContactButtons ? `
          <div class="footer-contacts">
            ${designerWhatsapp ? `
              <a href="https://wa.me/${designerWhatsapp}" target="_blank" rel="noopener noreferrer" class="footer-chip footer-chip-wa">
                WhatsApp: ${escapeHTML(designerPhone || designerWhatsapp)}
              </a>
              <span>•</span>
            ` : ''}
            ${designerEmail ? `
              <a href="mailto:${escapeHTML(designerEmail)}" class="footer-chip">
                ${escapeHTML(designerEmail)}
              </a>
            ` : ''}
            ${designerWebsite ? `
              <span>•</span>
              <a href="${escapeHTML(designerWebsite)}" target="_blank" rel="noopener noreferrer" class="footer-chip">
                Website
              </a>
            ` : ''}
            ${hasContract ? `
              <span>•</span>
              <span class="contract-badge-link" id="linkContractFooter">📄 Contrato Anexo</span>
            ` : ''}
          </div>
        ` : ''}
      </div>

    </div>
  </div>

  <!-- Security Overlay -->
  <div id="securityOverlay">
    <div class="security-card">
      <div class="security-badge">🔒</div>
      <h2>Visualização Protegida</h2>
      <p>Esta proposta comercial contém informações estratégicas confidenciais. Toque no botão abaixo para retomar a apresentação interativa.</p>
      <button class="security-resume-btn" id="btnResumeSecurity">Continuar Apresentação</button>
    </div>
  </div>

  <script>
    const totalPages = ${pages.length};
    const pages = Array.from(document.querySelectorAll('.page'));
    let current = 0;
    let zoomLevel = 1.0;
    let soundEnabled = ${config.soundEnabled ? 'true' : 'false'};
    const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || ('ontouchstart' in window);

    // Attached Contract Data (Embedded Base64)
    ${hasContract ? `
    const attachedContractData = ${JSON.stringify(config.contract?.dataUrl || '')};
    const attachedContractFileName = ${JSON.stringify(contractFileName)};

    function downloadAttachedContract() {
      if (!attachedContractData) return;
      try {
        const link = document.createElement('a');
        link.href = attachedContractData;
        link.download = attachedContractFileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err) {
        window.open(attachedContractData, '_blank');
      }
    }
    ` : `
    function downloadAttachedContract() {}
    `}

    // Procedural Web Audio for realistic paper page flip
    let audioCtx = null;
    function playFlipSound() {
      if (!soundEnabled) return;
      try {
        if (!audioCtx) {
          const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
          if (AudioCtxClass) {
            audioCtx = new AudioCtxClass();
          }
        }
        if (audioCtx && audioCtx.state === 'suspended') {
          audioCtx.resume().catch(function() {});
        }
        if (!audioCtx) return;

        const bufferSize = Math.floor(audioCtx.sampleRate * 0.16);
        if (bufferSize <= 0) return;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          const t = i / bufferSize;
          data[i] = (Math.random() * 2 - 1) * Math.sin(t * Math.PI) * Math.exp(-t * 3.5);
        }
        const src = audioCtx.createBufferSource();
        src.buffer = buffer;
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'bandpass';
        const now = audioCtx.currentTime || 0;
        filter.frequency.setValueAtTime(1000, now);
        filter.Q.setValueAtTime(1.8, now);
        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0.28, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.16);
        src.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtx.destination);
        src.start(now);
      } catch (err) {
        // Audio error never blocks page turning
      }
    }

    function showPage(index) {
      if (index < 0 || index >= totalPages) return;
      current = index;

      pages.forEach(function(page, i) {
        if (i < current) {
          // Turned page: rotated -180deg, hidden from view, non-blocking
          page.style.transform = 'rotateY(-180deg)';
          page.style.webkitTransform = 'rotateY(-180deg)';
          page.style.zIndex = i;
          page.style.opacity = '0';
          page.style.pointerEvents = 'none';
          page.style.boxShadow = 'none';
        } else if (i === current) {
          // Active page: upright, top zIndex, fully visible and clickable
          page.style.transform = 'rotateY(0deg)';
          page.style.webkitTransform = 'rotateY(0deg)';
          page.style.zIndex = totalPages + 10;
          page.style.opacity = '1';
          page.style.pointerEvents = 'auto';
          page.style.boxShadow = '0 16px 40px rgba(0, 0, 0, 0.6), 0 1px 3px rgba(0, 0, 0, 0.3)';
        } else {
          // Upcoming pages: queued behind current page
          page.style.transform = 'rotateY(0deg)';
          page.style.webkitTransform = 'rotateY(0deg)';
          page.style.zIndex = totalPages - i;
          page.style.opacity = (i === current + 1) ? '1' : '0.2';
          page.style.pointerEvents = 'none';
          page.style.boxShadow = 'none';
        }
      });

      const counter = document.getElementById('counter');
      if (counter) {
        counter.textContent = (current + 1) + ' / ' + totalPages;
      }

      const prevBtn = document.getElementById('btnPrev');
      if (prevBtn) prevBtn.disabled = (current === 0);

      const nextBtn = document.getElementById('btnNext');
      if (nextBtn) nextBtn.disabled = (current === totalPages - 1);

      const edgePrev = document.getElementById('edgeLeft');
      if (edgePrev) edgePrev.style.pointerEvents = (current === 0) ? 'none' : 'auto';

      const edgeNext = document.getElementById('edgeRight');
      if (edgeNext) edgeNext.style.pointerEvents = (current === totalPages - 1) ? 'none' : 'auto';

      // Update thumbnail active styles
      const thumbBtns = document.querySelectorAll('.thumb-btn');
      thumbBtns.forEach(function(btn, idx) {
        btn.classList.toggle('active', idx === current);
      });
    }

    function nextPage() {
      if (current < totalPages - 1) {
        showPage(current + 1);
        playFlipSound();
      }
    }

    function previousPage() {
      if (current > 0) {
        showPage(current - 1);
        playFlipSound();
      }
    }

    function goToPage(index) {
      showPage(index);
      playFlipSound();
      const drawer = document.getElementById('thumbsDrawer');
      const btn = document.getElementById('btnThumbs');
      if (drawer) drawer.classList.remove('open');
      if (btn) btn.classList.remove('active');
    }

    function toggleThumbs() {
      const drawer = document.getElementById('thumbsDrawer');
      const btn = document.getElementById('btnThumbs');
      if (drawer) drawer.classList.toggle('open');
      if (btn) btn.classList.toggle('active');
    }

    function zoomIn() {
      zoomLevel = Math.min(zoomLevel + 0.2, 1.8);
      applyZoom();
    }

    function zoomOut() {
      zoomLevel = Math.max(zoomLevel - 0.2, 0.7);
      applyZoom();
    }

    function applyZoom() {
      const container = document.getElementById('bookContainer');
      if (container) {
        container.style.transform = 'scale(' + zoomLevel + ')';
        container.style.webkitTransform = 'scale(' + zoomLevel + ')';
      }
    }

    function toggleSound() {
      soundEnabled = !soundEnabled;
      const btn = document.getElementById('btnSound');
      if (btn) {
        btn.textContent = soundEnabled ? '🔊' : '🔇';
        btn.classList.toggle('active', soundEnabled);
      }
    }

    function toggleFullscreen() {
      try {
        if (!document.fullscreenElement && !document.webkitFullscreenElement) {
          if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(function() {});
          } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen();
          }
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen().catch(function() {});
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
          }
        }
      } catch (e) {}
    }

    function dismissSecurityOverlay() {
      const overlay = document.getElementById('securityOverlay');
      if (overlay) overlay.classList.remove('active');
    }

    // Helper: binds both click and touchend with debounce for immediate response
    function bindAction(elementId, actionFn) {
      const el = document.getElementById(elementId);
      if (!el) return;
      let lastTrigger = 0;
      const handler = function(e) {
        if (e) {
          e.stopPropagation();
        }
        const now = Date.now();
        if (now - lastTrigger < 250) return;
        lastTrigger = now;
        actionFn();
      };
      el.addEventListener('click', handler);
      el.addEventListener('touchend', handler);
    }

    // Bind controls
    bindAction('btnPrev', previousPage);
    bindAction('btnNext', nextPage);
    bindAction('edgeLeft', previousPage);
    bindAction('edgeRight', nextPage);
    bindAction('btnThumbs', toggleThumbs);
    bindAction('btnZoomIn', zoomIn);
    bindAction('btnZoomOut', zoomOut);
    bindAction('btnSound', toggleSound);
    bindAction('btnFullscreen', toggleFullscreen);
    bindAction('btnResumeSecurity', dismissSecurityOverlay);

    // Contract download bindings
    bindAction('btnContractHeader', downloadAttachedContract);
    bindAction('linkContractFooter', downloadAttachedContract);

    // Tap on book: right half advances, left half goes back
    const bookEl = document.getElementById('book');
    if (bookEl) {
      let lastBookTap = 0;
      const handleBookTap = function(e) {
        const drawer = document.getElementById('thumbsDrawer');
        if (drawer && drawer.classList.contains('open')) return;
        const now = Date.now();
        if (now - lastBookTap < 250) return;
        lastBookTap = now;

        let clientX = e.clientX;
        if (clientX === undefined && e.changedTouches && e.changedTouches[0]) {
          clientX = e.changedTouches[0].clientX;
        }
        if (clientX === undefined) return;

        const rect = bookEl.getBoundingClientRect();
        const relX = clientX - rect.left;
        if (relX > rect.width * 0.52) {
          nextPage();
        } else if (relX < rect.width * 0.48) {
          previousPage();
        }
      };
      bookEl.addEventListener('click', handleBookTap);
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        nextPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        previousPage();
      } else if (e.key.toLowerCase() === 't') {
        toggleThumbs();
      } else if (e.key.toLowerCase() === 'f') {
        toggleFullscreen();
      } else if (e.key === '+' || e.key === '=') {
        zoomIn();
      } else if (e.key === '-') {
        zoomOut();
      } else if (e.key.toLowerCase() === 's') {
        toggleSound();
      }
      ${config.security?.blockPrintScreen ? `
      // Block PrintScreen / Copy
      if (e.key === 'PrintScreen' || (e.ctrlKey && (e.key === 'p' || e.key === 's' || e.key === 'c' || e.key === 'u'))) {
        e.preventDefault();
        try {
          navigator.clipboard.writeText('');
        } catch (err) {}
      }
      ` : ''}
    });

    // Touch swipe navigation for mobile (iOS & Android)
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;
    document.addEventListener('touchstart', function(e) {
      if (e.touches && e.touches[0]) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchStartTime = Date.now();
      }
    }, { passive: true });

    document.addEventListener('touchend', function(e) {
      if (e.changedTouches && e.changedTouches[0]) {
        const diffX = e.changedTouches[0].clientX - touchStartX;
        const diffY = e.changedTouches[0].clientY - touchStartY;
        const elapsed = Date.now() - touchStartTime;
        if (Math.abs(diffX) > 35 && Math.abs(diffX) > Math.abs(diffY) * 1.2 && elapsed < 800) {
          if (diffX < 0) {
            nextPage();
          } else {
            previousPage();
          }
        }
      }
    }, { passive: true });

    ${config.security?.blockRightClick ? `
    // Disable right click context menu
    document.addEventListener('contextmenu', function(e) {
      e.preventDefault();
      return false;
    });
    ` : ''}

    ${config.security?.preventDrag ? `
    // Prevent dragging images
    document.addEventListener('dragstart', function(e) {
      e.preventDefault();
      return false;
    });
    ` : ''}

    ${config.security?.blurOnFocusLost ? `
    // Security blur overlay on focus lost
    document.addEventListener('visibilitychange', function() {
      const overlay = document.getElementById('securityOverlay');
      if (overlay) {
        if (document.hidden) {
          overlay.classList.add('active');
        } else {
          overlay.classList.remove('active');
        }
      }
    });

    if (!isMobileDevice) {
      window.addEventListener('blur', function() {
        const overlay = document.getElementById('securityOverlay');
        if (overlay) overlay.classList.add('active');
      });

      window.addEventListener('focus', function() {
        const overlay = document.getElementById('securityOverlay');
        if (overlay) overlay.classList.remove('active');
      });
    }
    ` : ''}

    // Initialize first page
    showPage(0);
  </script>
</body>
</html>`;
}

function escapeHTML(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
