import React from 'react';
import { render, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ClientProvider, ClientContext } from '../contexts/ClientContext';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe('ClientContext', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Sample client data
  const initialClients = [
    { id: '1', name: 'Alexandre Junio', salary: '7000', companyValue: '450000' },
    { id: '2', name: 'Cleiton', salary: '8500', companyValue: '120000' },
  ];

  const renderProvider = (children: React.ReactNode) => {
    return render(
      <ClientProvider>{children}</ClientProvider>
    );
  };

  it('initializes with default clients when no stored data exists', async () => {
    // Mock AsyncStorage to return null (no stored clients)
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    let contextValue: any;
    const TestComponent = () => {
      contextValue = React.useContext(ClientContext);
      return null;
    };

    await act(async () => {
      renderProvider(<TestComponent />);
    });

    // Verify AsyncStorage was called and initial data was set
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('clients');
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'clients', 
      JSON.stringify(expect.any(Array))
    );
    expect(contextValue?.clients.length).toBe(3);
  });

  it('loads clients from AsyncStorage when data exists', async () => {
    // Mock AsyncStorage to return stored clients
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify(initialClients)
    );

    let contextValue: any;
    const TestComponent = () => {
      contextValue = React.useContext(ClientContext);
      return null;
    };

    await act(async () => {
      renderProvider(<TestComponent />);
    });

    // Verify clients were loaded from storage
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('clients');
    expect(contextValue?.clients).toEqual(initialClients);
  });

  it('adds a new client', async () => {
    // Mock initial storage
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify(initialClients)
    );

    let contextValue: any;
    const TestComponent = () => {
      contextValue = React.useContext(ClientContext);
      return null;
    };

    await act(async () => {
      const { rerender } = renderProvider(<TestComponent />);
      
      // Add a new client
      contextValue.addClient({
        id: '3',
        name: 'New Client',
        salary: '9000',
        companyValue: '200000'
      });

      // Rerender to update context
      rerender(<TestComponent />);
    });

    // Verify new client was added and AsyncStorage was updated
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'clients', 
      expect.any(String)
    );
    expect(contextValue?.clients.length).toBe(3);
    expect(contextValue?.clients[2].name).toBe('New Client');
  });

  it('updates an existing client', async () => {
    // Mock initial storage
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify(initialClients)
    );

    let contextValue: any;
    const TestComponent = () => {
      contextValue = React.useContext(ClientContext);
      return null;
    };

    await act(async () => {
      const { rerender } = renderProvider(<TestComponent />);
      
      // Update an existing client
      contextValue.updateClient('1', {
        name: 'Updated Name',
        salary: '8000'
      });

      // Rerender to update context
      rerender(<TestComponent />);
    });

    // Verify client was updated and AsyncStorage was called
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'clients', 
      expect.any(String)
    );
    
    const updatedClient = contextValue.clients.find((c: any) => c.id === '1');
    expect(updatedClient.name).toBe('Updated Name');
    expect(updatedClient.salary).toBe('8000');
  });

  it('deletes a client', async () => {
    // Mock initial storage
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify(initialClients)
    );

    let contextValue: any;
    const TestComponent = () => {
      contextValue = React.useContext(ClientContext);
      return null;
    };

    await act(async () => {
      const { rerender } = renderProvider(<TestComponent />);
      
      // Delete a client
      contextValue.deleteClient('1');

      // Rerender to update context
      rerender(<TestComponent />);
    });

    // Verify client was deleted and AsyncStorage was updated
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'clients', 
      expect.any(String)
    );
    expect(contextValue?.clients.length).toBe(1);
    expect(contextValue?.clients[0].id).toBe('2');
  });

  it('handles errors in AsyncStorage operations', async () => {
    // Mock console.error to verify error handling
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    // Mock AsyncStorage to throw an error
    (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('Storage Error'));
    
    let contextValue: any;
    const TestComponent = () => {
      contextValue = React.useContext(ClientContext);
      return null;
    };

    await act(async () => {
      renderProvider(<TestComponent />);
    });

    // Verify error was logged
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error loading clients', 
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });
});