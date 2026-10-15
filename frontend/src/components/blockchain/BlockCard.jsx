import React, { useState } from 'react';
import { Blocks, Clock, Hash, Link as LinkIcon, CheckCircle2, Copy, Check } from 'lucide-react';

export const BlockCard = ({ block, isLatest }) => {
  const [copiedHash, setCopiedHash] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const isGenesis = block.blockIndex === 0;

  return (
    <div className={`relative rounded-2xl border transition-all duration-200 bg-white p-5 shadow-sm hover:shadow-md ${
      isLatest ? 'border-teal-400 ring-2 ring-teal-500/20' : 'border-slate-200'
    }`}>
      {/* Block Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className={`flex h-9 w-9 items-center justify-center rounded-xl font-bold text-sm ${
            isGenesis
              ? 'bg-amber-100 text-amber-800 border border-amber-200'
              : 'bg-teal-100 text-teal-800 border border-teal-200'
          }`}>
            <Blocks className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-slate-900 text-base">
                {isGenesis ? 'Genesis Block #0' : `Block #${block.blockIndex}`}
              </h4>
              {isLatest && (
                <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-teal-800">
                  Head
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{block.timestamp ? new Date(block.timestamp).toLocaleString() : 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Verified</span>
        </div>
      </div>

      {/* Block Body */}
      <div className="mt-4 space-y-3 text-xs">
        {/* Current Hash */}
        <div>
          <span className="text-[11px] font-medium text-slate-400 block mb-1">CURRENT BLOCK HASH</span>
          <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200/70 font-mono text-slate-700 text-[11px] break-all">
            <span>{block.currentHash}</span>
            <button
              onClick={() => copyToClipboard(block.currentHash)}
              title="Copy Hash"
              className="p-1 rounded hover:bg-slate-200 text-slate-500 flex-shrink-0"
            >
              {copiedHash ? <Check className="w-3.5 h-3.5 text-teal-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Previous Hash */}
        <div>
          <span className="text-[11px] font-medium text-slate-400 block mb-1 flex items-center gap-1">
            <LinkIcon className="w-3 h-3" />
            <span>PREVIOUS BLOCK HASH</span>
          </span>
          <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/70 font-mono text-slate-600 text-[11px] break-all">
            {isGenesis ? '0'.repeat(64) + ' (Genesis Root)' : block.previousHash}
          </div>
        </div>

        {/* Payload / Action Data */}
        <div>
          <span className="text-[11px] font-medium text-slate-400 block mb-1">TRANSACTION DATA / PAYLOAD</span>
          <div className="p-2.5 rounded-lg bg-slate-900 text-teal-300 font-mono text-[11px] overflow-x-auto max-h-32 border border-slate-800">
            <pre className="whitespace-pre-wrap">{block.dataPayload || 'No payload'}</pre>
          </div>
        </div>

        {/* Nonce & Metadata */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-slate-500">
          <span>Proof Nonce: <strong className="text-slate-800 font-mono">{block.nonce ?? 0}</strong></span>
          <span>Index: <strong className="text-slate-800 font-mono">{block.blockIndex}</strong></span>
        </div>
      </div>
    </div>
  );
};

export default BlockCard;
