"use client";

import React from "react";
import { Youtube, X, AlertCircle, ShieldAlert, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ConnectChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConnectChannelModal({ isOpen, onClose }: ConnectChannelModalProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-slate-800 bg-surface-900 p-6 sm:p-7 shadow-2xl text-slate-100 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-12 w-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
            <Youtube className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 id="modal-title" className="text-lg font-bold text-white">
                YouTube Channel Connection
              </h3>
              <Badge variant="warning" className="text-[10px] px-2 py-0">
                Placeholder
              </Badge>
            </div>
            <p className="text-xs text-slate-400">Step 2 Architecture Notice</p>
          </div>
        </div>

        {/* Informative Notice */}
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 mb-5 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>OAuth 2.0 Integration Scheduled for Next Phase</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Per the strict Step 2 implementation guidelines, live Google OAuth and channel synchronization
            are intentionally not connected yet. No fake channel data or simulated tokens are being created.
          </p>
        </div>

        {/* What Will Happen When Connected */}
        <div className="space-y-3 mb-6">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Upcoming Production Integration:
          </h4>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-brand-400 shrink-0 mt-0.5" />
              <span>
                <strong>Official Google OAuth:</strong> Securely authorize via Google&apos;s consent screen with read-only YouTube Data &amp; Analytics API scopes.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-brand-400 shrink-0 mt-0.5" />
              <span>
                <strong>Channel DNA Profiling:</strong> Automatic extraction of your niche, tone, vocabulary, and top-performing formats.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-brand-400 shrink-0 mt-0.5" />
              <span>
                <strong>Strict Privacy:</strong> Zero write permissions requested—your channel credentials are never stored in plaintext.
              </span>
            </li>
          </ul>
        </div>

        {/* Modal Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-4 border-t border-slate-800">
          <Button variant="secondary" size="md" onClick={onClose} className="w-full sm:w-auto">
            Close Notice
          </Button>
          <Button
            variant="outline"
            size="md"
            onClick={onClose}
            className="w-full sm:w-auto gap-1.5"
          >
            <span>Understood</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
