import Home from '../Component/Pages/Home';
import Admin from '../Component/Pages/Admin';
import { TRouter } from '../Component/TSType';

export const publicRoutes: TRouter[] = [{ path: '/', component: Home }];

export const privateRoutes: TRouter[] = [{ path: '/admin', component: Admin }];
