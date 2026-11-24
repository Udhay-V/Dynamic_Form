import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import {
  Layers,
  PlusCircle,
  LayoutDashboard,
  LogOut,
  LogIn,
  FileText,
  UserCheck,
} from 'lucide-react';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                FlexiForm <span className="text-xs px-2 py-0.5 rounded-full bg-brand-50 text-brand-600 font-semibold border border-brand-200">Pro</span>
              </span>
              <p className="text-[11px] text-slate-500 font-medium -mt-0.5">Dynamic Form Engine</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'bg-slate-100 text-brand-600 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Overview
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/admin/forms"
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive('/admin/forms')
                      ? 'bg-slate-100 text-brand-600 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>

                <Link
                  to="/admin/forms/new"
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive('/admin/forms/new')
                      ? 'bg-brand-50 text-brand-600 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <PlusCircle className="w-4 h-4 text-brand-500" />
                  Create Form
                </Link>
              </>
            ) : null}
          </nav>

          {/* Right Action: Auth Buttons */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-slate-100 rounded-full border border-slate-200">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-semibold text-slate-700">{user?.name || 'Admin'}</span>
                  <span className="text-[10px] uppercase font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">
                    {user?.role || 'Admin'}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/admin/login"
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 shadow-sm transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Admin Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
