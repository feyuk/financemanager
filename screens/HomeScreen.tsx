import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

// Type for the navigation prop
type HomeScreenNavigationProp = StackNavigationProp<
  { Main: undefined },
  'Home'
>;

// Props interface for the component
interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  // Typed state for name input
  const [name, setName] = useState<string>('');

  const handleEnter = () => {
    if (name.trim()) {
      navigation.navigate('Main'); // Redireciona para o Drawer Navigator (Main)
    } else {
      alert('Por favor, insira um nome antes de prosseguir!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Olá, seja bem-vindo!</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o seu nome"
        value={name}
        onChangeText={setName}
      />
      <TouchableOpacity style={styles.button} onPress={handleEnter}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
  },
  button: {
    width: '80%',    
    backgroundColor: '#FF5722',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;