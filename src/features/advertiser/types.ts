import { Post } from "@/types/post";
import { User } from "@/types/user";

export interface advertiserResponse {
  data: {
    posts: Post[];
    user: {
      user: User;
    };
  };
  message: string;
  code: number;
}
