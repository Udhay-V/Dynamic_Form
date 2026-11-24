import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, totalItems, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-3 sm:px-6 rounded-b-xl">
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-xs text-slate-600">
            Showing page <span className="font-semibold text-slate-900">{currentPage}</span> of{' '}
            <span className="font-semibold text-slate-900">{totalPages}</span>{' '}
            {totalItems !== undefined && (
              <span>
                (Total <span className="font-semibold text-slate-900">{totalItems}</span> items)
              </span>
            )}
          </p>
        </div>

        <div>
          <nav className="isolate inline-flex -space-x-px rounded-lg shadow-sm" aria-label="Pagination">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="relative inline-flex items-center rounded-l-md px-2.5 py-1.5 text-slate-500 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </button>

            {/* Page buttons */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) => {
                // Show first, last, and pages around current
                return page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;
              })
              .map((page, idx, arr) => {
                const prev = arr[idx - 1];
                const showEllipsis = prev && page - prev > 1;

                return (
                  <React.Fragment key={page}>
                    {showEllipsis && (
                      <span className="relative inline-flex items-center px-3 py-1.5 text-xs font-semibold text-slate-500 ring-1 ring-inset ring-slate-300">
                        ...
                      </span>
                    )}
                    <button
                      onClick={() => onPageChange(page)}
                      className={`relative inline-flex items-center px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ring-slate-300 focus:z-20 ${
                        page === currentPage
                          ? 'z-10 bg-brand-600 text-white ring-brand-600'
                          : 'text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                );
              })}

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="relative inline-flex items-center rounded-r-md px-2.5 py-1.5 text-slate-500 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
