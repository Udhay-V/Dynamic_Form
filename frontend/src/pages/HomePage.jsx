import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Layers,
  ArrowRight,
  PlusCircle,
  LayoutDashboard,
  CheckCircle,
  Database,
  ShieldCheck,
  Zap,
  ExternalLink,
  FileText,
  Inbox,
} from 'lucide-react';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const HomePage = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [publishedForms, setPublishedForms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublished = async () => {
      try {
        const res = await api.get('/forms?status=published&limit=6');
        setPublishedForms(res.data.data || []);
      } catch (err) {
        console.error('Failed to load published forms', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPublished();
  }, []);

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto px-4 space-y-6 pt-6">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold">
          <Zap className="w-3.5 h-3.5 text-brand-500" />
          <span>Full-Stack Technical Assessment • PostgreSQL & Redux Toolkit</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Dynamic Form Builder &{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">
            Scalable Submission
          </span>{' '}
          Engine
        </h1>

        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Create dynamic forms with custom fields, reordering, and independent server-side validation.
          Built for high concurrency and 10M+ submissions on PostgreSQL JSONB.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {isAuthenticated ? (
            <>
              <Link
                to="/admin/forms"
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition-all"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Open Admin Dashboard</span>
              </Link>
              <Link
                to="/admin/forms/new"
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create New Form</span>
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/admin/login"
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition-all"
              >
                <span>Admin Login (Credentials Ready)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Published Forms Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-600" />
              Live Published Forms
            </h2>
            <p className="text-xs text-slate-500">
              Open and test dynamic form rendering and submissions directly
            </p>
          </div>
          {isAuthenticated && (
            <Link
              to="/admin/forms"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              <span>Manage all forms</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {loading ? (
          <LoadingSpinner label="Loading published forms..." />
        ) : publishedForms.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400 text-xs">
            No published forms available yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {publishedForms.map((form) => (
              <div
                key={form.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Published
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Inbox className="w-3.5 h-3.5" />
                      {form._count?.submissions || 0} entries
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 hover:text-brand-600 transition-colors">
                    <Link to={`/forms/${form.id}`}>{form.name}</Link>
                  </h3>

                  {form.description && (
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {form.description}
                    </p>
                  )}

                  <div className="pt-2 flex flex-wrap gap-1.5 text-[10px] text-slate-500">
                    <span className="bg-slate-100 px-2 py-0.5 rounded font-mono">
                      {Array.isArray(form.fields) ? form.fields.length : 0} fields
                    </span>
                    {form.department && (
                      <span className="bg-slate-100 px-2 py-0.5 rounded">
                        Dept: {form.department}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    to={`/forms/${form.id}`}
                    className="inline-flex items-center space-x-1.5 text-xs font-bold text-brand-600 hover:text-brand-700"
                  >
                    <span>Fill & Submit</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>

                  {isAuthenticated && (
                    <Link
                      to={`/admin/forms/${form.id}/submissions`}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                    >
                      Submissions ({form._count?.submissions || 0})
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Feature Highlights Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Dynamic Reusable Components</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Render any field type (TEXT, EMAIL, NUMBER, PHONE, TEXTAREA, DATE, SELECT, RADIO, CHECKBOX)
              dynamically without touching frontend code when database schemas change.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Independent Server Validation</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Strict backend validation against field definitions: required status, email syntax, phone patterns,
              numeric bounds, and option whitelist verification.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">PostgreSQL JSONB Architecture</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Engineered for 50,000+ forms and 10M+ submissions with composite indexing,
              horizontal partitioning readiness, and connection pooling.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
