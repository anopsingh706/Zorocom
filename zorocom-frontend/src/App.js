import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import CompanyPage from "./pages/CompanyPage";
import AddCompanyModal from "./components/AddCompanyModal";
import Toast from "./components/Toast";

export default function App() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [toast, setToast] = useState(null); // { message, type }
  const [refreshKey, setRefreshKey] = useState(0);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const handleCompanyCreated = (company) => {
    setShowAddModal(false);
    setRefreshKey((k) => k + 1); // triggers HomePage re-fetch
    showToast(`${company.name} added successfully! 🎉`);
  };

  return (
    <BrowserRouter>
      <Navbar onAddCompany={() => setShowAddModal(true)} />

      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              key={refreshKey}
              onAddCompany={() => setShowAddModal(true)}
            />
          }
        />
        <Route
          path="/company/:id"
          element={<CompanyPage onToast={showToast} />}
        />
      </Routes>

      {/* Global Add Company Modal */}
      {showAddModal && (
        <AddCompanyModal
          onClose={() => setShowAddModal(false)}
          onSuccess={handleCompanyCreated}
        />
      )}

      {/* Global Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </BrowserRouter>
  );
}
