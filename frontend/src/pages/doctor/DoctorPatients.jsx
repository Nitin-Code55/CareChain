import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import permissionService from '../../services/permissionService';
import {
  Users,
  Search,
  Calendar,
  Heart,
  Phone,
  FileText,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';

export const DoctorPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const data = await permissionService.getAccessiblePatients();
        setPatients(data);
      } catch (err) {
        console.error('Failed to load consenting patients', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const filtered = patients.filter((p) => {
    return (
      p.patientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.patientBloodGroup?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Consenting Patients Directory
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Patients who have explicitly granted you clinical EHR access via the blockchain permission registry.
        </p>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by patient name, blood group, or consultation purpose..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Grid of Patients */}
      {loading ? (
        <LoadingSpinner size="lg" message="Loading consenting patients..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Consenting Patients Found"
          message={
            searchQuery
              ? 'No patients match your search filter.'
              : 'You do not currently have active access consent from any patients.'
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{p.patientName}</h3>
                    <span className="text-[11px] text-slate-400 font-mono">Patient ID: #{p.patientId}</span>
                  </div>
                  <StatusBadge status={p.status} type="status" />
                </div>

                <div className="grid grid-cols-2 gap-2 my-3 text-xs">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">BLOOD GROUP</span>
                    <strong className="text-slate-800">{p.patientBloodGroup || 'Not specified'}</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">GENDER</span>
                    <strong className="text-slate-800">{p.patientGender || 'Not specified'}</strong>
                  </div>
                </div>

                {p.notes && (
                  <div className="text-xs text-slate-600 bg-indigo-50/50 p-2.5 rounded-xl border border-indigo-100/60 mb-3">
                    <span className="font-semibold text-indigo-900 block text-[10px] uppercase">
                      Patient Consent Notes:
                    </span>
                    <p className="mt-0.5 italic">"{p.notes}"</p>
                  </div>
                )}

                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Granted on: {new Date(p.grantedAt).toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                <Link
                  to={`/doctor/records?patientId=${p.patientId}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>View Clinical Records</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorPatients;
