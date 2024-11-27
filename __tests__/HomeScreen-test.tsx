import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

// Mock the navigation prop
const mockNavigation = {
  navigate: jest.fn(),
};

// Import the component to test
import HomeScreen from '../screens/HomeScreen';

describe('HomeScreen Component', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = render(
      <HomeScreen navigation={mockNavigation} />
    );

    // Check if key elements are rendered
    expect(getByText('Olá, seja bem-vindo!')).toBeTruthy();
    expect(getByPlaceholderText('Digite o seu nome')).toBeTruthy();
    expect(getByText('Entrar')).toBeTruthy();
  });

  it('prevents navigation when name is empty', () => {
    const { getByText } = render(
      <HomeScreen navigation={mockNavigation} />
    );

    // Mock alert to prevent actual alert during test
    const originalAlert = window.alert;
    window.alert = jest.fn();

    // Find and press the enter button with an empty name
    const enterButton = getByText('Entrar');
    fireEvent.press(enterButton);

    // Assert navigation was not called
    expect(mockNavigation.navigate).not.toHaveBeenCalled();
    
    // Verify alert was called
    expect(window.alert).toHaveBeenCalledWith('Por favor, insira um nome antes de prosseguir!');

    // Restore original alert
    window.alert = originalAlert;
  });

  it('navigates to Main screen when name is provided', () => {
    const { getByText, getByPlaceholderText } = render(
      <HomeScreen navigation={mockNavigation} />
    );

    // Find name input and enter button
    const nameInput = getByPlaceholderText('Digite o seu nome');
    const enterButton = getByText('Entrar');

    // Enter a name and press the button
    fireEvent.changeText(nameInput, 'John Doe');
    fireEvent.press(enterButton);

    // Assert navigation was called with 'Main'
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Main');
  });

  it('trims whitespace from name input', () => {
    const { getByText, getByPlaceholderText } = render(
      <HomeScreen navigation={mockNavigation} />
    );

    // Find name input and enter button
    const nameInput = getByPlaceholderText('Digite o seu nome');
    const enterButton = getByText('Entrar');

    // Enter a name with leading/trailing whitespace
    fireEvent.changeText(nameInput, '   John Doe   ');
    fireEvent.press(enterButton);

    // Assert navigation was called with 'Main'
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Main');
  });

  it('matches snapshot', () => {
    const { toJSON } = render(
      <HomeScreen navigation={mockNavigation} />
    );

    // Snapshot test to catch unexpected UI changes
    expect(toJSON()).toMatchSnapshot();
  });
});