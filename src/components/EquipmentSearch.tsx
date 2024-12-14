import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { Equipment } from '../types';
import { equipmentOptions } from '../data/equipment';

interface EquipmentSearchProps {
  selectedEquipment: string[];
  onEquipmentChange: (selected: string[]) => void;
}

export const EquipmentSearch = ({ selectedEquipment, onEquipmentChange }: EquipmentSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<Equipment[]>(equipmentOptions);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const filtered = equipmentOptions.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOptions(filtered);
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (id: string) => {
    const newSelected = selectedEquipment.includes(id)
      ? selectedEquipment.filter(item => item !== id)
      : [...selectedEquipment, id];
    onEquipmentChange(newSelected);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          placeholder="Search equipment..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsDropdownOpen(true)}
        />
        
        {isDropdownOpen && (
          <div
            ref={dropdownRef}
            className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
          >
            <div className="p-2">
              {filteredOptions.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`w-full text-left px-4 py-2 rounded-lg mb-1 text-sm transition-colors
                    ${selectedEquipment.includes(item.id)
                      ? 'bg-purple-100 text-purple-800'
                      : 'hover:bg-gray-50'
                    }`}
                >
                  {item.name}
                </button>
              ))}
              {filteredOptions.length === 0 && (
                <div className="p-3 text-sm text-gray-500 text-center">
                  No equipment found matching "{searchTerm}"
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {selectedEquipment.length > 0 && (
        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Equipment:</h4>
          <div className="flex flex-wrap gap-2">
            {selectedEquipment.map(id => {
              const item = equipmentOptions.find(opt => opt.id === id);
              return item ? (
                <span
                  key={id}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800"
                >
                  {item.name}
                  <button
                    onClick={() => handleSelect(id)}
                    className="hover:text-purple-600"
                  >
                    ×
                  </button>
                </span>
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  );
};