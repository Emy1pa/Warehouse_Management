import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const ProductsList = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("userSecretKey");
      if (!token) {
        router.push("/");
      } else {
        setIsAuthenticated(true);
      }
    };
    checkAuth();
  }, []);

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
    <View className="flex-1 items-center justify-center bg-gray-100">
      <Text className="text-2xl font-bold text-gray-800">Welcome!</Text>
      <TouchableOpacity
        onPress={handleLogout}
        className="bg-red-500 p-3 rounded mt-6"
      >
        <Text className="text-white font-semibold">Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProductsList;
