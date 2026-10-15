import React, { useState, useEffect } from 'react';
import recordService from '../../services/recordService';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  HardDrive,
  Database,
  Blocks,
  FileText,
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export const PatientIntegrityVerify = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifyingId, setVerifyingId] = useState(null);
  const [verificationResults, setVerificationResults] = useState({});

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setLoading(true);
        const data = await recordService.getMyRecords();
        setRecords(data);
      } catch (err) {
        console.error('Error fetching records for verification', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);

  const handleVerify = async (recordId) => {
    try {
      setVerifyingId(recordId);
      const res = await recordService.verifyRecord(recordId);
      setVerificationResults((prev) => ({
        ...prev,
        [recordId]: res,
      }));
    } catch (err) {
      console.error('Verification failed', err);
      alert('Verification request encountered an error.');
    } finally {
      setVerifyingId(null);
    }
  };

  const handleVerifyAll = async () => {
    for (const record of records) {
      await handleVerify(record.id);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" message="Loading cryptographic verification harness..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Document Cryptographic Integrity Verification
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time three-way hash reconciliation between physical storage, database records, and the blockchain ledger.
          </p>
        </div>
        {records.length > 0 && (
          <button
            onClick={handleVerifyAll}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-sm transition"
          >
            <RotateCw className="w-4 h-4" />
            <span>Verify All Records</span>
          </button>
        )}
      </div>

      {/* Explanation Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-2 text-teal-700 font-bold text-xs mb-1">
            <HardDrive className="w-4 h-4 text-teal-600" />
            <span>1. Disk Byte Stream</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            The server reads the physical file bytes from isolated off-chain disk and executes a live SHA-256 digest computation.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-2 text-cyan-700 font-bold text-xs mb-1">
            <Database className="w-4 h-4 text-cyan-600" />
            <span>2. Relational Metadata</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            The hash stored in the medical records table during initial upload is compared against the live digest.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs mb-1">
            <Blocks className="w-4 h-4 text-indigo-600" />
            <span>3. Blockchain Ledger</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            The immutable block payload anchored in the chained blocks is queried to confirm zero ledger tampering has occurred.
          </p>
        </div>
      </div>

      {/* Verification List */}
      {records.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
          No records found to verify.
        </div>
      ) : (
        <div className="space-y-4">
          {records.map((r) => {
            const result = verificationResults[r.id];
            const isVerifying = verifyingId === r.id;

            return (
              <div
                key={r.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-teal-50 text-teal-600">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{r.title}</h3>
                      <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                        {r.originalFilename} • {(r.fileSize / 1024).toFixed(1)} KB
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {result ? (
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        result.match || result.result === 'VERIFIED'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}>
                        {result.match || result.result === 'VERIFIED' ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                        )}
                        <span>{result.match || result.result === 'VERIFIED' ? '100% INTACT' : 'TAMPER DETECTED'}</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                        Pending Verification
                      </span>
                    )}

                    <button
                      onClick={() => handleVerify(r.id)}
                      disabled={isVerifying}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200 transition disabled:opacity-50"
                    >
                      <RotateCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
                      <span>{isVerifying ? 'Verifying...' : 'Check Now'}</span>
                    </button>
                  </div>
                </div>

                {/* Hashes comparison row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Recorded Hash (Off-Chain DB & Ledger):
                    </span>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-700 break-all">
                      {result ? (result.blockchainHash || result.originalHash) : r.fileHash}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Live Disk Recalculated Hash:
                    </span>
                    <div className={`p-2.5 rounded-xl border font-mono text-[11px] break-all ${
                      result
                        ? (result.match || result.result === 'VERIFIED')
                          ? 'bg-emerald-50/50 border-emerald-200 text-emerald-800'
                          : 'bg-rose-50 border-rose-200 text-rose-800'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}>
                      {result ? (result.currentFileHash || result.recalculatedHash) : 'Click "Check Now" to compute byte hash'}
                    </div>
                  </div>
                </div>

                {result && (
                  <div className="text-[11px] text-slate-500 pt-1">
                    {result.message}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PatientIntegrityVerify;
