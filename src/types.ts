export interface ProposalPage {
  id: string;
  name: string;
  dataUrl: string;
  thumbnail?: string;
  width?: number;
  height?: number;
}

export interface SecurityConfig {
  blurOnFocusLost: boolean;
  blockRightClick: boolean;
  blockCopyAndSave: boolean;
  blockPrintScreen: boolean;
  preventDrag: boolean;
  watermarkText: string;
}

export interface DesignerProfile {
  name: string;
  role: string;
  companyOrStudio: string;
  photoOrLogoUrl: string;
  email: string;
  phone: string;
  whatsapp: string;
  website: string;
  location: string;
}

export interface ClientData {
  companyName: string;
  clientName: string;
  contactPerson: string;
  email: string;
  phone: string;
}

export interface ProjectData {
  title: string;
  subtitle: string;
  date: string;
  validity: string;
  investmentValue: string;
}

export interface FooterConfig {
  customText: string;
  showContactButtons: boolean;
  showDesignerPhoto: boolean;
  disclaimer: string;
}

export interface AttachedContract {
  fileName: string;
  fileSize: number;
  dataUrl: string;
  uploadedAt: string;
}

export interface ProposalConfig {
  title: string;
  subtitle: string;
  backgroundColor: string;
  bookRatio: 'contain' | 'a4-portrait' | 'a4-landscape' | 'screen-16-9';
  designer: DesignerProfile;
  client: ClientData;
  project: ProjectData;
  footer: FooterConfig;
  contract?: AttachedContract | null;
  security: SecurityConfig;
  soundEnabled: boolean;
  // Legacy compatibility for author
  author?: {
    name: string;
    role: string;
    phone: string;
    email: string;
    whatsapp: string;
  };
}
