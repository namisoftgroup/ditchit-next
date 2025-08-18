import { getChatRooms } from "@/features/chat/service";
import ChatsSidebar from "@/features/chat/components/ChatsSidebar";
import NoDataPlaceHolder from "@/components/shared/NoDataPlaceHolder";

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: rooms } = await getChatRooms();

  return (
    <section className="container py-6 flex gap-8">
      {rooms.length > 0 ? (
        <div className="flex flex-wrap -mx-2 justify-center w-full">
          <div className="p-2 w-full md:w-5/12 lg:w-4/12 xl:w-3/12">
            <ChatsSidebar />
          </div>

          <div className="p-2 w-full md:w-7/12 lg:w-8/12 xl:w-9/12">
            {children}
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col justify-center items-center">
          <NoDataPlaceHolder />
          <p className="text-center text-gray-600 mt-4 md:max-w-md mb-7">
            No chat conversations found. Start a conversation from any post to
            see your chats appear here.
          </p>
        </div>
      )}
    </section>
  );
}
