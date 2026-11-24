import React from 'react';

const CheckboxInput = ({ field, value, onChange, error, disabled = false }) => {
  const options = Array.isArray(field.options) ? field.options : [];
  const isMultiOption = options.length > 0;

  if (!isMultiOption) {
    // Single boolean checkbox
    const isChecked = Boolean(value);

    return (
      <div className="pt-1">
        <label
          className={`flex items-start space-x-3 p-3 rounded-xl border text-sm cursor-pointer transition-all ${
            isChecked
              ? 'border-brand-500 bg-brand-50/50 text-brand-900 font-medium'
              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input
            type="checkbox"
            name={field.key}
            checked={isChecked}
            disabled={disabled}
            onChange={(e) => onChange(field.key, e.target.checked)}
            className="w-4 h-4 rounded text-brand-600 border-slate-300 focus:ring-brand-500 mt-0.5"
          />
          <span className="text-xs select-none">
            {field.placeholder || `I agree / confirm ${field.label}`}
          </span>
        </label>
      </div>
    );
  }

  // Multi-option checkbox group
  const currentSelections = Array.isArray(value) ? value : [];

  const handleToggle = (optVal) => {
    let newSelections;
    if (currentSelections.includes(optVal)) {
      newSelections = currentSelections.filter((v) => v !== optVal);
    } else {
      newSelections = [...currentSelections, optVal];
    }
    onChange(field.key, newSelections);
  };

  return (
    <div className="space-y-2 pt-1">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
        {options.map((opt, idx) => {
          const val = typeof opt === 'object' && opt !== null ? opt.value : opt;
          const label = typeof opt === 'object' && opt !== null ? opt.label : opt;
          const isChecked = currentSelections.includes(val);

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
                type="checkbox"
                name={`${field.key}[]`}
                value={val}
                checked={isChecked}
                disabled={disabled}
                onChange={() => handleToggle(val)}
                className="w-4 h-4 rounded text-brand-600 border-slate-300 focus:ring-brand-500"
              />
              <span className="text-xs select-none">{label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default CheckboxInput;
