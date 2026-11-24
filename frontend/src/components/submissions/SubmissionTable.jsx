import React, { useState } from 'react';
import { Eye, Trash2, Download, Inbox, Calendar } from 'lucide-react';
import Pagination from '../common/Pagination';
import SubmissionDetailModal from './SubmissionDetailModal';

const SubmissionTable = ({
  form,
  submissions = [],
  pagination,
  onPageChange,
  onDeleteSubmission,
}) => {
  const [selectedSub, setSelectedSub] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const fields = Array.isArray(form?.fields) ? form.fields : [];
  // Pick top 4 fields for table display to maintain responsive layout
  const visibleFields = fields.slice(0, 4);

  const handleView = (sub) => {
    setSelectedSub(sub);
    setIsDetailOpen(true);
  };

  const handleExportCSV = () => {
    if (!submissions || submissions.length === 0) return;

    const headers = ['Submission ID', 'Submitted At', ...fields.map((f) => f.label || f.key)];
    const rows = submissions.map((sub) => {
      const data = sub.data || {};
      const fieldValues = fields.map((f) => {
        const val = data[f.key];
        if (Array.isArray(val)) return `"${val.join('; ')}"`;
        if (typeof val === 'string') return `"${val.replace(/"/g, '""')}"`;
        return val ?? '';
      });
      return [sub.id, `"${new Date(sub.submittedAt).toLocaleString()}"`, ...fieldValues];
    });

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${(form?.name || 'form').replace(/\s+/g, '_')}_submissions.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Table Actions Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Form Submissions ({pagination?.total || submissions.length})
          </h3>
          <p className="text-[11px] text-slate-500">
            View, inspect, and manage participant responses
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          disabled={submissions.length === 0}
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Table / Empty State */}
      {submissions.length === 0 ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Inbox className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">No submissions yet</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              Once users submit answers through the public form link, their entries will show up here.
            </p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4"># / Timestamp</th>
                {visibleFields.map((f) => (
                  <th key={f.key} className="py-3.5 px-4">
                    {f.label}
                  </th>
                ))}
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {submissions.map((sub, idx) => {
                const data = sub.data || {};
                const rowNum = (pagination.page - 1) * pagination.limit + idx + 1;

                return (
                  <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Index & Timestamp */}
                    <td className="py-3 px-4 font-mono">
                      <span className="font-semibold text-slate-700 mr-2">#{rowNum}</span>
                      <span className="text-[11px] text-slate-500 font-sans">
                        {new Date(sub.submittedAt).toLocaleDateString()}
                      </span>
                    </td>

                    {/* Dynamic Fields */}
                    {visibleFields.map((f) => {
                      const val = data[f.key];
                      let display = '—';
                      if (val !== undefined && val !== null && val !== '') {
                        if (Array.isArray(val)) {
                          display = val.join(', ');
                        } else if (typeof val === 'boolean') {
                          display = val ? 'Yes' : 'No';
                        } else {
                          display = String(val);
                        }
                      }

                      return (
                        <td key={f.key} className="py-3 px-4 text-slate-800 max-w-[200px] truncate">
                          {display}
                        </td>
                      );
                    })}

                    {/* Actions */}
                    <td className="py-3 px-4 text-right space-x-1">
                      <button
                        onClick={() => handleView(sub)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-brand-50 border border-slate-200 transition-colors"
                        title="View Submission"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this submission?')) {
                            onDeleteSubmission(sub.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors"
                        title="Delete Submission"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Footer */}
      {pagination && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          onPageChange={onPageChange}
        />
      )}

      {/* Submission Detail Modal */}
      <SubmissionDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        submission={selectedSub}
        fields={fields}
      />
    </div>
  );
};

export default SubmissionTable;
