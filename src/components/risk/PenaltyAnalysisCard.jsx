import React from 'react';
import { Scale, AlertTriangle, ShieldX, Clock, ExternalLink, FileText, Ban } from 'lucide-react';
import { extractText } from '../../utils/textHelper';

export const PenaltyAnalysisCard = ({ penaltyAnalysis = {}, onOpenSource }) => {
  const penalties = [
    {
      key: 'liquidatedDamages',
      title: 'Liquidated Damages',
      icon: <AlertTriangle className="w-4 h-4 text-red-600" />,
      defaultTrigger: 'Unexcused delay in project milestones or final commissioning',
      item: penaltyAnalysis.liquidatedDamages
    },
    {
      key: 'delayPenalties',
      title: 'Delay & Milestone Penalties',
      icon: <Clock className="w-4 h-4 text-orange-600" />,
      defaultTrigger: 'Failure to adhere to agreed project schedule timelines',
      item: penaltyAnalysis.delayPenalties
    },
    {
      key: 'slaBreachPenalties',
      title: 'Service Level Agreement (SLA) Penalties',
      icon: <ShieldX className="w-4 h-4 text-amber-600" />,
      defaultTrigger: 'Exceeding mandatory response time or system availability downtime',
      item: penaltyAnalysis.slaBreachPenalties
    },
    {
      key: 'securityForfeiture',
      title: 'Security Deposit & EMD Forfeiture',
      icon: <Scale className="w-4 h-4 text-purple-600" />,
      defaultTrigger: 'Bid withdrawal or failure to execute contract / submit Performance BG',
      item: penaltyAnalysis.securityForfeiture
    },
    {
      key: 'terminationConsequences',
      title: 'Termination for Default',
      icon: <Ban className="w-4 h-4 text-rose-600" />,
      defaultTrigger: 'Persistent breach, insolvency, or non-performance notice expiration',
      item: penaltyAnalysis.terminationConsequences
    },
    {
      key: 'blacklistingRules',
      title: 'Debarment & Blacklisting Conditions',
      icon: <ShieldX className="w-4 h-4 text-slate-800" />,
      defaultTrigger: 'Misrepresentation, fraudulent practices, or willful project abandonment',
      item: penaltyAnalysis.blacklistingRules
    }
  ];

  return (
    <div className="glass-card p-6 rounded-2xl border border-orange-100/90 space-y-6">
      
      <div className="flex items-center gap-2 pb-3 border-b border-orange-100/80">
        <span className="p-2 rounded-lg bg-red-100/80 text-red-700">
          <Scale className="w-5 h-5" />
        </span>
        <div>
          <h3 className="font-heading font-extrabold text-slate-900 text-lg">
            Penalty & Liability Matrix
          </h3>
          <p className="text-xs text-slate-500">
            Clause-derived penalty triggers, financial consequences, and debarment risks
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {penalties.map((p) => {
          const info = p.item || {};
          const trigger = extractText(info.trigger || (typeof info === 'string' ? info : p.defaultTrigger));
          const consequence = extractText(info.financialConsequence || info.value || 'Specified in tender conditions');
          const section = extractText(info.section);
          const page = extractText(info.page);

          return (
            <div
              key={p.key}
              className="bg-white/90 p-4 rounded-xl border border-slate-200/80 hover:border-red-200 shadow-2xs hover:shadow-sm transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  {p.icon}
                  {p.title}
                </span>

                {/* Trigger */}
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Trigger Condition:
                  </span>
                  <p className="text-xs text-slate-800 font-medium leading-tight">
                    {trigger}
                  </p>
                </div>

                {/* Consequence */}
                <div className="bg-red-50/40 p-2.5 rounded-lg border border-red-100 space-y-0.5">
                  <span className="text-[10px] font-bold text-red-900/70 uppercase tracking-wider block">
                    Financial / Contractual Consequence:
                  </span>
                  <p className="text-xs text-slate-900 font-bold leading-tight">
                    {consequence}
                  </p>
                </div>
              </div>

              {/* Source Link */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                <div className="flex items-center gap-2">
                  {section && (
                    <span className="font-medium text-slate-600 flex items-center gap-1">
                      <FileText className="w-3 h-3 text-orange-500" />
                      {section}
                    </span>
                  )}
                  {page && <span>Pg {page}</span>}
                </div>

                {onOpenSource && (info.sourceText || consequence) && (
                  <button
                    onClick={() =>
                      onOpenSource({
                        value: `${p.title}: ${consequence}`,
                        sourceText: extractText(info.sourceText || consequence),
                        section: section,
                        page: page,
                        confidence: info.confidence || 0.95,
                        requirementType: 'penalty'
                      })
                    }
                    className="text-red-700 hover:text-red-800 font-bold flex items-center gap-1 text-[11px] cursor-pointer hover:underline"
                  >
                    <ExternalLink className="w-3 h-3" />
                    View Clause
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

