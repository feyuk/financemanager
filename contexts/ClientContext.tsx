import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Client {
  id: string;
  name: string;
  salary: string;
  companyValue: string;
}

interface ClientContextType {
  clients: Client[];
  addClient: (client: Client) => void;
  updateClient: (id: string, updatedClient: Partial<Client>) => void;
  deleteClient: (id: string) => void;
}

export const ClientContext = createContext<ClientContextType | undefined>(undefined);

interface ClientProviderProps {
  children: ReactNode;
}

export const ClientProvider: React.FC<ClientProviderProps> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>([]);

  const initialData: Client[] = [
    { id: '1', name: 'Alexandre Junio', salary: '7000', companyValue: '450000' },
    { id: '2', name: 'Cleiton', salary: '8500', companyValue: '120000' },
    { id: '3', name: 'Edson', salary: '10000', companyValue: '150000' },
  ];

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const storedClients = await AsyncStorage.getItem('clients');
      if (storedClients) {
        setClients(JSON.parse(storedClients));
      } else {
        // Seed initial data if none exists
        await AsyncStorage.setItem('clients', JSON.stringify(initialData));
        setClients(initialData);
      }
    } catch (error) {
      console.error('Error loading clients', error);
    }
  };

  const saveClients = async (newClients: Client[]) => {
    try {
      setClients(newClients);
      await AsyncStorage.setItem('clients', JSON.stringify(newClients));
    } catch (error) {
      console.error('Error saving clients', error);
    }
  };

  const addClient = (client: Client) => {
    const updatedClients = [...clients, client];
    saveClients(updatedClients);
  };

  const updateClient = (id: string, updatedClient: Partial<Client>) => {
    const updatedClients = clients.map((client) =>
      client.id === id ? { ...client, ...updatedClient } : client
    );
    saveClients(updatedClients);
  };

  const deleteClient = (id: string) => {
    const updatedClients = clients.filter((client) => client.id !== id);
    saveClients(updatedClients);
  };

  return (
    <ClientContext.Provider value={{ clients, addClient, updateClient, deleteClient }}>
      {children}
    </ClientContext.Provider>
  );
};
