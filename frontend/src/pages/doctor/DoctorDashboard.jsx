import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import permissionService from '../../services/permissionService';
import recordService from '../../services/recordService';
import auditService from '../../services/auditService';
import {
  Users,
  FolderLock,
  ShieldCheck,
  History,
  FileText,
  ArrowRight,
  Stethoscope,
  Eye,
  Download,
  Calendar,
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';

export const DoctorDashboard = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [records, setRecords] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDoctorData = async () => {
      try {
        setLoading(true);
        const [patientsData, recordsData, activityData] = await Promise.all([
          permissionService.getAccessiblePatients(),
          recordService.getDoctorRecords(),
          auditService.getMyActivity(),
        ]);
        setPatients(patientsData);
        setRecords(recordsData);
        setActivity(activityData);
      } catch (err) {
        console.error('Error loading doctor dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    loadDoctorData();
  }, []);

  if (loading) {
    return <LoadingSpinner size="lg" message="Loading physician clinical portal..." />;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-700 via-indigo-800 to-slate-900 p-6 sm:p-8 text-white shadow-md">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold mb-3">
          <Stethoscope className="w-4 h-4 text-indigo-300" />
          <span>Physician Clinical EHR Portal</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Welcome, {user?.fullName || 'Doctor'}
        </h1>
        <p className="mt-2 text-sm text-indigo-100/90 max-w-2xl leading-relaxed">
          Access patient records granted through sovereign cryptographic consent. All access and downloads are permanently logged in the audit ledger.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">AUTHORIZED PATIENTS</span>
            <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900">{patients.length}</span>
            <span className="text-xs text-slate-400 block mt-0.5">Active consent grants</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">ACCESSIBLE RECORDS</span>
            <div className="rounded-xl bg-teal-50 p-2 text-teal-600">
              <FolderLock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-teal-600">{records.length}</span>
            <span className="text-xs text-slate-400 block mt-0.5">Clinical documents</span>
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
            <span className="text-2xl font-bold text-emerald-600">Verified</span>
            <span className="text-xs text-slate-400 block mt-0.5">SHA-256 byte hashes intact</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">AUDITED SESSIONS</span>
            <div className="rounded-xl bg-slate-100 p-2 text-slate-600">
              <History className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900">{activity.length}</span>
            <span className="text-xs text-slate-400 block mt-0.5">Clinical actions recorded</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Authorized Records (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Authorized Patient Documents</h3>
                <p className="text-xs text-slate-500">Clinical documents with active patient consent</p>
              </div>
              <Link
                to="/doctor/records"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {records.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No accessible medical records found. When patients grant you consent, their documents will appear here.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {records.slice(0, 4).map((r) => (
                  <div key={r.id} className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50 transition">
                    <div className="flex items-start gap-3">
                      <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600 mt-0.5">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <Link
                          to={`/doctor/records/${r.id}`}
                          className="font-semibold text-slate-900 hover:text-indigo-600 text-xs sm:text-sm block"
                        >
                          {r.title}
                        </Link>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className="text-xs font-medium text-slate-700">Patient: {r.patientName}</span>
                          <StatusBadge status={r.recordType} type="record" />
                          <span className="text-[11px] text-slate-400 font-mono">
                            {(r.fileSize / 1024).toFixed(1)} KB
                          </span>
                        </div>
                      </div>
                    </div>

                    <Link
                      to={`/doctor/records/${r.id}`}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                    >
                      Inspect
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
            <Link
              to="/doctor/records"
              className="text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Browse all authorized patient files →
            </Link>
          </div>
        </div>

        {/* Consenting Patients List (1 col) */}
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Consenting Patients</h3>
                <p className="text-xs text-slate-500">Active patient grants</p>
              </div>
              <Link
                to="/doctor/patients"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
              >
                View
              </Link>
            </div>

            {patients.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-xs">
                No patients currently granting consent.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {patients.map((p) => (
                  <div key={p.id} className="p-4 hover:bg-slate-50 transition">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold text-xs text-slate-900">
                          {p.patientName}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Blood: <strong className="text-slate-700">{p.patientBloodGroup || 'N/A'}</strong> • {p.patientGender || 'N/A'}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Granted: {new Date(p.grantedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <StatusBadge status={p.status} type="status" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
            <Link
              to="/doctor/patients"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
            >
              Inspect all consenting patients →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
