import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Product } from "@/app/utils/interface";

interface ProductItemProps {
  product: Product;
}

const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
  const router = useRouter();
  const totalStock = product.stocks?.reduce(
    (total, stock) => total + stock.quantity,
    0
  );

  const stockStatusColor =
    totalStock === 0
      ? "text-red-500"
      : totalStock < 10
      ? "text-yellow-500"
      : "text-green-500";

  return (
    <View className="bg-white/90 rounded-xl shadow-sm overflow-hidden">
      <View className="flex-row">
        <View className="w-40 h-40 p-2">
          <Image
            source={{ uri: product.image }}
            className="w-full h-full"
            resizeMode="contain"
          />
        </View>
        <View className="flex-1 p-3">
          <Text className="text-lg font-bold text-gray-800 mb-2">
            {product.name}
          </Text>
          <View className="bg-gray-100/70 px-3 py-1 rounded-full w-fit mb-2">
            <Text className="text-gray-700">🏷️ {product.type}</Text>
          </View>
          <View className="bg-gray-100/70 px-3 py-1 rounded-lg w-fit mb-2">
            <Text className="text-gray-800 font-medium">
              💰 {product.price} DH
            </Text>
          </View>
          <View className="space-y-2">
            <Text
              className={`${stockStatusColor} font-medium bg-gray-100/70 px-3 py-1 rounded-lg w-fit`}
            >
              📦 {totalStock} unités
            </Text>
            {product.solde && (
              <View className="bg-green-100/70 px-3 py-1 rounded-lg w-fit">
                <Text className="text-green-700 font-medium">
                  Solde: {product.solde} DH
                </Text>
              </View>
            )}
            <TouchableOpacity
              className="bg-blue-500/90 px-4 py-2 rounded-lg w-fit"
              onPress={() => router.push(`/(products)/${product.id}` as any)}
            >
              <Text className="text-white font-medium">Détails</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ProductItem;
