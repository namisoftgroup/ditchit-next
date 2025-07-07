import { Post } from "@/types/post";

export interface listingResponse {
  data: Post[];
  message: string;
  code: number;
}
