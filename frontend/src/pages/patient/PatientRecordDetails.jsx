import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import recordService from '../../services/recordService';
import {
  FileText,
  Download,
  ShieldCheck,
  ArrowLeft,
  Calendar,
  HardDrive,
  Blocks,
  Hash,
  CheckCircle2,
  AlertTriangle,
  Clock,
  User,
  Copy,
  Check,
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';

export const PatientRecordDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        setLoading(true);
        const data = await recordService.getRecordById(id);
        setRecord(data);
      } catch (err) {
        console.error('Error fetching record', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [id]);

  const handleDownload = async () => {
    if (!record) return;
    try {
      setDownloading(true);
      await recordService.downloadRecord(record.id, record.originalFilename);
    } catch (err) {
      console.error('Download failed', err);
      alert('Failed to download document.');
    } finally {
      setDownloading(false);
    }
  };

  const handleVerifyIntegrity = async () => {
    if (!record) return;
    try {
      setVerifying(true);
      const res = await recordService.verifyRecord(record.id);
      setVerificationResult(res);
    } catch (err) {
      console.error('Verification failed', err);
      alert('Verification request failed.');
    } finally {
      setVerifying(false);
    }
  };

  const copyHash = (hash) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  if (loading) {
    return <LoadingSpinner size="lg" message="Loading record details..." />;
  }

  if (!record) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <p className="text-slate-600 text-sm">Medical record not found or access denied.</p>
        <Link to="/patient/records" className="mt-3 inline-block text-xs font-semibold text-teal-600">
          ← Return to Records
        </Link>
      </div>
    );
  }

  const isImage = record.mimeType?.startsWith('image/');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <Link
        to="/patient/records"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Records</span>
      </Link>

      {/* Main Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <StatusBadge status={record.recordType} type="record" />
              <span className="text-xs text-slate-400 font-mono">ID: {record.id}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {record.title}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Off-chain filename: <strong className="font-mono text-slate-700">{record.originalFilename}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleVerifyIntegrity}
              disabled={verifying}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200/80 hover:bg-teal-100 transition disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>{verifying ? 'Recalculating...' : 'Verify Cryptographic Hash'}</span>
            </button>
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
          </div>
        </div>

        {/* Verification Alert (if triggered) */}
        {verificationResult && (
          <div className={`p-5 border-b text-xs ${
            verificationResult.match || verificationResult.result === 'VERIFIED'
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
              : 'bg-rose-50 border-rose-200 text-rose-950'
          }`}>
            <div className="flex items-start gap-3">
              {verificationResult.match || verificationResult.result === 'VERIFIED' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="space-y-1.5 flex-1">
                <div className="font-bold text-sm">
                  {verificationResult.match || verificationResult.result === 'VERIFIED'
                    ? 'Cryptographic Hash Verification: PASSED (100% Intact)'
                    : 'Cryptographic Hash Verification: TAMPER WARNING'}
                </div>
                <p className="text-xs text-slate-600">
                  {verificationResult.message}
                </p>
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px]">
                  <div className="p-2 rounded bg-white/80 border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-sans">RECALCULATED DISK BYTE HASH:</span>
                    <span className="break-all text-slate-800">{verificationResult.currentFileHash || verificationResult.recalculatedHash}</span>
                  </div>
                  <div className="p-2 rounded bg-white/80 border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-sans">ORIGINAL RECORDED HASH:</span>
                    <span className="break-all text-slate-800">{verificationResult.blockchainHash || verificationResult.originalHash || verificationResult.recordedHash}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 bg-slate-50/50 p-4 text-xs">
          <div className="p-3">
            <span className="text-[11px] text-slate-400 block mb-1">FILE SIZE & FORMAT</span>
            <div className="font-semibold text-slate-800">
              {(record.fileSize / 1024).toFixed(1)} KB ({record.fileSize} bytes)
            </div>
            <div className="text-[11px] text-slate-500 font-mono mt-0.5">{record.mimeType}</div>
          </div>

          <div className="p-3">
            <span className="text-[11px] text-slate-400 block mb-1">UPLOAD TIMESTAMP</span>
            <div className="font-semibold text-slate-800">
              {new Date(record.createdAt).toLocaleDateString()}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {new Date(record.createdAt).toLocaleTimeString()}
            </div>
          </div>

          <div className="p-3">
            <span className="text-[11px] text-slate-400 block mb-1">RECORD OWNER</span>
            <div className="font-semibold text-slate-800">{record.patientName}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Patient ID: #{record.patientId}</div>
          </div>
        </div>

        {/* Blockchain Cryptographic Anchor */}
        <div className="p-6 border-t border-slate-100 space-y-4">
          <div className="flex items-center gap-2">
            <Blocks className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-slate-900 text-sm">Blockchain Ledger Anchor</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-[11px] text-slate-400 block mb-1">DOCUMENT SHA-256 HASH</span>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 font-mono text-[11px] text-slate-800 break-all">
                <span>{record.fileHash}</span>
                <button
                  onClick={() => copyHash(record.fileHash)}
                  className="p-1 rounded hover:bg-slate-200 text-slate-500 flex-shrink-0"
                >
                  {copiedHash ? <Check className="w-4 h-4 text-teal-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {record.blockIndex !== null && record.blockIndex !== undefined && (
              <div className="p-3 rounded-xl bg-teal-50/60 border border-teal-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  <span className="font-semibold text-teal-900">
                    Anchored in Block #{record.blockIndex}
                  </span>
                </div>
                <span className="text-[11px] text-teal-700 font-mono">Status: Confirmed On-Chain</span>
              </div>
            )}
          </div>
        </div>

        {/* Clinical Description */}
        {record.description && (
          <div className="p-6 border-t border-slate-100">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
              Clinical Context & Notes
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
              {record.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientRecordDetails;
