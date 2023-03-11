import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import SendMessage from "./Components/SendMessage";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
  <BrowserRouter basename='my-sms'>
      <Routes>
          <Route index element={<App />} />
          <Route path="SendMessage" element={<SendMessage />} />
      </Routes>
  </BrowserRouter>
</React.StrictMode>
);
reportWebVitals();
