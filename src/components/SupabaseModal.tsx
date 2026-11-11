import React, { useState, useEffect } from 'react';
import { Database, CheckCircle2, AlertCircle, Copy, Check, ExternalLink, RefreshCw, X, HardDrive, Cloud } from 'lucide-react';
import { getSupabaseConfig, testSupabaseConnection } from '../services/supabaseClient';
import { donorService } from '../services/donorService';
import { requestService } from '../services/requestService';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectedChange?: (connected: boolean) => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({ isOpen, onClose, onConnectedChange }) => {
  const currentConfig = getSupabaseConfig();
  const [url, setUrl] = useState(currentConfig.url);
  const [key, setKey] = useState(currentConfig.key);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; donorCount?: number } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [sqlContent, setSqlContent] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      const cfg = getSupabaseConfig();
      setUrl(cfg.url);
      setKey(cfg.key);
      setTestResult(null);

      fetch('/supabase_setup.sql')
        .then((res) => (res.ok ? res.text() : ''))
        .then((txt) => {
          if (txt) setSqlContent(txt);
        })
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveAndTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setTesting(true);
    setTestResult(null);

    if (url.trim()) {
      localStorage.setItem('bloodbridge_supabase_url', url.trim());
    } else {
      localStorage.removeItem('bloodbridge_supabase_url');
    }

    if (key.trim()) {
      localStorage.setItem('bloodbridge_supabase_key', key.trim());
    } else {
      localStorage.removeItem('bloodbridge_supabase_key');
    }

    const res = await testSupabaseConnection();
    setTestResult(res);
    setTesting(false);

    if (res.success) {
      if (onConnectedChange) onConnectedChange(true);
      await donorService.syncWithSupabase();
      await requestService.syncWithSupabase();
      window.dispatchEvent(new Event('bloodbridge_storage_update'));
    }
  };

  const handleDisconnect = () => {
    localStorage.removeItem('bloodbridge_supabase_url');
    localStorage.removeItem('bloodbridge_supabase_key');
    setUrl('');
    setKey('');
    setTestResult(null);
    if (onConnectedChange) onConnectedChange(false);
    window.dispatchEvent(new Event('bloodbridge_storage_update'));
  };

  const copySqlToClipboard = () => {
    if (sqlContent) {
      navigator.clipboard.writeText(sqlContent);
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 2500);
    }
  };

  const isConnected = currentConfig.isConfigured && (!testResult || testResult.success);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isConnected ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400' : 'bg-amber-500/20 border border-amber-500/30 text-amber-400'}`}>
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                Database Status
                <span className={`text-[11px] font-normal px-2 py-0.5 rounded-full border ${isConnected ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300' : 'bg-amber-500/20 border-amber-400/40 text-amber-300'}`}>
                  {isConnected ? 'Supabase Live' : 'Demo Local Storage'}
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                {isConnected 
                  ? 'Connected to your cloud Supabase database' 
                  : 'Currently running on offline Local Storage with 10 demo cities'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm text-slate-700">
          
          {/* Status Explanation Card */}
          <div className={`p-4 rounded-xl border flex items-start gap-3 ${isConnected ? 'bg-emerald-50/80 border-emerald-200' : 'bg-amber-50/80 border-amber-200'}`}>
            {isConnected ? (
              <Cloud className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <HardDrive className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div className="text-xs leading-relaxed">
              <p className="font-semibold text-slate-900">
                {isConnected 
                  ? 'Your Supabase cloud database is linked!' 
                  : 'Not linked to your Supabase project yet'}
              </p>
              <p className="text-slate-600 mt-0.5">
                {isConnected 
                  ? 'New donors and blood requests will be written directly into your Supabase database.'
                  : 'The donors and cities you currently see are loaded from local browser memory so you can test the site. To connect your real Supabase project, follow the 2 steps below.'}
              </p>
            </div>
          </div>

          {/* Quick Steps Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-slate-900 text-xs uppercase tracking-wider">
                Setup Steps
              </h3>
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:underline flex items-center gap-1 text-[11px] font-medium"
              >
                Go to Supabase Dashboard <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <ol className="list-decimal list-inside space-y-1 text-xs text-slate-600">
              <li>In your Supabase project, click <strong className="text-slate-800">SQL Editor</strong>, paste our setup script, and click <strong className="text-slate-800">Run</strong>.</li>
              <li>Go to <strong className="text-slate-800">Project Settings &gt; API</strong>, copy the <strong className="text-slate-800">Project URL</strong> and <strong className="text-slate-800">anon public key</strong>, and paste them below.</li>
            </ol>

            <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">Creates tables and seeds 10 demo locations (Mumbai, Pune, Delhi, etc.)</span>
              <button
                type="button"
                onClick={copySqlToClipboard}
                className="px-3 py-1.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                {copiedSql ? 'SQL Script Copied!' : 'Copy SQL Script'}
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSaveAndTest} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Your Supabase Project URL
              </label>
              <input
                type="url"
                required
                placeholder="https://your-project-ref.supabase.co"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-transparent font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Your Supabase Anon Public Key
              </label>
              <input
                type="password"
                required
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-transparent font-mono"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Found in Supabase: Project Settings &gt; API &gt; Project API keys (anon public).
              </p>
            </div>

            {testResult && (
              <div
                className={`p-3.5 rounded-xl border flex items-start gap-2.5 text-xs ${
                  testResult.success
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}
              >
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-semibold">{testResult.success ? 'Connected Successfully!' : 'Connection Check'}</div>
                  <div className="text-[11px] mt-0.5">{testResult.message}</div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              {currentConfig.isConfigured ? (
                <button
                  type="button"
                  onClick={handleDisconnect}
                  className="text-xs text-red-600 hover:text-red-700 font-medium cursor-pointer"
                >
                  Disconnect from Supabase
                </button>
              ) : (
                <div className="text-xs text-slate-400">
                  Ready to link
                </div>
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={testing}
                  className="px-4 py-2 bg-primary hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-60 cursor-pointer"
                >
                  {testing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Testing Connection...
                    </>
                  ) : (
                    <>
                      <Database className="w-3.5 h-3.5" />
                      Save & Connect
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
