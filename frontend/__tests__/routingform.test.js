import '@testing-library/jest-dom';
import { render, screen, within, act, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, {useState} from 'react';


// We mock the hook but use a local React state inside the mock 
// to ensure the component re-renders when setValue is called.
jest.mock('use-places-autocomplete', () => {
    return {
    __esModule: true,
    default: jest.fn(),
    
  };
});

import usePlacesAutocomplete from 'use-places-autocomplete';

jest.mock('../app/components/MapDisplay', () => {
    return function MockMap() {
        return <div data-testid="tomtom-map" />;
    };
});
import RoutingForm from '@/app/components/RoutingForm';

// // Mock the TomTom library
// At the top of mapdisplay.test.js
jest.mock('@tomtom-org/maps-sdk/map', () => {
    const mMarker = {
        setLngLat: jest.fn().mockReturnThis(),
        addTo: jest.fn().mockReturnThis(),
        remove: jest.fn().mockReturnThis(),
    };

    return {
        TomTomMap: jest.fn().mockImplementation(() => ({
            on: jest.fn(),
            remove: jest.fn(),
            addControl: jest.fn(),
        })),
        TomTomMarker: jest.fn(() => mMarker), // Add this!
    };
});



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
        await user.clear(leaveTimeMin);
        await user.type(leaveTimeMin, '17:00')

        const leaveTimeMax = await screen.getByTestId('leave-time-max')
        await user.clear(leaveTimeMax);
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
        await user.clear(leaveTimeMin);
        await user.type(leaveTimeMin, '17:30')

        const leaveTimeMax = await screen.getByTestId('leave-time-max')
        await user.clear(leaveTimeMax);
        await user.type(leaveTimeMax, '17:00')

        // and time range is correct
        // When user hits submit

        const button = screen.getByRole('button', { name: "Submit" });
        await user.click(button);
        // Then they get the minimum time
        
        // Assert that the mock was called once
        expect(mockSubmit).toHaveBeenCalledTimes(0);
    });
    it('hides submit when form is loading', async () => {
        // Given user has filled form correctly
        
        const user = userEvent.setup();
        

        
        const TestRoutingFormWrapper = () => {
            const [loading, setLoading] = useState(false);
            
            const handleInternalSubmit = async () => {
                setLoading(true);
                // Simulate the API delay
                await new Promise((resolve) => {
                    // We attach the resolver to the window so the test can trigger it
                    window.resolveSubmit = resolve;
                });
                setLoading(false)
            };

            return <RoutingForm onSubmit={handleInternalSubmit} isLoading={loading} />;
        };

        render(<TestRoutingFormWrapper />);
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

        const leaveTimeMin = await screen.getByTestId('leave-time-min')
        await user.clear(leaveTimeMin);
        await user.type(leaveTimeMin, '17:00')

        const leaveTimeMax = await screen.getByTestId('leave-time-max')
        await user.clear(leaveTimeMax);
        await user.type(leaveTimeMax, '17:30')

        // When they click submit
        const button = screen.getByRole('button', { name: "Submit" });
        await user.click(button);
        // Then the submit button should disappear
        
        expect(button).not.toBeVisible();
        expect(await screen.getByText(/Loading result.../i)).toBeVisible()
        
        // And reappear when the form has loaded

        await act(async () => {
            window.resolveSubmit();
        });

        const reappearedButton = await screen.findByRole('button', { name: "Submit" });
        expect(reappearedButton).toBeInTheDocument();
        
    })

    it('adds source point to map when populated in form', async () => {
        // Given the user has put a source address
        const user = userEvent.setup();
        render(<RoutingForm />)

        const mapContainer = screen.getByTestId('tomtom-map');
    
        const sourceContainer= await screen.getByTestId('source-wrapper')
        const sourceInput = await screen.findByPlaceholderText("Source Address");
                
        await user.type(sourceInput, '300 Kingston Rd');
        
        // When they enter it
        const suggestion = await within(sourceContainer).findByText(/300/i);
        await user.click(suggestion);
        // Then the point should show on the map

        const { TomTomMarker } = require('@tomtom-org/maps-sdk/map');
    
        await waitFor(() => {
            expect(TomTomMarker).toHaveBeenCalled();
        });

        // 5. OPTIONAL: Check if it was placed at the right coordinates
        const markerInstance = TomTomMarker.mock.results[0].value;
        // Assuming your mock data returns these coordinates for 300 Kingston Rd
        expect(markerInstance.setLngLat).toHaveBeenCalled();

    })
});