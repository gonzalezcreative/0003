import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';

interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const LocationInput = ({ value, onChange, error }: LocationInputProps) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Simulated address suggestions - in a real app, this would come from an API
  const getSuggestions = (input: string) => {
    const sampleAddresses = [
      '123 Main St, Austin, TX 78701',
      '456 Oak Ave, Austin, TX 78702',
      '789 Pine Rd, Austin, TX 78703',
      '321 Cedar Ln, Dallas, TX 75201',
      '654 Elm St, Dallas, TX 75202',
      '987 Maple Dr, Houston, TX 77001',
      '147 Birch Blvd, Houston, TX 77002',
    ];

    return sampleAddresses.filter(address =>
      address.toLowerCase().includes(input.toLowerCase())
    );
  };

  useEffect(() => {
    if (value.length > 2) {
      setSuggestions(getSuggestions(value));
    } else {
      setSuggestions([]);
    }
  }, [value]);

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Location
      </label>
      <div className="relative">
        <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <input
          type="text"
          className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          placeholder="Enter address"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              className="w-full text-left px-4 py-2 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
              onClick={() => {
                onChange(suggestion);
                setShowSuggestions(false);
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};