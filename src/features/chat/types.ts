import { Post } from "@/types/post";
import { User } from "@/types/user";

export interface Room {
  another_user: {
    user: User;
  };
  owner: {
    user: User;
  };
  user: {
    user: User;
  };
  another_user_id: number;
  count_not_read: number;
  id: number;
  is_sold: boolean;
  latest_message: LatestMessage;
  not_read: boolean;
  owner_id: number;
  post: Post;
  post_id: number;
  user_id: number;
}

export interface LatestMessage {
  sender: {
    user: User;
  };
  date: string;
  duration: string;
  files: ChatFile[];
  id: number;
  room_id: number;
  sender_id: number;
  message: string;
  type: string;
  timestamp: number;
  time: string;
}

export interface ChatFile {
  id: number;
  message_id: number;
  file: string;
  ext: string;
  type: string;
  name: string;
  size: string;
}
