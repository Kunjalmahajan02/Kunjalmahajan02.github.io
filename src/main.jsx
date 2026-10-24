import React from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/fredoka/500.css';
import '@fontsource/fredoka/600.css';
import '@fontsource/caveat/600.css';
import '@fontsource-variable/manrope';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
import './styles/site.css';
import './styles/widgets.css';
import App from './App.jsx';
import { initMotion } from './motion.js';

initMotion();

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
