import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Modal,
  FlatList,
} from "react-native";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";

interface ProductForm {
  name: string;
  type: string;
  barcode: string;
  price: string;
  solde: string;
  supplier: string;
  image: string;
  selectedStock: string;
  quantity: string;
}

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
    if (
      !formData.name ||
      !formData.type ||
      !formData.barcode ||
      !formData.price ||
      !formData.supplier ||
      !formData.image
    ) {
      Alert.alert("Error", "All fields are required except Solde!");
      return;
    }

    try {
      const response = await axios.get("http://192.168.8.162:3000/products");
      const products = response.data;
      const nextId = Math.max(...products.map((p: any) => p.id)) + 1;

      const stocks = [];
      if (formData.selectedStock !== "none" && formData.quantity) {
        const selectedStockData = availableStocks.find(
          (stock) => stock.id.toString() === formData.selectedStock
        );
        if (selectedStockData) {
          stocks.push({
            ...selectedStockData,
            quantity: parseInt(formData.quantity),
          });
        }
      }

      const newProduct = {
        id: nextId,
        name: formData.name,
        type: formData.type,
        barcode: formData.barcode,
        price: parseFloat(formData.price),
        solde: formData.solde ? parseFloat(formData.solde) : undefined,
        supplier: formData.supplier,
        image: formData.image,
        stocks,
        editedBy: [
          {
            warehousemanId: 1444,
            at: new Date().toISOString().split("T")[0],
          },
        ],
      };

      await axios.post("http://192.168.8.162:3000/products", newProduct);
      Alert.alert("Success", `Product "${formData.name}" added successfully!`);

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
      console.error("Error adding product:", error);
      Alert.alert("Error", "Failed to add product. Please try again.");
    }
  };

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

        <TextInput
          className="w-full bg-white p-4 mb-3 rounded-xl shadow"
          placeholder="Barcode"
          value={formData.barcode}
          onChangeText={(value) => handleChange("barcode", value)}
        />

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
