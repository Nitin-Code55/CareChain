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

export const DoctorIntegrityVerify = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifyingId, setVerifyingId] = useState(null);
  const [verificationResults, setVerificationResults] = useState({});

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setLoading(true);
        const data = await recordService.getDoctorRecords();
        setRecords(data);
      } catch (err) {
        console.error('Failed to load records for physician verification', err);
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
    return <LoadingSpinner size="lg" message="Loading clinical verification harness..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Clinical Document Integrity Verification
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Verify patient clinical files before relying on them for diagnostic or medical decisions.
          </p>
        </div>
        {records.length > 0 && (
          <button
            onClick={handleVerifyAll}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-sm transition"
          >
            <RotateCw className="w-4 h-4" />
            <span>Verify All Accessible Records</span>
          </button>
        )}
      </div>

      {/* Verification List */}
      {records.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
          No authorized clinical records found to verify.
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
                    <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{r.title}</h3>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Patient: <strong className="text-slate-800">{r.patientName}</strong> • {r.originalFilename}
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
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition disabled:opacity-50"
                    >
                      <RotateCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
                      <span>{isVerifying ? 'Verifying...' : 'Check Hash'}</span>
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
                      {result ? (result.currentFileHash || result.recalculatedHash) : 'Click "Check Hash" to compute byte hash'}
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

export default DoctorIntegrityVerify;
