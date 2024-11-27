import React, { useContext, useState, memo } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, TextInput, Button, TouchableWithoutFeedback, Alert } from 'react-native';
import { ClientContext } from '../contexts/ClientContext';
import ClientCard from '../components/ClientCard';

// Define types with minimal changes
interface NewClient {
  name: string;
  salary: string;
  companyValue: string;
}

interface NavigationProp {
  navigate: (screen: string, params?: any) => void;
}

interface ClientListScreenProps {
  navigation: NavigationProp;
}

const ITEM_HEIGHT = 120; // Ajuste conforme a altura real do ClientCard

const ClientListScreen: React.FC<ClientListScreenProps> = ({ navigation }) => {
  const clientContext = useContext(ClientContext);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [newClient, setNewClient] = useState<NewClient>({ 
    name: '', 
    salary: '', 
    companyValue: '' 
  });

  // Mova a verificação de contexto para depois dos hooks
  if (!clientContext) {
    return <View><Text>Loading...</Text></View>;
  }

  const { clients, deleteClient, addClient } = clientContext;

  const handleCreateClient = () => {
    setModalVisible(true);
  };

  const handleSaveClient = () => {
    if (newClient.name && newClient.salary && newClient.companyValue) {
      addClient({ 
        ...newClient, 
        id: Date.now().toString() 
      }); 
      setNewClient({ name: '', salary: '', companyValue: '' });
      setModalVisible(false);
    } else {
      alert('Preencha todos os campos!');
    }
  };

  const handleEditClient = (clientId: string | number) => {
    navigation.navigate('ClientDetails', { clientId });
  };

  const handleDeleteClient = (clientId: string | number) => {
    Alert.alert(
      "Confirmar exclusão",
      "Você tem certeza que deseja excluir?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Sim",
          onPress: () => deleteClient(clientId),
          style: "destructive"
        }
      ],
      { cancelable: false }
    );
  };

  const getItemLayout = (data: any, index: number) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{clients.length} Clientes Cadastrados</Text>
      <FlatList
        data={clients}
        initialNumToRender={10}
        maxToRenderPerBatch={5}
        windowSize={21}
        getItemLayout={getItemLayout}
        keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
        renderItem={({ item }) => (
          <ClientCard
            client={item}
            onEdit={() => handleEditClient(item.id)}
            onDelete={() => handleDeleteClient(item.id)}
          />
        )}
      />
      <TouchableOpacity style={styles.createButton} onPress={handleCreateClient}>
        <Text style={styles.createButtonText}>Criar Cliente</Text>
      </TouchableOpacity>
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Novo Cliente</Text>
                <TextInput
                  style={[styles.input, styles.inputFocused]}
                  placeholder="Nome"
                  placeholderTextColor="#A9A9A9"
                  value={newClient.name}
                  onChangeText={(text) => setNewClient({ ...newClient, name: text })}
                />
                <TextInput
                  style={[styles.input, styles.inputFocused]}
                  placeholder="Salário"
                  placeholderTextColor="#A9A9A9"
                  keyboardType="numeric"
                  value={newClient.salary}
                  onChangeText={(text) => setNewClient({ ...newClient, salary: text })}
                />
                <TextInput
                  style={[styles.input, styles.inputFocused]}
                  placeholder="Valor da Empresa"
                  placeholderTextColor="#A9A9A9"
                  keyboardType="numeric"
                  value={newClient.companyValue}
                  onChangeText={(text) => setNewClient({ ...newClient, companyValue: text })}
                />
                <Button title="Criar Cliente" color="#FF511B" onPress={handleSaveClient} />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  createButton: {
    bottom: 16,
    alignSelf: 'center',
    borderColor: '#FF5722',
    borderWidth: 2,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    width: '90%', 
    borderRadius: 12,
  },
  createButtonText: {
    color: '#FF5722',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#FF511B',
  },
  input: {
    borderWidth: 1,
    borderColor: '#A9A9A9',
    borderRadius: 5,
    padding: 10,
    marginBottom: 16,
    backgroundColor: '#F2F2F2',
  },
  inputFocused: {
    borderColor: '#FF511B',
  },
});

export default ClientListScreen;