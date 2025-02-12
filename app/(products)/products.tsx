import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FilterSortUtils from "./SearchAndSort";
import { Product } from "../utils/interface";
import useAuth from "../services/useAuth";
import { fetchProducts } from "../services/productService";
import ProductItem from "@/components/products/ProductItem";
const ShoppingImage = require("@/assets/images/access.jpg");

const ProductsList = () => {
  const { isAuthenticated, logout } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      const data = await fetchProducts();
      setProducts(data);
    };
    loadProducts();
  }, []);

  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  if (!isAuthenticated) return null;

  return (
    <View className="flex-1">
      <Image
        source={ShoppingImage}
        className="absolute w-full h-full"
        blurRadius={8}
      />
      <SafeAreaView className="flex-1">
        <View className="flex-1 mx-4 my-2">
          <View className="flex-row justify-between items-center mb-2 p-4 border-b border-gray-200/30">
            <Text className="text-2xl font-bold text-white">
              Liste des Produits
            </Text>
            <TouchableOpacity
              onPress={logout}
              className="bg-red-500/80 px-4 py-2 rounded-full"
            >
              <Text className="text-white font-semibold">Déconnexion</Text>
            </TouchableOpacity>
          </View>
          <FilterSortUtils
            products={products}
            onFilteredProducts={setFilteredProducts}
          />
          <ScrollView
            className="flex-1 pt- px-2"
            contentContainerStyle={{ gap: 12 }}
          >
            {filteredProducts.map((item) => (
              <ProductItem key={item.id} product={item} />
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default ProductsList;
