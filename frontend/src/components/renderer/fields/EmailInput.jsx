import React from 'react';
import { Mail } from 'lucide-react';

const EmailInput = ({ field, value, onChange, error, disabled = false }) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
        <Mail className="w-4 h-4" />
      </div>
      <input
        type="email"
        id={field.key}
        name={field.key}
        value={value ?? ''}
        placeholder={field.placeholder || 'name@example.com'}
        disabled={disabled}
        onChange={(e) => onChange(field.key, e.target.value)}
        className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm transition-all shadow-sm focus:outline-none focus:ring-2 ${
          error
            ? 'border-rose-300 bg-rose-50/30 text-rose-900 focus:border-rose-500 focus:ring-rose-200'
            : 'border-slate-300 bg-white text-slate-900 hover:border-slate-400 focus:border-brand-500 focus:ring-brand-100'
        } disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed`}
      />
    </div>
  );
};

export default EmailInput;
