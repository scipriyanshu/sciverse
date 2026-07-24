import React, { useState } from 'react';
import { Smartphone, ShieldCheck, Cpu, Bell, Lock, Zap, CheckCircle2, AlertCircle, RefreshCw, X } from 'lucide-react';

interface AndroidBridgeModalProps {
  onClose: () => void;
}

export const AndroidBridgeModal: React.FC<AndroidBridgeModalProps> = ({ onClose }) => {
  const [permissions, setPermissions] = useState({
    accessibility: true,
    usageStats: true,
    foregroundService: true,
    notificationListener: true,
    deviceAdmin: false,
    quickTile: true,
    workManager: true,
  });

  const [simulatedLogs, setSimulatedLogs] = useState<string[]>([
    '[Android System] AccessibilityService initialized (Package: com.lifeos.android)',
    '[UsageStatsManager] Screen time query complete: Instagram (12m), YouTube (0m - Shield active)',
    '[ForegroundService] DeepFocusService bound to notification ID #4092 with ongoing priority',
    '[WorkManager] Scheduled periodic habit sync job every 60 minutes',
    '[QuickSettingsTile] Focus Mode Tile state: STATE_ACTIVE',
  ]);

  const togglePermission = (key: keyof typeof permissions) => {
    setPermissions((prev) => {
      const nextVal = !prev[key];
      const statusText = nextVal ? 'GRANTED' : 'REVOKED';
      setSimulatedLogs((logs) => [
        `[PermissionManager] ${String(key)} status changed to ${statusText}`,
        ...logs.slice(0, 5),
      ]);
      return { ...prev, [key]: nextVal };
    });
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#121212] border border-white/10 rounded-3xl max-w-2xl w-full p-6 md:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-neutral-500 hover:text-white transition-colors p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-[0.2em] text-white uppercase">
              Android Native Capabilities Bridge
            </h3>
            <p className="text-xs font-mono text-neutral-400 mt-0.5">
              System Service Integrations & System Telemetry (v2.4 Native Manifest)
            </p>
          </div>
        </div>

        {/* Info banner */}
        <div className="bg-neutral-900/80 border border-white/10 p-4 rounded-xl text-xs text-neutral-300 leading-relaxed font-sans">
          This bridge demonstrates LifeOS's architecture for native Android deployment—interfacing with <strong>Accessibility Services</strong> for app-blocking, <strong>UsageStatsManager</strong> for telemetry, and <strong>Foreground Services</strong> for persistent timers.
        </div>

        {/* Permissions Grid */}
        <div className="space-y-3">
          <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase block">
            System Services & Hardware Permissions
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Accessibility */}
            <div className="bg-neutral-900/50 border border-white/10 p-3.5 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-white block">Accessibility Service</span>
                <span className="text-[9px] font-mono text-neutral-500">App & Site Intercept Lock</span>
              </div>
              <button
                onClick={() => togglePermission('accessibility')}
                className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold cursor-pointer transition-colors ${
                  permissions.accessibility ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-red-950 text-red-400 border border-red-800'
                }`}
              >
                {permissions.accessibility ? 'Active ✓' : 'Disabled'}
              </button>
            </div>

            {/* Usage Stats */}
            <div className="bg-neutral-900/50 border border-white/10 p-3.5 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-white block">UsageStatsManager</span>
                <span className="text-[9px] font-mono text-neutral-500">Screen Time Telemetry</span>
              </div>
              <button
                onClick={() => togglePermission('usageStats')}
                className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold cursor-pointer transition-colors ${
                  permissions.usageStats ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-red-950 text-red-400 border border-red-800'
                }`}
              >
                {permissions.usageStats ? 'Active ✓' : 'Disabled'}
              </button>
            </div>

            {/* Foreground Service */}
            <div className="bg-neutral-900/50 border border-white/10 p-3.5 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-white block">Foreground Service</span>
                <span className="text-[9px] font-mono text-neutral-500">Audio Synth & Timer Lock</span>
              </div>
              <button
                onClick={() => togglePermission('foregroundService')}
                className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold cursor-pointer transition-colors ${
                  permissions.foregroundService ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-red-950 text-red-400 border border-red-800'
                }`}
              >
                {permissions.foregroundService ? 'Active ✓' : 'Disabled'}
              </button>
            </div>

            {/* WorkManager */}
            <div className="bg-neutral-900/50 border border-white/10 p-3.5 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-white block">WorkManager Scheduler</span>
                <span className="text-[9px] font-mono text-neutral-500">Periodic Habit Sync</span>
              </div>
              <button
                onClick={() => togglePermission('workManager')}
                className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold cursor-pointer transition-colors ${
                  permissions.workManager ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-red-950 text-red-400 border border-red-800'
                }`}
              >
                {permissions.workManager ? 'Active ✓' : 'Disabled'}
              </button>
            </div>

            {/* Quick Tile */}
            <div className="bg-neutral-900/50 border border-white/10 p-3.5 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-white block">Quick Settings Tile</span>
                <span className="text-[9px] font-mono text-neutral-500">Status Bar Focus Toggle</span>
              </div>
              <button
                onClick={() => togglePermission('quickTile')}
                className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold cursor-pointer transition-colors ${
                  permissions.quickTile ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-red-950 text-red-400 border border-red-800'
                }`}
              >
                {permissions.quickTile ? 'Bound ✓' : 'Unbound'}
              </button>
            </div>

            {/* Device Admin */}
            <div className="bg-neutral-900/50 border border-white/10 p-3.5 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-white block">Device Admin / Strict Lock</span>
                <span className="text-[9px] font-mono text-neutral-500">Prevents Force Stop in Focus</span>
              </div>
              <button
                onClick={() => togglePermission('deviceAdmin')}
                className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold cursor-pointer transition-colors ${
                  permissions.deviceAdmin ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-amber-950 text-amber-400 border border-amber-800'
                }`}
              >
                {permissions.deviceAdmin ? 'Strict Lock ✓' : 'Optional'}
              </button>
            </div>
          </div>
        </div>

        {/* System Logs console */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">
              Android Service Log Stream
            </span>
            <button
              onClick={() =>
                setSimulatedLogs((logs) => [
                  `[Telematics] System heartbeat OK (${new Date().toLocaleTimeString()})`,
                  ...logs.slice(0, 4),
                ])
              }
              className="text-[10px] font-mono text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-2.5 h-2.5" /> Ping Services
            </button>
          </div>

          <div className="bg-black border border-white/10 rounded-xl p-3 font-mono text-[11px] text-emerald-400 space-y-1.5 max-h-36 overflow-y-auto">
            {simulatedLogs.map((log, idx) => (
              <div key={idx} className="leading-snug">
                {log}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-white/10">
          <button
            onClick={onClose}
            className="bg-white text-black px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-neutral-200"
          >
            Close Bridge Diagnostics
          </button>
        </div>
      </div>
    </div>
  );
};
