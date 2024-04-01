import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BloomFilterPage from './pages/BloomFilterPage';
import CountMinSketchPage from './pages/CountMinSketchPage';
import SkipListPage from './pages/SkipListPage';
import Navbar from './Navbar';
import './App.css';

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/bloom-filter" element={<BloomFilterPage />} />
          <Route path="/count-min-sketch" element={<CountMinSketchPage />} />
          <Route path="/skip-list" element={<SkipListPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
