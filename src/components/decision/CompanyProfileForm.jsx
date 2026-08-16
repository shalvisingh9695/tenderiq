import React, { useState, useEffect } from 'react';
import { Building2, DollarSign, Calendar, Award, Users, MapPin, ShieldCheck, Sparkles, Plus, X, FileCheck, CheckCircle, AlertCircle } from 'lucide-react';

const DEFAULT_PROFILE = {
  companyName: 'Nexus Grid Tech Solutions Ltd',
  annualTurnover: 8000000,
  yearsOfExperience: 7,
  similarProjectExperience: true,
  similarProjectDescription: 'Completed 3 municipal smart grid metering deployments valued at $2M+ each',
  certifications: ['ISO 9001', 'ISO 27001'],
  registrations: ['Company Registration Certificate', 'GST Tax Registration'],
  manpowerCapacity: 65,
  geographicPresence: 'Metropolitan District & State Level',
  MSMEorStartup: false
};

export const CompanyProfileForm = ({ onSaveAndEvaluate, isLoading, initialProfile }) => {
  const [profile, setProfile] = useState(() => {
    if (initialProfile && Object.keys(initialProfile).length > 0) {
      return initialProfile;
    }
    const saved = localStorage.getItem('tenderiq_company_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_PROFILE;
      }
    }
    return DEFAULT_PROFILE;
  });

  const [certInput, setCertInput] = useState(() => 
    Array.isArray(profile.certifications) ? profile.certifications.join(', ') : profile.certifications || ''
  );
  const [regInput, setRegInput] = useState(() => 
    Array.isArray(profile.registrations) ? profile.registrations.join(', ') : profile.registrations || ''
  );

  const [validationError, setValidationError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    localStorage.setItem('tenderiq_company_profile', JSON.stringify(profile));
  }, [profile]);

  const handleChange = (field, value) => {
    setValidationError('');
    setSuccessMessage('');
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePrefillDemo = () => {
    setProfile(DEFAULT_PROFILE);
    setCertInput(DEFAULT_PROFILE.certifications.join(', '));
    setRegInput(DEFAULT_PROFILE.registrations.join(', '));
    setValidationError('');
    setSuccessMessage('Demo profile loaded successfully!');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');
    setSuccessMessage('');

    // Validation
    if (!profile.companyName || !profile.companyName.trim()) {
      setValidationError('Company Name is required.');
      return;
    }
    if (profile.annualTurnover === undefined || profile.annualTurnover === '' || Number(profile.annualTurnover) < 0) {
      setValidationError('Valid Annual Turnover is required.');
      return;
    }
    if (profile.yearsOfExperience === undefined || profile.yearsOfExperience === '' || Number(profile.yearsOfExperience) < 0) {
      setValidationError('Years of Experience is required.');
      return;
    }

    // Convert comma-separated string inputs to arrays
    const certificationsArray = typeof certInput === 'string'
      ? certInput.split(',').map(s => s.trim()).filter(Boolean)
      : Array.isArray(profile.certifications) ? profile.certifications : [];

    const registrationsArray = typeof regInput === 'string'
      ? regInput.split(',').map(s => s.trim()).filter(Boolean)
      : Array.isArray(profile.registrations) ? profile.registrations : [];

    const profileData = {
      ...profile,
      annualTurnover: Number(profile.annualTurnover),
      yearsOfExperience: Number(profile.yearsOfExperience),
      manpowerCapacity: profile.manpowerCapacity ? Number(profile.manpowerCapacity) : 0,
      certifications: certificationsArray,
      registrations: registrationsArray
    };

    // Log submitted data to console as required
<<<<<<< HEAD
    setSuccessMessage('Company profile saved successfully!');
=======
    console.log("Company Profile Submitted:", profileData);
    setSuccessMessage('Company profile saved to local state and logged to console!');
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1

    if (onSaveAndEvaluate) {
      onSaveAndEvaluate(profileData);
    }
  };

  return (
    <div id="company-profile-form" className="glass-card p-6 rounded-2xl border border-orange-100 shadow-sm bg-white/80">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-orange-100/60">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
              <Building2 className="w-4 h-4" />
            </div>
            <h2 className="font-heading text-lg font-bold text-slate-900">
              Company Profile Evaluation Form
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Enter your company details and technical capability thresholds to evaluate bid suitability.
          </p>
        </div>

        <button
          type="button"
          onClick={handlePrefillDemo}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200/80 transition-colors cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-orange-500" />
          Auto-fill Demo Profile
        </button>
      </div>

      {validationError && (
        <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {successMessage && (
        <div className="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Company Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Company Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              Company Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={profile.companyName || ''}
              onChange={(e) => handleChange('companyName', e.target.value)}
              placeholder="e.g. Nexus Tech Corp"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200/80 bg-white/90 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            />
          </div>

          {/* Annual Turnover */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-slate-400" />
              Annual Turnover (USD) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              required
              min="0"
              step="10000"
              value={profile.annualTurnover ?? ''}
              onChange={(e) => handleChange('annualTurnover', e.target.value)}
              placeholder="e.g. 8000000"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200/80 bg-white/90 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            />
          </div>

          {/* Years of Experience */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Years of Experience <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              required
              min="0"
              max="100"
              value={profile.yearsOfExperience ?? ''}
              onChange={(e) => handleChange('yearsOfExperience', e.target.value)}
              placeholder="e.g. 7"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200/80 bg-white/90 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            />
          </div>

          {/* Manpower Capacity */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              Manpower Capacity
            </label>
            <input
              type="number"
              min="0"
              value={profile.manpowerCapacity ?? ''}
              onChange={(e) => handleChange('manpowerCapacity', e.target.value)}
              placeholder="e.g. 65"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200/80 bg-white/90 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            />
          </div>

          {/* Geographic Presence */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              Geographic Presence
            </label>
            <input
              type="text"
              value={profile.geographicPresence || ''}
              onChange={(e) => handleChange('geographicPresence', e.target.value)}
              placeholder="e.g. Metropolitan District & State Level"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200/80 bg-white/90 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            />
          </div>

          {/* MSME or Startup Status */}
          <div className="space-y-1.5 flex flex-col justify-end">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
              MSME / Startup Status
            </label>
            <label className="relative flex items-center p-2.5 rounded-xl border border-slate-200/80 bg-white/60 cursor-pointer hover:bg-orange-50/50 transition-colors">
              <input
                type="checkbox"
                checked={Boolean(profile.MSMEorStartup)}
                onChange={(e) => handleChange('MSMEorStartup', e.target.checked)}
                className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-slate-300 cursor-pointer"
              />
              <span className="ml-2.5 text-xs font-medium text-slate-800">
                Registered MSME or Startup Enterprise
              </span>
            </label>
          </div>
        </div>

        {/* Similar Project Experience */}
        <div className="p-4 rounded-xl border border-orange-100/80 bg-orange-50/30 space-y-3">
          <label className="relative flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={Boolean(profile.similarProjectExperience)}
              onChange={(e) => handleChange('similarProjectExperience', e.target.checked)}
              className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-slate-300 cursor-pointer"
            />
            <span className="ml-2.5 text-xs font-bold text-slate-900">
              Has Similar Project Experience
            </span>
          </label>

          {profile.similarProjectExperience && (
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-600">
                Optional: Brief Description of Similar Projects
              </label>
              <textarea
                rows={2}
                value={profile.similarProjectDescription || ''}
                onChange={(e) => handleChange('similarProjectDescription', e.target.value)}
                placeholder="e.g. Executed 3 smart grid metering deployments valued at $2M+ each"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200/80 bg-white/90 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              />
            </div>
          )}
        </div>

        {/* Certifications (Comma Separated Input) */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-slate-400" />
            Certifications (comma-separated)
          </label>
          <input
            type="text"
            value={certInput}
            onChange={(e) => setCertInput(e.target.value)}
            placeholder="e.g. ISO 9001, ISO 27001, CMMI Level 3"
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200/80 bg-white/90 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
          />
          <span className="text-[10px] text-slate-500 block">
            Enter multiple certifications separated by commas (e.g. "ISO 9001, ISO 27001")
          </span>
        </div>

        {/* Registrations (Comma Separated Input) */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <FileCheck className="w-3.5 h-3.5 text-slate-400" />
            Registrations (comma-separated)
          </label>
          <input
            type="text"
            value={regInput}
            onChange={(e) => setRegInput(e.target.value)}
            placeholder="e.g. Certificate of Incorporation, GST Registration, Trade License"
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200/80 bg-white/90 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
          />
          <span className="text-[10px] text-slate-500 block">
            Enter company registrations or licenses separated by commas
          </span>
        </div>

        {/* Submit Action */}
        <div className="pt-4 border-t border-orange-100 flex items-center justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary-orange inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-xs cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            {isLoading ? 'Evaluating Decision...' : 'Evaluate Bid Decision'}
          </button>
        </div>
      </form>
    </div>
  );
};

