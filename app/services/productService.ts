import axios from "axios";
import { DProduct, Product, ProductForm } from "../utils/interface";
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
export const updateProductStock = async (
  productId: number,
  newQuantity: number
) => {
  try {
    await axios.patch(`${apiUrl}/products/${productId}`, {
      quantity: newQuantity,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du stock:", error);
    throw error;
  }
};

export const addProduct = async (
  formData: ProductForm,
  availableStocks: any[],
  userId: string
) => {
  if (
    !formData.name ||
    !formData.type ||
    !formData.barcode ||
    !formData.price ||
    !formData.supplier ||
    !formData.image
  ) {
    throw new Error("All fields are required except Solde!");
  }
  if (!userId) {
    throw new Error("User not authenticated!");
  }
  try {
    const products = await fetchProducts();
    const nextId = Math.max(...products.map((p: any) => p.id)) + 1;

    const stocks =
      formData.selectedStock !== "none" && formData.quantity
        ? availableStocks
            .filter((stock) => stock.id.toString() === formData.selectedStock)
            .map((stock) => ({
              ...stock,
              quantity: parseInt(formData.quantity),
            }))
        : [];

    const newProduct = {
      id: String(nextId),
      name: formData.name,
      type: formData.type,
      barcode: formData.barcode,
      price: parseFloat(formData.price),
      solde: formData.solde ? parseFloat(formData.solde) : undefined,
      supplier: formData.supplier,
      image: formData.image,
      stocks,
      editedBy: [
        { warehousemanId: userId, at: new Date().toISOString().split("T")[0] },
      ],
    };

    await axios.post(`${apiUrl}/products`, newProduct);
    return newProduct;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};
