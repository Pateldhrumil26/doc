import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface DropdownOption<T = string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
  description?: string;
}

interface DropdownProps<T = string> {
  options: DropdownOption<T>[];
  value: T;
  onChange: (val: T) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  menuWidth?: string;
  align?: 'left' | 'right';
}

export function Dropdown<T extends string | number>({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  icon,
  className = '',
  style,
  menuWidth = 'auto',
  align = 'left',
}: DropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => String(opt.value) === String(value));

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      window.document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  return (
    <div
      className={`custom-dropdown-container ${isOpen ? 'menu-open' : ''} ${className}`}
      ref={dropdownRef}
      style={style}
    >
      <button
        type="button"
        className={`custom-dropdown-trigger ${isOpen ? 'active' : ''}`}
        onClick={handleToggle}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="dropdown-trigger-content">
          {icon && <span className="dropdown-trigger-icon">{icon}</span>}
          <span className="dropdown-trigger-label">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown size={14} className={`dropdown-chevron ${isOpen ? 'rotate' : ''}`} />
      </button>

      {isOpen && (
        <div
          className={`custom-dropdown-menu align-${align}`}
          style={{ minWidth: menuWidth !== 'auto' ? menuWidth : '100%' }}
          role="listbox"
          onClick={(e) => e.stopPropagation()}
        >
          {options.map((opt) => {
            const isSelected = String(opt.value) === String(value);
            return (
              <button
                key={String(opt.value)}
                type="button"
                className={`custom-dropdown-item ${isSelected ? 'selected' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                role="option"
                aria-selected={isSelected}
              >
                <div className="dropdown-item-left">
                  {opt.icon && <span className="dropdown-item-icon">{opt.icon}</span>}
                  <div className="dropdown-item-text">
                    <span className="dropdown-item-label">{opt.label}</span>
                    {opt.description && (
                      <span className="dropdown-item-desc">{opt.description}</span>
                    )}
                  </div>
                </div>
                {isSelected && <Check size={14} className="dropdown-item-check" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
