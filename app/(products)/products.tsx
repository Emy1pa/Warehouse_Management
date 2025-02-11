import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import axios from "axios";
import FilterSortUtils from "./SearchAndSort";
const ShoppingImage = require("@/assets/images/access.jpg");

export interface Product {
  id: number;
  name: string;
  type: string;
  price: number;
  solde?: number;
  image: string;
  stocks: { quantity: number }[];
}

const ProductsList = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("userSecretKey");
      if (!token) {
        router.push("/");
      } else {
        setIsAuthenticated(true);
        fetchProducts();
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://192.168.8.194:3000/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userSecretKey");
      router.push("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

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
              onPress={handleLogout}
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
            {filteredProducts.map((item) => {
              const totalStock = item.stocks.reduce(
                (total, stock) => total + stock.quantity,
                0
              );
              const stockStatusColor =
                totalStock === 0
                  ? "text-red-500"
                  : totalStock < 10
                  ? "text-yellow-500"
                  : "text-green-500";

              return (
                <View
                  key={item.id}
                  className="bg-white/90 rounded-xl shadow-sm overflow-hidden"
                >
                  <View className="flex-row">
                    <View className="w-40 h-40 p-2 ">
                      <Image
                        source={{ uri: item.image }}
                        className="w-full h-full"
                        resizeMode="contain"
                      />
                    </View>
                    <View className="flex-1 p-3">
                      <Text className="text-lg font-bold text-gray-800 mb-2">
                        {item.name}
                      </Text>
                      <View className="bg-gray-100/70 px-3 py-1 rounded-full w-fit mb-2">
                        <Text className="text-gray-700">🏷️ {item.type}</Text>
                      </View>

                      <View className="bg-gray-100/70 px-3 py-1 rounded-lg w-fit mb-2">
                        <Text className="text-gray-800 font-medium">
                          💰 {item.price} DH
                        </Text>
                      </View>

                      <View className="space-y-2">
                        <Text
                          className={`${stockStatusColor} font-medium bg-gray-100/70 px-3 py-1 rounded-lg w-fit`}
                        >
                          📦 {totalStock} unités
                        </Text>

                        {item.solde && (
                          <View className="bg-green-100/70 px-3 py-1 rounded-lg w-fit">
                            <Text className="text-green-700 font-medium">
                              Solde: {item.solde} DH
                            </Text>
                          </View>
                        )}

                        <TouchableOpacity
                          className="bg-blue-500/90 px-4 py-2 rounded-lg w-fit"
                          onPress={() =>
                            router.push(`/(products)/${item.id}` as any)
                          }
                        >
                          <Text className="text-white font-medium">
                            Détails
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default ProductsList;
