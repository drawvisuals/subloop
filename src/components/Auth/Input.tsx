import { InputHTMLAttributes, useState } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  showPasswordToggle?: boolean;
}

/**
 * Input field component matching Figma design
 * - Label above input
 * - Placeholder text styling
 * - Error state support
 * - Password toggle support
 */
export function Input({
  label,
  error,
  showPasswordToggle = false,
  type = 'text',
  className = '',
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = showPasswordToggle && type === 'password'
    ? (showPassword ? 'text' : 'password')
    : type;

  return (
    <div className={`flex flex-col gap-2 items-start w-full ${className}`}>
      {/* Label */}
      <label className="h-4 leading-[22px] text-neutral-700 text-base tracking-tight whitespace-pre-wrap">
        {label}
      </label>

      {/* Input Container */}
      <div className={`relative w-full bg-neutral-50 border-2 rounded-lg ${
        error
          ? 'border-danger-500'
          : 'border-neutral-200 focus-within:border-brand-primary-500'
      }`}>
          <input
            {...props}
            type={inputType}
            className="w-full h-[62px] px-4 py-5 bg-transparent text-white text-base leading-[22px] tracking-tight placeholder:text-neutral-700 focus:outline-none"
          />

        {/* Password Toggle */}
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-700 hover:text-white transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {/* Eye icon placeholder - will be replaced with actual icon */}
            <div className="w-4 h-4 bg-neutral-700" />
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-danger-500 leading-[22px]">
          {error}
        </p>
      )}
    </div>
  );
}
