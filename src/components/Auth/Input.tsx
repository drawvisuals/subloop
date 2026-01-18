import { InputHTMLAttributes, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

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
	id,
	...props
}: InputProps) {
	const [showPassword, setShowPassword] = useState(false);
	const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-') || 'field'}`;
	const errorId = `${inputId}-error`;
	const inputType = showPasswordToggle && type === 'password'
		? (showPassword ? 'text' : 'password')
		: type;

	return (
		<div className={`flex flex-col gap-2 items-start w-full ${className}`}>
			{/* Label */}
			<label htmlFor={inputId} className="h-4 leading-normal text-text-secondary text-base tracking-tight whitespace-pre-wrap">
				{label}
			</label>

			{/* Input Container */}
			<div className={`relative w-full bg-neutral-900 border-2 rounded-lg overflow-hidden ${error
					? 'border-danger-500'
					: 'border-neutral-700 focus-within:border-brand-primary-500'
				}`}>
				<input
					{...props}
					id={inputId}
					type={inputType}
					className="w-full h-[62px] px-4 py-5 bg-neutral-900 text-text-primary text-base leading-normal tracking-tight placeholder:text-text-secondary focus:outline-none rounded-lg"
					aria-invalid={error ? 'true' : undefined}
					aria-describedby={error ? errorId : undefined}
				/>

				{/* Password Toggle */}
				{showPasswordToggle && (
					<button
						type="button"
						onClick={() => setShowPassword(!showPassword)}
						className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
						aria-label={showPassword ? 'Hide password' : 'Show password'}
					>
						{showPassword ? (
							<EyeOff className="w-4 h-4" />
						) : (
							<Eye className="w-4 h-4" />
						)}
					</button>
				)}
			</div>

			{/* Error Message */}
			{error && (
				<p id={errorId} className="text-sm text-text-danger leading-normal" role="alert">
					{error}
				</p>
			)}
		</div>
	);
}
