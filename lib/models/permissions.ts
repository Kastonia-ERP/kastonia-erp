import type {Permission,Project,SiteReport,User,PurchaseListItem,WorkTimeEntry} from '../types';

export const ADMIN_PERMISSIONS: Permission[] = ['projects:read','projects:write','projects:delete','offers:read','offers:write','purchasing:manage','deliveries:manage','users:manage','siteReports:create','siteReports:read','siteReports:write','siteReports:close','images:manage','analytics:read','finance:read','masterData:write','operations:manage','workTime:write','workTime:approve','purchaseList:manage','tools:manage','vehicles:manage'];
export const EMPLOYEE_PERMISSIONS: Permission[] = ['projects:read','siteReports:create','siteReports:read','workTime:write'];
export function permissionsForUser(user:User):Permission[]{return user.role==='ADMIN'?ADMIN_PERMISSIONS:EMPLOYEE_PERMISSIONS;}
export function hasPermission(user:User,permission:Permission):boolean{return permissionsForUser(user).includes(permission);}
export function canAccessProject(user:User,project:Project):boolean{return user.role==='ADMIN'||user.assignedProjectIds.includes(project.id)||project.assignedEmployeeIds?.includes(user.id)===true;}
export function assertPermission(user:User,permission:Permission):void{if(!hasPermission(user,permission))throw new Error(`Zugriff verweigert: ${permission}`);}
export function assertProjectAccess(user:User,project:Project):void{if(!canAccessProject(user,project))throw new Error('Zugriff verweigert: Projekt nicht zugewiesen');}
export function canReadOffer(user:User):boolean{return hasPermission(user,'offers:read');}
export function canReadFinance(user:User):boolean{return hasPermission(user,'finance:read');}
export function canManageSiteReport(user:User,report:SiteReport):boolean{return user.role==='ADMIN'||report.createdBy===user.id;}
export function sanitizeProjectForUser(user:User,project:Project):Project{assertProjectAccess(user,project);if(user.role==='ADMIN')return project;return {...project,offers:[],orderConfirmations:[],supplierOrders:[],invoices:[],payments:[],financials:{...project.financials,expectedRevenueNet:0,expectedRevenueGross:0,expectedCostNet:0,expectedCostGross:0,customerPaid:0,supplierPaid:0},value:0};}

export function canEditWorkTime(user:User,entry:WorkTimeEntry):boolean{return user.role==='ADMIN'||(entry.employeeId===user.id&&entry.status!=='Freigegeben');}
export function sanitizePurchaseListItemForUser(user:User,item:PurchaseListItem):PurchaseListItem{return user.role==='ADMIN'?item:{...item,estimatedPrice:undefined};}
export function canApprovePurchase(user:User):boolean{return hasPermission(user,'purchaseList:manage');}
