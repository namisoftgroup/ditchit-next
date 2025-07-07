import { Post } from "@/types/post";

export interface listingResponse {
  data: Post[];
  message: string;
  code: number;
}

export interface PostsFilterPayload {
  category_id: string | null;
  page: number;
  sort: string | null;
}
