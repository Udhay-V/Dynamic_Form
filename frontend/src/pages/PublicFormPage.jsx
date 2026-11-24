import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPublicForm, resetSubmissionState } from '../features/formRender/formRenderSlice';
import DynamicFormRenderer from '../components/renderer/DynamicFormRenderer';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Alert from '../components/common/Alert';
import { Clock, ArrowLeft, Layers, Lock } from 'lucide-react';

const PublicFormPage = () => {
  const { formId } = useParams();
  const dispatch = useDispatch();

  const { form, fetchStatus, error } = useSelector((state) => state.formRender);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(resetSubmissionState());
    if (formId) {
      dispatch(fetchPublicForm(formId));
    }
  }, [dispatch, formId]);

  if (fetchStatus === 'loading') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner label="Loading dynamic form definition..." />
      </div>
    );
  }

  // Handle draft state for public users
  if (fetchStatus === 'failed' && error?.isDraft) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
          <Clock className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Form Not Published Yet</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          This form is currently saved as a Draft by the administrator and is not accepting public responses.
        </p>

        {isAuthenticated ? (
          <Link
            to={`/admin/forms/${formId}/edit`}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            <span>Open in Form Builder to Publish</span>
          </Link>
        ) : (
          <Link
            to="/"
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Home</span>
          </Link>
        )}
      </div>
    );
  }

  if (fetchStatus === 'failed') {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <Lock className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Form Unavailable</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          {error?.message || 'The requested form could not be found or has been deleted.'}
        </p>
        <Link
          to="/"
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Go to Homepage</span>
        </Link>
      </div>
    );
  }

  if (!form) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <DynamicFormRenderer form={form} />
    </div>
  );
};

export default PublicFormPage;
