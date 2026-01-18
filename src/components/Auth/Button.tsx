import { ButtonHTMLAttributes, ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'primary' | 'secondary';
	children: ReactNode;
	showArrow?: boolean;
}

/**
 * Primary button component matching Figma design
 * - Primary: blue background with dark text
 * - Includes optional arrow icon
 */
export function Button({
	variant = 'primary',
	children,
	showArrow = false,
	className = '',
	...props
}: ButtonProps) {
	const baseClasses = 'w-full h-[54px] px-6 py-4 rounded-lg flex gap-2 items-center justify-center font-semibold text-base leading-normal transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed';

	const variantClasses = variant === 'primary'
		? 'bg-brand-primary-500 text-text-inverse'
		: 'bg-foundation-white text-text-inverse';

	return (
		<button
			className={`${baseClasses} ${variantClasses} ${className}`}
			{...props}
		>
			<span>{children}</span>
			{showArrow && (
				<ArrowRight className="w-[18px] h-[18px] shrink-0" />
			)}
		</button>
	);
}
