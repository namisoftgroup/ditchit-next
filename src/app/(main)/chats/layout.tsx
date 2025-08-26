import { getChatRooms } from "@/features/chat/service";
import ChatLayout from "@/features/chat/components/ChatLayout";

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: rooms } = await getChatRooms();

  return <ChatLayout rooms={rooms}>{children}</ChatLayout>;
}
