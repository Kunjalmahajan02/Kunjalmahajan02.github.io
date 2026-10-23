import React from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/playfair-display/600-italic.css';
import '@fontsource/playfair-display/700-italic.css';
import '@fontsource/playfair-display/600.css';
import '@fontsource/caveat/600.css';
import '@fontsource-variable/manrope';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/pages.css';
import App from './App.jsx';
import { initMotion } from './motion.js';

initMotion();

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
