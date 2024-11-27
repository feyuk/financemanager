import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { 
  createStackNavigator, 
  StackNavigationOptions 
} from '@react-navigation/stack';
import { 
  createDrawerNavigator, 
  DrawerContentComponentProps 
} from '@react-navigation/drawer';
import { ClientProvider } from './contexts/ClientContext';
import HomeScreen from './screens/HomeScreen';
import ClientListScreen from './screens/ClientListScreen';
import ClientDetailsScreen from './screens/ClientDetailsScreen';
import ProductListScreen from './screens/ProductListScreen';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Image,
  ImageSourcePropType 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Minimal Navigation Type Definitions
type RootStackParamList = {
  Home: undefined;
  Main: undefined;
};

type DrawerParamList = {
  Clientes: undefined;
  Produtos: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<DrawerParamList>();

// Type for CustomDrawerContent
const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  return (
    <View style={{ flex: 1, paddingTop: 40 }}>
      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <Image 
          source={require('./assets/logo-menu.webp') as ImageSourcePropType} 
          style={{ width: 100, height: 50 }} 
        />
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Teddy Open Finance</Text>
      </View>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => props.navigation.navigate('Home')}
      >
        <Ionicons name="home-outline" size={20} color="#000" />
        <Text style={styles.menuText}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => props.navigation.navigate('Clientes')}
      >
        <Ionicons name="person-outline" size={20} color="#000" />
        <Text style={styles.menuText}>Clientes</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => props.navigation.navigate('Produtos')}
      >
        <Ionicons name="grid-outline" size={20} color="#000" />
        <Text style={styles.menuText}>Produtos</Text>
      </TouchableOpacity>
    </View>
  );
};

// Type for Screen Options Navigation Prop
type ScreenOptionsProps = {
  navigation: {
    openDrawer: () => void;
  };
};

const defaultScreenOptions = ({ navigation }: ScreenOptionsProps): StackNavigationOptions => ({
  headerLeft: () => (
    <Image 
      source={require('./assets/logo_head.png') as ImageSourcePropType} 
      style={{ width: 100, height: 48, marginLeft: 15 }} 
    />
  ),
  headerRight: () => (
    <TouchableOpacity onPress={() => navigation.openDrawer()}>
      <Ionicons name="menu" size={24} style={{ marginRight: 15 }} />
    </TouchableOpacity>
  ),
  headerTitle: '',
});

const ClientStack = () => {
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen name="ClientList" component={ClientListScreen} />
      <Stack.Screen name="ClientDetails" component={ClientDetailsScreen} />
    </Stack.Navigator>
  );
};

const ProductStack = () => {
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen name="ProductList" component={ProductListScreen} />
    </Stack.Navigator>
  );
};

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerPosition: 'right',
        drawerStyle: {
          width: '70%',
        },
      }}
    >
      <Drawer.Screen name="Clientes" component={ClientStack} />
      <Drawer.Screen name="Produtos" component={ProductStack} />
    </Drawer.Navigator>
  );
};

// Typed App Component
const App: React.FC = () => {
  return (
    <ClientProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Main"
            component={DrawerNavigator}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ClientProvider>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  menuText: {
    fontSize: 18,
    marginLeft: 10,
    color: '#000',
  },
});

export default App;