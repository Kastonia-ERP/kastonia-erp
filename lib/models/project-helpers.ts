import { Project, ProjectFinancials, ProjectStatus } from '../types';

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
