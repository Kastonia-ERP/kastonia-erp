import type {Project,PurchaseListItem,SiteMessage,SiteReportCategory} from '../types';

export const employeeIdForUser=(userId:string,name:string,employees:{id:string;name:string}[])=>employees.find(employee=>employee.id===userId||employee.name===name)?.id||(userId==='U-MA-01'?employees.find(employee=>employee.id==='EMP-003')?.id:userId)||userId;
export const needsPurchase=(category:SiteReportCategory)=>category==='Material nachbestellen'||category==='Werkzeug benötigt';

export function createProcurementReport(input:{category:SiteReportCategory;title:string;project:Project;employeeId:string;now:string}){
  const id=`SM-${Date.parse(input.now) || Date.now()}`;
  const site=`${input.project.projectAddress.street}, ${input.project.projectAddress.city}`;
  const messageCategory=input.category==='Material nachbestellen'?'Material fehlt':'Werkzeug fehlt';
  const purchaseCategory=input.category==='Material nachbestellen'?'Projektmaterial':'Werkzeug';
  const message:SiteMessage={id,projectId:input.project.id,constructionSite:site,createdBy:input.employeeId,category:messageCategory,title:input.title,description:`${input.title} durch ${input.employeeId}`,priority:'Normal',status:'Auf Einkaufsliste',images:[],quantity:1,unit:'Stk.',assignedTo:input.project.responsibleAdminId,purchaseRequired:true,createdAt:input.now,updatedAt:input.now};
  const purchase:PurchaseListItem={id:`EKL-${id}`,source:'Baustellenmeldung',sourceReference:id,projectId:input.project.id,constructionSite:site,category:purchaseCategory,article:input.title,description:message.description,quantity:1,unit:'Stk.',priority:'Normal',possibleSupplier:'',suggestedOrderRoute:'bestehendes Einkaufsmodul',status:'Offen',createdBy:input.employeeId,responsibleAdminId:input.project.responsibleAdminId,note:'Aus Mitarbeiter-Schnellmeldung erzeugt.',images:[],createdAt:input.now,updatedAt:input.now};
  return {message,purchase};
}
