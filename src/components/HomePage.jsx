import React, { useState } from 'react';
import { TenderHero } from './legal/TenderHero';
import { TenderUploadSection } from './legal/TenderUploadSection';
import { TenderInsightsSection } from './legal/TenderInsightsSection';
import { TenderRiskSection } from './legal/TenderRiskSection';
import { TenderChatSection } from './legal/TenderChatSection';
import { TenderTestimonials } from './legal/TenderTestimonials';
import { SAMPLE_TENDERS } from '../data/tendersData';

export const HomePage = ({ 
  onAddToBids, 
  activeBids = [], 
  onNavigate 
}) => {
  const [tendersList, setTendersList] = useState(SAMPLE_TENDERS);
  const [selectedTender, setSelectedTender] = useState(SAMPLE_TENDERS[0]);

  // When user uploads a new tender
  const handleUploadSuccess = (newTender) => {
    setTendersList((prev) => {
      // If not already in list, prepend
      if (!prev.some((t) => t.id === newTender.id)) {
        return [newTender, ...prev];
      }
      return prev;
    });
    setSelectedTender(newTender);
  };

  // When user selects a preset or tender card to analyze
  const handleSelectTender = (tender) => {
    setSelectedTender(tender);
  };

  const handleOpenChatWithTender = (tender) => {
    setSelectedTender(tender);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* 1. HERO SECTION: AI Tender Intelligence & Real-time Metrics */}
      <TenderHero
        onNavigate={onNavigate}
        onUploadTrigger={() => {
          const el = document.getElementById('upload-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onTryAIChat={() => {
          const el = document.getElementById('ai-chat-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onExploreTenders={() => {
          const el = document.getElementById('tender-insights-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 2. UPLOAD DOCUMENT SECTION: Multi-stage Extraction Pipeline */}
      <TenderUploadSection
        onUploadSuccess={handleUploadSuccess}
        onSelectPreset={handleSelectTender}
      />

      {/* 3. TENDER INSIGHTS CARDS: High-Value RFPs & Procurement Packages */}
      <TenderInsightsSection
        tenders={tendersList}
        onSelectTender={handleSelectTender}
        onAddToBids={onAddToBids}
        activeBids={activeBids}
        onOpenChatWithTender={handleOpenChatWithTender}
      />

      {/* 4. RISK ANALYSIS SECTION: 7-Factor Legal & Financial Risk Engine */}
      <TenderRiskSection
        selectedTender={selectedTender}
        onSelectTender={handleSelectTender}
      />

      {/* 5. AI CHAT SECTION: RAG Clause Question & Answer with Citations */}
      <TenderChatSection
        selectedTender={selectedTender}
      />

      {/* 6. TESTIMONIALS & ENTERPRISE TRUST SECTION */}
      <TenderTestimonials />

    </div>
  );
};
