import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';

// bootstrap configuaration
// import '../node_modules/react-bootstrap/dist/react-bootstrap';
import '../node_modules/react-bootstrap/dist/react-bootstrap.min';
import '../node_modules/bootstrap/dist/css/bootstrap.css'
import { AuthContextProvider } from './authCtx/auth-context';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <AuthContextProvider>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </AuthContextProvider>
);
