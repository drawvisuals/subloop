import { InputHTMLAttributes } from 'react';
import { Search as SearchIcon } from 'lucide-react';

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {}

/**
 * Search input component for subscriptions list
 */
export function SearchInput({ className = '', ...props }: SearchInputProps) {
  return (
    <div className={`relative w-[438px] ${className}`}>
      <div className="absolute left-4 top-1/2 -translate-y-1/2">
        <SearchIcon className="w-4 h-4 text-neutral-700" />
      </div>
      <input
        type="search"
        {...props}
        className="w-full h-[53px] pl-12 pr-4 bg-neutral-50 border border-neutral-200 rounded-lg text-white text-base leading-[22px] tracking-tight placeholder:text-neutral-700 focus:outline-none focus:border-brand-primary-500"
        placeholder="Search"
      />
    </div>
  );
}
