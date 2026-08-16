import React from 'react';
import { Shield, ShieldAlert, Sparkles, AlertTriangle, RefreshCw, Layers } from 'lucide-react';
import { RiskOverviewCard } from './RiskOverviewCard';
import { RiskCategoryBreakdown } from './RiskCategoryBreakdown';
import { RedFlagsCard } from './RedFlagsCard';
import { PositiveSignalsCard } from './PositiveSignalsCard';
import { PenaltyAnalysisCard } from './PenaltyAnalysisCard';
import { FinancialExposureCard } from './FinancialExposureCard';
import { RiskFactorList } from './RiskFactorList';

export const RiskDashboardSection = ({
  riskReport,
  riskStatus = 'not_started',
  riskError = null,
  onRunRiskAnalysis,
  isAnalyzing = false,
  onOpenSource,
  hasTenderAnalysis = false
}) => {
  if (!hasTenderAnalysis) {
    return (
      <div className="glass-card p-8 rounded-2xl border border-orange-100 text-center space-y-4 max-w-2xl mx-auto my-6">
        <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="font-heading font-extrabold text-slate-900 text-xl">
            Initial Tender Extraction Required
          </h3>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            Please run the initial Procurement Extraction on this tender document first. The Risk Engine relies on structured tender intelligence to calculate evidence-backed risk scores.
          </p>
        </div>
      </div>
    );
  }

  if (riskStatus === 'analyzing' || isAnalyzing) {
    return (
      <div className="glass-card p-12 rounded-2xl border border-orange-200 text-center space-y-6 max-w-2xl mx-auto my-8 animate-pulse">
        <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto animate-spin">
          <RefreshCw className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="font-heading font-extrabold text-slate-900 text-xl">
            Evaluating Tender Risk Clauses...
          </h3>
          <p className="text-slate-600 text-xs sm:text-sm">
            Evaluating financial liabilities, penalty matrices, termination consequences, and red flags using Gemini AI.
          </p>
        </div>
        <div className="flex justify-center items-center gap-2 text-xs font-semibold text-orange-700">
          <Sparkles className="w-4 h-4 text-orange-500 animate-bounce" />
          <span>Analyzing evidence-backed clause severity...</span>
        </div>
      </div>
    );
  }

  if (riskError) {
    return (
      <div className="glass-card p-6 rounded-2xl border border-red-200 bg-red-50/40 text-center space-y-4 max-w-2xl mx-auto my-6">
        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="font-heading font-bold text-red-950 text-base">
            Risk Analysis Error
          </h3>
          <p className="text-xs text-red-800 font-medium">
            {riskError}
          </p>
        </div>
        <button
          onClick={onRunRiskAnalysis}
          className="btn-primary-orange px-5 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2 cursor-pointer shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry Risk Intelligence Evaluation
        </button>
      </div>
    );
  }

  if (!riskReport || !riskReport.overallScore) {
    return (
      <div className="glass-card p-8 sm:p-10 rounded-2xl border border-orange-100/90 text-center space-y-5 max-w-2xl mx-auto my-6">
        <div className="w-16 h-16 bg-orange-100/80 text-orange-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
          <Shield className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="font-heading font-extrabold text-slate-900 text-xl sm:text-2xl">
            Generate Risk Intelligence Report
          </h3>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-md mx-auto font-medium">
            Run evidence-backed clause risk scoring across 5 core categories: Financial, Legal, Operational, Eligibility, and Compliance.
          </p>
        </div>
        <button
          onClick={onRunRiskAnalysis}
          className="btn-primary-orange px-7 py-3 rounded-xl font-bold text-xs inline-flex items-center gap-2 cursor-pointer shadow-md shadow-orange-500/20"
        >
          <Sparkles className="w-4 h-4" />
          Run Advanced Risk Engine
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* 1. Risk Overview & Executive Score */}
      <RiskOverviewCard
        riskReport={riskReport}
        onReanalyze={onRunRiskAnalysis}
        isAnalyzing={isAnalyzing}
        onOpenSource={onOpenSource}
      />

      {/* 2. Red Flags (High Priority Warnings) */}
      {riskReport.redFlags && riskReport.redFlags.length > 0 && (
        <RedFlagsCard
          redFlags={riskReport.redFlags}
          onOpenSource={onOpenSource}
        />
      )}

      {/* 3. Category Score Breakdown */}
      <RiskCategoryBreakdown
        categoryScores={riskReport.categoryScores}
<<<<<<< HEAD
        onOpenSource={onOpenSource}
=======
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
      />

      {/* 4. Penalty & Liability Matrix */}
      {riskReport.penaltyAnalysis && (
        <PenaltyAnalysisCard
          penaltyAnalysis={riskReport.penaltyAnalysis}
          onOpenSource={onOpenSource}
        />
      )}

      {/* 5. Financial Exposure & Bank Commitments */}
      {riskReport.financialExposure && (
        <FinancialExposureCard
          financialExposure={riskReport.financialExposure}
          onOpenSource={onOpenSource}
        />
      )}

      {/* 6. Detailed Traceable Risk Factors List */}
      {riskReport.riskFactors && riskReport.riskFactors.length > 0 && (
        <RiskFactorList
          riskFactors={riskReport.riskFactors}
          onOpenSource={onOpenSource}
        />
      )}

      {/* 7. Positive Vendor Conditions */}
      {riskReport.positiveSignals && riskReport.positiveSignals.length > 0 && (
        <PositiveSignalsCard
          positiveSignals={riskReport.positiveSignals}
          onOpenSource={onOpenSource}
        />
      )}

    </div>
  );
};
