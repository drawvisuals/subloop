import { InputHTMLAttributes, useState, useRef } from 'react';
import { Search as SearchIcon } from 'lucide-react';

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> { }

/**
 * Search input component for subscriptions list
 * States: default (neutral-200), hover (white), focus (neutral-200 with outline - keyboard only), disabled (neutral-600)
 */
export function SearchInput({ className = '', disabled, ...props }: SearchInputProps) {
	const [isHovered, setIsHovered] = useState(false);
	const [isKeyboardFocused, setIsKeyboardFocused] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const lastInteractionRef = useRef<'mouse' | 'keyboard' | null>(null);

	// Determine icon and placeholder colors based on state
	// Icon: neutral-200 (default), white (hover), neutral-200 (keyboard focus), neutral-600 (disabled)
	// Placeholder: neutral-200 (default), white (hover), neutral-200 (keyboard focus), neutral-600 (disabled)
	const getIconColor = () => {
		if (disabled) return 'text-neutral-600';
		// Keyboard focus: neutral-200, hover: white (hover takes precedence if not keyboard focused)
		if (isKeyboardFocused) return 'text-text-secondary';
		if (isHovered) return 'text-text-primary';
		return 'text-text-secondary';
	};

	const getPlaceholderColor = () => {
		if (disabled) return 'placeholder:text-neutral-600';
		// Keyboard focus: neutral-200, hover: white (hover takes precedence if not keyboard focused)
		if (isKeyboardFocused) return 'placeholder:text-text-secondary';
		if (isHovered) return 'placeholder:text-text-primary';
		return 'placeholder:text-text-secondary';
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Tab') {
			lastInteractionRef.current = 'keyboard';
		}
		props.onKeyDown?.(e);
	};

	const handleMouseDown = () => {
		lastInteractionRef.current = 'mouse';
	};

	const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
		// Only show focus ring if focus was triggered by keyboard (Tab)
		if (lastInteractionRef.current === 'keyboard') {
			setIsKeyboardFocused(true);
		}
		props.onFocus?.(e);
	};

	const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		setIsKeyboardFocused(false);
		lastInteractionRef.current = null;
		props.onBlur?.(e);
	};

	return (
		<div
			className={`relative w-full sm:w-[438px] ${className}`}
			onMouseEnter={() => !disabled && setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			{/* Focus outline ring - only shown when keyboard-focused */}
			{isKeyboardFocused && !disabled && (
				<div className="absolute -inset-[5px] border-2 border-neutral-500 rounded-xl pointer-events-none" />
			)}
			<div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
				<SearchIcon className={`w-4 h-4 transition-colors ${getIconColor()}`} aria-hidden="true" />
			</div>
			<input
				ref={inputRef}
				type="search"
				{...props}
				disabled={disabled}
				onKeyDown={handleKeyDown}
				onMouseDown={handleMouseDown}
				onFocus={handleFocus}
				onBlur={handleBlur}
				className={`w-full h-[53px] pl-12 pr-4 rounded-lg text-text-primary ${getPlaceholderColor()} text-base leading-normal tracking-tight focus:outline-none transition-colors ${disabled ? 'cursor-not-allowed opacity-60' : ''} ${isHovered && !disabled && !isKeyboardFocused ? 'bg-neutral-600 border-2 border-neutral-900' : 'bg-neutral-900 border-2 border-neutral-700'}`}
				aria-label="Search subscriptions"
			/>
		</div>
	);
}
