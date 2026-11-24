import React from 'react';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

const icons = {
  error: XCircle,
  success: CheckCircle,
  warning: AlertCircle,
  info: Info,
};

const styles = {
  error: 'bg-rose-50 text-rose-800 border-rose-200',
  success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  warning: 'bg-amber-50 text-amber-800 border-amber-200',
  info: 'bg-brand-50 text-brand-800 border-brand-200',
};

const iconStyles = {
  error: 'text-rose-500',
  success: 'text-emerald-500',
  warning: 'text-amber-500',
  info: 'text-brand-500',
};

const Alert = ({ type = 'info', title, message, onClose, className = '' }) => {
  const Icon = icons[type] || icons.info;

  return (
    <div className={`p-4 rounded-xl border flex items-start space-x-3 text-sm ${styles[type]} ${className}`}>
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconStyles[type]}`} />
      <div className="flex-1">
        {title && <h4 className="font-bold text-sm mb-0.5">{title}</h4>}
        <p className="text-xs leading-relaxed">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 transition-colors ml-2"
        >
          &times;
        </button>
      )}
    </div>
  );
};

export default Alert;
