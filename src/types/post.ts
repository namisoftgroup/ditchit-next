export interface Post {
  id: number;
  type: string;
  condition: "new" | "used";
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
  is_promoted: boolean;
  old_promote: boolean;
  promote_expire: string | null;
  is_love: boolean;
  distance: number;
  views: number;
  date: string;
  time: string;
  publishing_duration: string;
}
