import '@testing-library/jest-dom';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MapSearch from '@/app/components/MapSearch';
import React from 'react';

// We mock the hook but use a local React state inside the mock 
// to ensure the component re-renders when setValue is called.
jest.mock('use-places-autocomplete', () => {
  return {
    __esModule: true,
    default: jest.fn(),
  };
});

jest.mock('../app/components/geocoder', () => ({
  __esModule: true,
  addressToCoordinates: jest.fn().mockResolvedValue([-79.2308, 43.8375])
}));

import usePlacesAutocomplete from 'use-places-autocomplete';

describe('MapSearch Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Implementation of the mock that uses real React state
    usePlacesAutocomplete.mockImplementation(() => {
      const [val, setVal] = React.useState('');
      return {
        ready: true,
        value: val,
        suggestions: { 
          status: 'OK', 
          data: [
            { place_id: '123', description: '300 Kingston Rd, Pickering, ON, Canada' }
          ] 
        },
        setValue: (newValue) => setVal(newValue),
        clearSuggestions: jest.fn(),
      };
    });
  });

  it('updates the text box with the address when the user types', async () => {
    const user = userEvent.setup();

    const placeholderText = "Search for a location..."
    render(<MapSearch placeholderText={placeholderText} setAddress={jest.fn} setCoordinates={jest.fn}/>);

    const input = await screen.findByPlaceholderText(placeholderText);
    
    // Type into the input
    await user.type(input, '300 Kingston Rd');
    
    // 2. Find the Pickering option in the dropdown
    // We use findByText because the list appears asynchronously
    const suggestion = await screen.findByText(/Pickering, ON/i);

    // 3. Click the suggestion
    await user.click(suggestion);

    // 5. Assert the input now shows the full address
    expect(input).toHaveValue('300 Kingston Rd, Pickering, ON, Canada');
    });
});