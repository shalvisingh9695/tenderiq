import React, { useState, useEffect } from 'react';
import { CompanyProfileForm } from './CompanyProfileForm';
import { DecisionPanel } from './DecisionPanel';
import { Sparkles, AlertCircle, Edit3, ArrowRight, ShieldCheck } from 'lucide-react';
<<<<<<< HEAD
import { safeFetchJson } from '../../utils/apiHelper';
=======
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1

export const DecisionSection = ({ activeDoc, onUpdateTenderData }) => {
  const [decisionData, setDecisionData] = useState(() => activeDoc?.decisionReport || null);
  const [mode, setMode] = useState(() => (activeDoc?.decisionReport ? 'view' : 'edit')); // 'edit' or 'view'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (activeDoc?.decisionReport) {
      setDecisionData(activeDoc.decisionReport);
      setMode('view');
    } else {
      setDecisionData(null);
      setMode('edit');
    }
  }, [activeDoc?.id, activeDoc?.decisionReport]);

  const handleEvaluateDecision = async (companyProfile) => {
    if (!activeDoc?.id) return;
    setIsLoading(true);
    setError(null);

    try {
<<<<<<< HEAD
      const data = await safeFetchJson(`/api/tenders/${activeDoc.id}/decision`, {
=======
      const response = await fetch(`/api/tenders/${activeDoc.id}/decision`, {
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ companyProfile })
      });

<<<<<<< HEAD
=======
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to evaluate bid decision.');
      }

>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
      setDecisionData(data);
      setMode('view');

      if (onUpdateTenderData) {
        onUpdateTenderData({
          decisionReport: data,
          decisionStatus: 'completed'
        });
      }
    } catch (err) {
      console.error('Bid decision evaluation error:', err);
      setError(err.message || 'An error occurred while evaluating the bid decision.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!activeDoc) {
    return (
      <div className="p-8 text-center glass-card rounded-2xl border border-orange-100/60 my-6">
        <p className="text-sm text-slate-500">Please select or upload a tender document to evaluate bid decision intelligence.</p>
      </div>
    );
  }

  return (
    <div id="bid-decision-section" className="space-y-6 my-6">
      {/* Navigation Header between View & Edit Profile */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-slate-900 text-sm">
              Bid Decision Intelligence Engine
            </h3>
            <p className="text-xs text-slate-500">
              Evaluates vendor capabilities vs tender specs via hybrid rules + Gemini AI reasoning.
            </p>
          </div>
        </div>

        {decisionData && mode === 'view' && (
          <button
            onClick={() => setMode('edit')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" /> Edit Profile & Re-Evaluate
          </button>
        )}

        {decisionData && mode === 'edit' && (
          <button
            onClick={() => setMode('view')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-orange-50 hover:bg-orange-100 text-orange-700 transition-colors"
          >
            View Decision Report <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading State Overlay */}
      {isLoading && (
        <div className="p-12 text-center glass-card rounded-2xl border border-orange-100 space-y-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 animate-pulse">
            <Sparkles className="w-6 h-6 animate-spin" />
          </div>
          <div>
            <h4 className="font-heading font-bold text-slate-900 text-base">
              Evaluating Company Profile vs Tender Specifications
            </h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Calculating deterministic eligibility, risk impact, financial fit, and generating Gemini AI decision explanation...
            </p>
          </div>
        </div>
      )}

      {/* Mode View: Decision Panel or Profile Form */}
      {!isLoading && mode === 'view' && decisionData && (
        <DecisionPanel
          decisionData={decisionData}
          onEditProfile={() => setMode('edit')}
          tenderTitle={activeDoc.structuredAnalysis?.basicInformation?.title || activeDoc.name}
        />
      )}

      {!isLoading && (mode === 'edit' || !decisionData) && (
        <CompanyProfileForm
          onSaveAndEvaluate={handleEvaluateDecision}
          isLoading={isLoading}
          initialProfile={activeDoc.companyProfileSnapshot || decisionData?.companyProfileSnapshot}
        />
      )}
    </div>
  );
};
