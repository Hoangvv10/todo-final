import Home from '../Component/Pages/Home';
import Admin from '../Component/Pages/Admin';

interface router {
    path: string;
    component: React.FC;
    layout?: string;
}

export const publicRoutes: router[] = [
    { path: '/', component: Home },
    { path: '/admin', component: Admin },
];
