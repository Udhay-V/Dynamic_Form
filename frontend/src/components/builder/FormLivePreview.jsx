import React, { useState } from 'react';
import DynamicField from '../renderer/DynamicField';
import { Eye, Send } from 'lucide-react';

const FormLivePreview = ({ form }) => {
  const [previewValues, setPreviewValues] = useState({});

  const handleFieldChange = (key, val) => {
    setPreviewValues((prev) => ({ ...prev, [key]: val }));
  };

  const fields = Array.isArray(form.fields) ? form.fields : [];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
      {/* Form Header */}
      <div className="border-b border-slate-100 pb-5">
        <div className="flex items-center space-x-2 text-brand-600 text-xs font-bold uppercase tracking-wider mb-1">
          <Eye className="w-4 h-4" />
          <span>Interactive Preview</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          {form.name || 'Untitled Form'}
        </h2>
        {form.description && (
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{form.description}</p>
        )}

        {(form.department || form.role) && (
          <div className="flex flex-wrap gap-2 mt-3 text-[11px] text-slate-500">
            {form.department && (
              <span className="bg-slate-100 px-2 py-0.5 rounded-md font-medium text-slate-600">
                Dept: {form.department}
              </span>
            )}
            {form.role && (
              <span className="bg-slate-100 px-2 py-0.5 rounded-md font-medium text-slate-600">
                Role: {form.role}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Fields */}
      {fields.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
          <p className="text-xs text-slate-400 font-medium">
            No fields added yet. Add fields from the left palette to preview them live!
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {fields.map((field) => (
            <DynamicField
              key={field.id || field.key}
              field={field}
              value={previewValues[field.key]}
              onChange={handleFieldChange}
              error={null}
            />
          ))}

          <div className="pt-4 border-t border-slate-100">
            <button
              type="button"
              disabled
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-brand-600/70 text-white text-xs font-bold shadow-sm flex items-center justify-center space-x-2 cursor-default"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Form (Preview Mode)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormLivePreview;
