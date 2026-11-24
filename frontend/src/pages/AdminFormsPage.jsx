import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchForms,
  deleteForm,
  toggleFormStatus,
  setFilters,
  setPage,
} from '../features/forms/formsSlice';
import {
  PlusCircle,
  Search,
  FileText,
  Inbox,
  CheckCircle,
  Clock,
  ExternalLink,
  Edit,
  Trash2,
  Copy,
  Layers,
  Filter,
} from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Pagination from '../components/common/Pagination';
import Alert from '../components/common/Alert';

const AdminFormsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, pagination, status, error, filters } = useSelector((state) => state.forms);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }
    dispatch(
      fetchForms({
        page: pagination.page,
        limit: pagination.limit,
        status: filters.status,
        search: filters.search,
      })
    );
  }, [dispatch, isAuthenticated, navigate, pagination.page, filters.status, filters.search]);

  const handleSearchChange = (e) => {
    dispatch(setFilters({ search: e.target.value }));
  };

  const handleStatusFilter = (st) => {
    dispatch(setFilters({ status: st }));
  };

  const handlePageChange = (newPage) => {
    dispatch(setPage(newPage));
  };

  const handleToggleStatus = (form) => {
    dispatch(toggleFormStatus({ formId: form.id, currentStatus: form.status }));
  };

  const handleDelete = (formId, name) => {
    if (window.confirm(`Are you sure you want to delete form "${name}" and all of its submissions?`)) {
      dispatch(deleteForm(formId));
    }
  };

  const handleCopyLink = (formId) => {
    const url = `${window.location.origin}/forms/${formId}`;
    navigator.clipboard.writeText(url);
    alert('Public form link copied to clipboard!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Form Management Dashboard
          </h1>
          <p className="text-xs text-slate-500">
            Create, configure, publish forms and monitor real-time submissions
          </p>
        </div>

        <Link
          to="/admin/forms/new"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 active:scale-98 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Form</span>
        </Link>
      </div>

      {error && <Alert type="error" message={error} />}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Status Tabs */}
        <div className="flex items-center space-x-1 w-full md:w-auto">
          {['all', 'published', 'draft'].map((tab) => (
            <button
              key={tab}
              onClick={() => handleStatusFilter(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors ${
                filters.status === tab
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab === 'all' ? 'All Forms' : tab}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={filters.search}
            onChange={handleSearchChange}
            placeholder="Search forms by name..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-500"
          />
        </div>
      </div>

      {/* Forms Grid / List */}
      {status === 'loading' && items.length === 0 ? (
        <LoadingSpinner label="Loading dashboard forms..." />
      ) : items.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">No forms found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              {filters.search || filters.status !== 'all'
                ? 'No forms matched your search or filter criteria.'
                : 'Get started by creating your first dynamic form!'}
            </p>
          </div>
          <Link
            to="/admin/forms/new"
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Create Form Now</span>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Form Details</th>
                  <th className="py-3.5 px-4">Fields</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Submissions</th>
                  <th className="py-3.5 px-4">Created At</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((form) => {
                  const isPublished = form.status === 'published';
                  const fieldCount = Array.isArray(form.fields) ? form.fields.length : 0;
                  const submissionCount = form._count?.submissions || 0;

                  return (
                    <tr key={form.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Name & Details */}
                      <td className="py-4 px-4 max-w-xs">
                        <Link
                          to={`/admin/forms/${form.id}/edit`}
                          className="font-bold text-slate-900 hover:text-brand-600 transition-colors text-sm block truncate"
                        >
                          {form.name}
                        </Link>
                        {form.description && (
                          <p className="text-slate-400 text-[11px] truncate mt-0.5">
                            {form.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                          {form.department && <span>Dept: {form.department}</span>}
                          {form.role && <span>• Role: {form.role}</span>}
                        </div>
                      </td>

                      {/* Fields Count */}
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 font-mono text-slate-700 font-semibold text-[11px]">
                          {fieldCount} fields
                        </span>
                      </td>

                      {/* Status Toggle Badge */}
                      <td className="py-4 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(form)}
                          className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border transition-all ${
                            isPublished
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                          }`}
                          title="Click to toggle status"
                        >
                          {isPublished ? (
                            <>
                              <CheckCircle className="w-3 h-3 text-emerald-600" />
                              <span>Published</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3 text-amber-600" />
                              <span>Draft</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Submissions */}
                      <td className="py-4 px-4">
                        <Link
                          to={`/admin/forms/${form.id}/submissions`}
                          className="inline-flex items-center space-x-1 text-slate-700 font-bold hover:text-brand-600 group"
                        >
                          <Inbox className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-600" />
                          <span>{submissionCount}</span>
                          <span className="text-[10px] font-normal text-slate-400">entries</span>
                        </Link>
                      </td>

                      {/* Created At */}
                      <td className="py-4 px-4 text-slate-500 font-mono text-[11px]">
                        {new Date(form.createdAt).toLocaleDateString()}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-4 px-4 text-right space-x-1">
                        {isPublished && (
                          <button
                            type="button"
                            onClick={() => handleCopyLink(form.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-brand-50 border border-slate-200 transition-colors"
                            title="Copy Public Link"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <Link
                          to={`/forms/${form.id}`}
                          className="inline-block p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 transition-colors"
                          title="Open Form Live"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          to={`/admin/forms/${form.id}/edit`}
                          className="inline-block p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-brand-50 border border-slate-200 transition-colors"
                          title="Edit Form"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(form.id, form.name)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors"
                          title="Delete Form"
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

          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            totalItems={pagination.total}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default AdminFormsPage;
