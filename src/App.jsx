import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { UploadPage } from './components/UploadPage';
import { DashboardPage } from './components/DashboardPage';
import { Footer } from './components/Footer';
<<<<<<< HEAD
import { safeFetchJson } from './utils/apiHelper';
=======
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [documents, setDocuments] = useState([]);
  const [isLoadingTenders, setIsLoadingTenders] = useState(true);

  // Fetch uploaded tenders from backend on load
  const fetchTenders = async () => {
    try {
      setIsLoadingTenders(true);
<<<<<<< HEAD
      const data = await safeFetchJson('/api/tenders');
      if (data.success && Array.isArray(data.data)) {
        setDocuments(data.data);
=======
      const res = await fetch('/api/tenders');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setDocuments(data.data);
        }
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
      }
    } catch (err) {
      console.error('Failed to fetch tenders from backend:', err);
    } finally {
      setIsLoadingTenders(false);
    }
  };

  useEffect(() => {
    fetchTenders();
  }, []);

  const handleUploadSuccess = (newDoc) => {
    setDocuments((prev) => [newDoc, ...prev.filter((d) => d.id !== newDoc.id)]);
  };

  const handleUpdateDocument = (updatedDoc) => {
    setDocuments((prev) => prev.map((d) => (d.id === updatedDoc.id ? updatedDoc : d)));
  };

  const handleDeleteDocument = async (id) => {
    try {
<<<<<<< HEAD
      const data = await safeFetchJson(`/api/tenders/${id}`, { method: 'DELETE' });
      if (data.success) {
=======
      const res = await fetch(`/api/tenders/${id}`, { method: 'DELETE' });
      if (res.ok) {
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
        setDocuments((prev) => prev.filter((doc) => doc.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete tender:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-slate-800 antialiased selection:bg-orange-100 selection:text-orange-900">
      
      {/* Navigation Header */}
      <Navbar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        uploadedCount={documents.length}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage onNavigate={setCurrentPage} />
        )}

        {currentPage === 'upload' && (
          <UploadPage 
            onUploadSuccess={handleUploadSuccess} 
<<<<<<< HEAD
            onNavigate={setCurrentPage}
            documents={documents}
=======
            onNavigate={setCurrentPage} 
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
          />
        )}

        {currentPage === 'dashboard' && (
          <DashboardPage 
            documents={documents} 
            onNavigate={setCurrentPage}
            onDeleteDocument={handleDeleteDocument}
            onUpdateDocument={handleUpdateDocument}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={setCurrentPage} />

    </div>
  );
}
