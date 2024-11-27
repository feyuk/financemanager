import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ListRenderItem } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

// Type for product
interface Product {
  id: string;
  name: string;
  description: string;
}

// Type for the navigation prop
type ProductListScreenNavigationProp = StackNavigationProp<
  { ProductDetails: { product: Product } },
  'ProductList'
>;

// Props interface for the component
interface ProductListScreenProps {
  navigation: ProductListScreenNavigationProp;
}

const ProductListScreen: React.FC<ProductListScreenProps> = ({ navigation }) => {
  // Typed array of products
  const products: Product[] = [
    { id: '1', name: 'Produto A', description: 'Descrição do Produto A' },
    { id: '2', name: 'Produto B', description: 'Descrição do Produto B' },
    { id: '3', name: 'Produto C', description: 'Descrição do Produto C' },
  ];

  // Typed render item function
  const renderProduct: ListRenderItem<Product> = ({ item }) => (
    <View style={styles.productItem}>
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productDescription}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={renderProduct}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  productItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  productDescription: {
    fontSize: 16,
    color: '#666',
  },
});

export default ProductListScreen;