import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  FileText,
  Upload,
  UserCheck,
  ShieldCheck,
  History,
  Users,
  FolderLock,
  BarChart3,
  Blocks,
  ShieldAlert,
  User,
  X,
  Lock,
} from 'lucide-react';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const role = user?.role;

  const patientNav = [
    { name: 'Dashboard', path: '/patient/dashboard', icon: LayoutDashboard },
    { name: 'My Records', path: '/patient/records', icon: FileText },
    { name: 'Upload Record', path: '/patient/upload', icon: Upload },
    { name: 'Manage Doctor Access', path: '/patient/permissions', icon: UserCheck },
    { name: 'Integrity Verification', path: '/patient/verify', icon: ShieldCheck },
    { name: 'Activity History', path: '/patient/activity', icon: History },
    { name: 'Patient Profile', path: '/patient/profile', icon: User },
  ];

  const doctorNav = [
    { name: 'Doctor Dashboard', path: '/doctor/dashboard', icon: LayoutDashboard },
    { name: 'Accessible Patients', path: '/doctor/patients', icon: Users },
    { name: 'Authorized Records', path: '/doctor/records', icon: FolderLock },
    { name: 'Integrity Verification', path: '/doctor/verify', icon: ShieldCheck },
    { name: 'Access History', path: '/doctor/activity', icon: History },
  ];

  const adminNav = [
    { name: 'Admin Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'User Management', path: '/admin/users', icon: Users },
    { name: 'System Statistics', path: '/admin/stats', icon: BarChart3 },
    { name: 'Blockchain Ledger', path: '/admin/blockchain', icon: Blocks },
    { name: 'Audit History', path: '/admin/audit', icon: ShieldAlert },
  ];

  const currentNav =
    role === 'PATIENT' ? patientNav : role === 'DOCTOR' ? doctorNav : adminNav;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white border-r border-slate-200/80 transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-0 max-lg:-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-200/80">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-base tracking-tight">CareChain</span>
              <span className="block text-[10px] text-teal-600 font-medium tracking-wide uppercase">EHR Portal</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>PORTAL MODE</span>
          <span className="font-semibold text-slate-700 tracking-wider">
            {role || 'AUTHENTICATED'}
          </span>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
          {currentNav.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => {
                if (window.innerWidth < 1024) onClose();
              }}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-teal-50 text-teal-700 shadow-sm border border-teal-100/80'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 m-3 rounded-xl bg-gradient-to-b from-teal-50/50 to-cyan-50/30 border border-teal-100/60 text-xs text-slate-600">
          <div className="flex items-center gap-2 font-semibold text-teal-900 mb-1">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>SHA-256 Protected</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Record hashes verified on local blockchain ledger.
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
