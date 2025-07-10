import { User } from "@/types/user";

export interface PostDetailsResponse {
  id: number;
  type: string;
  condition: string;
  userId: number;
  user: {
    user: User;
  };
  categoryId: number;
  category: Category;
  title: string;
  description: string;
  image: string;
  zipCode: string;
  address: string;
  latitude: number;
  longitude: number;
  price: number;
  firmPrice: boolean;
  virtualTour: boolean;
  isPromoted: boolean;
  oldPromote: boolean;
  promoteExpire: string;
  isSold: boolean;
  deliveryMethod: string;
  isLove: boolean;
  images: Images[];
  options: Option[];
  distance: number;
  features: Feature[];
  views: number;
  date: string;
  time: string;
  firm_price: boolean;
  delivery_method: string;
  publishingDuration: string;
}

export interface Category {
  id: number;
  title: string;
  image: string;
  isCondition: boolean;
  options: unknown[];
}

export interface Option {
  id: number;
  title: string;
  value: string | number;
  category_option: {
    title: string;
  };
  category_option_id: number;
}

export interface Feature {
  id: number;
  title: string;
  value: string | number;
}

export interface Images {
  id: number;
  image: string;
}
