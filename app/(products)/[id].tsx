import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { format } from "date-fns";
import { Feather } from "@expo/vector-icons";
import axios from "axios";
import { DProduct } from "../utils/interface";
import { fetchProductDetails } from "../services/productService";
import { apiUrl } from "../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProductDetails = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [product, setProduct] = useState<DProduct | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>("");

  const getProductDetails = async () => {
    try {
      const response = await fetchProductDetails(parseInt(params.id as string));
      setProduct(response);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };
  useEffect(() => {
    console.log(params.id as string);
    getProductDetails();
    getCurrentUser();
  }, [params.id]);

  const openMapsLocation = (latitude: number, longitude: number) => {
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    Linking.openURL(url);
  };
  const handleStockUpdate = async (
    stockId: number,
    action: "increase" | "decrease"
  ) => {
    if (!product) return;

    setIsLoading(true);
    try {
      const stockToUpdate = product.stocks.find(
        (stock) => stock.id === stockId
      );
      if (!stockToUpdate) {
        throw new Error("Stock not found");
      }

      const newQuantity =
        action === "increase"
          ? stockToUpdate.quantity + 1
          : stockToUpdate.quantity - 1;

      if (newQuantity < 0) {
        Alert.alert("Erreur", "La quantité ne peut pas être négative");
        return;
      }

      const updatedProduct: DProduct = {
        ...product,
        stocks: product.stocks.map((stock) =>
          stock.id === stockId ? { ...stock, quantity: newQuantity } : stock
        ),
        editedBy: [
          {
            warehousemanId: currentUserId,
            at: new Date().toISOString().split("T")[0],
          },
          ...product.editedBy,
        ],
      };

      await axios.put(`${apiUrl}/products/${product.id}`, updatedProduct);
      setProduct(updatedProduct);
      Alert.alert("Succès", "Stock mis à jour avec succès");
    } catch (error) {
      Alert.alert("Erreur", "Impossible de mettre à jour le stock");
    } finally {
      setIsLoading(false);
    }
  };
  const getCurrentUser = async () => {
    try {
      const userSecretKey = await AsyncStorage.getItem("userSecretKey");
      if (userSecretKey) {
        setCurrentUserId(userSecretKey);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const renderEditHistory = () => {
    return product?.editedBy.map((edit, index) => (
      <View key={index} className="flex-row justify-between py-2">
        <Text className="text-gray-600">
          Agent #{edit.warehousemanId.toString()}
        </Text>
        <Text className="text-gray-600">
          {format(new Date(edit.at), "dd/MM/yyyy")}
        </Text>
      </View>
    ));
  };

  if (!product) {
    return (
      <SafeAreaView className="flex-1">
        <View className="flex-1 justify-center items-center">
          <Text>Produit non trouvé</Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="mt-4 bg-blue-500 px-4 py-2 rounded-lg"
          >
            <Text className="text-white">Retour</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  return (
    <View className="flex-1 bg-gray-50">
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1">
          <View className="bg-white p-4 border-b border-gray-200">
            <TouchableOpacity onPress={() => router.back()} className="mb-4">
              <Text className="text-blue-500">← Retour</Text>
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-gray-800">
              {product.name}
            </Text>
          </View>

          <View className="w-full h-64 bg-white p-4">
            <Image
              source={{ uri: product.image }}
              className="w-full h-full"
              resizeMode="contain"
            />
          </View>

          <View className="bg-white mt-2 p-4">
            <Text className="text-lg font-semibold mb-4">
              Informations Produit
            </Text>
            <View className="space-y-3">
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Type</Text>
                <Text className="font-medium">{product.type}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Code-barres</Text>
                <Text className="font-medium">{product.barcode}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Prix</Text>
                <Text className="font-medium">{product.price} DH</Text>
              </View>
              {product.solde && (
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Prix Soldé</Text>
                  <Text className="font-medium text-green-600">
                    {product.solde} DH
                  </Text>
                </View>
              )}
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Fournisseur</Text>
                <Text className="font-medium">{product.supplier}</Text>
              </View>
            </View>
          </View>

          <View className="bg-white mt-2 p-4">
            <Text className="text-lg font-semibold mb-4">
              Stock par Emplacement
            </Text>
            {product.stocks.map((stock) => (
              <View key={stock.id} className="bg-gray-50 rounded-lg p-4 mb-3">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="font-medium">{stock.name}</Text>
                  <Text
                    className={`font-medium ${
                      stock.quantity === 0
                        ? "text-red-500"
                        : stock.quantity < 10
                        ? "text-yellow-500"
                        : "text-green-500"
                    }`}
                  >
                    {stock.quantity} unités
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() =>
                    openMapsLocation(
                      stock.localisation.latitude,
                      stock.localisation.longitude
                    )
                  }
                  className="flex-row items-center mt-2"
                >
                  <Feather name="map-pin" size={16} color="#4B5563" />
                  <Text className="text-gray-600 ml-2">
                    {stock.localisation.city}
                  </Text>
                </TouchableOpacity>
                <View className="flex-row justify-between mt-4">
                  <TouchableOpacity
                    onPress={() => handleStockUpdate(stock.id, "increase")}
                    className="bg-green-500 px-4 py-2 rounded-lg flex-1 mr-2"
                  >
                    <Text className="text-white text-center">
                      Réapprovisionner
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleStockUpdate(stock.id, "decrease")}
                    disabled={stock.quantity === 0}
                    className={`px-4 py-2 rounded-lg flex-1 ml-2 ${
                      stock.quantity === 0 ? "bg-gray-400" : "bg-red-500"
                    }`}
                  >
                    <Text className="text-white text-center">Décharger</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          <View className="bg-white mt-2 p-4 mb-4">
            <Text className="text-lg font-semibold mb-4">
              Historique des Modifications
            </Text>

            {renderEditHistory()}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default ProductDetails;
