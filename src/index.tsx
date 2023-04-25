import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { UserProvider } from './store/UserContext';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <UserProvider>
        <React.StrictMode>
            <App />
        </React.StrictMode>
    </UserProvider>,
);

reportWebVitals();
