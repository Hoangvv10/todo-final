import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { publicRoutes } from './Routes';
import { Fragment } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import GlobalStyle from './Component/GlobalStyle';
import DefaultLayout from './Component/Layout/DefaultLayout';

function App() {
    return (
        <Router>
            <GlobalStyle />
            <div>
                <ToastContainer />
                <Routes>
                    {publicRoutes.map((route, index) => {
                        const Layout = route.layout === null ? Fragment : DefaultLayout;
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
