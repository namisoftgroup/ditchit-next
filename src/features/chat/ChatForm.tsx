import {
  CircleQuestionMark,
  HandCoins,
  MapPinPlus,
  Mic,
  Paperclip,
  Send,
} from "lucide-react";

export default function ChatForm() {
  return (
    <div className="w-full flex flex-col gap-2 p-2">
      <div className="flex bg-white rounded-[12px] p-2 text-center relative gap-2">
        <button className="text-[14px] flex-1 flex items-center justify-center gap-2 p-2 border-none">
          <CircleQuestionMark width={18} height={18} />
          Questions
        </button>

        <span className="block w-px h-full bg-[var(--lightBorderColor)]" />

        <button className="text-[14px] flex-1 flex items-center justify-center gap-2 p-2 border-none">
         <HandCoins width={18} height={18}/>
          Make Offer
        </button>
      </div>

      <form className="flex gap-2">
        <div className="bg-white p-2 w-full rounded-[12px] flex gap-1 items-center">
          <input
            className="w-full h-full p-1 placeholder:text-[14px] placeholder:text-[#777] outline-none"
            type="text"
            id="text-message"
            name="text-message"
            placeholder="write here..."
          />

          <label className="p-1 cursor-pointer" htmlFor="file">
            <input type="file" name="file" id="file" className="hidden" />
            <Paperclip />
          </label>

          <span className="p-1 cursor-pointer">
            <MapPinPlus />
          </span>

          <span className="p-1 cursor-pointer">
            <Mic />
          </span>
        </div>

        <button
          className="p-4 rounded-[12px] bg-[var(--mainColor)] text-white"
          type="submit"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
