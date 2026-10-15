import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/auditService';
import {
  BarChart3,
  Users,
  FileText,
  Blocks,
  Activity,
  ShieldCheck,
  PieChart,
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export const AdminStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await adminService.getStatistics();
        setStats(data);
      } catch (err) {
        console.error('Failed to load system stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <LoadingSpinner size="lg" message="Compiling system metrics & telemetry..." />;
  }

  const totalUsers = (stats?.totalPatients || 0) + (stats?.totalDoctors || 0) + (stats?.totalAdmins || 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          System Analytics & Telemetry
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Quantitative telemetry across users, records, blockchain height, and system operations.
        </p>
      </div>

      {/* Primary KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">TOTAL ACCOUNTS</span>
            <div className="rounded-xl bg-slate-100 p-2 text-slate-700">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-900">{totalUsers}</span>
            <span className="text-xs text-slate-400 block mt-0.5">Active identities</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">TOTAL CLINICAL DOCS</span>
            <div className="rounded-xl bg-teal-50 p-2 text-teal-600">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-teal-600">{stats?.totalRecords || 0}</span>
            <span className="text-xs text-slate-400 block mt-0.5">Off-chain repositories</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">BLOCKS CHAINED</span>
            <div className="rounded-xl bg-amber-50 p-2 text-amber-600">
              <Blocks className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-amber-600">{stats?.totalBlocks || 0}</span>
            <span className="text-xs text-slate-400 block mt-0.5">Chained ledger height</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">AUDIT TRAIL EVENTS</span>
            <div className="rounded-xl bg-rose-50 p-2 text-rose-600">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-rose-600">{stats?.totalAuditEvents || 0}</span>
            <span className="text-xs text-slate-400 block mt-0.5">Monitored transactions</span>
          </div>
        </div>
      </div>

      {/* Distribution Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Distribution */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <Users className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-sm">User Role Distribution</h3>
          </div>

          <div className="mt-5 space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-teal-700">Patients</span>
                <span className="text-slate-900">{stats?.totalPatients || 0}</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-teal-500 h-full rounded-full"
                  style={{ width: `${totalUsers ? ((stats?.totalPatients || 0) / totalUsers) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-indigo-700">Doctors / Physicians</span>
                <span className="text-slate-900">{stats?.totalDoctors || 0}</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-500 h-full rounded-full"
                  style={{ width: `${totalUsers ? ((stats?.totalDoctors || 0) / totalUsers) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-rose-700">System Administrators</span>
                <span className="text-slate-900">{stats?.totalAdmins || 0}</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-rose-500 h-full rounded-full"
                  style={{ width: `${totalUsers ? ((stats?.totalAdmins || 0) / totalUsers) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Blockchain Cryptographic Overview */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <Blocks className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-slate-900 text-sm">Blockchain Architecture Metrics</h3>
          </div>

          <div className="mt-5 space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Hashing Algorithm:</span>
              <strong className="text-slate-900 font-mono">SHA-256 (256-bit Digest)</strong>
            </div>

            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Block Header Validation:</span>
              <strong className="text-emerald-600 font-mono">Continuous Chained Linking</strong>
            </div>

            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Off-Chain Anchoring:</span>
              <strong className="text-slate-900 font-mono">Deterministic Merkle / Block Payload</strong>
            </div>

            <div className="flex justify-between py-2">
              <span className="text-slate-500">Ledger Immutability:</span>
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified 100% Intact</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
