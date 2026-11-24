import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { Plus, Trash2, HelpCircle } from 'lucide-react';

const FieldConfigModal = ({ isOpen, onClose, field, onSave }) => {
  const [formData, setFormData] = useState({
    label: '',
    key: '',
    placeholder: '',
    defaultValue: '',
    required: false,
    options: [],
    min: '',
    max: '',
    minLength: '',
    maxLength: '',
    requireStrong: false,
  });

  const [newOption, setNewOption] = useState('');
  const [keyError, setKeyError] = useState('');

  useEffect(() => {
    if (field) {
      setFormData({
        label: field.label || '',
        key: field.key || '',
        placeholder: field.placeholder || '',
        defaultValue: field.defaultValue ?? '',
        required: Boolean(field.required),
        options: Array.isArray(field.options) ? [...field.options] : [],
        min: field.validation?.min ?? field.min ?? '',
        max: field.validation?.max ?? field.max ?? '',
        minLength: field.validation?.minLength ?? field.minLength ?? '',
        maxLength: field.validation?.maxLength ?? field.maxLength ?? '',
        requireStrong: Boolean(field.validation?.requireStrong),
      });
      setKeyError('');
      setNewOption('');
    }
  }, [field, isOpen]);

  if (!field) return null;

  const typeKey = (field.type || 'TEXT').toUpperCase();
  const hasOptions = ['SELECT', 'RADIO', 'CHECKBOX'].includes(typeKey);

  const handleKeyChange = (val) => {
    // Only allow alphanumeric and underscore
    const sanitized = val.replace(/[^a-zA-Z0-9_]/g, '');
    setFormData((prev) => ({ ...prev, key: sanitized }));
    if (!sanitized) {
      setKeyError('Field key is required');
    } else {
      setKeyError('');
    }
  };

  const handleAddOption = (e) => {
    e.preventDefault();
    if (newOption.trim()) {
      setFormData((prev) => ({
        ...prev,
        options: [...prev.options, newOption.trim()],
      }));
      setNewOption('');
    }
  };

  const handleRemoveOption = (index) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));
  };

  const handleOptionEdit = (index, val) => {
    const updated = [...formData.options];
    updated[index] = val;
    setFormData((prev) => ({ ...prev, options: updated }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.key.trim()) {
      setKeyError('Field key is required');
      return;
    }

    const updates = {
      label: formData.label.trim() || field.label,
      key: formData.key.trim(),
      placeholder: formData.placeholder,
      defaultValue: formData.defaultValue,
      required: formData.required,
      options: hasOptions ? formData.options : undefined,
      validation: {
        ...(formData.min !== '' && { min: Number(formData.min) }),
        ...(formData.max !== '' && { max: Number(formData.max) }),
        ...(formData.minLength !== '' && { minLength: Number(formData.minLength) }),
        ...(formData.maxLength !== '' && { maxLength: Number(formData.maxLength) }),
        ...(formData.requireStrong && { requireStrong: true }),
      },
    };

    onSave(field.id, updates);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Configure ${field.label || typeKey} Field`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Field Label */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
            Field Label *
          </label>
          <input
            type="text"
            required
            value={formData.label}
            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-500"
          />
        </div>

        {/* Field Key */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
              Unique Field Key *
            </label>
            <span className="text-[10px] text-slate-400 font-mono">e.g. firstName, user_email</span>
          </div>
          <input
            type="text"
            required
            value={formData.key}
            onChange={(e) => handleKeyChange(e.target.value)}
            className={`w-full px-3.5 py-2.5 rounded-xl border font-mono text-sm focus:outline-none focus:ring-2 ${
              keyError
                ? 'border-rose-300 bg-rose-50 text-rose-900 focus:ring-rose-100'
                : 'border-slate-300 text-slate-900 focus:ring-brand-100 focus:border-brand-500'
            }`}
          />
          {keyError && <p className="text-xs text-rose-600 mt-1">{keyError}</p>}
        </div>

        {/* Placeholder & Default Value */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Placeholder
            </label>
            <input
              type="text"
              value={formData.placeholder}
              onChange={(e) => setFormData({ ...formData, placeholder: e.target.value })}
              placeholder="e.g. Enter value..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Default Value
            </label>
            <input
              type="text"
              value={formData.defaultValue}
              onChange={(e) => setFormData({ ...formData, defaultValue: e.target.value })}
              placeholder="Pre-filled value"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-500"
            />
          </div>
        </div>

        {/* Required Status */}
        <div className="pt-1">
          <label className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100/60 transition-colors">
            <input
              type="checkbox"
              checked={formData.required}
              onChange={(e) => setFormData({ ...formData, required: e.target.checked })}
              className="w-4 h-4 rounded text-brand-600 border-slate-300 focus:ring-brand-500"
            />
            <div>
              <span className="text-xs font-bold text-slate-800">Mark as Mandatory Field</span>
              <p className="text-[11px] text-slate-500">Submissions without this field will be rejected.</p>
            </div>
          </label>
        </div>

        {/* Options Management for Select, Radio, Checkbox */}
        {hasOptions && (
          <div className="pt-2 border-t border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Options Configuration ({formData.options.length}) *
              </label>
            </div>

            {/* List of current options */}
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {formData.options.map((opt, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => handleOptionEdit(idx, e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-brand-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(idx)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add new option */}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                placeholder="New option name..."
                className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-brand-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddOption(e);
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddOption}
                className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>
          </div>
        )}

        {/* Range Constraints for NUMBER */}
        {typeKey === 'NUMBER' && (
          <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Minimum Value
              </label>
              <input
                type="number"
                value={formData.min}
                onChange={(e) => setFormData({ ...formData, min: e.target.value })}
                placeholder="e.g. 0"
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Maximum Value
              </label>
              <input
                type="number"
                value={formData.max}
                onChange={(e) => setFormData({ ...formData, max: e.target.value })}
                placeholder="e.g. 100"
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
              />
            </div>
          </div>
        )}

        {/* Character Length Validation for TEXT, PASSWORD, TEXTAREA */}
        {['TEXT', 'PASSWORD', 'TEXTAREA'].includes(typeKey) && (
          <div className="pt-2 border-t border-slate-200 space-y-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
              Length Validation Constraints
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Min Characters
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.minLength}
                  onChange={(e) => setFormData({ ...formData, minLength: e.target.value })}
                  placeholder={typeKey === 'PASSWORD' ? 'e.g. 8' : 'e.g. 2'}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Max Characters
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.maxLength}
                  onChange={(e) => setFormData({ ...formData, maxLength: e.target.value })}
                  placeholder={typeKey === 'PASSWORD' ? 'e.g. 32' : 'e.g. 100'}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-brand-500"
                />
              </div>
            </div>

            {typeKey === 'PASSWORD' && (
              <label className="flex items-center space-x-2 pt-1 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.requireStrong}
                  onChange={(e) => setFormData({ ...formData, requireStrong: e.target.checked })}
                  className="w-4 h-4 rounded text-brand-600 border-slate-300 focus:ring-brand-500"
                />
                <span>Require Strong Password (uppercase, lowercase, number, special char)</span>
              </label>
            )}
          </div>
        )}

        {/* Informational Validation helpers */}
        {typeKey === 'PHONE' && (
          <div className="pt-2 border-t border-slate-200">
            <p className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              📞 <strong>Mobile Validation:</strong> Automatically validates 10-digit Indian numbers (with optional +91 prefix) as well as international phone formats.
            </p>
          </div>
        )}

        {typeKey === 'EMAIL' && (
          <div className="pt-2 border-t border-slate-200">
            <p className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              ✉️ <strong>Email Validation:</strong> Automatically enforces standard RFC-compliant email address structure (<code className="text-brand-600">user@domain.com</code>).
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            Save Field Changes
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default FieldConfigModal;
