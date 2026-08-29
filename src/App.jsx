import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { UploadPage } from './components/UploadPage';
import { DashboardPage } from './components/DashboardPage';
import { Footer } from './components/Footer';
import { ActiveBidsDrawer } from './components/legal/ActiveBidsDrawer';
import { SAMPLE_TENDERS } from './data/tendersData';
import { safeFetchJson } from './utils/apiHelper';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [documents, setDocuments] = useState(SAMPLE_TENDERS);
  const [isLoadingTenders, setIsLoadingTenders] = useState(false);
  
  // Active Tracked Bids Pipeline State
  const [activeBids, setActiveBids] = useState([
    SAMPLE_TENDERS[0], // NHAI Highway Project
    SAMPLE_TENDERS[1]  // Smart Metering Rollout
  ]);
  const [isBidsDrawerOpen, setIsBidsDrawerOpen] = useState(false);

  // Fetch uploaded tenders from backend on load
  const fetchTenders = async () => {
    try {
      setIsLoadingTenders(true);
      const data = await safeFetchJson('/api/tenders');
      if (data && data.success && Array.isArray(data.data) && data.data.length > 0) {
        setDocuments(data.data);
      }
    } catch (err) {
      console.warn('Using built-in tenders data for preview:', err);
    } finally {
      setIsLoadingTenders(false);
    }
  };

  useEffect(() => {
    fetchTenders();
  }, []);

  // Smooth scroll to top on page navigation
  const handlePageNavigation = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUploadSuccess = (newDoc) => {
    setDocuments((prev) => [newDoc, ...prev.filter((d) => d.id !== newDoc.id)]);
  };

  const handleUpdateDocument = (updatedDoc) => {
    setDocuments((prev) => prev.map((d) => (d.id === updatedDoc.id ? updatedDoc : d)));
  };

  const handleDeleteDocument = async (id) => {
    try {
      const data = await safeFetchJson(`/api/tenders/${id}`, { method: 'DELETE' });
      if (data && data.success) {
        setDocuments((prev) => prev.filter((doc) => doc.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete tender:', err);
    }
  };

  // Active Bids Handlers
  const handleAddToBids = (tender) => {
    setActiveBids((prev) => {
      const exists = prev.some((b) => b.id === tender.id);
      if (exists) {
        return prev.filter((b) => b.id !== tender.id);
      }
      return [...prev, tender];
    });
  };

  const handleRemoveBid = (tenderId) => {
    setActiveBids((prev) => prev.filter((b) => b.id !== tenderId));
  };

  const handleClearBids = () => {
    setActiveBids([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-slate-800 antialiased selection:bg-orange-100 selection:text-orange-900">
      
      {/* Navigation Header */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handlePageNavigation}
        activeBidsCount={activeBids.length}
        onOpenBidsDrawer={() => setIsBidsDrawerOpen(true)}
      />

      {/* Main View Area with Fast & Smooth Page Transitions */}
      <main className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {currentPage === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            >
              <HomePage 
                onAddToBids={handleAddToBids}
                activeBids={activeBids}
                onNavigate={handlePageNavigation}
              />
            </motion.div>
          )}

          {currentPage === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            >
              <UploadPage 
                onUploadSuccess={handleUploadSuccess} 
                onNavigate={handlePageNavigation}
                documents={documents}
              />
            </motion.div>
          )}

          {currentPage === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            >
              <DashboardPage 
                documents={documents} 
                onNavigate={handlePageNavigation}
                onDeleteDocument={handleDeleteDocument}
                onUpdateDocument={handleUpdateDocument}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Slide-over Active Bids Drawer */}
      <ActiveBidsDrawer
        isOpen={isBidsDrawerOpen}
        onClose={() => setIsBidsDrawerOpen(false)}
        activeBids={activeBids}
        onRemoveBid={handleRemoveBid}
        onClearBids={handleClearBids}
        onOpenTender={(tender) => {
          setIsBidsDrawerOpen(false);
          const el = document.getElementById('tender-insights-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Footer (Dark Theme) */}
      <Footer onNavigate={setCurrentPage} />

    </div>
  );
}
