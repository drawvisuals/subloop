import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/Layout';
import { Toggle } from '@/components/Onboarding/Toggle';
import { Button } from '@/components/Auth';
import { ScanText, AlertTriangle, CheckCircle2, Globe } from 'lucide-react';

interface ConnectedInboxData {
  email: string;
  provider: 'gmail' | 'outlook';
  status: 'connected' | 'disconnected';
  lastScanned: Date;
}

// Mock connected inboxes data
const mockConnectedInboxes: ConnectedInboxData[] = [
  { email: 'ivan.rubyo@gmail.com', provider: 'gmail', status: 'connected', lastScanned: new Date('2026-01-16T10:30:00') },
  { email: 'ivan.rubyo@outlook.com', provider: 'outlook', status: 'disconnected', lastScanned: new Date('2025-10-13T14:20:00') },
];

export default function Settings() {
  const navigate = useNavigate();
  const [connectedInboxes, setConnectedInboxes] = useState<ConnectedInboxData[]>(mockConnectedInboxes);
  const [browserExtensionConnected] = useState(false);
  const [disconnectingInbox, setDisconnectingInbox] = useState<string | null>(null);

  const handleRescan = () => {
    // Mock rescan logic
    console.log('Rescan emails');
  };

  const handleToggleInbox = (email: string, checked: boolean) => {
    if (!checked) {
      // Show disconnect warning when turning off
      setDisconnectingInbox(email);
    } else {
      // Reconnect inbox
      setConnectedInboxes(prev =>
        prev.map(inbox =>
          inbox.email === email ? { ...inbox, status: 'connected' as const } : inbox
        )
      );
    }
  };

  const handleConfirmDisconnect = () => {
    if (disconnectingInbox) {
      setConnectedInboxes(prev =>
        prev.map(inbox =>
          inbox.email === disconnectingInbox ? { ...inbox, status: 'disconnected' as const } : inbox
        )
      );
      setDisconnectingInbox(null);
    }
  };

  const handleConnectExtension = () => {
    // Navigate to browser extension onboarding
    navigate('/onboarding/browser-extension');
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const getLastScannedText = (date: Date): string => {
    return formatDate(date);
  };

  return (
    <AppLayout>
      <div className="pt-12 pb-8">
        <div className="w-full max-w-[438px] flex flex-col gap-8">
          {/* Email Scanning Section */}
          <div className="w-full flex flex-col gap-6">
            {/* Title + Description */}
            <div className="w-full flex flex-col gap-2">
              <h2 className="font-semibold text-xl leading-7 text-white tracking-tight">
                Email scanning
              </h2>
              <p className="font-normal text-base leading-[22px] text-neutral-700 tracking-tight">
                Connected email accounts are scanned for billing and subscription emails to keep your list up to date.
              </p>
            </div>

            {/* Connected Inboxes */}
            <div className="w-full flex flex-col gap-4">
              {connectedInboxes.map((inbox) => {
                const isDisconnecting = disconnectingInbox === inbox.email;
                const isConnected = inbox.status === 'connected';

                return (
                  <div key={inbox.email} className="w-full flex flex-col gap-4">
                    {/* Inbox Row with Toggle */}
                    <div className="w-full bg-neutral-100 rounded-lg px-4 py-5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {/* Provider icon placeholder */}
                        <div className="w-5 h-5 shrink-0 bg-neutral-500 rounded" />
                        <span className="font-normal text-base leading-[22px] text-white tracking-tight">
                          {inbox.email}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Status indicator */}
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${
                              isConnected ? 'bg-success-500' : 'bg-neutral-700'
                            }`}
                          />
                          <span className={`font-light text-sm leading-5 tracking-tight ${
                            isConnected ? 'text-success-500' : 'text-neutral-700'
                          }`}>
                            {isConnected ? 'Connected' : 'Disconnected'}
                          </span>
                        </div>
                        {/* Toggle */}
                        <Toggle
                          checked={isConnected}
                          onChange={(checked) => handleToggleInbox(inbox.email, checked)}
                        />
                      </div>
                    </div>

                    {/* Last Scanned */}
                    <div className="px-4">
                      <span className="font-normal text-sm leading-5 text-neutral-700 tracking-tight">
                        Last scanned: {getLastScannedText(inbox.lastScanned)}
                      </span>
                    </div>

                    {/* Disconnect Warning */}
                    {isDisconnecting && (
                      <div className="px-4 py-3 bg-warning-500/10 border border-warning-500 rounded-lg flex gap-3">
                        <AlertTriangle className="w-4 h-4 text-neutral-700 shrink-0 mt-0.5" />
                        <p className="font-normal text-base leading-[22px] text-neutral-700 tracking-tight">
                          We'll stop scanning this inbox. Your subscriptions won't change.
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Rescan Button */}
            <button
              type="button"
              onClick={handleRescan}
              className="w-full h-[52px] px-4 py-2.5 bg-neutral-200 border border-neutral-50 rounded-lg flex items-center justify-center gap-2 font-medium text-base leading-[22px] text-white hover:bg-neutral-300 transition-colors"
            >
              <span>Rescan</span>
              <ScanText className="w-4 h-4" />
            </button>
          </div>

          {/* Browser Extension Section */}
          <div className="w-full flex flex-col gap-6 pt-6 border-t border-neutral-200">
            <div className="flex items-center gap-3">
              <Globe className="w-6 h-6 text-white shrink-0" />
              <h2 className="font-semibold text-xl leading-7 text-white tracking-tight">
                Browser extension
              </h2>
            </div>

            {browserExtensionConnected ? (
              <div className="w-full flex flex-col gap-3">
                <div className="w-full p-4 bg-neutral-200 rounded-lg flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success-500 shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-base leading-[22px] text-white">
                      Chrome extension connected
                    </p>
                    <p className="font-normal text-sm leading-5 text-neutral-700 mt-1">
                      New subscriptions will be detected automatically
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full flex flex-col gap-4">
                <div className="w-full p-4 bg-neutral-200 rounded-lg">
                  <p className="font-normal text-base leading-[22px] text-white">
                    Connect the browser extension to automatically detect new subscriptions when you sign up online.
                  </p>
                </div>
                <Button
                  onClick={handleConnectExtension}
                  className="w-auto"
                  showArrow
                >
                  Add Chrome extension
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
