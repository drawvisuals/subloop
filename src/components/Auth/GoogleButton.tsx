import { ReactNode } from 'react';
import { GoogleIcon } from './GoogleIcon';

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
      className="w-full h-[54px] px-6 py-4 bg-foundation-white rounded-lg flex gap-2 items-center justify-center transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <GoogleIcon className="w-5 h-5 shrink-0" />
      <span className="font-semibold text-base leading-normal text-text-inverse text-center">
        {children}
      </span>
    </button>
  );
}
