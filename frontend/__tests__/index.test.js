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
    getGeocode: jest.fn().mockResolvedValue([
    {
      formatted_address: '300 Kingston Rd, Pickering, ON',
      geometry: {
        location: { lat: 43.8375, lng: -79.0837 }
      }
    }
  ]),
  getLatLng: jest.fn().mockResolvedValue({ lat: 43.8375, lng: -79.0837 }),
  };
});

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
    const onSelectMock = jest.fn(); // Define this so the test can track it
    render(<MapSearch onSelectLocation={onSelectMock} />);

    const input = await screen.findByPlaceholderText("Search for a location...");
    
    // Type into the input
    await user.type(input, '300 Kingston Rd');
    
    // 2. Find the Pickering option in the dropdown
    // We use findByText because the list appears asynchronously
    const suggestion = await screen.findByText(/Pickering, ON/i);

    // 3. Click the suggestion
    await user.click(suggestion);

    // 4. Assert that the callback was called with Pickering's data
    expect(onSelectMock).toHaveBeenCalledWith({
      address: '300 Kingston Rd, Pickering, ON',
      lat: 43.8375,
      lng: -79.0837
    });

    // 5. Assert the input now shows the full address
    expect(input).toHaveValue('300 Kingston Rd, Pickering, ON, Canada');
    });
});