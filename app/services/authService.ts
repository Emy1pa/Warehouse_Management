import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { apiUrl } from "../utils/constants";
interface WareHouseman {
  secretKey: string;
}
export const authenticateUser = async (
  secretKey: string,
  setMessage: (message: { text: string; color: string } | null) => void,
  router: any
) => {
  if (!secretKey.trim()) {
    setMessage({ text: "Secret Key cannot be empty!", color: "text-red-500" });
    return;
  }

  try {
    const warehousemans = await axios.get(`${apiUrl}/warehousemans`);
    const warehouseman = warehousemans.data.find(
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
