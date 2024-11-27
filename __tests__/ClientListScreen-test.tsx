import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import ClientListScreen from '../screens/ClientListScreen';
import { ClientContext } from '../contexts/ClientContext';

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
};

// Sample client data for testing
const mockClients = [
  { 
    id: '1', 
    name: 'John Doe', 
    salary: '5000', 
    companyValue: '100000' 
  },
  { 
    id: '2', 
    name: 'Jane Smith', 
    salary: '6000', 
    companyValue: '150000' 
  }
];

describe('ClientListScreen Component', () => {
  // Common setup for most tests
  const setupComponent = (overrideContext = {}) => {
    const defaultContext = {
      clients: mockClients,
      addClient: jest.fn(),
      deleteClient: jest.fn(),
    };

    const mergedContext = { ...defaultContext, ...overrideContext };

    return render(
      <ClientContext.Provider value={mergedContext}>
        <ClientListScreen navigation={mockNavigation} />
      </ClientContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with clients', () => {
    const { getByText, getAllByTestId } = setupComponent();

    // Check title shows correct number of clients
    expect(getByText('2 Clientes Cadastrados')).toBeTruthy();

    // Verify client list renders
    const clientCards = getAllByTestId('client-card');
    expect(clientCards.length).toBe(2);
  });

  it('opens and closes create client modal', () => {
    const { getByText, queryByPlaceholderText } = setupComponent();

    // Open modal
    const createClientButton = getByText('Criar Cliente');
    fireEvent.press(createClientButton);

    // Check modal inputs are visible
    const nameInput = queryByPlaceholderText('Nome');
    const salaryInput = queryByPlaceholderText('Salário');
    const companyValueInput = queryByPlaceholderText('Valor da Empresa');

    expect(nameInput).toBeTruthy();
    expect(salaryInput).toBeTruthy();
    expect(companyValueInput).toBeTruthy();
  });

  it('handles client creation with valid input', () => {
    const mockAddClient = jest.fn();
    const { getByText, getByPlaceholderText } = setupComponent({ 
      addClient: mockAddClient 
    });

    // Open modal
    const createClientButton = getByText('Criar Cliente');
    fireEvent.press(createClientButton);

    // Fill in client details
    const nameInput = getByPlaceholderText('Nome');
    const salaryInput = getByPlaceholderText('Salário');
    const companyValueInput = getByPlaceholderText('Valor da Empresa');
    const saveButton = getByText('Criar Cliente');

    fireEvent.changeText(nameInput, 'New Client');
    fireEvent.changeText(salaryInput, '7000');
    fireEvent.changeText(companyValueInput, '200000');

    // Save client
    fireEvent.press(saveButton);

    // Verify client was added
    expect(mockAddClient).toHaveBeenCalledWith(expect.objectContaining({
      name: 'New Client',
      salary: '7000',
      companyValue: '200000'
    }));
  });

  it('prevents client creation with empty fields', () => {
    const mockAlert = jest.spyOn(Alert, 'alert');
    const { getByText } = setupComponent();

    // Open modal
    const createClientButton = getByText('Criar Cliente');
    fireEvent.press(createClientButton);

    // Attempt to save without filling fields
    const saveButton = getByText('Criar Cliente');
    fireEvent.press(saveButton);

    // Verify alert was called
    expect(mockAlert).toHaveBeenCalledWith('Preencha todos os campos!');
  });

  it('navigates to client details on edit', () => {
    const { getAllByText } = setupComponent();

    // Find and press edit button
    const editButtons = getAllByText('Editar');
    fireEvent.press(editButtons[0]);

    // Verify navigation
    expect(mockNavigation.navigate).toHaveBeenCalledWith('ClientDetails', { 
      clientId: mockClients[0].id 
    });
  });

  it('shows delete confirmation for client deletion', () => {
    const mockDeleteClient = jest.fn();
    const mockAlert = jest.spyOn(Alert, 'alert');

    const { getAllByText } = setupComponent({ 
      deleteClient: mockDeleteClient 
    });

    // Find and press delete button
    const deleteButtons = getAllByText('Excluir');
    fireEvent.press(deleteButtons[0]);

    // Verify alert was shown
    expect(mockAlert).toHaveBeenCalledWith(
      "Confirmar exclusão",
      "Você tem certeza que deseja excluir?",
      expect.any(Array)
    );
  });

  it('matches snapshot', () => {
    const { toJSON } = setupComponent();
    expect(toJSON()).toMatchSnapshot();
  });
});