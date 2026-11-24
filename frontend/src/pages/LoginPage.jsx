import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearAuthError } from '../features/auth/authSlice';
import { Lock, Mail, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';
import Alert from '../components/common/Alert';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, status, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/forms');
    }
    return () => {
      dispatch(clearAuthError());
    };
  }, [isAuthenticated, navigate, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  const handleFillDemo = () => {
    setEmail('admin@formbuilder.com');
    setPassword('AdminPassword123!');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-6 h-6 text-brand-400" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Admin Sign In</h2>
          <p className="text-xs text-slate-500">Access form builder, publishing controls & submissions</p>
        </div>

        {error && (
          <Alert type="error" message={error} onClose={() => dispatch(clearAuthError())} />
        )}

        {/* Demo Credentials Quick-Fill Pill */}
        <div className="bg-brand-50/70 border border-brand-200 rounded-2xl p-4 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-brand-900 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-brand-600" />
              Demo Admin Credentials
            </span>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-[11px] font-bold text-brand-600 hover:text-brand-800 underline uppercase"
            >
              Fill Credentials
            </button>
          </div>
          <div className="font-mono text-[11px] text-slate-600">
            <div>Email: <span className="font-semibold text-slate-900">admin@formbuilder.com</span></div>
            <div>Password: <span className="font-semibold text-slate-900">AdminPassword123!</span></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@formbuilder.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full inline-flex items-center justify-center space-x-2 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-98 text-white text-xs font-bold shadow-md transition-all disabled:opacity-50"
          >
            <span>{status === 'loading' ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
