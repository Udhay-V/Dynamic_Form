import React from 'react';
import { FileText, Building2, UserCircle2, Phone, Mail } from 'lucide-react';

const FormMetadataEditor = ({ form, onChange }) => {
  const handleChange = (field, value) => {
    onChange({ [field]: value });
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
        <FileText className="w-5 h-5 text-brand-600" />
        <div>
          <h3 className="text-sm font-bold text-slate-900">Form Header & Metadata</h3>
          <p className="text-[11px] text-slate-500">Configure title, contact, department & admin details</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Form Name */}
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
            Form Name *
          </label>
          <input
            type="text"
            required
            value={form.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="e.g. Customer Satisfaction Survey 2026"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-500"
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
            Description
          </label>
          <textarea
            rows={2}
            value={form.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Describe the purpose of this form for participants..."
            className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-500 resize-none"
          />
        </div>

        {/* Contact Email */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
            Contact Email (mail)
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="email"
              value={form.mail || ''}
              onChange={(e) => handleChange('mail', e.target.value)}
              placeholder="contact@company.com"
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-500"
            />
          </div>
        </div>

        {/* Mobile */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
            Mobile Number
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="tel"
              value={form.mobile || ''}
              onChange={(e) => handleChange('mobile', e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-500"
            />
          </div>
        </div>

        {/* Department */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
            Department
          </label>
          <div className="relative">
            <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={form.department || ''}
              onChange={(e) => handleChange('department', e.target.value)}
              placeholder="e.g. Human Resources, Operations"
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-500"
            />
          </div>
        </div>

        {/* Designation */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
            Designation
          </label>
          <input
            type="text"
            value={form.designation || ''}
            onChange={(e) => handleChange('designation', e.target.value)}
            placeholder="e.g. Lead Analyst, Manager"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-500"
          />
        </div>

        {/* Gender & Role */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
            Gender (Target / Creator)
          </label>
          <select
            value={form.gender || ''}
            onChange={(e) => handleChange('gender', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-500 bg-white"
          >
            <option value="">-- Select Gender --</option>
            <option value="All">All</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
            Role
          </label>
          <input
            type="text"
            value={form.role || ''}
            onChange={(e) => handleChange('role', e.target.value)}
            placeholder="e.g. Admin, Coordinator, Manager"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-500"
          />
        </div>
      </div>
    </div>
  );
};

export default FormMetadataEditor;
