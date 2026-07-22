import type {UserRole} from '../types';
export type CloudUserProfile={id:string;name:string;email:string;role:UserRole;employeeId?:string;active:boolean;createdAt:string;updatedAt:string;lastSignInAt?:string};
export const ADMIN_NAMES=['Gökhan Karayel','Seda Karayel'];
export function isAdminProfile(p:Pick<CloudUserProfile,'role'|'active'>|null|undefined){return !!p&&p.active&&p.role==='ADMIN'}
export function isEmployeeProfile(p:Pick<CloudUserProfile,'role'|'active'>|null|undefined){return !!p&&p.active&&p.role==='MITARBEITER'}
export function canUseApplication(p:Pick<CloudUserProfile,'active'>|null|undefined){return !!p&&p.active}
export function redactEmployeeProject(project:any){const {financials,value,offers,invoices,payments,supplierOrders,orderConfirmations,...safe}=project;return safe;}
