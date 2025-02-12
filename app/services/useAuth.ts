import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const useAuth = () => {
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
  const logout = async () => {
    await AsyncStorage.removeItem("userSecretKey");
    router.push("/");
  };
  return { isAuthenticated, logout };
};
export default useAuth;
