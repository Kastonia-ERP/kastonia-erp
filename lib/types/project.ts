export type ISODateString = string;
export type CurrencyCode = 'EUR';

export type ProjectStatus =
  | 'Neue Anfrage' | 'Kontaktaufnahme' | 'Termin vereinbart' | 'Aufmaß'
  | 'Angebot in Vorbereitung' | 'Angebot versendet' | 'Nachfassen'
  | 'Auftrag erhalten' | 'Auftragsbestätigung' | 'Bestellung Lieferant'
  | 'Material ausstehend' | 'Montage geplant' | 'Montage läuft' | 'Nacharbeit'
  | 'Abnahme' | 'Rechnung gestellt' | 'Bezahlt' | 'Abgeschlossen'
  | 'Storniert' | 'Archiviert';

export type ProjectPhase = 'Lead' | 'Verkauf' | 'Planung' | 'Einkauf' | 'Montage' | 'Abrechnung' | 'Abschluss';
export type LeadSource = 'OBI' | 'Website' | 'Empfehlung' | 'Bestandskunde' | 'Ausstellung' | 'Telefon' | 'E-Mail' | 'Sonstiges';
export type ProjectPriority = 'Hoch' | 'Mittel' | 'Niedrig';
export type ProjectType = 'Terrassendach' | 'Markise' | 'Lamellendach' | 'Carport' | 'Sonnenschutz' | 'Service' | 'Sonstiges';

export interface Address { street: string; postalCode: string; city: string; country: string; additionalInfo?: string; }
export interface ContactPerson { id: string; name: string; role?: string; email?: string; phone?: string; mobile?: string; notes?: string; }
export interface Customer { id: string; name: string; email: string; phone: string; city: string; status: string; customerNumber?: string; address?: Address; contactPersons?: ContactPerson[]; }
export interface Measurement { id: string; date: ISODateString; responsible?: string; widthMm?: number; depthMm?: number; heightMm?: number; notes?: string; attachments?: string[]; }
export interface Offer { id: string; customer: string; title: string; net: number; status: string; date: ISODateString; offerNumber?: string; projectId?: string; gross?: number; }
export interface OrderConfirmation { id: string; number: string; date: ISODateString; net: number; gross: number; status: 'Entwurf' | 'Versendet' | 'Bestätigt' | 'Storniert'; }
export interface SupplierOrder { id: string; supplierId?: string; supplierName: string; orderNumber?: string; date: ISODateString; expectedDelivery?: ISODateString; net: number; gross: number; paidAmount: number; status: 'Entwurf' | 'Bestellt' | 'Bestätigt' | 'Geliefert' | 'Bezahlt' | 'Storniert'; }
export interface Installation { id: string; plannedStart?: ISODateString; plannedEnd?: ISODateString; actualStart?: ISODateString; actualEnd?: ISODateString; team?: string[]; notes?: string; status: 'Nicht geplant' | 'Geplant' | 'Läuft' | 'Nacharbeit' | 'Abgeschlossen'; }
export interface Payment { id: string; date: ISODateString; amount: number; direction: 'Kunde' | 'Lieferant'; reference?: string; note?: string; }
export interface Invoice { id: string; direction: 'Ausgang' | 'Eingang'; number: string; partner: string; project: string; date: ISODateString; due: ISODateString; net: number; vatRate: number; status: string; projectId?: string; gross?: number; paidAmount?: number; payments?: Payment[]; }
export interface Document { id: string; name: string; type: 'Foto' | 'Angebot' | 'Auftrag' | 'Rechnung' | 'Plan' | 'Sonstiges'; url?: string; createdAt: ISODateString; }
export interface ProjectNote { id: string; createdAt: ISODateString; author?: string; text: string; }
export interface CommunicationEntry { id: string; date: ISODateString; channel: 'Telefon' | 'E-Mail' | 'Vor Ort' | 'WhatsApp' | 'Brief' | 'Sonstiges'; direction: 'Eingehend' | 'Ausgehend'; summary: string; contactPersonId?: string; }
export interface Task { id: string; title: string; due: ISODateString; priority: ProjectPriority; done: boolean; projectId?: string; assignedTo?: string; }
export interface Appointment { id: string; title: string; date: ISODateString; type: string; projectId?: string; }
export interface ProjectFinancials { currency: CurrencyCode; expectedRevenueNet: number; expectedRevenueGross: number; expectedCostNet: number; expectedCostGross: number; customerPaid: number; supplierPaid: number; }

export interface Project {
  id: string; projectNumber: string; title: string; customer: string; customerDetails?: Customer;
  contactPersons: ContactPerson[]; projectAddress: Address; billingAddress: Address; leadSource: LeadSource; isObiLead: boolean;
  projectType: ProjectType; status: ProjectStatus; phase: ProjectPhase; priority: ProjectPriority; responsible: string;
  createdAt: ISODateString; updatedAt: ISODateString; measurements: Measurement[]; offers: Offer[];
  orderConfirmations: OrderConfirmation[]; supplierOrders: SupplierOrder[]; installations: Installation[];
  invoices: Invoice[]; payments: Payment[]; documents: Document[]; notes: ProjectNote[]; communication: CommunicationEntry[];
  tasks: Task[]; appointments: Appointment[]; financials: ProjectFinancials; tags: string[]; archived: boolean;
  value: number; montage: string;
}

export const PROJECT_STATUSES: ProjectStatus[] = ['Neue Anfrage','Kontaktaufnahme','Termin vereinbart','Aufmaß','Angebot in Vorbereitung','Angebot versendet','Nachfassen','Auftrag erhalten','Auftragsbestätigung','Bestellung Lieferant','Material ausstehend','Montage geplant','Montage läuft','Nacharbeit','Abnahme','Rechnung gestellt','Bezahlt','Abgeschlossen','Storniert','Archiviert'];
export const PROJECT_PHASES: ProjectPhase[] = ['Lead','Verkauf','Planung','Einkauf','Montage','Abrechnung','Abschluss'];
