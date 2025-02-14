import { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Modal,
  FlatList,
  Dimensions,
} from "react-native";
import { ProductForm } from "../utils/interface";
import { addProduct } from "../services/productService";
import useAuth from "../services/useAuth";
import { Camera, CameraType, CameraView } from "expo-camera";

export default function AddProductScreen() {
  const [formData, setFormData] = useState<ProductForm>({
    name: "",
    type: "",
    barcode: "",
    price: "",
    solde: "",
    supplier: "",
    image: "",
    selectedStock: "none",
    quantity: "",
  });
  const { getCurrentUser } = useAuth();
  const [scanning, setScanning] = useState(false);

  const [facing, setFacing] = useState<CameraType>("back");
  const [scanned, setScanned] = useState(false);
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const handleBarCodeScanned = ({
    type,
    data,
  }: {
    type: string;
    data: string;
  }) => {
    setScanned(true);
    handleChange("barcode", data);

    alert(`Barcode scanned! Type: ${type}, Data: ${data}`);
  };

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  const [showStockPicker, setShowStockPicker] = useState(false);

  const availableStocks = [
    {
      id: 1999,
      name: "Gueliz B2",
      quantity: 0,
      localisation: {
        city: "Marrakesh",
        latitude: 31.628674,
        longitude: -7.992047,
      },
    },
    {
      id: 2991,
      name: "Lazari H2",
      quantity: 0,
      localisation: {
        city: "Oujda",
        latitude: 34.689404,
        longitude: -1.912823,
      },
    },
  ];

  const handleChange = (name: keyof ProductForm, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const selectStock = (stockId: string) => {
    handleChange("selectedStock", stockId);
    setShowStockPicker(false);
  };

  const getSelectedStockLabel = () => {
    if (formData.selectedStock === "none") return "Select Stock Location";
    const stock = availableStocks.find(
      (s) => s.id.toString() === formData.selectedStock
    );
    return stock
      ? `${stock.name} (${stock.localisation.city})`
      : "Select Stock Location";
  };

  const handleAddProduct = async () => {
    try {
      const userId = await getCurrentUser();
      if (!userId) {
        Alert.alert("Error", "Not authenticated!");
        return;
      }
      const newProduct = await addProduct(formData, availableStocks, userId);
      Alert.alert(
        "Success",
        `Product "${newProduct.name}" added successfully!`
      );

      setFormData({
        name: "",
        type: "",
        barcode: "",
        price: "",
        solde: "",
        supplier: "",
        image: "",
        selectedStock: "none",
        quantity: "",
      });
    } catch (error) {
      Alert.alert("Error", "Failed to add product.");
    }
  };
  const startScanning = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status === "granted") {
      setScanning(true);
    } else {
      Alert.alert(
        "Permission Required",
        "Camera permission is required to scan barcodes"
      );
    }
  };
  // const handleBarCodeScanned = ({ data }: { data: string }) => {
  //   handleChange("barcode", data);

  //   setScanning(false);
  // };
  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className="p-5 mt-8">
        <Text className="text-2xl font-bold text-center mb-5">
          🛒 Add New Product
        </Text>

        <TextInput
          className="w-full bg-white p-4 mb-3 rounded-xl shadow"
          placeholder="Product Name"
          value={formData.name}
          onChangeText={(value) => handleChange("name", value)}
        />

        <TextInput
          className="w-full bg-white p-4 mb-3 rounded-xl shadow"
          placeholder="Type (e.g., Informatique)"
          value={formData.type}
          onChangeText={(value) => handleChange("type", value)}
        />
        <View className="mb-3">
          <TextInput
            className="w-full bg-white p-4 rounded-xl shadow"
            placeholder="Barcode"
            value={formData.barcode}
            onChangeText={(value) => handleChange("barcode", value)}
          />

          <TouchableOpacity
            className="mt-2 bg-blue-600 p-4 rounded-xl shadow items-center justify-center"
            onPress={() => (scanning ? setScanning(false) : startScanning())}
          >
            <Text className="text-white text-center">
              {scanning ? "Cancel Scan" : "Scan Barcode"}
            </Text>
          </TouchableOpacity>
        </View>

        {scanning && (
          <Modal visible={scanning} transparent={true} animationType="slide">
            <View className="flex-1 bg-black">
              <CameraView
                facing={facing}
                onBarcodeScanned={handleBarCodeScanned}
                className="flex-1"
                style={{
                  width: screenWidth,
                  height: screenHeight * 0.7,
                }}
              >
                <View className="flex-1 bg-transparent">
                  {/* Scanning overlay */}
                  <View className="flex-1 items-center justify-center">
                    <View className="w-64 h-64 border-2 border-white rounded-lg">
                      <View className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-blue-500" />
                      <View className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-blue-500" />
                      <View className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-blue-500" />
                      <View className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-blue-500" />
                    </View>
                  </View>

                  {/* Controls */}
                  <View className="absolute bottom-10 w-full flex-row justify-between px-10">
                    <TouchableOpacity
                      className="bg-white/20 p-4 rounded-full"
                      onPress={toggleCameraFacing}
                    >
                      <Text className="text-white">Flip Camera</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="bg-white/20 p-4 rounded-full"
                      onPress={() => setScanning(false)}
                    >
                      <Text className="text-white">Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </CameraView>
            </View>
          </Modal>
        )}
        <TextInput
          className="w-full bg-white p-4 mb-3 rounded-xl shadow"
          placeholder="Price (DH)"
          keyboardType="numeric"
          value={formData.price}
          onChangeText={(value) => handleChange("price", value)}
        />

        <TextInput
          className="w-full bg-white p-4 mb-3 rounded-xl shadow"
          placeholder="Solde Price (Optional)"
          keyboardType="numeric"
          value={formData.solde}
          onChangeText={(value) => handleChange("solde", value)}
        />

        <TextInput
          className="w-full bg-white p-4 mb-3 rounded-xl shadow"
          placeholder="Supplier"
          value={formData.supplier}
          onChangeText={(value) => handleChange("supplier", value)}
        />

        <TextInput
          className="w-full bg-white p-4 mb-3 rounded-xl shadow"
          placeholder="Image URL"
          value={formData.image}
          onChangeText={(value) => handleChange("image", value)}
        />

        <TouchableOpacity
          className="w-full bg-white p-4 mb-3 rounded-xl shadow"
          onPress={() => setShowStockPicker(true)}
        >
          <Text
            className={
              formData.selectedStock === "none" ? "text-gray-400" : "text-black"
            }
          >
            {getSelectedStockLabel()}
          </Text>
        </TouchableOpacity>

        {formData.selectedStock !== "none" && (
          <TextInput
            className="w-full bg-white p-4 mb-3 rounded-xl shadow"
            placeholder="Quantity"
            keyboardType="numeric"
            value={formData.quantity}
            onChangeText={(value) => handleChange("quantity", value)}
          />
        )}

        <TouchableOpacity
          className="bg-blue-600 py-4 rounded-xl items-center shadow-md mb-5"
          onPress={handleAddProduct}
        >
          <Text className="text-white text-lg font-semibold">Add Product</Text>
        </TouchableOpacity>

        <Modal
          visible={showStockPicker}
          transparent={true}
          animationType="slide"
        >
          <View className="flex-1 bg-black/50 justify-end">
            <View className="bg-white rounded-t-xl">
              <View className="p-4 border-b border-gray-200">
                <Text className="text-xl font-semibold text-center">
                  Select Stock Location
                </Text>
              </View>
              <CameraView></CameraView>

              <FlatList
                data={[
                  { id: "none", name: "None", localisation: { city: "" } },
                  ...availableStocks,
                ]}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    className="p-4 border-b border-gray-100"
                    onPress={() => selectStock(item.id.toString())}
                  >
                    <Text className="text-lg">
                      {item.id === "none"
                        ? "Select Stock Location"
                        : `${item.name} (${item.localisation.city})`}
                    </Text>
                  </TouchableOpacity>
                )}
              />

              <TouchableOpacity
                className="p-4 bg-gray-100"
                onPress={() => setShowStockPicker(false)}
              >
                <Text className="text-center text-blue-600 font-semibold">
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
}
