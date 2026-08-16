import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { UploadPage } from './components/UploadPage';
import { DashboardPage } from './components/DashboardPage';
import { Footer } from './components/Footer';
import { safeFetchJson } from './utils/apiHelper';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [documents, setDocuments] = useState([]);
  const [isLoadingTenders, setIsLoadingTenders] = useState(true);

  // Fetch uploaded tenders from backend on load
  const fetchTenders = async () => {
    try {
      setIsLoadingTenders(true);
      const data = await safeFetchJson('/api/tenders');
      if (data.success && Array.isArray(data.data)) {
        setDocuments(data.data);
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
      const data = await safeFetchJson(`/api/tenders/${id}`, { method: 'DELETE' });
      if (data.success) {
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
            onNavigate={setCurrentPage}
            documents={documents}
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
