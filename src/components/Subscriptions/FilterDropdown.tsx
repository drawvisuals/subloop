import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface FilterOption {
	value: string;
	label: string;
}

interface FilterDropdownProps {
	label: string;
	options: FilterOption[];
	value?: string;
	onChange?: (value: string) => void;
	className?: string;
}

/**
 * Filter dropdown component for subscriptions list
 */
export function FilterDropdown({
	label,
	options,
	value,
	onChange,
	className = ''
}: FilterDropdownProps) {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		}

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const selectedOption = options.find(opt => opt.value === value);

	return (
		<div ref={dropdownRef} className={`relative ${className}`}>
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className="h-[52px] px-6 py-2.5 bg-transparent border border-neutral-200 rounded-lg flex gap-2 items-center justify-center hover:border-neutral-300 transition-colors w-full"
				aria-label={`Filter by ${label}`}
				aria-expanded={isOpen}
				aria-haspopup="listbox"
			>
				<span className="font-mono font-normal text-sm leading-5 text-neutral-700">
					{selectedOption?.label || label}
				</span>
				<ChevronDown className={`w-3 h-3 text-neutral-700 transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
			</button>

			{isOpen && (
				<div
					className="absolute top-full mt-1 w-full bg-neutral-50 border border-neutral-200 rounded-lg shadow-lg z-50 py-1"
					role="listbox"
				>
					{options.map((option) => (
						<button
							key={option.value}
							type="button"
							onClick={() => {
								onChange?.(option.value);
								setIsOpen(false);
							}}
							role="option"
							aria-selected={value === option.value}
							className={`w-full text-left px-4 py-2 text-sm text-white hover:bg-neutral-100 transition-colors ${value === option.value ? 'bg-neutral-100' : ''
								}`}
						>
							{option.label}
						</button>
					))}
				</div>
			)}
		</div>
	);
}
