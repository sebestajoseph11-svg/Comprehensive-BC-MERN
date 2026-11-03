import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './store/AuthProvider';
import { GameProvider } from './store/GameProvider';
import { UiProvider } from './store/UiProvider';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <UiProvider>
          <GameProvider>
            <App />
          </GameProvider>
        </UiProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
