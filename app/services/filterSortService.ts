import { Product } from "../utils/interface";

export const filterAndSortProducts = (
  products: Product[],
  searchText: string,
  sortType: string
): Product[] => {
  let result = [...products];

  if (searchText) {
    result = result.filter(
      (item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.type.toLowerCase().includes(searchText.toLowerCase()) ||
        item.supplier?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.price.toString().includes(searchText)
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

  return result;
};
