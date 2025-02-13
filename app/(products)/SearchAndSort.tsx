import React, { useEffect, useState } from "react";
import { View, TextInput, TouchableOpacity, Text } from "react-native";
import { FilterSortUtilsProps } from "../utils/interface";
import { filterAndSortProducts } from "../services/filterSortService";

const FilterSortUtils: React.FC<FilterSortUtilsProps> = ({
  products,
  onFilteredProducts,
}) => {
  const [searchText, setSearchText] = useState("");
  const [sortType, setSortType] = useState("");

  useEffect(() => {
    const filteredProducts = filterAndSortProducts(
      products,
      searchText,
      sortType
    );

    onFilteredProducts(filteredProducts);
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
        <View className="flex-row flex-wrap gap-2">
          {[
            { type: "price-asc", label: "Prix ↑" },
            { type: "price-desc", label: "Prix ↓" },
            { type: "name", label: "A-Z" },
            { type: "quantity", label: "Stock" },
          ].map(({ type, label }) => (
            <TouchableOpacity
              key={type}
              onPress={() => setSortType(type)}
              className={`px-3 py-2 rounded-lg ${
                sortType === type ? "bg-blue-500" : "bg-gray-200"
              }`}
            >
              <Text className={sortType === type ? "text-white" : "text-black"}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

export default FilterSortUtils;
