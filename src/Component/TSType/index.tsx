export type TTaskItems = {
    id: number;
    title: string;
    category: string;
    status: string;
    content: string;
    userId: number;
    createAt: string;
    updateAt: string;
};

export type Status = 'to do' | 'in progress' | 'completed';

export type Category = 'red' | 'yellow' | 'green';

export type TUser = {
    id?: number;
    userName: string;
    email?: string;
    password: string | undefined;
    createAt?: string;
    updateAt: string;
};

export type TRouter = {
    path: string;
    component: React.FC;
    layout?: string;
};
