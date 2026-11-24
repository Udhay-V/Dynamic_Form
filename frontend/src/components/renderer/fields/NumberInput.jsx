import React from 'react';
import { Hash } from 'lucide-react';

const NumberInput = ({ field, value, onChange, error, disabled = false }) => {
  const min = field.validation?.min ?? field.min;
  const max = field.validation?.max ?? field.max;

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
        <Hash className="w-4 h-4" />
      </div>
      <input
        type="number"
        id={field.key}
        name={field.key}
        value={value ?? ''}
        min={min}
        max={max}
        placeholder={field.placeholder || '0'}
        disabled={disabled}
        onChange={(e) => onChange(field.key, e.target.value === '' ? '' : Number(e.target.value))}
        className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm transition-all shadow-sm focus:outline-none focus:ring-2 ${
          error
            ? 'border-rose-300 bg-rose-50/30 text-rose-900 focus:border-rose-500 focus:ring-rose-200'
            : 'border-slate-300 bg-white text-slate-900 hover:border-slate-400 focus:border-brand-500 focus:ring-brand-100'
        } disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed`}
      />
    </div>
  );
};

export default NumberInput;
