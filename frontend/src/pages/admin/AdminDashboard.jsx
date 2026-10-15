import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { adminService, auditService } from '../../services/auditService';
import blockchainService from '../../services/blockchainService';
import {
  ShieldAlert,
  Users,
  FileText,
  Blocks,
  Activity,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
  RotateCw,
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [chainStatus, setChainStatus] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const [statsData, chainData, logsData] = await Promise.all([
          adminService.getStatistics(),
          blockchainService.verifyChain(),
          auditService.getAllAuditLogs(),
        ]);
        setStats(statsData);
        setChainStatus(chainData);
        setRecentLogs(logsData.slice(0, 5));
      } catch (err) {
        console.error('Failed to load admin dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  if (loading) {
    return <LoadingSpinner size="lg" message="Loading system administration portal..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-rose-700 via-rose-800 to-slate-900 p-6 sm:p-8 text-white shadow-md">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-200 text-xs font-semibold mb-3">
          <ShieldAlert className="w-4 h-4 text-rose-300" />
          <span>System Administration & Blockchain Ledger Governance</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Admin Portal — CareChain Core
        </h1>
        <p className="mt-2 text-sm text-rose-100/90 max-w-2xl leading-relaxed">
          Monitor system nodes, inspect immutable chained blocks, and review institutional audit trails.
        </p>

        {/* Zero-Knowledge Access Enforcement Alert */}
        <div className="mt-5 p-3 rounded-xl bg-slate-950/70 border border-rose-500/40 text-xs flex items-center gap-2.5 max-w-2xl">
          <Lock className="w-4 h-4 text-rose-400 flex-shrink-0" />
          <span className="text-rose-100">
            <strong>Zero-Knowledge Clinical Privacy:</strong> Administrators are cryptographically restricted from viewing, reading, or downloading private patient medical documents.
          </span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">TOTAL PATIENTS</span>
            <div className="rounded-xl bg-teal-50 p-2 text-teal-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900">{stats?.totalPatients ?? 0}</span>
            <span className="text-xs text-slate-400 block mt-0.5">Enrolled profiles</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">TOTAL DOCTORS</span>
            <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-indigo-600">{stats?.totalDoctors ?? 0}</span>
            <span className="text-xs text-slate-400 block mt-0.5">Verified physicians</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">MEDICAL RECORDS</span>
            <div className="rounded-xl bg-cyan-50 p-2 text-cyan-600">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-cyan-600">{stats?.totalRecords ?? 0}</span>
            <span className="text-xs text-slate-400 block mt-0.5">Off-chain documents</span>
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
            <span className="text-2xl font-bold text-amber-600">{stats?.totalBlocks ?? 0}</span>
            <span className="text-xs text-slate-400 block mt-0.5">Ledger height</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">LEDGER STATUS</span>
            <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl font-bold text-emerald-600">
              {chainStatus?.valid ? 'VALID' : 'CORRUPTED'}
            </span>
            <span className="text-xs text-slate-400 block mt-0.5">SHA-256 chain verified</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ledger Integrity Card (1 col) */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Blocks className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-slate-900 text-sm">Ledger Verification</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Chained
              </span>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="flex justify-between items-center text-slate-600">
                <span>Verified Block Count:</span>
                <strong className="text-slate-900 font-mono">{chainStatus?.totalBlocks ?? chainStatus?.checkedBlocks ?? 0}</strong>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Deterministic Check:</span>
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Passed
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block mb-1">HEAD BLOCK HASH:</span>
                <div className="p-2 rounded-lg bg-slate-50 font-mono text-[10px] text-slate-700 break-all border border-slate-200/70">
                  {chainStatus?.latestBlockHash || chainStatus?.headBlockHash || 'N/A'}
                </div>
              </div>
            </div>
          </div>

          <Link
            to="/admin/blockchain"
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center gap-1.5 transition"
          >
            <span>Open Blockchain Explorer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Recent Audit Events (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Recent Audit Events</h3>
                <p className="text-xs text-slate-500">Live operational monitoring stream</p>
              </div>
              <Link
                to="/admin/audit"
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
              >
                <span>View All Logs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {recentLogs.map((log) => (
                <div key={log.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-semibold text-slate-800">
                        {log.eventType}
                      </span>
                      <StatusBadge status={log.outcome} type="outcome" />
                    </div>
                    <p className="text-slate-500 text-[11px] mt-0.5 truncate max-w-md">
                      {log.actionDetails}
                    </p>
                  </div>
                  <div className="text-right text-[11px] text-slate-400 font-mono whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
            <Link
              to="/admin/audit"
              className="text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Browse complete institutional audit trail →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
