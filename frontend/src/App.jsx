import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchCurrentUser } from './features/auth/authSlice';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AdminFormsPage from './pages/AdminFormsPage';
import FormBuilderPage from './pages/FormBuilderPage';
import PublicFormPage from './pages/PublicFormPage';
import FormSubmissionsPage from './pages/FormSubmissionsPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // If token exists, hydrate current user session
    if (localStorage.getItem('token')) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-brand-500 selection:text-white">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin/login" element={<LoginPage />} />
            <Route path="/admin/forms" element={<AdminFormsPage />} />
            <Route path="/admin/forms/new" element={<FormBuilderPage />} />
            <Route path="/admin/forms/:formId/edit" element={<FormBuilderPage />} />
            <Route path="/admin/forms/:formId/submissions" element={<FormSubmissionsPage />} />
            <Route path="/forms/:formId" element={<PublicFormPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
