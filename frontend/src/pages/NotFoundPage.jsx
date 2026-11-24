import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[65vh] flex items-center justify-center px-4 text-center">
      <div className="space-y-4 max-w-md">
        <span className="text-6xl font-black text-slate-200 block font-mono">404</span>
        <h2 className="text-2xl font-bold text-slate-900">Page Not Found</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          The requested page could not be located. It might have been removed, renamed, or does not exist.
        </p>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
