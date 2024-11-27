import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

// Client interface (consistent with previous files)
interface Client {
  id: number | string;
  name: string;
  salary: number;
  companyValue: number;
}

// Props interface for the component
interface ClientCardProps {
  client: Client;
  onEdit: () => void;
  onDelete: () => void;
}

const ClientCard: React.FC<ClientCardProps> = ({ client, onEdit, onDelete }) => (
  <View style={styles.card}>
    <Text style={styles.name}>{client.name}</Text>
    <Text style={styles.info}>Salário: R${client.salary}</Text>
    <Text style={styles.info}>Empresa: R${client.companyValue}</Text>
    <View style={styles.actions}>
      <TouchableOpacity style={styles.iconButton}>
        <Ionicons name="add-circle-outline" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconButton} onPress={onEdit}>
        <MaterialIcons name="edit" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconButton} onPress={onDelete}>
        <MaterialIcons name="delete" size={24} color="red" />
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  info: {
    fontSize: 14,
    marginBottom: 4,
    textAlign: 'center',    
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  iconButton: {
    padding: 8,
  },
});

export default ClientCard;