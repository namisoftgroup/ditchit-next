export interface ProductDetailsResponse {
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

export interface User {
  id: number;
  name: string;
  phone?: string;
  phoneCode: string;
  email: string;
  image: string;
  address: string;
  zipCode: number;
  latitude: number;
  longitude: number;
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
