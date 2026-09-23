import { jsPDF } from 'jspdf';
import { ProposalConfig, ProposalPage } from '../types.ts';

// Helper to calculate image dimensions preserving aspect ratio
function calculateAspectRatioFit(
  srcWidth: number,
  srcHeight: number,
  maxWidth: number,
  maxHeight: number
) {
  const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
  return {
    width: srcWidth * ratio,
    height: srcHeight * ratio,
  };
}

// Helper to load an image element to get true dimensions
function loadImageDimensions(dataUrl: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth || 1200, height: img.naturalHeight || 800 });
    };
    img.onerror = () => {
      resolve({ width: 1200, height: 800 });
    };
    img.src = dataUrl;
  });
}

export async function exportProposalAsPDF(
  pages: ProposalPage[],
  config: ProposalConfig,
  onProgress?: (percent: number, stepText: string) => void
): Promise<void> {
  // A4 dimensions in mm: 210 x 297 (portrait) or 297 x 210 (landscape)
  // Most design presentations are landscape (16:9 or A4 landscape)
  const isLandscape = true;
  const doc = new jsPDF({
    orientation: isLandscape ? 'landscape' : 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = isLandscape ? 297 : 210;
  const pageHeight = isLandscape ? 210 : 297;

  onProgress?.(10, 'Construindo folha de rosto da proposta...');

  // --- PAGE 1: Folha de Rosto / Sumário Profissional ---
  // Background
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Decorative header band
  doc.setFillColor(245, 158, 11); // amber-500
  doc.rect(0, 0, 8, pageHeight, 'F');

  // Top Badge
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(245, 158, 11);
  doc.text('DOCUMENTO OFICIAL • PROPOSTA COMERCIAL INTERATIVA', 22, 22);

  // Project Title
  doc.setFontSize(26);
  doc.setTextColor(255, 255, 255);
  const title = config.project.title || config.title || 'Proposta Comercial';
  const splitTitle = doc.splitTextToSize(title, 180);
  doc.text(splitTitle, 22, 35);

  const titleBottomY = 35 + (splitTitle.length * 9);

  // Subtitle
  const subtitle = config.project.subtitle || config.subtitle || 'Apresentação de Projeto & Design';
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(13);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text(subtitle, 22, titleBottomY);

  // Designer Logo or Photo (if available)
  let photoPlaced = false;
  if (config.designer.photoOrLogoUrl) {
    try {
      const imgDim = await loadImageDimensions(config.designer.photoOrLogoUrl);
      const fit = calculateAspectRatioFit(imgDim.width, imgDim.height, 42, 42);
      doc.addImage(
        config.designer.photoOrLogoUrl,
        'PNG',
        pageWidth - 65,
        18,
        fit.width,
        fit.height
      );
      photoPlaced = true;
    } catch {
      // Ignore if image fails
    }
  }

  // Two Column Cards: Left = Client & Project Meta; Right = Designer / Studio Identity
  const cardY = Math.max(titleBottomY + 12, 60);

  // Card 1: Informações do Cliente (Left)
  doc.setFillColor(30, 41, 59); // slate-800
  doc.roundedRect(22, cardY, 120, 92, 3, 3, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(245, 158, 11);
  doc.text('DADOS DO CLIENTE & PROJETO', 28, cardY + 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text('Cliente / Empresa:', 28, cardY + 20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text(config.client.companyName || config.client.clientName || 'Cliente Confidencial', 28, cardY + 26);

  if (config.client.contactPerson) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(148, 163, 184);
    doc.text('Responsável:', 28, cardY + 34);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(226, 232, 240);
    doc.text(config.client.contactPerson, 28, cardY + 39);
  }

  if (config.client.email || config.client.phone) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(148, 163, 184);
    doc.text('Contato:', 28, cardY + 47);
    doc.setTextColor(226, 232, 240);
    const contacts = [config.client.email, config.client.phone].filter(Boolean).join(' • ');
    doc.text(contacts, 28, cardY + 52);
  }

  // Meta row: Data, Validade, Investimento
  doc.setDrawColor(51, 65, 85);
  doc.line(28, cardY + 60, 134, cardY + 60);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Data de Emissão:', 28, cardY + 68);
  doc.text('Validade:', 72, cardY + 68);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text(config.project.date || new Date().toLocaleDateString('pt-BR'), 28, cardY + 74);
  doc.text(config.project.validity || '15 dias', 72, cardY + 74);

  if (config.project.investmentValue) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('Investimento Estimado:', 28, cardY + 82);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(245, 158, 11);
    doc.text(config.project.investmentValue, 28, cardY + 89);
  }

  // Card 2: Identidade do Designer / Estúdio (Right)
  const rightCardX = 150;
  const rightCardWidth = pageWidth - rightCardX - 22;
  doc.setFillColor(30, 41, 59); // slate-800
  doc.roundedRect(rightCardX, cardY, rightCardWidth, 92, 3, 3, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(245, 158, 11);
  doc.text('ELABORADO POR', rightCardX + 6, cardY + 10);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  const designerName = config.designer.companyOrStudio || config.designer.name || 'Studio Criativo';
  doc.text(designerName, rightCardX + 6, cardY + 22);

  if (config.designer.role) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.text(config.designer.role, rightCardX + 6, cardY + 29);
  }

  // Contact list
  let dContactY = cardY + 40;
  const dContacts = [
    { label: 'E-mail:', val: config.designer.email },
    { label: 'WhatsApp:', val: config.designer.whatsapp },
    { label: 'Telefone:', val: config.designer.phone },
    { label: 'Website / Portfólio:', val: config.designer.website },
    { label: 'Localização:', val: config.designer.location },
  ].filter(c => Boolean(c.val));

  dContacts.forEach(item => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(item.label, rightCardX + 6, dContactY);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(226, 232, 240);
    doc.text(item.val, rightCardX + 38, dContactY);
    dContactY += 7.5;
  });

  // Attached Contract badge if exists
  if (config.contract) {
    doc.setFillColor(16, 185, 129, 0.2); // emerald
    doc.roundedRect(22, cardY + 98, pageWidth - 44, 14, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(52, 211, 153);
    doc.text(`CONTRATO ANEXO: ${config.contract.fileName} (Disponível para download e assinatura do cliente)`, 28, cardY + 107);
  }

  // Cover Footer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  const footerText = config.footer.customText || `© ${new Date().getFullYear()} ${designerName}. Todos os direitos reservados. Proposta confidencial.`;
  doc.text(footerText, pageWidth / 2, pageHeight - 12, { align: 'center' });

  // --- PAGES 2..N: Slides/Lâminas de Design ---
  const totalSlides = pages.length;
  for (let i = 0; i < totalSlides; i++) {
    const page = pages[i];
    const progressPercent = 20 + Math.round(((i + 1) / totalSlides) * 75);
    onProgress?.(progressPercent, `Processando lâmina ${i + 1} de ${totalSlides}...`);

    doc.addPage([pageWidth, pageHeight], isLandscape ? 'landscape' : 'portrait');

    // Slide background
    doc.setFillColor(17, 24, 39); // slate-900
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Slide Image
    try {
      const dim = await loadImageDimensions(page.dataUrl);
      // Margin bounds: top 10mm, bottom 16mm, left 10mm, right 10mm
      const maxW = pageWidth - 20;
      const maxH = pageHeight - 24;
      const fit = calculateAspectRatioFit(dim.width, dim.height, maxW, maxH);

      const posX = 10 + (maxW - fit.width) / 2;
      const posY = 10 + (maxH - fit.height) / 2;

      // Draw subtle shadow frame
      doc.setFillColor(0, 0, 0);
      doc.roundedRect(posX + 1, posY + 1, fit.width, fit.height, 1.5, 1.5, 'F');

      // Add image
      doc.addImage(page.dataUrl, 'JPEG', posX, posY, fit.width, fit.height, undefined, 'FAST');
    } catch {
      // Fallback text if image load error
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255);
      doc.text(`Página ${i + 1}: ${page.name}`, pageWidth / 2, pageHeight / 2, { align: 'center' });
    }

    // Slide footer bar
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    const footerLeft = `${designerName} • ${title}`;
    doc.text(footerLeft, 12, pageHeight - 6);

    const pageIndicator = `Lâmina ${i + 1} de ${totalSlides}`;
    doc.text(pageIndicator, pageWidth - 12, pageHeight - 6, { align: 'right' });
  }

  onProgress?.(98, 'Finalizando download do arquivo PDF...');

  // Save the PDF
  const filename = `${(config.project.title || config.title || 'Proposta_Comercial')
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '_')
    .replace(/_+/g, '_')}_Apresentacao.pdf`;

  doc.save(filename);
}
