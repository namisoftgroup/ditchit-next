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
