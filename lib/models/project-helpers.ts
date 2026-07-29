import { EmployeeAssignment, Project, ProjectFinancials, ProjectStatus } from '../types';

export const STORAGE_KEY_V09 = 'kastonia-erp-v09';
export const LEGACY_STORAGE_KEY_V07 = 'kastonia-erp-v07';
export const PERSISTENCE_SCHEMA_VERSION = 9;

export function nowIso(): string { return new Date().toISOString(); }
export function createProjectId(prefix = 'P'): string { return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`; }
export function createProjectNumber(date = new Date(), sequence = 1): string { return `PR-${date.getFullYear()}-${String(sequence).padStart(4, '0')}`; }
export function touchProject<T extends { updatedAt?: string }>(entity: T, at = nowIso()): T & { updatedAt: string } { return { ...entity, updatedAt: at }; }
export function changeProjectStatus(project: Project, status: ProjectStatus, at = nowIso()): Project { return { ...project, status, updatedAt: at, archived: status === 'Archiviert' ? true : project.archived }; }
export function calculateProjectMargin(financials: Pick<ProjectFinancials, 'expectedRevenueNet' | 'expectedCostNet'>): number { return roundMoney((financials.expectedRevenueNet || 0) - (financials.expectedCostNet || 0)); }
export function calculateOpenCustomerPayment(financials: Pick<ProjectFinancials, 'expectedRevenueGross' | 'customerPaid'>): number { return Math.max(0, roundMoney((financials.expectedRevenueGross || 0) - (financials.customerPaid || 0))); }
export function calculateOpenSupplierPayment(financials: Pick<ProjectFinancials, 'expectedCostGross' | 'supplierPaid'>): number { return Math.max(0, roundMoney((financials.expectedCostGross || 0) - (financials.supplierPaid || 0))); }
export function roundMoney(value: number): number { return Math.round((value + Number.EPSILON) * 100) / 100; }


export const PROJECT_RECORD_STEPS = ['Neue Anfrage','Kontakt','Termin','Aufmaß','Angebot','Auftrag','Bestellung','Montage','Rechnung','Bezahlt','Abgeschlossen'] as const;
export type ProjectRecordStep = typeof PROJECT_RECORD_STEPS[number];

export function getProjectRecordStep(status: ProjectStatus): ProjectRecordStep {
  const map: Record<ProjectStatus, ProjectRecordStep> = {
    'Neue Anfrage':'Neue Anfrage','Kontaktaufnahme':'Kontakt','Termin vereinbart':'Termin','Aufmaß':'Aufmaß',
    'Angebot in Vorbereitung':'Angebot','Angebot versendet':'Angebot','Nachfassen':'Angebot',
    'Auftrag erhalten':'Auftrag','Auftragsbestätigung':'Auftrag','Bestellung Lieferant':'Bestellung','Material ausstehend':'Bestellung','Material teilweise vorhanden':'Bestellung','Material vollständig vorhanden':'Bestellung',
    'Montage geplant':'Montage','Montage läuft':'Montage','Nacharbeit':'Montage','Abnahme':'Montage',
    'Rechnung gestellt':'Rechnung','Bezahlt':'Bezahlt','Abgeschlossen':'Abgeschlossen','Storniert':'Abgeschlossen','Archiviert':'Abgeschlossen'
  };
  return map[status];
}

export function getProjectRecordStepIndex(status: ProjectStatus): number {
  return PROJECT_RECORD_STEPS.indexOf(getProjectRecordStep(status));
}

export function calculateProjectMarginPercent(financials: Pick<ProjectFinancials, 'expectedRevenueNet' | 'expectedCostNet'>): number {
  const revenue = financials.expectedRevenueNet || 0;
  if (!revenue) return 0;
  return roundMoney((calculateProjectMargin(financials) / revenue) * 100);
}

export function findProjectById(projects: Project[], id: string): Project | undefined { return projects.find(project => project.id === id); }

/** The project record is the single source of truth for direct team membership. */
export function getAssignedEmployeeIds(project: Pick<Project, 'assignedEmployeeIds'>): string[] {
  return Array.from(new Set((project.assignedEmployeeIds || []).filter(Boolean)));
}

export function setAssignedEmployees(project: Project, employeeIds: string[], at = nowIso()): Project {
  return { ...project, assignedEmployeeIds: Array.from(new Set(employeeIds.filter(Boolean))), updatedAt: at };
}

/** Turns persistent project membership into dated planning rows without storing a second list. */
export function projectTeamAssignments(projects: Project[], date: string): EmployeeAssignment[] {
  return projects.flatMap(project => {
    const projectDate = project.montage || project.plannedInstallationDate;
    if (projectDate !== date) return [];
    return getAssignedEmployeeIds(project).map((employeeId, index) => ({
      id: `PROJECT-${project.id}-${employeeId}-${date}`,
      projectId: project.id,
      montageId: project.installations?.[0]?.id || 'DIRECT',
      employeeId,
      date,
      startTime: '08:00',
      plannedEndTime: '16:30',
      teamRole: 'Projektteam',
      teamLead: index === 0,
      note: 'Direkt im Projekt zugeordnet',
    }));
  });
}

export type ProjectBaseUpdate = Pick<Project, 'status' | 'phase' | 'priority' | 'responsible' | 'montage'>;
export function updateProjectBaseData(project: Project, update: ProjectBaseUpdate, at = nowIso()): Project {
  return { ...project, ...update, updatedAt: at, archived: update.status === 'Archiviert' ? true : project.archived };
}
