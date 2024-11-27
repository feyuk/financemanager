import React from 'react';
import { render } from '@testing-library/react-native';
import ProductListScreen from '../screens/ProductListScreen';

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
};

describe('ProductListScreen Component', () => {
  it('renders correctly', () => {
    const { getByText, getAllByText } = render(
      <ProductListScreen navigation={mockNavigation} />
    );

    // Check if all product names are rendered
    expect(getByText('Produto A')).toBeTruthy();
    expect(getByText('Produto B')).toBeTruthy();
    expect(getByText('Produto C')).toBeTruthy();

    // Check descriptions
    expect(getByText('Descrição do Produto A')).toBeTruthy();
    expect(getByText('Descrição do Produto B')).toBeTruthy();
    expect(getByText('Descrição do Produto C')).toBeTruthy();
  });

  it('renders correct number of products', () => {
    const { getAllByText } = render(
      <ProductListScreen navigation={mockNavigation} />
    );

    // Check that 3 product names are rendered
    const productNames = getAllByText(/Produto/);
    expect(productNames.length).toBe(3);
  });

  it('renders product details correctly', () => {
    const { getByText } = render(
      <ProductListScreen navigation={mockNavigation} />
    );

    // Verify each product's name and description
    const products = [
      { name: 'Produto A', description: 'Descrição do Produto A' },
      { name: 'Produto B', description: 'Descrição do Produto B' },
      { name: 'Produto C', description: 'Descrição do Produto C' },
    ];

    products.forEach(product => {
      const nameElement = getByText(product.name);
      const descriptionElement = getByText(product.description);

      expect(nameElement).toBeTruthy();
      expect(descriptionElement).toBeTruthy();
    });
  });

  it('uses correct styles', () => {
    const { getByText } = render(
      <ProductListScreen navigation={mockNavigation} />
    );

    const productName = getByText('Produto A');
    const productDescription = getByText('Descrição do Produto A');

    // You might need to use testID or other methods to check specific styles
    expect(productName.props.style).toEqual(
      expect.objectContaining({
        fontSize: 18,
        fontWeight: 'bold',
      })
    );

    expect(productDescription.props.style).toEqual(
      expect.objectContaining({
        fontSize: 16,
        color: '#666',
      })
    );
  });

  it('matches snapshot', () => {
    const { toJSON } = render(
      <ProductListScreen navigation={mockNavigation} />
    );

    // Snapshot test to catch unexpected UI changes
    expect(toJSON()).toMatchSnapshot();
  });
});