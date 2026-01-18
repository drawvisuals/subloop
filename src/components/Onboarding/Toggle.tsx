interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

/**
 * Toggle switch component matching Figma design
 * - Off state: gray background (#7c7c7c)
 * - On state: green background (#00e177) with white circle
 * - Disabled state: dark background (#101010)
 */
export function Toggle({ checked, onChange, disabled = false }: ToggleProps) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative w-11 h-6 rounded-full p-1 transition-colors flex items-center ${
        disabled
          ? 'bg-neutral-100 cursor-not-allowed'
          : checked
          ? 'bg-success-500 justify-end'
          : 'bg-neutral-700 justify-start'
      }`}
      aria-label={checked ? 'Enabled' : 'Disabled'}
      aria-checked={checked}
      role="switch"
    >
      <div className="w-4 h-4 bg-white rounded-full transition-transform" />
    </button>
  );
}
