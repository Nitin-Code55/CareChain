import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import recordService from '../../services/recordService';
import {
  Upload,
  FileText,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  X,
  Blocks,
  ArrowRight,
  Database,
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export const PatientUploadRecord = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [recordType, setRecordType] = useState('LAB_REPORT');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.size > 15 * 1024 * 1024) {
        setError('Selected file exceeds maximum limit of 15MB.');
        return;
      }
      setFile(selected);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a medical document to upload.');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('recordType', recordType);
    formData.append('description', description);

    try {
      const uploadedRecord = await recordService.uploadRecord(formData);
      setSuccess(true);
      setTimeout(() => {
        navigate(`/patient/records/${uploadedRecord.id}`);
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        'Failed to upload medical document. Check file format (PDF, PNG, JPG).'
      );
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Upload Medical Document
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Anchor off-chain clinical documents to the cryptographic ledger.
        </p>
      </div>

      {/* Academic Security Architecture Notice */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-100 flex items-start gap-3">
        <div className="p-2 rounded-xl bg-teal-100/80 text-teal-800 flex-shrink-0 mt-0.5">
          <Blocks className="w-5 h-5" />
        </div>
        <div className="text-xs">
          <h4 className="font-bold text-teal-950">Cryptographic Off-Chain Storage Protocol</h4>
          <p className="text-slate-600 mt-1 leading-relaxed">
            Your private document will be stored in an off-chain storage repository with UUID anonymization. Its SHA-256 byte fingerprint is computed and anchored inside a new chained block on the blockchain ledger.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Medical document securely uploaded and block anchored! Redirecting...</span>
        </div>
      )}

      {/* Upload Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-5">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Document Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Comprehensive Blood Chemistry Report"
            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Record Category <span className="text-red-500">*</span>
            </label>
            <select
              value={recordType}
              onChange={(e) => setRecordType(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-teal-500"
            >
              <option value="LAB_REPORT">Lab Report</option>
              <option value="PRESCRIPTION">Prescription</option>
              <option value="SCAN_IMAGE">Scan / Radiology Image</option>
              <option value="DISCHARGE_SUMMARY">Discharge Summary</option>
              <option value="OTHER">Other Clinical Document</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              File Attachment <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="file"
                id="file-upload"
                onChange={handleFileChange}
                accept=".pdf,.png,.jpg,.jpeg"
                className="hidden"
              />
              <label
                htmlFor="file-upload"
                className="flex items-center justify-between w-full px-3.5 py-2 rounded-xl border border-dashed border-slate-300 hover:border-teal-500 cursor-pointer text-xs text-slate-600 transition"
              >
                <div className="flex items-center gap-2 truncate">
                  <Upload className="w-4 h-4 text-teal-600 flex-shrink-0" />
                  <span className="truncate">
                    {file ? file.name : 'Choose PDF, PNG, or JPG (max 15MB)'}
                  </span>
                </div>
                <span className="px-2 py-1 rounded bg-slate-100 text-[10px] font-semibold text-slate-700 flex-shrink-0">
                  Browse
                </span>
              </label>
            </div>
          </div>
        </div>

        {file && (
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4 text-teal-600" />
              <div>
                <span className="font-semibold text-slate-800">{file.name}</span>
                <span className="text-[11px] text-slate-500 block">
                  {(file.size / 1024).toFixed(1)} KB • {file.type || 'Document'}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setFile(null)}
              className="p-1 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Clinical Notes / Description
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional contextual notes regarding the test conditions or diagnosis..."
            className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
          />
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
          <Link
            to="/patient/records"
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading || success}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white shadow-sm disabled:opacity-50 transition flex items-center gap-2"
          >
            {loading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Upload & Mine Ledger Block</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientUploadRecord;
