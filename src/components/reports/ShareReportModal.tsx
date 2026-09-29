import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Copy, Check, QrCode, FileText, Download, ShieldCheck } from 'lucide-react';
import { useHealthStore } from '../../store/useHealthStore';
import { soundFx } from '../../utils/sound';

interface ShareReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareReportModal: React.FC<ShareReportModalProps> = ({ isOpen, onClose }) => {
  const { user, dailySummary } = useHealthStore();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareUrl = `https://migox.health/telemetry/share/${user.avatarSeed}?token=enc_${Date.now()}`;

  const handleCopyLink = () => {
    soundFx.playSuccess();
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="relative w-full max-w-md glass-panel-glow rounded-3xl p-6 md:p-8 border border-migo-purple/30 shadow-2xl z-10 overflow-hidden"
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-migo-purple/20 text-migo-purple-light">
              <Share2 className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-display font-bold text-lg text-white">
                Share Clinical Telemetry
              </h3>
              <p className="text-xs text-slate-400">
                End-to-end encrypted physician handover
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Holographic QR Code Box */}
        <div className="my-6 p-6 rounded-2xl bg-white flex flex-col items-center justify-center text-center shadow-inner relative group">
          {/* Simulated QR Pattern */}
          <div className="w-40 h-40 bg-slate-950 p-2 rounded-xl flex items-center justify-center">
            <div className="grid grid-cols-6 gap-1 w-full h-full p-2 bg-white rounded-lg">
              {Array.from({ length: 36 }).map((_, i) => (
                <div
                  key={i}
                  className={`rounded-sm ${
                    i % 2 === 0 || i % 7 === 0 ? 'bg-slate-900' : 'bg-transparent'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="mt-3">
            <span className="text-xs font-bold text-slate-900 block font-mono">
              PATIENT: {user.name.toUpperCase()}
            </span>
            <span className="text-[11px] text-slate-600 font-medium">
              TIR: {dailySummary.inRange}% • Avg: {dailySummary.average} {user.unit} • GMI: {dailySummary.gmi}%
            </span>
          </div>
        </div>

        {/* Copyable encrypted link */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 block">
            Encrypted Single-Use Link
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 px-3 py-2 rounded-xl bg-slate-900 text-xs text-slate-300 border border-white/[0.1] truncate select-all"
            />
            <button
              onClick={handleCopyLink}
              className="px-3.5 py-2 rounded-xl bg-migo-purple text-white text-xs font-bold hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Security badge */}
        <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>HIPAA & GDPR Grade 256-bit AES</span>
          </div>
          <span className="text-[10px] text-slate-500">Expires in 24h</span>
        </div>
      </motion.div>
    </div>
  );
};
