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
export type OfferStatus = 'Entwurf' | 'In Bearbeitung' | 'Versendet' | 'Nachfassen' | 'Gewonnen' | 'Verloren' | 'Storniert';
export type OfferItemType = 'Terrassendach' | 'Wintergarten' | 'Lamellendach' | 'Carport' | 'Pergola' | 'Aufdachmarkise' | 'Unterdachmarkise' | 'ZIP' | 'Glasschiebeelemente' | 'LED' | 'Montage' | 'Fundament' | 'Sonderposition' | 'Freitext';
export interface OfferItem { id: string; type: OfferItemType; name: string; description: string; quantity: number; unit: string; purchasePrice: number; salesPrice: number; discount: number; vatRate: number; totalNet: number; totalGross: number; marginAmount: number; marginPercent: number; }
export interface OfferCalculation { net: number; gross: number; vat: number; discount: number; material: number; assembly: number; delivery: number; other: number; contributionMargin: number; marginAmount: number; marginPercent: number; projectProfit: number; }
export interface OfferStatusHistory { id: string; date: ISODateString; from: OfferStatus | ''; to: OfferStatus; user: string; note: string; }
export interface Measurement { id: string; date: ISODateString; responsible?: string; widthMm?: number; depthMm?: number; heightMm?: number; notes?: string; attachments?: string[]; }
export interface Offer { id: string; customer: string; title: string; net: number; status: OfferStatus; date: ISODateString; offerNumber: string; version: number; projectId?: string; projectNumber?: string; gross: number; editor: string; items: OfferItem[]; calculation: OfferCalculation; statusHistory: OfferStatusHistory[]; }
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
export interface StateLikeSupplier { id:string; companyName:string; name?:string; contact?:string; category?:string; contactPerson:string; address:string; country:string; email:string; phone:string; website:string; supplierCustomerNumber:string; paymentTerms:string; usualDeliveryTime:string; categories:string[]; notes:string; active:boolean; createdAt:ISODateString; updatedAt:ISODateString; }
export type PurchaseOrderStatus='Entwurf'|'Angefragt'|'Bestellt'|'Teilweise geliefert'|'Geliefert'|'Storniert';
export type PurchasePaymentStatus='Offen'|'Teilweise bezahlt'|'Bezahlt';
export interface PurchaseOrderItem { id:string; name:string; description:string; quantity:number; unit:string; unitPriceNet:number; discount:number; vatRate:number; netTotal:number; vatTotal:number; grossTotal:number; }
export interface PurchaseOrder { id:string; orderNumber:string; supplierId:string; supplierName:string; projectId?:string; projectNumber?:string; orderDate:ISODateString; expectedDeliveryDate?:ISODateString; actualDeliveryDate?:ISODateString; status:PurchaseOrderStatus; items:PurchaseOrderItem[]; netTotal:number; vatTotal:number; grossTotal:number; deliveryAddress:string; note:string; paymentStatus:PurchasePaymentStatus; documentReferences:string[]; createdAt:ISODateString; updatedAt:ISODateString; }
export type DeliveryStatus='Erwartet'|'Teilweise geliefert'|'Vollständig geliefert'|'Beschädigt'|'Reklamation offen';
export interface DeliveryItem { id:string; orderItemId:string; name:string; deliveredQuantity:number; damagedQuantity:number; missingQuantity:number; unit:string; }
export interface Delivery { id:string; purchaseOrderId:string; projectId?:string; deliveryNoteNumber:string; deliveryDate:ISODateString; items:DeliveryItem[]; status:DeliveryStatus; notes:string; documentReferences:string[]; }

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
export const PROJECT_PRIORITIES: ProjectPriority[] = ['Hoch','Mittel','Niedrig'];
