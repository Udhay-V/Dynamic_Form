import React from 'react';
import {
  Type,
  Mail,
  Hash,
  Phone,
  AlignLeft,
  Calendar,
  ListFilter,
  CheckCircle2,
  CheckSquare,
  Plus,
} from 'lucide-react';

const FIELD_TYPES = [
  { type: 'TEXT', label: 'Short Text', icon: Type, description: 'Single line text input' },
  { type: 'EMAIL', label: 'Email', icon: Mail, description: 'Email address with validation' },
  { type: 'NUMBER', label: 'Number', icon: Hash, description: 'Numeric values & range' },
  { type: 'PHONE', label: 'Phone', icon: Phone, description: 'Phone number format' },
  { type: 'TEXTAREA', label: 'Long Text', icon: AlignLeft, description: 'Multi-line comments & notes' },
  { type: 'DATE', label: 'Date', icon: Calendar, description: 'Date selection' },
  { type: 'SELECT', label: 'Dropdown', icon: ListFilter, description: 'Single select from options' },
  { type: 'RADIO', label: 'Radio Choice', icon: CheckCircle2, description: 'Single option radio buttons' },
  { type: 'CHECKBOX', label: 'Checkbox', icon: CheckSquare, description: 'Multiple choices or toggle' },
];

const FieldPalette = ({ onAddField }) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm sticky top-20">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Field Palette</h3>
          <p className="text-[11px] text-slate-500">Click to add to your form canvas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
        {FIELD_TYPES.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.type}
              type="button"
              onClick={() => onAddField(item.type, item.label)}
              className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-brand-500 hover:bg-brand-50/50 group text-left transition-all shadow-xs"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-brand-100 text-slate-600 group-hover:text-brand-600 flex items-center justify-center transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 group-hover:text-brand-700">
                    {item.label}
                  </h4>
                  <p className="text-[10px] text-slate-400">{item.description}</p>
                </div>
              </div>
              <div className="w-6 h-6 rounded-full bg-slate-100 group-hover:bg-brand-600 group-hover:text-white flex items-center justify-center text-slate-400 transition-colors">
                <Plus className="w-3.5 h-3.5" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FieldPalette;
