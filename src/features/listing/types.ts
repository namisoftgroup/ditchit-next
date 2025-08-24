import { Post } from "@/types/post";

export interface listingResponse {
  data: Post[];
  message: string;
  code: number;
}

export interface PostsFilterPayload {
  category_id: string | null;
  page: number;
  search: string | null;
  sort: string | null;
  price_from: string | null;
  price_to: string | null;
  condition: string | null;
}
