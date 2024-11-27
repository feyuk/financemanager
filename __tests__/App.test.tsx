import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../App';

// Mock dependencies
jest.mock('@react-navigation/native', () => ({
  NavigationContainer: jest.fn(({ children }) => children),
}));

jest.mock('@react-navigation/stack', () => ({
  createStackNavigator: () => ({
    Navigator: jest.fn(({ children }) => children),
    Screen: jest.fn(({ component: Component, ...props }) => <Component {...props} />),
  }),
}));

jest.mock('@react-navigation/drawer', () => ({
  createDrawerNavigator: () => ({
    Navigator: jest.fn(({ children }) => children),
    Screen: jest.fn(({ component: Component, ...props }) => <Component {...props} />),
  }),
  DrawerContentComponentProps: jest.fn(),
}));

jest.mock('./contexts/ClientContext', () => ({
  ClientProvider: jest.fn(({ children }) => children),
}));

// Mock screen components to avoid import complexities
jest.mock('./screens/HomeScreen', () => jest.fn(() => null));
jest.mock('./screens/ClientListScreen', () => jest.fn(() => null));
jest.mock('./screens/ClientDetailsScreen', () => jest.fn(() => null));
jest.mock('./screens/ProductListScreen', () => jest.fn(() => null));

describe('App Component', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<App />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('sets up navigation structure correctly', () => {
    render(<App />);
    
    // Verify that key components are rendered
    const { NavigationContainer } = require('@react-navigation/native');
    const { createStackNavigator } = require('@react-navigation/stack');
    const { ClientProvider } = require('./contexts/ClientContext');

    // Ensure NavigationContainer is used
    expect(NavigationContainer).toHaveBeenCalled();

    // Ensure ClientProvider wraps the app
    expect(ClientProvider).toHaveBeenCalled();

    // Verify stack navigation setup
    const stackNavigator = createStackNavigator();
    expect(stackNavigator.Navigator).toHaveBeenCalled();
    expect(stackNavigator.Screen).toHaveBeenCalledTimes(2); // Home and Main screens
  });

  it('sets up drawer navigation correctly', () => {
    render(<App />);
    
    const { createDrawerNavigator } = require('@react-navigation/drawer');
    const drawerNavigator = createDrawerNavigator();

    // Verify drawer navigator is configured
    expect(drawerNavigator.Navigator).toHaveBeenCalled();
    expect(drawerNavigator.Screen).toHaveBeenCalledTimes(2); // Clientes and Produtos screens
  });
});