import { ReactNode } from 'react';

interface GoogleButtonProps {
  onClick?: () => void;
  children: ReactNode;
  disabled?: boolean;
}

/**
 * Google OAuth button component
 * Matches Figma design: white background, black text, Google icon
 */
export function GoogleButton({ onClick, children, disabled = false }: GoogleButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full h-[54px] px-6 py-4 bg-white rounded-lg flex gap-2 items-center justify-center transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {/* Google Icon - placeholder, will be replaced with actual icon */}
      <div className="w-5 h-5 shrink-0 bg-neutral-500 rounded-sm" />
      <span className="font-semibold text-base leading-[22px] text-neutral-50 text-center">
        {children}
      </span>
    </button>
  );
}
