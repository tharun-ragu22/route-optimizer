'use client';

import usePlacesAutocomplete from 'use-places-autocomplete';
import { addressToCoordinates } from './geocoder';

interface MapSearchProps{ 
  placeholderText: string
  setAddress: (address: string | null) => void 
  setCoordinates:  (coordinates: [number, number] | null) => void
}


export default function MapSearch({ placeholderText, setAddress, setCoordinates }: MapSearchProps) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    debounce: 300, // Wait 300ms after typing before calling the API
  });

  const handleSelect = async (address: string) => {
    setValue(address, false);
    clearSuggestions();
    setAddress(address)
    setCoordinates(await addressToCoordinates(address));
    
  };

  return (
    <div className="relative w-full max-w-md">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={!ready}
        placeholder={placeholderText}
        className="w-full p-2 border rounded shadow-sm text-black"
      />
      {status === 'OK' && (
        <ul className="absolute z-10 w-full bg-white border mt-1 rounded shadow-lg">
          {data.map(({ place_id, description }) => (
            <li 
              key={place_id} 
              onClick={() => handleSelect(description)}
              className="p-2 cursor-pointer hover:bg-gray-100 text-black"
            >
              {description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}