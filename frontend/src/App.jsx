import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import AddCompany from './pages/AddCompany';
import CompanyDetail from './pages/CompanyDetail';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add-company" element={<AddCompany />} />
          <Route path="/company/:id" element={<CompanyDetail />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
