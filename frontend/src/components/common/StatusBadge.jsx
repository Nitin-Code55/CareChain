import React from 'react';
import { ShieldCheck, ShieldAlert, AlertCircle, FileText, Activity } from 'lucide-react';

export const StatusBadge = ({ status, type = 'status' }) => {
  if (type === 'role') {
    const roleConfig = {
      PATIENT: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Patient' },
      DOCTOR: { bg: 'bg-blue-50 text-blue-700 border-blue-200', label: 'Doctor' },
      ADMIN: { bg: 'bg-purple-50 text-purple-700 border-purple-200', label: 'Admin' },
    };
    const c = roleConfig[status] || { bg: 'bg-slate-100 text-slate-700 border-slate-200', label: status };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${c.bg}`}>
        {c.label}
      </span>
    );
  }

  if (type === 'integrity') {
    if (status === 'VERIFIED') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          VERIFIED
        </span>
      );
    }
    if (status === 'MISMATCH') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 shadow-sm">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
          MISMATCH
        </span>
      );
    }
    if (status === 'FILE_MISSING') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 shadow-sm">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
          FILE MISSING
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
        <Activity className="w-3.5 h-3.5" />
        {status || 'UNCHECKED'}
      </span>
    );
  }

  if (type === 'recordType') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
        <FileText className="w-3 h-3 text-slate-500" />
        {status}
      </span>
    );
  }

  const isActive = status === 'ACTIVE' || status === 'SUCCESS' || status === true;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
        isActive
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
          : 'bg-slate-100 text-slate-600 border-slate-200'
      }`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
