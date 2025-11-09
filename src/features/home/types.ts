import { Post } from "@/types/post";

export interface CategoryResponse {
  data: {
    slider: unknown[];
    posts: Category[];
  };
  message: string;
  code: number;
}

export interface Category {
  title: string;
  type: "category";
  value: number;
  posts: Post[];
}

export interface HomeFilterInterface {
  longitude: string | null;
  latitude: string | null;
  kilometers: string | null;
  delivery_method: string | null;
  user_id: number | null;
  country_id: number | null;
}
