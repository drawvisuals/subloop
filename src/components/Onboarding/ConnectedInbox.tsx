interface ConnectedInboxProps {
  email: string;
  provider: 'gmail' | 'outlook';
  status: 'connected' | 'scanning' | 'error';
}

/**
 * Connected inbox row component
 * Shows email address, provider icon, and connection status
 */
export function ConnectedInbox({ email, provider, status }: ConnectedInboxProps) {
  return (
    <div className="w-full bg-neutral-100 flex items-center justify-between px-4 py-5 rounded-lg">
      {/* Email with provider icon */}
      <div className="flex gap-2 items-center">
        {/* Provider icon placeholder */}
        <div className="w-5 h-5 shrink-0 bg-neutral-500 rounded" />
        <span className="font-normal text-base leading-[22px] text-white tracking-tight">
          {email}
        </span>
      </div>

      {/* Status indicator */}
      <div className="flex gap-2 items-center shrink-0">
        {/* Status dot */}
        <div
          className={`w-1.5 h-1.5 rounded-full ${
            status === 'connected'
              ? 'bg-success-500'
              : status === 'scanning'
              ? 'bg-brand-primary-500 animate-pulse'
              : 'bg-danger-500'
          }`}
        />
        <span className={`font-light text-sm leading-5 tracking-tight ${
          status === 'connected'
            ? 'text-success-500'
            : status === 'scanning'
            ? 'text-brand-primary-500'
            : 'text-danger-500'
        }`}>
          {status === 'connected' ? 'Connected' : status === 'scanning' ? 'Scanning' : 'Error'}
        </span>
      </div>
    </div>
  );
}
