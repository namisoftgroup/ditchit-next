import { getRoom } from "@/features/chat/service";
import { getQuestions } from "@/services/getChatQuestions";
import RoomHeader from "@/features/chat/components/RoomHeader";
import MessagesContainer from "@/features/chat/components/MessagesContainer";
import ChatForm from "@/features/chat/components/ChatForm";

interface PageProps {
  params: Promise<{
    roomId: string;
    locale: string;
  }>;
}

export default async function page({ params }: PageProps) {
  const id = (await params).roomId;
  const { locale } = await params;

  const { data: questions } = await getQuestions(locale);

  const {
    data: { messages, room },
  } = await getRoom(id);

  return (
    <div className="w-full h-[673px] flex flex-col rounded-[14px] bg-[linear-gradient(rgba(222,222,222,0.92),rgba(243,243,243,0.91)),url('https://www.shutterstock.com/image-vector/social-media-sketch-vector-seamless-600nw-1660950727.jpg')] bg-center">
      <RoomHeader room={room} />
      <MessagesContainer
        initialMessages={messages}
        roomId={room.id}
        otherUserId={room.another_user_id}
      />
      <ChatForm roomId={room.id} questions={questions} />
    </div>
  );
}
