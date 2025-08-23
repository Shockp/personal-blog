'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
  trigger?: ReactNode;
  align?: 'left' | 'right';
}

/**
 * Reusable dropdown component with keyboard navigation
 * Provides consistent styling and behavior across the application
 */
export function Dropdown({
  options,
  value,
  onSelect,
  placeholder = 'Select option',
  disabled = false,
  className,
  buttonClassName,
  menuClassName,
  trigger,
  align = 'left',
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const selectedOption = options.find(option => option.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!isOpen) return;

      switch (event.key) {
        case 'Escape':
          setIsOpen(false);
          setFocusedIndex(-1);
          buttonRef.current?.focus();
          break;
        case 'ArrowDown':
          event.preventDefault();
          setFocusedIndex(prev => (prev < options.length - 1 ? prev + 1 : 0));
          break;
        case 'ArrowUp':
          event.preventDefault();
          setFocusedIndex(prev => (prev > 0 ? prev - 1 : options.length - 1));
          break;
        case 'Enter':
        case ' ':
          event.preventDefault();
          const selectedOption = options[focusedIndex];
          if (focusedIndex >= 0 && selectedOption && !selectedOption.disabled) {
            onSelect(selectedOption.value);
            setIsOpen(false);
            setFocusedIndex(-1);
          }
          break;
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, focusedIndex, options, onSelect]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setFocusedIndex(-1);
    }
  };

  const handleSelect = (optionValue: string) => {
    onSelect(optionValue);
    setIsOpen(false);
    setFocusedIndex(-1);
  };

  return (
    <div className={cn('relative', className)} ref={dropdownRef}>
      {trigger ? (
        <button
          ref={buttonRef}
          onClick={handleToggle}
          disabled={disabled}
          className='w-full'
          aria-haspopup='listbox'
          aria-expanded={isOpen}
        >
          {trigger}
        </button>
      ) : (
        <Button
          ref={buttonRef}
          variant='outline'
          onClick={handleToggle}
          disabled={disabled}
          className={cn('w-full justify-between', buttonClassName)}
          aria-haspopup='listbox'
          aria-expanded={isOpen}
        >
          <span className='truncate'>
            {selectedOption?.label || placeholder}
          </span>
          <ChevronDown
            className={cn(
              'h-4 w-4 transition-transform',
              isOpen && 'rotate-180'
            )}
          />
        </Button>
      )}

      {isOpen && (
        <div
          className={cn(
            'absolute z-50 mt-1 w-full rounded-md border bg-popover p-1 text-popover-foreground shadow-md',
            align === 'right' && 'right-0',
            menuClassName
          )}
          role='listbox'
        >
          {options.map((option, index) => (
            <button
              key={option.value}
              onClick={() => !option.disabled && handleSelect(option.value)}
              disabled={option.disabled}
              className={cn(
                'relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
                'hover:bg-accent hover:text-accent-foreground',
                'focus:bg-accent focus:text-accent-foreground',
                'disabled:pointer-events-none disabled:opacity-50',
                focusedIndex === index && 'bg-accent text-accent-foreground',
                value === option.value &&
                  'bg-accent text-accent-foreground font-medium'
              )}
              role='option'
              aria-selected={value === option.value}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}