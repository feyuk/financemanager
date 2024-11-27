import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ClientDetailsScreen from '../screens/ClientDetailsScreen';
import { ClientContext } from '../contexts/ClientContext';

// Mock navigation
const mockNavigation = {
  goBack: jest.fn(),
  navigate: jest.fn(),
};

// Mock route with optional clientId
const createMockRoute = (clientId?: string | number) => ({
  params: { clientId },
});

// Sample existing client for testing
const existingClient = {
  id: '1',
  name: 'John Doe',
  salary: 5000,
  companyValue: 100000,
};

describe('ClientDetailsScreen Component', () => {
  // Common setup for most tests
  const setupComponent = (
    overrideContext = {}, 
    routeParams: { clientId?: string | number } = {}
  ) => {
    const defaultContext = {
      clients: [existingClient],
      addClient: jest.fn(),
      updateClient: jest.fn(),
    };

    const mergedContext = { ...defaultContext, ...overrideContext };
    const mockRoute = createMockRoute(routeParams.clientId);

    return render(
      <ClientContext.Provider value={mergedContext}>
        <ClientDetailsScreen 
          navigation={mockNavigation} 
          route={mockRoute} 
        />
      </ClientContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly for new client', () => {
    const { getByText, getByPlaceholderText } = setupComponent();

    // Check key elements are rendered
    expect(getByText('Detalhes do Cliente')).toBeTruthy();
    expect(getByPlaceholderText('Digite o nome do cliente')).toBeTruthy();
    expect(getByPlaceholderText('Digite o salário')).toBeTruthy();
    expect(getByPlaceholderText('Digite o valor da empresa')).toBeTruthy();
    expect(getByText('Salvar')).toBeTruthy();
  });

  it('pre-fills form for existing client', () => {
    const { getByPlaceholderText } = setupComponent(
      {}, 
      { clientId: existingClient.id }
    );

    const nameInput = getByPlaceholderText('Digite o nome do cliente') as any;
    const salaryInput = getByPlaceholderText('Digite o salário') as any;
    const companyValueInput = getByPlaceholderText('Digite o valor da empresa') as any;

    // Verify inputs are pre-filled with existing client data
    expect(nameInput.props.value).toBe(existingClient.name);
    expect(salaryInput.props.value).toBe(existingClient.salary);
    expect(companyValueInput.props.value).toBe(existingClient.companyValue);
  });

  it('calls addClient for new client creation', () => {
    const mockAddClient = jest.fn();
    const { getByText, getByPlaceholderText } = setupComponent({
      addClient: mockAddClient
    });

    // Fill out form
    fireEvent.changeText(
      getByPlaceholderText('Digite o nome do cliente'), 
      'New Client'
    );
    fireEvent.changeText(
      getByPlaceholderText('Digite o salário'), 
      '6000'
    );
    fireEvent.changeText(
      getByPlaceholderText('Digite o valor da empresa'), 
      '120000'
    );

    // Save client
    fireEvent.press(getByText('Salvar'));

    // Verify addClient was called with correct data
    expect(mockAddClient).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'New Client',
        salary: '6000',
        companyValue: '120000'
      })
    );
  });

  it('calls updateClient for existing client', () => {
    const mockUpdateClient = jest.fn();
    const { getByText, getByPlaceholderText } = setupComponent(
      { updateClient: mockUpdateClient },
      { clientId: existingClient.id }
    );

    // Change client details
    fireEvent.changeText(
      getByPlaceholderText('Digite o nome do cliente'), 
      'Updated Name'
    );

    // Save client
    fireEvent.press(getByText('Salvar'));

    // Verify updateClient was called with correct parameters
    expect(mockUpdateClient).toHaveBeenCalledWith(
      existingClient.id, 
      expect.objectContaining({
        name: 'Updated Name'
      })
    );
  });

  it('navigates back after saving', () => {
    const { getByText, getByPlaceholderText } = setupComponent();

    // Fill out form
    fireEvent.changeText(
      getByPlaceholderText('Digite o nome do cliente'), 
      'New Client'
    );
    fireEvent.changeText(
      getByPlaceholderText('Digite o salário'), 
      '6000'
    );
    fireEvent.changeText(
      getByPlaceholderText('Digite o valor da empresa'), 
      '120000'
    );

    // Save client
    fireEvent.press(getByText('Salvar'));

    // Verify navigation back
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it('matches snapshot', () => {
    const { toJSON } = setupComponent();
    expect(toJSON()).toMatchSnapshot();
  });
});