import React from 'react';
import Modal from '../common/Modal';
import { Calendar, Globe, Monitor, CheckCircle2 } from 'lucide-react';

const SubmissionDetailModal = ({ isOpen, onClose, submission, fields = [] }) => {
  if (!submission) return null;

  const data = submission.data || {};

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Submission Details" maxWidth="max-w-2xl">
      <div className="space-y-6">
        {/* Meta Header */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-slate-400 block font-mono text-[10px]">SUBMISSION ID</span>
            <span className="font-mono font-semibold text-slate-800">{submission.id}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-mono text-[10px] flex items-center gap-1">
              <Calendar className="w-3 h-3" /> SUBMITTED AT
            </span>
            <span className="font-semibold text-slate-800">
              {new Date(submission.submittedAt).toLocaleString()}
            </span>
          </div>
          {submission.ipAddress && (
            <div>
              <span className="text-slate-400 block font-mono text-[10px] flex items-center gap-1">
                <Globe className="w-3 h-3" /> IP ADDRESS
              </span>
              <span className="font-mono text-slate-700">{submission.ipAddress}</span>
            </div>
          )}
          {submission.userAgent && (
            <div className="truncate">
              <span className="text-slate-400 block font-mono text-[10px] flex items-center gap-1">
                <Monitor className="w-3 h-3" /> USER AGENT
              </span>
              <span className="text-slate-700 truncate block text-[11px]">{submission.userAgent}</span>
            </div>
          )}
        </div>

        {/* Dynamic Fields & Submitted Answers */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-2">
            Submitted Responses
          </h4>

          <div className="divide-y divide-slate-100">
            {fields.map((field) => {
              const val = data[field.key];
              let displayVal = '—';

              if (val !== undefined && val !== null && val !== '') {
                if (Array.isArray(val)) {
                  displayVal = val.join(', ');
                } else if (typeof val === 'boolean') {
                  displayVal = val ? 'Yes' : 'No';
                } else {
                  displayVal = String(val);
                }
              }

              return (
                <div key={field.id || field.key} className="py-2.5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                  <div className="sm:w-1/3">
                    <span className="text-xs font-semibold text-slate-600">{field.label}</span>
                    <span className="block text-[10px] font-mono text-slate-400">{field.key}</span>
                  </div>
                  <div className="sm:w-2/3">
                    <span className="text-xs font-medium text-slate-900 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 inline-block w-full">
                      {displayVal}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Raw JSON viewer */}
        <details className="text-xs border border-slate-200 rounded-xl p-3 bg-slate-50 group">
          <summary className="font-bold text-slate-700 cursor-pointer select-none">
            View Raw Data (JSON)
          </summary>
          <pre className="mt-2 p-3 bg-slate-900 text-slate-100 rounded-lg overflow-x-auto text-[11px] font-mono">
            {JSON.stringify(submission.data, null, 2)}
          </pre>
        </details>

        {/* Footer */}
        <div className="flex justify-end pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SubmissionDetailModal;
