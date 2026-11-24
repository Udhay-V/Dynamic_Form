import React from 'react';
import {
  ChevronUp,
  ChevronDown,
  Settings,
  Trash2,
  Asterisk,
  Layers,
} from 'lucide-react';

const TYPE_COLORS = {
  TEXT: 'bg-blue-100 text-blue-700 border-blue-200',
  EMAIL: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  NUMBER: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  PHONE: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  TEXTAREA: 'bg-amber-100 text-amber-700 border-amber-200',
  DATE: 'bg-rose-100 text-rose-700 border-rose-200',
  SELECT: 'bg-purple-100 text-purple-700 border-purple-200',
  RADIO: 'bg-teal-100 text-teal-700 border-teal-200',
  CHECKBOX: 'bg-orange-100 text-orange-700 border-orange-200',
};

const FieldCard = ({
  field,
  index,
  totalFields,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
}) => {
  const typeKey = (field.type || 'TEXT').toUpperCase();
  const colorClass = TYPE_COLORS[typeKey] || 'bg-slate-100 text-slate-700 border-slate-200';

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 hover:border-slate-300 shadow-sm transition-all group">
      <div className="flex items-start justify-between gap-4">
        {/* Left: Reorder Controls & Index */}
        <div className="flex items-center space-x-2">
          <div className="flex flex-col space-y-0.5">
            <button
              type="button"
              disabled={index === 0}
              onClick={() => onMoveUp(index)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Move Up"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={index === totalFields - 1}
              onClick={() => onMoveDown(index)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Move Down"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${colorClass}`}>
                {typeKey}
              </span>
              <span className="text-sm font-bold text-slate-900">{field.label}</span>
              {field.required && (
                <span className="inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 bg-rose-50 text-rose-600 rounded border border-rose-200">
                  Required
                </span>
              )}
            </div>

            <p className="text-[11px] font-mono text-slate-400 mt-1">
              key: <span className="text-slate-600 font-semibold">{field.key}</span>
              {field.placeholder && (
                <span className="ml-2 font-sans text-slate-400">
                  • placeholder: "{field.placeholder}"
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={() => onEdit(field)}
            className="p-2 rounded-xl text-slate-500 hover:text-brand-600 hover:bg-brand-50 border border-slate-200 transition-colors"
            title="Configure Field"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(field.id)}
            className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors"
            title="Delete Field"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Options preview for Select, Radio, Checkbox */}
      {['SELECT', 'RADIO', 'CHECKBOX'].includes(typeKey) && Array.isArray(field.options) && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
          <span className="text-[10px] font-semibold text-slate-400 self-center mr-1">
            Options ({field.options.length}):
          </span>
          {field.options.map((opt, i) => {
            const val = typeof opt === 'object' && opt !== null ? opt.label : opt;
            return (
              <span
                key={i}
                className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200"
              >
                {val}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FieldCard;
