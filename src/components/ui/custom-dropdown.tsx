'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface Option {
  value: string;
  label: string;
}

interface CustomDropdownProps {
  options: Option[];
  selectedValue: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
}

export default function CustomDropdown({ 
  options, 
  selectedValue, 
  onChange, 
  label, 
  placeholder = "Select an option" 
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const selectedOption = options.find(option => option.value === selectedValue);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (value: string) => {
    onChange(value);
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col relative" ref={dropdownRef}>
      <label className="text-xs mb-2 text-dark/70 font-medium">{label}</label>
      
      {/* Dropdown trigger */}
      <motion.div
        className="relative cursor-pointer bg-white/50 backdrop-blur-sm rounded-lg border border-accent/20 shadow-sm hover:border-accent/40 transition-all duration-200"
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center justify-between py-3 px-4">
          <span className={`text-sm font-medium ${
            selectedOption ? 'text-accent' : 'text-gray-500'
          }`}>
            {selectedOption?.label || placeholder}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDownIcon className="w-4 h-4 text-gray-400" />
          </motion.div>
        </div>

        {/* Accent border indicator */}
        {selectedOption && (
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-accent to-transparent rounded-l-lg">
            <div className="absolute h-3/5 w-[300%] top-1/2 -translate-y-1/2 bg-accent blur-sm opacity-40" />
          </div>
        )}
      </motion.div>

      {/* Dropdown menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full left-0 right-0 mt-1 z-50 bg-white/95 backdrop-blur-md rounded-lg border border-accent/20 shadow-lg overflow-hidden"
          >
            <div className="py-1">
              {options.map((option, index) => (
                <motion.div
                  key={option.value}
                  className={`px-4 py-2 cursor-pointer transition-all duration-150 relative ${
                    selectedValue === option.value
                      ? 'bg-accent/10 text-accent font-semibold border-l-2 border-accent'
                      : 'text-gray-700 hover:bg-accent/5 hover:text-accent'
                  }`}
                  onClick={() => handleSelect(option.value)}
                  whileHover={{ backgroundColor: 'rgba(134, 239, 172, 0.08)' }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.2 }}
                >
                  <span className="text-sm font-medium">{option.label}</span>
                  
                  {/* Selection indicator */}
                  {selectedValue === option.value && (
                    <motion.div
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className="w-2 h-2 bg-accent rounded-full" />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}