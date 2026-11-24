import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchSubmissions,
  deleteSubmissionItem,
  setSubmissionsPage,
} from '../features/submissions/submissionsSlice';
import SubmissionTable from '../components/submissions/SubmissionTable';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Alert from '../components/common/Alert';
import { ArrowLeft, Inbox, ExternalLink, Edit } from 'lucide-react';

const FormSubmissionsPage = () => {
  const { formId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { form, items, pagination, status, error } = useSelector(
    (state) => state.submissions
  );
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }
    if (formId) {
      dispatch(fetchSubmissions({ formId, page: pagination.page, limit: pagination.limit }));
    }
  }, [dispatch, formId, isAuthenticated, navigate, pagination.page]);

  const handlePageChange = (newPage) => {
    dispatch(setSubmissionsPage(newPage));
  };

  const handleDeleteSubmission = (subId) => {
    dispatch(deleteSubmissionItem({ formId, submissionId: subId }));
  };

  if (status === 'loading' && items.length === 0) {
    return <LoadingSpinner label="Loading submissions data..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumb & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Link
            to="/admin/forms"
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-colors"
            title="Back to Forms"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                {form?.name || 'Form'} Submissions
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {form?.status}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Form ID: {formId}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            to={`/admin/forms/${formId}/edit`}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
          >
            <Edit className="w-3.5 h-3.5 text-slate-500" />
            <span>Edit Form</span>
          </Link>

          {form?.status === 'published' && (
            <Link
              to={`/forms/${formId}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Live Form</span>
            </Link>
          )}
        </div>
      </div>

      {error && <Alert type="error" message={error} />}

      {/* Submissions Table */}
      <SubmissionTable
        form={form}
        submissions={items}
        pagination={pagination}
        onPageChange={handlePageChange}
        onDeleteSubmission={handleDeleteSubmission}
      />
    </div>
  );
};

export default FormSubmissionsPage;
