import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { DProduct } from "../utils/interface";
import { apiUrl } from "../utils/constants";

const StatisticsScreen = () => {
  const [products, setProducts] = useState<DProduct[]>([]);
  const [recentProducts, setRecentProducts] = useState<DProduct[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<DProduct[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${apiUrl}/products`);
        const data = await response.data;
        setProducts(data);
        const sortedRecentProducts = data
          .sort((a: any, b: any) => b.id - a.id)
          .slice(0, 3);
        setRecentProducts(sortedRecentProducts);
        const sortedByQuantity = data
          .map((product: DProduct) => ({
            ...product,
            totalQuantity: product.stocks.reduce(
              (total, stock) => total + stock.quantity,
              0
            ),
          }))
          .sort((a: any, b: any) => a.totalQuantity - b.totalQuantity)
          .slice(0, 3);
        setLowStockProducts(sortedByQuantity);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const calculateStats = () => {
    const cities = new Set();
    products.forEach((product) => {
      product.stocks.forEach((stock) => {
        cities.add(stock.localisation.city);
      });
    });

    let totalValue = 0;
    products.forEach((product) => {
      product.stocks.forEach((stock) => {
        totalValue += stock.quantity * product.price;
      });
    });

    const outOfStock = products.filter(
      (product) =>
        product.stocks.length === 0 ||
        product.stocks.every((stock) => stock.quantity === 0)
    ).length;

    return {
      totalProducts: products.length,
      totalCities: cities.size,
      outOfStock,
      totalValue,
    };
  };

  const stats = calculateStats();

  const StatCard = ({
    title,
    value,
  }: {
    title: string;
    value: string | number;
  }) => (
    <View className="bg-white p-4 rounded-xl shadow-sm flex-1 mx-2">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-gray-600 text-sm">{title}</Text>
      </View>
      <Text className="text-xl font-bold">{value}</Text>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        <View className="p-4">
          <Text className="text-2xl font-bold mb-6">
            Statistiques des Stocks
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-4"
          >
            <StatCard title="Total Produits" value={stats.totalProducts} />
            <StatCard title="Villes Couvertes" value={stats.totalCities} />
          </ScrollView>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-4"
          >
            <StatCard title="Ruptures de Stock" value={stats.outOfStock} />
            <StatCard title="Valeur Totale" value={`${stats.totalValue} DH`} />
          </ScrollView>

          <View className="bg-white rounded-xl p-4 mt-4">
            <Text className="text-lg font-semibold mb-4">
              3 Derniers Produits
            </Text>

            <FlatList
              data={recentProducts}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View className="border-b border-gray-100 py-3">
                  <View className="flex-row justify-between">
                    <View className="flex-1">
                      <Text className="font-medium">{item.name}</Text>
                      <Text className="text-gray-500 text-sm">{item.type}</Text>
                    </View>
                    <View className="items-end">
                      <Text className="font-medium">{item.price} DH</Text>
                      <Text className="text-gray-500 text-sm">
                        Stock:{" "}
                        {item.stocks.reduce(
                          (total, stock) => total + stock.quantity,
                          0
                        )}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            />
          </View>
          <View className="bg-white rounded-xl p-4 mt-4">
            <Text className="text-lg font-semibold mb-4">
              Produits avec le Moins de Stock
            </Text>

            <FlatList
              data={lowStockProducts}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View className="border-b border-gray-100 py-3">
                  <View className="flex-row justify-between">
                    <View className="flex-1">
                      <Text className="font-medium">{item.name}</Text>
                      <Text className="text-gray-500 text-sm">{item.type}</Text>
                    </View>
                    <View className="items-end">
                      <Text className="font-medium">{item.price} DH</Text>
                      <Text className="text-gray-500 text-sm">
                        Stock:{" "}
                        {item.stocks.reduce(
                          (total, stock) => total + stock.quantity,
                          0
                        )}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default StatisticsScreen;
