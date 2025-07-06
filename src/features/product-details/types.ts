export interface productResponse {
  id: number;
  type: string;
  condition: string;
  user_id: number;
  user: {
    user: {
      id: number;
      name: string;
      phone: string | null;
      phone_code: string;
      email: string;
      image: string;
      address: string;
      zip_code: number;
      latitude: number;
      longitude: number;
    };
  };
  category_id: number;
  category: {
    id: number;
    title: string;
    image: string;
    is_condition: boolean;
    options: unknown[];
  };
  title: string;
  description: string;
  image: string;
  zip_code: string;
  address: string;
  latitude: number;
  longitude: number;
  price: number;
  firm_price: boolean;
  virtual_tour: boolean;
  is_promoted: boolean;
  old_promote: boolean;
  promote_expire: string;
  is_sold: boolean;
  delivery_method: string;
  is_love: boolean;
  images: string[]; // Assuming it's an array of image URLs or file names
  options: unknown[]; // Again, refine if structure is known
  distance: number;
  features: unknown[]; // Refine if structure is known
  views: number;
  date: string; // Format: YYYY-MM-DD
  time: string; // Format: hh:mm AM/PM
  publishing_duration: string;
}
