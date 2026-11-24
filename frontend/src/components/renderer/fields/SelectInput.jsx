import React from 'react';
import { ChevronDown } from 'lucide-react';

const SelectInput = ({ field, value, onChange, error, disabled = false }) => {
  const options = Array.isArray(field.options) ? field.options : [];

  return (
    <div className="relative">
      <select
        id={field.key}
        name={field.key}
        value={value ?? ''}
        disabled={disabled}
        onChange={(e) => onChange(field.key, e.target.value)}
        className={`w-full appearance-none px-3.5 py-2.5 rounded-xl border text-sm transition-all shadow-sm focus:outline-none focus:ring-2 pr-10 ${
          error
            ? 'border-rose-300 bg-rose-50/30 text-rose-900 focus:border-rose-500 focus:ring-rose-200'
            : 'border-slate-300 bg-white text-slate-900 hover:border-slate-400 focus:border-brand-500 focus:ring-brand-100'
        } disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed`}
      >
        <option value="">{field.placeholder || '-- Please Select an Option --'}</option>
        {options.map((opt, idx) => {
          const val = typeof opt === 'object' && opt !== null ? opt.value : opt;
          const label = typeof opt === 'object' && opt !== null ? opt.label : opt;
          return (
            <option key={idx} value={val}>
              {label}
            </option>
          );
        })}
      </select>
      <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
        <ChevronDown className="w-4 h-4" />
      </div>
    </div>
  );
};

export default SelectInput;
