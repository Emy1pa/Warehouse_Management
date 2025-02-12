import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  View,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Text,
} from "react-native";
import { authenticateUser } from "../services/authService";
const ShoppingImage = require("@/assets/images/access.jpg");

const Authenticate = () => {
  const [secretKey, setSecretKey] = useState("");
  const [message, setMessage] = useState<{
    text: string;
    color: string;
  } | null>(null);
  const router = useRouter();

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
            onPress={() => {
              authenticateUser(secretKey, setMessage, router);
            }}
          >
            <Text className="text-white font-bold text-base">Validate</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default Authenticate;
