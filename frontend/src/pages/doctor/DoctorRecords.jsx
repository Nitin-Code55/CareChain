import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import recordService from '../../services/recordService';
import {
  FileText,
  Search,
  Filter,
  Eye,
  Download,
  ShieldCheck,
  Calendar,
  User,
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';

export const DoctorRecords = () => {
  const [searchParams] = useSearchParams();
  const patientIdFilter = searchParams.get('patientId');

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setLoading(true);
        const data = await recordService.getDoctorRecords();
        setRecords(data);
      } catch (err) {
        console.error('Failed to load doctor records', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);

  const handleDownload = async (record) => {
    try {
      setDownloadingId(record.id);
      await recordService.downloadRecord(record.id, record.originalFilename);
    } catch (err) {
      console.error('Failed to download record', err);
      alert('Failed to download medical document.');
    } finally {
      setDownloadingId(null);
    }
  };

  const filteredRecords = records.filter((r) => {
    const matchesPatient = !patientIdFilter || r.patientId === Number(patientIdFilter);
    const matchesType = selectedType === 'ALL' || r.recordType === selectedType;
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.description && r.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesPatient && matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Authorized Clinical Records
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Patient medical histories accessible via verified blockchain consent grants.
          </p>
        </div>
        {patientIdFilter && (
          <Link
            to="/doctor/records"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-200"
          >
            Clear Patient #{patientIdFilter} Filter
          </Link>
        )}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by patient name, document title, or diagnosis..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full sm:w-auto py-2 px-3 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Categories</option>
            <option value="PRESCRIPTION">Prescription</option>
            <option value="LAB_REPORT">Lab Report</option>
            <option value="SCAN_IMAGE">Scan / Radiology</option>
            <option value="DISCHARGE_SUMMARY">Discharge Summary</option>
            <option value="OTHER">Other Clinical Doc</option>
          </select>
        </div>
      </div>

      {/* Records Table */}
      {loading ? (
        <LoadingSpinner size="lg" message="Retrieving authorized clinical records..." />
      ) : filteredRecords.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No Clinical Documents Available"
          message={
            searchQuery || selectedType !== 'ALL' || patientIdFilter
              ? 'No documents matched your criteria.'
              : 'You do not have access to any patient records yet. Once patients grant consent, their files will appear here.'
          }
        />
      ) : (
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 sm:px-6">Patient</th>
                  <th className="py-3 px-4">Document Title</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">SHA-256 Hash</th>
                  <th className="py-3 px-4">Uploaded</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                      <div className="font-semibold text-slate-900 text-xs">
                        {r.patientName}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Patient #{r.patientId}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <Link
                        to={`/doctor/records/${r.id}`}
                        className="font-semibold text-slate-800 hover:text-indigo-600 block text-xs"
                      >
                        {r.title}
                      </Link>
                      <span className="text-[11px] text-slate-400 truncate max-w-xs block mt-0.5">
                        {r.originalFilename}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <StatusBadge status={r.recordType} type="record" />
                    </td>

                    <td className="py-4 px-4 font-mono text-[11px] text-slate-600">
                      <span className="p-1 rounded bg-slate-100 border border-slate-200">
                        {r.fileHash ? `${r.fileHash.substring(0, 14)}...` : 'N/A'}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-[11px] text-slate-500 whitespace-nowrap">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/doctor/records/${r.id}`}
                          title="Inspect Clinical Details"
                          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-indigo-600 transition"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDownload(r)}
                          disabled={downloadingId === r.id}
                          title="Download Document"
                          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-indigo-600 transition disabled:opacity-50"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
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

export default DoctorRecords;
