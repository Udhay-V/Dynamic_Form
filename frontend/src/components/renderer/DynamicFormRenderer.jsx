import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setFieldValue,
  setClientErrors,
  clearErrors,
  submitFormData,
  resetSubmissionState,
} from '../../features/formRender/formRenderSlice';
import DynamicField from './DynamicField';
import Alert from '../common/Alert';
import { Send, CheckCircle2, RefreshCw, Mail, Phone, Building2 } from 'lucide-react';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}$/;

const DynamicFormRenderer = ({ form }) => {
  const dispatch = useDispatch();
  const { values, clientErrors, serverErrors, submitStatus, submissionReceipt, error } =
    useSelector((state) => state.formRender);

  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const fields = Array.isArray(form?.fields) ? form.fields : [];

  const handleFieldChange = (key, val) => {
    dispatch(setFieldValue({ key, value: val }));
  };

  /**
   * Client-side validation: provides instant feedback before dispatching to server
   */
  const validateForm = () => {
    const errors = {};

    fields.forEach((field) => {
      const val = values[field.key];
      const isRequired = Boolean(field.required);
      const type = (field.type || 'TEXT').toUpperCase();

      const isEmpty =
        val === undefined ||
        val === null ||
        (typeof val === 'string' && val.trim() === '') ||
        (Array.isArray(val) && val.length === 0);

      if (isRequired && isEmpty) {
        errors[field.key] = `${field.label} is required.`;
        return;
      }

      if (!isEmpty) {
        if (type === 'EMAIL' && !EMAIL_REGEX.test(String(val).trim())) {
          errors[field.key] = 'Please enter a valid email address.';
        } else if (type === 'PHONE' && !PHONE_REGEX.test(String(val).trim())) {
          errors[field.key] = 'Please enter a valid phone number.';
        } else if (type === 'PASSWORD') {
          const strVal = String(val);
          const minLen = Number(field.validation?.minLength ?? field.minLength ?? 6);
          const maxLen = field.validation?.maxLength ?? field.maxLength;
          const requireStrong = Boolean(field.validation?.requireStrong);

          if (strVal.length < minLen) {
            errors[field.key] = `Password must be at least ${minLen} characters.`;
          } else if (maxLen !== undefined && strVal.length > Number(maxLen)) {
            errors[field.key] = `Password must not exceed ${maxLen} characters.`;
          } else if (requireStrong) {
            const hasUpper = /[A-Z]/.test(strVal);
            const hasLower = /[a-z]/.test(strVal);
            const hasDigit = /[0-9]/.test(strVal);
            const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(strVal);
            if (!hasUpper || !hasLower || !hasDigit || !hasSpecial) {
              errors[field.key] = 'Must include uppercase, lowercase, number, and special character.';
            }
          }
        } else if (type === 'TEXT' || type === 'TEXTAREA') {
          const strVal = String(val).trim();
          const minLen = field.validation?.minLength ?? field.minLength;
          const maxLen = field.validation?.maxLength ?? field.maxLength;
          if (minLen !== undefined && strVal.length < Number(minLen)) {
            errors[field.key] = `Must be at least ${minLen} characters.`;
          } else if (maxLen !== undefined && strVal.length > Number(maxLen)) {
            errors[field.key] = `Must not exceed ${maxLen} characters.`;
          }
        } else if (type === 'NUMBER') {
          const num = Number(val);
          const min = field.validation?.min ?? field.min;
          const max = field.validation?.max ?? field.max;
          if (isNaN(num)) {
            errors[field.key] = 'Must be a valid number.';
          } else if (min !== undefined && num < Number(min)) {
            errors[field.key] = `Must be at least ${min}.`;
          } else if (max !== undefined && num > Number(max)) {
            errors[field.key] = `Must not exceed ${max}.`;
          }
        }
      }
    });

    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      dispatch(setClientErrors(validationErrors));
      return;
    }

    dispatch(clearErrors());
    dispatch(submitFormData({ formId: form.id, data: values }));
  };

  const handleReset = () => {
    dispatch(resetSubmissionState());
    setHasAttemptedSubmit(false);
  };

  // Success Confirmation Screen
  if (submitStatus === 'succeeded' && submissionReceipt) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl max-w-2xl mx-auto text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm shadow-emerald-500/20">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Submission Received
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
            Thank you for your submission!
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Your response for <span className="font-semibold text-slate-800">"{form.name}"</span> has been securely recorded.
          </p>
        </div>

        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left space-y-1.5 font-mono text-xs text-slate-600">
          <div>
            <span className="text-slate-400">Submission ID:</span>{' '}
            <span className="text-slate-900 font-semibold">{submissionReceipt.submissionId}</span>
          </div>
          <div>
            <span className="text-slate-400">Timestamp:</span>{' '}
            <span className="text-slate-900">
              {new Date(submissionReceipt.submittedAt).toLocaleString()}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Submit Another Response</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden max-w-3xl mx-auto">
      {/* Form Brand Header */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 sm:p-10 relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-400/30">
              Live Form
            </span>
            {form.department && (
              <span className="text-[10px] uppercase font-semibold text-slate-300">
                • {form.department}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {form.name}
          </h1>

          {form.description && (
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              {form.description}
            </p>
          )}

          {(form.mail || form.mobile) && (
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-400">
              {form.mail && (
                <div className="flex items-center space-x-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{form.mail}</span>
                </div>
              )}
              {form.mobile && (
                <div className="flex items-center space-x-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{form.mobile}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-6">
        {error && (
          <Alert
            type="error"
            title="Validation Error"
            message={typeof error === 'string' ? error : 'Please review the highlighted fields below.'}
          />
        )}

        {fields.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs font-medium">
            This form has no configured fields.
          </div>
        ) : (
          <div className="space-y-6">
            {fields.map((field) => {
              const fieldError = clientErrors[field.key] || serverErrors[field.key];
              return (
                <DynamicField
                  key={field.id || field.key}
                  field={field}
                  value={values[field.key]}
                  onChange={handleFieldChange}
                  error={fieldError}
                  disabled={submitStatus === 'submitting'}
                />
              );
            })}
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
          <p className="text-[11px] text-slate-400 font-medium">
            Fields marked with <span className="text-rose-500 font-bold">*</span> are required.
          </p>

          <button
            type="submit"
            disabled={submitStatus === 'submitting' || fields.length === 0}
            className="inline-flex items-center space-x-2 px-7 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 active:scale-98 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            <span>{submitStatus === 'submitting' ? 'Submitting...' : 'Submit Form'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default DynamicFormRenderer;
