import './globals.css';
import {StoreProvider} from '../lib/store';
export const metadata={title:'KASTONIA ERP',description:'KASTONIA ERP Suite'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="de"><body><StoreProvider>{children}</StoreProvider></body></html>}
