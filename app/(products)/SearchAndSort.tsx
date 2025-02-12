import React, { useEffect, useState } from "react";
import { View, TextInput, TouchableOpacity, Text } from "react-native";
import { Product } from "../utils/interface";

interface FilterSortUtilsProps {
  products: Product[];
  onFilteredProducts: (filteredProducts: Product[]) => void;
}

const FilterSortUtils: React.FC<FilterSortUtilsProps> = ({
  products,
  onFilteredProducts,
}) => {
  const [searchText, setSearchText] = useState("");
  const [sortType, setSortType] = useState("");

  const getFilteredAndSortedProducts = () => {
    let result = [...products];

    if (searchText) {
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(searchText.toLowerCase()) ||
          item.type.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    switch (sortType) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "quantity":
        result.sort((a, b) => {
          const stockA = a.stocks.reduce((sum, s) => sum + s.quantity, 0);
          const stockB = b.stocks.reduce((sum, s) => sum + s.quantity, 0);
          return stockB - stockA;
        });
        break;
    }

    onFilteredProducts(result);
  };

  useEffect(() => {
    getFilteredAndSortedProducts();
  }, [searchText, sortType, products]);

  return (
    <View className="bg-white/90 rounded-xl p-4 mb-4">
      <TextInput
        placeholder="Rechercher..."
        value={searchText}
        onChangeText={setSearchText}
        className="bg-gray-100 p-2 rounded-lg mb-3"
      />

      <View className="flex-row flex-wrap gap-2">
        <TouchableOpacity
          onPress={() => setSortType("price-asc")}
          className={`px-3 py-2 rounded-lg ${
            sortType === "price-asc" ? "bg-blue-500" : "bg-gray-200"
          }`}
        >
          <Text
            className={sortType === "price-asc" ? "text-white" : "text-black"}
          >
            Prix ↑
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSortType("price-desc")}
          className={`px-3 py-2 rounded-lg ${
            sortType === "price-desc" ? "bg-blue-500" : "bg-gray-200"
          }`}
        >
          <Text
            className={sortType === "price-desc" ? "text-white" : "text-black"}
          >
            Prix ↓
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSortType("name")}
          className={`px-3 py-2 rounded-lg ${
            sortType === "name" ? "bg-blue-500" : "bg-gray-200"
          }`}
        >
          <Text className={sortType === "name" ? "text-white" : "text-black"}>
            A-Z
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSortType("quantity")}
          className={`px-3 py-2 rounded-lg ${
            sortType === "quantity" ? "bg-blue-500" : "bg-gray-200"
          }`}
        >
          <Text
            className={sortType === "quantity" ? "text-white" : "text-black"}
          >
            Stock
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FilterSortUtils;
