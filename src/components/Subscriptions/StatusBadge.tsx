/**
 * Status badge component for subscription status display
 * Matches Figma design for Active, Inactive, and Review states
 */

interface StatusBadgeProps {
	status: 'Active' | 'Inactive' | 'Review';
	className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
	if (status === 'Active') {
		return (
			<span className={`inline-block bg-success-500 px-3 py-1.5 rounded text-xs font-mono font-medium leading-3 text-text-badgeActive ${className}`}>
				Active
			</span>
		);
	}

	if (status === 'Inactive') {
		return (
			<span className={`inline-block bg-danger-500 px-3 py-1.5 rounded text-xs font-mono font-medium leading-3 text-text-badgeInactive ${className}`}>
				Inactive
			</span>
		);
	}

	// Review status
	return (
		<span className={`inline-block border border-dashed border-neutral-700 px-3 py-1.5 rounded text-xs font-mono font-medium leading-3 text-text-badgeReview ${className}`}>
			Review
		</span>
	);
}
