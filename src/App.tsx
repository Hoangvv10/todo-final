import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { privateRoutes, publicRoutes } from './Routes';
import { Fragment, useContext, useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import DefaultLayout from './Component/Layout/DefaultLayout';
import { UserContext } from './store/UserContext';
import { TRouter } from './Component/TSType';

function App() {
    const { userId } = useContext(UserContext);

    const [routes, setRoutes] = useState<TRouter[]>();

    useEffect(() => {
        userId === 1 ? setRoutes([...publicRoutes, ...privateRoutes]) : setRoutes(publicRoutes);
    }, [userId]);

    return (
        <Router>
            <div>
                <ToastContainer />
                <Routes>
                    {routes?.map((route, index) => {
                        const Layout = DefaultLayout;
                        const Page = route.component;

                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <Layout>
                                        <Page />
                                    </Layout>
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
