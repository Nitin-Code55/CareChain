import React, { useState, useEffect } from 'react';
import { auditService } from '../../services/auditService';
import {
  ShieldAlert,
  Search,
  Filter,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';

export const AdminAudit = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('ALL');
  const [selectedOutcome, setSelectedOutcome] = useState('ALL');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const data = await auditService.getAllAuditLogs();
        setLogs(data);
      } catch (err) {
        console.error('Failed to load system audit trails', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      (log.userName && log.userName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.userEmail && log.userEmail.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.actionDetails && log.actionDetails.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.ipAddress && log.ipAddress.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesEvent = selectedEvent === 'ALL' || log.eventType === selectedEvent;
    const matchesOutcome = selectedOutcome === 'ALL' || log.outcome === selectedOutcome;
    return matchesSearch && matchesEvent && matchesOutcome;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          System Security & Institutional Audit Trails
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Forensic immutable audit log of all system requests, clinical access attempts, and permission grants.
        </p>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by user email, actor name, action context, or IP..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="py-2 px-3 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-rose-500"
          >
            <option value="ALL">All Event Operations</option>
            <option value="RECORD_CREATED">RECORD_CREATED</option>
            <option value="RECORD_VIEWED">RECORD_VIEWED</option>
            <option value="RECORD_DOWNLOADED">RECORD_DOWNLOADED</option>
            <option value="PERMISSION_GRANTED">PERMISSION_GRANTED</option>
            <option value="PERMISSION_REVOKED">PERMISSION_REVOKED</option>
            <option value="INTEGRITY_VERIFIED">INTEGRITY_VERIFIED</option>
            <option value="USER_LOGIN">USER_LOGIN</option>
            <option value="USER_REGISTERED">USER_REGISTERED</option>
          </select>

          <select
            value={selectedOutcome}
            onChange={(e) => setSelectedOutcome(e.target.value)}
            className="py-2 px-3 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-rose-500"
          >
            <option value="ALL">All Outcomes</option>
            <option value="SUCCESS">Success</option>
            <option value="FAILURE">Failure</option>
            <option value="DENIED">Denied</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      {loading ? (
        <LoadingSpinner size="lg" message="Loading forensic audit records..." />
      ) : filteredLogs.length === 0 ? (
        <EmptyState
          icon={ShieldAlert}
          title="No Audit Records Found"
          message="No operational logs matched your filter criteria."
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 sm:px-6">Timestamp</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Operation</th>
                  <th className="py-3 px-4">Outcome</th>
                  <th className="py-3 px-4">Context / Action Details</th>
                  <th className="py-3 px-4 text-right">Origin IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap text-slate-500">
                      <div className="font-semibold text-slate-800">
                        {new Date(log.timestamp).toLocaleDateString()}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-900">{log.userName || 'Anonymous'}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{log.userEmail || 'N/A'}</div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px]">
                      <span className="p-1 rounded bg-slate-100 border border-slate-200 text-slate-700">
                        {log.eventType}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={log.outcome} type="outcome" />
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 max-w-md">
                      <div className="truncate">{log.actionDetails}</div>
                      {log.recordId && (
                        <span className="text-[10px] text-rose-600 font-mono block mt-0.5">
                          Target Record #{log.recordId}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono text-[11px] text-slate-400 whitespace-nowrap">
                      {log.ipAddress || '127.0.0.1'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAudit;
