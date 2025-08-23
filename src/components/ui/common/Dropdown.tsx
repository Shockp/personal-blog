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
            'absolute z-[100] mt-1 w-full min-w-[8rem] overflow-hidden rounded-md border p-1 shadow-lg',
            'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
            align === 'right' && 'right-0',
            menuClassName
          )}
          style={{
            backgroundColor: 'var(--background)',
            color: 'var(--foreground)',
            borderColor: 'var(--border)'
          }}
          role='listbox'
        >
          {options.map((option, index) => (
            <button
              key={option.value}
              onClick={() => !option.disabled && handleSelect(option.value)}
              disabled={option.disabled}
              className={cn(
                'relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
                'disabled:pointer-events-none disabled:opacity-50',
                focusedIndex === index && 'font-medium',
                value === option.value && 'font-medium'
              )}
              style={{
                color: 'var(--foreground)',
                backgroundColor: (focusedIndex === index || value === option.value) ? 'var(--muted)' : 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--muted)';
              }}
              onMouseLeave={(e) => {
                if (focusedIndex !== index && value !== option.value) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
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