import axios from "axios";
import { DProduct, Product } from "../utils/interface";
import { apiUrl } from "../utils/constants";
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await axios.get(`${apiUrl}/products`);
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};
export const fetchProductDetails = async (id: number): Promise<DProduct> => {
  try {
    const response = await axios.get(`${apiUrl}/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product details:", error);
    throw error;
  }
};
export const updateProductStock = async (updatedProducts: DProduct) => {
  try {
    await axios.post(`${apiUrl}/products`, updatedProducts);
  } catch (error) {
    console.error("Error on updating the product:", error);
    throw error;
  }
};
