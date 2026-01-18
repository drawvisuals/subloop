import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/Layout';
import { Toggle } from '@/components/Onboarding/Toggle';
import { Button } from '@/components/Auth';
import { ScanText, AlertTriangle, CheckCircle2, Globe } from 'lucide-react';
import { getOnboardingState, updateOnboardingState, markScanStarted } from '@/services/onboarding';

interface ConnectedInboxData {
  email: string;
  provider: 'gmail' | 'outlook';
  status: 'connected' | 'disconnected';
  lastScanned: Date;
}

export default function Settings() {
  const navigate = useNavigate();
  const onboardingState = getOnboardingState();
  const [connectedInboxes, setConnectedInboxes] = useState<ConnectedInboxData[]>([]);
  const [browserExtensionConnected, setBrowserExtensionConnected] = useState(
    onboardingState.browserExtensionStatus === 'connected'
  );
  const [disconnectingInbox, setDisconnectingInbox] = useState<string | null>(null);

  // Load connected inboxes from onboarding state
  useEffect(() => {
    // Mock inboxes based on onboarding state
    const inboxes: ConnectedInboxData[] = [];
    if (onboardingState.emailConnectedCount > 0) {
      // Get current user email from auth
      const { getCurrentUser } = require('@/services/auth');
      const userEmail = getCurrentUser();
      if (userEmail) {
        inboxes.push({
          email: userEmail,
          provider: userEmail.includes('gmail') ? 'gmail' : 'outlook',
          status: 'connected',
          lastScanned: new Date(),
        });
      }
    }
    setConnectedInboxes(inboxes);
  }, [onboardingState.emailConnectedCount]);

  const handleRescan = () => {
    // Start scan and navigate to scanning page
    markScanStarted();
    navigate('/onboarding/scanning');
  };

  const handleToggleInbox = (email: string, checked: boolean) => {
    if (!checked) {
      // Show disconnect warning when turning off
      setDisconnectingInbox(email);
    } else {
      // Reconnect inbox
      const newCount = Math.max(1, onboardingState.emailConnectedCount + 1);
      updateOnboardingState({ emailConnectedCount: newCount });
      setConnectedInboxes(prev =>
        prev.map(inbox =>
          inbox.email === email ? { ...inbox, status: 'connected' as const } : inbox
        )
      );
    }
  };

  const handleConfirmDisconnect = () => {
    if (disconnectingInbox) {
      const newCount = Math.max(0, onboardingState.emailConnectedCount - 1);
      updateOnboardingState({ emailConnectedCount: newCount });
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
			<div className="pt-6 sm:pt-8 md:pt-12 pb-6 sm:pb-8 flex justify-center">
				<div className="w-full max-w-[438px] flex flex-col gap-6 sm:gap-8">
          {/* Email Scanning Section */}
          <div className="w-full flex flex-col gap-6">
            {/* Title + Description */}
            <div className="w-full flex flex-col gap-2">
              <h2 className="font-semibold text-xl leading-7 text-text-primary tracking-tight">
                Email scanning
              </h2>
              <p className="font-normal text-base leading-normal text-text-secondary tracking-tight">
                Connected email accounts are scanned for billing and subscription emails to keep your list up to date.
              </p>
            </div>

            {/* Connected Inboxes */}
            <div className="w-full flex flex-col gap-4">
              {connectedInboxes.length === 0 ? (
                <div className="w-full p-4 bg-neutral-900 border border-neutral-700 rounded-lg">
                  <p className="font-normal text-base leading-normal text-text-secondary">
                    No email accounts connected. Connect your email to start scanning for subscriptions.
                  </p>
                </div>
              ) : (
                connectedInboxes.map((inbox) => {
                const isDisconnecting = disconnectingInbox === inbox.email;
                const isConnected = inbox.status === 'connected';

                return (
                  <div key={inbox.email} className="w-full flex flex-col gap-4">
                    {/* Inbox Row with Toggle */}
                    <div className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {/* Provider icon placeholder */}
                        <div className="w-5 h-5 shrink-0 bg-neutral-500 rounded" />
                        <span className="font-normal text-base leading-normal text-text-primary tracking-tight">
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
                            isConnected ? 'text-text-success' : 'text-text-secondary'
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
                      <span className="font-normal text-sm leading-5 text-text-secondary tracking-tight">
                        Last scanned: {getLastScannedText(inbox.lastScanned)}
                      </span>
                    </div>

                    {/* Disconnect Warning */}
                    {isDisconnecting && (
                      <div className="px-4 py-3 bg-warning-500/10 border border-warning-500 rounded-lg flex flex-col sm:flex-row gap-3">
                        <div className="flex gap-3 flex-1">
                          <AlertTriangle className="w-4 h-4 text-text-secondary shrink-0 mt-0.5" />
                          <p className="font-normal text-base leading-normal text-text-secondary tracking-tight">
                            We'll stop scanning this inbox. Your subscriptions won't change.
                          </p>
                        </div>
                        <div className="flex gap-2 sm:ml-auto">
                          <button
                            type="button"
                            onClick={() => setDisconnectingInbox(null)}
                            className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleConfirmDisconnect}
                            className="px-4 py-2 text-sm font-medium text-text-inverse bg-neutral-200 rounded-lg hover:bg-neutral-300 transition-colors"
                          >
                            Disconnect
                          </button>
                        </div>
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
              className="w-full min-h-[44px] sm:h-[52px] px-4 py-2.5 bg-neutral-200 border border-neutral-700 rounded-lg flex items-center justify-center gap-2 font-medium text-sm sm:text-base leading-5 sm:leading-normal text-text-primary hover:bg-neutral-300 transition-colors active:opacity-75"
            >
              <span>Rescan</span>
              <ScanText className="w-4 h-4" />
            </button>
          </div>

          {/* Browser Extension Section */}
          <div className="w-full flex flex-col gap-6 pt-6 border-t border-neutral-700">
            <div className="flex items-center gap-3">
              <Globe className="w-6 h-6 text-text-primary shrink-0" />
              <h2 className="font-semibold text-xl leading-7 text-text-primary tracking-tight">
                Browser extension
              </h2>
            </div>

            {browserExtensionConnected ? (
              <div className="w-full flex flex-col gap-3">
                <div className="w-full p-4 bg-neutral-200 rounded-lg flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-text-success shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-base leading-normal text-text-primary">
                      Chrome extension connected
                    </p>
                    <p className="font-normal text-sm leading-5 text-text-secondary mt-1">
                      New subscriptions will be detected automatically
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full flex flex-col gap-4">
                <div className="w-full p-4 bg-neutral-200 rounded-lg">
                  <p className="font-normal text-base leading-normal text-text-primary">
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
