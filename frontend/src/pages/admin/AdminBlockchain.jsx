import React, { useState, useEffect } from 'react';
import blockchainService from '../../services/blockchainService';
import BlockCard from '../../components/blockchain/BlockCard';
import {
  Blocks,
  ShieldCheck,
  RotateCw,
  AlertTriangle,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export const AdminBlockchain = () => {
  const [blocks, setBlocks] = useState([]);
  const [verification, setVerification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);

  const loadBlockchainData = async () => {
    try {
      setLoading(true);
      const [blocksData, verifyData] = await Promise.all([
        blockchainService.getBlocks(),
        blockchainService.verifyChain(),
      ]);
      setBlocks(blocksData);
      setVerification(verifyData);
    } catch (err) {
      console.error('Failed to load blockchain ledger', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);

  const handleVerifyChain = async () => {
    try {
      setVerifying(true);
      const res = await blockchainService.verifyChain();
      setVerification(res);
    } catch (err) {
      console.error('Verification failed', err);
      alert('Failed to execute blockchain verification.');
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" message="Loading blockchain ledger blocks..." />;
  }

  // Reverse sort to show latest block at the top
  const sortedBlocks = [...blocks].sort((a, b) => b.blockIndex - a.blockIndex);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Blockchain Ledger Explorer
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Immutable SHA-256 block sequence anchoring off-chain medical hashes and consent events.
          </p>
        </div>

        <button
          onClick={handleVerifyChain}
          disabled={verifying}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-sm transition disabled:opacity-50"
        >
          <RotateCw className={`w-4 h-4 ${verifying ? 'animate-spin' : ''}`} />
          <span>{verifying ? 'Verifying Chain...' : 'Verify Entire Ledger Chain'}</span>
        </button>
      </div>

      {/* Verification Status Banner */}
      {verification && (
        <div className={`p-5 rounded-2xl border text-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm ${
          verification.valid
            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
            : 'bg-rose-50 border-rose-200 text-rose-950'
        }`}>
          <div className="flex items-start sm:items-center gap-3">
            {verification.valid ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5 sm:mt-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5 sm:mt-0" />
            )}
            <div>
              <h3 className="font-bold text-sm">
                {verification.valid
                  ? 'Ledger Chain Verification: VALID & CRYPTOGRAPHICALLY SOUND'
                  : 'Ledger Chain Verification: TAMPERING DETECTED'}
              </h3>
              <p className="text-slate-600 text-[11px] mt-0.5">
                {verification.message} — Verified {verification.totalBlocks ?? verification.checkedBlocks ?? blocks.length} sequential blocks from Genesis #0 to Head.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-right">
            <span className="text-[11px] font-mono text-slate-500">
              Total Blocks: <strong className="text-slate-900 font-bold">{blocks.length}</strong>
            </span>
          </div>
        </div>
      )}

      {/* Block Sequence Explorer */}
      <div className="space-y-4">
        {sortedBlocks.map((block, index) => (
          <BlockCard
            key={block.id || block.blockIndex}
            block={block}
            isLatest={index === 0}
          />
        ))}
      </div>
    </div>
  );
};

export default AdminBlockchain;
