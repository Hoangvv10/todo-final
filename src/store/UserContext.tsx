import { createContext, useEffect, useState } from 'react';

interface UserContextType {
    userId: number;
    setUserId: React.Dispatch<React.SetStateAction<number>>;
}

const UserContext = createContext<UserContextType>({
    userId: 0,
    setUserId: () => {},
});

interface Props {
    children: React.ReactNode;
}

const UserProvider: React.FC<Props> = ({ children }) => {
    const [userId, setUserId] = useState(0);

    useEffect(() => {
        setUserId(Number(localStorage.getItem('userId')));
    }, []);

    const userContextValue = { userId, setUserId };

    return <UserContext.Provider value={userContextValue}>{children}</UserContext.Provider>;
};

export { UserProvider, UserContext };
