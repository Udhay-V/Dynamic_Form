import React from 'react';

const RadioInput = ({ field, value, onChange, error, disabled = false }) => {
  const options = Array.isArray(field.options) ? field.options : [];

  return (
    <div className="space-y-2 pt-1">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
        {options.map((opt, idx) => {
          const val = typeof opt === 'object' && opt !== null ? opt.value : opt;
          const label = typeof opt === 'object' && opt !== null ? opt.label : opt;
          const isChecked = String(value) === String(val);

          return (
            <label
              key={idx}
              className={`flex items-center space-x-3 p-3 rounded-xl border text-sm cursor-pointer transition-all ${
                isChecked
                  ? 'border-brand-500 bg-brand-50/50 text-brand-900 font-medium ring-1 ring-brand-500'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <input
                type="radio"
                name={field.key}
                value={val}
                checked={isChecked}
                disabled={disabled}
                onChange={() => onChange(field.key, val)}
                className="w-4 h-4 text-brand-600 border-slate-300 focus:ring-brand-500"
              />
              <span className="text-xs select-none">{label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default RadioInput;
