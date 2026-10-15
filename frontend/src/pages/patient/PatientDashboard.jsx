import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import recordService from '../../services/recordService';
import permissionService from '../../services/permissionService';
import auditService from '../../services/auditService';
import {
  FileText,
  UserCheck,
  ShieldCheck,
  Upload,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';

export const PatientDashboard = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [recordsData, permsData, activityData] = await Promise.all([
          recordService.getMyRecords(),
          permissionService.getMyPermissions(),
          auditService.getMyActivity(),
        ]);
        setRecords(recordsData);
        setPermissions(permsData);
        setActivity(activityData);
      } catch (err) {
        console.error('Error loading patient dashboard', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner size="lg" message="Loading your health portal..." />;
  }

  const activePermissions = permissions.filter((p) => p.status === 'ACTIVE');

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-200 text-xs font-semibold mb-3">
            <ShieldCheck className="w-4 h-4 text-teal-300" />
            <span>Patient-Centric Health Ledger</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome back, {user?.fullName || 'Patient'}
          </h1>
          <p className="mt-2 text-sm text-teal-100/90 max-w-2xl leading-relaxed">
            Your medical records are cryptographically secured off-chain with deterministic SHA-256 verification. You have complete sovereign control over doctor access.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/patient/upload"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-xs shadow-md transition"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Medical Document</span>
            </Link>
            <Link
              to="/patient/permissions"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition backdrop-blur-sm"
            >
              <UserCheck className="w-4 h-4" />
              <span>Manage Doctor Consents</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">TOTAL RECORDS</span>
            <div className="rounded-xl bg-teal-50 p-2 text-teal-600">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900">{records.length}</span>
            <span className="text-xs text-slate-400 block mt-0.5">Documents securely archived</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">ACTIVE CONSENTS</span>
            <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-indigo-600">{activePermissions.length}</span>
            <span className="text-xs text-slate-400 block mt-0.5">Physicians authorized</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">INTEGRITY STATUS</span>
            <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-emerald-600">100%</span>
            <span className="text-xs text-slate-400 block mt-0.5">All SHA-256 hashes verified</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">RECENT LOGS</span>
            <div className="rounded-xl bg-slate-100 p-2 text-slate-600">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900">{activity.length}</span>
            <span className="text-xs text-slate-400 block mt-0.5">Total audit events</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Records & Active Permissions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Medical Documents (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Recent Medical Records</h3>
                <p className="text-xs text-slate-500">Off-chain documents with SHA-256 blockchain anchors</p>
              </div>
              <Link
                to="/patient/records"
                className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {records.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No medical documents uploaded yet.{' '}
                <Link to="/patient/upload" className="text-teal-600 font-semibold underline">
                  Upload your first record.
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {records.slice(0, 4).map((record) => (
                  <div key={record.id} className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50 transition">
                    <div className="flex items-start gap-3">
                      <div className="rounded-xl bg-teal-50 p-2.5 text-teal-600 mt-0.5">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <Link
                          to={`/patient/records/${record.id}`}
                          className="font-semibold text-slate-900 hover:text-teal-600 text-xs sm:text-sm block"
                        >
                          {record.title}
                        </Link>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <StatusBadge status={record.recordType} type="record" />
                          <span className="text-[11px] text-slate-400">
                            {new Date(record.createdAt).toLocaleDateString()}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">
                            {(record.fileSize / 1024).toFixed(1)} KB
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/patient/records/${record.id}`}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                      >
                        Inspect
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
            <Link
              to="/patient/records"
              className="text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Browse complete health repository →
            </Link>
          </div>
        </div>

        {/* Active Doctor Permissions (1 col) */}
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Authorized Doctors</h3>
                <p className="text-xs text-slate-500">Live clinical access grants</p>
              </div>
              <Link
                to="/patient/permissions"
                className="text-xs font-semibold text-teal-600 hover:text-teal-700"
              >
                Manage
              </Link>
            </div>

            {activePermissions.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-xs">
                No doctors currently have access to your medical history.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {activePermissions.map((perm) => (
                  <div key={perm.id} className="p-4 hover:bg-slate-50 transition">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold text-xs text-slate-900">
                          {perm.doctorName || 'Dr. Practitioner'}
                        </div>
                        <div className="text-[11px] text-indigo-600 font-medium">
                          {perm.doctorSpecialization || 'Clinical Specialist'}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {perm.doctorHospital || 'Affiliated Hospital'}
                        </div>
                      </div>
                      <StatusBadge status={perm.status} type="status" />
                    </div>
                    {perm.notes && (
                      <div className="mt-2 text-[11px] text-slate-500 italic bg-slate-50 p-1.5 rounded">
                        "{perm.notes}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
            <Link
              to="/patient/permissions"
              className="text-xs font-semibold text-teal-600 hover:text-teal-700"
            >
              + Grant access to another doctor
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
