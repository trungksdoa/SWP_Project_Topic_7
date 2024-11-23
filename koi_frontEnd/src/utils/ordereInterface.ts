interface OrderItem {
  id: number;
  productId: {
    id: number;
    name: string;
    price: number;
    description: string;
    imageUrl: string;
    stock: number;
    categoryId: number;
    slug: string;
    disabled: boolean;
    createdAt: string;
    updatedAt: string;
    averageRating: number;
  };
  quantity: number;
  unitPrice: number;
  createdAt: string;
  updatedAt: string;
}
interface Order {
  id: number;
  fullName: string;
  address: string;
  phone: string;
  userId: number;
  totalAmount: number;
  status: string;
  items: OrderItem[];
  responseFromAdmin: null | string;
  createdAt: string;
  updatedAt: string;
  isFeedback: boolean;
}

export { Order, OrderItem };
