interface ProgressBarProps {
  progress: number; // 0-100
  label?: string;
}

/**
 * Progress bar component matching Figma design
 * - Gradient fill (brand-secondary-500 to brand-primary-500)
 * - Dark background container
 * - Percentage label on right
 */
export function ProgressBar({ progress, label }: ProgressBarProps) {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className="w-full flex flex-col gap-1 items-start px-4">
      <div className="w-full bg-neutral-100 border border-neutral-200 rounded-full p-1 flex gap-1 items-center">
        {/* Progress fill */}
        <div
          className="h-3 rounded-full transition-all duration-300"
          style={{
            width: `${clampedProgress}%`,
            backgroundImage: 'linear-gradient(to right, #1F36E6, #1EBBE6)',
          }}
        />
        {/* Percentage label */}
        {label && (
          <span className="font-normal text-[13px] leading-4 text-white">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
