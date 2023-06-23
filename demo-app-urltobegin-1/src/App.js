import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FormPage from './components/FormPage';
import CallbackPage from './components/CallbackPage';

const App = () => {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<FormPage />} />
        <Route path="/callback" element={<CallbackPage />} />
      </Routes>
    </Router>
  );
};

export default App;
