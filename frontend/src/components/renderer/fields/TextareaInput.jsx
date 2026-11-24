import React from 'react';

const TextareaInput = ({ field, value, onChange, error, disabled = false }) => {
  return (
    <div>
      <textarea
        id={field.key}
        name={field.key}
        rows={4}
        value={value ?? ''}
        placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
        disabled={disabled}
        onChange={(e) => onChange(field.key, e.target.value)}
        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all shadow-sm focus:outline-none focus:ring-2 resize-y ${
          error
            ? 'border-rose-300 bg-rose-50/30 text-rose-900 focus:border-rose-500 focus:ring-rose-200'
            : 'border-slate-300 bg-white text-slate-900 hover:border-slate-400 focus:border-brand-500 focus:ring-brand-100'
        } disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed`}
      />
    </div>
  );
};

export default TextareaInput;
