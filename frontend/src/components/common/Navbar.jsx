import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, LogOut, User, Menu, ShieldCheck } from 'lucide-react';
import StatusBadge from './StatusBadge';

export const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 sm:px-6 backdrop-blur-md">
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <div className="hidden sm:flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-white shadow-sm shadow-teal-500/20">
            <Shield className="h-4 w-4" />
          </div>
          <div>
            <span className="text-sm font-bold tracking-tight text-slate-900">
              CareChain
            </span>
            <span className="text-xs text-slate-400 block -mt-1 font-mono">
              v1.0 Academic
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-50 border border-teal-200/60 text-[11px] font-medium text-teal-700">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
          <span>Ledger Active</span>
        </div>

        {user && (
          <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-semibold text-slate-800">
                {user.fullName || user.email}
              </div>
              <div className="flex items-center justify-end gap-1 mt-0.5">
                <StatusBadge status={user.role} type="role" />
              </div>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 border border-slate-200 text-slate-600 font-semibold text-xs shadow-inner">
              {user.fullName ? user.fullName.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
            </div>

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
