import Home from '@/Pages/Home';
import Admin from '@/Pages/Admin';
import { TRouter } from '@/TSType';

export const publicRoutes: TRouter[] = [{ path: '/', component: Home }];

export const privateRoutes: TRouter[] = [{ path: '/admin', component: Admin }];
