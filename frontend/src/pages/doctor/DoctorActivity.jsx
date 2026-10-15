import React, { useState, useEffect } from 'react';
import auditService from '../../services/auditService';
import {
  History,
  Search,
  Filter,
  Stethoscope,
  Calendar,
  Clock,
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';

export const DoctorActivity = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [outcomeFilter, setOutcomeFilter] = useState('ALL');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const data = await auditService.getMyActivity();
        setLogs(data);
      } catch (err) {
        console.error('Failed to load physician audit logs', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      (log.actionDetails && log.actionDetails.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.eventType && log.eventType.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesOutcome = outcomeFilter === 'ALL' || log.outcome === outcomeFilter;
    return matchesSearch && matchesOutcome;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Physician Clinical Access Audit Trail
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Chronological audit of patient records viewed, downloaded, or cryptographically verified by your account.
        </p>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search logs by action details or operation..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <select
            value={outcomeFilter}
            onChange={(e) => setOutcomeFilter(e.target.value)}
            className="w-full sm:w-auto py-2 px-3 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Outcomes</option>
            <option value="SUCCESS">Success</option>
            <option value="FAILURE">Failure</option>
            <option value="DENIED">Denied</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <LoadingSpinner size="lg" message="Loading clinical access logs..." />
      ) : filteredLogs.length === 0 ? (
        <EmptyState
          icon={History}
          title="No Clinical Activity Recorded"
          message="No activity logs matched your search filters."
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 sm:px-6">Timestamp</th>
                  <th className="py-3 px-4">Event Operation</th>
                  <th className="py-3 px-4">Outcome</th>
                  <th className="py-3 px-4">Action Details</th>
                  <th className="py-3 px-4 text-right">Client Origin</th>
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
                        <div className="text-[10px] text-indigo-600 font-mono mt-0.5">
                          Target Record #{log.recordId}
                        </div>
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

export default DoctorActivity;
