import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { privateRoutes, publicRoutes } from './Routes';
import { useContext, useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import DefaultLayout from './Component/Layout/DefaultLayout';
import { UserContext } from './store/UserContext';
import { TRouter } from './TSType';
import { ADMIN_ID } from './Component/StaticContants';

function App() {
    const { userId } = useContext(UserContext);

    const [routes, setRoutes] = useState<TRouter[]>();

    useEffect(() => {
        userId === ADMIN_ID ? setRoutes([...publicRoutes, ...privateRoutes]) : setRoutes(publicRoutes);
    }, [userId]);

    return (
        <Router>
            <div>
                <ToastContainer />
                <Routes>
                    {routes?.map((route, index) => {
                        const Page = route.component;

                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <DefaultLayout>
                                        <Page />
                                    </DefaultLayout>
                                }
                            />
                        );
                    })}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
