import React from 'react';
import { cn } from '../utils/cn';
import { ChevronDown } from 'lucide-react';

interface Option<T> {
  label: string;
  value: T;
}

interface Props<T> extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'size' | 'value'> {
  label?: string;
  options: Option<T>[];
  value?: T;
  onChange: (value: T) => void;
  placeholder?: string;
  error?: string;
  helperText?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Select<T extends string | number>({
  label,
  options,
  value,
  onChange,
  placeholder = "Select...",
  error,
  helperText,
  size = 'md',
  className,
  disabled,
  ...rest
}: Props<T>) {
  const baseClasses = 'w-full border bg-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 appearance-none';

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm rounded-lg',
    md: 'px-4 py-2.5 text-sm rounded-xl',
    lg: 'px-4 py-3 text-base rounded-xl'
  };

  const errorClasses = error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className="relative">
        <select
          value={value ?? ''}
          onChange={e => {
            const selected = e.target.value as T;
            onChange(typeof options[0]?.value === 'number' ? (Number(selected) as T) : selected);
          }}
          disabled={disabled}
          className={cn(
            baseClasses,
            sizeClasses[size],
            errorClasses,
            'pr-10', // Space for chevron icon
            className
          )}
          {...rest}
        >
          <option value="">{placeholder}</option>
          {options.map(opt => (
            <option key={String(opt.value)} value={String(opt.value)}>
              {opt.label}
            </option>
          ))}
        </select>

        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
}
  