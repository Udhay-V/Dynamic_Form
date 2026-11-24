import React from 'react';
import TextInput from './fields/TextInput';
import EmailInput from './fields/EmailInput';
import PasswordInput from './fields/PasswordInput';
import NumberInput from './fields/NumberInput';
import PhoneInput from './fields/PhoneInput';
import TextareaInput from './fields/TextareaInput';
import DateInput from './fields/DateInput';
import SelectInput from './fields/SelectInput';
import RadioInput from './fields/RadioInput';
import CheckboxInput from './fields/CheckboxInput';
import { AlertCircle } from 'lucide-react';

const FIELD_COMPONENTS = {
  TEXT: TextInput,
  EMAIL: EmailInput,
  PASSWORD: PasswordInput,
  NUMBER: NumberInput,
  PHONE: PhoneInput,
  TEXTAREA: TextareaInput,
  DATE: DateInput,
  SELECT: SelectInput,
  RADIO: RadioInput,
  CHECKBOX: CheckboxInput,
};

const DynamicField = ({ field, value, onChange, error, disabled = false }) => {
  const typeKey = (field.type || 'TEXT').toUpperCase();
  const FieldComponent = FIELD_COMPONENTS[typeKey] || TextInput;

  return (
    <div className="space-y-1.5 transition-all">
      {/* Label & Required Indicator */}
      <div className="flex items-center justify-between">
        <label htmlFor={field.key} className="block text-xs font-bold text-slate-700 tracking-wide uppercase">
          {field.label}
          {field.required && <span className="text-rose-500 ml-1 font-bold">*</span>}
        </label>
        {field.helpText && (
          <span className="text-[11px] text-slate-400 font-normal">{field.helpText}</span>
        )}
      </div>

      {/* Dynamic Input Component */}
      <FieldComponent
        field={field}
        value={value}
        onChange={onChange}
        error={Boolean(error)}
        disabled={disabled}
      />

      {/* Validation Error Message */}
      {error && (
        <p className="text-xs text-rose-600 font-medium flex items-center gap-1.5 pt-0.5 animate-fadeIn">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};

export default DynamicField;
