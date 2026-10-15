import React, { useState, useEffect } from 'react';
import permissionService from '../../services/permissionService';
import {
  UserCheck,
  ShieldAlert,
  UserX,
  Stethoscope,
  Building,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Lock,
  Plus,
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmModal from '../../components/common/ConfirmModal';

export const PatientPermissions = () => {
  const [permissions, setPermissions] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Grant Form state
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [notes, setNotes] = useState('');
  const [granting, setGranting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Revoke state
  const [revokingPermission, setRevokingPermission] = useState(null);
  const [revoking, setRevoking] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [permsData, doctorsData] = await Promise.all([
        permissionService.getMyPermissions(),
        permissionService.getAvailableDoctors(),
      ]);
      setPermissions(permsData);
      setDoctors(doctorsData);
      if (doctorsData.length > 0 && !selectedDoctorId) {
        setSelectedDoctorId(doctorsData[0].id);
      }
    } catch (err) {
      console.error('Failed to load permissions data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleGrant = async (e) => {
    e.preventDefault();
    if (!selectedDoctorId) return;

    setGranting(true);
    setFeedback({ type: '', message: '' });

    try {
      await permissionService.grantPermission(selectedDoctorId, notes);
      setFeedback({
        type: 'success',
        message: 'Consent successfully granted and anchored in blockchain ledger block!',
      });
      setNotes('');
      await loadData();
    } catch (err) {
      console.error('Failed to grant consent', err);
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Failed to grant consent to selected doctor.',
      });
    } finally {
      setGranting(false);
    }
  };

  const handleRevokeConfirm = async () => {
    if (!revokingPermission) return;
    setRevoking(true);

    try {
      await permissionService.revokePermission(revokingPermission.id);
      setFeedback({
        type: 'success',
        message: 'Doctor access revoked with immediate effect. Physician can no longer access your records.',
      });
      setRevokingPermission(null);
      await loadData();
    } catch (err) {
      console.error('Failed to revoke permission', err);
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Failed to revoke doctor access.',
      });
    } finally {
      setRevoking(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" message="Loading consent access control..." />;
  }

  const activePerms = permissions.filter((p) => p.status === 'ACTIVE');
  const pastPerms = permissions.filter((p) => p.status !== 'ACTIVE');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Doctor Consent & Access Control
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Patient sovereign consent management. Grant or revoke physician access to your clinical records.
        </p>
      </div>

      {feedback.message && (
        <div className={`p-4 rounded-xl text-xs flex items-center gap-2.5 ${
          feedback.type === 'success'
            ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Grant Access Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Authorize New Physician</h2>
            <p className="text-xs text-slate-500">Provide temporary or permanent consultation access</p>
          </div>
        </div>

        {doctors.length === 0 ? (
          <p className="text-xs text-slate-500 italic">No registered doctors available to authorize.</p>
        ) : (
          <form onSubmit={handleGrant} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Physician <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-teal-500"
                >
                  {doctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.fullName} ({doc.specialization} - {doc.hospitalAffiliation || 'Hospital'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Consultation Purpose / Notes
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Cardiology second opinion, regular consultation..."
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={granting}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white shadow-sm disabled:opacity-50 transition flex items-center gap-2"
              >
                {granting ? <LoadingSpinner size="sm" /> : <UserCheck className="w-4 h-4" />}
                <span>Grant Consultation Consent</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Active Permissions */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Active Authorized Doctors ({activePerms.length})</h3>
            <p className="text-xs text-slate-500">Physicians with real-time access to your medical history</p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
            Immediate Revocation Ready
          </span>
        </div>

        {activePerms.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            You have not granted access to any doctors currently.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {activePerms.map((perm) => (
              <div key={perm.id} className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-slate-50 transition">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 mt-1">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">
                        {perm.doctorName || 'Dr. Medical Specialist'}
                      </h4>
                      <StatusBadge status={perm.status} type="status" />
                    </div>
                    <div className="text-xs text-indigo-700 font-medium mt-0.5">
                      {perm.doctorSpecialization} • License: {perm.doctorLicense || 'Verified'}
                    </div>
                    <div className="flex items-center gap-4 text-[11px] text-slate-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Building className="w-3 h-3" />
                        {perm.doctorHospital || 'Clinic'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Granted: {new Date(perm.grantedAt).toLocaleDateString()}
                      </span>
                    </div>
                    {perm.notes && (
                      <div className="mt-2 text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                        Purpose: <span className="italic">{perm.notes}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => setRevokingPermission(perm)}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition flex items-center gap-1.5"
                  >
                    <UserX className="w-4 h-4" />
                    <span>Revoke Access</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Revoked / Past Permissions */}
      {pastPerms.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden opacity-85">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">Revoked Access History</h3>
            <p className="text-xs text-slate-500">Previously authorized doctors whose consent has terminated</p>
          </div>
          <div className="divide-y divide-slate-100">
            {pastPerms.map((perm) => (
              <div key={perm.id} className="p-4 sm:p-5 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-slate-800">
                    {perm.doctorName} ({perm.doctorSpecialization})
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Revoked on: {perm.revokedAt ? new Date(perm.revokedAt).toLocaleString() : 'N/A'}
                  </div>
                </div>
                <StatusBadge status={perm.status} type="status" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Revoke Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(revokingPermission)}
        onClose={() => setRevokingPermission(null)}
        onConfirm={handleRevokeConfirm}
        title="Revoke Physician Access Consent"
        message={`Are you sure you want to revoke access from ${revokingPermission?.doctorName}? The doctor will immediately lose all permissions to view or download your medical records.`}
        confirmText="Yes, Revoke Access Immediately"
        isDangerous={true}
      />
    </div>
  );
};

export default PatientPermissions;
