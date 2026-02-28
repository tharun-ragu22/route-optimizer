import '@testing-library/jest-dom';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RoutingForm from '@/app/components/RoutingForm';
import React from 'react';

// We mock the hook but use a local React state inside the mock 
// to ensure the component re-renders when setValue is called.
jest.mock('use-places-autocomplete', () => {
  return {
    __esModule: true,
    default: jest.fn(),
    
  };
});

import usePlacesAutocomplete from 'use-places-autocomplete';

describe('RoutingForm Component', () => {
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
                { place_id: '123', description: '300 Kingston Rd, Pickering, ON, Canada' },
                { place_id: '456', description: '750 Kingston Rd, Pickering, ON, Canada' }
            ] 
            },
            setValue: (newValue) => setVal(newValue),
            clearSuggestions: jest.fn(),
        };
        });
    });

    it('submits form when info is correct', async () => {
        // Given the user has filled out source and destination
        const user = userEvent.setup();
        const mockSubmit = jest.fn();
        render(<RoutingForm onSubmit={mockSubmit}/>);
        const sourceContainer= await screen.getByTestId('source-wrapper')
        const sourceInput = await screen.findByPlaceholderText("Source Address");
        
        await user.type(sourceInput, '300 Kingston Rd');
        const suggestion = await within(sourceContainer).findByText(/300/i);
        await user.click(suggestion);

        const destinationContainer= await screen.getByTestId('destination-wrapper')
        const destinationInput = await screen.findByPlaceholderText("Destination Address");
        
        
        await user.type(destinationInput, '750 Kingston Rd');
        const destinationSuggestion = await within(destinationContainer).findByText(/750/i);
        await user.click(destinationSuggestion);

        // And source to destination is driveable
        // And user selects time range

        const leaveTimeMin = await screen.getByTestId('leave-time-min')
        await user.type(leaveTimeMin, '17:00')
        const leaveTimeMax = await screen.getByTestId('leave-time-max')
        await user.type(leaveTimeMax, '17:30')

        // and time range is correct
        // When user hits submit

        const button = screen.getByRole('button', { name: "Submit" });
        await user.click(button);
        // Then they get the minimum time
        
        // Assert that the mock was called once
        expect(mockSubmit).toHaveBeenCalledTimes(1);
    });

    it('does not submit when time range is not correct', async () => {
        // Given the user has filled out source and destination
        const user = userEvent.setup();
        const mockSubmit = jest.fn();
        render(<RoutingForm onSubmit={mockSubmit}/>);
        const sourceContainer= await screen.getByTestId('source-wrapper')
        const sourceInput = await screen.findByPlaceholderText("Source Address");
        
        await user.type(sourceInput, '300 Kingston Rd');
        const suggestion = await within(sourceContainer).findByText(/300/i);
        await user.click(suggestion);

        const destinationContainer= await screen.getByTestId('destination-wrapper')
        const destinationInput = await screen.findByPlaceholderText("Destination Address");
        
        
        await user.type(destinationInput, '750 Kingston Rd');
        const destinationSuggestion = await within(destinationContainer).findByText(/750/i);
        await user.click(destinationSuggestion);

        // And source to destination is driveable
        // And user selects time range

        const leaveTimeMin = await screen.getByTestId('leave-time-min')
        await user.type(leaveTimeMin, '17:30')
        const leaveTimeMax = await screen.getByTestId('leave-time-max')
        await user.type(leaveTimeMax, '17:00')

        // and time range is correct
        // When user hits submit

        const button = screen.getByRole('button', { name: "Submit" });
        await user.click(button);
        // Then they get the minimum time
        
        // Assert that the mock was called once
        expect(mockSubmit).toHaveBeenCalledTimes(0);
    });
});