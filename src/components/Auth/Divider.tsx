/**
 * OR divider component matching Figma design
 * Horizontal line with "OR" text in center
 */
export function Divider() {
  return (
    <div className="w-full flex gap-6 items-center justify-center">
      {/* Left Line */}
      <div className="flex-1 h-px min-h-px min-w-px bg-neutral-700" />

      {/* OR Text */}
      <span className="shrink-0 text-text-secondary text-base leading-[22px] text-center tracking-tight">
        OR
      </span>

      {/* Right Line */}
      <div className="flex-1 h-px min-h-px min-w-px bg-neutral-700" />
    </div>
  );
}
