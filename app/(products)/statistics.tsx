import { View, Text } from "react-native";

export default function StatisticsScreen() {
  return (
    <View className="flex-1 items-center bg-gray-100 p-5">
      <Text className="text-2xl font-bold mb-5">📊 Statistics</Text>

      <View className="w-11/12 bg-white p-4 my-2 rounded-xl shadow-md items-center">
        <Text className="text-lg font-semibold text-gray-600">
          Total Products
        </Text>
        <Text className="text-2xl font-bold text-gray-800">120</Text>
      </View>

      <View className="w-11/12 bg-white p-4 my-2 rounded-xl shadow-md items-center">
        <Text className="text-lg font-semibold text-gray-600">Total Sales</Text>
        <Text className="text-2xl font-bold text-green-600">$5,420</Text>
      </View>

      <View className="w-11/12 bg-white p-4 my-2 rounded-xl shadow-md items-center">
        <Text className="text-lg font-semibold text-gray-600">Users</Text>
        <Text className="text-2xl font-bold text-blue-600">342</Text>
      </View>
    </View>
  );
}
