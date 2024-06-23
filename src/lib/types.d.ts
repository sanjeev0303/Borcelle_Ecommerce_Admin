export type CollectionType = {
  _id: string;
  title: string;
  description: string; // Fixed the typo from 'descirption' to 'description'
  image: string;
  products: ProductType[];
}

export type ProductType = {
  _id: string;
  title: string;
  description: string;
  media: string[]; // Changed from [string] to string[]
  category: string;
  collections: CollectionType[]; // Changed from [CollectionType] to CollectionType[]
  tags: string[]; // Changed from [string] to string[]
  sizes: string[]; // Changed from [string] to string[]
  colors: string[]; // Changed from [string] to string[]
  price: number;
  expense: number;
  createdAt: Date;
  updatedAt: Date;
}

export type OrderColumnType = {
  _id: string;
  customer: string;
  products: number;
  totalAmount: number;
  createdAt: string;
}

export type OrderItemType = {
  product: ProductType;
  color: string;
  size: string;
  quantity: number;
}

export type CustomerType = {
  clerkId: string;
  name: string;
  email: string;
}