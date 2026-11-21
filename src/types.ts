export type Restaurant = {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  image: string;
  priceForTwo: number;
  offer: string;
  address: string;
  dineout: boolean;
};

export type MenuItem = {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  vegetarian: boolean;
  image: string;
};

export type OrderItem = {
  menuItemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
};

export type Order = {
  id: string;
  customerName: string;
  email: string;
  address: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: "payment_pending" | "confirmed";
  createdAt: string;
};

export type Payment = {
  id: string;
  orderId: string;
  amount: number;
  method: "dummy-card";
  status: "created" | "paid";
  createdAt: string;
};

export type Reservation = {
  id: string;
  restaurantId: string;
  name: string;
  phone: string;
  guests: number;
  date: string;
  time: string;
  status: "confirmed";
  createdAt: string;
};
