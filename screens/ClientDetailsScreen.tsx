import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { ClientContext } from '../contexts/ClientContext';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Reuse the Client interface from the previous file
interface Client {
  id: number | string;
  name: string;
  salary: number;
  companyValue: number;
}

// Type for the route params
type ClientDetailsRouteProp = RouteProp<{ 
  ClientDetails: { clientId?: number | string } 
}, 'ClientDetails'>;

// Type for the navigation prop
type ClientDetailsNavigationProp = StackNavigationProp<
  { ClientDetails: undefined },
  'ClientDetails'
>;

// Props type for the component
interface ClientDetailsScreenProps {
  route: ClientDetailsRouteProp;
  navigation: ClientDetailsNavigationProp;
}

const ClientDetailsScreen: React.FC<ClientDetailsScreenProps> = ({ route, navigation }) => {
  // Optional chaining and nullish coalescing for route params
  const { clientId } = route.params ?? {};

  // Typed context with explicit interfaces
  const { clients, addClient, updateClient } = useContext<{
    clients: Client[];
    addClient: (client: Client) => void;
    updateClient: (id: number | string, client: Omit<Client, 'id'>) => void;
  }>(ClientContext);

  // Optional chaining for finding existing client
  const existingClient = clients.find((client) => client.id === clientId);

  // Typed state with default values
  const [name, setName] = useState<string>(existingClient?.name || '');
  const [salary, setSalary] = useState<number>(existingClient?.salary || '');
  const [companyValue, setCompanyValue] = useState<number>(existingClient?.companyValue || '');

  const handleSave = () => {
    if (clientId) {
      updateClient(clientId, { name, salary, companyValue });
    } else {
      addClient({ 
        id: Date.now().toString(), 
        name, 
        salary, 
        companyValue 
      });
    }
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Detalhes do Cliente</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nome:</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Digite o nome do cliente"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Salário:</Text>
          <TextInput
            style={styles.input}
            value={salary}
            onChangeText={setSalary}
            keyboardType="numeric"
            placeholder="Digite o salário"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Valor da Empresa:</Text>
          <TextInput
            style={styles.input}
            value={companyValue}
            onChangeText={setCompanyValue}
            keyboardType="numeric"
            placeholder="Digite o valor da empresa"
            placeholderTextColor="#999"
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: { 
      flex: 1,
      backgroundColor: '#fff',
    },
    formContainer: {
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 30,
      textAlign: 'center',
    },
    inputGroup: {
      marginBottom: 20,
    },
    label: { 
      fontSize: 16,
      fontWeight: '600',
      color: '#333',
      marginBottom: 8,
    },
    input: { 
      borderWidth: 1,
      borderColor: '#E0E0E0',
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      backgroundColor: '#F8F8F8',
      color: '#333',
    },
    button: {
      backgroundColor: '#FF5722',
      paddingVertical: 15,
      borderRadius: 8,
      marginTop: 10,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
    },
});

export default ClientDetailsScreen;