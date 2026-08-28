import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AppStateProvider } from './state/AppState.jsx';
import { AudioProvider } from './components/audio/AudioManager.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AudioProvider>
        <AppStateProvider>
          <App />
        </AppStateProvider>
      </AudioProvider>
    </BrowserRouter>
  </React.StrictMode>
);
