import { Toggle } from './Toggle';
import { CornerDownRight } from 'lucide-react';

interface EmailProviderRowProps {
  provider: 'gmail' | 'outlook' | 'icloud' | 'imap';
  checked: boolean;
  onChange: (checked: boolean) => void;
  comingSoon?: boolean;
  disabled?: boolean;
}

/**
 * Email provider row component
 * Shows provider name with toggle and optional "coming soon" badge
 */
export function EmailProviderRow({
  provider,
  checked,
  onChange,
  comingSoon = false,
  disabled = false
}: EmailProviderRowProps) {
  const providerLabels: Record<string, string> = {
    gmail: 'Connect Gmail',
    outlook: 'Connect Outlook',
    icloud: 'Connect iCloud',
    imap: 'Other IMAP',
  };

  return (
    <div className="w-full flex gap-1 items-center">
      {/* Corner icon */}
      <CornerDownRight className="w-3 h-3 shrink-0 text-text-secondary" />

      {/* Provider label with optional "coming soon" */}
      <div className="flex-1 flex gap-3 items-center">
        <span className="font-normal text-base leading-[22px] text-text-primary tracking-tight">
          {providerLabels[provider]}
        </span>
        {comingSoon && (
          <span className="bg-brand-secondary-800 px-2 py-1 rounded-full shrink-0">
            <span className="font-normal text-[11px] leading-[13px] text-information-500" style={{ color: '#1171EE' }}>
              coming soon
            </span>
          </span>
        )}
      </div>

      {/* Toggle */}
      <Toggle
        checked={checked}
        onChange={onChange}
        disabled={comingSoon || disabled}
      />
    </div>
  );
}
