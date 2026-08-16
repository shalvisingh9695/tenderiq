import React from 'react';
import { Award, CheckCircle2, AlertCircle, FileText, Globe, Building, ShieldCheck, ExternalLink } from 'lucide-react';
<<<<<<< HEAD
import { extractText, extractTextList } from '../../utils/textHelper';
=======
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1

export const EligibilityCard = ({ eligibility = {}, onOpenSource }) => {
  const {
    annualTurnover,
    netWorth,
    yearsOfExperience,
    similarWorkExperience,
    technicalQualifications = [],
    requiredCertifications = [],
    requiredRegistrations = [],
    requiredLicenses = [],
    oemRequirements,
    msmeConditions,
    consortiumConditions,
    geographicEligibility,
    otherConditions = []
  } = eligibility;

  const renderRequirementItem = (title, reqObj, icon) => {
    if (!reqObj) return null;

<<<<<<< HEAD
    const value = extractText(reqObj);
    if (!value) return null;

    const mandatory = typeof reqObj === 'object' && reqObj.mandatory !== undefined ? reqObj.mandatory : true;
    const section = typeof reqObj === 'object' ? reqObj.section : null;
    const page = typeof reqObj === 'object' ? reqObj.page : null;
=======
    const value = typeof reqObj === 'string' ? reqObj : reqObj.value;
    if (!value) return null;

    const mandatory = typeof reqObj === 'object' ? reqObj.mandatory : true;
    const sourceText = typeof reqObj === 'object' ? (reqObj.sourceText || reqObj.source) : null;
    const section = typeof reqObj === 'object' ? reqObj.section : null;
    const page = typeof reqObj === 'object' ? reqObj.page : null;
    const confidence = typeof reqObj === 'object' ? reqObj.confidence : null;
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1

    return (
      <div className="bg-slate-50/90 p-4 rounded-xl border border-slate-100/90 space-y-2 hover:border-orange-200 transition-all flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              {icon}
              {title}
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
              mandatory ? 'bg-orange-100 text-orange-800' : 'bg-slate-100 text-slate-600'
            }`}>
              {mandatory ? 'Mandatory' : 'Conditional'}
            </span>
          </div>

          <p className="font-semibold text-slate-900 text-sm leading-relaxed">
            {value}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2.5 border-t border-slate-200/50 text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            {section && (
              <span className="flex items-center gap-1 font-medium text-slate-600">
                <FileText className="w-3 h-3 text-orange-500 shrink-0" />
<<<<<<< HEAD
                {extractText(section)}
              </span>
            )}
            {page && <span>Pg {extractText(page)}</span>}
=======
                {section}
              </span>
            )}
            {page && <span>Pg {page}</span>}
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
          </div>

          {onOpenSource && (typeof reqObj === 'object') && (
            <button
              onClick={() => onOpenSource(reqObj)}
              className="text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1 text-[11px] cursor-pointer hover:underline"
            >
              <ExternalLink className="w-3 h-3" />
              View Source
            </button>
          )}
        </div>
      </div>
    );
  };

<<<<<<< HEAD
  const certificationsList = extractTextList(requiredCertifications);
  const msmeText = extractText(msmeConditions);
  const consortiumText = extractText(consortiumConditions);
  const geographicText = extractText(geographicEligibility);
  const oemText = extractText(oemRequirements);

=======
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
  return (
    <div className="glass-card p-6 rounded-2xl border border-orange-100/90 space-y-6">
      
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-slate-900 text-lg">
              Eligibility & Qualification Intelligence
            </h3>
            <p className="text-xs text-slate-500">
              Mandatory qualification criteria required to participate
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid for Structured Objects */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderRequirementItem('Minimum Annual Turnover', annualTurnover, <Award className="w-3.5 h-3.5 text-orange-500" />)}
        {renderRequirementItem('Net Worth Requirement', netWorth, <ShieldCheck className="w-3.5 h-3.5 text-orange-500" />)}
        {renderRequirementItem('Years of Experience', yearsOfExperience, <Building className="w-3.5 h-3.5 text-orange-500" />)}
        {renderRequirementItem('Similar Work Experience', similarWorkExperience, <CheckCircle2 className="w-3.5 h-3.5 text-orange-500" />)}
      </div>

      {/* Tags & Lists for Certifications / Licenses / Conditions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        
        {/* Required Certifications */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
<<<<<<< HEAD
            Required Certifications ({certificationsList.length})
          </label>
          {certificationsList.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {certificationsList.map((cert, idx) => (
=======
            Required Certifications ({requiredCertifications.length})
          </label>
          {requiredCertifications.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {requiredCertifications.map((cert, idx) => (
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
                <span key={idx} className="px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200/80 rounded-lg text-xs font-medium">
                  {cert}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No specific certifications specified.</p>
          )}
        </div>

        {/* MSME & Consortium Conditions */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            MSME / Joint Venture Terms
          </label>
          <div className="space-y-1.5 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
<<<<<<< HEAD
            {msmeText && (
              <p><span className="font-bold text-slate-900">MSME:</span> {msmeText}</p>
            )}
            {consortiumText && (
              <p><span className="font-bold text-slate-900">JV/Consortium:</span> {consortiumText}</p>
            )}
            {!msmeText && !consortiumText && (
=======
            {msmeConditions && (
              <p><span className="font-bold text-slate-900">MSME:</span> {msmeConditions}</p>
            )}
            {consortiumConditions && (
              <p><span className="font-bold text-slate-900">JV/Consortium:</span> {consortiumConditions}</p>
            )}
            {!msmeConditions && !consortiumConditions && (
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
              <p className="text-slate-400 italic">Standard single-bidder rules apply.</p>
            )}
          </div>
        </div>

        {/* Geographical & OEM */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Geographic & OEM Terms
          </label>
          <div className="space-y-1.5 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
<<<<<<< HEAD
            {geographicText && (
              <p className="flex items-start gap-1">
                <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>{geographicText}</span>
              </p>
            )}
            {oemText && (
              <p><span className="font-bold text-slate-900">OEM:</span> {oemText}</p>
            )}
            {!geographicText && !oemText && (
=======
            {geographicEligibility && (
              <p className="flex items-start gap-1">
                <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>{geographicEligibility}</span>
              </p>
            )}
            {oemRequirements && (
              <p><span className="font-bold text-slate-900">OEM:</span> {oemRequirements}</p>
            )}
            {!geographicEligibility && !oemRequirements && (
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
              <p className="text-slate-400 italic">No geographic/OEM restrictions detected.</p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
<<<<<<< HEAD

=======
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
