export interface Product {
  id: number;
  name: string;
  type: string;
  price: number;
  solde?: number;
  image: string;
  stocks: { quantity: number }[];
}

export interface Localisation {
  city: string;
  latitude: number;
  longitude: number;
}

export interface Stock {
  id: number;
  name: string;
  quantity: number;
  localisation: Localisation;
}

export interface EditHistory {
  warehousemanId: string;
  at: string;
}
export interface DProduct {
  id: string;
  name: string;
  type: string;
  barcode: string;
  price: number;
  solde?: number;
  supplier: string;
  image: string;
  stocks: {
    id: number;
    name: string;
    quantity: number;
    localisation: {
      city: string;
      latitude: number;
      longitude: number;
    };
  }[];
  editedBy: EditHistory[];

  quantity: number;
}
