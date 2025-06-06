import React from 'react';
import { BaseRouter, Routes, Route, BrowserRouter } from 'react-router-dom';

import Home from './components/Home.jsx';
import HustleForm from './components/HustleForm.jsx';
import Feed from './components/Feed.jsx';
function App() {
  
  return (
    
      <BrowserRouter>
      
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/mint-your-hustle" element={<HustleForm />} />
      <Route path="/feed" element={<Feed />} />
      </Routes>
      </BrowserRouter>
    
  );
}

export default App
