import React from 'react';
import { Building2, FileText, MapPin, Tag, Landmark, ShieldCheck } from 'lucide-react';
<<<<<<< HEAD
import { extractText } from '../../utils/textHelper';
=======
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1

export const TenderOverviewCard = ({ basicInfo = {} }) => {
  const {
    title,
    referenceId,
    procuringAuthority,
    department,
    tenderType,
    procurementCategory,
    location,
    estimatedValue,
    currency,
    status
  } = basicInfo;

<<<<<<< HEAD
  const categoryText = extractText(procurementCategory, 'Procurement');
  const refText = extractText(referenceId);
  const titleText = extractText(title, 'Tender Document');
  const statusText = extractText(status, 'Active Tender');
  const authorityText = extractText(procuringAuthority, 'Unspecified');
  const deptText = extractText(department);
  const valueText = extractText(estimatedValue);
  const currencyText = extractText(currency);
  const locText = extractText(location, 'Not Specified');
  const typeText = extractText(tenderType, 'Open Tender / RFP');

=======
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
  return (
    <div className="glass-card p-6 rounded-2xl border border-orange-100/90 space-y-6">
      
      {/* Header Title & Status */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-orange-100 text-orange-800 uppercase tracking-wide">
<<<<<<< HEAD
              {categoryText}
            </span>
            {refText && (
              <span className="text-xs font-mono font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
                Ref: {refText}
=======
              {procurementCategory || 'Procurement'}
            </span>
            {referenceId && (
              <span className="text-xs font-mono font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
                Ref: {referenceId}
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
              </span>
            )}
          </div>
          <h2 className="font-heading font-bold text-slate-900 text-xl sm:text-2xl leading-snug">
<<<<<<< HEAD
            {titleText}
=======
            {title || 'Tender Document'}
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
          </h2>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
<<<<<<< HEAD
            {statusText}
=======
            {status || 'Active Tender'}
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
          </span>
        </div>
      </div>

      {/* Grid of Key Attributes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        
        {/* Procuring Authority */}
        <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-100/80 space-y-1">
          <span className="text-slate-400 font-medium flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-orange-500" />
            Procuring Authority
          </span>
          <p className="font-bold text-slate-900 text-sm truncate">
<<<<<<< HEAD
            {authorityText}
          </p>
          {deptText && (
            <p className="text-[11px] text-slate-500 truncate">{deptText}</p>
=======
            {procuringAuthority || 'Unspecified'}
          </p>
          {department && (
            <p className="text-[11px] text-slate-500 truncate">{department}</p>
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
          )}
        </div>

        {/* Estimated Value */}
        <div className="bg-orange-50/50 p-3.5 rounded-xl border border-orange-100 space-y-1">
          <span className="text-orange-800/70 font-medium flex items-center gap-1.5">
            <Landmark className="w-3.5 h-3.5 text-orange-600" />
            Estimated Tender Value
          </span>
          <p className="font-heading font-extrabold text-orange-950 text-base sm:text-lg">
<<<<<<< HEAD
            {valueText ? `${valueText} ${currencyText}`.trim() : 'Under Evaluation'}
=======
            {estimatedValue ? `${estimatedValue} ${currency || ''}`.trim() : 'Under Evaluation'}
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
          </p>
          <p className="text-[10px] text-orange-700/80">Inclusive of specified scopes</p>
        </div>

        {/* Location */}
        <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-100/80 space-y-1">
          <span className="text-slate-400 font-medium flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-orange-500" />
            Project Location
          </span>
          <p className="font-bold text-slate-900 text-sm truncate">
<<<<<<< HEAD
            {locText}
=======
            {location || 'Not Specified'}
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
          </p>
          <p className="text-[10px] text-slate-400">Regional jurisdiction</p>
        </div>

        {/* Tender Type */}
        <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-100/80 space-y-1">
          <span className="text-slate-400 font-medium flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-orange-500" />
            Procurement Method
          </span>
          <p className="font-bold text-slate-900 text-sm truncate">
<<<<<<< HEAD
            {typeText}
=======
            {tenderType || 'Open Tender / RFP'}
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
          </p>
          <p className="text-[10px] text-slate-400">Competitive Bidding</p>
        </div>

      </div>

    </div>
  );
};
<<<<<<< HEAD

=======
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
