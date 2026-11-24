import React from 'react';
import { Database, ShieldCheck, Cpu } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center space-x-2">
        
          </div>

          <div className="flex items-center space-x-6">
            <span className="flex items-center gap-1 text-slate-600">
              <Database className="w-3.5 h-3.5 text-brand-600" />
              PostgreSQL JSONB Architecture
            </span>
            <span className="flex items-center gap-1 text-slate-600">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Independent Server Validation
            </span>
            <span className="flex items-center gap-1 text-slate-600">
              <Cpu className="w-3.5 h-3.5 text-purple-600" />
              10M+ Scale Ready
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
