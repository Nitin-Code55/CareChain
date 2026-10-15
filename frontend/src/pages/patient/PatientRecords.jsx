import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import recordService from '../../services/recordService';
import {
  FileText,
  Upload,
  Search,
  Filter,
  Download,
  ShieldCheck,
  Eye,
  CheckCircle2,
  Calendar,
  HardDrive,
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';

export const PatientRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [downloadingId, setDownloadingId] = useState(null);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const data = await recordService.getMyRecords();
      setRecords(data);
    } catch (err) {
      console.error('Error fetching records', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleDownload = async (record) => {
    try {
      setDownloadingId(record.id);
      await recordService.downloadRecord(record.id, record.originalFilename);
    } catch (err) {
      console.error('Download failed', err);
      alert('Failed to download medical document.');
    } finally {
      setDownloadingId(null);
    }
  };

  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.description && r.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.originalFilename && r.originalFilename.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = selectedType === 'ALL' || r.recordType === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            My Medical Records Repository
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Off-chain encrypted records anchored to the SHA-256 blockchain ledger.
          </p>
        </div>
        <Link
          to="/patient/upload"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-sm transition"
        >
          <Upload className="w-4 h-4" />
          <span>Upload New Record</span>
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search records by title, notes, or filename..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full sm:w-auto py-2 px-3 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-teal-500"
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
        <LoadingSpinner size="lg" message="Retrieving your medical records..." />
      ) : filteredRecords.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No Medical Records Found"
          message={
            searchQuery || selectedType !== 'ALL'
              ? 'No documents matched your search filter.'
              : 'You have not uploaded any medical documents yet.'
          }
          actionLabel="Upload First Document"
          actionLink="/patient/upload"
        />
      ) : (
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 sm:px-6">Document Title</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Ledger Anchored Hash</th>
                  <th className="py-3 px-4">File Specs</th>
                  <th className="py-3 px-4">Uploaded</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-4 px-4 sm:px-6">
                      <div className="font-semibold text-slate-900 text-xs sm:text-sm">
                        {r.title}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 truncate max-w-xs">
                        {r.originalFilename}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <StatusBadge status={r.recordType} type="record" />
                    </td>

                    <td className="py-4 px-4 font-mono text-[11px] text-slate-600">
                      <span className="p-1 rounded bg-slate-100 border border-slate-200">
                        {r.fileHash ? `${r.fileHash.substring(0, 14)}...` : 'N/A'}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-[11px] text-slate-500">
                      <div>{(r.fileSize / 1024).toFixed(1)} KB</div>
                      <div className="text-slate-400 uppercase text-[10px]">{r.mimeType?.split('/')[1] || 'DOC'}</div>
                    </td>

                    <td className="py-4 px-4 text-[11px] text-slate-500 whitespace-nowrap">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/patient/records/${r.id}`}
                          title="Inspect Details"
                          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-teal-600 transition"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDownload(r)}
                          disabled={downloadingId === r.id}
                          title="Download File"
                          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-teal-600 transition disabled:opacity-50"
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

export default PatientRecords;
