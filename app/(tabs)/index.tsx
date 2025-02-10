import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  View,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Text,
} from "react-native";
import dbData from "@/db.json";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ShoppingImage = require("@/assets/images/access.jpg");
interface WareHouseman {
  secretKey: string;
}
const Authenticate = () => {
  const [secretKey, setSecretKey] = useState("");
  const [message, setMessage] = useState<{
    text: string;
    color: string;
  } | null>(null);
  const router = useRouter();
  const handleAuthenticate = async () => {
    if (!secretKey.trim()) {
      setMessage({
        text: "Secret Key cannot be empty!",
        color: "text-red-500",
      });
      return;
    }
    try {
      const warehousemans = dbData.warehousemans;

      const warehouseman = warehousemans.find(
        (man: WareHouseman) => man.secretKey === secretKey
      );
      if (warehouseman) {
        await AsyncStorage.setItem("userSecretKey", secretKey);
        setMessage({
          text: "Login successful! Redirecting...",
          color: "text-green-500",
        });

        setTimeout(() => {
          router.push("/(products)/products");
        }, 1500);
      } else {
        setMessage({
          text: "Invalid secret key, please try again.",
          color: "text-red-500",
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setMessage({
        text: "An error occurred, please try again.",
        color: "text-red-500",
      });
    }
  };

  return (
    <ImageBackground
      source={ShoppingImage}
      className="w-full h-full"
      blurRadius={4}
    >
      <View className="flex-1 items-center justify-center px-4">
        <View className="border-2 border-red-700 rounded-xl p-8 w-full bg-white/75 shadow-lg">
          <Text className="text-xl font-semibold mb-4 text-center text-gray-800">
            Enter Your Secret Key to Login
          </Text>
          <TextInput
            placeholder="Ex: secret_key_example_123"
            placeholderTextColor="#888"
            className="bg-white/80 p-4 rounded-lg mb-4 text-base border border-gray-200"
            value={secretKey}
            onChangeText={(text) => {
              setSecretKey(text);
              setMessage(null);
            }}
          />
          {message && (
            <Text className={`text-center mb-4 text-base ${message.color}`}>
              {message.text}
            </Text>
          )}
          <TouchableOpacity
            className="bg-red-500 rounded-lg p-4 items-center active:bg-red-900 transition-colors"
            onPress={handleAuthenticate}
          >
            <Text className="text-white font-bold text-base">Validate</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default Authenticate;
